import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./toast-context";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const iconMap: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const colorMap: Record<ToastType, string> = {
  success: "border-l-4 border-green-500 bg-white",
  error: "border-l-4 border-red-500 bg-white",
  warning: "border-l-4 border-amber-500 bg-white",
  info: "border-l-4 border-blue-500 bg-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg: string) => addToast(msg, "success"), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, "error"), [addToast]);
  const warning = useCallback((msg: string) => addToast(msg, "warning"), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg " +
              colorMap[t.type] +
              " min-w-[280px] max-w-sm"
            }
          >
            <span>{iconMap[t.type]}</span>
            <p className="text-sm font-medium text-gray-800">{t.message}</p>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}