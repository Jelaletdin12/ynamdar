import React from "react";
import styles from "./CategoryPage.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";
import ProductCard from "../../components/ProductCard/index";
import { TiTick } from "react-icons/ti";
import { TiArrowUnsorted } from "react-icons/ti";
import arrow from "../../assets/icons/topBottom.svg";
import brand from "../../assets/icons/brand.svg";

const CategoryPage = () => {
  const products = [
    {
      id: 1,
      name: "Ankara",
      description: "Makaron Ankara 'Mantı' 500 gr",
      price: 19.5,
      oldPrice: 19.9,
      discount: "2",
      image: temp2,
    },
    {
      id: 2,
      name: "Carte Noire",
      description: "Kofe Carte Noir 'White' 3x1 kiçi paket 17.4 gr",
      price: 4.4,
      oldPrice: 5.5,
      discount: "20",
      image: temp2,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      image: temp1,
    },
  ];

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  return (
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {/* Left Sidebar */}
      <h2>Iymit, kulinariýa</h2>
      <p className={styles.sum}>Jemi: 2291 haryt</p>
      <div className={styles.bars}>
        <button>
          {" "}
          <strong>Jemi:</strong> <br /> 2291 haryt
        </button>
        <button>
          {" "}
          <img src={brand} alt="" /> Brand
        </button>
        <button>
          {" "}
          <img src={arrow} alt="" /> Suzguc
        </button>
      </div>
      <div className={styles.subCategories}>
        <button>Miweler</button>
        <button>Gok otlar</button>
        <button>Gok Onumler</button>
      </div>
      <div className={styles.Container}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>Önümler</h3>
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
            <h3>Tertip</h3>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              Hiç hili
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              Arzandan gymmada
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              Gymmatdan arzana
            </label>
          </div>
          <div className={styles.filterSection}>
            <h3>Brend</h3>
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={true}
                showAddToCart={true}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
