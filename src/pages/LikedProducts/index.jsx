import React from "react";
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
    refetch,
  } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleAddToCart = (product) => {
    // Implement cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = async (product) => {
    try {
      // Call removeFavorite with the product ID in the body format as required by the API
      await removeFavorite(product.id);
      console.log(product.id);

      // Refetch the favorites list to update the UI
      refetch();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
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
