import { useState, useEffect } from "react";
import { CartIcon, WishlistIcon, BrandIcon, OrderIcon } from "../Icons";
import styles from "./Navbar.module.scss";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { FaGlobe } from "react-icons/fa6";
import { Input, Badge, Menu, Dropdown } from "antd";
const { Search } = Input;
import DropdownMenu from "../CategoryDropdown/index";
import LoginModal from "../LogIn/index";
import SignUpModal from "../SignUp/index";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "../../context/authContext";
import ProfileModal from "../../components/MyProfileModal/index";
const NavbarDown = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: searchData, refetch } = useSearchProductQuery(searchQuery, {
    skip: !searchQuery,
  });
  const { data: cartData } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const { isAuthenticated, logout } = useAuth();
  const cartItemCount =
    cartData?.data?.reduce((total, item) => {
      return total + (parseInt(item.product_quantity, 10) || 0);
    }, 0) || 0;

  const { data: ordersData } = useGetOrdersQuery();
  const ordersItemCount = ordersData?.length || 0;

  const { data: favoritesData } = useGetFavoritesQuery();
  const favoritesItemCount = favoritesData?.length || 0;
  const [profileModalVisible, setProfileModalVisible] = useState(false);
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
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    // Note: The page refresh is now being handled in the AuthContext's logout function
    // window.location.reload() is no longer needed here
  };
  
  useEffect(() => {}, [isAuthenticated]);
  
  const items = [
    {
      key: "tk",
      label: (
        <div onClick={() => changeLanguage("tk")}>
          <img
            src={tm}
            alt={t("navbar.languages.tm")}
            style={{ width: "20px", marginRight: "10px" }}
          />
          {t("navbar.languages.tm")}
        </div>
      ),
    },
    {
      key: "ru",
      label: (
        <div onClick={() => changeLanguage("ru")}>
          <img
            src={ru}
            alt={t("navbar.languages.ru")}
            style={{ width: "20px", marginRight: "10px" }}
          />
          {t("navbar.languages.ru")}
        </div>
      ),
    },
    {
      key: "en",
      label: (
        <div onClick={() => changeLanguage("en")}>
          <img
            src={en}
            alt={t("navbar.languages.en")}
            style={{ width: "20px", marginRight: "10px" }}
          />
          {t("navbar.languages.en")}
        </div>
      ),
    },
  ];
  const profileItems = [
    {
      key: "profile",
      label: (
        <div onClick={() => setProfileModalVisible(true)}>
          <UserOutlined style={{ marginRight: "10px" }} />
          {t("profile.my_profile")}
        </div>
      ),
    },
    // {
    //   key: "address",
    //   label: (
    //     <Link to="/addresses">
    //       <HomeOutlined style={{ marginRight: "10px" }} />
    //       {t("profile.my_address")}
    //     </Link>
    //   ),
    // },
    {
      key: "logout",
      label: (
        <div onClick={handleLogout}>
          <LogoutOutlined style={{ marginRight: "10px" }} />
          {t("profile.logout")}
        </div>
      ),
    },
  ];

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
                  <BrandIcon />
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
              <Dropdown
                menu={{ items }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <span
                  className={styles.navButton}
                  style={{ cursor: "pointer" }}
                >
                  <FaGlobe />
                </span>
              </Dropdown>
            </li>
            <div className={styles.stick}></div>

            {!isAuthenticated ? (
              <>
                <li>
                  <LoginModal />
                </li>
                <div className={styles.stick}></div>
                {/* <li>
                  <SignUpModal />
                </li> */}
              </>
            ) : (
              <>
                <li>
                  <Dropdown
                    menu={{ items: profileItems }}
                    placement="bottomLeft"
                    trigger={["click"]}
                  >
                    <span
                      className={styles.navButton}
                      style={{ cursor: "pointer" }}
                    >
                      <UserOutlined /> {t("profile.my_profile")}
                    </span>
                  </Dropdown>
                </li>
                <div className={styles.stick}></div>
              </>
            )}
            <li>
              <Link to={"/orders"}>
                <Badge
                  style={{ marginRight: "4px" }}
                  count={ordersItemCount}
                  offset={[10, 0]}
                >
                  <button className={styles.navButton}>
                    <OrderIcon />
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
                >
                  <button className={styles.navButton}>
                    <WishlistIcon />
                  </button>
                </Badge>
              </Link>
            </li>
            <div className={styles.stick}></div>
            <li>
              <Link to={"/cart"}>
                <Badge count={cartItemCount} offset={[10, 0]}>
                  <button className={styles.navButton}>
                    <CartIcon />
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
      {isAuthenticated && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
        />
      )}
    </header>
  );
};

export default NavbarDown;