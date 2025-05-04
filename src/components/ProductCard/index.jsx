import { useState, useEffect } from "react";
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
import { DecreaseIcon, IncreaseIcon } from "../Icons";
import ImageCarousel from "./imageCarousel/index";

// Helper function to strip HTML tags and truncate text
const truncateDescription = (htmlString, maxLength = 80) => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Get text content without HTML tags
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  // Truncate the text
  const truncatedText =
    textContent.length > maxLength
      ? textContent.substring(0, maxLength).trim() + "..."
      : textContent;

  return truncatedText;
};

const ProductCard = ({
  product,
  showAddToCart = true,
  showFavoriteButton = true,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  descriptionMaxLength = 85, // New prop to control description length
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
  // Process description
  const truncatedDesc = truncateDescription(
    product.description,
    descriptionMaxLength
  );

  const { data: cartData } = useGetCartQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data,
    }),
  });

  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartItem = cartData?.data?.find(
    (item) => item.product?.id === product.id || item.product_id === product.id
  );
  const quantity = cartItem?.quantity || cartItem?.product_quantity || 0;
  const [localQuantity, setLocalQuantity] = useState(0);
  const [pendingQuantity, setPendingQuantity] = useState(localQuantity);

  useEffect(() => {
    if (cartItem) {
      setLocalQuantity(cartItem.quantity || cartItem.product_quantity || 0);
      setPendingQuantity(cartItem.quantity || cartItem.product_quantity || 0);
    } else {
      setLocalQuantity(0);
      setPendingQuantity(0);
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
    if (product.stock <= 0) {
      setStockErrorModalVisible(true);
      return;
    }
    setLocalQuantity((prev) => prev + 1);
    setPendingQuantity((prev) => prev + 1);
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setLocalQuantity((prev) => prev - 1);
      setPendingQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const updateCart = async () => {
      if (pendingQuantity !== quantity && pendingQuantity > 0) {
        try {
          setIsLoading(true);
          await updateCartItem({
            productId: product.id,
            quantity: pendingQuantity,
          }).unwrap();
        } catch (error) {
          console.error("Failed to update cart item:", error);
          setLocalQuantity(quantity);
          setPendingQuantity(quantity);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debouncedUpdate = debounce(updateCart, 300);

    if (pendingQuantity !== quantity) {
      debouncedUpdate();
    }

    return () => debouncedUpdate.cancel();
  }, [pendingQuantity, quantity, product.id, updateCartItem]);

  const handleQuantityIncrease = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) return;

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

    if (isLoading) return;

    if (pendingQuantity <= 1) {
      setPendingQuantity(0);
      setLocalQuantity(0);
      setIsLoading(true);
      removeFromCart({ productId: product.id })
        .unwrap()
        .catch(() => {
          setLocalQuantity(1);
          setPendingQuantity(1);
        })
        .finally(() => {
          setIsLoading(false);
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

  return (
    <>
      <div className={styles.productCard} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          {product.discount && (
            <span className={styles.discountBadge}>-{product.discount}%</span>
          )}
          {product.stock === 0 && (
            <span className={`${styles.discountBadge} ${styles.outOfStock}`}>
              {t("common.out_of_stock")}
            </span>
          )}

          <ImageCarousel images={media} altText={name} />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>

          {/* Simple truncated description */}
          <p className={styles.productDescription}>{truncatedDesc}</p>

          <div className={styles.priceContainer}>
            <div>
              <span className={styles.currentPrice}>{price_amount} m.</span>
              {old_price_amount && (
                <span className={styles.oldPrice}>{old_price_amount} m.</span>
              )}
            </div>
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
                    <DecreaseIcon />
                  </button>
                  <span>{localQuantity}</span>
                  <button
                    onClick={handleQuantityIncrease}
                    className={styles.quantityBtn}
                  >
                    <IncreaseIcon />
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
