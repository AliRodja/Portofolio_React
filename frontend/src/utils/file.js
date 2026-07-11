export function isPdfUrl(url) {
    return typeof url === "string" && url.toLowerCase().endsWith(".pdf");
}
