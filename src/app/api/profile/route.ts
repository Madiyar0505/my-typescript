import { NextRequest, NextResponse } from 'next/server';
import { getUserByLogin } from '@/lib/database';

const defaultProfile = {
  name: 'Пользователь',
  phone: '',
  address: '',
};

export async function GET(request: NextRequest) {
  // Resolve user from cookie set at login
  const loginCookie = request.cookies.get('session_login')?.value;

  if (!loginCookie) {
    // Not authenticated; return guest profile
    return NextResponse.json({ success: true, user: { login: 'Гость', email: '', ...defaultProfile } });
  }

  const user = getUserByLogin(loginCookie);
  if (!user) {
    return NextResponse.json({ success: true, user: { login: loginCookie, email: '', ...defaultProfile } });
  }

  return NextResponse.json({ success: true, user: {
    id: user.id,
    login: user.login,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    bitrix_contact_id: user.bitrix_contact_id,
  }});
}

export async function PUT(request: NextRequest) {
  // For now, just echo back changes (persisting not implemented)
  const body = await request.json();
  return NextResponse.json({ success: true, user: body });
}
