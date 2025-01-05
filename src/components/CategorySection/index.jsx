import React from "react";
import ProductCard from "../ProductCard/index";
import styles from "./CategorySection.module.scss";
import { IoIosArrowRoundForward } from "react-icons/io"

const CategorySection = ({ title, products }) => {
  return (
    <section className={styles.categorySection}>
      <h2 className={styles.title}>{title} <IoIosArrowRoundForward /></h2>
      <div className={styles.productList}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
