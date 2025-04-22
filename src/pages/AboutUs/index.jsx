import React from "react";
import styles from "./aboutUs.module.scss";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.aboutUsContainer}>
      <h1 className={styles.title}>
      {t("footer.about")} 
      </h1>
      <p className={styles.paragraph}>
      {t("footer.about_paragraph1")}
      </p>
      <p className={styles.paragraph}>
      {t("footer.about_paragraph2")}
      </p>
      <p className={styles.paragraph}>
      {t("footer.about_paragraph3")}
      </p>
      <p className={styles.paragraph}>
      {t("footer.about_paragraph4")}
      </p>
    </div>
  );
};

export default AboutUs;
