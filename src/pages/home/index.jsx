import React from "react";
import CategorySection from "../../components/CategorySection/index";
import Carousel from "../../components/Banner/index";
import styles from "./Home.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";

const Home = () => {
  const sampleProducts = [
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

  return (
    <div className={styles.home}>
      <div className={styles.sections}>
        <Carousel />
        <CategorySection title="Popüler Ürünler" products={sampleProducts} />
        <CategorySection title="Kampanyalı Ürünler" products={sampleProducts} />
      </div>
    </div>
  );
};

export default Home;
