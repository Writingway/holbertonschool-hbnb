import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let toastIdCounter = 0

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, [])

    const addToast = useCallback((message, type = 'info', durationMs = 3500) => {
        const id = ++toastIdCounter
        setToasts((previous) => [...previous, { id, message, type }])

        window.setTimeout(() => {
            setToasts((previous) => previous.filter((toast) => toast.id !== id))
        }, durationMs)
    }, [])

    const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
    return useContext(ToastContext)
}
