import React from "react";
import { useGetLegalPageBySlugQuery } from "../../app/api/legalPagesApi";
import styles from "./privacyPolicy.module.scss";

const PrivacyPolicy = () => {
  const { data, error, isLoading } = useGetLegalPageBySlugQuery("privacy-policy");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading privacy policy</div>;

  return (
    <div className={styles.PrivacyContainer}>
      <h1 className={styles.title}>{data?.data.title}</h1>
      <div
        className={styles.paragraph}
        dangerouslySetInnerHTML={{ __html: data?.data.content }}
      />
    </div>
  );
};

export default PrivacyPolicy;