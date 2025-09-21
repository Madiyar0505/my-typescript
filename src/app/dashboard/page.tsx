'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import Header from '@/components/Header'; // Бұл компонентті енді қолданбаймыз

// Моковые данные для заказов
const mockOrders = [
  { id: 1, title: 'Счета на оплату для Юр. Лиц', status: 'Готово', amount: '15,000 ₽', date: '2024-01-15', button: 'Скачать' },
  { id: 2, title: 'Гарантия на детали для переднего бампера', status: 'Готово', amount: '8,500 ₽', date: '2024-01-14', button: 'Скачать' },
  { id: 3, title: 'Чеки для Физ.лиц', status: 'Готово', amount: '12,000 ₽', date: '2024-01-13', button: 'Скачать' },
  { id: 4, title: 'Счета на оплату для Юр. Лиц', status: 'Готово', amount: '25,000 ₽', date: '2024-01-12', button: 'Скачать' },
];

// Моковые данные для профиля
const mockProfile = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

// Моковые данные для платежей
const mockPayments = [
  { 
    employee: 'Имя', 
    name: 'Почта@jourrapide.com', 
    status: 'Не оплачено', 
    completed: 96, 
    action: 'Смотреть' 
  },
  { 
    employee: 'Gregory Davis A', 
    name: 'gregorydavis@dayrep.com', 
    status: 'Оплачено', 
    completed: 73, 
    action: 'Смотреть' 
  },
  { 
    employee: 'Gregory Davis A', 
    name: 'gregorydavis@dayrep.com', 
    status: 'Оплачено', 
    completed: 73, 
    action: 'Смотреть' 
  },
];


export default function DashboardPage() {
  const [user, setUser] = useState(mockProfile);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* <Header /> */}
      {/* Основной контент */}
      <div className="w-full bg-white">
        {/* Бұрынғы Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          {/* Сол жақ бос */}
          <div></div>
          {/* Навигация оң жақта */}
          <div className="flex items-center space-x-12">
              <a href="/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 flex items-center h-16">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Дашборд
              </a>
              <a href="/profile/1" className="text-gray-500 hover:text-gray-700 flex items-center h-16">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Профиль
              </a>
              <a href="/orders" className="flex items-center h-16 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Заказы
              </a>
              <a href="/payments" className="text-gray-500 hover:text-gray-700 flex items-center h-16">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                Платежи
              </a>
              <a href="/dashboard#broadcast" className="text-gray-500 hover:text-gray-700 flex items-center h-16">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Трансляция
              </a>
          </div>
        </header>
        {/* Контент */}
        <main className="p-8">
          {/* Приветствие */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">
              Привет, Алим  Джолдаспаев 👋
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Блок заказов - больший */}
            <div id="orders" className="bg-white lg:col-span-2 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-blue-600 mr-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Заказы</h2>
              </div>
              
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 18,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                }}
                className="pb-10"
              >
                {mockOrders.map((order) => (
                  <SwiperSlide key={order.id}>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full shadow-sm">
                      {/* Изображение документа */}
                      <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-20 bg-white border border-gray-300 rounded mx-auto mb-2 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="w-6 h-6 bg-blue-100 rounded-full mx-auto"></div>
                        </div>
                      </div>
                      
                      {/* Информация о заказе */}
                      <div className="space-y-2 mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{order.title}</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${order.status === 'В обработке' ? 'bg-blue-500' : order.status === 'Доставлен' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs text-gray-500">{order.status}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      
                      {/* Кнопка СКАЧАТЬ */}
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{order.button}</span>
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Блок профиля - меньший */}
            <div id="profile" className="bg-white lg:col-span-1 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-blue-600 mr-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Профиль</h2>
              </div>
              
              <div className="flex items-start space-x-4">
                {/* Аватар */}
                <div className="w-16 h-16 border-2 border-blue-600 rounded-full flex items-center justify-center bg-white">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Информация о пользователе */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Имя</label>
                    <input 
                      type="text"
                      name="name"
                      placeholder="Имя"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                      value={user.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <input 
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                      value={user.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Телефон</label>
                    <input 
                      type="tel"
                      name="phone"
                      placeholder="Телефон"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                      value={user.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Адрес</label>
                    <input 
                      type="text"
                      name="address"
                      placeholder="Адрес"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                      value={user.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Нижние блоки - Трансляция и Платежи */}
          <div className="mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {/* Блок трансляции */}
              <div id="broadcast" className="bg-white p-8 rounded-lg border border-gray-200 h-[600px] w-full lg:col-span-1 scroll-mt-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-blue-600 mr-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Трансляция</h2>
                  </div>
                  {/* Кнопка Live */}
                  <div className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Live
                  </div>
                </div>
                
                <div className="relative h-full">
                  <div className="w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="/Frame 2095585499.png" 
                      alt="Мастерская по ремонту автомобилей"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 items-center justify-center">
                      <div className="text-center text-gray-600">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        <p className="text-lg">Прямая трансляция</p>
                        <p className="text-sm text-gray-500 mt-2">Мастерская по ремонту автомобилей</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Блок платежей */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 h-[600px] w-full flex flex-col lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-blue-600 mr-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Платежи</h2>
                  </div>
                  <select className="text-sm border border-gray-300 rounded px-4 py-2 bg-white">
                    <option>Все платежи за последнюю неделю</option>
                  </select>
                </div>
                
                {/* Заголовки таблицы */}
                <div className="grid grid-cols-4 gap-6 mb-4 text-sm font-medium text-gray-500 border-b pb-3">
                  <div className="flex items-center">
                    Employee
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>Статус</div>
                  <div>Выполнено</div>
                  <div>Действие</div>
                </div>
                
                {/* Строки платежей */}
                <div className="space-y-6 overflow-y-auto flex-1">
                  {mockPayments.map((payment, index) => (
                    <div key={index} className="grid grid-cols-4 gap-6 items-center py-3">
                      {/* Employee */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.employee}</div>
                          <div className="text-sm text-gray-500">{payment.name}</div>
                        </div>
                      </div>
                      
                      {/* Статус */}
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === 'Оплачено' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            payment.status === 'Оплачено' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {payment.status}
                        </span>
                      </div>
                      
                      {/* Выполнено */}
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${payment.completed}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{payment.completed}%</span>
                      </div>
                      
                      {/* Действие */}
                      <div>
                        <button className="text-blue-600 text-sm hover:text-blue-800 font-medium">
                          {payment.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
