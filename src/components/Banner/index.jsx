import React, { useState, useEffect } from "react";
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

import temp1 from "../../assets/slider/temp1.jpg";
import temp2 from "../../assets/slider/temp2.jpg";
import temp3 from "../../assets/slider/temp3.jpg";
import temp4 from "../../assets/slider/temp4.jpg";
import temp5 from "../../assets/slider/temp5.jpg";
import temp6 from "../../assets/slider/temp5.jpg";
import temp7 from "../../assets/slider/temp5.jpg";
import temp8 from "../../assets/slider/temp5.jpg";
import temp9 from "../../assets/slider/temp5.jpg";
import temp10 from "../../assets/slider/temp5.jpg";

function Carousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  

  useEffect(() => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, [activeIndex]);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    if (thumbsSwiper) {
      const targetIndex = Math.floor(swiper.realIndex / 4) * 4;
      thumbsSwiper.slideToLoop(targetIndex, 300, false);
    }
  };
  
  return (
    <div className={styles.carouselContainer}>
      {/* Büyük Slider */}
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
        {[temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8, temp9, temp10].map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Slider ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Küçük Slider */}
      <Swiper
        modules={[Thumbs, Autoplay, FreeMode, Mousewheel]}
        onSwiper={setThumbsSwiper}
        autoplay={{ delay: 3000 }}
       slidesPerView="auto"
        spaceBetween={10}
        direction="vertical"
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
        }}
        freeMode={{
          enabled: true,
          sticky: false,
        }}
        cssMode={true}
        loop={false}
        allowTouchMove={true}
        className={styles.thumbSlider}
      >
        {[
          temp1,
          temp2,
          temp3,
          temp4,
          temp5,
          temp6,
          temp7,
          temp8,
          temp9,
          temp10,
        ].map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className={`${styles.thumbWrapper} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
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
