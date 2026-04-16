"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { emitToast, subscribeToast, type ToastPayload, type ToastVariant } from "@/lib/toast-bus";

type ToastItem = Required<Pick<ToastPayload, "id">> & ToastPayload;

type ToastContextType = {
  pushToast: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  default:
    "border-slate-200/90 bg-white/95 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)]",
  success:
    "border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-white text-emerald-950 shadow-[0_20px_50px_rgba(16,185,129,0.18)]",
  info: "border-rose-200/90 bg-gradient-to-br from-rose-50 to-white text-slate-900 shadow-[0_20px_50px_rgba(159,18,57,0.16)]",
  warning:
    "border-amber-200/90 bg-gradient-to-br from-amber-50 to-white text-amber-950 shadow-[0_20px_50px_rgba(245,158,11,0.2)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    return subscribeToast((toast) => {
      const item = toast as ToastItem;
      setToasts((prev) => [...prev, item]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 4200);
    });
  }, []);

  const pushToast = useCallback((payload: ToastPayload) => {
    emitToast(payload);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(100vw-2rem,380px)] flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur-md transition duration-300 ease-out ${variantStyles[toast.variant ?? "default"]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold leading-snug">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs leading-relaxed opacity-90">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-lg px-1.5 py-0.5 text-xs font-medium text-slate-500 transition hover:bg-black/5 hover:text-slate-800"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}
