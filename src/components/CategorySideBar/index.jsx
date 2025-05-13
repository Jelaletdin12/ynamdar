import React, { useState, useEffect, useRef } from "react";
import { Drawer } from "antd";
import styles from "./Sidebar.module.scss";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "../../app/api/categories";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react"; // Assuming you have access to lucide-react or similar

const NestedCategoryMobile = ({ category, handleCategoryClick, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const handleNestedClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      handleCategoryClick(category);
    }
  };

  const handleNavigateClick = (e) => {
    e.stopPropagation();
    handleCategoryClick(category);
  };

  return (
    <div className={styles.nestedCategoryContainer}>
      <div
        className={styles.nestedCategoryItem}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
        onClick={handleNestedClick}
      >
        <span className={styles.title}>{category.name}</span>

        <div className={styles.categoryActions}>
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
              onClick={handleNavigateClick}
            >
              →
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.nestedSubcategories}>
          {category.children.map((child) => (
            <NestedCategoryMobile
              key={child.id}
              category={child}
              handleCategoryClick={handleCategoryClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetCategoriesQuery("tree");
  const navigate = useNavigate();
  const categories = categoriesData?.data || [];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`, { state: { category } });
    setIsOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className={styles.sidebarContainer}>
      <button onClick={handleToggle} className={styles.mobileNavButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          clipRule="evenodd"
          viewBox="0 0 32 32"
          id="category"
        >
          <path
            fill="#4b5563"
            d="M30 20c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 27 17h-7c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 17 20v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 20 30h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 30 27v-7Zm-15 0c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 12 17H5c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 2 20v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 5 30h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 15 27v-7Zm13 0v7a.997.997 0 0 1-1 1h-7a.997.997 0 0 1-1-1v-7a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm-15 0v7a.997.997 0 0 1-1 1H5a.997.997 0 0 1-1-1v-7a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm2-15c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 12 2H5c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 2 5v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 5 15h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 15 12V5Zm15 0c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 27 2h-7c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 17 5v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 20 15h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 30 12V5ZM13 5v7a.997.997 0 0 1-1 1H5a.997.997 0 0 1-1-1V5a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm15 0v7a.997.997 0 0 1-1 1h-7a.997.997 0 0 1-1-1V5a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Z"
          ></path>
        </svg>
        {t("navbar.category")}
      </button>

      <Drawer
        title={t("navbar.category")}
        placement="left"
        onClose={handleToggle}
        open={isOpen}
        className={styles.sidebarDrawer}
        width={300}
      >
        <div className={styles.mobileMenuContent}>
          {categories.map((category) => (
            <NestedCategoryMobile
              key={category.id}
              category={category}
              handleCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
