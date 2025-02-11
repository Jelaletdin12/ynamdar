import React, { useState } from "react";
import { Select, Modal, Button } from "antd";
import { useGetLocationsQuery } from "../../app/api/locationApi";
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

  // Fetch locations data from the API
  const { data: locations, isLoading } = useGetLocationsQuery();
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
              {isLoading ? (
                <li>Loading...</li>
              ) : (
                Array.isArray(locations?.data) &&
                locations.data.map((location) => (
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
          {isLoading ? (
            <Option disabled>Loading...</Option>
          ) : (
            Array.isArray(locations?.data) &&
            locations.data.map((location) => (
              <Option key={location.id} value={location.name}>
                {location.name}
              </Option>
            ))
          )}
        </Select>
      )}
    </div>
  );
};

export default AddressSelect;