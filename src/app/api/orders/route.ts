import { NextRequest, NextResponse } from 'next/server';
import { bitrixAPI, BitrixDeal } from '@/lib/bitrix';
import { getUserByLogin } from '@/lib/database';

export const runtime = 'nodejs';



export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const startParam = url.searchParams.get('start');
    const start = startParam ? Number(startParam) : 0;

    // Try to resolve current user (temporary approach)
    const user = getUserByLogin('testuser');
    const contactId = user?.bitrix_contact_id;

    let deals: BitrixDeal[] = [];

    if (contactId) {
      deals = await bitrixAPI.listDealsByContact(contactId, {
        start,
        select: ['ID', 'TITLE', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'STAGE_ID', 'STAGE_DESCRIPTION'],
        order: { DATE_CREATE: 'DESC' },
      });
    } else {
      
      deals = await bitrixAPI.getDeals();
    }

   
    const normalized = deals.map((d) => ({
      id: String(d.ID),
      title: d.TITLE,
      stageId: d.STAGE_ID,
      stageName: d.STAGE_DESCRIPTION ?? d.STAGE_ID,
      dateCreate: d.DATE_CREATE,
      amount: d.OPPORTUNITY ? Number(d.OPPORTUNITY) : 0,
      currency: d.CURRENCY_ID || 'KZT',
    }));

    return NextResponse.json({ success: true, deals: normalized });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
