import React from "react";
import styles from "./aboutUs.module.scss";

const AboutUs = () => {
  return (
    <div className={styles.aboutUsContainer}>
      <h1 className={styles.title}>
        Sizi Ynamdar onlaýn marketimizde hoş gördük!
      </h1>
      <p className={styles.paragraph}>
        Onlaýn marketimiz 2019-njy ýylyň iýul aýyndan bäri hyzmat berýär.
        Häzirki wagtda Size ýüzlerçe brendlere degişli bolan müňlerçe haryt
        görnüşlerini hödürleýäris! Haryt görnüşlerimizi sizden gelýän isleg we
        teklipleriň esasynda köpeltmäge dowam edýäris. Biziň maksadymyz
        müşderilerimize ýokary hilli hyzmat bermek bolup durýar. Indi Siz
        öýüňizden çykmazdan özüňizi gerekli zatlar bilen üpjün edip bilersiňiz!
        Munuň bilen bir hatarda Siz wagtyňyzy we transport çykdajylaryny hem
        tygşytlaýarsyňyz. Tölegi harytlar size gowuşandan soňra nagt ýa-da bank
        kartlarynyň üsti bilen amala aşyryp bilersiňiz!{" "}
      </p>
      <p className={styles.paragraph}>
        Biziň gapymyz hyzmatdaşlyklara we tekliplere hemişe açyk!
      </p>
    </div>
  );
};

export default AboutUs;
