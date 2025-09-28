import { NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';
import { getUserByLogin } from '@/lib/database';

// Next.js 15: context must be awaited
export async function POST(request: Request, contextPromise: Promise<{ params: { id: string } }>) {
  const { params } = await contextPromise;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Deal ID is required' }, { status: 400 });
  }

  try {
    // Resolve current user (temporary test implementation)
    const user = getUserByLogin('testuser');
    const currentContactId = user?.bitrix_contact_id;

    const original = await bitrixAPI.getDeal<any>(id);
    if (!original) {
      return NextResponse.json({ success: false, message: 'Original deal not found' }, { status: 404 });
    }

    // Security: ensure user owns this deal
    if (currentContactId && String(original.CONTACT_ID) !== String(currentContactId)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // Fetch product rows from original deal
    const rows = await bitrixAPI.getDealProductRows(id);

    // Prepare fields for new deal
    const newDealFields: Record<string, any> = {
      TITLE: `${original.TITLE || 'Заказ'} (повтор)`,
      CONTACT_ID: original.CONTACT_ID,
      COMPANY_ID: original.COMPANY_ID ?? undefined,
      CATEGORY_ID: original.CATEGORY_ID ?? undefined,
      CURRENCY_ID: original.CURRENCY_ID ?? 'KZT',
      ASSIGNED_BY_ID: original.ASSIGNED_BY_ID ?? undefined,
      // Start stage. Adjust if your pipeline has a specific first stage id
      STAGE_ID: 'NEW',
    };

    const newDealId = await bitrixAPI.addDeal(newDealFields);
    if (!newDealId) {
      return NextResponse.json({ success: false, message: 'Failed to create new deal' }, { status: 500 });
    }

    // Copy product rows if exist
    if (rows && rows.length > 0) {
      await bitrixAPI.setDealProductRows(newDealId, rows);
    }

    // Optionally, trigger payment stage change or payment url creation here.
    // For now, just return the new deal id.
    return NextResponse.json({ success: true, newDealId });
  } catch (error) {
    console.error('POST /api/orders/[id]/repeat error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
