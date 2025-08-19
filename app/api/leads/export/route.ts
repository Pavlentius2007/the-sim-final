import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Получаем все заявки (в реальном проекте здесь будет запрос к базе данных)
    const response = await fetch(`${request.nextUrl.origin}/api/leads`)
    const result = await response.json()
    
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    const leads = result.data

    // Создаем CSV заголовки
    const headers = [
      'ID',
      'Имя',
      'Email',
      'Телефон',
      'Telegram',
      'Статус',
      'Приоритет',
      'Источник',
      'Язык',
      'Сумма депозита ($)',
      'Назначен менеджеру',
      'Сообщение',
      'Заметки',
      'Дата создания',
      'Дата обновления'
    ]

    // Создаем CSV строки
    const csvRows = [
      headers.join(','),
      ...leads.map((lead: Record<string, unknown>) => [
        lead.id,
        `"${lead.name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.telegram || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.priority || ''}"`,
        `"${lead.source || ''}"`,
        `"${lead.language || ''}"`,
        lead.depositAmount || '',
        `"${lead.assignedTo || ''}"`,
        `"${(lead.message || '').toString().replace(/"/g, '""')}"`,
        `"${(lead.notes || '').toString().replace(/"/g, '""')}"`,
        lead.createdAt || '',
        lead.updatedAt || ''
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')

    // Возвращаем CSV файл
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (_error) {
    console.error('Error exporting leads:', _error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - экспорт с расширенными настройками
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      filters: _filters = {}, 
      format: _format = 'csv', 
      fields: _fields = [], 
      template: _template = 'default',
      includeHeaders: _includeHeaders = true,
      customHeaders: _customHeaders = {}
    } = body
    
    // Здесь можно реализовать более сложную логику экспорта
    // с сохранением шаблонов, планированием экспорта и т.д.
    
    return NextResponse.json({
      success: true,
      message: 'Export job created successfully',
      jobId: `export_${Date.now()}`,
      estimatedTime: '2-5 minutes'
    })
    
  } catch (error) {
    console.error('Error creating export job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create export job' },
      { status: 500 }
    )
  }
}

