"use client";

import { useState } from "react";
import styles from "./ImageCarousel.module.scss";

const ImageCarousel = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Birden fazla resim olup olmadığını kontrol et
  const hasMultipleImages = Array.isArray(images) && images.length > 1;

  // Geçerli resim URL'sini al
  const currentImage =
    hasMultipleImages && images[currentIndex]
      ? images[currentIndex].images_400x400
      : images[0]?.images_400x400 || "";

  // Önceki resme geç
  const handlePrev = (e) => {
    e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Sonraki resme geç
  const handleNext = (e) => {
    e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Eğer tek resim varsa sadece resmi göster
  if (!hasMultipleImages) {
    return (
      <img
        src={currentImage || "/placeholder.svg"}
        alt={altText || "Ürün resmi"}
        className={styles.productImage}
      />
    );
  }

  return (
    <div className={styles.carouselContainer}>
      <img
        src={currentImage || "/placeholder.svg"}
        alt={altText || "Ürün resmi"}
        className={styles.productImage}
      />

      {/* Navigasyon okları */}
      <button
        onClick={handlePrev}
        className={`${styles.arrowButton} ${styles.leftArrow}`}
        aria-label="Önceki resim"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={handleNext}
        className={`${styles.arrowButton} ${styles.rightArrow}`}
        aria-label="Sonraki resim"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* İndikatörler (noktalar) */}
      <div className={styles.indicators}>
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.indicator} ${
              currentIndex === idx ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
