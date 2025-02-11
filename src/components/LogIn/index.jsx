import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import IMask from "imask";
import styles from "./LoginModal.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const LoginModal = ({isVisible: propIsVisible, onClose: propOnClose }) => {
 const { t, i18n } = useTranslation();
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  
  const isControlled = propIsVisible !== undefined;
  const isVisible = isControlled ? propIsVisible : internalIsVisible;
  
  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("+993");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const phoneInputRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    if (activeTab === "phone" && phoneInputRef.current) {
      
      const inputElement = phoneInputRef.current.input;
      
      if (inputElement) {
        const maskOptions = {
          mask: '+{993} 00 000000',
          lazy: false,
          placeholderChar: '_'
        };
        
        maskRef.current = IMask(inputElement, maskOptions);
        maskRef.current.value = phone;
        
        maskRef.current.on('accept', () => {
          setPhone(maskRef.current.value);
        });

        return () => {
          if (maskRef.current) {
            maskRef.current.destroy();
            maskRef.current = null;
          }
        };
      }
    }
  }, [activeTab]);

  const showModal = () => {
    if (!isControlled) {
      setInternalIsVisible(true);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Modal.confirm({
        title: t("common.Are_you_sure_you_want_to_close_the_modal"),
        icon: <ExclamationCircleOutlined />,
        okText: t("common.yes"),
        cancelText: t("common.no"),
        onOk() {
          closeModal();
          resetForm();
        },
      });
    } else {
      closeModal();
      resetForm();
    }
  };

    const resetForm = () => {
    setPhone("+993 "); 
    setEmail("");
    setMessage("");
    setMessageTitle("");
    setHasChanges(false);
  };

  const handleInputChange = (type, value) => {
    setHasChanges(true);
    switch (type) {
      case "phone":
        if (maskRef.current) {
          maskRef.current.value = value;
        }
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setMessage(value);
        break;
      case "messageTitle":
        setMessageTitle(value);
        break;
      default:
        break;
    }
  };
  const closeModal = () => {
    if (isControlled) {
      propOnClose?.();
    } else {
      setInternalIsVisible(false);
    }
  };

  const handleSubmit = () => {
    console.log({
      type: activeTab,
      phone,
      email,
      message,
      messageTitle,
    });
  };

  return (
    <>
       {!isControlled && (
      <Button onClick={showModal} className={styles.navButton}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212">
          <path
            id="path"
            d="M 78.76 21.76 L 45.92 21.76 C 39.359 21.765 33.062 24.376 28.421 29.014 C 23.781 33.653 21.168 39.949 21.16 46.51 L 21.16 68.36 C 21.227 70.082 21.959 71.714 23.201 72.909 C 24.443 74.104 26.101 74.772 27.825 74.772 C 29.549 74.772 31.207 74.104 32.449 72.909 C 33.691 71.714 34.423 70.082 34.49 68.36 L 34.49 46.51 C 34.493 43.481 35.699 40.575 37.841 38.434 C 39.984 36.294 42.891 35.09 45.92 35.09 L 78.76 35.09 C 80.482 35.023 82.114 34.291 83.309 33.049 C 84.504 31.807 85.172 30.149 85.172 28.425 C 85.172 26.701 84.504 25.043 83.309 23.801 C 82.114 22.559 80.482 21.827 78.76 21.76 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_1"
            d="M 78.76 177.59 L 45.92 177.59 C 42.891 177.587 39.983 176.381 37.841 174.239 C 35.699 172.097 34.493 169.189 34.49 166.16 L 34.49 144.31 C 34.423 142.588 33.691 140.956 32.449 139.761 C 31.207 138.566 29.549 137.898 27.825 137.898 C 26.101 137.898 24.443 138.566 23.201 139.761 C 21.959 140.956 21.227 142.588 21.16 144.31 L 21.16 166.16 C 21.168 172.721 23.781 179.017 28.421 183.656 C 33.062 188.294 39.359 190.905 45.92 190.91 L 78.76 190.91 C 80.526 190.91 82.221 190.208 83.469 188.959 C 84.718 187.711 85.42 186.016 85.42 184.25 C 85.42 182.484 84.718 180.789 83.469 179.541 C 82.221 178.292 80.526 177.59 78.76 177.59 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_2"
            d="M 21.16 106.3 C 21.155 107.474 21.46 108.629 22.044 109.648 C 22.628 110.666 23.47 111.513 24.486 112.101 C 25.502 112.69 26.656 113 27.83 113 L 60.24 113 L 50.43 122.81 C 49.429 123.803 48.769 125.089 48.545 126.481 C 48.321 127.874 48.545 129.301 49.183 130.559 C 49.822 131.816 50.844 132.838 52.1 133.478 C 53.357 134.118 54.784 134.343 56.177 134.121 C 57.569 133.898 58.856 133.24 59.85 132.24 L 81 111 C 81.828 110.174 82.425 109.144 82.728 108.015 C 83.031 106.885 83.031 105.695 82.728 104.565 C 82.425 103.436 81.828 102.406 81 101.58 L 59.85 80.4 C 58.599 79.158 56.904 78.462 55.141 78.465 C 53.378 78.469 51.686 79.172 50.44 80.42 C 49.194 81.667 48.492 83.36 48.49 85.123 C 48.489 86.886 49.187 88.58 50.43 89.83 L 60.24 99.64 L 27.83 99.64 C 26.063 99.64 24.367 100.342 23.117 101.59 C 21.867 102.838 21.163 104.533 21.16 106.3 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_3"
            d="M 173.13 24.34 L 130.67 12.89 C 125.763 11.565 120.564 11.784 115.785 13.516 C 111.006 15.249 106.875 18.412 103.957 22.574 C 101.038 26.735 99.471 31.697 99.47 36.78 L 99.47 175.78 C 99.475 182.331 102.077 188.621 106.702 193.261 C 111.328 197.901 117.609 200.524 124.16 200.55 C 126.359 200.546 128.547 200.254 130.67 199.68 L 173.13 188.23 C 178.38 186.807 183.019 183.694 186.327 179.376 C 189.635 175.058 191.432 169.77 191.44 164.33 L 191.44 48.24 C 191.434 42.8 189.637 37.51 186.329 33.192 C 183.02 28.874 178.381 25.762 173.13 24.34 Z M 178.13 164.34 C 178.117 166.845 177.284 169.277 175.758 171.264 C 174.232 173.25 172.097 174.682 169.68 175.34 L 127.2 186.85 C 124.937 187.461 122.54 187.362 120.336 186.565 C 118.131 185.769 116.224 184.313 114.875 182.396 C 113.525 180.48 112.797 178.194 112.79 175.85 L 112.79 36.85 C 112.793 33.826 113.994 30.923 116.13 28.781 C 118.266 26.64 121.166 25.431 124.19 25.42 C 125.203 25.421 126.212 25.555 127.19 25.82 L 169.66 37.2 C 172.077 37.858 174.212 39.29 175.738 41.276 C 177.264 43.263 178.097 45.695 178.11 48.2 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_4"
            d="M 135.41 88.1 C 133.644 88.1 131.949 88.802 130.701 90.051 C 129.452 91.299 128.75 92.994 128.75 94.76 L 128.75 117.84 C 128.817 119.562 129.549 121.194 130.791 122.389 C 132.033 123.584 133.691 124.252 135.415 124.252 C 137.139 124.252 138.797 123.584 140.039 122.389 C 141.281 121.194 142.013 119.562 142.08 117.84 L 142.08 94.76 C 142.077 92.993 141.373 91.298 140.123 90.05 C 138.873 88.802 137.177 88.1 135.41 88.1 Z"
            fill="currentColor"
          ></path>
        </svg>
        {t("profile.login")}
      </Button>
    )}
      <Modal
        title={t("profile.login")}
        open={isVisible}
        onCancel={handleCancel}
        footer={null}
        className={styles.modalWrapper}
        closeIcon={<span>×</span>}
      >
        <div className={styles.tabWrapper}>
          <div
            className={`${styles.tab} ${
              activeTab === "phone" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("phone")}
          >
             {t("profile.telephone")}
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === "email" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("email")}
          >
             {t("profile.email")}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>{activeTab === "phone" ? "Telefon" : "Email"}</label>
          {activeTab === "phone" ? (
            <Input
              ref={phoneInputRef}
              value={phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={styles.phoneInput}
            />
          ) : (
            <Input
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          )}
        </div>

        <div className={styles.inputGroup}>
          <label> {t("profile.password")}</label>
          <Input
            value={message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
        <div className={styles.forgotPassword}>
          <p> {t("profile.forgotPass")}</p>
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212">
            <path
              id="path"
              d="M 78.76 21.76 L 45.92 21.76 C 39.359 21.765 33.062 24.376 28.421 29.014 C 23.781 33.653 21.168 39.949 21.16 46.51 L 21.16 68.36 C 21.227 70.082 21.959 71.714 23.201 72.909 C 24.443 74.104 26.101 74.772 27.825 74.772 C 29.549 74.772 31.207 74.104 32.449 72.909 C 33.691 71.714 34.423 70.082 34.49 68.36 L 34.49 46.51 C 34.493 43.481 35.699 40.575 37.841 38.434 C 39.984 36.294 42.891 35.09 45.92 35.09 L 78.76 35.09 C 80.482 35.023 82.114 34.291 83.309 33.049 C 84.504 31.807 85.172 30.149 85.172 28.425 C 85.172 26.701 84.504 25.043 83.309 23.801 C 82.114 22.559 80.482 21.827 78.76 21.76 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_1"
              d="M 78.76 177.59 L 45.92 177.59 C 42.891 177.587 39.983 176.381 37.841 174.239 C 35.699 172.097 34.493 169.189 34.49 166.16 L 34.49 144.31 C 34.423 142.588 33.691 140.956 32.449 139.761 C 31.207 138.566 29.549 137.898 27.825 137.898 C 26.101 137.898 24.443 138.566 23.201 139.761 C 21.959 140.956 21.227 142.588 21.16 144.31 L 21.16 166.16 C 21.168 172.721 23.781 179.017 28.421 183.656 C 33.062 188.294 39.359 190.905 45.92 190.91 L 78.76 190.91 C 80.526 190.91 82.221 190.208 83.469 188.959 C 84.718 187.711 85.42 186.016 85.42 184.25 C 85.42 182.484 84.718 180.789 83.469 179.541 C 82.221 178.292 80.526 177.59 78.76 177.59 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_2"
              d="M 21.16 106.3 C 21.155 107.474 21.46 108.629 22.044 109.648 C 22.628 110.666 23.47 111.513 24.486 112.101 C 25.502 112.69 26.656 113 27.83 113 L 60.24 113 L 50.43 122.81 C 49.429 123.803 48.769 125.089 48.545 126.481 C 48.321 127.874 48.545 129.301 49.183 130.559 C 49.822 131.816 50.844 132.838 52.1 133.478 C 53.357 134.118 54.784 134.343 56.177 134.121 C 57.569 133.898 58.856 133.24 59.85 132.24 L 81 111 C 81.828 110.174 82.425 109.144 82.728 108.015 C 83.031 106.885 83.031 105.695 82.728 104.565 C 82.425 103.436 81.828 102.406 81 101.58 L 59.85 80.4 C 58.599 79.158 56.904 78.462 55.141 78.465 C 53.378 78.469 51.686 79.172 50.44 80.42 C 49.194 81.667 48.492 83.36 48.49 85.123 C 48.489 86.886 49.187 88.58 50.43 89.83 L 60.24 99.64 L 27.83 99.64 C 26.063 99.64 24.367 100.342 23.117 101.59 C 21.867 102.838 21.163 104.533 21.16 106.3 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_3"
              d="M 173.13 24.34 L 130.67 12.89 C 125.763 11.565 120.564 11.784 115.785 13.516 C 111.006 15.249 106.875 18.412 103.957 22.574 C 101.038 26.735 99.471 31.697 99.47 36.78 L 99.47 175.78 C 99.475 182.331 102.077 188.621 106.702 193.261 C 111.328 197.901 117.609 200.524 124.16 200.55 C 126.359 200.546 128.547 200.254 130.67 199.68 L 173.13 188.23 C 178.38 186.807 183.019 183.694 186.327 179.376 C 189.635 175.058 191.432 169.77 191.44 164.33 L 191.44 48.24 C 191.434 42.8 189.637 37.51 186.329 33.192 C 183.02 28.874 178.381 25.762 173.13 24.34 Z M 178.13 164.34 C 178.117 166.845 177.284 169.277 175.758 171.264 C 174.232 173.25 172.097 174.682 169.68 175.34 L 127.2 186.85 C 124.937 187.461 122.54 187.362 120.336 186.565 C 118.131 185.769 116.224 184.313 114.875 182.396 C 113.525 180.48 112.797 178.194 112.79 175.85 L 112.79 36.85 C 112.793 33.826 113.994 30.923 116.13 28.781 C 118.266 26.64 121.166 25.431 124.19 25.42 C 125.203 25.421 126.212 25.555 127.19 25.82 L 169.66 37.2 C 172.077 37.858 174.212 39.29 175.738 41.276 C 177.264 43.263 178.097 45.695 178.11 48.2 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_4"
              d="M 135.41 88.1 C 133.644 88.1 131.949 88.802 130.701 90.051 C 129.452 91.299 128.75 92.994 128.75 94.76 L 128.75 117.84 C 128.817 119.562 129.549 121.194 130.791 122.389 C 132.033 123.584 133.691 124.252 135.415 124.252 C 137.139 124.252 138.797 123.584 140.039 122.389 C 141.281 121.194 142.013 119.562 142.08 117.84 L 142.08 94.76 C 142.077 92.993 141.373 91.298 140.123 90.05 C 138.873 88.802 137.177 88.1 135.41 88.1 Z"
              fill="currentColor"
            ></path>
          </svg>
          {t("profile.login")}
        </button>

        <div className={styles.divider}> {t("common.or")}</div>

        <div className={styles.socialLogin}>
          <button>
            <FcGoogle />
          </button>
          <button>
            <FaApple />
          </button>
        </div>
      </Modal>
       
    </>
  );
};

export default LoginModal;
