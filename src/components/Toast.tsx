import { createContext, useCallback, useContext, useState } from 'react'
import { BASE_EXPLORER } from '../config/contracts'

type ToastType = 'info' | 'success' | 'error' | 'pending'

interface Toast {
  id: number
  type: ToastType
  message: string
  txHash?: string
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string, txHash?: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  addToast: () => {},
})

export const useToast = () => useContext(ToastContext)

let toastId = 0

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, txHash?: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message, txHash }])
    if (type !== 'pending') {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000)
    }
  }, [])

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const typeStyles: Record<ToastType, string> = {
    info: 'border-blue-500/50 bg-blue-900/40',
    success: 'border-green-500/50 bg-green-900/40',
    error: 'border-red-500/50 bg-red-900/40',
    pending: 'border-yellow-500/50 bg-yellow-900/40',
  }

  const typeIcons: Record<ToastType, string> = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    pending: '⏳',
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md ${typeStyles[toast.type]}`}
          >
            <span className="text-lg">{typeIcons[toast.type]}</span>
            <div className="flex-grow min-w-0">
              <p className="text-sm text-white">{toast.message}</p>
              {toast.txHash && (
                <a
                  href={`${BASE_EXPLORER}/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 underline break-all"
                >
                  View on BaseScan
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white text-lg leading-none shrink-0"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
