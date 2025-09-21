// Валидация форм
export interface ValidationError {
  field: string;
  message: string;
}

export const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (password.length < 6) {
    errors.push({ field: 'password', message: 'Пароль должен содержать минимум 6 символов' });
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Пароль должен содержать хотя бы одну заглавную букву' });
  }
  
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Пароль должен содержать хотя бы одну цифру' });
  }
  
  return errors;
};

export const validateEmail = (email: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Введите корректный email адрес' });
  }
  
  return errors;
};

export const validateLogin = (login: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (login.length < 3) {
    errors.push({ field: 'login', message: 'Логин должен содержать минимум 3 символа' });
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(login)) {
    errors.push({ field: 'login', message: 'Логин может содержать только буквы, цифры и подчеркивания' });
  }
  
  return errors;
};

export const validateRegistrationForm = (formData: {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  errors.push(...validateLogin(formData.login));
  errors.push(...validateEmail(formData.email));
  errors.push(...validatePassword(formData.password));
  
  if (formData.password !== formData.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Пароли не совпадают' });
  }
  
  return errors;
};

export const validateLoginForm = (formData: {
  login: string;
  password: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.login.trim()) {
    errors.push({ field: 'login', message: 'Введите логин' });
  }
  
  if (!formData.password.trim()) {
    errors.push({ field: 'password', message: 'Введите пароль' });
  }
  
  return errors;
};
