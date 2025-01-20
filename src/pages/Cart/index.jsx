// CartPage.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./CartPage.module.scss";
import temp1 from "../../assets/temp1.jpg";
import temp2 from "../../assets/temp2.jpg";
import temp3 from "../../assets/temp3.jpg";
import { FaTrashAlt } from "react-icons/fa";
import Checkout from "../../components/Checkout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "antd";

const CartPage = () => {
  const [isCheckout, setIsCheckout] = useState(false);
  const handleCheckout = () => setIsCheckout(true);
  const handleBackToCart = () => setIsCheckout(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedRef = useRef(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [emptyCartModalVisible, setEmptyCartModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bebedor",
      description: 'Standart silikon emzik "Bebedor" görünüşe',
      price: 65.0,
      image: temp1,
      quantity: 2,
    },
    {
      id: 2,
      name: "Chicco",
      description:
        'Bir yumuşaklay Chicco "Sweet Talcum" sensitive 1500ml (0 ay+)',
      price: 538.5,
      image: temp2,
      quantity: 3,
    },
    {
      id: 3,
      name: "Philips Avent",
      description:
        'Emzikli şüşe çeşidi Philips Avent "Natural Response" 1 ay+ plastik 260 ml',
      price: 498.0,
      image: temp3,
      quantity: 2,
    },
    {
      id: 4,
      name: "Jacobs",
      description: "Kofe Jacobs Asian, çüyələ qəpsdə 90 gr",
      price: 172.4,
      image: temp1,
      quantity: 2,
    },
  ]);

  const modalProps = {
    centered: true,
    className: styles.cartDeleteModal,
    maskClosable: false,
    width: 400,
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDeleteConfirm = (itemId) => {
    setItemToDelete(itemId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setCartItems(cartItems.filter(item => item.id !== itemToDelete));
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const showEmptyCartConfirm = () => {
    setEmptyCartModalVisible(true);
  };

  const handleEmptyCartConfirm = () => {
    setCartItems([]);
    setEmptyCartModalVisible(false);
  };
  // const handleCheckout = () => setIsCheckout(true);
  // const handleBackToCart = () => setIsCheckout(false);

  return (
    <div className={styles.cartContainer}>
       <Modal
       {...modalProps}
        title="Tassyklaň"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Hawa"
        cancelText="Ýok"
      >
        <p>Siz bu harydyňyzy sebetiňizden aýyrmak isleýärsiňizmi?</p>
      </Modal>

      {/* Empty Cart Modal */}
      <Modal
      {...modalProps}
        title="Tassyklaň"
        open={emptyCartModalVisible}
        onOk={handleEmptyCartConfirm}
        onCancel={() => setEmptyCartModalVisible(false)}
        okText="Hawa"
        cancelText="Ýok"
      >
        <p>Siz sebetiňizi doly boşatmak isleýärsiňizmi?</p>
      </Modal>
      <div className={styles.cartItems}>
        <div className={styles.cartProducts}>
          {isCheckout ? (
            <Checkout cartItems={cartItems} onBackToCart={handleBackToCart} />
          ) : (
            <div className={styles.cartItemContainer}>
              <div className={styles.cartHeader}>
                <h2>
                  Sebedim (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <div>
                  <button
                    className={styles.deleteBtn}
                    style={{ padding: "4px 12px" }}
                    onClick={showEmptyCartConfirm}
                  >
                    <FaTrashAlt /> Sebedi Bosat
                  </button>
                </div>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div style={{ flex: "1" }}>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className={styles.priceQuantity}>
                      <span className={styles.price}>
                        {item.price.toFixed(2)} m.
                      </span>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={styles.quantityBtn}
                        >
                          <svg
                            viewBox="0 0 9 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.41422 6.86246C0.633166 6.08141 0.633165 4.81508 1.41421 4.03403L4.61487 0.833374C5.8748 -0.426555 8.02908 0.465776 8.02908 2.24759V8.6489C8.02908 10.4307 5.8748 11.323 4.61487 10.0631L1.41422 6.86246Z"
                              fill="white"
                            ></path>
                          </svg>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={styles.quantityBtn}
                        >
                          <svg
                            viewBox="0 0 9 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.64389 4.03427C7.42494 4.81532 7.42494 6.08165 6.64389 6.8627L3.44324 10.0634C2.18331 11.3233 0.0290222 10.431 0.0290226 8.64914V2.24783C0.0290226 0.466021 2.18331 -0.426312 3.44324 0.833617L6.64389 4.03427Z"
                              fill="white"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className={styles.deleteBtnContainer}>
                      <button className={styles.deleteBtn}  onClick={() => showDeleteConfirm(item.id)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.cartSummary}>
            <div className={styles.cartContent}>
              <h3>Sebedim:</h3>
              <div className={styles.summaryRow}>
                <span>Bahasy::</span>
                <span>{calculateTotal().toFixed(2)} m.</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Eltip berme :</span>
                <span>0.00 m.</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Jemi:</span>
                <span>{calculateTotal().toFixed(2)} m.</span>
              </div>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              Sargydy tayyarlamak
            </button>
          </div>

          <div className={styles.container}>
            <div className={styles.summaryCard} ref={expandedRef}>
              {/* Expanded Content - Appears above the header when expanded */}
              <div
                className={`${styles.expandedContent} ${
                  isExpanded ? styles.visible : ""
                }`}
              >
                <div className={styles.details}>
                  <div className={styles.row}>
                    <span>Bahasy:</span>
                    <span className={styles.amount}>2124.00 m.</span>
                  </div>
                  <div className={styles.row}>
                    <span>Eltip berme:</span>
                    <span className={styles.amount}>0.00 m.</span>
                  </div>
                </div>
              </div>

              {/* Header - Always visible */}
              <div className={styles.header}>
                <div
                  className={styles.titleWrapper}
                  onClick={(e) => {
                    setIsExpanded(!isExpanded);
                    e.target.style.outline = "none";
                  }}
                >
                  <span>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                    Jemi:
                  </span>
                  <span className={styles.amount}>2124.00 m.</span>
                </div>
                <div className={styles.actionWrapper}>
                  <button className={styles.button}>Sargydy taýýarlamak</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
