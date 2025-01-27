// AddressSelect.js
import React, { useState } from "react";
import { Select, Modal, Button } from "antd";
import { X } from "lucide-react";
import styles from "./AddressSelect.module.scss";

const { Option } = Select;

const AddressSelect = ({
  selectedAddress,
  handleAddressSelect,
  handleClearAddress,
  deviceType,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClear = (e) => {
    e.stopPropagation(); // Bu, modalın açılmasını engeller
    handleClearAddress();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.addressSelectContainer}>
      {deviceType === "mobile" ? (
        <>
          <Button type="primary" onClick={showModal}>
            {selectedAddress ? (
              <div className={styles.selectedAddress}>
                {selectedAddress}
                <X className={styles.customClearIcon} onClick={handleClear} />
              </div>
            ) : (
              "Sargyt Salgynyz Saýlaň"
            )}
          </Button>
          <Modal
            title="Salgynyz Saýlaň"
            open={isModalVisible}
            onCancel={handleCancel}
            closeIcon={<X />}
            footer={null}
          >
            <ul className={styles.optionList}>
              {["Aşgabat", "Büzmeýin", "Änew"].map((address) => (
                <li
                  key={address}
                  onClick={() => {
                    handleAddressSelect(address);
                    setIsModalVisible(false);
                  }}
                  className={styles.optionItem}
                >
                  {address}
                </li>
              ))}
            </ul>
          </Modal>
        </>
      ) : (
        <Select
          showSearch
          placeholder="Salgynyz saýlaň"
          onChange={handleAddressSelect}
          value={selectedAddress}
          style={{ width: "100%" }}
          allowClear={{
            clearIcon: <X className={styles.customClearIcon} />,
          }}
          onClear={handleClearAddress}
          className={styles.addressSelect}
          //   suffixIcon={!selectedAddress}
          showArrow={!selectedAddress}
          dropdownRender={(menu) => (
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                fontSize: "16px",
              }}
            >
              {menu}
            </div>
          )}
        >
          <Option value="Aşgabat">Aşgabat</Option>
          <Option value="Büzmeýin">Büzmeýin</Option>
        </Select>
      )}
    </div>
  );
};

export default AddressSelect;
