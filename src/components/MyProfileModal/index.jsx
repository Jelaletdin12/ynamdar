"use client"

import { useEffect } from "react"
import { Modal, Form, Input, Button, message } from "antd"
import { UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons"
import styles from "./ProfileModal.module.scss"
import { useGetProfileQuery, useUpdateProfileMutation } from "../../app/api/myProfileApi"

const ProfileModal = ({ visible, onClose }) => {
  const [form] = Form.useForm()
  const { data: profileData, isLoading, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

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
    <Modal title="My Profile" open={visible} onCancel={onClose} footer={null} className={styles.profileModal}>
      {isLoading ? (
        <div className={styles.loading}>Loading profile data...</div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item
            name="name"
            label="First Name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
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
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default ProfileModal
