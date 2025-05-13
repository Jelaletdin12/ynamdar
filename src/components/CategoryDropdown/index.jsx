import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./DropdownMenu.module.scss";
import { useGetCategoriesQuery } from "../../app/api/categories";
import { CategoryIcon } from "../Icons";
import { ChevronRight, ChevronDown } from "lucide-react"; // Assuming you have access to lucide-react or similar

const NestedCategory = ({
  category,
  level = 0,
  handleCategorySelect,
  closeDropdown,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      handleCategorySelect(category);
      closeDropdown();
    }
  };

  const handleDirectNavigation = (e) => {
    e.stopPropagation();
    handleCategorySelect(category);
    closeDropdown();
  };

  return (
    <div
      className={styles.nestedCategoryContainer}
      style={{ paddingLeft: `${level * 16}px` }}
    >
      <div className={styles.nestedCategoryItem} onClick={handleClick}>
        <div className={styles.categoryLabel}>
          <span className={styles.title}>{category.name}</span>
        </div>

        {hasChildren && (
          <button
            className={styles.expandButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}

        {hasChildren && (
          <button
            className={styles.navigateButton}
            onClick={handleDirectNavigation}
            title="Go to category"
          >
            →
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.nestedChildren}>
          {category.children.map((child) => (
            <NestedCategory
              key={child.id}
              category={child}
              level={level + 1}
              handleCategorySelect={handleCategorySelect}
              closeDropdown={closeDropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DropdownMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetCategoriesQuery("tree");

  const categories = categoriesData?.data || [];
  const [isOpen, setIsOpen] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory =
        categories.find((cat) => cat.name === "Aýallar üçin") || categories[0];
      setActiveMainCategory(defaultCategory);
    }
  }, [categories]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    if (categories.length > 0) {
      const defaultCategory =
        categories.find((cat) => cat.name === "Aýallar üçin") || categories[0];
      setActiveMainCategory(defaultCategory);
    }
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${category.id}`, { state: { category } });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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
                    activeMainCategory?.id === category.id ? styles.active : ""
                  }`}
                  onMouseEnter={() => setActiveMainCategory(category)}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className={styles.title}>{category.name}</span>
                </div>
              ))}
            </div>

            {activeMainCategory && (
              <div className={styles.contentPanel}>
                <h2
                  onClick={() => handleCategorySelect(activeMainCategory)}
                  className={styles.title}
                >
                  {activeMainCategory.name}
                </h2>

                <div className={styles.subCategoriesContainer}>
                  {activeMainCategory.children &&
                  activeMainCategory.children.length > 0 ? (
                    activeMainCategory.children.map((subcategory) => (
                      <NestedCategory
                        key={subcategory.id}
                        category={subcategory}
                        handleCategorySelect={handleCategorySelect}
                        closeDropdown={() => setIsOpen(false)}
                      />
                    ))
                  ) : (
                    <div className={styles.noSubcategories}>
                      {/* No subcategories available */}
                    </div>
                  )}
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
