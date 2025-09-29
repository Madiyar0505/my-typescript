import { NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';
import { getUserByLogin } from '@/lib/database';

interface BitrixDealDetails {
  ID: string;
  TITLE?: string;
  CONTACT_ID?: string | number | null;
  COMPANY_ID?: string | number | null;
  CATEGORY_ID?: string | number | null;
  CURRENCY_ID?: string | null;
  ASSIGNED_BY_ID?: string | number | null;
}

type DealCreateFields = {
  TITLE: string;
  CONTACT_ID?: string | number;
  COMPANY_ID?: string | number;
  CATEGORY_ID?: string | number;
  CURRENCY_ID?: string | null;
  ASSIGNED_BY_ID?: string | number;
  STAGE_ID?: string;
};

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

    const original = await bitrixAPI.getDeal<BitrixDealDetails>(id);
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
    const newDealFields: DealCreateFields = {
      TITLE: `${original.TITLE || 'Заказ'} (повтор)`,
      CONTACT_ID: original.CONTACT_ID ?? undefined,
      COMPANY_ID: original.COMPANY_ID ?? undefined,
      CATEGORY_ID: original.CATEGORY_ID ?? undefined,
      CURRENCY_ID: (original.CURRENCY_ID as string | null) ?? 'KZT',
      ASSIGNED_BY_ID: original.ASSIGNED_BY_ID ?? undefined,
      // Start stage. Adjust if your pipeline has a specific first stage id
      STAGE_ID: 'NEW',
    };

    const newDealId = await bitrixAPI.addDeal(newDealFields as Record<string, any>);
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
  } catch (error: unknown) {
  console.error('GET /api/orders error:', error);
  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
}
