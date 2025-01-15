import React, { useState } from "react";
import { Drawer, Radio } from "antd";
import styles from "./FilterSideBar.module.scss";
import arrow from "../../assets/icons/topBottom.svg";

const FilterSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Hiç hili");

  const filterOptions = [
    "Hiç hili",
    "Arzandan gymmada",
    "Gymmatdan arzana",
  ];

  const handleFilterToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className={styles.sidebarContainer}>
      <button onClick={handleFilterToggle} className={styles.mobileNavButton}>
        <img src={arrow} alt="" />
        Suzguc
      </button>

      <Drawer
        title="Tertip"
        placement="right"
        onClose={handleFilterToggle}
        open={isOpen}
        className={styles.sidebarDrawer}
        width={320}
      >
        <Radio.Group
          onChange={handleOptionChange}
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
