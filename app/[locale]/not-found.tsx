import Link from 'next/link'


export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Страница не найдена</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link 
          href="/ru" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
