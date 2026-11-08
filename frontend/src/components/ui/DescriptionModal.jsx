import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function DescriptionModal({ title, subtitle, description, onClose }) {
    const titleId = useId();
    const closeButtonRef = useRef(null);

    // Callers pass an inline arrow, so onClose changes on every parent render.
    // Keep the latest one in a ref so the open/close effect below runs once.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const appRoot = document.getElementById("root");

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onCloseRef.current();
        };

        // The modal is portaled outside #root, so making #root inert keeps
        // Tab (and screen-reader browsing) inside the dialog while it is open.
        if (appRoot) appRoot.inert = true;
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        return () => {
            if (appRoot) appRoot.inert = false;
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            // Send focus back to the "Read more" button that opened it.
            previouslyFocused?.focus?.();
        };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-label={title ? undefined : "Details"}
                className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-white border border-zinc-200 p-6 md:p-8 animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 w-11 h-11 rounded-xl text-zinc-600 hover:text-ink hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-blue-700 flex items-center justify-center transition-colors"
                >
                    <X className="size-4.5" aria-hidden="true" />
                </button>

                {title && (
                    <h3 id={titleId} className="font-display text-xl font-bold text-ink pr-12 leading-snug">
                        {title}
                    </h3>
                )}

                {subtitle && (
                    <p className="mt-1 text-zinc-600 font-medium">
                        {subtitle}
                    </p>
                )}

                <p className="mt-4 text-zinc-700 leading-7 whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>,
        document.body
    );
}

export default DescriptionModal;
