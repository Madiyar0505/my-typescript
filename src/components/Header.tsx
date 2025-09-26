'use client';

// removed unused useState import

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

export default function Header() {
  const pathname = usePathname();
  const navigation = [
    { name: 'Дашборд', href: '/dashboard', icon: <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
    { name: 'Профиль', href: '/profile/1', icon: <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
    { name: 'Заказы', href: '/orders', icon: <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg> },
    { name: 'Платежи', href: '/payments', icon: <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" /></svg> },
    { name: 'Трансляция', href: '/dashboard#broadcast' },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = item.href.startsWith('/profile') ? pathname.startsWith('/profile') : pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
