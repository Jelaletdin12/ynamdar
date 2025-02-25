import React, { useState, useEffect } from "react";
import styles from "./ProductCard.module.scss";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../app/api/favoritesApi';
import { useGetFavoritesQuery } from "../../app/api/favoritesApi";

const ProductCard = ({
  product,
  showAddToCart = true,
  showFavoriteButton = true,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const { data: favoriteProducts = [] } = useGetFavoritesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(favoriteProducts.some(fav => fav.product.id === product.id));

  useEffect(() => {
    // Only update if we have valid favorite products data
    if (Array.isArray(favoriteProducts)) {
      setLocalIsFavorite(favoriteProducts.some(fav => fav.product?.id === product.id));
    }
  }, [favoriteProducts, product.id]);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
    setQuantity(quantity + 1);
  };

  const handleToggleFavorite = async (event) => {
    event.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (localIsFavorite) {
        const result = await removeFavorite(product.id).unwrap();
        // Check if the response is valid
        if (result === "Removed" || (result?.status === 'success')) {
          setLocalIsFavorite(false);
        }
      } else {
        const result = await addFavorite(product.id).unwrap();
        // Check if the response is valid
        if (result === "Added" || (result?.status === 'success')) {
          setLocalIsFavorite(true);
        }
      }
      
      if (onToggleFavorite) {
        onToggleFavorite(product);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Optionally show user feedback here
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
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {product.discount && (
          <span className={styles.discountBadge}>-{product.discount}%</span>
        )}
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
          {/* <div className={styles.rating}>
             {product.reviews.rating} <Star/>
          </div> */}
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
              {quantity > 0 ? (
                <div className={styles.quantityControls}>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setQuantity(quantity - 1);
                    }}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      setQuantity(quantity + 1);
                    }}
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
  );
};

export default ProductCard;