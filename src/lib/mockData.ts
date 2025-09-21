// Моковые данные для тестирования без Битрикс24
import { BitrixDeal } from './bitrix';

export const mockDeals: BitrixDeal[] = [
  {
    ID: '1',
    TITLE: 'Разработка сайта',
    OPPORTUNITY: '150000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-15T10:30:00+03:00',
    STAGE_ID: 'NEW',
    STAGE_DESCRIPTION: 'Новая сделка'
  },
  {
    ID: '2',
    TITLE: 'Консультация по проекту',
    OPPORTUNITY: '25000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-14T14:20:00+03:00',
    STAGE_ID: 'PREPARATION',
    STAGE_DESCRIPTION: 'В работе'
  },
  {
    ID: '3',
    TITLE: 'Техническая поддержка',
    OPPORTUNITY: '50000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-13T09:15:00+03:00',
    STAGE_ID: 'PREPAYMENT_INVOICE',
    STAGE_DESCRIPTION: 'Ожидает оплаты'
  },
  {
    ID: '4',
    TITLE: 'Интеграция с API',
    OPPORTUNITY: '75000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-12T16:45:00+03:00',
    STAGE_ID: 'EXECUTING',
    STAGE_DESCRIPTION: 'Выполняется'
  },
  {
    ID: '5',
    TITLE: 'Аудит безопасности',
    OPPORTUNITY: '100000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-11T11:30:00+03:00',
    STAGE_ID: 'FINAL_INVOICE',
    STAGE_DESCRIPTION: 'Счет выставлен'
  },
  {
    ID: '6',
    TITLE: 'Мобильное приложение',
    OPPORTUNITY: '200000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-10T13:20:00+03:00',
    STAGE_ID: 'WON',
    STAGE_DESCRIPTION: 'Оплачена'
  },
  {
    ID: '7',
    TITLE: 'Отмененный проект',
    OPPORTUNITY: '30000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-09T08:10:00+03:00',
    STAGE_ID: 'LOSE',
    STAGE_DESCRIPTION: 'Отменена'
  },
  {
    ID: '8',
    TITLE: 'Веб-дизайн',
    OPPORTUNITY: '40000',
    CURRENCY_ID: 'RUB',
    DATE_CREATE: '2024-01-08T15:00:00+03:00',
    STAGE_ID: 'NEW',
    STAGE_DESCRIPTION: 'Новая сделка'
  }
];

export const mockOrders = [
  { id: 1, title: 'Счета на оплату для Юр. Лиц', status: 'В обработке', amount: '15,000 ₽', date: '2024-01-15', button: 'СКАЧАТЬ' },
  { id: 2, title: 'Гарантия на детали для переднего бампера', status: 'Доставлен', amount: '8,500 ₽', date: '2024-01-14', button: 'СКАЧАТЬ' },
  { id: 3, title: 'Чеки для Физ.лиц', status: 'Отменен', amount: '12,000 ₽', date: '2024-01-13', button: 'СКАЧАТЬ' },
  { id: 4, title: 'Счета на оплату для Юр. Лиц', status: 'В пути', amount: '25,000 ₽', date: '2024-01-12', button: 'СКАЧАТЬ' },
  { id: 5, title: 'Заказ #005', status: 'Ожидает оплаты', amount: '18,500 ₽', date: '2024-01-11', button: 'СКАЧАТЬ' },
  { id: 6, title: 'Заказ #006', status: 'Выполнен', amount: '30,000 ₽', date: '2024-01-10', button: 'СКАЧАТЬ' },
  { id: 7, title: 'Заказ #007', status: 'В обработке', amount: '22,000 ₽', date: '2024-01-09', button: 'СКАЧАТЬ' },
  { id: 8, title: 'Заказ #008', status: 'Доставлен', amount: '14,500 ₽', date: '2024-01-08', button: 'СКАЧАТЬ' },
];

export const mockProfile = {
  name: 'Джолдаспаев Алимжан',
  email: 'name@mail.ru',
  phone: '+7 (123) 456-78-90',
  totalOrders: 24,
  totalSpent: '450,000 ₽'
};
