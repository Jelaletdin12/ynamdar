// Orders.jsx
import React from "react";
import styles from "./Orders.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrdersQuery } from "../../app/api/orderApi"; // Update with your correct path
import EmptyOrderState from "./emptyOrder"; // Import the EmptyOrderState component

const Orders = () => {
  const { t } = useTranslation();
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Function to format date - implement this or use a library like date-fns
  const formatOrderDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("tk-TM", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle loading state
  if (isLoading) return <div className={styles.loading}>Loading orders...</div>;

  // Handle error state
  if (error)
    return (
      <div className={styles.error}>Error loading orders: {error.message}</div>
    );

  // Handle empty orders - render EmptyOrderState component
  if (!orders || orders.length === 0) {
    return <EmptyOrderState />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sargytlarym</h2>

      {/* Desktop table view */}
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
            {orders.map((order) => {
              // Calculate total order amount
              const totalAmount = order.orderItems.reduce(
                (sum, item) =>
                  sum + parseFloat(item.unit_price_amount) * item.quantity,
                0
              );

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatOrderDate(order.delivery_at)}</td>
                  <td style={{ color: "#888888", fontWeight: "700" }}>
                    {totalAmount.toFixed(2)} m.
                  </td>
                  <td>{order.payment_type}</td>
                  <td>{order.status}</td>
                  <td>
                    <Link to={`/orderdetail/${order.id}`}>
                      <button className={styles.actionButton}>
                        {t("order.information")}
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className={styles.Mobilecontainer}>
        {orders.map((order) => {
          const totalAmount = order.orderItems.reduce(
            (sum, item) =>
              sum + parseFloat(item.unit_price_amount) * item.quantity,
            0
          );

          return (
            <Link to={`/orderdetail/${order.id}`} key={order.id}>
              <div className={styles.orderCard}>
                <div className={styles.orderRow}>
                  <span className={styles.label}>
                    {t("order.orderNumber")}:
                  </span>
                  <span className={styles.value}>{order.id}</span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.label}>{t("order.orderDate")}:</span>
                  <span className={styles.value}>
                    {formatOrderDate(order.delivery_at)}
                  </span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.label}>{t("order.sum")}:</span>
                  <span className={styles.total}>
                    {totalAmount.toFixed(2)} m.
                  </span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.label}>
                    {t("checkout.paymentMethod")}:
                  </span>
                  <span className={styles.value}>{order.payment_type}</span>
                </div>
                <div className={styles.orderRow}>
                  <span className={styles.label}>
                    {t("order.orderStatus")}:
                  </span>
                  <span className={styles.value}>{order.status}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
