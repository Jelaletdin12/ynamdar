import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery } from "../../app/api/brandsApi";
import styles from "./Brands.module.scss";
import { CiSearch } from "react-icons/ci";
// import { Audio,  } from 'react-loader-spinner';

const BrandsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: brandsData, isLoading, error } = useGetBrandsQuery();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (brandId) => {
    setLoadedImages((prev) => ({ ...prev, [brandId]: true }));
  };

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p>{t("common.error")}</p>;

  const groupedBrands = brandsData?.reduce((acc, brand) => {
    const type = brand.type || "other";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(brand);
    return acc;
  }, {});

  const filteredGroups = groupedBrands
    ? Object.entries(groupedBrands)
        .map(([type, brands]) => ({
          title: type.charAt(0).toUpperCase() + type.slice(1),
          brands: brands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((group) => group.brands.length > 0)
    : [];

  return (
    <div className={styles.brandsContainer}>
      <div className={styles.searchWrapper}>
        <CiSearch />
        <input
          type="text"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGroups.map((group, index) => (
        <section key={index} className={styles.categorySection}>
          <h2>{group.title}</h2>

          <div className={styles.brandsGrid}>
            {group.brands.map((brand) => (
              <div key={brand.id} className={styles.brandCard}>
                <div className={styles.imageWrapper}>
                  {!loadedImages[brand.id] && (
                    <div className={`${styles.placeholder} ${styles.skeleton}`}>
                      {/* <Audio
                    height="80"
                    width="80"
                    radius="9"
                    color="green"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />  */}
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
    </div>
  );
};

export default BrandsPage;
