export const IMAGEKIT_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB free-tier upload limit

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  url: string;
  filePath: string;
  fileType: string;
  height?: number;
  width?: number;
  size: number;
  thumbnailUrl?: string;
}

export interface UploadOptions {
  projectId: string;
  fileName?: string;
  folder?: string;
  onProgress?: (progressPercent: number) => void;
}

/**
 * Format bytes to readable string (e.g. 14.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Uploads a file directly to ImageKit.io with real-time progress tracking,
 * enforcing authorization and the 25MB free-plan limit.
 */
export async function uploadToImageKit(
  file: File,
  options: UploadOptions
): Promise<ImageKitUploadResult> {
  const { projectId, fileName, folder, onProgress } = options;

  // 1. Enforce 25MB limit on client before initiating upload
  if (file.size > IMAGEKIT_MAX_FILE_SIZE_BYTES) {
    const sizeStr = formatFileSize(file.size);
    throw new Error(
      `File size (${sizeStr}) exceeds the ImageKit free-tier limit of 25MB. Please choose a smaller file.`
    );
  }

  // 2. Fetch secure auth parameters from our Next.js API route
  const authUrl = `/api/imagekit/auth?projectId=${encodeURIComponent(projectId)}`;
  const authRes = await fetch(authUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!authRes.ok) {
    const errData = await authRes.json().catch(() => ({}));
    throw new Error(
      errData.error || `Authentication failed with status ${authRes.status}.`
    );
  }

  const authParams = await authRes.json();
  const { token, expire, signature, publicKey } = authParams;

  if (!token || !expire || !signature || !publicKey) {
    throw new Error("Invalid authentication parameters received from server.");
  }

  // 3. Prepare FormData for ImageKit REST API
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName || file.name);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", String(expire));
  formData.append("token", token);
  formData.append("useUniqueFileName", "true");
  formData.append("folder", folder || `/projects/${projectId}`);

  // 4. Perform upload with XMLHttpRequest to monitor progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            fileId: response.fileId,
            name: response.name,
            url: response.url,
            filePath: response.filePath,
            fileType: response.fileType || file.type || "file",
            height: response.height,
            width: response.width,
            size: response.size || file.size,
            thumbnailUrl: response.thumbnailUrl,
          });
        } else {
          reject(
            new Error(
              response.message ||
                `ImageKit upload failed with HTTP status ${xhr.status}`
            )
          );
        }
      } catch (err: any) {
        reject(new Error("Failed to parse upload response from ImageKit."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during file upload to ImageKit."));
    };

    xhr.ontimeout = () => {
      reject(new Error("File upload timed out. Please try again."));
    };

    xhr.send(formData);
  });
}
