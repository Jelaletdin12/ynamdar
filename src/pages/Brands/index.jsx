import React, { useState, useEffect } from "react";

import styles from "./Brands.module.scss";
import temp1 from "../../assets/brands/5401.png";
import temp2 from "../../assets/brands/5417.png";
import temp3 from "../../assets/brands/5420.png";
import temp4 from "../../assets/brands/5421.png";
import temp5 from "../../assets/brands/5514.png";
import temp6 from "../../assets/brands/5522.png";
import temp7 from "../../assets/brands/5529.png";
import temp8 from "../../assets/brands/5745.png";
import { CiSearch } from "react-icons/ci";

const BrandsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedImages, setLoadedImages] = useState({});

  const brandCategories = [
    {
      title: "Gök we bakja önümleri",
      brands: [
        { id: 1, name: "Gök Önüm", logo: temp1 },
        { id: 2, name: "Tudana", logo: temp3 },
        { id: 3, name: "Gury iýmiş", logo: temp2 },
        { id: 4, name: "Bagdan", logo: temp4 },
      ],
    },
    {
      title: "Et, towuk, balyk",
      brands: [
        { id: 5, name: "Emin Et", logo: temp8 },
        { id: 6, name: "Hindi Towugy", logo: temp7 },
        { id: 7, name: "Kenar", logo: temp1 },
        { id: 8, name: "KHOSHBAKHT", logo: temp1 },
        { id: 9, name: "Amberfish", logo: temp6 },
        { id: 10, name: "Amberfish", logo: temp5 },
        { id: 11, name: "Amberfish", logo: temp4 },
        { id: 12, name: "Amberfish", logo: temp3 },
        { id: 13, name: "Amberfish", logo: temp2 },
      ],
    },
    // Add other categories...
  ];

  const handleImageLoad = (brandId) => {
    setLoadedImages((prev) => ({
      ...prev,
      [brandId]: true,
    }));
  };

  const filteredCategories = brandCategories
    .map((category) => ({
      ...category,
      brands: category.brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.brands.length > 0);

  return (
    <div className={styles.brandsContainer}>
      <div className={styles.searchWrapper}>
        <CiSearch />
        <input
          type="text"
          placeholder="Gözleg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCategories.map((category, index) => (
        <section key={index} className={styles.categorySection}>
          <h2>{category.title}</h2>

          <div className={styles.brandsGrid}>
            {category.brands.map((brand) => (
              <div key={brand.id} className={styles.brandCard}>
                <div className={styles.imageWrapper}>
                  {!loadedImages[brand.id] && (
                    <div
                      className={`${styles.placeholder} ${styles.skeleton}`}
                    />
                  )}
                  <img
                    src={brand.logo}
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
                <div
                  style={{
                    backgroundColor: "#000",
                    height: "0.5px",
                    marginBottom: "10px",
                  }}
                ></div>
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
