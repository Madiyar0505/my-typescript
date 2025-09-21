import { NextRequest, NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dealId } = await params;
    
    // Переводим сделку в статус "В работе" (это означает оплачено)
    const success = await bitrixAPI.updateDealStage(dealId, 'NEW');
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Платеж успешно обработан'
      });
    } else {
      return NextResponse.json(
        { error: 'Ошибка обработки платежа' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Ошибка обработки платежа' },
      { status: 500 }
    );
  }
}
