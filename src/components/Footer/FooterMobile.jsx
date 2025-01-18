import React from 'react';
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './FooterBar.module.scss';

const FooterBar = () => {
  const location = useLocation();

  const navItems = [
    { id: 1, icon: <Home  />, label: 'Baş sahypa', count: 0, path: '/' },
    { id: 2, icon: <ShoppingBag  />, label: 'Brendler', count: 0, path: '/brands' },
    { id: 3, icon: <ShoppingCart />, label: 'Sebet', count: 11, path: '/cart' },
    { id: 4, icon: <Heart />, label: 'Halanlarym', count: 11, path: '/wishlist' },
    { id: 5, icon: <User  />, label: 'Profil', count: 0, path: '/profile' },
  ];

  return (
    <footer className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
            >
              <div className={styles.iconWrapper}>
                <div className={styles.icon}>
                  {item.icon}
                </div>
                {item.count > 0 && (
                  <div className={styles.badge}>
                    {item.count}
                  </div>
                )}
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
