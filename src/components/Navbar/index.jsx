import React from "react";
import styles from "./Navbar.module.scss";
import logo from "../../assets/logo.png";
import { FaGlobe } from "react-icons/fa6";
import { Input, Space } from "antd";
const { Search } = Input;
import DropdownMenu from "../CategoryDropdown/index";
import LoginModal from "../LogIn/index";
import SignUpModal from "../SignUp/index";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarUp}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>
      </div>

    </header>
  );
};

export default Navbar;
