import styles from "./Navbar.module.scss";
import logo from "../../assets/logo.png";
import { Modal } from "antd";
import SignupForm from "../BeSeller/index";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoWithText } from "../Icons";
const Navbar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarUp}>
          <div
            style={{ maxWidth: "1366px", display: "flex", margin: "0 auto" }}
          >
            <div className={styles.logo}>
              <div
                className={styles.logoContainer}
                onClick={() => navigate("/")}
              >
                <LogoWithText />
                <div style={{ backgroundColor: "red" }}></div>
                <div
                  className={styles.Sides}
                  style={{ backgroundColor: "red" }}
                ></div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className={styles.btn} onClick={showModal}>
                Satyjy bol
              </button>
            </div>
          </div>
        </div>
      </header>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <SignupForm />
      </Modal>
    </>
  );
};

export default Navbar;
