import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, Pagination, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import 'swiper/css/scrollbar';


import styles from "./Banner.module.scss";

import temp1 from "../../assets/slider/temp1.jpg";
import temp2 from "../../assets/slider/temp2.jpg";
import temp3 from "../../assets/slider/temp3.jpg";
import temp4 from "../../assets/slider/temp4.jpg";
import temp5 from "../../assets/slider/temp5.jpg";

function Carousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // Aktif slider için state

  return (
    <div className={styles.carouselContainer}>
      {/* Büyük Slider */}
      <Swiper
      // breakpoints={{
      //   // when window width is >= 640px
      //   640: {
      //     width: 640,
      //     slidesPerView: 1,
      //   },
      //   // when window width is >= 768px
      //   768: {
      //     width: 768,
      //     slidesPerView: 1,
      //   },
      // }}
        modules={[Thumbs, Pagination, Navigation, Autoplay]}
        thumbs={{ swiper: thumbsSwiper }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          clickable: true,
          
        }}
        navigation={true}
        className={styles.mainSlider}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
         // Aktif slider değiştiğinde index güncelle
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
      </Swiper>

      {/* Küçük Slider */}
      <Swiper
        modules={[Thumbs, Autoplay, Scrollbar]}
        onSwiper={setThumbsSwiper}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        slidesPerView={4}
        spaceBetween={10}
        direction="vertical"
        loop={true}
        // scrollbar={{
        //   hide: true,
        // }}
        className={styles.thumbSlider}
      >
        {[temp1, temp2, temp3, temp4, temp5].map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className={`${styles.thumbWrapper} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
              {index === activeIndex && (
                <>
                <div className={styles.progressBarImg}>
                </div>
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
