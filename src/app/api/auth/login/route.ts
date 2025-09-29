import { NextRequest, NextResponse } from 'next/server';
import { getUserByLogin, verifyPassword } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, password } = body || {};

    if (!login || !password) {
      return NextResponse.json({ success: false, errors: [{ field: 'general', message: 'Логин и пароль обязательны' }] }, { status: 400 });
    }

    const user = getUserByLogin(login);
    if (!user) {
      return NextResponse.json({ success: false, errors: [{ field: 'general', message: 'Неверный логин или пароль' }] }, { status: 401 });
    }

    const valid = verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, errors: [{ field: 'general', message: 'Неверный логин или пароль' }] }, { status: 401 });
    }

    // Set session cookies
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        bitrix_contact_id: user.bitrix_contact_id,
      }
    });

    // HttpOnly cookie with login to resolve current session
    res.cookies.set('session_login', user.login, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Optional: also store user id
    res.cookies.set('session_user_id', String(user.id), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, errors: [{ field: 'general', message: 'Внутренняя ошибка сервера' }] }, { status: 500 });
  }
}
