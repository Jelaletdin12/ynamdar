import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/index";
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const filteredProducts = selectedBrand
    ? allProducts.data.filter(
        (product) => product.brand && product.brand.name === selectedBrand
      )
    : allProducts.data;

  const handleClick = () => {
    navigate(`/collections/${collection.id}`);
  };

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.title} onClick={handleClick}>
        {collection.name} <IoIosArrowRoundForward />
      </h2>
      <div className={styles.productList}>
        {filteredProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;