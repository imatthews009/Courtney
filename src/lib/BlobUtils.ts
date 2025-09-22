import md5 from "md5";

export const checkBlobStorage = async (saying: string) => {
    const key = md5(saying);
    try {
        const response = await fetch(`/.netlify/functions/hello?key=${key}`);
        if (!response.ok) {
            return null;
        }
        const responseJson = await response.json();
        if (responseJson.data) {
            const blob = await fetch(`data:image/png;base64,${responseJson.data}`).then(res => res.blob());
            return URL.createObjectURL(blob);
        }
        return null;
    } catch (error) {
        console.error('Error checking blob storage:', error);
        return null;
    }
};

export const storeInBlobStorage = async (saying: string, imageData: string) => {
    const key = md5(saying);
    try {
        const response = await fetch(`/.netlify/functions/hello`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, data: imageData }),
        });
        if (!response.ok) {
            console.error('Failed to store image in blob storage');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error storing image in blob storage:', error);
        return false;
    }
}


