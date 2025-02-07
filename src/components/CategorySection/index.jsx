import React from "react";
import ProductCard from "../ProductCard/index";
import styles from "./CategorySection.module.scss";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useGetAllCategoryProductsQuery } from "../../app/api/categories";

const CategorySection = ({ category }) => {
  const { data: allProducts, error, isLoading } = useGetAllCategoryProductsQuery(category);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.title}>
        {category.name} <IoIosArrowRoundForward />
      </h2>
      <div className={styles.productList}>
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;