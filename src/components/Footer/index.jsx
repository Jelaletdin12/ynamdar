import React from "react";
import styles from "./Footer.module.scss";
import playstore from "../../assets/playstore.png";
import appstore from "../../assets/appstore.png";
import apk from "../../assets/apk.png";
import logo from "../../assets/logoFooter.png";
import FooterBar from "./FooterMobile";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t, i18n } = useTranslation();
  return (
      <>
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <div style={{ display: "flex" }}>
          <div className={styles.marketSection}>
            <h3>  {t("footer.market")}</h3>
            <ul>
              <li>{t("footer.about")}</li>
              <li>{t("footer.delivery_and_payment_procedure")}</li>
              <li>{t("footer.contact")}</li>
              <li>{t("footer.TermsofUseandPrivacyPolicy")}</li>
            </ul>
          </div>

          <div className={styles.contactSection}>
            <h3>{t("footer.contactUs")}</h3>
            <ul>
              <li>{t("checkout.telephone")}: +993 12 22-74-75</li>
              <li>Imo: +993 63 75-74-22</li>
              <li>E-mail: info@ynamdar.com</li>
              <li>Instagram: @ynamdar_com</li>
            </ul>
          </div>

          <div className={styles.appsSection}>
            <h3>{t("footer.mobile_applications")}</h3>
            <div className={styles.appLinks}>
              <div style={{ display: "flex", gap: "10px" }}>
                <img
                  src={playstore}
                  alt="Google Play"
                  className={styles.appLogo}
                  />
                <img
                  src={appstore}
                  alt="App Store"
                  className={styles.appLogo}
                />
              </div>
              <img src={apk} alt="Download APK" className={styles.appLogo} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p> © 2019-2024 ynamdar.com. {t("footer.copyright")}</p>
      </div>
    </footer>
      <FooterBar />
                  </>
  );
};

export default Footer;
