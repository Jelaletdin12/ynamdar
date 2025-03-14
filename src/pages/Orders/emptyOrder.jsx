import styles from "./emptyOrder.module.scss";
import { useTranslation } from "react-i18next";
import EmptyCart from "../../assets/cart.png"
const EmptyCartState = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.emptyCartContainer}>
      <div className={styles.emptyCartContent}>
        <div className={styles.emptyCartIcon}>
          <img src={EmptyCart} alt="" />
        </div>
        <h2>{t("cart.emptyCartTitle")}</h2>
        <p>{t("cart.emptyCartMessage")}</p>

        <button
          onClick={() => (window.location.href = "/")}
          className={styles.continueShoppingBtn}
        >
          {t("cart.continueShopping")}
        </button>
      </div>
    </div>
  );
};

export default EmptyCartState;
