import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import IMask from "imask";
import styles from "./LoginModal.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  useLoginMutation,
  useVerifyTokenMutation,
} from "../../app/api/authApi";
import { LoginIcon } from "../Icons";
import { useAuth } from "../../context/authContext";

const LoginModal = ({ isVisible: propIsVisible, onClose: propOnClose }) => {
  const { t, i18n } = useTranslation();
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const { login: authLogin } = useAuth();

  const isControlled = propIsVisible !== undefined;
  const isVisible = isControlled ? propIsVisible : internalIsVisible;

  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("+993");
  const [email, setEmail] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");

  // API hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verifyToken, { isLoading: isVerifyLoading }] =
    useVerifyTokenMutation();

  const phoneInputRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    if (activeTab === "phone" && phoneInputRef.current) {
      const inputElement = phoneInputRef.current.input;

      if (inputElement) {
        const maskOptions = {
          mask: "+{993} 00 000000",
          lazy: false,
          placeholderChar: "_",
        };

        maskRef.current = IMask(inputElement, maskOptions);
        maskRef.current.value = phone;

        maskRef.current.on("accept", () => {
          setPhone(maskRef.current.value);

          // Process phone number for API (extract digits only)
          const digits = maskRef.current.value.replace(/\D/g, "").substring(3); // Remove non-digits and country code
          setFormattedPhone(digits);
        });

        return () => {
          if (maskRef.current) {
            maskRef.current.destroy();
            maskRef.current = null;
          }
        };
      }
    }
  }, [activeTab, phone]);

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
    setHasChanges(false);
    setVerificationCode("");
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
      case "verification":
        setVerificationCode(value);
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
    setIsVerificationModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      if (activeTab === "phone") {
        // Validate phone number
        if (formattedPhone.length < 8) {
          return message.error(t("profile.enter_valid_phone"));
        }

        // Convert to integer
        const phoneInt = parseInt(formattedPhone, 10);
        console.log(phoneInt);

        // Call login API endpoint
        const response = await login({ phone_number: phoneInt }).unwrap();
        if (response) {
          message.success(t("profile.verification_code_sent"));
          setIsVerificationModalVisible(true);
        }
      } else if (activeTab === "email") {
        // Handle email login
        message.info(t("profile.email_not_implemented"));
      }
    } catch (err) {
      console.error("Authentication error:", err);
      message.error(err.data?.message || t("common.something_went_wrong"));
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!verificationCode || verificationCode.length < 5) {
        return message.error(t("profile.enter_valid_code"));
      }

      // Convert to integer
      const phoneInt = parseInt(formattedPhone, 10);
      const codeInt = parseInt(verificationCode, 10);

      const response = await verifyToken({
        phone_number: phoneInt,
        code: codeInt,
      }).unwrap();

      if (response && response.data) {
        // Use the token to update authentication state
        const token = response.data;
        
        // Call the AuthContext login function to update the state
        authLogin(token);
        
        message.success(t("profile.login_successful"));
        closeModal();
        resetForm();
      } else {
        // Fallback error handling
        message.error(t("errors.verification_failed"));
      }
    } catch (err) {
      console.error("Verification error:", err);
      console.log("Full error object:", JSON.stringify(err, null, 2));
      message.error(
        err.data?.message || err.error || t("errors.something_went_wrong")
      );
    }
  };

  return (
    <>
      {!isControlled && (
        <Button onClick={showModal} className={styles.navButton}>
          <LoginIcon />
          {t("profile.login")}
        </Button>
      )}

      {/* Main Login Modal */}
      <Modal
        title={t("profile.login")}
        open={isVisible && !isVerificationModalVisible}
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
          <label>
            {activeTab === "phone"
              ? t("profile.telephone")
              : t("profile.email")}
          </label>
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

        <div className={styles.forgotPassword}>
          <p>{t("profile.forgotPass")}</p>
        </div>

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isLoginLoading}
        >
          <LoginIcon />
          {isLoginLoading ? t("common.processing") : t("profile.login")}
        </button>

        <div className={styles.divider}>{t("common.or")}</div>

        <div className={styles.socialLogin}>
          <button>
            <FcGoogle />
          </button>
          <button>
            <FaApple />
          </button>
        </div>
      </Modal>

      {/* Verification Code Modal */}
      <Modal
        title={t("profile.verification")}
        open={isVerificationModalVisible}
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={null}
        className={styles.modalWrapper}
        closeIcon={<span>×</span>}
      >
        <div className={styles.verificationContent}>
          <p>
            {t("profile.verification_code_message")}
            <strong>{phone}</strong>
          </p>

          <div className={styles.inputGroup}>
            <label>{t("profile.verification_code")}</label>
            <Input
              value={verificationCode}
              onChange={(e) =>
                handleInputChange("verification", e.target.value)
              }
              placeholder="00000"
              maxLength={6}
            />
          </div>

          <button
            className={styles.submitButton}
            onClick={handleVerifyCode}
            disabled={isVerifyLoading}
          >
            {isVerifyLoading ? t("common.verifying") : t("profile.verify")}
          </button>

          <Button type="link">
            {t("profile.didnt_receive_code")}
            <span onClick={handleSubmit}>{t("profile.resend")}</span>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;