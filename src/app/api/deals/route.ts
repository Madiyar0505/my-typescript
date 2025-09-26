import { NextRequest, NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';
import { mockDeals } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    // Проверяем, настроен ли webhook URL
    if (!process.env.BITRIX_WEBHOOK_URL) {
      return NextResponse.json({
        success: false,
        message: 'Bitrix24 webhook is not configured.'
      }, { status: 500 });
    }

    const deals = await bitrixAPI.getDeals();
    return NextResponse.json({
      success: true,
      deals
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch deals from Bitrix24.'
    }, { status: 500 });
  }
}
