import React, { useState } from "react";
import styles from "./Checkout.module.scss";
import { TiTick } from "react-icons/ti";

const Checkout = ({ cartItems, onBackToCart }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryAddress: "",
    region: "",
  });

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.formSection}>
        <div className={styles.paymentOptions}>
          <h3>Töleg şekili:</h3>
          <div className={styles.option}>
            <input type="radio" id="nagt" name="paymentType" defaultChecked />
            <label htmlFor="nagt" className={styles.customRadio}></label>
            <div className={styles.text}>
              <span className={styles.optionTitle}>Nagt</span>
              <span className={styles.optionDesc}>
                Sargyt galan wagtynyz nagt hasaplaşmak
              </span>
            </div>
          </div>

          <div className={styles.option}>
            <input type="radio" id="terminal" name="paymentType" />
            <label htmlFor="terminal" className={styles.customRadio}></label>
            <div className={styles.text}>
              <span className={styles.optionTitle}>Töleg Terminaly</span>
              <span className={styles.optionDesc}>
                Töleg terminalyndan kart arkaly hasaplaşmak
              </span>
            </div>
          </div>

          <div className={styles.balance}>
            <input
              type="checkbox"
              id="customCheckbox"
              className={styles.checkbox}
            />
            <label htmlFor="customCheckbox" className={styles.customCheckbox}>
              <TiTick className={styles.checkIcon} />
            </label>
            <div className={styles.text}>
              <span style={{ color: "#6b7280" }}>
                Keşbek balansynyz:{" "}
                <span className={styles.amount}>0.00 m.</span>
              </span>
              <span className={styles.description}>
                Ygtyýarlygy pul serişdeleri ulanyňak
              </span>
            </div>
          </div>
        </div>

        <div className={styles.deliveryForm}>
          <h3>Salgynyz:</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Doly adynyz*</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Telefon*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+993 61097651"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Salgynyz*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Salgynyz barada giňişleýin*</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Belik</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.deliveryInfo}>
          <ul>

          </ul>
          <li>
            Eltip bermek hyzmaty Aşgabat şäheriniň çägi bilen bir hatarda
            Büzmeýine we Änew şäherine hem elýeterlidir;
          </li>
          <li>
            Sargydyň iň pes çägi <strong>50 manat</strong> bolmaly; sargydyňyz{" "}
            <strong>150 manatdan</strong> geçse eltip bermek hyzmaty mugt;
          </li>
          <li>
            Saýtdan sargyt edeniňizden soňra operator size jaň edip sargydy
            tassyklar (eger hemişelik müşderi bolsaňyz sargytlaryňyz islegiňize
            göra awtomatik usulda hem tassyklanýar);
          </li>
          <li>
            Sargydy barlap alanyňyzdan soňra töleg amala aşyrylyar. Eltip
            berijiniň size gowşurýan töleg resminamasynda siziň tölemeli puluňyz
            bellenenddir. Töleg nagt we nagt däl görnüşde milli manatda amala
            aşyrylyar. Kabul edip tölegini geçiren harydyňyz yzyna alynmayar.
          </li>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
