import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

function ActivityGallery({ images, label }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [failedUrls, setFailedUrls] = useState({});

    const validImages = Array.isArray(images)
        ? images.filter((url) => typeof url === "string" && url.trim() !== "" && !failedUrls[url])
        : [];

    const open = activeIndex !== null && activeIndex < validImages.length;

    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setActiveIndex(null);
            } else if (event.key === "ArrowRight" && validImages.length > 1) {
                setActiveIndex((prev) => (prev + 1) % validImages.length);
            } else if (event.key === "ArrowLeft" && validImages.length > 1) {
                setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, validImages.length]);

    if (validImages.length === 0) return null;

    return (
        <div className="mt-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Activity photos ({validImages.length})
            </p>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {validImages.map((url, idx) => (
                    <li key={`${url}-${idx}`}>
                        <button
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`View activity photo ${idx + 1} of ${validImages.length} for ${label}`}
                            className={`group relative block w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:border-blue-700 dark:hover:border-blue-400 active:scale-[0.99] transition ${FOCUS_RING}`}
                        >
                            <img
                                src={url}
                                alt={`${label} activity ${idx + 1}`}
                                width={320}
                                height={240}
                                loading="lazy"
                                onError={() => setFailedUrls((prev) => ({ ...prev, [url]: true }))}
                                className="w-full aspect-4/3 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </button>
                    </li>
                ))}
            </ul>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${label} activity photo ${activeIndex + 1} of ${validImages.length}`}
                    onClick={() => setActiveIndex(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 sm:p-6 animate-modal-in"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex flex-col items-center max-w-4xl w-full"
                    >
                        <div className="w-full flex items-center justify-between gap-4 mb-3 text-white">
                            <p className="text-sm font-medium truncate">
                                {label} · {activeIndex + 1} of {validImages.length}
                            </p>

                            <button
                                type="button"
                                onClick={() => setActiveIndex(null)}
                                aria-label="Close photo preview"
                                className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-colors"
                            >
                                <X aria-hidden="true" className="size-5" />
                            </button>
                        </div>

                        <div className="relative w-full flex items-center justify-center rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                            <img
                                src={validImages[activeIndex]}
                                alt={`${label} activity ${activeIndex + 1}`}
                                width={1280}
                                height={960}
                                className="max-h-[75vh] w-auto object-contain"
                            />

                            {validImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length)}
                                        aria-label="Previous activity photo"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-colors"
                                    >
                                        <ChevronLeft aria-hidden="true" className="size-5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveIndex((prev) => (prev + 1) % validImages.length)}
                                        aria-label="Next activity photo"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-colors"
                                    >
                                        <ChevronRight aria-hidden="true" className="size-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ActivityGallery;
