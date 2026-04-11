import connectDB from "@/lib/dbConnect";
import { supabase } from "@/lib/supabase";
import Text from "@/models/text";
import { nowIstIso } from "@/lib/time";

export async function GET() {
  // const auth = req.headers.get("authorization");

  // if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }
  await connectDB();

  try {
    const now = new Date();
    const nowIso = nowIstIso();

    const { data: expiredFiles, error: filesError } = await supabase
      .from("Clip_Board")
      .select("file_url, code, expire_at")
      .lt("expire_at", nowIso);

    if (filesError) {
      throw filesError;
    }

    const rows = expiredFiles ?? [];
    const filePaths = rows
      .map((row) => {
        if (!row.file_url) return null;
        const marker = "/Clip_Board/";
        const idx = row.file_url.indexOf(marker);
        if (idx === -1) return null;
        return row.file_url.slice(idx + marker.length).split("?")[0];
      })
      .filter((path): path is string => Boolean(path));

    let storageDeletedCount = 0;
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("Clip_Board")
        .remove(filePaths);

      if (storageError) {
        throw storageError;
      }

      storageDeletedCount = filePaths.length;
    }

    const expiredUrls = rows
      .map((row) => row.file_url)
      .filter((url): url is string => Boolean(url));

    let deletedClipRowsCount = 0;
    if (expiredUrls.length > 0) {
      const { data: deletedRows, error: deleteRowsError } = await supabase
        .from("Clip_Board")
        .delete()
        .in("file_url", expiredUrls)
        .select("file_url");

      if (deleteRowsError) {
        throw deleteRowsError;
      }

      deletedClipRowsCount = deletedRows?.length ?? 0;
    }

    const textDeleteResult = await Text.deleteMany({ expiresAt: { $lt: now } });
    const deletedTextsCount = textDeleteResult.deletedCount ?? 0;

    return new Response(
      JSON.stringify({
        now: now.toISOString(),
        expiredFilesFound: rows.length,
        storageDeletedCount,
        deletedClipRowsCount,
        deletedTextsCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error cleaning up expired files:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
