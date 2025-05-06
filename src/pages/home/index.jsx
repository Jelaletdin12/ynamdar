import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CategorySection from "../../components/CategorySection/index";
import Carousel from "../../components/Banner/index";
import styles from "./Home.module.scss";
import { useGetCollectionsQuery } from "../../app/api/collectionsApi";
import PageLoader from "../../components/Loader/pageLoader";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { data, error, isLoading } = useGetCollectionsQuery();
  const [visibleCollections, setVisibleCollections] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [processedCollections, setProcessedCollections] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const processCollections = async (collectionsData) => {
    if (!collectionsData || !collectionsData.data) return [];

    // Cache the processed collections to prevent duplicate processing
    const collectionsWithProducts = [];

    for (const collection of collectionsData.data) {
      const hasProducts = await checkIfCollectionHasProducts(collection.id);
      if (hasProducts) {
        collectionsWithProducts.push({
          ...collection,
          hasProductsChecked: true,
          hasProducts: true,
        });
      } else {
        collectionsWithProducts.push({
          ...collection,
          hasProductsChecked: true,
          hasProducts: false,
        });
      }
    }

    return collectionsWithProducts;
  };

  const checkIfCollectionHasProducts = async (collectionId) => {
    // This is a placeholder - your actual implementation would check if products exist
    // For now, we just return true as in your original code
    return true;
  };

  useEffect(() => {
    if (data && data.data) {
      processCollections(data).then((filteredCollections) => {
        setProcessedCollections(filteredCollections);
        loadMoreCollections(filteredCollections);
      });
    }
  }, [data]);

  const loadMoreCollections = (filteredCollections = null) => {
    const collections = filteredCollections || processedCollections;

    if (collections.length > 0) {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newCollections = collections.slice(startIndex, endIndex);

      if (newCollections.length > 0) {
        setVisibleCollections((prev) => [...prev, ...newCollections]);
        setPage(page + 1);
      }

      // Check if we've loaded all collections
      if (endIndex >= collections.length) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  // if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div>
        <Result
          status="500"
          title="500"
          subTitle="Näbelli ýalňyşlyk ýüze çykdy."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Baş sahypa gidiň
            </Button>
          }
        />
      </div>
    );

  return (
    <div className={styles.home}>
      <Carousel />
      <div className={styles.sections}>
        <InfiniteScroll
          dataLength={visibleCollections.length}
          next={loadMoreCollections}
          hasMore={hasMore}
          loader={
            <h4 style={{ textAlign: "center" }}>Loading more collections...</h4>
          }
        >
          {visibleCollections.map((collection) => (
            <CategorySection
              key={collection.id}
              collection={collection}
              preventEmptyRender={true} // Add a prop to prevent rendering empty collections
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
