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
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Pre-process collections to only include those with products
  const processCollections = async (collectionsData) => {
    if (!collectionsData || !collectionsData.data) return [];
    
    // Filter out collections with no products
    const collectionsWithProducts = [];
    
    for (const collection of collectionsData.data) {
      // Here we're checking if there are products in this collection
      // This could be done with a separate query or a property check
      const hasProducts = await checkIfCollectionHasProducts(collection.id);
      if (hasProducts) {
        collectionsWithProducts.push(collection);
      }
    }
    
    return collectionsWithProducts;
  };
  
  // A mock function to check if collection has products - replace with your actual implementation
  const checkIfCollectionHasProducts = async (collectionId) => {
    // In a real implementation, you might want to:
    // 1. Check cached data if available
    // 2. Make a lightweight API call that just returns a count
    // 3. Or modify your API to include a product count with each collection
    
    // For demo purposes, let's assume we're checking data that's been fetched elsewhere
    // Return true if the collection has products, false otherwise
    return true; // Replace with actual implementation
  };

  useEffect(() => {
    if (data && data.data) {
      processCollections(data).then(filteredCollections => {
        // Initialize with first batch of filtered collections
        loadMoreCollections(filteredCollections);
      });
    }
  }, [data]);

  const loadMoreCollections = (filteredCollections = null) => {
    const collections = filteredCollections || visibleCollections;
    
    if (collections.length > 0) {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newCollections = collections.slice(startIndex, endIndex);

      if (newCollections.length > 0) {
        setVisibleCollections(prev => [...prev, ...newCollections]);
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

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div>
        {" "}
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