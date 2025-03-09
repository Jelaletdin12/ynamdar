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
  useRegisterMutation,
  useVerifyTokenMutation,
} from "../../app/api/authApi";
import { LoginIcon } from "../Icons";

const LoginModal = ({ isVisible: propIsVisible, onClose: propOnClose }) => {
  const { t, i18n } = useTranslation();
  const [internalIsVisible, setInternalIsVisible] = useState(false);

  const isControlled = propIsVisible !== undefined;
  const isVisible = isControlled ? propIsVisible : internalIsVisible;

  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("+993");
  const [email, setEmail] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [formattedPhone, setFormattedPhone] = useState("");

  // API hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
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
          return message.error(t("validation.enter_valid_phone"));
        }

        // Convert to integer
        const phoneInt = parseInt(formattedPhone, 10);
        console.log(phoneInt);

        // Call the appropriate API endpoint
        if (isLogin) {
          const response = await login({ phone_number: phoneInt }).unwrap();
          if (response) {
            message.success(t("profile.verification_code_sent"));
            setIsVerificationModalVisible(true);
          }
        } else {
          const response = await register({ phone_number: phoneInt }).unwrap();
          if (response) {
            message.success(t("profile.verification_code_sent"));
            setIsVerificationModalVisible(true);
            console.log(response);
          }
        }
      } else if (activeTab === "email") {
        // Handle email login/registration
        // Note: Your API seems to only support phone authentication currently
        message.info(t("profile.email_not_implemented"));
      }
    } catch (err) {
      console.error("Authentication error:", err);
      message.error(err.data?.message || t("errors.something_went_wrong"));
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!verificationCode || verificationCode.length < 5) {
        return message.error(t("validation.enter_valid_code"));
      }

      // Convert to integer
      const phoneInt = parseInt(formattedPhone, 10);
      const codeInt = parseInt(verificationCode, 10);

      const response = await verifyToken({
        phone_number: phoneInt,
        code: codeInt,
      }).unwrap();

      if (response && response.data) {
        message.success(t("profile.login_successful"));
        closeModal();
        resetForm();
      } else {
        // Fallback error handling
        message.error(t("errors.verification_failed"));
      }
    } catch (err) {
      console.error("Verification error:", err);

      // More detailed error logging
      console.log("Full error object:", JSON.stringify(err, null, 2));

      message.error(
        err.data?.message || err.error || t("errors.something_went_wrong")
      );
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {!isControlled && (
        <Button onClick={showModal} className={styles.navButton}>
          <LoginIcon />
          {t("profile.login")}
        </Button>
      )}

      {/* Main Login/Register Modal */}
      <Modal
        title={isLogin ? t("profile.login") : t("profile.register")}
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
          disabled={isLoginLoading || isRegisterLoading}
        >
          <LoginIcon />
          {isLoginLoading || isRegisterLoading
            ? t("common.processing")
            : isLogin
            ? t("profile.login")
            : t("profile.register")}
        </button>

        <div className={styles.toggleAuth}>
          {isLogin
            ? t("profile.dont_have_account")
            : t("profile.already_have_account")}
          <span onClick={toggleAuthMode}>
            {isLogin ? t("profile.register") : t("profile.login")}
          </span>
        </div>

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
              placeholder="0000"
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
