import { NextRequest, NextResponse } from 'next/server'

// Определяем тип Lead
interface Lead {
  id: string
  name: string
  email: string
  phone: string
  telegram: string
  createdAt: string
  updatedAt: string
  source: string
  status: string
  message: string
  notes: string
  priority: string
  language: string
  depositAmount?: number
  assignedTo?: string
}

// Получаем leads из основного файла (в реальном проекте это будет БД)
let leads: Lead[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    telegram: '@ivan_petrov',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    source: 'Форма контактов',
    status: 'new',
    message: 'Интересует инвестирование в криптовалюты',
    notes: 'Потенциальный клиент из Москвы',
    priority: 'high',
    language: 'ru',
    depositAmount: undefined
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    telegram: '@maria_sidorova',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    source: 'Форма контактов',
    status: 'contacted',
    message: 'Хочу узнать больше о платформе',
    notes: 'Связались по телефону, заинтересована в демо',
    assignedTo: 'manager1',
    priority: 'medium',
    language: 'ru',
    depositAmount: undefined
  },
  {
    id: '3',
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    phone: '+7 (999) 345-67-89',
    telegram: '@alex_kozlov',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    source: 'Форма контактов',
    status: 'converted',
    message: 'Готов инвестировать',
    notes: 'Успешно зарегистрировался на платформе',
    assignedTo: 'manager2',
    priority: 'high',
    language: 'ru',
    depositAmount: 5000
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    telegram: '@john_smith',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    source: 'Landing Page',
    status: 'investor',
    message: 'Looking for investment opportunities',
    notes: 'High net worth individual from USA',
    priority: 'high',
    language: 'en',
    depositAmount: 10000
  },
  {
    id: '5',
    name: '张伟',
    email: 'zhang@example.com',
    phone: '+86 138 1234 5678',
    telegram: '@zhang_wei',
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    source: 'WeChat',
    status: 'thinking',
    message: '对数字资产投资感兴趣',
    notes: '高净值客户，需要VIP服务',
    assignedTo: 'manager3',
    priority: 'high',
    language: 'zh',
    depositAmount: undefined
  }
]

// GET - получение конкретной заявки
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const lead = leads.find(l => l.id === id)
    
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

// PUT - обновление заявки
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const leadIndex = leads.findIndex(l => l.id === id)
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    // Валидация email если он изменяется
    if (body.email && body.email !== leads[leadIndex].email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        )
      }
      
      // Проверка на дубликат email
      const existingLead = leads.find(lead => lead.email === body.email && lead.id !== id)
      if (existingLead) {
        return NextResponse.json(
          { success: false, error: 'Lead with this email already exists' },
          { status: 409 }
        )
      }
    }
    
    // Валидация статуса
    if (body.status && !['new', 'contacted', 'thinking', 'investor', 'converted', 'lost'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      )
    }
    
    // Валидация приоритета
    if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority value' },
        { status: 400 }
      )
    }
    
    // Обновление заявки
    const oldLead = { ...leads[leadIndex] }
    leads[leadIndex] = {
      ...leads[leadIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    // Логирование изменений
    const changes = []
    for (const key in body) {
      if (oldLead[key as keyof Lead] !== body[key]) {
        changes.push({
          field: key,
          oldValue: oldLead[key as keyof Lead],
          newValue: body[key]
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: leads[leadIndex],
      changes,
      message: 'Lead updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

// DELETE - удаление заявки
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const leadIndex = leads.findIndex(l => l.id === id)
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    const deletedLead = leads[leadIndex]
    leads.splice(leadIndex, 1)
    
    return NextResponse.json({
      success: true,
      data: deletedLead,
      message: 'Lead deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

// PATCH - частичное обновление заявки (для быстрых операций)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const leadIndex = leads.findIndex(l => l.id === id)
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }
    
    // Быстрое обновление только указанных полей
    const updatedFields: Record<string, unknown> = {}
    const allowedFields = ['status', 'priority', 'assignedTo', 'notes']
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatedFields[field] = body[field]
        // Безопасное обновление с проверкой типа
        if (field === 'status' && typeof body[field] === 'string') {
          leads[leadIndex].status = body[field] as string
        } else if (field === 'priority' && typeof body[field] === 'string') {
          leads[leadIndex].priority = body[field] as string
        } else if (field === 'assignedTo' && typeof body[field] === 'string') {
          leads[leadIndex].assignedTo = body[field] as string
        } else if (field === 'notes' && typeof body[field] === 'string') {
          leads[leadIndex].notes = body[field] as string
        }
      }
    }
    
    leads[leadIndex].updatedAt = new Date().toISOString()
    
    return NextResponse.json({
      success: true,
      data: leads[leadIndex],
      updatedFields,
      message: 'Lead updated successfully'
    })
    
  } catch (error) {
    console.error('Error patching lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to patch lead' },
      { status: 500 }
    )
  }
}

