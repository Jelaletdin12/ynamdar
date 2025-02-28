import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyGetBrandsQuery } from "../../app/api/brandsApi";
import styles from "./Brands.module.scss";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const BrandsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();
  // Brands data state
  const [allBrands, setAllBrands] = useState([]);
  const [visibleBrands, setVisibleBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 40;

  // Use lazy query to have more control over when to fetch
  const [getBrands, { data: brandsData, isLoading, error }] =
    useLazyGetBrandsQuery();

  // Initial fetch on component mount
  useEffect(() => {
    getBrands({ page: 1, limit: itemsPerPage });
  }, []);

  // Process brands data when it arrives
  useEffect(() => {
    if (brandsData) {
      // Add new brands to our collection
      setAllBrands((prev) => {
        // Create a Set of existing IDs for efficient lookup
        const existingIds = new Set(prev.map((brand) => brand.id));
        // Filter out any duplicates and add only new brands
        const newBrands = brandsData.filter(
          (brand) => !existingIds.has(brand.id)
        );
        return [...prev, ...newBrands];
      });

      // Update hasMore based on received data length
      if (brandsData.length < itemsPerPage) {
        setHasMore(false);
      }
    }
  }, [brandsData]);

  // Process brands for display whenever all brands or search term changes
  useEffect(() => {
    if (allBrands.length > 0) {
      // Filter brands by search term
      const filteredBrands = searchTerm
        ? allBrands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allBrands;

      // Group brands by type
      const groupedBrands = filteredBrands.reduce((acc, brand) => {
        const type = brand.type || "other";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(brand);
        return acc;
      }, {});

      // Convert to array format for display
      const displayGroups = Object.entries(groupedBrands)
        .map(([type, brands]) => ({
          title: type.charAt(0).toUpperCase() + type.slice(1),
          brands,
        }))
        .filter((group) => group.brands.length > 0);

      setVisibleBrands(displayGroups);

      // Reset hasMore if we're searching, as we're filtering from loaded data
      if (searchTerm) {
        setHasMore(false);
      }
    }
  }, [allBrands, searchTerm]);

  const loadMoreBrands = () => {
    // Only fetch more if we're not searching
    if (!searchTerm) {
      const nextPage = page + 1;
      getBrands({ page: nextPage, limit: itemsPerPage });
      setPage(nextPage);
    }
  };

  const handleImageLoad = (brandId) => {
    setLoadedImages((prev) => ({ ...prev, [brandId]: true }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleBrandClick = (brandId) => {
    navigate(`/brands/${brandId}`); // Change to /brand/ route
  };
  if (isLoading && page === 1) return <p>{t("common.loading")}</p>;
  if (error) return <p>{t("common.error")}</p>;

  return (
    <div className={styles.brandsContainer}>
      <div className={styles.searchWrapper}>
        <CiSearch />
        <input
          type="text"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <InfiniteScroll
        dataLength={allBrands.length}
        next={loadMoreBrands}
        hasMore={hasMore && !searchTerm}
        loader={<p style={{ textAlign: "center" }}>{t("common.loading")}</p>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>{t("common.noMoreResults")}</b>
          </p>
        }
      >
        {visibleBrands.map((group, index) => (
          <section key={index} className={styles.categorySection}>
            <h2>{group.title}</h2>

            <div className={styles.brandsGrid}>
              {group.brands.map((brand) => (
                <div
                  key={brand.id}
                  className={styles.brandCard}
                  onClick={() => handleBrandClick(brand.id)}
                >
                  <div className={styles.imageWrapper}>
                    {!loadedImages[brand.id] && (
                      <div
                        className={`${styles.placeholder} ${styles.skeleton}`}
                      >
                        {/* Loading placeholder */}
                      </div>
                    )}
                    <img
                      src={brand.media?.[0]?.url || brand.logo}
                      alt={brand.name}
                      width={120}
                      height={120}
                      onLoad={() => handleImageLoad(brand.id)}
                      style={{
                        opacity: loadedImages[brand.id] ? 1 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                  </div>
                  <div className={styles.divider}></div>
                  <h3 className={styles.brandName}>{brand.name}</h3>
                </div>
              ))}
            </div>
          </section>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default BrandsPage;
