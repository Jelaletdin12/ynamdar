import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.scss";
import { TiTick } from "react-icons/ti";
import { Select } from "antd";
import { X } from "lucide-react";
const { Option } = Select;
import AddressSelect from "../AddressSelect(CheckOut)/index";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent)) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  return deviceType;
};

const Checkout = ({ cartItems, onBackToCart }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryAddress: "",
    region: "",
  });

  const [deliveryOptionsVisible, setDeliveryOptionsVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("shugun");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("standard");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([
    "10:00-12:00",
    "13:00-15:00",
  ]);

  const deviceType = useDeviceType();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSelect = (value) => {
    setSelectedAddress(value);
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
    setDeliveryOptionsVisible(true);
  };

  const handleClearAddress = () => {
    setSelectedAddress(null);
    setFormData((prev) => ({
      ...prev,
      address: "",
    }));
    setDeliveryOptionsVisible(false);
  };

  const handleDeliveryTimeChange = (selectedTime) => {
    setDeliveryTime(selectedTime);
    setSelectedTimeSlot(null);
    setAvailableTimeSlots(
      getTimeSlotsByDeliveryType(selectedDeliveryType, selectedTime)
    );
  };
  const getTimeSlotsByDeliveryType = (type, day = "shugun") => {
    switch (type) {
      case "standard":
        return day === "shugun"
          ? ["10:00-12:00", "13:00-15:00"]
          : ["10:00-12:00", "13:00-15:00", "16:00-18:00"];
      case "express":
        return ["14:00-15:00"];
      case "pickup":
        return ["10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00"];
      default:
        return [];
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleDeliveryTypeChange = (type) => {
    setSelectedDeliveryType(type);
    setSelectedTimeSlot(null);
    setDeliveryTime("shugun");
    setAvailableTimeSlots(getTimeSlotsByDeliveryType(type));
  };
  const handleFocus = (event) => {
    event.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const renderDeliveryTimeSection = () => {
    if (selectedDeliveryType === "express") {
      return (
        <div
          className={styles.timeOptionRowBtn}
          style={{ borderTop: "1px solid #d1d5db", paddingTop: "12px" }}
        >
          {availableTimeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSlotSelect(slot)}
              className={`${styles.hourOption} ${
                selectedTimeSlot === slot ? styles.selected : ""
              }`}
            >
              <span></span>
              <label>{slot}</label>
            </button>
          ))}
        </div>
      );
    }

    if (selectedDeliveryType === "pickup") {
      return (
        <>
          <div className={styles.timeOptionRowDay}>
            <button
              type="button"
              onClick={() => handleDeliveryTimeChange("shugun")}
              className={`${styles.timeOption} ${
                deliveryTime === "shugun" ? styles.selected : ""
              }`}
            >
              <label>Şu gün</label>
              <span>27.01.2025</span>
            </button>
          </div>
          <div className={styles.timeOptionRowBtn}>
            {availableTimeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotSelect(slot)}
                className={`${styles.hourOption} ${
                  selectedTimeSlot === slot ? styles.selected : ""
                }`}
              >
                <span></span>
                <label>{slot}</label>
              </button>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div className={styles.timeOptionRowDay}>
          <button
            type="button"
            onClick={() => handleDeliveryTimeChange("shugun")}
            className={`${styles.timeOption} ${
              deliveryTime === "shugun" ? styles.selected : ""
            }`}
          >
            <label>Şu gün</label>
            <span>27.01.2025</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeliveryTimeChange("ertir")}
            className={`${styles.timeOption} ${
              deliveryTime === "ertir" ? styles.selected : ""
            }`}
          >
            <label>Ertir</label>
            <span>28.01.2025</span>
          </button>
        </div>
        <div className={styles.timeOptionRowBtn}>
          {availableTimeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSlotSelect(slot)}
              className={`${styles.hourOption} ${
                selectedTimeSlot === slot ? styles.selected : ""
              }`}
            >
              <span></span>
              <label>{slot}</label>
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Sebedim (2)</h2>
      <div className={styles.formSection}>
        <div className={styles.paymentOptions}>
          <h3>Töleg şekili:</h3>
          <div className={styles.option}>
            <input type="radio" id="nagt" name="paymentType" defaultChecked />
            <label htmlFor="nagt" className={styles.customRadio}></label>
            <div className={styles.text}>
              <span className={styles.optionTitle}>Nagt</span>
              <span className={styles.optionDesc}>
                Sargyt galan wagtynyz nagt hasaplaşmak
              </span>
            </div>
          </div>

          <div className={styles.option}>
            <input type="radio" id="terminal" name="paymentType" />
            <label htmlFor="terminal" className={styles.customRadio}></label>
            <div className={styles.text}>
              <span className={styles.optionTitle}>Töleg Terminaly</span>
              <span className={styles.optionDesc}>
                Töleg terminalyndan kart arkaly hasaplaşmak
              </span>
            </div>
          </div>

          <div className={styles.balance}>
            <input
              type="checkbox"
              id="customCheckbox"
              className={styles.checkbox}
            />
            <label htmlFor="customCheckbox" className={styles.customCheckbox}>
              <TiTick className={styles.checkIcon} />
            </label>
            <div className={styles.text}>
              <span style={{ color: "#6b7280" }}>
                Keşbek balansynyz:{" "}
                <span className={styles.amount}>0.00 m.</span>
              </span>
              <span className={styles.description}>
                Ygtyýarlygy pul serişdeleri ulanınak
              </span>
            </div>
          </div>
        </div>

        <div className={styles.deliveryForm}>
          <h3>Salgynyz:</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Doly adynyz*</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                onFocus={handleFocus}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Telefon*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+993 61097651"
                required
                onFocus={handleFocus}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Salgynyz*</label>
              <AddressSelect
                selectedAddress={selectedAddress}
                handleAddressSelect={handleAddressSelect}
                handleClearAddress={handleClearAddress}
                deviceType={deviceType}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Salgynyz barada giňişleýin*</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                onFocus={handleFocus}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Belik</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                onFocus={handleFocus}
              />
            </div>
          </div>

          {deliveryOptionsVisible && (
            <div className={styles.deliveryOptions}>
              <h4>Eltip bermek görnüşi:</h4>
              <div className={styles.deliveryOptionRow}>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="standard"
                    name="deliveryType"
                    checked={selectedDeliveryType === "standard"}
                    onChange={() => handleDeliveryTypeChange("standard")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="standard">
                    <div className={styles.optionTitle}>
                      Standart eltip bermek
                    </div>
                    <div className={styles.optionCost}>00 manat</div>
                  </label>
                </div>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="express"
                    name="deliveryType"
                    checked={selectedDeliveryType === "express"}
                    onChange={() => handleDeliveryTypeChange("express")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="express">
                    <div className={styles.optionTitle}>
                      Express eltip bermek
                    </div>
                    <div className={styles.optionCost}>20 manat</div>
                  </label>
                </div>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="pickup"
                    name="deliveryType"
                    checked={selectedDeliveryType === "pickup"}
                    onChange={() => handleDeliveryTypeChange("pickup")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="pickup">
                    <div className={styles.optionTitle}>Ozum baryp aljak</div>
                    <div className={styles.optionCost}>Garassyzlyk Shayoly</div>
                  </label>
                </div>
              </div>

              <div className={styles.deliveryTimeOptions}>
                <h4>
                  {selectedDeliveryType === "pickup"
                    ? "Alyp gitjek wagtyňyzy saýlaň"
                    : "Eltip bermek wagty:"}
                </h4>
                {renderDeliveryTimeSection()}
              </div>
            </div>
          )}
        </div>

        <div className={styles.deliveryInfo}>
          <ul>
            <li>
              Eltip bermek hyzmaty Aşgabat şäheriniň çägi bilen bir hatarda
              Büzmeýine we Änew şäherine hem elýeterlidir;
            </li>
            <li>
              Sargydyň iň pes çägi <strong>50 manat</strong> bolmaly; sargydyňyz
              <strong>150 manatdan</strong> geçse eltip bermek hyzmaty mugt;
            </li>
            <li>
              Saýtdan sargyt edeniňizden soňra operator size jaň edip sargydy
              tassyklar (eger hemişelik müşderi bolsaňyz sargytlaryňyz
              islegiňize göra awtomatik usulda hem tassyklanýar);
            </li>
            <li>
              Sargydy barlap alanyňyzdan soňra töleg amala aşyrylyar. Eltip
              berijiniň size gowşurýan töleg resminamasynda siziň tölemeli
              puluňyz bellenenddir. Töleg nagt we nagt däl görnüşde milli
              manatda amala aşyrylyar. Kabul edip tölegini geçiren harydyňyz
              yzyna alynmayar.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
