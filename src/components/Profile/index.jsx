import React, { useState } from "react";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import {
  User,
  LogIn,
  Wallet,
  Heart,
  Languages,
  List,
  Mail,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./ProfileMenu.module.scss";
import LoginModal from "../LogIn";
import SignUpModal from "../SignUp";
import tm from "../../assets/tm.png";
import ru from "../../assets/ru.png";
import en from "../../assets/en.png";

const ProfileMenu = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "tm", img: tm, name: "Türkmen" },
    { code: "ru", img: ru, name: "Русский" },
    { code: "en", img: en, name: "English" },
  ];

  const menuItems = [
    { icon: <User />, text: t("profile.registration"), action: "signUp" },
    { icon: <LogIn />, text: t("profile.login"), action: "login" },
    { icon: <Wallet />, text: t("profile.orders"), path: "/orders" },
    { icon: <Heart />, text: t("profile.favorites"), path: "/wishlist" },
    { icon: <Languages />, text: t("profile.language"), action: "language" },
    { icon: <List />, text: t("profile.delivery"), path: "/delivery-and-payment" },
    { icon: <Mail />, text: t("profile.contact"), path: "/contactus" },
    { icon: <Info />, text: t("profile.about"), path: "/about-us" },
  ];

  const handleMenuClick = (item) => {
    if (item.action) {
      setActiveModal(item.action);
    }
  };

  const handleLanguageChange = async (langCode) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
    setActiveModal(null);
  };

  const renderMenuItem = (item, index) => {
    const content = (
      <>
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.text}>{item.text}</span>
      </>
    );

    if (item.path) {
      return (
        <Link
          key={index}
          to={item.path}
          className={styles.menuItem}
          title={item.text}
          aria-label={item.text}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        className={styles.menuItem}
        onClick={() => handleMenuClick(item)}
        title={item.text}
        aria-label={item.text}
      >
        {content}
      </button>
    );
  };

  return (
    <div className={styles.profileMenuContainer}>
      <div className={styles.profileMenu}>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </div>

      {/* Language Modal */}
      <Modal
        title={t("profile.selectLanguage")}
        open={activeModal === "language"}
        onCancel={() => setActiveModal(null)}
        footer={null}
        className={styles.langModal}
      >
        <div className={styles.languageList}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.languageItem} ${
                i18n.language === lang.code ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className={styles.langContent}>
                <img
                  src={lang.img}
                  alt={lang.name}
                  className={styles.langFlag}
                />
                <span>{lang.name}</span>
              </div>
              {i18n.language === lang.code && (
                <span className={styles.activeDot} />
              )}
            </button>
          ))}
        </div>
      </Modal>

      {/* Other Modals */}
      <LoginModal
        isVisible={activeModal === "login"}
        onClose={() => setActiveModal(null)}
      />
      <SignUpModal
        isVisible={activeModal === "signUp"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default ProfileMenu;
