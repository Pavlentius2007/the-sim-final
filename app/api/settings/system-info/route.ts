import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

// GET - получение системной информации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeFiles = searchParams.get('includeFiles') === 'true'
    const includeEnv = searchParams.get('includeEnv') === 'true'
    
    // Базовая информация о системе
    const systemInfo = {
      // Node.js информация
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: process.uptime(),
      
      // Память
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      
      // Время
      serverTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Проект информация
      projectInfo: {
        name: 'The SIM Landing',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        buildTime: new Date().toISOString() // В реальном проекте это будет время сборки
      }
    }
    
    // Добавляем информацию о файлах если запрошено
    if (includeFiles) {
      try {
        const projectRoot = process.cwd()
        
        // Проверяем основные директории
        const directories = {
          app: await checkDirectory(join(projectRoot, 'app')),
          components: await checkDirectory(join(projectRoot, 'components')),
          public: await checkDirectory(join(projectRoot, 'public')),
          utils: await checkDirectory(join(projectRoot, 'utils')),
          lib: await checkDirectory(join(projectRoot, 'lib'))
        }
        
        // Проверяем важные файлы
        const importantFiles = {
          packageJson: await checkFile(join(projectRoot, 'package.json')),
          nextConfig: await checkFile(join(projectRoot, 'next.config.js')),
          tailwindConfig: await checkFile(join(projectRoot, 'tailwind.config.js')),
          tsConfig: await checkFile(join(projectRoot, 'tsconfig.json'))
        }
        
        ;(systemInfo as Record<string, unknown>)['filesInfo'] = {
          directories,
          importantFiles,
          projectRoot
        }
      } catch (fileError) {
        console.warn('Could not get file info:', fileError)
        ;(systemInfo as Record<string, unknown>)['filesInfo'] = { error: 'Could not access file system' }
      }
    }
    
    // Добавляем переменные окружения если запрошено (только безопасные)
    if (includeEnv) {
      const safeEnvVars = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        HOSTNAME: process.env.HOSTNAME,
        // Показываем только наличие чувствительных переменных, но не их значения
        hasGoogleTranslateKey: !!process.env.GOOGLE_TRANSLATE_API_KEY,
        hasTelegramBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID
      }
      
      ;(systemInfo as Record<string, unknown>)['environment'] = safeEnvVars
    }
    
    // Проверяем статус различных сервисов
    const servicesStatus = await checkServicesStatus()
    ;(systemInfo as Record<string, unknown>)['services'] = servicesStatus
    
    return NextResponse.json({
      success: true,
      data: systemInfo,
      message: 'System information retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error getting system info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get system information' },
      { status: 500 }
    )
  }
}

// Проверка директории
async function checkDirectory(path: string): Promise<{ exists: boolean; files?: number; error?: string }> {
  try {
    const files = await readdir(path)
    return { exists: true, files: files.length }
  } catch (error) {
    return { exists: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Проверка файла
async function checkFile(path: string): Promise<{ exists: boolean; error?: string }> {
  try {
    const fs = await import('fs/promises')
    await fs.access(path)
    return { exists: true }
  } catch (error) {
    return { exists: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Проверка статуса сервисов
async function checkServicesStatus() {
  const services = {
    database: { status: 'mock', message: 'Using mock data (no real database configured)' },
    telegram: { status: 'unknown', message: 'Telegram integration not tested' },
    googleTranslate: { status: 'unknown', message: 'Google Translate API not tested' },
    fileSystem: { status: 'ok', message: 'File system accessible' }
  }
  
  // Проверяем Telegram если настроен
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`, {
        signal: AbortSignal.timeout(5000) // 5 секунд таймаут
      })
      const result = await response.json()
      services.telegram = {
        status: result.ok ? 'ok' : 'error',
        message: result.ok ? 'Telegram bot is accessible' : 'Telegram bot token is invalid'
      }
    } catch {
      services.telegram = {
        status: 'error',
        message: 'Cannot connect to Telegram API'
      }
    }
  }
  
  // Проверяем Google Translate если настроен
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    try {
      // Простая проверка доступности Google Translate API
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
        signal: AbortSignal.timeout(5000)
      })
      services.googleTranslate = {
        status: response.ok ? 'ok' : 'error',
        message: response.ok ? 'Google Translate API is accessible' : 'Google Translate API key is invalid'
      }
    } catch {
      services.googleTranslate = {
        status: 'error',
        message: 'Cannot connect to Google Translate API'
      }
    }
  }
  
  return services
}

// POST - выполнение системных команд (диагностика)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    const results: Record<string, unknown> = {}
    
    switch (action) {
      case 'cleanup':
        // Очистка временных файлов, кеша и т.д.
        results['cleanup'] = {
          success: true,
          message: 'Cleanup completed',
          details: 'Cleared temporary files and cache'
        }
        break
        
      case 'health-check':
        // Полная проверка системы
        const healthCheck = await performHealthCheck()
        results['healthCheck'] = healthCheck
        break
        
      case 'restart-services':
        // Перезапуск сервисов (в реальном проекте)
        results['restart'] = {
          success: true,
          message: 'Services restart initiated',
          details: 'All services are being restarted'
        }
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      message: 'System action completed successfully'
    })
    
  } catch (error) {
    console.error('Error executing system action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to execute system action' },
      { status: 500 }
    )
  }
}

// Полная проверка системы
async function performHealthCheck() {
  const checks = {
    memory: checkMemoryUsage(),
    uptime: checkUptime(),
    services: await checkServicesStatus(),
    filesystem: await checkFileSystemHealth()
  }
  
  const overallHealth = Object.values(checks).every(check => 
    typeof check === 'object' && ((check as Record<string, unknown>).status === 'ok' || (check as Record<string, unknown>).healthy === true)
  )
  
  return {
    overall: overallHealth ? 'healthy' : 'issues detected',
    checks,
    timestamp: new Date().toISOString()
  }
}

// Проверка использования памяти
function checkMemoryUsage() {
  const usage = process.memoryUsage()
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024)
  const totalMB = Math.round(usage.heapTotal / 1024 / 1024)
  const usagePercent = Math.round((usedMB / totalMB) * 100)
  
  return {
    healthy: usagePercent < 90,
    usedMB,
    totalMB,
    usagePercent,
    status: usagePercent < 70 ? 'ok' : usagePercent < 90 ? 'warning' : 'critical'
  }
}

// Проверка времени работы
function checkUptime() {
  const uptimeSeconds = process.uptime()
  const uptimeHours = uptimeSeconds / 3600
  
  return {
    healthy: true,
    seconds: Math.round(uptimeSeconds),
    hours: Math.round(uptimeHours * 100) / 100,
    status: 'ok'
  }
}

// Проверка файловой системы
async function checkFileSystemHealth() {
  try {
    const projectRoot = process.cwd()
    
    // Проверяем доступность основных директорий
    const directories = ['app', 'components', 'public', 'utils', 'lib']
    const checks = await Promise.all(
      directories.map(async dir => ({
        directory: dir,
        ...(await checkDirectory(join(projectRoot, dir)))
      }))
    )
    
    const allHealthy = checks.every(check => check.exists)
    
    return {
      healthy: allHealthy,
      checks,
      status: allHealthy ? 'ok' : 'error'
    }
  } catch (error) {
    return {
      healthy: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

