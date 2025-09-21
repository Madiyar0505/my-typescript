import { NextRequest, NextResponse } from 'next/server';
import { bitrixAPI } from '@/lib/bitrix';
import { mockDeals } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    // Проверяем, настроен ли webhook URL
    if (!process.env.BITRIX_WEBHOOK_URL) {
      console.log('Битрикс24 webhook не настроен, используем моковые данные');
      return NextResponse.json({
        success: true,
        deals: mockDeals
      });
    }

    const deals = await bitrixAPI.getDeals();
    
    // Если API вернул пустой массив, используем моковые данные
    if (deals.length === 0) {
      console.log('Битрикс24 API вернул пустой результат, используем моковые данные');
      return NextResponse.json({
        success: true,
        deals: mockDeals
      });
    }
    
    return NextResponse.json({
      success: true,
      deals
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    console.log('Ошибка API Битрикс24, используем моковые данные');
    
    return NextResponse.json({
      success: true,
      deals: mockDeals
    });
  }
}
