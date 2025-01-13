import React, { useState } from 'react';
import styles from './ProfileMenu.module.scss';
import LoginModal from '../LogIn/index';
import SignUpModal from '../SignUp/index';
import { 
  User,
  LogIn,
  Wallet,
  Heart,
  Languages,
  List,
  Mail,
  Info
} from 'lucide-react';

const ProfileMenu = () => {
  const [activeModal, setActiveModal] = useState(null);

  const handleMenuClick = (index) => {
    if (index === 0) setActiveModal('signUp');
    if (index === 1) setActiveModal('login');
  };

  const menuItems = [
    { icon: <User />, text: 'Hasaba al' }, // Sign Up
    { icon: <LogIn />, text: 'Ulgama gir' }, // Login
    { icon: <Wallet />, text: 'Sargytlarym' },
    { icon: <Heart />, text: 'Halanlarym' },
    { icon: <Languages />, text: 'Dil çalyşmak' },
    { icon: <List />, text: 'Eltip bermek we töleg tertibi' },
    { icon: <Mail />, text: 'Habarlaşmak' },
    { icon: <Info />, text: 'Biz barada' },
  ];

  return (
    <>
      <div className={styles.profileMenu}>
        {menuItems.map(({ icon, text }, index) => (
          <button
            key={index}
            className={styles.menuItem}
            onClick={() => handleMenuClick(index)}
            title={text} // Accessibility improvement
            aria-label={text} // Accessibility improvement
          >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}>{text}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      <LoginModal 
        isVisible={activeModal === 'login'} 
        onClose={() => setActiveModal(null)} 
      />
      <SignUpModal 
        isVisible={activeModal === 'signUp'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
};

export default ProfileMenu;
