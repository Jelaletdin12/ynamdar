// ProductPage.jsx
import React, { useState } from "react";
import styles from "./ProductPage.module.scss";
import { Heart, ShoppingCart } from "lucide-react";
import temp3 from "../../assets/temp3.jpg";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard/index";

const ProductPage = () => {
  const product = {
    id: "EMK990007",
    name: "Ermak",
    description: 'Gowrulan duzlanan ak günebakar çigidi "Ermak" 100 gr',
    barcode: "4780013610514",
    price: "16.10",
    oldPrice: 19.9,
    blockQuantity: "16 sany",
  };

  const similarProducts = [
    {
      id: 1,
      name: "Abat",
      description: 'Pisse "Abat" duzly 30 gr',
      price: 11.8,
      oldPrice: 12.5,
      discount: 6,
      image: temp3,
    },
    {
      id: 2,
      name: "Gury iýmiş",
      description: 'Hurma "Salehi" 400 gr (±20 gr)',
      price: 23.8,
      oldPrice: 25.2,
      discount: 6,
      image: temp3,
    },
    {
      id: 3,
      name: "Gury iýmiş",
      description: 'Hurma "Salehi" 400 gr (±20 gr)',
      price: 23.8,
      oldPrice: 25.2,
      discount: 6,
      image: temp3,
    },
    {
      id: 4,
      name: "Gury iýmiş",
      description: 'Hurma "Salehi" 400 gr (±20 gr)',
      price: 23.8,
      oldPrice: 25.2,
      discount: 6,
      image: temp3,
    },
  ];
  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };
  const [quantity, setQuantity] = useState(0);
  const handleAddToCart = () => {
    setQuantity(quantity + 1);
  };

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
            <div className={styles.priceContainer}>
              {" "}
              <span className={styles.price}>{product.price} m.</span>
              <span className={styles.oldPrice}>{product.oldPrice} m.</span>
            </div>
            <div className={styles.Btn}>
              <button className={styles.wishlistButton}>
                <Heart className={styles.icon} />
              </button>

              <>
                {quantity > 0 ? (
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() => setQuantity(quantity - 1)}
                      className={styles.quantityBtn}
                    >
                      <svg
                        viewBox="0 0 9 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.41422 6.86246C0.633166 6.08141 0.633165 4.81508 1.41421 4.03403L4.61487 0.833374C5.8748 -0.426555 8.02908 0.465776 8.02908 2.24759V8.6489C8.02908 10.4307 5.8748 11.323 4.61487 10.0631L1.41422 6.86246Z"
                          fill="white"
                        ></path>
                      </svg>
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      <svg
                        viewBox="0 0 9 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.64389 4.03427C7.42494 4.81532 7.42494 6.08165 6.64389 6.8627L3.44324 10.0634C2.18331 11.3233 0.0290222 10.431 0.0290226 8.64914V2.24783C0.0290226 0.466021 2.18331 -0.426312 3.44324 0.833617L6.64389 4.03427Z"
                          fill="white"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart />
                  </button>
                )}
              </>
            </div>
          </div>
        </div>
        <div
          className={styles.productActionsMobile}
          style={{ position: "sticky", bottom: "59px" }}
        >
          <div className={styles.priceContainer}>
            {" "}
            <span className={styles.price}>{product.price} m.</span>
            <span className={styles.oldPrice}>{product.oldPrice} m.</span>
          </div>
          <div className={styles.Btn}>
            <button className={styles.wishlistButton}>
              <Heart className={styles.icon} />
            </button>

            <>
              {quantity > 0 ? (
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    className={styles.quantityBtn}
                  >
                    <svg
                      viewBox="0 0 9 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.41422 6.86246C0.633166 6.08141 0.633165 4.81508 1.41421 4.03403L4.61487 0.833374C5.8748 -0.426555 8.02908 0.465776 8.02908 2.24759V8.6489C8.02908 10.4307 5.8748 11.323 4.61487 10.0631L1.41422 6.86246Z"
                        fill="white"
                      ></path>
                    </svg>
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.quantityBtn}
                  >
                    <svg
                      viewBox="0 0 9 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.64389 4.03427C7.42494 4.81532 7.42494 6.08165 6.64389 6.8627L3.44324 10.0634C2.18331 11.3233 0.0290222 10.431 0.0290226 8.64914V2.24783C0.0290226 0.466021 2.18331 -0.426312 3.44324 0.833617L6.64389 4.03427Z"
                        fill="white"
                      ></path>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart />
                </button>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className={styles.similarProducts}>
        <h2 className={styles.sectionTitle}>Meňzeş harytlar</h2>
        <div className={styles.productsGrid}>
          {similarProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              showAddToCart={true}
              showFavoriteButton={true}
              isFavorite={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
