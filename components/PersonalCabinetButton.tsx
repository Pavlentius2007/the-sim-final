'use client'

import { User, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { memo } from 'react'

const PersonalCabinetButton = memo(function PersonalCabinetButton() {
  const { t } = useTranslations()
  
  return (
    <a
      href="https://thesim.in"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      <User className="w-4 h-4" />
      <span className="text-sm">{t('navigation.personalCabinet') || 'Личный кабинет'}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  )
})

export default PersonalCabinetButton
