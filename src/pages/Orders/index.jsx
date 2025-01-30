// SargytlarymComponent.jsx
import React from "react";
import styles from "./Orders.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Orders = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sargytlarym</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("order.orderNumber")}</th>
              <th>{t("order.orderDate")}</th>
              <th>{t("order.sum")}</th>
              <th>{t("checkout.paymentMethod")}</th>
              <th>{t("order.orderStatus")}</th>
              <th>{t("order.action")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2501258856309</td>
              <td>25.01.2025 10:12</td>
              <td style={{ color: "#ec6323", fontWeight: "600" }}>63.30 m.</td>
              <td>Nagt</td>
              <td>Goybolsun edili</td>
              <td>
                <Link to={"/orderdetail"}>
                
                <button className={styles.actionButton}>{t("order.information")}</button>
                </Link>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to={"/orderdetail"}>
      <div className={styles.Mobilecontainer}>
        <div className={styles.orderCard}>
          <div className={styles.orderRow}>
            <span className={styles.label}>{t("order.orderNumber")}:</span>
            <span className={styles.value}>250125885309</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>{t("order.orderDate")}</span>
            <span className={styles.value}>25.01.2025 10:12</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>{t("order.sum")}:</span>
            <span className={styles.total}>63.30 m.</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>{t("checkout.paymentMethod")}:</span>
            <span className={styles.value}>Nagt</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>{t("order.orderStatus")}:</span>
            <span className={styles.value}>Goýbolsun edildi</span>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Orders;
