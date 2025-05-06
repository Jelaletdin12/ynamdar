import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/index";
import SkeletonProductCard from "../../components/Skeletons/homePage";
import styles from "./CategorySection.module.scss";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useGetCollectionProductsQuery } from "../../app/api/collectionsApi";

const CategorySection = ({
  collection,
  selectedBrand,
  preventEmptyRender = false,
}) => {
  const navigate = useNavigate();
  const {
    data: allProducts,
    error,
    isLoading,
  } = useGetCollectionProductsQuery(collection.id);

  // State to track if this section should be displayed
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Only update visibility when loading is complete and we have data
    if (!isLoading && allProducts) {
      const hasProducts = allProducts.data && allProducts.data.length > 0;
      setShouldRender(hasProducts);
    }
  }, [isLoading, allProducts]);

  const handleClick = () => {
    navigate(`/collections/${collection.id}`);
  };

  // Render skeleton cards while loading
  const renderSkeletons = () => {
    return Array(4)
      .fill(null)
      .map((_, index) => <SkeletonProductCard key={`skeleton-${index}`} />);
  };

  // Render actual products when data is loaded
  const renderProducts = () => {
    if (!allProducts || !allProducts.data || allProducts.data.length === 0)
      return null;

    const filteredProducts = selectedBrand
      ? allProducts.data.filter(
          (product) => product.brand && product.brand.name === selectedBrand
        )
      : allProducts.data;

    return filteredProducts.length > 0
      ? filteredProducts
          .slice(0, 4)
          .map((product) => <ProductCard key={product.id} product={product} />)
      : null;
  };

  // If we're in a state where we shouldn't render, return null immediately
  if (preventEmptyRender && !isLoading && !shouldRender) {
    return null;
  }

  // If still loading and we want to prevent flash, return minimal placeholder
  if (preventEmptyRender && isLoading) {
    return (
      <section className={`${styles.categorySection} ${styles.loadingSection}`}>
        <h2 className={styles.title}>
          {collection.name} <IoIosArrowRoundForward />
        </h2>
        <div className={styles.productList}>{renderSkeletons()}</div>
      </section>
    );
  }

  // If there's data and we decide not to show the section, return null
  if (
    !isLoading &&
    (!allProducts || !allProducts.data || allProducts.data.length === 0)
  ) {
    return null;
  }

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.title} onClick={handleClick}>
        {collection.name} <IoIosArrowRoundForward />
      </h2>
      <div className={styles.productList}>
        {isLoading ? renderSkeletons() : renderProducts()}
      </div>
      {error && (
        <div className={styles.errorMessage}>Failed to load products</div>
      )}
    </section>
  );
};

export default CategorySection;
