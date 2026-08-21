import connectDB from "@/lib/dbConnect";
import { supabaseServer } from "@/lib/supabase-server";
import Text from "@/models/text";
import { nowIstIso } from "@/lib/time";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return new Response("CRON_SECRET is not configured", { status: 500 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  try {
    const now = new Date();
    const nowIso = nowIstIso();

    const { data: expiredFiles, error: filesError } = await supabaseServer
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

        try {
          const url = new URL(row.file_url);
          const parts = url.pathname.split("/");

          // find bucket name
          const bucketIndex = parts.findIndex(
            (p) => p === "Clip_Board"
          );

          if (bucketIndex === -1) return null;

          // return only path inside bucket
          return parts.slice(bucketIndex + 1).join("/");
        } catch {
          return null;
        }
      })
      .filter((p): p is string => Boolean(p));

    console.log("Deleting file paths:", filePaths);


    let storageDeletedCount = 0;
    if (filePaths.length > 0) {
      const { error: storageError } = await supabaseServer.storage
        .from("Clip_Board")
        .remove(filePaths);

      if (storageError) {
        throw storageError;
      }

      storageDeletedCount = filePaths.length;
    }

    const expiredCodes = rows
      .map((row) => row.code)
      .filter((code): code is string => Boolean(code));

    let deletedClipRowsCount = 0;
    if (expiredCodes.length > 0) {
      const { data: deletedRows, error: deleteRowsError } = await supabaseServer
        .from("Clip_Board")
        .delete()
        .in("code", expiredCodes)
        .select("code");

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
