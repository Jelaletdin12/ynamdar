// ProductListing.jsx
import React from "react";
import styles from "./WishListing.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard/index";

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

  const handleAddToCart = (product) => {
    // Implement cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    // Implement favorite toggle logic here
    console.log("Toggling favorite:", product);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Halanlarym</h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
           <ProductCard
           key={product.id}
           product={product}
           onAddToCart={handleAddToCart}
           onToggleFavorite={handleToggleFavorite}
           isFavorite={true} // Since this is wishlist, all items are favorites
           showFavoriteButton={true}
           showAddToCart={true}
         />
        ))}
      </div>
    </div>
  );
};

export default WishtList;
