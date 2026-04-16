export type ToastVariant = "default" | "success" | "info" | "warning";

export type ToastPayload = {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type Listener = (toast: Required<Pick<ToastPayload, "id">> & ToastPayload) => void;

const listeners = new Set<Listener>();

export function emitToast(payload: ToastPayload) {
  const toast = {
    ...payload,
    variant: payload.variant ?? "default",
    id: payload.id ?? crypto.randomUUID(),
  };
  listeners.forEach((listener) => listener(toast));
}

export function subscribeToast(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
