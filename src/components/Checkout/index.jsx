import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.scss";
import { TiTick } from "react-icons/ti";
import { Select } from "antd";
import { X } from "lucide-react";
const { Option } = Select;
import AddressSelect from "../AddressSelect(CheckOut)/index";
import { useTranslation } from "react-i18next";
import {
  usePlaceOrderMutation,
  useGetOrderTimesQuery,
  useGetOrderPaymentsQuery,
} from "../../app/api/orderApi";
import { useGetLocationsQuery } from "../../app/api/locationApi";

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
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    deliveryAddress: "null",
    payment_type_id: "",
    delivery_time: "",
    delivery_at: "",
    region: "",
  });

  const [deliveryOptionsVisible, setDeliveryOptionsVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("standard");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const { data: orderTimes = {} } = useGetOrderTimesQuery();
  const { data: orderPayments = [] } = useGetOrderPaymentsQuery();
  const { data: locationsData } = useGetLocationsQuery();
  const deviceType = useDeviceType();

  useEffect(() => {
    if (orderTimes.dates && orderTimes.hours) {
      setAvailableTimeSlots(
        getTimeSlotsByDeliveryType(selectedDeliveryType, deliveryTime)
      );
    }
  }, [orderTimes, selectedDeliveryType, deliveryTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSelect = (value) => {
    setSelectedAddress(value);
    const selectedLocation = locationsData?.data?.find(
      (location) => location.name === value
    );

    setFormData((prev) => ({
      ...prev,
      address: value,
      region: selectedLocation ? selectedLocation.region : "",
    }));
    setDeliveryOptionsVisible(true);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/^\+993/, "");
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

  const getTimeSlotsByDeliveryType = (type, day = "today") => {
    switch (type) {
      case "standard":
        return orderTimes.hours[day] || [];
      case "express":
        return [
          {
            date:
              day === "today"
                ? orderTimes.dates.today
                : orderTimes.dates.tomorrow,
            hour: "14:00-15:00",
          },
        ];
      case "pickup":
        return [
          {
            date:
              day === "today"
                ? orderTimes.dates.today
                : orderTimes.dates.tomorrow,
            hour: "10:00-11:00",
          },
          {
            date:
              day === "today"
                ? orderTimes.dates.today
                : orderTimes.dates.tomorrow,
            hour: "11:00-12:00",
          },
          {
            date:
              day === "today"
                ? orderTimes.dates.today
                : orderTimes.dates.tomorrow,
            hour: "12:00-13:00",
          },
          {
            date:
              day === "today"
                ? orderTimes.dates.today
                : orderTimes.dates.tomorrow,
            hour: "13:00-14:00",
          },
        ];
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
    setDeliveryTime("today");
    setAvailableTimeSlots(getTimeSlotsByDeliveryType(type));
  };

  const handleFocus = (event) => {
    event.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handlePlaceOrder = async () => {
    // Validation checks
    if (!selectedTimeSlot) {
      console.error("No time slot selected");
      alert("Please select a delivery time slot");
      return;
    }

    if (
      !formData.customer_name ||
      !formData.customer_phone ||
      !formData.customer_address ||
      !formData.payment_type_id
    ) {
      console.error("Missing required fields");
      alert("Please fill in all required fields");
      return;
    }

    // Prepare data in the format expected by the API
    const orderDetails = {
      customer_name: formData.customer_name,
      customer_phone: formatPhoneNumber(formData.customer_phone),
      customer_address: formData.customer_address,
      shipping_method:
        selectedDeliveryType === "standard" ? "standart" : selectedDeliveryType, // Fix spelling if needed
      payment_type_id: formData.payment_type_id,
      delivery_time: selectedTimeSlot.hour,
      delivery_at: selectedTimeSlot.date,
      region: formData.region || "",
    };

    console.log("Sending order details:", orderDetails);

    try {
      // Use a workaround for HTML responses by catching the error at a lower level
      const response = await placeOrder(orderDetails);

      // Check if we got a successful response
      if (response.data && !response.error) {
        console.log("Order placed successfully:", response.data);
        alert("Order placed successfully!");
        // You might want to redirect the user or clear the cart here
      } else {
        throw new Error(response.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Failed to place order:", error);

      // Check if the error contains HTML
      if (
        error.data &&
        typeof error.data === "string" &&
        error.data.includes("<!doctype html>")
      ) {
        console.error("Server returned HTML instead of a proper API response");
        alert(
          "There was a problem with the server. Please try again later or contact support."
        );
      } else {
        alert(
          "Failed to place order. Please check your information and try again."
        );
      }
    }
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
              <label>{slot.hour}</label>
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
              onClick={() => handleDeliveryTimeChange("today")}
              className={`${styles.timeOption} ${
                deliveryTime === "today" ? styles.selected : ""
              }`}
            >
              <label>{t("checkout.today")}</label>
              <span>{orderTimes.dates?.today}</span>
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
                <label>{slot.hour}</label>
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
            onClick={() => handleDeliveryTimeChange("today")}
            className={`${styles.timeOption} ${
              deliveryTime === "today" ? styles.selected : ""
            }`}
          >
            <label>{t("checkout.today")}</label>
            <span>{orderTimes.dates?.today}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeliveryTimeChange("tomorrow")}
            className={`${styles.timeOption} ${
              deliveryTime === "tomorrow" ? styles.selected : ""
            }`}
          >
            <label>{t("checkout.tomorrow")}</label>
            <span>{orderTimes.dates?.tomorrow}</span>
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
              <label>{slot.hour}</label>
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>{t("cart.basket")} (2)</h2>
      <div className={styles.formSection}>
        <div className={styles.paymentOptions}>
          <h3>{t("checkout.paymentMethod")}:</h3>
          {orderPayments.map((payment) => (
            <div className={styles.option} key={payment.id}>
              <input
                type="radio"
                id={`payment${payment.id}`}
                name="payment_type_id"
                value={payment.id}
                checked={formData.payment_type_id === String(payment.id)}
                onChange={handleInputChange}
              />
              <label
                htmlFor={`payment${payment.id}`}
                className={styles.customRadio}
              ></label>
              <div className={styles.text}>
                <span className={styles.optionTitle}>{payment.name}</span>
                <span className={styles.optionDesc}>
                  {payment.name === "Nagt"
                    ? t("checkout.payment_in_cash_upon_delivery_of_the_order")
                    : t("checkout.payment_by_card")}
                </span>
              </div>
            </div>
          ))}

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
                {t("checkout.cashback")}:{" "}
                <span className={styles.amount}>0.00 m.</span>
              </span>
              <span className={styles.description}>
                Ygtyýarlygy pul serişdeleri ulanınak
              </span>
            </div>
          </div>
        </div>

        <div className={styles.deliveryForm}>
          <h3>{t("checkout.adress")}:</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("checkout.fullName")}*</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
                onFocus={handleFocus}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("checkout.telephone")}*</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleInputChange}
                placeholder="+993 61097651"
                required
                onFocus={handleFocus}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("checkout.address")}*</label>
              <AddressSelect
                selectedAddress={selectedAddress}
                handleAddressSelect={handleAddressSelect}
                handleClearAddress={handleClearAddress}
                deviceType={deviceType}
                locations={locationsData?.data || []}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("checkout.moreAboutYourAddress")}*</label>
              <input
                type="text"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleInputChange}
                required
                onFocus={handleFocus}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("checkout.note")}</label>
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
              <h4>{t("checkout.deliveryType")}:</h4>
              <div className={styles.deliveryOptionRow}>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="standard"
                    name="shipping_method"
                    value="standard"
                    checked={selectedDeliveryType === "standard"}
                    onChange={() => handleDeliveryTypeChange("standard")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="standard">
                    <div className={styles.optionTitle}>
                      {t("checkout.standardShipping")}
                    </div>
                    <div className={styles.optionCost}>00 manat</div>
                  </label>
                </div>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="express"
                    name="shipping_method"
                    value="express"
                    checked={selectedDeliveryType === "express"}
                    onChange={() => handleDeliveryTypeChange("express")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="express">
                    <div className={styles.optionTitle}>
                      {t("checkout.expressDelivery")}
                    </div>
                    <div className={styles.optionCost}>20 manat</div>
                  </label>
                </div>
                <div className={styles.deliveryOption}>
                  <input
                    type="radio"
                    id="pickup"
                    name="shipping_method"
                    value="pickup"
                    checked={selectedDeliveryType === "pickup"}
                    onChange={() => handleDeliveryTypeChange("pickup")}
                  />
                  <label className={styles.customRadio}></label>
                  <label htmlFor="pickup">
                    <div className={styles.optionTitle}>
                      {t("checkout.pickup")}
                    </div>
                    <div className={styles.optionCost}>Garassyzlyk Shayoly</div>
                  </label>
                </div>
              </div>

              <div className={styles.deliveryTimeOptions}>
                <h4>
                  {selectedDeliveryType === "pickup"
                    ? t("checkout.selectPickupTime")
                    : t("checkout.selectDeliveryTime")}
                </h4>
                {renderDeliveryTimeSection()}
              </div>
            </div>
          )}
        </div>

        <div className={styles.deliveryInfo}>
          <ul>
            <li>
              {t(
                "checkout.Delivery_is_carried_out_in_the_cities_of_Ashgabat_Buzmein_and_Anau"
              )}
            </li>
            <li>
              {t(
                "checkout.The_minimum_order_amount_must_be_at_least_50_manat_for_orders_over_150_manat_delivery_is_free"
              )}
            </li>
            <li>
              {t(
                "checkout.After_you_place_an_order_on_the_website_the_operator_will_call_you_to_confirm_the_order_for_regular_customers_confirmation_is_carried_out_automatically_at_their_request"
              )}
            </li>
            <li>
              {t(
                "checkout.Payment_is_made_after_you_check_and_accept_the_order_The_amount_of_your_payment_is_indicated_on_the_delivery_persons_payment_document_Payment_is_made_in_cash_and_by_card_in_national_currency_Accepted_and_paid_goods_are_not_subject_to_return"
              )}
            </li>
          </ul>
        </div>

        <div className={styles.orderButton}>
          <button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
            {t("checkout.placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
