import styles from "./emptyWishlist.module.scss";
import { useTranslation } from "react-i18next";
import EmptyWishList from "../../assets/wishlist.png"
const EmptyWishListState = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.emptyWishListContainer}>
        
      <div className={styles.emptyWishListContent}>
        <div className={styles.emptyWishListIcon}>
          <img src={EmptyWishList} alt="" />
        </div>
        <h2>{t("wishtList.emptyWishListTitle")}</h2>
        <p>{t("wishtList.emptyWishListMessage")}</p>

        <button
          onClick={() => (window.location.href = "/")}
          className={styles.continueShoppingBtn}
        >
          {t("wishtList.continueShopping")}
        </button>
      </div>
    </div>
  );
};

export default EmptyWishListState;
