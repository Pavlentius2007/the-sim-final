import dynamic from 'next/dynamic'

const TranslationAdmin = dynamic(() => import('@/components/TranslationAdmin'), {
  ssr: false,
  loading: () => <div className="text-white">Загрузка...</div>
})

const AutoUpdateManager = dynamic(() => import('@/components/AutoUpdateManager'), {
  ssr: false,
  loading: () => <div className="text-white">Загрузка...</div>
})

const MonitoringPanel = dynamic(() => import('@/components/MonitoringPanel'), {
  ssr: false,
  loading: () => <div className="text-white">Загрузка...</div>
})

export default function AdminTranslationsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Панель управления переводами
        </h1>
        <p className="text-gray-400">
          Управление переводами, автоматическое обновление и мониторинг
        </p>
      </div>

      <div className="space-y-6">
        {/* Автоматическое обновление */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <AutoUpdateManager />
        </div>

        {/* Управление переводами */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <TranslationAdmin />
        </div>

        {/* Мониторинг системы */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <MonitoringPanel />
        </div>
      </div>
    </div>
  )
}
