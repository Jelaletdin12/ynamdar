import React, { useState } from 'react';
import styles from './contactUs.module.scss';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label htmlFor="fullName">Doly adyňyz</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
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
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          <span>ugrat</span>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;