import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { checkBlobStorage, storeInBlobStorage } from "~/lib/BlobUtils";

export const CourtneyList = [
  "JC Derula",
  "Rice boodle",
  "Brutter",
  "My phone dong",
  "Fudge-icle",
  "Poop of bag",
  "Do you think our sharps are getting weaker?",
  "Beat the buzz",
  "He should be your worst emesis",
  "That's one of Target's stapletons",
  "Clonnie & Bydes",
  "I never had the ryhtma",
  "Look at them under the light"
].map((text, index) => ({
  id: index,
  text,
  imagePrompt: null,
}))
export type CourtneyCarouselProps = {
  id: number;
  text: string;
  imagePrompt: string | null;
}

export function CourtneyCarousel({ list }: { list: CourtneyCarouselProps[] }) {
  const [generatedImageUrls, setGeneratedImageUrls] = useState<{ [key: number]: string | null }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    const generateImages = async () => {
      setIsLoading(true);
      let tempImageUrls: { [key: number]: string | null } = {};

      try {
        // Generate images sequentially for each item
        for (const item of list) {
          if (item.imagePrompt != null) {
            const blobUrl = await checkBlobStorage(item.text);
            if (blobUrl != null) {
              tempImageUrls[item.id] = blobUrl;
            } else {
              const imageUrl = await generateImage(item) || null;
  
              tempImageUrls[item.id] = imageUrl || null;
            }
          }
        }

        setGeneratedImageUrls(tempImageUrls);
      } catch (error) {
        console.error("Error handling images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateImages();

    return () => {
      // Cleanup object URLs
      Object.values(generatedImageUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [list]);

  async function generateImage(item: CourtneyCarouselProps) {
    console.log('Generating image for:', item);
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

  return (
    <Carousel className="w-[70svw] text-2xl md:text-4xl font-semibold md:max-w-xl lg:max-w-2xl">
      <CarouselContent>
        {list.map((row, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 min-h-[60svh] gap-4">
                  <span className="text-4xl font-semibold">{row.text}</span>
                  {isLoading && row.imagePrompt && !generatedImageUrls[row.id] ? (
                    <div>Generating image...</div>
                  ) : null}
                  {row.imagePrompt && (
                    <div className="w-full max-w-md">
                      {generatedImageUrls[row.id] && (
                        <img
                          src={generatedImageUrls[row.id]!}
                          alt="AI Generated"
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious size='lg' />
      <CarouselNext size='lg' />
    </Carousel>
  )
}


