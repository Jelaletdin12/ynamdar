import styles from "./emptyOrder.module.scss";
import { useTranslation } from "react-i18next";
import order from "../../assets/order.png"
const EmptyOrderState = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.emptyCartContainer}>
      <div className={styles.emptyCartContent}>
        <div className={styles.emptyCartIcon}>
          <img src={order} alt="" />
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

export default EmptyOrderState;
