'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Дашборд', href: '/dashboard' },
    { name: 'Профиль', href: '/profile' },
    { name: 'Заказы', href: '/orders' },
    { name: 'Платежи', href: '/payments' },
    { name: 'Трансляция', href: '/dashboard#broadcast' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div></div>
      <div className="flex items-center space-x-12">
        <Link href="/dashboard" className={`flex items-center h-16 ${pathname === '/dashboard' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}> 
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          Дашборд
        </Link>
  <Link href="/profile/1" className={`flex items-center h-16 ${pathname === '/profile/1' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}> 
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          Профиль
        </Link>
        <Link href="/orders" className={`flex items-center h-16 ${pathname === '/orders' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}> 
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          Заказы
        </Link>
        <Link href="/payments" className={`flex items-center h-16 ${pathname === '/payments' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}> 
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" /></svg>
          Платежи
        </Link>
        <Link href="/dashboard#broadcast" className={`flex items-center h-16 ${pathname === '/dashboard#broadcast' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}> 
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
          Трансляция
        </Link>
      </div>
    </header>
  );
}
