import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductPage.module.scss";
import { Heart, ShoppingCart } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard/index";
import { useTranslation } from "react-i18next";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../../app/api/categories";

const ProductPage = () => {
  const { productId } = useParams();
  const { t, i18n } = useTranslation();
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

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  const handleAddToCart = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
    if (product) {
      setQuantity(0);
    }
  }, [product]);

  if (productLoading || similarProductsLoading) return <div>Loading...</div>;
  if (productError || similarProductsError) return <div>Error</div>;

  if (!product) return <div>Can not find product</div>;

  const imageUrl = product.media?.[0]?.thumbnail || "";

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>{product?.category?.name || "Category"}</span>
        <span className={styles.separator}>/</span>
        <span>{product?.name || "Product"}</span>
      </div>

      {/* Product Details */}
      <div className={styles.productSection}>
        <div className={styles.productImage}>
          <img src={imageUrl} alt={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <p className={styles.productDescription}>{product.description}</p>

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
              <button
                className={styles.wishlistButton}
                onClick={() => handleToggleFavorite(product)}
              >
                <Heart className={styles.icon} />
              </button>
              {quantity > 0 ? (
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(quantity - 1)}
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
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
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
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ProductPage;
