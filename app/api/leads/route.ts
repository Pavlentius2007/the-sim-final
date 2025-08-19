import { NextRequest } from 'next/server'
import { withPublicSecurity, withAuthSecurity, withValidation } from '@/lib/apiWrapper'
import { validationSchemas } from '@/lib/security'
import { createSecureResponse } from '@/lib/security'

// GET - получение списка лидов (требует аутентификации)
export async function GET(_request: NextRequest) {
  return withAuthSecurity(_request, async (_req, _user) => {
    // TODO: Получение лидов из базы данных
    const leads = [
      { id: 1, name: 'Test Lead', email: 'test@example.com', status: 'new' }
    ]
    
    return createSecureResponse({
      leads,
      count: leads.length
    })
  })
}

// POST - создание нового лида (публичный)
export async function POST(_request: NextRequest) {
  return withPublicSecurity(_request, async (_req) => {
    return withValidation(_req, validationSchemas.lead, async (validatedReq, validatedData) => {
      // TODO: Сохранение лида в базу данных
      const newLead = {
        id: Date.now(),
        ...validatedData,
        createdAt: new Date().toISOString()
      }
      
      return createSecureResponse({
        success: true,
        lead: newLead
      }, 201)
    })
  })
}

// PUT - обновление лида (требует аутентификации)
export async function PUT(_request: NextRequest) {
  return withAuthSecurity(_request, async (_req, _user) => {
    return withValidation(_req, validationSchemas.lead, async (validatedReq, validatedData) => {
      // TODO: Обновление лида в базе данных
      const updatedLead = {
        id: Date.now(),
        ...validatedData,
        updatedAt: new Date().toISOString()
      }
      
      return createSecureResponse({
        success: true,
        lead: updatedLead
      })
    })
  })
}

// DELETE - удаление лида (требует аутентификации)
export async function DELETE(_request: NextRequest) {
  return withAuthSecurity(_request, async (_req, _user) => {
    const { searchParams } = new URL(_req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return createSecureResponse({
        error: 'Lead ID is required'
      }, 400)
    }
    
    // TODO: Удаление лида из базы данных
    
    return createSecureResponse({
      success: true,
      message: 'Lead deleted successfully'
    })
  })
}

