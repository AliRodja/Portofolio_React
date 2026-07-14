import { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

function DescriptionModal({ title, subtitle, description, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-6 md:p-8 shadow-2xl animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                    <HiXMark className="text-lg" />
                </button>

                {title && (
                    <h3 className="text-xl font-bold text-white pr-10 leading-snug">
                        {title}
                    </h3>
                )}

                {subtitle && (
                    <p className="mt-1 text-slate-400 font-medium">
                        {subtitle}
                    </p>
                )}

                <p className="mt-4 text-slate-300 leading-7 whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>,
        document.body
    );
}

export default DescriptionModal;
