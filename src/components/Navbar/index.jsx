
import styles from "./Navbar.module.scss";
import logo from "../../assets/logo.png";




const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarUp}>
        <div style={{ maxWidth: "1366px", display: "flex", margin: "0 auto" }}>
          <div className={styles.logo}>
            <div className={styles.logoContainer}>
              <img src={logo} alt="Logo" />
              <div style={{ backgroundColor: "red" }}></div>
              <div className={styles.Sides} style={{ backgroundColor: "red" }}>
                <div style={{ backgroundColor: "red" }}></div>
                <div style={{ backgroundColor: "red" }}></div>
              </div>
            </div>
            <div className={styles.logoContainer}>
              <img src={logo} alt="Logo" />
            </div>
            <div className={styles.logoContainer}>
              <img src={logo} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
