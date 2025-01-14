import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 1,
      icon: "🎁",
      title: "Hoş geldin, bäbek! (-50%)",
    },
    {
      id: 2,
      icon: "⭐",
      title: "Maslahat berilýän harytlar",
    
    },
    {
      id: 3,
      icon: "🎯",
      title: "Iýmit, kulinariya",
    },
    {
      id: 4,
      icon: "🍖",
      title: "Et, towuk, balyk",
    },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("Tıklama çalışıyor mu?", isOpen);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    const defaultCategory = categories.find(
      (cat) => cat.title === "Maslahat berilýän harytlar"
    );
    setActiveCategory(defaultCategory);
  }, []);

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
        Categories
      </button>

      <Drawer
        title="Categories"
        placement="left"
        onClose={handleToggle}
        open={isOpen}
        className={styles.sidebarDrawer}
        width={360}
      >
        <div className={styles.categoriesList}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryItem} ${
                activeCategory?.id === category.id ? styles.active : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className={styles.icon}>{category.icon}</span>
              <span className={styles.title}>{category.title}</span>
            </div>
          ))}
        </div>

        {/* {activeCategory && activeCategory.items.length > 0 && (
          <div className={styles.contentPanel}>
            <h2 className={styles.title}>{activeCategory.title}</h2>
            {activeCategory.items.map((section, idx) => (
              <div key={idx} className={styles.subcategoryList}>
                <div className={styles.column}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <div>
                    {section.subcategories.map((sub, subIdx) => (
                      <div key={subIdx} className={styles.subcategoryItem}>
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}
      </Drawer>
    </div>
  );
};

export default Sidebar;
