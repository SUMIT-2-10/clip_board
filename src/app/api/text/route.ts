
import Text from "@/models/text";
import connectDB from "@/lib/dbConnect";
import { expiresInMinutesIstIso, isExpired } from "@/lib/time";

export async function POST(req: Request) {
    await connectDB();

    try {
        const { content, link, fileUrl, fileName } = await req.json();
        const normalizedLink = String(link).trim();

        if ((!content && !fileUrl) || !normalizedLink) {
            return new Response(JSON.stringify({ error: 'Text or file and link are required' }), { status: 400 });
        }

        // Save alphanumeric code/link and expire it after 10 minutes (testing)
        const expiresAtIso = expiresInMinutesIstIso(10);

        const newText = new Text({
            content,
            link: normalizedLink,
            expiresAt: expiresAtIso,
            code: normalizedLink,
            fileUrl: fileUrl || undefined,
            fileName: fileName || undefined,
        });
        await newText.save();
        return new Response(JSON.stringify({ link: normalizedLink }), { status: 201 });
    } catch (error) {
        console.error('Error saving text:', error);
        return new Response(JSON.stringify({ error: 'Failed to save text' }), { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const urlObj = new URL(req.url);
        const code = urlObj.searchParams.get('code')?.trim();

        if (!code) {
            return new Response(JSON.stringify({ error: 'Code parameter is required' }), { status: 400 });
        }

        const textData = await Text.findOne({ code }).lean();
        if (!textData) {
            return new Response(JSON.stringify({ error: 'Text not found' }), { status: 404 });
        }
        if (isExpired(textData.expiresAt)) {
            return new Response(JSON.stringify({ error: 'This link has expired' }), { status: 410 });
        }
        return new Response(JSON.stringify({
            content: textData.content,
            link: textData.link,
            code: textData.code,
            fileUrl: textData.fileUrl || null,
            fileName: textData.fileName || null,
        }), { status: 200 });
    } catch (error) {
        console.error('Error retrieving text by code:', error);
        const message = error instanceof Error ? error.message : 'Failed to retrieve text';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}



