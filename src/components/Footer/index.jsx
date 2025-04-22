import React from "react";
import styles from "./Footer.module.scss";
import playstore from "../../assets/playstore.png";
import appstore from "../../assets/appstore.png";
import apk from "../../assets/apk.png";
import logo from "../../assets/logoFooter.png";
import FooterBar from "./FooterMobile";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LogoWithText } from "../Icons";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.logo} onClick={() => navigate("/")}>
            <LogoWithText />
          </div>
          <div style={{ display: "flex" }}>
            <div className={styles.marketSection}>
              <h3> {t("footer.market")}</h3>
              <ul>
                <li>
                  <Link to="/about-us">{t("footer.about")}</Link>
                </li>
                <li>
                  <Link to="/delivery-and-payment">
                    {t("footer.delivery_and_payment_procedure")}
                  </Link>
                </li>
                <li>
                  <Link to={"/contactus"}>{t("footer.contact")}</Link>
                </li>
                <li>
                  <Link to={"/privacy-policy"}>
                    {t("footer.TermsofUseandPrivacyPolicy")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.contactSection}>
              <h3>{t("footer.contactUs")}</h3>
              <ul>
                <li>
                  <a href="tel:+99360122213">
                    {t("checkout.telephone")}: +993 60 12-22-13
                  </a>
                </li>
                <li>
                  <a
                    href="https://imo.im"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Imo: +993 65 95-00-91
                  </a>
                </li>
                <li>
                  <a href="mailto:mm.marketplace.tm@gmail.com">
                    E-mail: mm.marketplace.tm@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/mm.com.tm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram: mm.com.tm
                  </a>
                </li>
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
          <p> © 2019-2025 mm.com.tm {t("footer.copyright")}</p>
        </div>
      </footer>
      <FooterBar />
    </>
  );
};

export default Footer;
