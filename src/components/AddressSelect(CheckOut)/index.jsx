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
  locations, 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
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
              {Array.isArray(locations) && locations.length > 0 ? (
                locations.map((location) => (
                  <li
                    key={location.id}
                    onClick={() => {
                      handleAddressSelect(location.name);
                      setIsModalVisible(false);
                    }}
                    className={styles.optionItem}
                  >
                    {location.name}
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
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
          showArrow={!selectedAddress}
          loading={!locations}
          dropdownRender={(menu) => (
            <div
              style={{
                maxHeight: "150px",
                fontSize: "16px",
              }}
            >
              {menu}
            </div>
          )}
        >
          {Array.isArray(locations) && locations.length > 0 ? (
            locations.map((location) => (
              <Option key={location.id} value={location.name}>
                {location.name}
              </Option>
            ))
          ) : (
            <Option disabled></Option>
          )}
        </Select>
      )}
    </div>
  );
};

export default AddressSelect;