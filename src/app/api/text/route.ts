
import Text from "@/models/text";
import connectDB from "@/lib/dbConnect";

export async function POST(req: Request) {
    await connectDB();

    try {
        const { content, link } = await req.json();
        const normalizedLink = String(link).trim();

        if (!content || !normalizedLink) {
            return new Response(JSON.stringify({ error: 'Content and link are required' }), { status: 400 });
        }

        // Save alphanumeric code/link and expire it after 1 hour
        const newText = new Text({
            content,
            link: normalizedLink,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            code: normalizedLink,
        });
        await newText.save();
        return new Response(JSON.stringify({ link: normalizedLink }), { status: 201 });
    } catch (error) {
        console.error('Error saving text:', error);
        return new Response(JSON.stringify({ error: 'Failed to save text' }), { status: 500 });
    }
}

export async function GET(req: Request) {
    await connectDB();
    const urlObj = new URL(req.url);
    const code = urlObj.searchParams.get('code')?.trim();
    if (!code) {
        return new Response(JSON.stringify({ error: 'Code parameter is required' }), { status: 400 });
    }
    try {
        const textData = await Text.findOne({ code });
        if (!textData) {
            return new Response(JSON.stringify({ error: 'Text not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ content: textData.content, link: textData.link, code: textData.code }), { status: 200 });
    } catch (error) {
        console.error('Error retrieving text by code:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve text' }), { status: 500 });
    }
}



