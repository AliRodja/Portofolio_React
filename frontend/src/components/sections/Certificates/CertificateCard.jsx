import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, FileText, X } from "lucide-react";
import { isPdfUrl } from "../../../utils/file";
import Reveal from "../../ui/Reveal";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

function formatIssueDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

function CertificateCard({ certificate }) {
    const [imageError, setImageError] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const isPdf = isPdfUrl(certificate.image_url);
    const hasImage = Boolean(certificate.image_url) && !isPdf && !imageError;

    useEffect(() => {
        if (!showLightbox) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowLightbox(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [showLightbox]);

    return (
        <Reveal
            as="li"
            className="flex flex-col rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-600 transition-colors duration-200 p-5 sm:p-6"
        >
            {/* Top metadata: issuer tag + issue date */}
            <div className="flex items-center justify-between gap-3">
                {certificate.issuer ? (
                    <span className="inline-block rounded-md bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 truncate">
                        {certificate.issuer}
                    </span>
                ) : (
                    <span />
                )}

                {certificate.issue_date && (
                    <time
                        dateTime={certificate.issue_date}
                        className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400"
                    >
                        {formatIssueDate(certificate.issue_date)}
                    </time>
                )}
            </div>

            {/* Optional image preview (only for image certificates, clickable to zoom) */}
            {hasImage && (
                <button
                    type="button"
                    onClick={() => setShowLightbox(true)}
                    aria-label={`View full image of ${certificate.title}`}
                    className={`group mt-4 block w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 ${FOCUS_RING}`}
                >
                    <img
                        src={certificate.image_url}
                        alt={certificate.title}
                        width={640}
                        height={384}
                        loading="lazy"
                        onError={() => setImageError(true)}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </button>
            )}

            {/* Title */}
            <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink dark:text-white">
                {certificate.title}
            </h3>

            {/* Actions */}
            {(certificate.image_url || certificate.credential_url) && (
                <div className="mt-auto pt-5 flex flex-wrap items-center gap-2.5">
                    {isPdf && (
                        <a
                            href={certificate.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                inline-flex items-center justify-center gap-2
                                min-h-11 px-3.5 rounded-lg
                                border border-zinc-300 text-sm font-medium text-ink
                                hover:border-ink hover:bg-zinc-100 active:bg-zinc-200
                                dark:border-zinc-700 dark:text-white dark:hover:border-white dark:hover:bg-zinc-800
                                transition-colors duration-200 ${FOCUS_RING}
                            `}
                        >
                            <FileText className="size-4 text-red-700 dark:text-red-400" aria-hidden="true" />
                            <span>View PDF</span>
                        </a>
                    )}

                    {hasImage && (
                        <button
                            type="button"
                            onClick={() => setShowLightbox(true)}
                            className={`
                                inline-flex items-center justify-center gap-2
                                min-h-11 px-3.5 rounded-lg
                                border border-zinc-300 text-sm font-medium text-ink
                                hover:border-ink hover:bg-zinc-100 active:bg-zinc-200
                                dark:border-zinc-700 dark:text-white dark:hover:border-white dark:hover:bg-zinc-800
                                transition-colors duration-200 ${FOCUS_RING}
                            `}
                        >
                            View image
                        </button>
                    )}

                    {certificate.credential_url && (
                        <a
                            href={certificate.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                inline-flex items-center justify-center gap-2
                                min-h-11 px-3.5 rounded-lg
                                bg-ink text-sm font-medium text-white
                                hover:bg-zinc-800 active:bg-black
                                dark:bg-white dark:text-ink dark:hover:bg-zinc-200
                                transition-colors duration-200 ${FOCUS_RING}
                            `}
                        >
                            <span>Verify</span>
                            <ExternalLink aria-hidden="true" className="size-3.5" />
                        </a>
                    )}
                </div>
            )}

            {showLightbox && createPortal(
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Certificate preview: ${certificate.title}`}
                    onClick={() => setShowLightbox(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 sm:p-6 animate-modal-in"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex flex-col items-center max-w-4xl w-full"
                    >
                        <div className="w-full flex items-center justify-between gap-4 mb-3 text-white">
                            <p className="text-sm font-medium truncate">
                                {certificate.title}
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowLightbox(false)}
                                aria-label="Close certificate preview"
                                className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-colors"
                            >
                                <X aria-hidden="true" className="size-5" />
                            </button>
                        </div>

                        <div className="relative w-full flex items-center justify-center rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                            <img
                                src={certificate.image_url}
                                alt={certificate.title}
                                width={1280}
                                height={768}
                                className="max-h-[80vh] w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </Reveal>
    );
}

export default CertificateCard;
