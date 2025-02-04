import React from 'react';
import styles from './DeliveryTerms.module.scss';

const DeliveryTerms = () => {
  return (
    <div className={styles.termsContainer}>
      <h1 className={styles.title}>Eltip bermek we töleg tertibi:</h1>
      
      <div className={styles.termsList}>
        <div className={styles.termItem}>
          <p>Eltip bermek hyzmaty Aşgabat şäheriniň çägi bilen bir hatarda Büzmeýine we Änew şäherine hem elýeterlidir;</p>
        </div>

        <div className={styles.termItem}>
          <p>
            Sargydyň iň pes çägi <span className={styles.highlight}>50 manat</span> bolmaly; 
            sargydyňyz <span className={styles.highlight}>150 manatdan</span> geçse eltip bermek hyzmaty mugt;
          </p>
        </div>

        <div className={styles.termItem}>
          <p>Saýtdan sargyt edeniňizden soňra operator size jaň edip sargyt tassyklar (eger hemişelik müşderi bolsaňyz sargytlaryňyz islegiňize göra awtomatik usulda hem tassyklanýar);</p>
        </div>

        <div className={styles.termItem}>
          <p>Girizen salgyňyz we telefon belgiňiz esasynda hyzmat amala aşyrylýar;</p>
        </div>

        <div className={styles.termItem}>
          <p>Sargyt tassyklanmadyk ýagdaýynda ol hasaba alynmaýar we ýerine ýetirilmeýär. Sargydyň tassyklanmagy üçin girizen telefon belgiňizden jaň kabul edip bilýändigiňize göz ýetiriň. Şeýle hem girizen salgyňyzyň dogrulygyny barlaň;</p>
        </div>

        <div className={styles.termItem}>
          <p>Sargýdy barlap alanyňyzdan soňra töleg amala aşyrylýar. Eltip beriljiniň size gowşurýan töleg resminamasynda siziň tölemeli puluňyz bellenenidir. Töleg nagt we nagt däl görnüşde milli manatda amala aşyrylýar. Kabul edip tölegini geçiren harydyňyz yzyna alynmaýar;</p>
        </div>

        <div className={styles.termItem}>
          <p>Sargyt tassyklanandan soňra 24 sagadyň dowamynda eýesi tapylmasa ol güýjüni ýitirýär;</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTerms;