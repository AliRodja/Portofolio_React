import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastViewport from "../components/ui/Toast";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const show = useCallback((type, message) => {
        const id = ++idCounter;

        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const toast = useMemo(() => ({
        success: (message) => show("success", message),
        error: (message) => show("error", message),
    }), [show]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

// Provider + hook in one file is the standard context pattern.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const ctx = useContext(ToastContext);

    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return ctx;
}
