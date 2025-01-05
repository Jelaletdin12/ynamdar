import React, { useState } from "react";
import styles from "./DropdownMenu.module.scss";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 1,
      icon: "🎁",
      title: "Hoş geldin, bäbek! (-50%)",
      items: [],
    },
    {
      id: 2,
      icon: "⭐",
      title: "Maslahat berilýän harytlar",
      items: [],
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
      items: [],
    },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={handleToggle} className={styles.navButton}>
        Categories
      </button>
      {isOpen && (
        <div className={styles.dropdownWrapper}>
          <div className={styles.dropdownPanel}>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
