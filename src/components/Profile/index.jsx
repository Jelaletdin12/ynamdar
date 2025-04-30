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
  Edit,
  MapPin,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./ProfileMenu.module.scss";
import LoginModal from "../LogIn";
import SignUpModal from "../SignUp";
import ProfileModal from "..//MyProfileModal/index"; 
import tm from "../../assets/tm.png";
import ru from "../../assets/ru.png";
import en from "../../assets/en.png";
import { useAuth } from "../../context/authContext";
import { useGetProfileQuery } from "../../app/api/myProfileApi"; 

const ProfileMenu = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  // Fetch profile data from API
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated, // Skip the API call if not authenticated
  });

  // Extract user data from API response
  const userData = profileData?.data || {
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  };

  const languages = [
    { code: "tm", img: tm, name: "Türkmen" },
    { code: "ru", img: ru, name: "Русский" },
    { code: "en", img: en, name: "English" },
  ];

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      logout();
      return;
    }

    if (item.action) {
      setActiveModal(item.action);
    }
  };

  const handleLanguageChange = async (langCode) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
    setActiveModal(null);
  };

  // Handle edit profile click
  const handleEditProfile = () => {
    setActiveModal("editProfile");
  };

  // Close any modal
  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // Render authenticated profile view
  const renderAuthenticatedProfile = () => {
    const menuItems = [
      // { icon: <MapPin />, text: t("profile.my_address"), path: "/addresses" },
      { icon: <Wallet />, text: t("profile.orders"), path: "/orders" },
      { icon: <Heart />, text: t("profile.favorites"), path: "/wishlist" },
      { icon: <Languages />, text: t("profile.language"), action: "language" },
      {
        icon: <List />,
        text: t("profile.delivery"),
        path: "/delivery-and-payment",
      },
      { icon: <Mail />, text: t("profile.contact"), path: "/contactus" },
      { icon: <Info />, text: t("profile.about"), path: "/about-us" },
      { icon: <LogOut />, text: t("profile.logout"), action: "logout" },
    ];

    return (
      <div className={styles.profileMenuContainer}>
        {/* User profile header */}
        <div className={styles.userProfileHeader}>
          <div className={styles.userIconContainer}>
            <User className={styles.userIcon} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.phoneNumber}>+993 {userData.phone_number}</div>
            <button
              onClick={handleEditProfile}
              className={styles.editProfileLink}
            >
              <Edit size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          {/* First name section */}
          <div className={styles.balanceSection}>
            <div className={styles.balanceLabel}>{t("profile.name")}</div>
            <div className={styles.balanceAmount}>
              {userData.first_name || "Registered User"}
            </div>
          </div>

          {/* Last name section */}
          <div className={styles.balanceSection}>
            <div className={styles.balanceLabel}>{t("profile.lastname")}</div>
            <div className={styles.balanceAmount}>
              {userData.last_name || "Registered User"}
            </div>
          </div>

          {/* Address section - Add this new section */}
          <div className={styles.balanceSection}>
            <div className={styles.balanceLabel}>{t("profile.address")}</div>
            <div className={styles.balanceAmount}>
              {userData.address || "Ashgabat"}
            </div>
          </div>
        </div>
        {/* Menu items */}
        <div className={styles.profileMenu}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </div>

        {/* Language Modal */}
        <Modal
          title={t("profile.selectLanguage")}
          open={activeModal === "language"}
          onCancel={handleCloseModal}
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

        {/* Edit Profile Modal */}
        <ProfileModal
          visible={activeModal === "editProfile"}
          onClose={handleCloseModal}
        />
      </div>
    );
  };

  // Render unauthenticated menu
  const renderUnauthenticatedMenu = () => {
    const menuItems = [
      // { icon: <User />, text: t("profile.registration"), action: "signUp" },
      { icon: <LogIn />, text: t("profile.login"), action: "login" },
      { icon: <Wallet />, text: t("profile.orders"), path: "/orders" },
      { icon: <Heart />, text: t("profile.favorites"), path: "/wishlist" },
      { icon: <Languages />, text: t("profile.language"), action: "language" },
      {
        icon: <List />,
        text: t("profile.delivery"),
        path: "/delivery-and-payment",
      },
      { icon: <Mail />, text: t("profile.contact"), path: "/contactus" },
      { icon: <Info />, text: t("profile.about"), path: "/about-us" },
    ];

    return (
      <div className={styles.profileMenuContainer}>
        <div className={styles.profileMenu}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </div>

        {/* Login/Signup Modals */}
        <LoginModal
          isVisible={activeModal === "login"}
          onClose={handleCloseModal}
        />
        <SignUpModal
          isVisible={activeModal === "signUp"}
          onClose={handleCloseModal}
        />

        {/* Language Modal */}
        <Modal
          title={t("profile.selectLanguage")}
          open={activeModal === "language"}
          onCancel={handleCloseModal}
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
      </div>
    );
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

  // Show loading state while fetching profile data
  if (isAuthenticated && isLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  // Render different views based on authentication state
  return isAuthenticated
    ? renderAuthenticatedProfile()
    : renderUnauthenticatedMenu();
};

export default ProfileMenu;
