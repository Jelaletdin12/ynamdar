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
import { debounce } from "lodash";
import Loader from "../../components/Loader/index";

// New component for truncated text
const TruncatedDescription = ({ description, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Strip HTML tags for character count
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const plainText = stripHtml(description);
  const shouldTruncate = plainText.length > maxLength;

  return (
    <div className={styles.truncatedDescription}>
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded
            ? description
            : shouldTruncate
            ? description.substring(0, maxLength) + "..."
            : description,
        }}
      />
    </div>
  );
};

const CartPage = () => {
  const {
    data: response = {},
    refetch,
    error,
    isError,
    isLoading,
  } = useGetCartQuery();
  const cartItems = isError ? [] : response.data || [];
  const { t, i18n } = useTranslation();
  const [isCheckout, setIsCheckout] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [cleanCart] = useCleanCartMutation();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedRef = useRef(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [emptyCartModalVisible, setEmptyCartModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [localQuantities, setLocalQuantities] = useState({});
  const [pendingQuantities, setPendingQuantities] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const modalProps = {
    centered: true,
    className: styles.cartDeleteModal,
    maskClosable: false,
    width: 400,
  };

  const handleCheckout = () => setIsCheckout(true);
  const handleBackToCart = () => setIsCheckout(false);
  const checkoutRef = useRef({ current: null });

  useEffect(() => {
    const newLocalQuantities = {};
    const newPendingQuantities = {};

    cartItems.forEach((item) => {
      const productId = item.product.id;
      const quantity = parseInt(item.product_quantity, 10) || 0;
      newLocalQuantities[productId] = quantity;
      newPendingQuantities[productId] = quantity;
    });

    setLocalQuantities(newLocalQuantities);
    setPendingQuantities(newPendingQuantities);
  }, [cartItems]);

  useEffect(() => {
    const updateItem = async (productId) => {
      const serverQuantity =
        cartItems.find((item) => item.product.id === productId)
          ?.product_quantity || 0;
      const pendingQuantity = pendingQuantities[productId];

      if (
        pendingQuantity === undefined ||
        pendingQuantity === parseInt(serverQuantity, 10)
      ) {
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [productId]: true }));

        if (pendingQuantity <= 0) {
          await removeFromCart({ productId }).unwrap();
        } else {
          await updateCartItem({
            productId,
            quantity: pendingQuantity,
          }).unwrap();
        }

        refetch();
      } catch (error) {
        console.error("Failed to update cart:", error);

        const originalItem = cartItems.find(
          (item) => item.product.id === productId
        );
        if (originalItem) {
          const originalQty = parseInt(originalItem.product_quantity, 10) || 0;
          setLocalQuantities((prev) => ({
            ...prev,
            [productId]: originalQty,
          }));
          setPendingQuantities((prev) => ({
            ...prev,
            [productId]: originalQty,
          }));
        }
      } finally {
        setLoadingItems((prev) => ({ ...prev, [productId]: false }));
      }
    };

    const debouncedUpdates = {};
    Object.keys(pendingQuantities).forEach((productId) => {
      if (!debouncedUpdates[productId]) {
        debouncedUpdates[productId] = debounce(
          () => updateItem(productId),
          300
        );
      }
      debouncedUpdates[productId]();
    });

    return () => {
      Object.values(debouncedUpdates).forEach((debouncedFn) =>
        debouncedFn.cancel()
      );
    };
  }, [pendingQuantities, cartItems, updateCartItem, removeFromCart, refetch]);

  const handleQuantityIncrease = (productId) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loadingItems[productId]) return;

    const item = cartItems.find((item) => item.product.id === productId);
    if (!item) return;

    if (localQuantities[productId] >= item.product.stock) {
      return;
    }
    const newQuantity = (localQuantities[productId] || 0) + 1;
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
    setPendingQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleOrderSubmit = async () => {
    if (isCheckout && checkoutRef.current) {
      const success = await checkoutRef.current();
      if (success) {
        refetch();
        setIsCheckout(false);
      }
    } else {
      setIsCheckout(true);
    }
  };

  const handleQuantityDecrease = (productId) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loadingItems[productId]) return;

    const currentQuantity = localQuantities[productId] || 0;

    if (currentQuantity <= 1) {
      showDeleteConfirm(productId);
      return;
    }
    const newQuantity = currentQuantity - 1;
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
    setPendingQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
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

  const handleButtonClick = () => {
    if (isCheckout) {
      handleOrderSubmit();
    } else {
      handleCheckout();
    }
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
      {isLoading ? (
        <Loader />
      ) : cartItems.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className={styles.cartItems}>
          <div className={styles.cartProducts}>
            {isCheckout ? (
              <Checkout
                cartItems={cartItems}
                onBackToCart={handleBackToCart}
                onPlaceOrder={checkoutRef}
              />
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
                        {/* Replace the original description with the TruncatedDescription component */}
                        <TruncatedDescription
                          description={item.product.description}
                          maxLength={150}
                        />
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
                            onClick={handleQuantityDecrease(item.product.id)}
                            className={styles.quantityBtn}
                            disabled={loadingItems[item.product.id]}
                          >
                            <DecreaseIcon />
                          </button>
                          <span>
                            {localQuantities[item.product.id] !== undefined
                              ? localQuantities[item.product.id]
                              : parseInt(item.product_quantity, 10) || 0}
                          </span>
                          <button
                            onClick={handleQuantityIncrease(item.product.id)}
                            className={styles.quantityBtn}
                            disabled={loadingItems[item.product.id]}
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
              <button
                onClick={handleButtonClick}
                className={styles.checkoutBtn}
              >
                {isCheckout ? t("cart.order") : t("cart.prepareOrders")}
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
                    <button
                      onClick={handleButtonClick}
                      className={styles.button}
                    >
                      {isCheckout ? t("cart.order") : t("cart.prepareOrders")}
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
