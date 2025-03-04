import React, { useState } from "react";
import styles from "./WishListing.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { useTranslation } from "react-i18next";
import EmptyWishListState from "./emptyWishlist";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../app/api/favoritesApi";

const WishList = () => {
  const { t } = useTranslation();
  const {
    data: products = [],
    isFetching,
    error,
  } = useGetFavoritesQuery(undefined, {
    // Add cache handling to help with optimistic updates
    refetchOnMountOrArgChange: true
  });
  
  const [removeFavorite] = useRemoveFavoriteMutation();
  // Track items being removed for optimistic UI updates
  const [removingItems, setRemovingItems] = useState(new Set());

  const handleAddToCart = (product) => {
    // Implement cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = async (product) => {
    try {
      // Add product ID to removing set for optimistic UI update
      setRemovingItems(prev => new Set(prev).add(product.id));
      
      // Call API to remove from favorites
      await removeFavorite(product.id);
      
      // We don't need to explicitly call refetch() here - RTK Query will 
      // automatically invalidate and refetch due to the mutation
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    } finally {
      // Remove from the set whether successful or not
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  if (isFetching && products.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading wishlist.</div>;
  }

  // Filter out items that are being removed for optimistic UI update
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
            {displayedProducts.map(({ product }) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={() => handleToggleFavorite(product)}
                showFavoriteButton={true}
                showAddToCart={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishList;