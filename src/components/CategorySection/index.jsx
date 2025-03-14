import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/index";
import SkeletonProductCard from "../../components/Skeletons/homePage";
import styles from "./CategorySection.module.scss";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useGetCollectionProductsQuery } from "../../app/api/collectionsApi";

const CategorySection = ({ collection, selectedBrand }) => {
  const navigate = useNavigate();
  const {
    data: allProducts,
    error,
    isLoading,
  } = useGetCollectionProductsQuery(collection.id);

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
    if (!allProducts || !allProducts.data) return null;

    const filteredProducts = selectedBrand
      ? allProducts.data.filter(
          (product) => product.brand && product.brand.name === selectedBrand
        )
      : allProducts.data;

    return filteredProducts
      .slice(0, 4)
      .map((product) => <ProductCard key={product.id} product={product} />);
  };

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
