import styles from "./OrderDetail.module.scss";
import order from "../../assets/order.jpg";
import track from "../../assets/track.jpg";
import { Ban, CircleCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
const OrderDetail = () => {
  const { t, i18n } = useTranslation();
  const orderData = {
    id: "250125885309",
    date: "25.01.2025 10:12",
    status: "Garaşylýar",
    deliveryTime: "19:00 - 21:00 (26.01.2025)",
    paymentMethod: "Nagt",
    total: "63.30",
    items: [
      {
        image: order,
        name: 'Kreker "Alvita" duzly 75 gr',
        brand: "Alvita",
        code: "AVT006.015",
        price: "3.80",
        quantity: 2,
        total: "7.60",
      },
      {
        image: order,
        name: "Gaýnadylýan kakadylan towuk jylka eti",
        brand: "Täze aý Şöhlat",
        code: "TZS120828",
        price: "45.70",
        quantity: 1,
        total: "45.70",
      },
      {
        image: track,
        name: "Eltip bermek hyzmaty",
        brand: "Beýleki",
        code: "YNMDELIVERY10",
        price: "10.00",
        quantity: 1,
        total: "10.00",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("order.orderNumber")}: {orderData.id}</h1>
        <div className={styles.Buttons}>
          <button className={styles.repeatButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M480 256c-17.67 0-32 14.31-32 32c0 52.94-43.06 96-96 96H192L192 344c0-9.469-5.578-18.06-14.23-21.94C169.1 318.3 159 319.8 151.9 326.2l-80 72C66.89 402.7 64 409.2 64 416s2.891 13.28 7.938 17.84l80 72C156.4 509.9 162.2 512 168 512c3.312 0 6.615-.6875 9.756-2.062C186.4 506.1 192 497.5 192 488L192 448h160c88.22 0 160-71.78 160-160C512 270.3 497.7 256 480 256zM160 128h159.1L320 168c0 9.469 5.578 18.06 14.23 21.94C337.4 191.3 340.7 192 343.1 192c5.812 0 11.57-2.125 16.07-6.156l80-72C445.1 109.3 448 102.8 448 95.1s-2.891-13.28-7.938-17.84l-80-72c-7.047-6.312-17.19-7.875-25.83-4.094C325.6 5.938 319.1 14.53 319.1 24L320 64H160C71.78 64 0 135.8 0 224c0 17.69 14.33 32 32 32s32-14.31 32-32C64 171.1 107.1 128 160 128z"></path>
            </svg>{" "}
            {t("order.repeatOrder")}
          </button>
          <button className={styles.cancelButton}>
            {" "}
            <Ban />
            {t("order.dropOrder")}
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {/* Sipariş Durumu */}
        <div className={styles.status}>
          <p className={styles.statusText}>
            <span className={styles.statusIcon}>
              <CircleCheck />
            </span>{" "}
            {t("order.Your_order_has_been_accepted")}
          </p>
          <span className={styles.close}>
            <X />
          </span>
        </div>

        {/* Sipariş Detayları */}
        <div className={styles.details}>
          <div className={styles.rowContainer}>
            <div className={styles.row}>
              <span>{t("order.orderDate")}:</span>
              <span>{orderData.date}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.orderStatus")}:</span>
              <span>{orderData.status}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.deliveryTime")}:</span>
              <span>{orderData.deliveryTime}</span>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.row}>
              <span>{t("checkout.paymentMethod")}:</span>
              <span>{orderData.paymentMethod}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.sum")}:</span>
              <span className={styles.total}>{orderData.total} m.</span>
            </div>
          </div>
        </div>

       
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("order.photo")}</th>
                <th>{t("order.productName")}</th>
                <th>{t("order.brand")}</th>
                <th>{t("order.code")}</th>
                <th>{t("order.price")}</th>
                <th>{t("order.quantity")}</th>
                <th>{t("order.sum")}</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.image}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.code}</td>
                  <td>{item.price} m.</td>
                  <td>{item.quantity}</td>
                  <td>{item.total} m.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile */}
      <div className={styles.productList}>
      {orderData.items.map((item) => (
        <div className={styles.card} key={item.id}>
          <div className={styles.imageContainer}>
            <img src={item.image} alt={item.title} />
          </div>
          <div className={styles.detailsMobile}>
            <h3 className={styles.title}>{item.brand}</h3>
            <p className={styles.description}>{item.name}</p>
            <div className={styles.footer}>
              <span className={styles.quantity}>{t("order.quantity")}: {item.quantity}</span>
              <span className={styles.price}>{item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default OrderDetail;
