import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Thumbs,
  Pagination,
  Navigation,

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
      const thumbSlide = document.querySelector(
        `.${styles.thumbSlider} .swiper-slide[data-index="${swiper.realIndex}"]`
      );
      if (thumbSlide) {
        thumbSlide.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
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
        <SwiperSlide>
          <img src={temp1} alt="Slider 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp2} alt="Slider 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp3} alt="Slider 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp4} alt="Slider 4" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp5} alt="Slider 5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp6} alt="Slider 5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp7} alt="Slider 5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp8} alt="Slider 5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp9} alt="Slider 5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={temp10} alt="Slider 5" />
        </SwiperSlide>
      </Swiper>

      {/* Küçük Slider */}
      <Swiper
        modules={[Thumbs, Autoplay]}
        onSwiper={setThumbsSwiper}
        autoplay={{ delay: 3000 }}
        slidesPerView={4}
        spaceBetween={10}
        direction="vertical"
        // watchSlidesProgress={true}
        slideToClickedSlide={true}
        // draggable={true}
        loop={true}
        className={styles.thumbSlider}
      >
        {[temp1, temp2, temp3, temp4, temp5, temp7, temp8, temp9, temp10].map(
          (image, index) => (
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
          )
        )}
      </Swiper>
    </div>
  );
}

export default Carousel;