import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./DropdownMenu.module.scss";
import { useGetCategoriesQuery } from "../../app/api/categories";
import { CategoryIcon } from "../Icons";

const DropdownMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref ekledik
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetCategoriesQuery("tree");

  const categories = categoriesData?.data || [];
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories.find(
        (cat) => cat.name === "Aýallar üçin"
      );
      setActiveCategory(defaultCategory);
    }
  }, [categories]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    const defaultCategory = categories.find(
      (cat) => cat.name === "Aýallar üçin"
    );
    setActiveCategory(defaultCategory);
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${category.id}`, { state: { category } });
    setIsOpen(false);
  };

  // Dışarıya tıklanınca kapanması için event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button onClick={handleToggle} className={styles.navButton}>
        <CategoryIcon />
        {t("navbar.category")}
      </button>
      {isOpen && (
        <div className={styles.dropdownWrapper}>
          <div className={styles.dropdownPanel} onMouseLeave={handleMouseLeave}>
            <div className={styles.categoriesList}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`${styles.categoryItem} ${
                    activeCategory?.id === category.id ? styles.active : ""
                  }`}
                  onMouseEnter={() => setActiveCategory(category)}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className={styles.title}>{category.name}</span>
                </div>
              ))}
            </div>
            {activeCategory &&
              activeCategory.children &&
              activeCategory.children.length > 0 && (
                <div className={styles.contentPanel}>
                  <h2
                    onClick={() => handleCategorySelect(activeCategory)}
                    className={styles.title}
                  >
                    {activeCategory.name}
                  </h2>
                  <div style={{ overflowY: "scroll", height: "100%" }}>
                    <div className={styles.subcategoryList}>
                      <div className={styles.column}>
                        {activeCategory.children
                          .slice(
                            0,
                            Math.ceil(activeCategory.children.length / 2)
                          )
                          .map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className={styles.subcategoryItem}
                              onClick={() => handleCategorySelect(subcategory)}
                            >
                              {subcategory.name}
                            </div>
                          ))}
                      </div>
                      <div className={styles.column}>
                        {activeCategory.children
                          .slice(Math.ceil(activeCategory.children.length / 2))
                          .map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className={styles.subcategoryItem}
                              onClick={() => handleCategorySelect(subcategory)}
                            >
                              {subcategory.name}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
