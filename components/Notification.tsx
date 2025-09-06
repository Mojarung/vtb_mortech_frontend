'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useEffect } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Notification({ message, type, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${colors[type]} max-w-sm`}
    >
      <Icon size={20} />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export function NotificationContainer({ notifications, onClose }: { notifications: any[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => onClose(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
