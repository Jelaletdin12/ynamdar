import React from 'react';
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react';
import styles from './FooterBar.module.scss';
import { Link } from 'react-router-dom';

const FooterBar = () => {
  const navItems = [
    { id: 1, icon: <Home size={24} />, label: 'Baş sahypa', count: 0, path: '/' },
    { id: 2, icon: <ShoppingBag size={24} />, label: 'Brendler', count: 0, path: '/brands' },
    { id: 3, icon: <ShoppingCart size={24} />, label: 'Sebet', count: 11, path: '/cart' },
    { id: 4, icon: <Heart size={24} />, label: 'Halanlarym', count: 11, path: '/wishlist' },
    { id: 5, icon: <User size={24} />, label: 'Profil', count: 0, path: '/profile' }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <Link key={item.id} to={item.path} className={styles.navItem}>
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
    </nav>
  );
};

export default FooterBar;
