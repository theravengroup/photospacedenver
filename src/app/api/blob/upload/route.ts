import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

/**
 * Issues short-lived client-upload tokens for the FileUpload field (driver's
 * license, COI certificate). Files upload straight from the browser to Vercel
 * Blob — bypassing the serverless body-size limit — and are stored privately;
 * the resolved URL is carried in the form and emailed to staff.
 *
 * Returns 503 until a Blob store is linked (BLOB_READ_WRITE_TOKEN unset), so
 * the rest of the form still works before storage is provisioned.
 */
export async function POST(request: Request): Promise<Response> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "File uploads aren't configured yet — please email the file or try later." }, { status: 503 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/heic", "image/webp", "application/pdf"],
        maximumSizeInBytes: 15 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return Response.json(json);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
