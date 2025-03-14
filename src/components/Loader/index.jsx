import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.scss";

export const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    return () => setLoading(false);
  }, []);

  return loading ? (
    <div className={styles.loaderContainer}>
      <div className={styles.dotWaveLoader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  ) : null;
};

export default Loader;