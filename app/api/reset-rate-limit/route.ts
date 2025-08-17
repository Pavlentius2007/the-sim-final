import { NextRequest } from 'next/server'
import { createSecureResponse } from '@/lib/security'
import { resetRateLimitCounters } from '@/lib/rateLimit'

export async function POST(_request: NextRequest) {
  try {
    // Сбрасываем счетчики rate limiting
    resetRateLimitCounters()
    
    return createSecureResponse({
      success: true,
      message: 'Rate limiting counters reset successfully'
    })
      } catch {
    return createSecureResponse({
      success: false,
      error: 'Failed to reset rate limiting counters'
    }, 500)
  }
}
