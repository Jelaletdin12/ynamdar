import { useState, useRef, useEffect } from "react";
import styles from "./ImageCarousel.module.scss";

const ImageCarousel = ({ images, altText, showThumbnails = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);

  // Check if there are multiple images
  const hasMultipleImages = Array.isArray(images) && images.length > 1;

  // Get current image URL
  const currentImage =
    hasMultipleImages && images[currentIndex]
      ? images[currentIndex].images_400x400
      : images[0]?.images_400x400 || "";

  // Auto-slide functionality - every 9 seconds
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 9000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, images]);

  // Navigate to previous image
  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Navigate to next image
  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index, e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages) return;

    const touchDiff = touchStartX.current - touchEndX.current;

    // Swipe threshold - only respond to intentional swipes
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe left -> Next image
        handleNext();
      } else {
        // Swipe right -> Previous image
        handlePrev();
      }
    }
  };

  // Apply transition effect using CSS
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.classList.add(styles.transitioning);

      const timer = setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.classList.remove(styles.transitioning);
        }
      }, 900); // Match this timing with CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // If there's only one image, just show it
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
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carouselContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={carouselRef} className={styles.imageWrapper}>
          <img
            src={currentImage || "/placeholder.svg"}
            alt={altText || "Ürün resmi"}
            className={styles.productImage}
          />
        </div>

        {/* Navigation arrows */}
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

        {/* Indicators (dots) */}
        <div className={styles.indicators}>
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.indicator} ${
                currentIndex === idx ? styles.active : ""
              }`}
              onClick={(e) => handleThumbnailClick(idx, e)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails - only show if showThumbnails is true */}
      {showThumbnails && (
        <div className={styles.thumbnailContainer}>
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`${styles.thumbnail} ${
                currentIndex === idx ? styles.activeThumbnail : ""
              }`}
              onClick={(e) => handleThumbnailClick(idx, e)}
            >
              <img
                src={
                  image.thumbnail || image.images_400x400 || "/placeholder.svg"
                }
                alt={`${altText || "Ürün"} thumbnail ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;