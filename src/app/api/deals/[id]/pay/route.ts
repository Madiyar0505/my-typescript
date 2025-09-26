import { NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';

// Next.js 15: context must be awaited
export async function POST(request: Request, contextPromise: Promise<{ params: { id: string } }>) {
  const { params } = await contextPromise;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Deal ID is required' }, { status: 400 });
  }

  if (!process.env.BITRIX_WEBHOOK_URL) {
    console.warn('BITRIX_WEBHOOK_URL is not configured. Payment processing skipped.');
    return NextResponse.json({ success: true, message: 'Webhook not configured, assuming success for mock' });
  }

  try {
    // ТЗ талабы: "Кнопка оплатить переносит сделку на этап «В работе»"
    // Bitrix24-те "В работе" статусы PREPARATION болып табылады.
    const success = await bitrixAPI.updateDealStage(id, 'PREPARATION');

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to update deal stage in Bitrix24' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing payment for deal:', id, error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}