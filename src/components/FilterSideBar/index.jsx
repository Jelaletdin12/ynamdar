import React, { useState, useEffect } from "react";
import { Drawer, Radio } from "antd";
import styles from "./FilterSideBar.module.scss";
import arrow from "../../assets/icons/topBottom.svg";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ onPriceSortChange, currentPriceSort = "none" }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(currentPriceSort);

  // Map sort values to display options
  const sortOptionsMap = {
    none: t("category.neverMind") || "Hiç hili",
    lowToHigh: t("category.From_cheap_to_expensive") || "Arzandan gymmada",
    highToLow: t("category.From_expensive_to_cheap") || "Gymmatdan arzana",
  };

  // Map display options back to sort values
  const displayToSortMap = {
    [t("category.neverMind") || "Hiç hili"]: "none",
    [t("category.From_cheap_to_expensive") || "Arzandan gymmada"]: "lowToHigh",
    [t("category.From_expensive_to_cheap") || "Gymmatdan arzana"]: "highToLow",
  };

  // Filter options for display
  const filterOptions = Object.values(sortOptionsMap);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedOption(currentPriceSort);
  }, [currentPriceSort]);

  const handleFilterToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (e) => {
    const displayValue = e.target.value;

    const sortValue = displayToSortMap[displayValue] || "none";

    setSelectedOption(displayValue);

    if (onPriceSortChange) {
      onPriceSortChange(sortValue);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.sidebarContainer}>
      <button onClick={handleFilterToggle} className={styles.mobileNavButton}>
        <img src={arrow} alt="" />
        {t("filter.title") || "Suzguc"}
      </button>

      <Drawer
        title={t("filter.sorting") || "Tertip"}
        placement="right"
        onClose={handleClose}
        open={isOpen}
        className={styles.sidebarDrawer}
        width={320}
      >
        <Radio.Group
          onChange={(e) => {
            console.log("Radio changed:", e.target.value);
            handleOptionChange(e);
          }}
          value={selectedOption}
          className={styles.radioGroup}
        >
          {filterOptions.map((option, index) => (
            <Radio key={index} value={option} className={styles.radioItem}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
      </Drawer>
    </div>
  );
};

export default FilterSidebar;
