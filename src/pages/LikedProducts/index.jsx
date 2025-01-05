// ProductListing.jsx
import React from "react";
import styles from "./WishListing.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const WishtList = () => {
  const products = [
    {
      id: 1,
      name: "Bebedor",
      description: 'Standart silikon emzik "Bebedor" gülgüne',
      price: 32.5,
      oldPrice: 65.0,
      discount: 50,
      image: temp1,
    },
    {
      id: 2,
      name: "Philips Avent",
      description:
        'Emzikli çüýşe Philips Avent "Natural Response" 3 aý+ plastik 330 ml',
      price: 259.5,
      oldPrice: 519.0,
      discount: 50,
      image: temp2,
    },
    {
      id: 3,
      name: "Philips Avent",
      description:
        'Emzikli çüýşe Philips Avent "Natural Response" 3 aý+ plastik 330 ml',
      price: 259.5,
      oldPrice: 519.0,
      discount: 50,
      image: temp2,
    },
    {
      id: 4,
      name: "Philips Avent",
      description:
        'Emzikli çüýşe Philips Avent "Natural Response" 3 aý+ plastik 330 ml',
      price: 259.5,
      oldPrice: 519.0,
      discount: 50,
      image: temp3,
    },
    {
      id: 5,
      name: "Philips Avent",
      description:
        'Emzikli çüýşe Philips Avent "Natural Response" 3 aý+ plastik 330 ml',
      price: 259.5,
      oldPrice: 519.0,
      discount: 50,
      image: temp1,
    },
    // Add other products similarly
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Halanlarym</h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            {product.discount && (
              <span className={styles.discountBadge}>-{product.discount}%</span>
            )}
            <div className={styles.imageContainer}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>
                  {product.price.toFixed(2)} m.
                </span>
                {product.oldPrice && (
                  <span className={styles.oldPrice}>
                    {product.oldPrice.toFixed(2)} m.
                  </span>
                )}
              </div>
              <div className={styles.actions}>
                <button className={styles.favoriteButton}>
                  <FaHeart />
                </button>
                <button className={styles.addToCartButton}>
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishtList;
