import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Thumbs,
  Pagination,
  Navigation,
  Mousewheel,
  FreeMode,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/navigation";

import styles from "./Banner.module.scss";
import { useGetCarouselsQuery } from "../../app/api/bannersApi.js";

function Carousel() {
  const { data, isLoading, isError } = useGetCarouselsQuery();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const thumbSliderRef = useRef(null);

  useEffect(() => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, [activeIndex]);

  const updateScrollPosition = (targetIndex) => {
    if (!thumbSliderRef.current) return;

    const container = thumbSliderRef.current.querySelector(".swiper-wrapper");
    const slideHeight = container.children[0]?.offsetHeight || 0;
    const spaceBetween = 15;
    const scrollPosition = targetIndex * (slideHeight + spaceBetween);

    container.parentNode.scrollTop = scrollPosition;
  };

  const handleSlideChange = (swiper) => {
    const newActiveIndex = swiper.realIndex;
    setActiveIndex(newActiveIndex);

    if (thumbsSwiper?.slides) {
      const slidesPerView = 4;
      let targetIndex = newActiveIndex - Math.floor(slidesPerView / 2);
      targetIndex = Math.max(
        0,
        Math.min(targetIndex, thumbsSwiper.slides.length - slidesPerView)
      );

      thumbsSwiper.slideTo(targetIndex, 300);
      updateScrollPosition(targetIndex);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data || !data.data || data.data.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Main Slider */}
      <Swiper
        modules={[Thumbs, Pagination, Navigation, Autoplay]}
        thumbs={{ swiper: thumbsSwiper }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className={styles.mainSlider}
        onSlideChange={handleSlideChange}
      >
        {data.data.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              src={item.image}
              alt={item.title || `Carousel Image ${item.id}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider */}
      <Swiper
        ref={thumbSliderRef}
        modules={[Thumbs, Autoplay, FreeMode, Mousewheel]}
        onSwiper={setThumbsSwiper}
        autoplay={{ delay: 3000 }}
        slidesPerView={4}
        spaceBetween={10}
        direction="vertical"
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        cssMode={true}
        loop={false}
        allowTouchMove={true}
        className={styles.thumbSlider}
      >
        {data.data.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              className={`${styles.thumbWrapper} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              <img
                src={item.thumbnail}
                alt={item.title || `Thumbnail ${index + 1}`}
              />
              {index === activeIndex && isAnimating && (
                <>
                  <div className={styles.progressBarImg}></div>
                  <div className={styles.progressBar}></div>
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;