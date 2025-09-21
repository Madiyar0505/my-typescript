import { NextRequest, NextResponse } from 'next/server';
import { getUserByLogin, verifyPassword } from '@/lib/database';
import { validateLoginForm } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, password } = body;

    // Валидация формы
    const validationErrors = validateLoginForm({ login, password });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Поиск пользователя
    const user = getUserByLogin(login);

    if (!user) {
      return NextResponse.json(
        { errors: [{ field: 'login', message: 'Неверный логин или пароль' }] },
        { status: 401 }
      );
    }

    // Проверка пароля
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { errors: [{ field: 'password', message: 'Неверный логин или пароль' }] },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
