import { useState } from "react";
import styles from "./Navbar.module.scss";

import { FaGlobe } from "react-icons/fa6";
import { Input, Badge, Menu, Dropdown } from "antd";
const { Search } = Input;
import DropdownMenu from "../CategoryDropdown/index";
import LoginModal from "../LogIn/index";
import SignUpModal from "../SignUp/index";
import { data, Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import tm from "../../assets/tm.png";
import ru from "../../assets/ru.png";
import en from "../../assets/en.png";
import { CiLocationOn } from "react-icons/ci";
import Sidebar from "../CategorySideBar";
import { useTranslation } from "react-i18next";
import { useSearchProductQuery } from "../../app/api/searchApi";
import { useGetCartQuery } from "../../app/api/cartApi";
import { useGetOrdersQuery } from "../../app/api/orderApi";
import { useGetFavoritesQuery } from "../../app/api/favoritesApi";

const NavbarDown = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: searchData, refetch } = useSearchProductQuery(searchQuery, {
    skip: !searchQuery,
  });
  const { data: cartData } = useGetCartQuery();
  const cartItemCount = cartData?.data?.length || 0;

  const { data: ordersData } = useGetOrdersQuery();
  const ordersItemCount = ordersData?.data?.length || 0;

  const { data: favoritesData } = useGetFavoritesQuery();
  const favoritesItemCount = favoritesData?.length || 0; 
  

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`, {
        state: {
          searchData,
          searchQuery,
        },
      });
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
  };
  const menuItems = [
    { key: "tm", img: tm, label: t("navbar.languages.tm") },
    { key: "ru", img: ru, label: t("navbar.languages.ru") },
    { key: "en", img: en, label: t("navbar.languages.en") },
  ];

  const globeMenu = (
    <Menu
      items={menuItems.map((item) => ({
        key: item.key,
        label: (
          <span onClick={() => changeLanguage(item.key)}>
            <img
              src={item.img}
              alt={item.label}
              style={{ width: "20px", marginRight: "10px" }}
            />
            {item.label}
          </span>
        ),
      }))}
    />
  );

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarDown} style={{ position: "sticky" }}>
        <nav className={styles.navLinks}>
          <ul>
            <li>
              <DropdownMenu />
            </li>
            <div className={styles.stick}></div>
            <li>
              {" "}
              <Link to={"/brands"}>
                <button className={styles.navButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    data-v-4940fd39=""
                    width={16}
                    height={16}
                  >
                    <path
                      d="M 49.421 54.07 C 50.531 54.07 51.471 53.62 52.761 52.87 L 89.211 31.86 C 91.211 30.7 92.241 29.68 92.241 28.03 C 92.241 26.43 91.221 25.4 89.211 24.25 L 52.761 3.2 C 51.471 2.44 50.531 2 49.421 2 C 48.311 2 47.371 2.45 46.081 3.2 L 9.631 24.25 C 7.631 25.41 6.601 26.43 6.601 28.03 C 6.601 29.68 7.621 30.7 9.631 31.86 L 46.081 52.87 C 47.371 53.63 48.311 54.07 49.421 54.07 Z M 49.421 76.59 C 50.491 76.59 51.331 76.1 52.621 75.39 L 90.761 53.27 C 91.921 52.6 92.361 51.76 92.361 51 C 92.361 50.11 91.911 49.44 91.511 49.18 L 50.791 72.59 C 50.261 72.9 49.901 73.08 49.411 73.08 C 48.961 73.08 48.561 72.9 48.031 72.59 L 7.311 49.18 C 6.911 49.45 6.461 50.11 6.461 51 C 6.461 51.76 6.951 52.65 8.061 53.27 L 46.251 75.39 C 47.511 76.1 48.351 76.59 49.421 76.59 Z M 49.421 98.22 C 50.491 98.22 51.331 97.73 52.621 97.02 L 90.761 74.9 C 91.871 74.28 92.361 73.39 92.361 72.63 C 92.361 71.74 91.911 71.07 91.511 70.81 L 50.791 94.22 C 50.261 94.49 49.901 94.71 49.411 94.71 C 48.961 94.71 48.561 94.49 48.031 94.22 L 7.311 70.81 C 6.911 71.08 6.461 71.74 6.461 72.63 C 6.461 73.39 6.951 74.28 8.061 74.9 L 46.251 97.02 C 47.511 97.73 48.351 98.22 49.421 98.22 Z"
                      data-v-4940fd39=""
                    ></path>
                    <path
                      opacity={0}
                      d="M 49.421 54.07 C 50.531 54.07 51.471 53.62 52.761 52.87 L 89.211 31.86 C 91.211 30.7 92.241 29.68 92.241 28.03 C 92.241 26.43 91.221 25.4 89.211 24.25 L 52.761 3.2 C 51.471 2.44 50.531 2 49.421 2 C 48.311 2 47.371 2.45 46.081 3.2 L 9.631 24.25 C 7.631 25.41 6.601 26.43 6.601 28.03 C 6.601 29.68 7.621 30.7 9.631 31.86 L 46.081 52.87 C 47.371 53.63 48.311 54.07 49.421 54.07 Z M 49.421 76.59 C 50.491 76.59 51.331 76.1 52.621 75.39 L 90.761 53.27 C 91.921 52.6 92.361 51.76 92.361 51 C 92.361 50.11 91.911 49.44 91.511 49.18 L 50.791 72.59 C 50.261 72.9 49.901 73.08 49.411 73.08 C 48.961 73.08 48.561 72.9 48.031 72.59 L 7.311 49.18 C 6.911 49.45 6.461 50.11 6.461 51 C 6.461 51.76 6.951 52.65 8.061 53.27 L 46.251 75.39 C 47.511 76.1 48.351 76.59 49.421 76.59 Z M 49.421 98.22 C 50.491 98.22 51.331 97.73 52.621 97.02 L 90.761 74.9 C 91.871 74.28 92.361 73.39 92.361 72.63 C 92.361 71.74 91.911 71.07 91.511 70.81 L 50.791 94.22 C 50.261 94.49 49.901 94.71 49.411 94.71 C 48.961 94.71 48.561 94.49 48.031 94.22 L 7.311 70.81 C 6.911 71.08 6.461 71.74 6.461 72.63 C 6.461 73.39 6.951 74.28 8.061 74.9 L 46.251 97.02 C 47.511 97.73 48.351 98.22 49.421 98.22 Z"
                      data-v-4940fd39=""
                    ></path>
                  </svg>
                  {t("navbar.brands")}
                </button>
              </Link>
            </li>
            <li className={styles.searchWrapper}>
              <CiSearch />
              <input
                type="text"
                placeholder="Haryt ady boyunca gozle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </li>
            <li>
              <Dropdown menu={globeMenu} trigger={["click"]}>
                <button className={styles.navButton}>
                  <FaGlobe />
                </button>
              </Dropdown>
            </li>
            <div className={styles.stick}></div>

            <li>
              <LoginModal />
            </li>
            <div className={styles.stick}></div>
            <li>
              <SignUpModal />
            </li>
            <div className={styles.stick}></div>
            <li>
              <Link to={"/orders"}>
              <Badge
                  style={{ marginRight: "4px" }}
                  count={ordersItemCount}
                  offset={[10, 0]}
                  showZero
                >
                <button className={styles.navButton}>
                  <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 28.35 28.35"
                    data-v-5c1608dd=""
                  >
                    <path
                      d="M24.4,16a2.37,2.37,0,0,0-.94-.59V14.22h0v-2.7h0V9a2.27,2.27,0,0,0-.29-1.11L21.72,5.33a2.27,2.27,0,0,0-2-1.15H11A2.27,2.27,0,0,0,9,5.33L7.52,7.91A2.38,2.38,0,0,0,7.23,9v2.5h0v2h0v.81H4.68a1.46,1.46,0,0,0-1.45,1.46v6.86a1.45,1.45,0,0,0,1.45,1.45H7.2a1.46,1.46,0,0,0,1.28-.78h1.68a2.69,2.69,0,0,1,.57.06l3.55.71a4.09,4.09,0,0,0,.85.09,4.24,4.24,0,0,0,.94-.11l4.64-1,3.65-3.5a2.43,2.43,0,0,0,0-3.49Zm-7.17-1.14-.06,0-3.89-.63a4.34,4.34,0,0,0-2.88.55l-1.75.8V11.52a1,1,0,0,1,1-1H21a1,1,0,0,1,1,1v2h0v1.87a2.45,2.45,0,0,0-.94.5L19,17.68c0-.11,0-.23,0-.36A2.64,2.64,0,0,0,17.23,14.89ZM20.49,6,21.93,8.6A.78.78,0,0,1,22,9v.29a2.51,2.51,0,0,0-1-.23h-5V5.59h3.7A.86.86,0,0,1,20.49,6ZM8.76,8.6,10.2,6A.86.86,0,0,1,11,5.59h3.69V9.08h-5a2.51,2.51,0,0,0-1,.23V9A.78.78,0,0,1,8.76,8.6Zm-1.53,14s0,0,0,0H4.68a0,0,0,0,1,0,0V15.78a0,0,0,0,1,0,0H7.2s0,0,0,0v6.86ZM23.39,18.5,20,21.73l-4.26,1a2.85,2.85,0,0,1-1.2,0L11,22a4.8,4.8,0,0,0-.85-.08H8.65V17.14L11,16.06l.08,0a2.87,2.87,0,0,1,2-.38l3.75.6a1.21,1.21,0,0,1,.76,1.08c0,.44,0,1.18-1.77,1.18H14.54a.7.7,0,0,0-.7.71.7.7,0,0,0,.7.7h4L22,17A1,1,0,0,1,23.4,17a1,1,0,0,1,.3.74A1,1,0,0,1,23.39,18.5Z"
                      data-v-5c1608dd=""
                    ></path>
                  </svg>
                </button>
                </Badge>
              </Link>
            </li>
            <div className={styles.stick}></div>
            <li>
              <Link to={"/wishlist"}>
                <Badge
                  style={{ marginRight: "4px" }}
                  count={favoritesItemCount}
                  offset={[10, 0]}
                  showZero
                >
                  <button className={styles.navButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 212.6 212.6"
                      data-v-aebc1ac8=""
                    >
                      <path
                        stroke="#4b5563"
                        d="M 106.3 193.05 C 103.528 193.049 100.848 192.043 98.76 190.22 C 90.88 183.33 83.29 176.85 76.59 171.14 L 76.59 171.14 C 56.94 154.4 39.98 139.94 28.17 125.7 C 14.98 109.78 8.83 94.7 8.83 78.19 C 8.83 62.19 14.33 47.38 24.3 36.56 C 29.252 31.159 35.282 26.856 41.999 23.928 C 48.716 21 55.973 19.512 63.3 19.56 C 74.404 19.512 85.201 23.241 93.91 30.13 C 98.638 33.824 102.811 38.179 106.3 43.06 C 109.789 38.179 113.962 33.824 118.69 30.13 C 127.405 23.231 138.214 19.498 149.33 19.55 C 156.657 19.502 163.914 20.99 170.631 23.918 C 177.348 26.846 183.378 31.149 188.33 36.55 C 198.33 47.37 203.8 62.15 203.8 78.18 C 203.8 94.67 197.65 109.77 184.46 125.69 C 172.65 139.93 155.69 154.39 136.04 171.13 C 129.33 176.85 121.72 183.33 113.83 190.24 C 111.741 192.052 109.066 193.05 106.3 193.05 Z M 63.27 31 C 57.522 30.955 51.828 32.115 46.555 34.406 C 41.283 36.696 36.549 40.067 32.66 44.3 C 24.63 53 20.21 65 20.21 78.16 C 20.21 92.03 25.37 104.43 36.93 118.38 C 48.1 131.86 64.72 146.02 83.93 162.38 L 83.93 162.38 C 90.66 168.11 98.29 174.61 106.22 181.55 C 114.22 174.55 121.84 168.09 128.58 162.35 C 147.82 145.95 164.44 131.79 175.58 118.35 C 187.14 104.4 192.29 92 192.29 78.13 C 192.38 65 188 53 179.94 44.27 C 176.048 40.043 171.313 36.678 166.041 34.392 C 160.769 32.106 155.076 30.951 149.33 31 C 140.748 30.972 132.406 33.86 125.68 39.19 C 120.39 43.426 115.919 48.594 112.49 54.44 C 111.636 55.877 110.308 56.973 108.734 57.538 C 107.161 58.104 105.439 58.104 103.866 57.538 C 102.292 56.973 100.964 55.877 100.11 54.44 C 96.684 48.584 92.213 43.405 86.92 39.16 C 80.19 33.841 71.848 30.963 63.27 31 Z"
                        data-v-aebc1ac8=""
                      ></path>
                      <path
                        stroke="#4b5563"
                        opacity={0}
                        d="M 106.3 193.05 C 103.528 193.049 100.848 192.043 98.76 190.22 C 90.88 183.33 83.29 176.85 76.59 171.14 L 76.59 171.14 C 56.94 154.4 39.98 139.94 28.17 125.7 C 14.98 109.78 8.83 94.7 8.83 78.19 C 8.83 62.19 14.33 47.38 24.3 36.56 C 29.252 31.159 35.282 26.856 41.999 23.928 C 48.716 21 55.973 19.512 63.3 19.56 C 74.404 19.512 85.201 23.241 93.91 30.13 C 98.638 33.824 102.811 38.179 106.3 43.06 C 109.789 38.179 113.962 33.824 118.69 30.13 C 127.405 23.231 138.214 19.498 149.33 19.55 C 156.657 19.502 163.914 20.99 170.631 23.918 C 177.348 26.846 183.378 31.149 188.33 36.55 C 198.33 47.37 203.8 62.15 203.8 78.18 C 203.8 94.67 197.65 109.77 184.46 125.69 C 172.65 139.93 155.69 154.39 136.04 171.13 C 129.33 176.85 121.72 183.33 113.83 190.24 C 111.741 192.052 109.066 193.05 106.3 193.05 Z"
                        data-v-aebc1ac8=""
                      ></path>
                    </svg>
                  </button>
                </Badge>
              </Link>
            </li>
            <div className={styles.stick}></div>
            <li>
              <Link to={"/cart"}>
                <Badge count={cartItemCount} offset={[10, 0]} showZero>
                  <button className={styles.navButton}>
                    <svg
                      viewBox="0 0 19 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-v-bf54e7ab=""
                      stroke="#4b5563"
                    >
                      <path
                        fill="#ffffff"
                        d="M16.5 15.355C17.3284 15.355 18 14.6834 18 13.855C18 13.0266 17.3284 12.355 16.5 12.355C15.6716 12.355 15 13.0266 15 13.855C15 14.6834 15.6716 15.355 16.5 15.355Z"
                        data-v-bf54e7ab=""
                      ></path>
                      <path
                        fill="#ffffff"
                        d="M5.625 15.355C6.45342 15.355 7.12499 14.6834 7.12499 13.855C7.12499 13.0266 6.45342 12.355 5.625 12.355C4.79657 12.355 4.125 13.0266 4.125 13.855C4.125 14.6834 4.79657 15.355 5.625 15.355Z"
                        data-v-bf54e7ab=""
                      ></path>
                      <path
                        fill="#ffffff"
                        d="M17.6249 10.48H5.91411L6.16423 10.0742C6.27148 9.9002 6.30298 9.68983 6.25161 9.49183L6.00748 8.55208L16.8761 7.98733C17.2882 7.96633 17.6249 7.61121 17.6249 7.19871V2.22997C17.6249 1.81748 17.2874 1.47998 16.875 1.47998H4.16961L4.02299 0.916354C3.98122 0.755602 3.88727 0.613263 3.75587 0.511665C3.62448 0.410066 3.46308 0.354957 3.29699 0.35498H0.749998C0.551086 0.35498 0.360321 0.433998 0.219669 0.57465C0.0790174 0.715302 0 0.906066 0 1.10498C0 1.30389 0.0790174 1.49465 0.219669 1.63531C0.360321 1.77596 0.551086 1.85498 0.749998 1.85498H2.71724L4.71974 9.55933L3.93224 10.8362C3.86219 10.9498 3.82376 11.0801 3.82093 11.2135C3.81809 11.3469 3.85096 11.4787 3.91611 11.5952C3.98101 11.7118 4.07589 11.809 4.19094 11.8766C4.30599 11.9443 4.43702 11.9799 4.57049 11.9799H17.6249C17.8239 11.9799 18.0146 11.9009 18.1553 11.7603C18.2959 11.6196 18.3749 11.4289 18.3749 11.2299C18.3749 11.031 18.2959 10.8403 18.1553 10.6996C18.0146 10.559 17.8239 10.48 17.6249 10.48Z"
                        data-v-bf54e7ab=""
                      ></path>
                      <path
                        fill="#ffffff"
                        d="M16.5 15.355C17.3284 15.355 18 14.6834 18 13.855C18 13.0266 17.3284 12.355 16.5 12.355C15.6716 12.355 15 13.0266 15 13.855C15 14.6834 15.6716 15.355 16.5 15.355Z"
                        data-v-bf54e7ab=""
                      ></path>
                      <path
                        fill="#ffffff"
                        d="M5.625 15.355C6.45342 15.355 7.12499 14.6834 7.12499 13.855C7.12499 13.0266 6.45342 12.355 5.625 12.355C4.79657 12.355 4.125 13.0266 4.125 13.855C4.125 14.6834 4.79657 15.355 5.625 15.355Z"
                        data-v-bf54e7ab=""
                      ></path>
                      <path
                        fill="#ffffff"
                        d="M17.6249 10.48H5.91411L6.16423 10.0742C6.27148 9.9002 6.30298 9.68983 6.25161 9.49183L6.00748 8.55208L16.8761 7.98733C17.2882 7.96633 17.6249 7.61121 17.6249 7.19871V2.22997C17.6249 1.81748 17.2874 1.47998 16.875 1.47998H4.16961L4.02299 0.916354C3.98122 0.755602 3.88727 0.613263 3.75587 0.511665C3.62448 0.410066 3.46308 0.354957 3.29699 0.35498H0.749998C0.551086 0.35498 0.360321 0.433998 0.219669 0.57465C0.0790174 0.715302 0 0.906066 0 1.10498C0 1.30389 0.0790174 1.49465 0.219669 1.63531C0.360321 1.77596 0.551086 1.85498 0.749998 1.85498H2.71724L4.71974 9.55933L3.93224 10.8362C3.86219 10.9498 3.82376 11.0801 3.82093 11.2135C3.81809 11.3469 3.85096 11.4787 3.91611 11.5952C3.98101 11.7118 4.07589 11.809 4.19094 11.8766C4.30599 11.9443 4.43702 11.9799 4.57049 11.9799H17.6249C17.8239 11.9799 18.0146 11.9009 18.1553 11.7603C18.2959 11.6196 18.3749 11.4289 18.3749 11.2299C18.3749 11.031 18.2959 10.8403 18.1553 10.6996C18.0146 10.559 17.8239 10.48 17.6249 10.48Z"
                        data-v-bf54e7ab=""
                      ></path>
                    </svg>
                  </button>
                </Badge>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Mobile */}
      <div className={styles.navbarContainer}>
        <div className={styles.navbarContent}>
          <div className={styles.categories}>
            <Sidebar />
          </div>
          <div className={styles.stick}></div>
          <div className={styles.location}>
            <CiLocationOn /> Aşgabat
          </div>
          <div className={styles.stick}></div>
          <div className={styles.searchIcon} onClick={toggleSearch}>
            <CiSearch />
          </div>
        </div>
        {isSearchVisible && (
          <div className={styles.searchInputWrapper}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Haryt ady boyunca gozle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarDown;
