import Text from "@/models/text";
import connectDB from "@/lib/dbConnect";

// The GET function is intended to retrieve text data based on a unique link. However, the implementation is currently incomplete.

export async function GET(req: Request) {
    await connectDB();
    const urlObj = new URL(req.url);
    const link = urlObj.pathname.split('/').pop(); // Extract the link from the URL path
    const code = urlObj.searchParams.get('code'); // Get code from query param if present
    console.log('Received GET request for link:', link, 'and code:', code);

    if (!link && !code) {
        return new Response(JSON.stringify({ error: 'Link or code parameter is required' }), { status: 400 });
    }
    try {
        let textData = null;
        if (code) {
            textData = await Text.findOne({ code: Number(code) });
        } else if (link) {
            textData = await Text.findOne({ link });
        }
        if (!textData) {
            return new Response(JSON.stringify({ error: 'Text not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ content: textData.content, link: textData.link, code: textData.code }), { status: 200 });
    } catch (error) {
        console.error('Error retrieving text:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve text' }), { status: 500 });
    }

}

