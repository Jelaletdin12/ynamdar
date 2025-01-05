import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import IMask from 'imask';
import styles from "./SignUpModal.module.scss";

const SignUpModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Phone number mask configuration
  const phoneMaskOptions = {
    mask: '+{993} 000 000000',
    lazy: false
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Modal.confirm({
        title: 'Siz hakykatdanam modaly yapmakçymy?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Hawa',
        cancelText: 'Ýok',
        onOk() {
          setIsModalVisible(false);
          resetForm();
        },
      });
    } else {
      setIsModalVisible(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setPhone('');
    setEmail('');
    setMessage('');
    setMessageTitle('');
    setHasChanges(false);
  };

  const handleInputChange = (type, value) => {
    setHasChanges(true);
    switch (type) {
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'message':
        setMessage(value);
        break;
      case 'messageTitle':
        setMessageTitle(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log({
      type: activeTab,
      phone,
      email,
      message,
      messageTitle
    });
  };

  return (
    <>
      <Button onClick={showModal} className={styles.navButton}>
        Agza bol
      </Button>
      
      <Modal
        title="Agza bol"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className={styles.modalWrapper}
        closeIcon={<span>×</span>}
      >
        <div className={styles.tabWrapper}>
          <div 
            className={`${styles.tab} ${activeTab === 'phone' ? styles.active : ''}`}
            onClick={() => setActiveTab('phone')}
          >
            Telefon
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>{activeTab === 'phone' ? 'Telefon' : 'Email'}</label>
          <Input
            value={activeTab === 'phone' ? phone : email}
            onChange={(e) => handleInputChange(activeTab, e.target.value)}
            {...(activeTab === 'phone' ? {
              onInput: (e) => {
                const maskOptions = IMask.createMask(phoneMaskOptions);
                const masked = maskOptions.resolve(e.target.value);
                setPhone(masked);
              }
            } : {})}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Açar söz</label>
          <Input
            value={message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Açar söz tassykla</label>
          <Input
            value={messageTitle}
            onChange={(e) => handleInputChange('messageTitle', e.target.value)}
          />
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Agza bol
        </button>

        <div className={styles.divider}>ýa-da</div>

        <div className={styles.socialLogin}>
          <button>
            <img src="google-icon.png" alt="Google" />
          </button>
          <button>
            <img src="apple-icon.png" alt="Apple" />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SignUpModal;