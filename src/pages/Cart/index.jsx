import React, { useState, useRef, useEffect } from "react";
import styles from "./CartPage.module.scss";
import { FaTrashAlt } from "react-icons/fa";
import Checkout from "../../components/Checkout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import EmptyCartState from "./emptyCart";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useCleanCartMutation,
} from "../../app/api/cartApi";
import { DecreaseIcon, IncreaseIcon } from "../../components/Icons";

const CartPage = () => {
  const { data: response = {}, refetch, error, isError } = useGetCartQuery();
  const cartItems = isError ? [] : response.data || [];
  const { t, i18n } = useTranslation();
  const [isCheckout, setIsCheckout] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem, { isLoading: isUpdating, error: updateError }] =
    useUpdateCartItemMutation();
  const [cleanCart] = useCleanCartMutation();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedRef = useRef(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [emptyCartModalVisible, setEmptyCartModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const modalProps = {
    centered: true,
    className: styles.cartDeleteModal,
    maskClosable: false,
    width: 400,
  };

  const handleCheckout = () => setIsCheckout(true);
  const handleBackToCart = () => setIsCheckout(false);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      showDeleteConfirm(productId);
      return;
    }

    try {
      const result = await updateCartItem({
        productId: productId,
        quantity: newQuantity,
      }).unwrap();

      if (result && result.message === "error") {
        console.error(
          "Server returned an error:",
          result.errorDetails || "Unknown error"
        );
        return;
      }

      refetch();
    } catch (error) {
      console.error("Failed to update cart:", error);

      let errorMessage = "Failed to update cart. Please try again.";

      if (error?.data?.errorDetails) {
        errorMessage = error.data.errorDetails;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      if (process.env.NODE_ENV === "development") {
        console.log("Full error object:", JSON.stringify(error, null, 2));
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(item.product.price_amount) || 0;
      const itemQuantity = parseInt(item.product_quantity, 10) || 0;
      return sum + itemPrice * itemQuantity;
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDeleteConfirm = (productId) => {
    setItemToDelete(productId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await removeFromCart({ productId: itemToDelete }).unwrap();
      refetch();
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const showEmptyCartConfirm = () => {
    setEmptyCartModalVisible(true);
  };

  const handleEmptyCartConfirm = async () => {
    await cleanCart().unwrap();
    refetch();
    setEmptyCartModalVisible(false);
  };

  return (
    <div className={styles.cartContainer}>
      <Modal
        {...modalProps}
        title={t("common.confirm")}
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText={t("common.yes")}
        cancelText={t("common.no")}
      >
        <p>{t("common.Do_you_really_want_to_remove_the_item_from_the_cart")}</p>
      </Modal>

      <Modal
        {...modalProps}
        title={t("common.confirm")}
        open={emptyCartModalVisible}
        onOk={handleEmptyCartConfirm}
        onCancel={() => setEmptyCartModalVisible(false)}
        okText={t("common.yes")}
        cancelText={t("common.no")}
      >
        <p>{t("common.Are_you_sure_you_want_to_empty_the_cart")}</p>
      </Modal>
      {cartItems.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className={styles.cartItems}>
          <div className={styles.cartProducts}>
            {isCheckout ? (
              <Checkout cartItems={cartItems} onBackToCart={handleBackToCart} />
            ) : (
              <div className={styles.cartItemContainer}>
                <div className={styles.cartHeader}>
                  <h2>
                    {t("cart.basket")} (
                    {cartItems.reduce(
                      (sum, item) => sum + parseInt(item.product_quantity, 10),
                      0
                    )}
                    )
                  </h2>
                  <div>
                    <button
                      className={styles.deleteBtn}
                      style={{ padding: "4px 12px" }}
                      onClick={showEmptyCartConfirm}
                    >
                      <FaTrashAlt /> {t("cart.clearCart")}
                    </button>
                  </div>
                </div>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img
                        src={item.product.media[0]?.images_400x400}
                        alt={item.product.name}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <div style={{ flex: "1" }}>
                        <h3>{item.product.name}</h3>
                        <p
                        dangerouslySetInnerHTML={{ __html: item.product.description }}
                        ></p>
                      </div>
                      <div className={styles.priceQuantity}>
                        <span className={styles.price}>
                          {(parseFloat(item.product.price_amount) || 0).toFixed(
                            2
                          )}{" "}
                          m.
                        </span>
                        <div className={styles.quantityControls}>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                parseInt(item.product_quantity, 10) - 1
                              )
                            }
                            className={styles.quantityBtn}
                          >
                            <DecreaseIcon />
                          </button>
                          <span>{parseInt(item.product_quantity, 10)}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                parseInt(item.product_quantity, 10) + 1
                              )
                            }
                            className={styles.quantityBtn}
                          >
                            <IncreaseIcon />
                          </button>
                        </div>
                      </div>
                      <div className={styles.deleteBtnContainer}>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => showDeleteConfirm(item.product.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.cartSummary}>
              <div className={styles.cartContent}>
                <h3> {t("cart.basket")}:</h3>
                <div className={styles.summaryRow}>
                  <span> {t("cart.price")}:</span>
                  <span>{calculateTotal().toFixed(2)} m.</span>
                </div>
                <div className={styles.summaryRow}>
                  <span> {t("cart.delivery")} :</span>
                  <span>0.00 m.</span>
                </div>
                <div className={styles.summaryRow}>
                  <span> {t("cart.total")}:</span>
                  <span>{calculateTotal().toFixed(2)} m.</span>
                </div>
              </div>
              <button onClick={handleCheckout} className={styles.checkoutBtn}>
                {t("cart.prepareOrders")}
              </button>
            </div>

            <div className={styles.container}>
              <div className={styles.summaryCard} ref={expandedRef}>
                <div
                  className={`${styles.expandedContent} ${
                    isExpanded ? styles.visible : ""
                  }`}
                >
                  <div className={styles.details}>
                    <div className={styles.row}>
                      <span> {t("cart.price")}:</span>
                      <span className={styles.amount}>
                        {calculateTotal().toFixed(2)} m.
                      </span>
                    </div>
                    <div className={styles.row}>
                      <span> {t("cart.delivery")}:</span>
                      <span className={styles.amount}>0.00 m.</span>
                    </div>
                  </div>
                </div>
                <div className={styles.header}>
                  <div
                    className={styles.titleWrapper}
                    onClick={(e) => {
                      setIsExpanded(!isExpanded);
                      e.target.style.outline = "none";
                    }}
                  >
                    <span>
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                      {t("cart.total")}:
                    </span>
                    <span className={styles.amount}>
                      {calculateTotal().toFixed(2)} m.
                    </span>
                  </div>
                  <div className={styles.actionWrapper}>
                    <button onClick={handleCheckout} className={styles.button}>
                      {t("cart.prepareOrders")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
