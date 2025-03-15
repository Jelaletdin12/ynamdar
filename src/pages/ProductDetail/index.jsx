import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductPage.module.scss";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard/index";
import { useTranslation } from "react-i18next";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../../app/api/categories";
import ReviewSection from "../../components/Review/index";
import { Modal } from "antd";

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
import ImageCarousel from "../../components/ProductCard/imageCarousel/index";
const ProductPage = ({
  productProp,
  showAddToCart = true,
  showFavoriteButton = true,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { t } = useTranslation();
  const {
    data: productResponse,
    error: productError,
    isLoading: productLoading,
  } = useGetProductByIdQuery(productId);
  const {
    data: similarProductsResponse,
    error: similarProductsError,
    isLoading: similarProductsLoading,
  } = useGetRelatedProductsQuery(productId);
  const [quantity, setQuantity] = useState(0);
  const product = productResponse?.data;
  const similarProducts = similarProductsResponse?.data;
  const [stockErrorModalVisible, setStockErrorModalVisible] = useState(false);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const { data: favoriteProducts = [], refetch } = useGetFavoritesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(
    favoriteProducts.some((fav) => fav.product?.id === product?.id)
  );
  const { data: cartData } = useGetCartQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data,
    }),
  });
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [localQuantity, setLocalQuantity] = useState(0);
  const cartItem = cartData?.data?.find(
    (item) =>
      item.product?.id === product?.id || item.product_id === product?.id
  );
  const [pendingQuantity, setPendingQuantity] = useState(0);

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
        (fav) => fav.product?.id === product?.id
      );
      setLocalIsFavorite(isFav);
    }
  }, [favoriteProducts, product?.id]);

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

    if (isLoading) return;

    if (localQuantity >= product.stock) {
      setStockErrorModalVisible(true);
      return;
    }

    setLocalQuantity((prev) => prev + 1);
    setPendingQuantity((prev) => prev + 1);
  };

  // Update quantity decrease handler
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
  }, [pendingQuantity, quantity, product, updateCartItem]);

  if (productLoading || similarProductsLoading) return <div>Loading...</div>;
  if (productError || similarProductsError) return <div>Error</div>;

  if (!product) return <div>Can not find product</div>;

  const imageUrl = product.media?.[0]?.thumbnail || "";
  const categoryName = product.categories?.[0]?.name || "Category";
  const categoryId = product.categories?.[0]?.id;
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span onClick={() => handleCategoryClick(categoryId)}>
          {categoryName}
        </span>
        <span className={styles.separator}>/</span>
        <span>{product?.name || "Product"}</span>
      </div>

      {/* Product Details */}
      <div className={styles.productSection}>
        <div className={styles.productImage}>
        <ImageCarousel images={product.media} altText={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <p
            className={styles.productDescription}
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>

          <div className={styles.productMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                {t("product.productCode")}
              </span>
              <span className={styles.metaValue}>{product.id}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("product.barCode")}</span>
              <span className={styles.metaValue}>{product.barcode}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Stokta</span>
              <span className={styles.metaValue}>{product.stock}</span>
            </div>
          </div>
          <div className={styles.productActions}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>{product.price_amount} m.</span>
              <span className={styles.oldPrice}>
                {product.old_price_amount} m.
              </span>
            </div>
            <div className={styles.Btn}>
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
          <div
            className={styles.productActionsMobile}
            style={{ position: "sticky", bottom: "59px" }}
          >
            <div className={styles.priceContainer}>
              {" "}
              <span className={styles.price}>{product.price_amount} m.</span>
              <span className={styles.oldPrice}>
                {product.old_price_amount} m.
              </span>
            </div>
            <div className={styles.Btn}>
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
      </div>
      <ReviewSection
        productId={productId}
        existingReviews={product.reviews_resources}
        reviewStats={product.reviews}
      />

      {/* Similar Products */}
      <div className={styles.similarProducts}>
        <h2 className={styles.sectionTitle}>{t("product.similarProducts")}</h2>
        <div className={styles.productsGrid}>
          {Array.isArray(similarProducts) &&
            similarProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                showAddToCart={true}
                showFavoriteButton={true}
                isFavorite={false}
              />
            ))}
        </div>
      </div>

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
    </div>
  );
};

export default ProductPage;
