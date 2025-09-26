import { NextRequest, NextResponse } from 'next/server';
import { getUserByLogin } from '@/lib/database';

// Мок профиль (логин: testuser)
const mockProfile = {
  login: 'testuser',
  email: 'testuser@mail.com',
  name: 'Тестовый Пользователь',
  phone: '+7 (777) 123-45-67',
  address: 'г. Алматы, ул. Абая 10',
};

export async function GET(request: NextRequest) {
  // В реальном проекте логин берется из сессии/токена
  // Здесь для теста всегда testuser
  const user = getUserByLogin('testuser');
  if (user) {
    return NextResponse.json({ success: true, user: { ...user, ...mockProfile } });
  } else {
    // Если нет в БД, возвращаем мок
    return NextResponse.json({ success: true, user: mockProfile });
  }
}

export async function PUT(request: NextRequest) {
  // Здесь можно реализовать обновление профиля (мок)
  const body = await request.json();
  // Просто возвращаем то, что прислали
  return NextResponse.json({ success: true, user: { ...mockProfile, ...body } });
}
