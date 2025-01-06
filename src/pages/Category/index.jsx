import React from "react";
import styles from "./CategoryPage.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";

const CategoryPage = () => {
  const products = [
    {
      id: 1,
      name: "Ankara",
      description: "Makaron Ankara 'Mantı' 500 gr",
      price: 19.5,
      oldPrice: 19.9,
      discount: "-2%",
      img: "path/to/image", // Replace with actual image path
    },
    {
      id: 2,
      name: "Carte Noire",
      description: "Kofe Carte Noir 'White' 3x1 kiçi paket 17.4 gr",
      price: 4.4,
      oldPrice: 5.5,
      discount: "-20%",
      img: temp2,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    {
      id: 3,
      name: "Carte Noire",
      description: "Kofe Carte Noire 'Elegant' paket gapda 75 gr",
      price: 75.8,
      oldPrice: null,
      discount: null,
      img: temp1,
    },
    
  ];

  return (
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {/* Left Sidebar */}
      <h2>Ýmit, kulinariýa</h2>
      <p>Jemi: 2291 haryt</p>
      <div style={{ display: "flex", gap:"20px", paddingTop:"20px" }}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>Önümler</h3>
            <ul>
              <li>Gury iýmişler, çigit</li>
              <li>Süýji, marmelad, zefir</li>
              <li>Köke önümleri, keks</li>
              <li>Köke önümleri, keks</li>
              <li>Köke önümleri, keks</li>
              <li>Köke önümleri, keks</li>
              <li>Köke önümleri, keks</li>
              <li>Köke önümleri, keks</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Şokolad</li>
              <li>Kofe</li>
              <li>Çay, gyzgyn içgiler</li>
            </ul>
          </div>
          <div className={styles.filterSection}>
            <h3>Tertip</h3>
            <label>
              <input type="radio" name="sort" /> Hiç hili
            </label>
            <label>
              <input type="radio" name="sort" /> Arzandan gymmada
            </label>
            <label>
              <input type="radio" name="sort" /> Gymmatdan arzana
            </label>
          </div>
          <div className={styles.filterSection}>
            <h3>Brend</h3>
            <input type="text" placeholder="Gözleg" />
            <ul>
              <li>
                <label>
                  <input type="checkbox" /> Mahmood Rice
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> Mahmood Tea
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.productsContainer}>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <img src={product.img} alt={product.name} />
                {product.discount && (
                  <span className={styles.discount}>{product.discount}</span>
                )}
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div className={styles.price}>
                  <span>{product.price} m.</span>
                  {product.oldPrice && (
                    <span className={styles.oldPrice}>
                      {product.oldPrice} m.
                    </span>
                  )}
                </div>
                <button className={styles.addToCart}>Add to Cart</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
