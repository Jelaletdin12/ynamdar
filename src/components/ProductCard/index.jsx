import React, { useState, useEffect } from "react";
import styles from "./ProductCard.module.scss";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { debounce } from "lodash";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../app/api/favoritesApi";
import { useGetFavoritesQuery } from "../../app/api/favoritesApi";
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetCartQuery,
} from "../../app/api/cartApi";
import { Modal } from "antd"; 
import { useTranslation } from "react-i18next"; 

const ProductCard = ({
  product,
  showAddToCart = true,
  showFavoriteButton = true,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const [stockErrorModalVisible, setStockErrorModalVisible] = useState(false);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const { data: favoriteProducts = [], refetch } = useGetFavoritesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(
    favoriteProducts.some((fav) => fav.product?.id === product.id)
  );
  // Get cart data and keep it updated
  const { data: cartData } = useGetCartQuery(undefined, {
    // Use selective cache to reduce unnecessary re-renders
    selectFromResult: (result) => ({
      data: result.data,
    }),
  });
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Find this product in the cart to get its quantity
  const cartItem = cartData?.data?.find(
    (item) => item.product?.id === product.id || item.product_id === product.id
  );
  const quantity = cartItem?.quantity || cartItem?.product_quantity || 0;
  const [localQuantity, setLocalQuantity] = useState(0);
  const [pendingQuantity, setPendingQuantity] = useState(localQuantity);
  // Update local quantity when cart data changes
  useEffect(() => {
    if (cartItem) {
      setLocalQuantity(cartItem.quantity || cartItem.product_quantity || 0);
    } else {
      setLocalQuantity(0);
    }
  }, [cartData, cartItem]);

  useEffect(() => {
    if (Array.isArray(favoriteProducts)) {
      const isFav = favoriteProducts.some(
        (fav) => fav.product?.id === product.id
      );
      setLocalIsFavorite(isFav);
    }
  }, [favoriteProducts, product.id]);

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if stock is available
    if (product.stock <= 0) {
      setStockErrorModalVisible(true);
      return;
    }

    // Badge sayısını anında güncelle
    setLocalQuantity((prev) => prev + 1);
    setPendingQuantity((prev) => prev + 1); // Hemen güncelle

    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setLocalQuantity((prev) => prev - 1); // Başarısız olursa geri al
      setPendingQuantity((prev) => prev - 1); // Başarısız olursa geri al
    }
  };

  useEffect(() => {
    const updateCart = debounce(async () => {
      if (pendingQuantity !== localQuantity) {
        try {
          await updateCartItem({
            productId: product.id,
            quantity: pendingQuantity,
          }).unwrap();
        } catch (error) {
          console.error("Failed to update cart item:", error);
        }
      }
    }, 500);

    updateCart();

    return () => updateCart.cancel();
  }, [pendingQuantity]);

  const handleQuantityIncrease = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if adding would exceed stock
    if (localQuantity >= product.stock) {
      setStockErrorModalVisible(true);
      return;
    }

    setLocalQuantity((prev) => prev + 1);
    setPendingQuantity((prev) => prev + 1);
  };

  const handleQuantityDecrease = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (pendingQuantity <= 1) {
      setPendingQuantity(0);
      setLocalQuantity(0);
      removeFromCart({ productId: product.id })
        .unwrap()
        .catch(() => {
          setLocalQuantity(1);
          setPendingQuantity(1);
        });
    } else {
      setLocalQuantity((prev) => prev - 1);
      setPendingQuantity((prev) => prev - 1);
    }
  };

  const handleToggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (localIsFavorite) {
        const result = await removeFavorite(product.id).unwrap();
        if (result === "Removed" || result?.status === "success") {
          setLocalIsFavorite(false);
        }
      } else {
        const result = await addFavorite(product.id).unwrap();
        if (result === "Added" || result?.status === "success") {
          setLocalIsFavorite(true);
        }
      }
      // Refetch after changing favorite status
      await refetch();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const { name, price_amount, old_price_amount, media = [], reviews } = product;

  const imageUrl = media[0]?.images_400x400 || "";

  return (
    <>
      <div className={styles.productCard} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          {product.discount && (
            <span className={styles.discountBadge}>-{product.discount}%</span>
          )}
          {/* {product.stock === 0 && (
            <span className={`${styles.discountBadge} ${styles.outOfStock}`}>
              {t("common.out_of_stock")}
            </span>
          )} */}
          <img src={imageUrl} alt={name} className={styles.productImage} />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.priceContainer}>
            <div>
              <span className={styles.currentPrice}>{price_amount} m.</span>
              {old_price_amount && (
                <span className={styles.oldPrice}>{old_price_amount} m.</span>
              )}
            </div>
          </div>
          <div className={styles.actions}>
            {showFavoriteButton && (
              <button
                className={styles.favoriteButton}
                onClick={handleToggleFavorite}
              >
                {localIsFavorite ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </button>
            )}
            {showAddToCart && (
              <>
                {localQuantity > 0 ? (
                  <div className={styles.quantityControls}>
                    <button
                      onClick={handleQuantityDecrease}
                      className={styles.quantityBtn}
                    >
                      <svg
                        viewBox="0 0 9 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.41422 6.86246C0.633166 6.08141 0.633165 4.81508 1.41421 4.03403L4.61487 0.833374C5.8748 -0.426555 8.02908 0.465776 8.02908 2.24759V8.6489C8.02908 10.4307 5.8748 11.323 4.61487 10.0631L1.41422 6.86246Z"
                          fill="white"
                        ></path>
                      </svg>
                    </button>
                    <span>{localQuantity}</span>
                    <button
                      onClick={handleQuantityIncrease}
                      className={styles.quantityBtn}
                    >
                      <svg
                        viewBox="0 0 9 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.64389 4.03427C7.42494 4.81532 7.42494 6.08165 6.64389 6.8627L3.44324 10.0634C2.18331 11.3233 0.0290222 10.431 0.0290226 8.64914V2.24783C0.0290226 0.466021 2.18331 -0.426312 3.44324 0.833617L6.64389 4.03427Z"
                          fill="white"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stock Error Modal */}
      <Modal
        title={t("common.warning")}
        open={stockErrorModalVisible}
        onOk={() => setStockErrorModalVisible(false)}
        onCancel={() => setStockErrorModalVisible(false)}
        okText={t("common.ok")}
        footer={[
          <button
            key="ok"
            onClick={() => setStockErrorModalVisible(false)}
            className={styles.modalButton}
          >
            {t("common.ok")}
          </button>,
        ]}
      >
        <p>
          {t("common.not_enough_stock", {
            available: product.stock,
            requested: localQuantity + 1,
          })}
        </p>
      </Modal>
    </>
  );
};

export default ProductCard;
