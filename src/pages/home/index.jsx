import React from "react";
import CategorySection from "../../components/CategorySection/index";
import Carousel from "../../components/Banner/index";
import styles from "./Home.module.scss";
import { useGetCollectionsQuery } from "../../app/api/collectionsApi";

const Home = () => {
  const { data: collections, error, isLoading } = useGetCollectionsQuery();

  if (isLoading) return <div>Loading..</div>
  if (error) return <div>Error</div>;

  return (
    <div className={styles.home}>
      <div className={styles.sections}>
        <Carousel />
        {collections.data.map((collection) => (
          <CategorySection key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

export default Home;