import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByLogin, getUserByEmail } from '@/lib/database';
import { validateRegistrationForm } from '@/lib/validation';
import { bitrixAPI } from '@/lib/bitrix';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, email, password, confirmPassword } = body;

    // Валидация формы
    const validationErrors = validateRegistrationForm({
      login,
      email,
      password,
      confirmPassword
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    if (getUserByLogin(login)) {
      return NextResponse.json(
        { errors: [{ field: 'login', message: 'Пользователь с таким логином уже существует' }] },
        { status: 400 }
      );
    }

    if (getUserByEmail(email)) {
      return NextResponse.json(
        { errors: [{ field: 'email', message: 'Пользователь с таким email уже существует' }] },
        { status: 400 }
      );
    }

    // Создание контакта в Битрикс24
    const bitrixContact = await bitrixAPI.createContact(login, email);

    // Создание пользователя в БД
    const user = createUser(login, email, password, bitrixContact?.ID);

    // Устанавливаем сессионные куки, чтобы сразу быть авторизованным
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        bitrix_contact_id: user.bitrix_contact_id,
      }
    });

    res.cookies.set('session_login', user.login, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set('session_user_id', String(user.id), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
