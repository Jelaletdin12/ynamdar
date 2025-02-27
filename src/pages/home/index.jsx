import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CategorySection from "../../components/CategorySection/index";
import Carousel from "../../components/Banner/index";
import styles from "./Home.module.scss";
import { useGetCollectionsQuery } from "../../app/api/collectionsApi";

const Home = () => {
  const { data, error, isLoading } = useGetCollectionsQuery();
  const [collections, setCollections] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (data && data.data) {
      // Initialize with first 10 collections
      loadMoreCollections();
    }
  }, [data]);

  const loadMoreCollections = () => {
    if (data && data.data) {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newCollections = data.data.slice(startIndex, endIndex);
      
      if (newCollections.length > 0) {
        setCollections([...collections, ...newCollections]);
        setPage(page + 1);
      }
      
      // Check if we've loaded all collections
      if (endIndex >= data.data.length) {
        setHasMore(false);
      }
    }
  };

  if (isLoading) return <div>Loading..</div>;
  if (error) return <div>Error</div>;

  return (
    <div className={styles.home}>
      <Carousel />
      <div className={styles.sections}>
        <InfiniteScroll
          dataLength={collections.length}
          next={loadMoreCollections}
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: 'center' }}>Loading more collections...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You have seen all collections</b>
            </p>
          }
        >
          {collections.map((collection) => (
            <CategorySection key={collection.id} collection={collection} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;