import { NextRequest, NextResponse } from 'next/server'
import { bitrixAPI } from '@/lib/bitrix'
import { getUserByLogin } from '@/lib/database'

interface BitrixDealDetails {
  ID: string
  TITLE?: string
  CONTACT_ID?: string | number | null
  COMPANY_ID?: string | number | null
  CATEGORY_ID?: string | number | null
  CURRENCY_ID?: string | null
  ASSIGNED_BY_ID?: string | number | null
}

type DealCreateFields = {
  TITLE: string
  CONTACT_ID?: string | number
  COMPANY_ID?: string | number
  CATEGORY_ID?: string | number
  CURRENCY_ID?: string | null
  ASSIGNED_BY_ID?: string | number
  STAGE_ID?: string
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 міндетті түрде Promise
) {
  const { id } = await context.params // 👈 await керек

  if (!id) {
    return NextResponse.json({ success: false, message: 'Deal ID is required' }, { status: 400 })
  }

  try {
    const user = getUserByLogin('testuser')
    const currentContactId = user?.bitrix_contact_id

    const original = await bitrixAPI.getDeal<BitrixDealDetails>(id)
    if (!original) {
      return NextResponse.json({ success: false, message: 'Original deal not found' }, { status: 404 })
    }

    if (currentContactId && String(original.CONTACT_ID) !== String(currentContactId)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const rows = await bitrixAPI.getDealProductRows(id)

    const newDealFields: DealCreateFields = {
      TITLE: `${original.TITLE || 'Заказ'} (повтор)`,
      CONTACT_ID: original.CONTACT_ID ?? undefined,
      COMPANY_ID: original.COMPANY_ID ?? undefined,
      CATEGORY_ID: original.CATEGORY_ID ?? undefined,
      CURRENCY_ID: (original.CURRENCY_ID as string | null) ?? 'KZT',
      ASSIGNED_BY_ID: original.ASSIGNED_BY_ID ?? undefined,
      STAGE_ID: 'NEW'
    }

    const newDealId = await bitrixAPI.addDeal(newDealFields as Record<string, unknown>)

    if (!newDealId) {
      return NextResponse.json({ success: false, message: 'Failed to create new deal' }, { status: 500 })
    }

    if (rows && rows.length > 0) {
      await bitrixAPI.setDealProductRows(newDealId, rows)
    }

    return NextResponse.json({ success: true, newDealId })
  } catch (error: unknown) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
