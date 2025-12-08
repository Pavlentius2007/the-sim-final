'use client'

import React from 'react'
import { User } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function PersonalCabinetButton() {
  const { t } = useTranslations()
  
  return (
    <a
      href="#contact-form"
      className="group relative inline-flex items-center justify-center gap-2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 backdrop-blur-sm border-2 border-white/40"
      title={t('navigation.personalCabinet')}
      suppressHydrationWarning
    >
      {/* Иконка пользователя */}
      <User className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
    </a>
  )
}