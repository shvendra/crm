import { toast as sonnerToast } from "sonner";

const toast = Object.assign(
  (message, options) => sonnerToast(message, options),
  {
    success: (message, options = {}) =>
      sonnerToast.success(message, {
        ...options,
        style: {
          background: "#16a34a",
          color: "#fff",
          border: "1px solid #15803d",
          ...(options.style || {}),
        },
      }),

    error: (message, options = {}) =>
      sonnerToast.error(message, {
        ...options,
        style: {
          background: "#dc2626",
          color: "#fff",
          border: "1px solid #b91c1c",
          ...(options.style || {}),
        },
      }),

    warning: (message, options = {}) =>
      sonnerToast.warning(message, {
        ...options,
        style: {
          background: "#f59e0b",
          color: "#111827",
          border: "1px solid #d97706",
          ...(options.style || {}),
        },
      }),

    info: (message, options = {}) =>
      sonnerToast.info(message, {
        ...options,
        style: {
          background: "#2563eb",
          color: "#fff",
          border: "1px solid #1d4ed8",
          ...(options.style || {}),
        },
      }),

    loading: (message, options = {}) =>
      sonnerToast.loading(message, options),

    promise: (promise, options) => sonnerToast.promise(promise, options),
    dismiss: (id) => sonnerToast.dismiss(id),
  }
);

export default toast;
export { toast };