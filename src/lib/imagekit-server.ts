import ImageKit from "@imagekit/nodejs";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

export const imagekit = new ImageKit({
  privateKey,
});

/**
 * Generate authentication parameters (token, expire, signature) for ImageKit upload.
 */
export function getImageKitAuthParams() {
  return {
    ...imagekit.helper.getAuthenticationParameters(),
    publicKey,
    urlEndpoint,
  };
}

/**
 * Delete a file permanently from ImageKit using its fileId.
 */
export async function deleteImageKitFile(fileId: string) {
  if (!fileId) return { success: false, error: "No fileId provided" };
  try {
    await imagekit.files.delete(fileId);
    return { success: true };
  } catch (err: any) {
    console.warn(`[ImageKit] Could not delete file ${fileId}:`, err?.message || err);
    return { success: false, error: err?.message || "Delete failed" };
  }
}

/**
 * Generate a secure, time-limited signed URL for private asset access.
 * Default expiration is 300 seconds (5 minutes).
 */
export function getSignedFileUrl(pathOrUrl: string, expiresInSeconds: number = 300): string {
  try {
    return imagekit.helper.buildSrc({
      urlEndpoint,
      src: pathOrUrl,
      signed: true,
      expiresIn: expiresInSeconds,
    });
  } catch (err) {
    console.error("[ImageKit] Error generating signed URL:", err);
    return pathOrUrl;
  }
}
