import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const hasBitrix = Boolean(process.env.BITRIX_WEBHOOK_URL && process.env.BITRIX_WEBHOOK_URL.length > 0)
  return NextResponse.json({
    ok: true,
    BITRIX_WEBHOOK_URL_present: hasBitrix,
  })
}


