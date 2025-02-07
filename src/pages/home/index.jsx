import React from "react";
import CategorySection from "../../components/CategorySection/index";
import Carousel from "../../components/Banner/index";
import styles from "./Home.module.scss";
import { useGetCategoriesQuery } from "../../app/api/categories";

const Home = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <div>Loadin...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className={styles.home}>
      <div className={styles.sections}>
        <Carousel />
        {categories.data.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Home;