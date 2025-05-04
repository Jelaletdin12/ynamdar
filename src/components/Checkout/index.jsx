import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.scss";
import { X } from "lucide-react";
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

const Checkout = ({ cartItems, onBackToCart, onPlaceOrder }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    deliveryAddress: "null",
    payment_type_id: "",
    notes: "",
    region: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const { data: orderTimes = {} } = useGetOrderTimesQuery();
  const { data: orderPayments = [] } = useGetOrderPaymentsQuery();
  const { data: locationsData } = useGetLocationsQuery();
  const deviceType = useDeviceType();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "customer_phone") {
      // Always keep the +993 prefix
      const prefix = "+993 ";
      
      // If user is trying to delete the prefix, prevent it
      if (value.length < prefix.length) {
        return; // Don't update state, keep the current value
      }
      
      // Extract only the digits after the prefix
      const inputWithoutPrefix = value.substring(prefix.length).replace(/\D/g, "");
      
      // Limit to 8 digits max (Turkmenistan mobile number format)
      const limitedDigits = inputWithoutPrefix.substring(0, 8);
      
      // Format with space after first 2 digits
      let formattedPhone = prefix;
      if (limitedDigits.length > 0) {
        formattedPhone += limitedDigits.substring(0, 2);
        
        if (limitedDigits.length > 2) {
          formattedPhone += " " + limitedDigits.substring(2);
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
  };

  // Initialize phone with prefix
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      customer_phone: "+993 "
    }));
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    // Remove the +993 prefix and any spaces
    return phoneNumber.replace(/^\+993\s*/, "").replace(/\s+/g, "");
  };

  const handleClearAddress = () => {
    setSelectedAddress(null);
    setFormData((prev) => ({
      ...prev,
      address: "",
    }));
  };

  const handleFocus = (event) => {
    event.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const getOrderData = () => {
    // Validation checks
    if (
      !formData.customer_name ||
      !formData.customer_phone ||
      !formData.customer_address ||
      !formData.payment_type_id
    ) {
      console.error("Missing required fields");
      alert("Please fill in all required fields");
      return null;
    }

    // Set default values for delivery
    const currentDate = new Date().toISOString().split('T')[0];
    const defaultTimeSlot = {
      date: currentDate,
      hour: "12:00-14:00" // Default time slot
    };

    // Prepare data in the format expected by the API
    return {
      customer_name: formData.customer_name,
      customer_phone: formatPhoneNumber(formData.customer_phone),
      customer_address: formData.customer_address,
      shipping_method: "standard", // Default to standard shipping
      payment_type_id: formData.payment_type_id,
      delivery_time: defaultTimeSlot.hour,
      delivery_at: defaultTimeSlot.date,
      region: formData.region || "",
      notes: formData.notes || ""
    };
  };

  // Make handlePlaceOrder available to the parent through a ref or expose it
  useEffect(() => {
    if (onPlaceOrder) {
      onPlaceOrder.current = async () => {
        const orderDetails = getOrderData();
        if (!orderDetails) return false;

        try {
          const response = await placeOrder(orderDetails);

          if (response.data && !response.error) {
            console.log("Order placed successfully:", response.data);
            window.location.href = "/orders";
            return true;
          } else {
            throw new Error(response.error || "Unknown error occurred");
          }
        } catch (error) {
          console.error("Failed to place order:", error);

          if (
            error.data &&
            typeof error.data === "string" &&
            error.data.includes("<!doctype html>")
          ) {
            console.error(
              "Server returned HTML instead of a proper API response"
            );
            alert(
              "There was a problem with the server. Please try again later or contact support."
            );
          } else {
            alert(
              "Failed to place order. Please check your information and try again."
            );
          }
          return false;
        }
      };
    }
  }, [formData, placeOrder, onPlaceOrder]);

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
              <div
                className={styles.text}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    payment_type_id: String(payment.id),
                  }));
                }}
              >
                <span className={styles.optionTitle}>{payment.name}</span>
                <span className={styles.optionDesc}>
                  {payment.name === "Nagt"
                    ? t("checkout.payment_in_cash_upon_delivery_of_the_order")
                    : t("checkout.payment_by_card")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.deliveryForm}>
          <h3>{t("checkout.address")}:</h3>
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
                placeholder="+993 61 097651"
                required
                onFocus={handleFocus}
              />
            </div>
          </div>

          <div className={styles.formRow}>
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
      </div>
    </div>
  );
};

export default Checkout;