import React from "react";
import styles from "./CategoryPage.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { TiTick } from "react-icons/ti";
import BrandSidebar from "../../components/BrandsSidebar/index";
import FilterSidebar from "../../components/FilterSidebar/index";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";

const CategoryPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchResults = location.state?.searchData?.data || [];
  const searchQuery = location.state?.searchQuery || null;
  const [searchParams] = useSearchParams();

  // Bu örnek kategori ürünleridir, gerçek verilerle değiştirin
  const categoryProducts = [
    {
      id: 1,
      name: "Ankara",
      description: "Makaron Ankara 'Mantı' 500 gr",
      price_amount: "19.5",
      oldPrice: "19.9",
      discount: "2",
      thumbnail: "path/to/image1.jpg",
    },
    {
      id: 2,
      name: "Carte Noire",
      description: "Kofe Carte Noir 'White' 3x1 kiçi paket 17.4 gr",
      price_amount: "4.4",
      oldPrice: "5.5",
      discount: "20",
      thumbnail: "path/to/image2.jpg",
    },
    // Diğer kategori ürünleri
  ];

  const products = searchQuery ? searchResults : categoryProducts;
  const totalItems = products.length;

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  return (
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {/* Left Sidebar */}
      <h2>
        {searchQuery
          ? `${t("search.resultsFor")}: "${searchQuery}"`
          : "Iymit, kulinariýa"}
      </h2>
      <p className={styles.sum}>
        {t("category.total")}: {totalItems} {t("category.items")}
      </p>
      <div className={styles.bars}>
        <button className={styles.sum}>
          <strong>{t("category.total")}:</strong> <br />
          {totalItems} {t("category.items")}
        </button>
        <BrandSidebar />
        <FilterSidebar />
      </div>
      <div className={styles.subCategories}>
        <button>Miweler</button>
        <button>Gok otlar</button>
        <button>Gok Onumler</button>
      </div>
      <div className={styles.Container}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>{t("category.subCategories")}</h3>
            <ul>
              <li>Gury iýmişler, çigit</li>
              <li>Süýji, marmelad, zefir</li>
              <li>Köke önümleri, keks</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Kofe</li>
              <li>Çay, gyzgyn içgiler</li>
            </ul>
          </div>
          <div className={styles.filterSection}>
            <h3>{t("category.composition")}</h3>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.neverMind")}
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.From_cheap_to_expensive")}
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.From_expensive_to_cheap")}
            </label>
          </div>
          <div className={styles.filterSection}>
            <h3>{t("navbar.brands")}</h3>
            <input type="text" placeholder="Gözleg" />
            <ul>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Rice
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Tea
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.productsContainer}>
          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  showFavoriteButton={true}
                  showAddToCart={true}
                />
              ))
            ) : (
              <div>{t("search.noResults")}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
