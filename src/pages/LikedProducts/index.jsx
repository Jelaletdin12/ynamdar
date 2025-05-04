import React, { useState } from "react";
import styles from "./WishListing.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { useTranslation } from "react-i18next";
import EmptyWishListState from "./emptyWishlist";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../app/api/favoritesApi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader/index";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
const WishList = () => {
  const { t } = useTranslation();
  const {
    data: products = [],
    isFetching,
    error,
  } = useGetFavoritesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();
  const [removeFavorite] = useRemoveFavoriteMutation();
  // Track items being removed for optimistic UI updates
  const [removingItems, setRemovingItems] = useState(new Set());
  // Track items being animated out
  const [animatingItems, setAnimatingItems] = useState(new Set());

  const handleAddToCart = (product) => {
    // Implement cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = async (product) => {
    try {
      // Add to animating set first for smooth visual transition
      setAnimatingItems((prev) => new Set(prev).add(product.id));

      // Wait a brief moment for animation to begin before making API call
      setTimeout(async () => {
        // Add product ID to removing set for optimistic UI update
        setRemovingItems((prev) => new Set(prev).add(product.id));

        // Call API to remove from favorites
        await removeFavorite(product.id);
      }, 300);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      // If there's an error, remove from animating set
      setAnimatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    } finally {
      // Remove from the removing set after API call completes
      setTimeout(() => {
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }, 500);
    }
  };

  if (isFetching && products.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Näbelli ýalňyşlyk ýüze çykdy."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Baş sahypa gidiň
          </Button>
        }
      />
    );
  }

  // Filter out items that have been completely removed
  const displayedProducts = products.filter(
    ({ product }) => !removingItems.has(product.id)
  );

  return (
    <div className={styles.container}>
      {displayedProducts.length === 0 ? (
        <EmptyWishListState />
      ) : (
        <>
          <h1 className={styles.title}>{t("wishtList.likedProducts")}</h1>
          <div className={styles.productGrid}>
            <AnimatePresence>
              {displayedProducts.map(({ product }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: animatingItems.has(product.id) ? 0.5 : 1,
                    scale: animatingItems.has(product.id) ? 0.95 : 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: -20,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.3 }}
                  className={
                    animatingItems.has(product.id) ? styles.removingItem : ""
                  }
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={() => handleToggleFavorite(product)}
                    showFavoriteButton={true}
                    showAddToCart={true}
                   
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default WishList;
