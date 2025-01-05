import React from "react";
import styles from "./ProductCard.module.scss";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";


const ProductCard = ({ product, discount,  }) => {
  return (
   <div className={styles.productGrid}>
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
                     <IoMdHeartEmpty />
                   </button>
                   <button className={styles.addToCartButton}>
                     <FaShoppingCart />
                   </button>
                 </div>
               </div>
             </div>
         </div>
  );
};

export default ProductCard;
