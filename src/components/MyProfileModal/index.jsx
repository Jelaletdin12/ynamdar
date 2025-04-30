"use client"

import { useEffect } from "react"
import { Modal, Form, Input, Button, message } from "antd"
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons"
import styles from "./ProfileModal.module.scss"
import { useGetProfileQuery, useUpdateProfileMutation } from "../../app/api/myProfileApi"
import { useTranslation } from "react-i18next";
const ProfileModal = ({ visible, onClose }) => {
  const [form] = Form.useForm()
  const { data: profileData, isLoading, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
 const { t, i18n } = useTranslation();
  useEffect(() => {
    if (profileData?.data) {
      // Map the API response fields to form fields
      form.setFieldsValue({
        name: profileData.data.first_name,
        last_name: profileData.data.last_name,
        phone_number: profileData.data.phone_number,
        address: profileData.data.address || "",
      })
    }
  }, [profileData, form])

  const handleSubmit = async (values) => {
    try {
      // Send the form values directly to the API
      await updateProfile(values).unwrap()
      message.success("Profile updated successfully")
      refetch()
      onClose()
    } catch (error) {
      message.error("Failed to update profile")
      console.error("Update profile error:", error)
    }
  }

  return (
    <Modal title={t("profile.profile")} open={visible} onCancel={onClose} footer={null} className={styles.profileModal}>
      {isLoading ? (
        <div className={styles.loading}>Loading profile data...</div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item
            name="name"
            label={t("profile.name")}
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label={t("profile.lastname")}
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label={t("profile.telephone")}
            rules={[
              { required: true, message: "Please enter your phone number" },
              { pattern: /^\d+$/, message: "Phone number must contain only digits" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input prefix={<HomeOutlined />} placeholder="Address" />
          </Form.Item>

          <Form.Item className={styles.buttons}>
            <Button type="default" onClick={onClose}>
            {t("common.cancel")}
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
            {t("common.save")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default ProfileModal
