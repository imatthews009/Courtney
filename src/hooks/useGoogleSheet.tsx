import { useState, useEffect } from 'react';
import { CourtneyCarouselProps } from '../components/CourtneyCarousel';
import { Saying } from '~/components/ui/Carousel2';
import { checkBlobStorage, storeInBlobStorage } from '~/lib/BlobUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SheetData {
    values: string[][];
}

export type GoogleSheetRow = {
    id: number;
    text: string;
    imagePrompt: string | null;
    imageUrl?: string | null | undefined;
}

export function useGoogleSheet() {
    const [sheetData, setSheetData] = useState<SheetData | null>(null);
    const [list, setList] = useState<GoogleSheetRow[]>([] as unknown as GoogleSheetRow[]);
    const [error, setError] = useState<string | null>(null);

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const RANGE = 'Sheet1!A1:B30'; // Adjust range as needed

    async function generateImage(item: GoogleSheetRow) {
        // append prompt with instruction to generate an image. We want it to be silly cartoony style
        const prompt = item.imagePrompt + ' in a silly cartoony style without speech bubbles';

        // Set responseModalities to include "Image" so the model can generate
        const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                responseModalities: ["Text", "Image"]
            } as any // or as GenerationConfig
        });

        try {
            const response = await model.generateContent(prompt);
            const candidates = response.response?.candidates;
            if (!candidates || candidates.length === 0) {
                throw new Error("No response candidates received");
            }
            for (const part of candidates[0].content.parts) {
                if (part.text) {
                } else if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    storeInBlobStorage(item.text, imageData);
                    const blob = await fetch(
                        `data:${part.inlineData.mimeType};base64,${imageData}`
                    ).then(res => res.blob());
                    const imageUrl = URL.createObjectURL(blob);
                    return imageUrl;
                }
            }

        } catch (error) {
            console.error("Error generating content:", error);
        }
    }

    const buildListItemsWithImages = async (row: string[], index: number) => {
        let googleSheetRow: GoogleSheetRow = {
            id: index,
            text: row[0],
            imagePrompt: row.length > 1 ? row[1] : null,
            imageUrl: null,
        };

        // check if imageUrl is in blob store
        if (googleSheetRow.imagePrompt) {
            const blobUrl = await checkBlobStorage(googleSheetRow.text);
            if (blobUrl != null) {
                googleSheetRow.imageUrl = blobUrl;
            } else {
                const imageUrl = await generateImage(googleSheetRow) || null;
                googleSheetRow.imageUrl = imageUrl;
            }
        }
        return googleSheetRow;
    }


    const fetchSheetData = async () => {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch sheet data');
            }

            const data = await response.json();
            setSheetData(data);
            const values = data.values as string[][];
            const formattedList = await Promise.all(
                values.map((row, index) => buildListItemsWithImages(row, index))
            );
            setList(formattedList);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching sheet data:', err);
        }
    };

    const updateSheet = async (values: string[][]) => {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: values,
                        valueInputOption: 'RAW',
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update sheet');
            }

            // Refresh data after update
            fetchSheetData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error updating sheet:', err);
        }
    };

    useEffect(() => {
        fetchSheetData();
    }, []);

    return {
        list,
        error,
        updateSheet,
        fetchSheetData,
        sheetData
    };
}