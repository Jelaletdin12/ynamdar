import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLazyGetBrandsQuery } from "../../app/api/brandsApi";
import styles from "./Brands.module.scss";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Icons";
import Loader from "../../components/Loader/index";
import { Result, Button } from "antd";
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
      setAllBrands((prev) => {
        const existingIds = new Set(prev.map((brand) => brand.id));
        const newBrands = brandsData.filter(
          (brand) => !existingIds.has(brand.id)
        );
        return [...prev, ...newBrands];
      });
      if (brandsData.length < itemsPerPage) {
        setHasMore(false);
      }
    }
  }, [brandsData]);

  // Process brands for display whenever all brands or search term changes
  useEffect(() => {
    if (allBrands.length > 0) {
      const filteredBrands = searchTerm
        ? allBrands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allBrands;

      const groupedBrands = filteredBrands.reduce((acc, brand) => {
        const type = brand.type || "other";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(brand);
        return acc;
      }, {});

      const displayGroups = Object.entries(groupedBrands)
        .map(([type, brands]) => ({
          title: type.charAt(0).toUpperCase() + type.slice(1),
          brands,
        }))
        .filter((group) => group.brands.length > 0);
      setVisibleBrands(displayGroups);
      if (searchTerm) {
        setHasMore(false);
      }
    }
  }, [allBrands, searchTerm]);

  const loadMoreBrands = () => {
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
    if (e.target.value !== searchTerm) {
      setPage(1);
      setAllBrands([]);
      setHasMore(true);
      if (e.target.value) {
        getBrands({ page: 1, limit: itemsPerPage, search: e.target.value });
      } else {
        getBrands({ page: 1, limit: itemsPerPage });
      }
    }
  };
  const handleBrandClick = (brandId) => {
    navigate(`/brands/${brandId}`);
  };
  if (isLoading && page === 1) return <Loader />;
  if (error)
    return (
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
    );

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
                    {brand.media?.[0]?.thumbnail ||
                    brand.media?.[0]?.images_800x800 ||
                    brand.logo ? (
                      <img
                        src={
                          brand.media?.[0]?.thumbnail ||
                          brand.media?.[0]?.images_800x800 ||
                          brand.logo
                        }
                        alt={brand.name}
                        width={120}
                        height={120}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div className={styles.logoFallback}>
                        <Logo width={60} height={60} />
                      </div>
                    )}
                    <div
                      className={styles.logoFallback}
                      style={{ display: "none" }}
                    >
                      <Logo width={60} height={60} />
                    </div>
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
