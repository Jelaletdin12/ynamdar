import React, { useState } from "react";
import { Drawer, Input, Checkbox } from "antd";
import styles from "./BrandsSidebar.module.scss";
import { useTranslation } from "react-i18next";
import brand from "../../assets/icons/brand.svg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();
  const brands = [
    "Abat",
    "Altın",
    "Arçalyk",
    "Aýaz baba",
    "Balşeker",
    "Bars",
    "Belet Film",
    "Beýlekiler / Другие",
    "Bingo",
    "Bold",
    "Carte Noire",
    "Çaykur",
    "Dabara",
    "Datmeni",
    "Elin",
    "Emin Et",
    "Enemeli",
    "Ermak",
    "Eyfel",
    "Familia",
    "Farmasi",
    "Ferrero Rocher",
    "Granum",
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.sidebarContainer}>
      <button onClick={handleToggle} className={styles.mobileNavButton}>
        <img src={brand} alt="" />
        {t("navbar.brands")}
      </button>

      <Drawer
        title={t("navbar.brands")}
        placement="right"
        onClose={handleToggle}
        open={isOpen}
        className={styles.sidebarDrawer}
        width={320}
      >
        <Input
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <div className={styles.brandsList}>
          {filteredBrands.map((brand, index) => (
            <div key={index} className={styles.brandItem}>
              <Checkbox>{brand}</Checkbox>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
