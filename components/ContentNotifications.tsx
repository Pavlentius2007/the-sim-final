'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

interface ContentNotificationsProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function ContentNotifications({ notifications, onRemove }: ContentNotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success'
                ? 'bg-green-500/10 border-green-500 text-green-400'
                : notification.type === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-400'
                : 'bg-blue-500/10 border-blue-500 text-blue-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-400" />
            )}
            
            <span className="flex-1 text-sm font-medium">
              {notification.message}
            </span>
            
            <button
              onClick={() => onRemove(notification.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
