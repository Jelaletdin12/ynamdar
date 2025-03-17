import styles from "./Navbar.module.scss";
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
            style={{ maxWidth: "1366px", display: "flex", margin: "0 auto", alignItems: "center"}}
          >
            <div className={styles.logo}>
              <div
                className={styles.logoContainer}
                onClick={() => navigate("/")}
              >
                <LogoWithText />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 14px 6px" }}>
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
