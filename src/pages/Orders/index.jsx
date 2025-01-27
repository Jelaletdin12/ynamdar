// SargytlarymComponent.jsx
import React from "react";
import styles from "./Orders.module.scss";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sargytlarym</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sargyt belgisi</th>
              <th>Sargyt senesi</th>
              <th>Jemi</th>
              <th>Töleg şekili</th>
              <th>Yagdayy</th>
              <th>Hereket</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2501258856309</td>
              <td>25.01.2025 10:12</td>
              <td style={{ color: "#ec6323", fontWeight: "600" }}>63.30 m.</td>
              <td>Nagt</td>
              <td>Goybolsun edili</td>
              <td>
                <Link to={"/orderdetail"}>
                
                <button className={styles.actionButton}>Maglumat</button>
                </Link>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to={"/orderdetail"}>
      <div className={styles.Mobilecontainer}>
        <div className={styles.orderCard}>
          <div className={styles.orderRow}>
            <span className={styles.label}>Sargyt belgi:</span>
            <span className={styles.value}>250125885309</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Sargyt senesi:</span>
            <span className={styles.value}>25.01.2025 10:12</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Jemi:</span>
            <span className={styles.total}>63.30 m.</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Töleg şekili:</span>
            <span className={styles.value}>Nagt</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Ýagdaýy:</span>
            <span className={styles.value}>Goýbolsun edildi</span>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Orders;
