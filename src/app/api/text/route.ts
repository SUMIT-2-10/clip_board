
import Text from "@/models/text";
import connectDB from "@/lib/dbConnect";

export async function POST(req: Request) {
    await connectDB();

    try {
        const { content } = await req.json();
        const link = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit link
        const newText = new Text({ content, link, expiresAt: new Date(Date.now() + 1000 * 60 * 60) , code: link}); // Set expiration to 1 hour
        await newText.save();
        return new Response(JSON.stringify({ link }), { status: 201 });
    } catch (error) {
        console.error('Error saving text:', error);
        return new Response(JSON.stringify({ error: 'Failed to save text' }), { status: 500 });
    }
}

export async function GET(req: Request) {
    await connectDB();
    const urlObj = new URL(req.url);
    const code = urlObj.searchParams.get('code');
    if (!code) {
        return new Response(JSON.stringify({ error: 'Code parameter is required' }), { status: 400 });
    }
    try {
        const textData = await Text.findOne({ code: Number(code) });
        if (!textData) {
            return new Response(JSON.stringify({ error: 'Text not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ content: textData.content, link: textData.link, code: textData.code }), { status: 200 });
    } catch (error) {
        console.error('Error retrieving text by code:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve text' }), { status: 500 });
    }
}



