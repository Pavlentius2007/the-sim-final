'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink, User } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function PersonalCabinetButton() {
  const { t } = useTranslations()
  
  return (
    <Link
      href="https://thesim.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-2 py-2 md:px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      title={t('navigation.personalCabinet')} // Добавляем tooltip для мобильных
    >
      {/* На мобильных показываем только иконку пользователя */}
      <User className="w-4 h-4 md:hidden" />
      
      {/* На десктопе показываем текст + иконку */}
      <span className="hidden md:block">{t('navigation.personalCabinet')}</span>
      <ExternalLink className="w-4 h-4 hidden md:block" />
    </Link>
  )
}