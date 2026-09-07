const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

// Semua URL hasil upload berbentuk:
//   <SUPABASE_URL>/storage/v1/object/public/<BUCKET>/images/123.png
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

/**
 * Hapus satu file dari Supabase Storage berdasarkan public URL-nya.
 * Aman dipanggil dengan nilai apa pun:
 *  - null / string kosong        -> diabaikan
 *  - URL eksternal (bukan bucket) -> diabaikan
 *  - gagal hapus                  -> hanya di-log, tidak melempar error
 */
async function deleteFile(fileUrl) {
    if (!fileUrl || !fileUrl.startsWith(PUBLIC_PREFIX)) {
        return;
    }

    const objectPath = fileUrl.slice(PUBLIC_PREFIX.length);

    try {
        const res = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`,
            {
                method: "DELETE",
                headers: {
                    apikey: SUPABASE_SECRET_KEY,
                    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
                },
            }
        );

        if (!res.ok) {
            const detail = await res.text();
            console.error("Storage delete failed:", res.status, detail);
        }
    } catch (err) {
        console.error("Storage delete error:", err);
    }
}

module.exports = { deleteFile };
