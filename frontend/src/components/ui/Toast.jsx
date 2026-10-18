import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiXMark } from "react-icons/hi2";

const AUTO_DISMISS_MS = 4000;
const EXIT_MS = 200;

function ToastItem({ toast, onDismiss }) {
    const [leaving, setLeaving] = useState(false);

    const close = () => setLeaving(true);

    useEffect(() => {
        const timer = setTimeout(close, AUTO_DISMISS_MS);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!leaving) return;

        const timer = setTimeout(onDismiss, EXIT_MS);

        return () => clearTimeout(timer);
    }, [leaving, onDismiss]);

    const isSuccess = toast.type === "success";

    return (
        <div
            role="alert"
            className={`
                flex items-start gap-3 w-full sm:w-96
                px-4 py-3.5 rounded-2xl
                backdrop-blur-md border shadow-2xl
                transition-all duration-200
                ${leaving ? "opacity-0 -translate-y-2 scale-95" : "animate-toast-in"}
                ${isSuccess
                    ? "bg-emerald-500/95 border-emerald-400/30 text-white"
                    : "bg-red-500/95 border-red-400/30 text-white"
                }
            `}
        >
            {isSuccess ? (
                <HiOutlineCheckCircle className="text-xl shrink-0 mt-0.5" />
            ) : (
                <HiOutlineExclamationTriangle className="text-xl shrink-0 mt-0.5" />
            )}

            <span className="text-sm font-medium leading-snug flex-1">{toast.message}</span>

            <button
                type="button"
                onClick={close}
                aria-label="Dismiss"
                className="shrink-0 -mr-1 -mt-0.5 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            >
                <HiXMark className="text-lg" />
            </button>
        </div>
    );
}

function ToastViewport({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;

    return createPortal(
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
                    <ToastItem toast={toast} onDismiss={() => onDismiss(toast.id)} />
                </div>
            ))}
        </div>,
        document.body
    );
}

export default ToastViewport;
