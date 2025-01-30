import React, { useState, useEffect } from "react";
import styles from "./DropdownMenu.module.scss";
import { useTranslation } from "react-i18next";

const DropdownMenu = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 1,
      icon: "🎁",
      title: "Hoş geldin, bäbek! (-50%)",
      items: [
        {
          title: "Çörek önümleri, tort",
          subcategories: [
            "Çörek",
            "Simit, bulka, kruassan",
            "Desert, süýjüliklier",
          ],
        },
        {
          title: "Un, kulinariya",
          subcategories: ["Bugdaý uny", "Lawas", "Duz, burç", "Spesiyalar"],
        },
        {
          title: "Süýji, marmelad, zefir",
          subcategories: ["Süýjiler", "Yumsak süýjiler", "Lokum, baklawa"],
        },
      ],
    },
    {
      id: 2,
      icon: "⭐",
      title: "Maslahat berilýän harytlar",
      items: [
        {
          title: "Maslahat berilýän harytlar",
          subcategories: ["Popular item 1", "Popular item 2", "Popular item 3"],
        },
      ],
    },
    {
      id: 3,
      icon: "🎯",
      title: "Iýmit, kulinariya",
      items: [
        {
          title: "Çörek önümleri, tort",
          subcategories: [
            "Çörek",
            "Simit, bulka, kruassan",
            "Desert, süýjüliklier",
          ],
        },
        {
          title: "Un, kulinariya",
          subcategories: ["Bugdaý uny", "Lawas", "Duz, burç", "Spesiyalar"],
        },
        {
          title: "Süýji, marmelad, zefir",
          subcategories: ["Süýjiler", "Yumsak süýjiler", "Lokum, baklawa"],
        },
      ],
    },
    {
      id: 4,
      icon: "🍖",
      title: "Et, towuk, balyk",
      items: [
        {
          title: "Çörek önümleri, tort",
          subcategories: [
            "Çörek",
            "Simit, bulka, kruassan",
            "Desert, süýjüliklier",
          ],
        },
        {
          title: "Un, kulinariya",
          subcategories: ["Bugdaý uny", "Lawas", "Duz, burç", "Spesiyalar"],
        },
        {
          title: "Süýji, marmelad, zefir",
          subcategories: ["Süýjiler", "Yumsak süýjiler", "Lokum, baklawa"],
        },
      ],
    },
  ];

  useEffect(() => {
    const defaultCategory = categories.find(
      (cat) => cat.title === "Maslahat berilýän harytlar"
    );
    setActiveCategory(defaultCategory);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    const defaultCategory = categories.find(
      (cat) => cat.title === "Maslahat berilýän harytlar"
    );
    setActiveCategory(defaultCategory);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={handleToggle} className={styles.navButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          clipRule="evenodd"
          viewBox="0 0 32 32"
          id="category"
          width={20}
          height={20}
        >
          <path
            fill="#4b5563"
            d="M30 20c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 27 17h-7c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 17 20v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 20 30h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 30 27v-7Zm-15 0c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 12 17H5c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 2 20v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 5 30h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 15 27v-7Zm13 0v7a.997.997 0 0 1-1 1h-7a.997.997 0 0 1-1-1v-7a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm-15 0v7a.997.997 0 0 1-1 1H5a.997.997 0 0 1-1-1v-7a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm2-15c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 12 2H5c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 2 5v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 5 15h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 15 12V5Zm15 0c0-.796-.316-1.559-.879-2.121A2.996 2.996 0 0 0 27 2h-7c-.796 0-1.559.316-2.121.879A2.996 2.996 0 0 0 17 5v7c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 20 15h7c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 30 12V5ZM13 5v7a.997.997 0 0 1-1 1H5a.997.997 0 0 1-1-1V5a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Zm15 0v7a.997.997 0 0 1-1 1h-7a.997.997 0 0 1-1-1V5a.997.997 0 0 1 1-1h7a.997.997 0 0 1 1 1Z"
          ></path>
        </svg>
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
                >
                  <span className={styles.icon}>{category.icon}</span>
                  <span className={styles.title}>{category.title}</span>
                </div>
              ))}
            </div>
            {activeCategory && activeCategory.items.length > 0 && (
              <div className={styles.contentPanel}>
                <h2 className={styles.title}>{activeCategory.title}</h2>
                <div style={{ overflowY: "scroll", height: "100%" }}>
                  {activeCategory.items.map((section, idx) => (
                    <div key={idx} className={styles.subcategoryList}>
                      <div className={styles.column}>
                        <h3 className={styles.sectionTitle}>{section.title}</h3>
                        <div>
                          {section.subcategories.map((sub, subIdx) => (
                            <div
                              key={subIdx}
                              className={styles.subcategoryItem}
                            >
                              {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.column}>
                        <h3 className={styles.sectionTitle}>{section.title}</h3>
                        <div>
                          {section.subcategories.map((sub, subIdx) => (
                            <div
                              key={subIdx}
                              className={styles.subcategoryItem}
                            >
                              {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
