import React, { useState } from "react";
import styles from "./contactUs.module.scss";
import { useSubmitContactMessageMutation } from "../../app/api/contactUs";

const ContactForm = () => {
  const [submitContactMessage, { isLoading, isSuccess, error }] =
    useSubmitContactMessageMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiData = {
        phone: formData.phone,
        title: formData.fullName,
        content: formData.message,
        type: "mobile_app",
      };

      await submitContactMessage(apiData).unwrap();

      if (isSuccess) {
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      }
    } catch (err) {
      console.error("Failed to submit form:", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.contactInfo}>
        <div>
          <h3>Telefon: </h3>
          <a href="tel:+99360122213">
            <span>+993 60 12-22-13</span>
          </a>
        </div>
        <div>
          <h3>Imo: </h3>
          <a href="https://imo.im" target="_blank" rel="noopener noreferrer">
            <span>+993 65 95-00-91</span> 
          </a>
        </div>
        <div>
          <h3>E-mail: </h3>
          <a href="mailto:mm.marketplace.tm@gmail.com">
            <span>mm.marketplace.tm@gmail.com</span>
          </a>
        </div>
        <div>
          <h3>Instagram: </h3>
          <a
            href="https://www.instagram.com/mm.com.tm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>mm.com.tm</span>
          </a>
        </div>
      </div>

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label htmlFor="fullName">Doly adyňyz</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="phone">Telefon</label>
          <div className={styles.phoneInputWrapper}>
            <span className={styles.phonePrefix}>+993</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.phoneInput}
              required
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="email">Email (hökmany däl)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="message">Hatyňyz</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          <span>{isLoading ? "Ugradylýar..." : "Ugrat"}</span>
        </button>

        {isSuccess && (
          <div className={styles.successMessage}>
            Hatyňyz üstünlikli ugradyldy!
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
