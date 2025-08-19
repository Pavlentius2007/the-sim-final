'use client'

import { useState, useEffect, useRef } from 'react'
import { User, LogOut } from 'lucide-react'

interface PersonalCabinetButtonProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
  onLogout: () => void
}

export default function PersonalCabinetButton({ user, onLogout }: PersonalCabinetButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
      >
        <User className="w-4 h-4 text-white" />
        <span className="text-white text-sm">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-dark-700">
            <div className="text-white text-sm font-medium">{user.name}</div>
            <div className="text-gray-400 text-xs">{user.email}</div>
            <div className="text-blue-400 text-xs mt-1">{user.role}</div>
          </div>
          
          <div className="p-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-dark-700 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
