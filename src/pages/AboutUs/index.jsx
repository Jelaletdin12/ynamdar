import React from 'react';
import styles from './AboutUs.module.scss';

const AboutUs = () => {
  return (
    <div className={styles.aboutUsContainer}>
      <h1 className={styles.title}>Sizi Ynamdar onlaýn marketimizde hoş gördiük!</h1>
      <p className={styles.paragraph}>
        Onlaýn marketimiz 2019-njy ýyldan bäri hyzmat berýär. Hazirki wagtda Siz ýüzlerçe brendlere degişli bolan münlerçe haryt görüşlerini hödürleýäris! Haryt görüşlerimizi sizden gelyan isleg we teklipirleri esasynda köpeltmäge dowam edýäris. Bizim maksadymyz müşderilerimize ýokary hilli hyzmat bermek bolup durýar. Indi Siz ýüzlerçe sanygdan gerekli zatlar bilen bir hatarda Siz wagtylaryňyz hem ýygytlarsyňyz. Tolegi harytlar size gowşandan soňra nagt ýa-da bank kartlaryňyz üsti bilen amala aşyrýp bilesiňiz!
      </p>
      <p className={styles.paragraph}>
        Bizin gapýaryz hyzmatdaşlyklara we teklirlere hemişe açyk!
      </p>
    </div>
  );
};

export default AboutUs;