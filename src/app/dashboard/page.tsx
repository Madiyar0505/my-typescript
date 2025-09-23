'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '@/components/Header';

// Моковые данные для заказов
const mockOrders = [
  { id: 1, title: 'Счета на оплату для Юр. Лиц', status: '', amount: ' ', date: '', button: 'Скачать', imageUrl: '/image.png' },
  { id: 2, title: 'Гарантия на детали для переднего бампера', status: '', amount: ' ', date: '', button: 'Скачать', imageUrl: '/imageee.png' },
  { id: 3, title: 'Чеки для Физ.лиц', status: '', amount: '', date: '', button: 'Скачать', imageUrl: '/imageewewew.png' },
  { id: 4, title: 'Счета на оплату для Юр. Лиц', status: '', amount: '', date: '', button: 'Скачать', imageUrl: '/image.png' },
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
      <Header />
      <div className="w-full bg-white">
        <main className="p-4 sm:p-8">
          {/* Приветствие */}
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Привет, Алим  Джолдаспаев 👋
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
            {/* Блок заказов - больший */}
            <div id="orders" className="bg-white lg:col-span-2 scroll-mt-20 rounded-2xl shadow-lg border border-gray-200 px-3 py-4 sm:px-6 sm:py-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-6 bg-blue-600 mr-4"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Заказы</h2>
              </div>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={12}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  1024: { slidesPerView: 4, spaceBetween: 24 }
                }}
                navigation
                pagination={{ clickable: true }}
                className="pb-10"
                style={{ paddingBottom: 40 }}
              >
                {mockOrders.map((order) => (
                  <SwiperSlide key={order.id}>
                    <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-4 h-full shadow-sm flex flex-col min-h-[270px] sm:min-h-[370px]">
                      <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-lg mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                        {/* Фото орны: әр карточкаға жеке сурет қойыңыз */}
                        <img
                          src={order.imageUrl}
                          alt={order.title}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-0">{order.title}</h3>
                        <div className="mb-1">
                          <span className="text-gray-500 text-sm">{order.status}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-0">{order.amount}</p>
                        <p className="text-gray-500 text-sm">{order.date}</p>
                      </div>
                      <button className="w-full bg-blue-600 text-white px-2 py-2 rounded-lg text-base font-medium hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors mt-auto">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Скачать</span>
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <style jsx global>{`
                .swiper-pagination {
                  bottom: 0 !important;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 12px;
                }
                .swiper-pagination-bullet {
                  width: 18px;
                  height: 18px;
                  background: #e5e7eb;
                  opacity: 1;
                  margin: 0 4px !important;
                  transition: background 0.2s;
                }
                .swiper-pagination-bullet-active {
                  background: #0057ff;
                }
              `}</style>
            </div>

            {/* Блок профиля - меньший */}
            <div id="profile" className="bg-white lg:col-span-1 scroll-mt-20 rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1 h-6 bg-blue-600 mr-4"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Профиль</h2>
              </div>
              
              <div className="flex items-start space-x-4">
                {/* Аватар */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-blue-600 rounded-full flex items-center justify-center bg-white">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-12 w-full items-stretch">
              {/* Блок трансляции - lg:col-span-2 */}
                <div id="broadcast" className="bg-white p-4 sm:p-8 rounded-lg border border-gray-200 w-full scroll-mt-20 shadow-lg lg:col-span-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-blue-600 mr-4"></div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Трансляция</h2>
                  </div>
                  {/* Кнопка Live */}
                  <div className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Live
                  </div>
                </div>
                
                <div className="relative w-full flex justify-center items-center">
                  <div className="w-full aspect-video min-h-[180px] sm:min-h-[320px] min-w-[180px] sm:min-w-[320px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src="/Frame 2095585319.png" 
                      alt="Мастерская по ремонту автомобилей"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Блок платежей - lg:col-span-3 */}
                <div className="bg-white p-4 sm:p-8 rounded-lg border border-gray-200 w-full flex flex-col lg:col-span-3 shadow-lg">
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
                <div className="space-y-6 overflow-y-auto">
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
