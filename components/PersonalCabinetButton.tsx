'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'

export default function PersonalCabinetButton() {
  return (
    <a
      href="https://thesim.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      <span>Личный кабинет</span>
      <ExternalLink className="w-4 h-4" />
    </a>
  )
}
