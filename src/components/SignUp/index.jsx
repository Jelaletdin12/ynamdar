import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import IMask from "imask";
import styles from "./SignUpModal.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  useRegisterMutation,
  useVerifyTokenMutation,
} from "../../app/api/authApi";
import { RegisterIcon } from "../Icons";

const SignUpModal = ({ isVisible: propIsVisible, onClose: propOnClose }) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isControlled = propIsVisible !== undefined;
  const isVisible = isControlled ? propIsVisible : internalIsVisible;
  const [activeTab, setActiveTab] = useState("phone");

  const [phone, setPhone] = useState("+993");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const phoneInputRef = useRef(null);
  const maskRef = useRef(null);

  // Verification code related states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // API mutations
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyToken, { isLoading: isVerifying }] = useVerifyTokenMutation();

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
    setPhone("+993");
    setEmail("");
    setAddress("");
    setName("");
    setHasChanges(false);
    setShowVerification(false);
    setVerificationCode("");
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
      case "name":
        setName(value);
        break;
      case "address":
        setAddress(value);
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

  // Function to clean the phone number - remove country code and spaces
  const getCleanPhoneNumber = () => {
    // Remove the country code (+993) and any spaces/non-digit characters
    return phone.replace(/^\+993\s?/, "").replace(/\s+/g, "");
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        name: name,
        address: address,
      };
      console.log(userData);

      if (activeTab === "phone") {
        // Get phone number without the country code
        const cleanPhone = getCleanPhoneNumber();
        userData.phone_number = parseInt(cleanPhone, 10);
      } else {
        userData.email = email;
      }

      // Call register API
      const response = await register(userData).unwrap();

      // If successful, show verification modal
      if (response) {
        message.success(t("profile.verification_code_sent"));
        setShowVerification(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error(error?.data?.message || t("common.something_went_wrong"));
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Get phone number without the country code
      const cleanPhone = getCleanPhoneNumber();

      // Ensure verificationCode is sent as an integer
      const verificationCodeInt = parseInt(verificationCode, 10);

      // Call verify API
      const response = await verifyToken({
        phone_number:
          activeTab === "phone" ? parseInt(cleanPhone, 10) : undefined,
        email: activeTab === "email" ? email : undefined,
        code: verificationCodeInt, // Use the integer version of the code
      }).unwrap();

      if (response?.token) {
        message.success(t("profile.registration_successful"));
        closeModal();
        resetForm();
      }
    } catch (error) {
      console.error("Verification error:", error);
      message.error(
        error?.data?.message || t("common.invalid_verification_code")
      );
    }
  };

  const handleFocus = (event) => {
    event.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Render verification modal
  const renderVerificationModal = () => {
    return (
      <Modal
        title={t("profile.verification_code")}
        open={showVerification}
        onCancel={() => setShowVerification(false)}
        footer={null}
        className={styles.modalWrapper}
        closeIcon={<span>×</span>}
      >
        <div className={styles.verificationWrapper}>
          <p>
            {activeTab === "phone"
              ? t("profile.verification_code_sent_to_phone", { phone })
              : t("profile.verification_code_sent_to_email", { email })}
          </p>

          <div className={styles.inputGroup}>
            <label>{t("profile.verification_code")}</label>
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>

          <button
            className={styles.submitButton}
            onClick={handleVerifyCode}
            disabled={isVerifying || verificationCode.length < 5}
          >
            {isVerifying ? t("common.verifying") : t("common.verify")}
          </button>

          <div className={styles.resendCode}>
            <Button type="link" onClick={handleSubmit}>
              {t("profile.resend_code")}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {!isControlled && (
        <Button onClick={showModal} className={styles.navButton}>
          <RegisterIcon />
          {t("profile.registration")}
        </Button>
      )}

      <Modal
        title={t("profile.registration")}
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

        <div className={styles.inputGroup}>
          <label>{t("profile.name")}</label>
          <Input
            onFocus={handleFocus}
            value={name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>{t("profile.address")}</label>
          <Input
            onFocus={handleFocus}
            value={address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={
            isRegistering ||
            (activeTab === "phone" ? !phone || phone.length < 12 : !email) ||
            !name
          }
        >
          <RegisterIcon />
          {isRegistering ? t("common.processing") : t("profile.registration")}
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
      {renderVerificationModal()}
    </>
  );
};

export default SignUpModal;
