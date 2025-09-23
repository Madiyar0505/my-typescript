'use client';

import { useState } from 'react';
import Header from '@/components/Header';

// Мок деректер (API-дан келеді деп есептейміз)
const mockProfile = {
  id: 1,
  name: '',
  email: '',
  phone: '',
  address: ''
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Болашақта params.id арқылы API-дан нақты деректерді сұрауға болады
  const [user, setUser] = useState(mockProfile);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="max-w-6xl ml-0 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f5f7f9] rounded-lg shadow-none p-10">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-blue-600 rounded mr-4"></div>
            <h1 className="text-5xl font-bold text-gray-900">Профиль</h1>
          </div>

          <div className="flex flex-row items-start gap-12">
            {/* Аватар сол жақта, үлкейтілген */}
            <div className="flex flex-col items-center justify-start w-[260px]">
              <div className="w-[200px] h-[200px] border-4 border-blue-500 rounded-full flex items-center justify-center bg-gray-100 mb-2">
                <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Форма оң жақта */}
            <div className="flex-1 space-y-7">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Имя</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-[#f5f7f9] text-lg focus:ring-blue-500 focus:border-blue-500"
                  value={user.name}
                  onChange={handleProfileChange}
                  placeholder="Телефон"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-[#f5f7f9] text-lg focus:ring-blue-500 focus:border-blue-500"
                  value={user.email}
                  onChange={handleProfileChange}
                  placeholder="Телефон"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-[#f5f7f9] text-lg focus:ring-blue-500 focus:border-blue-500"
                  value={user.phone}
                  onChange={handleProfileChange}
                  placeholder="Телефон"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Адрес</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-[#f5f7f9] text-lg focus:ring-blue-500 focus:border-blue-500"
                  value={user.address}
                  onChange={handleProfileChange}
                  placeholder="Телефон"
                />
              </div>
              <div className="pt-6">
                <button className="w-full bg-[#0057ff] text-white py-4 px-4 rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors">
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}