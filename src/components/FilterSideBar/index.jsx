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
    none: t("category.notSelected") || "Hiç hili",
    lowToHigh: t("category.lowestPrice") || "Arzandan gymmada",
    highToLow: t("category.highestPrice") || "Gymmatdan arzana",
  };

  // Map display options back to sort values
  const displayToSortMap = {
    [t("category.notSelected") || "Hiç hili"]: "none",
    [t("category.lowestPrice") || "Arzandan gymmada"]: "lowToHigh",
    [t("category.highestPrice") || "Gymmatdan arzana"]: "highToLow",
  };

  // Filter options for display
  const filterOptions = Object.values(sortOptionsMap);

  // Update local state when prop changes
 // Change the useEffect to properly set the radio button value
useEffect(() => {
  // Map the currentPriceSort prop to the display value
  setSelectedOption(sortOptionsMap[currentPriceSort] || sortOptionsMap.none);
}, [currentPriceSort]);

// Then make sure the handleOptionChange correctly gets the value
const handleOptionChange = (e) => {
  const displayValue = e.target.value;
  const sortValue = displayToSortMap[displayValue] || "none";
  setSelectedOption(displayValue);
  
  if (onPriceSortChange) {
    onPriceSortChange(sortValue);
  }
};

  const handleFilterToggle = () => {
    setIsOpen(!isOpen);
  };

 

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.sidebarContainer}>
      <button onClick={handleFilterToggle} className={styles.mobileNavButton}>
        <img src={arrow} alt="" />
        {t("category.order") || "Suzguc"}
      </button>

      <Drawer
        title={t("category.order") || "Tertip"}
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
            <Radio key={index} value={option} className={styles.radioItem}  style={{ 
              '--radio-dot-color': '#888888',
              '--radio-checked-color': '#888888' 
            }}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
      </Drawer>
    </div>
  );
};

export default FilterSidebar;
