import { useParams } from "react-router-dom";
import styles from "./OrderDetail.module.scss";
import { Ban, CircleCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetOrderByIdQuery } from "../../app/api/orderApi"; // Update with your correct path
import track from "../../assets/track.jpg"; // Keep for delivery service icon

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get the order ID from URL params
  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(id);

  // Format date function
  const formatDate = (dateString) => {
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

  // Format delivery time for display
  const formatDeliveryTime = (time, date) => {
    try {
      const deliveryDate = new Date(date);
      const formattedDate = deliveryDate.toLocaleDateString("tk-TM", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${time} (${formattedDate})`;
    } catch (e) {
      return `${time}`;
    }
  };

  // Calculate total order amount
  const calculateTotal = (orderItems) => {
    if (!orderItems || !orderItems.length) return 0;
    return orderItems
      .reduce(
        (sum, item) => sum + parseFloat(item.unit_price_amount) * item.quantity,
        0
      )
      .toFixed(2);
  };

  // Handle loading state
  if (isLoading)
    return <div className={styles.loading}>Loading order details...</div>;

  // Handle error state
  if (error)
    return (
      <div className={styles.error}>Error loading order: {error.message}</div>
    );

  // Handle case where order data is not available
  if (!orderData) return <div className={styles.notFound}>Order not found</div>;

  // Calculate total
  const totalAmount = calculateTotal(orderData.orderItems);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          {t("order.orderNumber")}: {orderData.id}
        </h1>
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
        {/* Order Status */}
        {/* <div className={styles.status}>
          <p className={styles.statusText}>
            <span className={styles.statusIcon}>
              <CircleCheck />
            </span>{" "}
            {t("order.Your_order_has_been_accepted")}
          </p>
          <span className={styles.close}>
            <X />
          </span>
        </div> */}

        {/* Order Details */}
        <div className={styles.details}>
          <div className={styles.rowContainer}>
            <div className={styles.row}>
              <span>{t("order.orderDate")}:</span>
              <span>{formatDate(orderData.delivery_at)}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.orderStatus")}:</span>
              <span>{orderData.status}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.deliveryTime")}:</span>
              <span>
                {formatDeliveryTime(
                  orderData.delivery_time,
                  orderData.delivery_at
                )}
              </span>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.row}>
              <span>{t("checkout.paymentMethod")}:</span>
              <span>{orderData.payment_type}</span>
            </div>
            <div className={styles.row}>
              <span>{t("order.sum")}:</span>
              <span className={styles.total}>{totalAmount} m.</span>
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
              {orderData.orderItems.map((item, index) => {
                const product = item.product;
                const itemTotal = (
                  parseFloat(item.unit_price_amount) * item.quantity
                ).toFixed(2);

                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className={styles.image}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.brand || "-"}</td>
                    <td>{product.id || "-"}</td>
                    <td>{item.unit_price_amount} m.</td>
                    <td>{item.quantity}</td>
                    <td>{itemTotal} m.</td>
                  </tr>
                );
              })}
              {/* Add delivery service row if shipping method exists */}
              {orderData.shipping_method && (
                <tr>
                  <td>
                    <img
                      src={track}
                      alt="Delivery Service"
                      className={styles.image}
                    />
                  </td>
                  <td>Eltip bermek hyzmaty</td>
                  <td>Beýleki</td>
                  <td>DELIVERY</td>
                  <td>10.00 m.</td>{" "}
                  {/* You may need to get actual delivery cost from API */}
                  <td>1</td>
                  <td>10.00 m.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile View */}
      <div className={styles.productList}>
        {orderData.orderItems.map((item, index) => {
          const product = item.product;
          const itemTotal = (
            parseFloat(item.unit_price_amount) * item.quantity
          ).toFixed(2);

          return (
            <div className={styles.card} key={index}>
              <div className={styles.imageContainer}>
                <img src={product.thumbnail} alt={product.name} />
              </div>
              <div className={styles.detailsMobile}>
                <h3 className={styles.title}>
                  {product.brand || product.name}
                </h3>
                <p className={styles.description}>{product.name}</p>
                <div className={styles.footer}>
                  <span className={styles.quantity}>
                    {t("order.quantity")}: {item.quantity}
                  </span>
                  <span className={styles.price}>
                    {item.unit_price_amount} m.
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {/* Add delivery service card if shipping method exists */}
        {orderData.shipping_method && (
          <div className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={track} alt="Delivery Service" />
            </div>
            <div className={styles.detailsMobile}>
              <h3 className={styles.title}>Beýleki</h3>
              <p className={styles.description}>Eltip bermek hyzmaty</p>
              <div className={styles.footer}>
                <span className={styles.quantity}>
                  {t("order.quantity")}: 1
                </span>
                <span className={styles.price}>10.00 m.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
