import { useToast } from '../context/ToastContext'

const TOAST_STYLES = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-gray-200 bg-white text-gray-800'
}

export default function ToastViewport() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed top-4 right-4 z-[100] w-[min(92vw,360px)] space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`border rounded-xl shadow-sm px-4 py-3 text-sm font-medium ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}`}
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-start justify-between gap-3">
                        <p>{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => removeToast(toast.id)}
                            className="text-xs font-bold opacity-70 hover:opacity-100"
                            aria-label="Close notification"
                        >
                            X
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
