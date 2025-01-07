// ProductPage.jsx
import React from 'react';
import styles from './ProductPage.module.scss';
import { Heart, ShoppingCart } from 'lucide-react';
import temp3 from "../../assets/temp3.jpg";

const ProductPage = () => {
  const product = {
    id: 'EMK990007',
    name: 'Ermak',
    description: 'Gowrulan duzlanan ak günebakar çigidi "Ermak" 100 gr',
    barcode: '4780013610514',
    price: '16.10',
    blockQuantity: '16 sany',
  };

  const similarProducts = [
    {
      id: 1,
      name: 'Abat',
      description: 'Pisse "Abat" duzly 30 gr',
      price: '11.80',
      oldPrice: '12.50',
      discount: '-6%',
      image: temp3
    },
    {
      id: 2,
      name: 'Gury iýmiş',
      description: 'Hurma "Salehi" 400 gr (±20 gr)',
      price: '23.80',
      oldPrice: '25.20',
      discount: '-6%',
      image: temp3
    },
    // Add other similar products...
  ];

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>Iýmit, kulinariya</span>
        <span className={styles.separator}>/</span>
        <span>Gury iýmişler, çigit</span>
      </div>

      {/* Product Details */}
      <div className={styles.productSection}>
        <div className={styles.productImage}>
          <img src={temp3} alt="Ermak seeds" />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <p className={styles.productDescription}>{product.description}</p>
          
          <div className={styles.productMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Haryt kody</span>
              <span className={styles.metaValue}>{product.id}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Barkod</span>
              <span className={styles.metaValue}>{product.barcode}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Blokda</span>
              <span className={styles.metaValue}>{product.blockQuantity}</span>
            </div>
          </div>

          <div className={styles.productActions}>
            <div className={styles.price}>{product.price} m.</div>
            <button className={styles.wishlistButton}>
              <Heart className={styles.icon} />
            </button>
            <button className={styles.addToCartButton}>
              <ShoppingCart className={styles.icon} />
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className={styles.similarProducts}>
        <h2 className={styles.sectionTitle}>Meňzeş harytlar</h2>
        <div className={styles.productsGrid}>
          {similarProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              {product.discount && (
                <span className={styles.discount}>{product.discount}</span>
              )}
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className={styles.productCardFooter}>
                <div className={styles.priceInfo}>
                  <span className={styles.currentPrice}>{product.price} m.</span>
                  {product.oldPrice && (
                    <span className={styles.oldPrice}>{product.oldPrice} m.</span>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.wishlistButton}>
                    <Heart className={styles.icon} />
                  </button>
                  <button className={styles.addToCartButton}>
                    <ShoppingCart className={styles.icon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;