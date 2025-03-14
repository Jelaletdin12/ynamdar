import React from "react";
import { Skeleton, Card } from "antd";
import styles from "./skeleton.module.scss";

const SkeletonProductCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <Card
        bordered={false}
        cover={
          <Skeleton.Image className={styles.skeletonImage} active={true} />
        }
      >
        <Skeleton active paragraph={{ rows: 2 }} title={{ width: "70%" }} />
        <Skeleton.Button
          active
          size="default"
          shape="round"
          className={styles.priceButton}
        />
      </Card>
    </div>
  );
};

export default SkeletonProductCard;
