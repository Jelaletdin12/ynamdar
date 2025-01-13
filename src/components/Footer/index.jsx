import React from "react";
import styles from "./Footer.module.scss";
import playstore from "../../assets/playstore.png";
import appstore from "../../assets/appstore.png";
import apk from "../../assets/apk.png";
import logo from "../../assets/logoFooter.png";
import FooterBar from "./FooterMobile";
const Footer = () => {
  return (
      <>
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <div style={{ display: "flex" }}>
          <div className={styles.marketSection}>
            <h3>Market</h3>
            <ul>
              <li>Biz barada</li>
              <li>Eltip bermek we töleg tertibi</li>
              <li>Aragatnaşyk</li>
              <li>Ulanyş düzgünleri we gizlinlik şertleri</li>
            </ul>
          </div>

          <div className={styles.contactSection}>
            <h3>Habarlaşmak üçin</h3>
            <ul>
              <li>Telefon: +993 12 22-74-75</li>
              <li>Imo: +993 63 75-74-22</li>
              <li>E-mail: info@ynamdar.com</li>
              <li>Instagram: @ynamdar_com</li>
            </ul>
          </div>

          <div className={styles.appsSection}>
            <h3>Mobile programmalar</h3>
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
        <p> © 2019-2024 ynamdar.com. Ähli hukuklary goraglydyr.</p>
      </div>
    </footer>
      <FooterBar />
                  </>
  );
};

export default Footer;
