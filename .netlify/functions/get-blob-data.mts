import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  return new Response("Hello, world!")
}
// import { Handler } from '@netlify/functions'
// import { getStore } from '@netlify/blobs'

// export default async (req, context) => {
//   const store = getStore('courtney-images')
  
//   try {
//     const { action, id, imageData } = JSON.parse(req.body || '{}')

//     switch (action) {
//       case 'get':
//         const blob = await store.get(`${id}`)
//         console.log('blob data:', blob)
//         return {
//           statusCode: 200,
//           body: JSON.stringify({ data: blob })
//         }
      
//       case 'set':
//         await store.set(`image-${id}`, imageData)
//         return {
//           statusCode: 200,
//           body: JSON.stringify({ success: true })
//         }
      
//       default:
//         return {
//           statusCode: 400,
//           body: JSON.stringify({ error: 'Invalid action' })
//         }
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message })
//     }
//   }
// }