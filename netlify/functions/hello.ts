import { getStore } from "@netlify/blobs";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // if post we add the data to the blob store
    const store = getStore({
        name: "courtney-images",
        consistency: "strong",
        siteID: process.env.VITE_NETLIFY_PROJECT_ID,
        token: process.env.VITE_NETLIFY_BLOB_TOKEN,
    });
    if (event.httpMethod === "POST") {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing request body" }),
            };
        }

        const body = JSON.parse(event.body);
        if (!body.key || !body.data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing key or data in request body" }),
            };
        }
        // use the key param for the key
        await store.set(body.key, body.data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Blob data stored successfully" }),
        };
    }

    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    // For GET request, we retrieve the data from the blob store, use a key param
    const key = event.queryStringParameters?.key;
    if (!key) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing key query parameter" }),
        };
    }

    const data = await store.get(key);
    // get metadata to check age
    // const metadata = await store.getMetadata(key);
    if (data) console.log('data found');
    return {
        statusCode: 200,
        body: JSON.stringify({ 
          data,
        })
    };
};

export { handler };