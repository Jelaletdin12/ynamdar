import React from "react";
import styles from "./WishListing.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { useTranslation } from "react-i18next";
import EmptyWishListState from "./emptyWishlist";
import { useGetFavoritesQuery } from "../../app/api/favoritesApi";

const WishtList = () => {
  const { t, i18n } = useTranslation();
  const { data: products = [], isFetching, error } = useGetFavoritesQuery();

  const handleAddToCart = (product) => {
    // Implement cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    // Implement favorite toggle logic here
    console.log("Toggling favorite:", product);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading wishlist.</div>;
  }

  return (
    <div className={styles.container}>
      {products.length === 0 ? (
        <EmptyWishListState />
      ) : (
        <>
          <h1 className={styles.title}>{t("wishtList.likedProducts")}</h1>
          <div className={styles.productGrid}>
            {products.map(({ product }) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true} // Since this is wishlist, all items are favorites
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

export default WishtList;