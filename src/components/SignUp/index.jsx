import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import IMask from "imask";
import styles from "./SignUpModal.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const SignUpModal = ({isVisible: propIsVisible, onClose: propOnClose}) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  
  const isControlled = propIsVisible !== undefined;
  const isVisible = isControlled ? propIsVisible : internalIsVisible;
  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [hasChanges, setHasChanges] = useState(false);


  const phoneMaskOptions = {
    mask: "+{993} 00 000000",
    lazy: false,
  };

  const showModal = () => {
    if (!isControlled) {
      setInternalIsVisible(true);
    }
  };


  const handleCancel = () => {
    if (hasChanges) {
      Modal.confirm({
      
        title: "Siz hakykatdanam modaly yapmakçymy?",
        icon: <ExclamationCircleOutlined />,
        okText: "Hawa",
        cancelText: "Ýok",
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
    setPhone("");
    setEmail("");
    setMessage("");
    setMessageTitle("");
    setHasChanges(false);
  };

  const handleInputChange = (type, value) => {
    setHasChanges(true);
    switch (type) {
      case "phone":
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
            d="M 94.43 101.71 C 104.598 101.712 114.471 98.26 122.422 91.922 C 130.373 85.584 135.939 76.729 138.203 66.816 C 140.467 56.903 139.297 46.51 134.887 37.348 C 130.476 28.187 123.081 20.79 113.921 16.377 C 104.76 11.965 94.367 10.793 84.454 13.055 C 74.541 15.317 65.684 20.881 59.344 28.83 C 53.005 36.78 49.55 46.652 49.55 56.82 C 49.563 68.715 54.299 80.132 62.709 88.544 C 71.119 96.956 82.535 101.694 94.43 101.71 Z M 94.43 25.26 C 101.579 25.258 108.52 27.684 114.111 32.14 C 119.701 36.596 123.615 42.821 125.207 49.79 C 126.799 56.759 125.978 64.067 122.877 70.508 C 119.777 76.95 114.578 82.15 108.137 85.253 C 101.697 88.355 94.39 89.179 87.42 87.589 C 80.45 85.999 74.224 82.087 69.766 76.498 C 65.309 70.91 62.88 63.969 62.88 56.82 C 62.891 48.458 66.22 40.433 72.132 34.519 C 78.044 28.605 86.068 25.273 94.43 25.26 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_1"
            d="M 94.43 118.88 C 42.93 118.88 17.86 139.88 7.51 152.41 C 2.684 158.273 0.046 165.636 0.05 173.23 L 0.05 181.32 C 0.055 186.448 2.097 191.37 5.723 194.997 C 9.35 198.623 14.272 200.665 19.4 200.67 L 169.47 200.67 C 174.598 200.665 179.52 198.623 183.147 194.997 C 186.773 191.37 188.815 186.448 188.82 181.32 L 188.82 173.23 C 188.824 165.636 186.186 158.273 181.36 152.41 C 171 139.89 145.94 118.88 94.43 118.88 Z M 175.49 181.32 C 175.49 182.911 174.857 184.438 173.733 185.563 C 172.608 186.687 171.081 187.32 169.49 187.32 L 19.4 187.32 C 17.809 187.32 16.282 186.687 15.157 185.563 C 14.033 184.438 13.4 182.911 13.4 181.32 L 13.4 173.23 C 13.392 168.738 14.948 164.381 17.8 160.91 C 26.67 150.19 48.41 132.21 94.45 132.21 C 140.49 132.21 162.24 150.21 171.11 160.91 C 173.957 164.383 175.513 168.739 175.51 173.23 Z"
            fill="currentColor"
          ></path>
          <path
            id="path_2"
            d="M 205.88 48 L 194.16 48 L 194.16 36.27 C 194.216 34.827 193.802 33.405 192.981 32.218 C 192.16 31.03 190.975 30.141 189.605 29.684 C 188.236 29.228 186.754 29.228 185.385 29.684 C 184.015 30.141 182.83 31.03 182.009 32.218 C 181.188 33.405 180.774 34.827 180.83 36.27 L 180.83 48 L 169.11 48 C 167.388 48.067 165.756 48.799 164.561 50.041 C 163.366 51.283 162.698 52.941 162.698 54.665 C 162.698 56.389 163.366 58.047 164.561 59.289 C 165.756 60.531 167.388 61.263 169.11 61.33 L 180.83 61.33 L 180.83 73 C 180.774 74.443 181.188 75.865 182.009 77.052 C 182.83 78.24 184.015 79.129 185.385 79.586 C 186.754 80.042 188.236 80.042 189.605 79.586 C 190.975 79.129 192.16 78.24 192.981 77.052 C 193.802 75.865 194.216 74.443 194.16 73 L 194.16 61.32 L 205.88 61.32 C 207.323 61.376 208.745 60.962 209.932 60.141 C 211.12 59.32 212.009 58.135 212.466 56.765 C 212.922 55.396 212.922 53.914 212.466 52.545 C 212.009 51.175 211.12 49.99 209.932 49.169 C 208.745 48.348 207.323 47.934 205.88 47.99 Z"
            fill="currentColor"
          ></path>
        </svg>
        Agza bol
      </Button>
)}
      <Modal
        title="Agza bol"
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
            Telefon
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === "email" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("email")}
          >
            Email
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>{activeTab === "phone" ? "Telefon" : "Email"}</label>
          <Input
            value={activeTab === "phone" ? phone : email}
            onChange={(e) => handleInputChange(activeTab, e.target.value)}
            {...(activeTab === "phone"
              ? {
                  onInput: (e) => {
                    const maskOptions = IMask.createMask(phoneMaskOptions);
                    const masked = maskOptions.resolve(e.target.value);
                    setPhone(masked);
                  },
                }
              : {})}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Açar söz</label>
          <Input
            value={message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Açar söz tassykla</label>
          <Input
            value={messageTitle}
            onChange={(e) => handleInputChange("messageTitle", e.target.value)}
          />
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212">
            <path
              id="path"
              d="M 94.43 101.71 C 104.598 101.712 114.471 98.26 122.422 91.922 C 130.373 85.584 135.939 76.729 138.203 66.816 C 140.467 56.903 139.297 46.51 134.887 37.348 C 130.476 28.187 123.081 20.79 113.921 16.377 C 104.76 11.965 94.367 10.793 84.454 13.055 C 74.541 15.317 65.684 20.881 59.344 28.83 C 53.005 36.78 49.55 46.652 49.55 56.82 C 49.563 68.715 54.299 80.132 62.709 88.544 C 71.119 96.956 82.535 101.694 94.43 101.71 Z M 94.43 25.26 C 101.579 25.258 108.52 27.684 114.111 32.14 C 119.701 36.596 123.615 42.821 125.207 49.79 C 126.799 56.759 125.978 64.067 122.877 70.508 C 119.777 76.95 114.578 82.15 108.137 85.253 C 101.697 88.355 94.39 89.179 87.42 87.589 C 80.45 85.999 74.224 82.087 69.766 76.498 C 65.309 70.91 62.88 63.969 62.88 56.82 C 62.891 48.458 66.22 40.433 72.132 34.519 C 78.044 28.605 86.068 25.273 94.43 25.26 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_1"
              d="M 94.43 118.88 C 42.93 118.88 17.86 139.88 7.51 152.41 C 2.684 158.273 0.046 165.636 0.05 173.23 L 0.05 181.32 C 0.055 186.448 2.097 191.37 5.723 194.997 C 9.35 198.623 14.272 200.665 19.4 200.67 L 169.47 200.67 C 174.598 200.665 179.52 198.623 183.147 194.997 C 186.773 191.37 188.815 186.448 188.82 181.32 L 188.82 173.23 C 188.824 165.636 186.186 158.273 181.36 152.41 C 171 139.89 145.94 118.88 94.43 118.88 Z M 175.49 181.32 C 175.49 182.911 174.857 184.438 173.733 185.563 C 172.608 186.687 171.081 187.32 169.49 187.32 L 19.4 187.32 C 17.809 187.32 16.282 186.687 15.157 185.563 C 14.033 184.438 13.4 182.911 13.4 181.32 L 13.4 173.23 C 13.392 168.738 14.948 164.381 17.8 160.91 C 26.67 150.19 48.41 132.21 94.45 132.21 C 140.49 132.21 162.24 150.21 171.11 160.91 C 173.957 164.383 175.513 168.739 175.51 173.23 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_2"
              d="M 205.88 48 L 194.16 48 L 194.16 36.27 C 194.216 34.827 193.802 33.405 192.981 32.218 C 192.16 31.03 190.975 30.141 189.605 29.684 C 188.236 29.228 186.754 29.228 185.385 29.684 C 184.015 30.141 182.83 31.03 182.009 32.218 C 181.188 33.405 180.774 34.827 180.83 36.27 L 180.83 48 L 169.11 48 C 167.388 48.067 165.756 48.799 164.561 50.041 C 163.366 51.283 162.698 52.941 162.698 54.665 C 162.698 56.389 163.366 58.047 164.561 59.289 C 165.756 60.531 167.388 61.263 169.11 61.33 L 180.83 61.33 L 180.83 73 C 180.774 74.443 181.188 75.865 182.009 77.052 C 182.83 78.24 184.015 79.129 185.385 79.586 C 186.754 80.042 188.236 80.042 189.605 79.586 C 190.975 79.129 192.16 78.24 192.981 77.052 C 193.802 75.865 194.216 74.443 194.16 73 L 194.16 61.32 L 205.88 61.32 C 207.323 61.376 208.745 60.962 209.932 60.141 C 211.12 59.32 212.009 58.135 212.466 56.765 C 212.922 55.396 212.922 53.914 212.466 52.545 C 212.009 51.175 211.12 49.99 209.932 49.169 C 208.745 48.348 207.323 47.934 205.88 47.99 Z"
              fill="currentColor"
            ></path>
          </svg>
          Agza bol
        </button>

        <div className={styles.divider}>ýa-da</div>

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

export default SignUpModal;
