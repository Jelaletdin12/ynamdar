import React from 'react';
import { Form, Input, Select, Upload, Button, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './SignupForm.module.scss';

const { Option } = Select;

const SignupForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  const validatePhone = (_, value) => {
    if (!value || /^\+993\d{8}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid phone number');
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Satyjy boluň!</h1>
      <p className={styles.subtitle}>
        Satyjy bolmak üçin aşakdaky maglumatlary doldurmagyňyzy haýyş edýäris. 
        Soň işgärlerimiz Siziň bilen habarlaşarlar.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
      >
        <div className={styles.formRow}>
          <Form.Item
            label="Ady *"
            name="firstName"
            rules={[{ required: true, message: 'Adyňyzy giriziň' }]}
            className={styles.formItem}
          >
            <Input placeholder="Adyňyzy giriziň" />
          </Form.Item>

          <Form.Item
            label="Familiýasy *"
            name="lastName"
            rules={[{ required: true, message: 'Familiýasy gerekli' }]}
            className={styles.formItem}
          >
            <Input placeholder="Familiýasy" />
          </Form.Item>
        </div>

        <div className={styles.formRow}>
          <Form.Item
            label="Email salgy *"
            name="email"
            rules={[
              { required: true, message: 'Email salgy gerekli' },
              { type: 'email', message: 'Email salgy dogry däl' }
            ]}
            className={styles.formItem}
          >
            <Input placeholder="Email salgy" />
          </Form.Item>

          <Form.Item
            label="Açar sözi *"
            name="password"
            rules={[{ required: true, message: 'Açar sözi gerekli' }]}
            className={styles.formItem}
          >
            <Input.Password placeholder="Açar sözi" />
          </Form.Item>
        </div>

        <div className={styles.formRow}>
          <Form.Item
            label="Telefon belgiňizi giriziň *"
            name="phone"
            rules={[
              { required: true, message: 'Telefon belgi gerekli' },
              { validator: validatePhone }
            ]}
            className={styles.formItem}
          >
            <Input addonBefore="+993" placeholder="Telefon belgi" />
          </Form.Item>

          <Form.Item
            label="Welaýat *"
            name="region"
            rules={[{ required: true, message: 'Welaýat saýlaň' }]}
            className={styles.formItem}
          >
            <Select placeholder="Aşgabat">
              <Option value="ashgabat">Aşgabat</Option>
              <Option value="ahal">Ahal</Option>
              <Option value="mary">Mary</Option>
              <Option value="lebap">Lebap</Option>
              <Option value="dashoguz">Daşoguz</Option>
              <Option value="balkan">Balkan</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Patent *"
          name="patent"
          rules={[{ required: true, message: 'Patent faýly gerekli' }]}
        >
          <Upload>
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[{ required: true, message: 'Şertnamany kabul ediň' }]}
        >
          <Checkbox>SATYJY ŞERTNAMASY</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
            Tassykla
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupForm;