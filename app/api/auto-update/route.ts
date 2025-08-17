import { NextRequest, NextResponse } from 'next/server'

// Простая конфигурация автообновления
const DEFAULT_CONFIG = {
  enabled: true,
  interval: 30 * 60 * 1000, // 30 минут
  languages: ['en', 'zh', 'th'],
  autoSave: true,
  notifyOnUpdate: true
}

// Простой статус автообновления
let autoUpdateStatus = {
  isRunning: false,
  lastUpdate: null as Date | null
}

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        status: autoUpdateStatus,
        config: DEFAULT_CONFIG
      }
    })
  } catch (error) {
    console.error('Ошибка получения статуса автообновления:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка получения статуса' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body

    switch (action) {
      case 'start':
        autoUpdateStatus.isRunning = true
        return NextResponse.json({
          success: true,
          message: 'Автоматическое обновление запущено'
        })

      case 'stop':
        autoUpdateStatus.isRunning = false
        return NextResponse.json({
          success: true,
          message: 'Автоматическое обновление остановлено'
        })

      case 'force-update':
        autoUpdateStatus.lastUpdate = new Date()
        return NextResponse.json({
          success: true,
          message: 'Принудительное обновление выполнено',
          data: {
            success: true,
            updatedKeys: [],
            newTranslations: 0,
            errors: [],
            timestamp: new Date()
          }
        })

      case 'update-config':
        if (config) {
          Object.assign(DEFAULT_CONFIG, config)
          return NextResponse.json({
            success: true,
            message: 'Конфигурация обновлена'
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'Конфигурация не предоставлена' },
            { status: 400 }
          )
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Неизвестное действие' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Ошибка выполнения действия автообновления:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка выполнения действия' },
      { status: 500 }
    )
  }
} 