export function isPdfUrl(url) {
    return typeof url === "string" && url.toLowerCase().endsWith(".pdf");
}

const CONVERTIBLE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.85;

// Re-encode JPEG and PNG uploads to WebP in the browser before uploading.
// PDFs, GIFs (which may be animated), and files already in WebP stay untouched.
export async function toWebpIfImage(file) {
    if (!file || !CONVERTIBLE_TYPES.has(file.type)) {
        return file;
    }

    if (typeof document === "undefined" || typeof createImageBitmap !== "function") {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            bitmap.close?.();
            return file;
        }

        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close?.();

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
        );

        // Safari / older WebViews that do not support image/webp encoding fall back to PNG.
        if (!blob || blob.type !== "image/webp") {
            return file;
        }

        const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
        });
    } catch {
        return file;
    }
}

