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
  const [collections, setCollections] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

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
          dataLength={collections.length}
          next={loadMoreCollections}
          hasMore={hasMore}
          loader={
            <h4 style={{ textAlign: "center" }}>Loading more collections...</h4>
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
