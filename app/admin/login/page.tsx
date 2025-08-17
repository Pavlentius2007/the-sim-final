'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'



interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({
    username: '', // Убираем предзаполнение для продакшена
    password: '', // Убираем предзаполнение для продакшена
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Временно отключаем автоматическую проверку аутентификации
  // useEffect(() => {
  //   checkExistingAuth()
  // }, [])

  // const checkExistingAuth = async () => {
  //   try {
  //     const response = await fetch('/api/auth')
  //     const result = await response.json()
      
  //     if (result.authenticated || result.success) {
  //       // Пользователь уже авторизован, перенаправляем
  //       router.push('/admin/dashboard')
  //     }
  //   } catch (error) {
  //     // Ошибка проверки - пользователь не авторизован
  //     console.log('No existing auth found')
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.username || !form.password) {
      setError('Заполните все поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const result = await response.json()

      if (result.success) {
        // Успешный вход - перенаправляем на панель управления
        router.push('/admin/dashboard')
      } else {
        setError(result.error || 'Ошибка авторизации')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ошибка сети. Проверьте подключение.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (field === 'rememberMe') {
      setForm(prev => ({ ...prev, [field]: e.target.checked }))
    } else {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
    
    // Очищаем ошибку при изменении полей
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4">
             <Shield className="w-8 h-8 text-blue-400" />
           </div>
          <div className="flex justify-center mb-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-3 drop-shadow-lg">TheSim</div>
              <div className="text-base text-blue-400 font-medium uppercase tracking-wider">Smart Investments</div>
            </div>
          </div>
          <p className="text-gray-400">
            Вход в админ панель
          </p>
        </div>

        {/* Форма входа */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Поле имени пользователя */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя пользователя или Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={handleChange('username')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Введите имя пользователя"
                  disabled={loading}
                  autoComplete="username"
                  autoCapitalize="none"
                />
              </div>
            </div>

            {/* Поле пароля */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Введите пароль"
                  disabled={loading}
                  autoComplete="current-password"
                  autoCapitalize="none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  disabled={loading}
                  title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Запомнить меня */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange('rememberMe')}
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                Запомнить меня (30 дней)
              </label>
            </div>

            {/* Ошибка */}
            {error && (
              <div className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={loading || !form.username.trim() || !form.password.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Вход в систему...
                </div>
              ) : (
                'Войти в админ-панель'
              )}
            </button>
          </form>
        </div>

        {/* Информация о системе */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h3 className="text-blue-400 font-medium mb-2">Система безопасности:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>✅ JWT аутентификация</p>
            <p>✅ Защита от CSRF атак</p>
            <p>✅ Rate limiting</p>
            <p>✅ Валидация входных данных</p>
            <p>✅ Безопасное хранение паролей</p>
          </div>
        </div>

        {/* Футер */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>&copy; 2024 TheSim. Все права защищены.</p>
        </div>
      </div>
    </div>
  )
}





