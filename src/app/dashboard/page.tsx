'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '@/components/Header';
import { BitrixDeal } from '@/lib/bitrix';
import { User } from '@/lib/database';

// Моковые данные для заказов
const mockOrders = [
  { id: 1, title: 'Счета на оплату для Юр. Лиц', imageUrl: '/image.png' },
  { id: 2, title: 'Гарантия на детали для переднего бампера', imageUrl: '/imageee.png' },
  { id: 3, title: 'Чеки для Физ.лиц', imageUrl: '/imageewewew.png' },
  { id: 4, title: 'Счета на оплату для Юр. Лиц', imageUrl: '/image.png' },
  { id: 5, title: 'Договор на техническое обслуживание', imageUrl: '/image.png' },
  { id: 6, title: 'Акт выполненных работ по заказу #5512', imageUrl: '/imageee.png' },
  { id: 7, title: 'Возврат товара: передний бампер', imageUrl: '/imageewewew.png' },
  { id: 8, title: 'Инструкция по эксплуатации', imageUrl: '/image.png' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<Partial<User>>({});
  const [payments, setPayments] = useState<BitrixDeal[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    // Fetch recent payments
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/deals');
        const data = await response.json();
        if (data.success) {
          // Show last 5 payments on dashboard
          setPayments(data.deals.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchProfile();
    fetchPayments();
  }, []);

  const paidStages = new Set(['PREPARATION', 'PREPAYMENT_INVOICE', 'EXECUTING', 'FINAL_INVOICE', 'WON']);

  const getPaymentStatus = (stageId: string) => {
    return paidStages.has(stageId) ? 'Оплачено' : 'Не оплачено';
  };

  const getStatusColor = (status: string) => {
    return status === 'Оплачено'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusDotColor = (status: string) => {
    return status === 'Оплачено' ? 'bg-green-500' : 'bg-red-500';
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Файл атын суреттің соңғы бөлігінен немесе тақырыптан аламыз
      const fileName = imageUrl.split('/').pop() || title.replace(/ /g, '_') + '.png';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Суретті жүктеу кезінде қате пайда болды.');
    }
  };

  const renderProfileSkeletons = () => (
    <div className="flex-1 space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  const renderPaymentsSkeletons = () => (
    <div className="space-y-2 sm:space-y-6 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 sm:gap-6 items-center py-2 sm:py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
          <div><div className="h-6 bg-gray-200 rounded-full w-24"></div></div>
          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="w-14 sm:w-20 bg-gray-200 rounded-full h-2"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div><div className="h-5 bg-gray-200 rounded w-16"></div></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <div className="w-full bg-white">
        <main className="p-4 sm:p-8">
          {/* Приветствие */}
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Привет, {user.login || 'Гость'} 👋
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
                      <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-lg mb-2 sm:mb-3 flex items-center justify-center overflow-hidden relative">
                        {/* Фото орны: әр карточкаға жеке сурет қойыңыз */}
                        <Image
                          src={order.imageUrl}
                          alt={order.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-0">{order.title}</h3>
                        <div className="mb-1">
                          <span className="text-gray-500 text-sm"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-0"></p>
                        <p className="text-gray-500 text-sm"></p>
                      </div>
                      <button
                        onClick={() => handleDownload(order.imageUrl, order.title)}
                        className="w-full bg-blue-600 text-white px-2 py-2 rounded-lg text-base font-medium hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors mt-auto"
                      >
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

                {loadingProfile ? renderProfileSkeletons() : (
                  /* Информация о пользователе */
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Логин</label>
                      <input
                        type="text"
                        name="login"
                        placeholder="Логин"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 bg-gray-50"
                        value={user.login || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 bg-gray-50"
                        value={user.email || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон не указан"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                        value={user.phone || ''}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Адрес</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Адрес не указан"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                        value={user.address || ''}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                )}
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
                    <Image
                      src="/Frame 2095585319.png"
                      alt="Мастерская по ремонту автомобилей"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                </div>
              </div>

              {/* Блок платежей - lg:col-span-3 */}
                <div className="bg-white p-2 sm:p-8 rounded-lg border border-gray-200 w-full flex flex-col lg:col-span-3 shadow-lg">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center">
                      <div className="w-1 h-8 bg-blue-600 mr-2 sm:mr-4"></div>
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Платежи</h2>
                    </div>
                    <select className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 sm:px-4 sm:py-2 bg-white">
                      <option>Все платежи за последнюю неделю</option>
                    </select>
                  </div>
                  {/* Mobile: horizontal scroll, compact table */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[480px] sm:min-w-0">
                      <div className="grid grid-cols-4 gap-2 sm:gap-6 mb-2 sm:mb-4 text-xs sm:text-sm font-medium text-gray-500 border-b pb-2 sm:pb-3">
                        <div className="flex items-center">Employee
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>Статус</div>
                        <div>Выполнено</div>
                        <div>Действие</div>
                      </div>
                      <div className="space-y-2 sm:space-y-6">
                        {loadingPayments ? renderPaymentsSkeletons() : (
                          payments.map((payment) => {
                            const status = getPaymentStatus(payment.STAGE_ID);
                            return (
                              <div key={payment.ID} className="grid grid-cols-4 gap-2 sm:gap-6 items-center py-2 sm:py-3">
                                {/* Employee */}
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{payment.TITLE}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">Счет #{payment.ID}</div>
                                  </div>
                                </div>
                                {/* Статус */}
                                <div>
                                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)}`}>
                                    <div className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${getStatusDotColor(status)}`}></div>
                                    {status}
                                  </span>
                                </div>
                                {/* Выполнено */}
                                <div className="flex items-center space-x-1 sm:space-x-3">
                                  <div className="w-14 sm:w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`${status === 'Оплачено' ? 'bg-green-500' : 'bg-yellow-500'} h-2 rounded-full`}
                                      style={{ width: `${status === 'Оплачено' ? 100 : 50}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-500">{status === 'Оплачено' ? 100 : 50}%</span>
                                </div>
                                {/* Действие */}
                                <div>
                                  <a href="/payments" className="text-blue-600 text-xs sm:text-sm hover:text-blue-800 font-medium">
                                    Смотреть
                                  </a>
                                </div>
                              </div>
                            );
                          })
                        )}
                        {!loadingPayments && payments.length === 0 && (
                          <div className="col-span-4 text-center py-8 text-gray-500">
                            Платежи не найдены.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
