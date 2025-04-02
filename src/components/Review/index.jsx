"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Modal, Button } from "antd";
import styles from "./review.module.scss";
import {
  useSubmitReviewMutation,
  useGetReviewsByProductQuery,
} from "../../app/api/reviewApi";
import { useAuth } from "../../context/authContext";
import LoginModal from "../LogIn/index";
import SignUpModal from "../SignUp/index";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${styles.star} ${
            (interactive ? hoverRating || rating : rating) >= star
              ? styles.starFilled
              : styles.starEmpty
          }`}
          onClick={() => interactive && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(star)}
        />
      ))}
    </div>
  );
};

const ReviewSection = ({
  productId,
  existingReviews = [],
  reviewStats = { count: 0, rating: "0.00" },
}) => {
  // Get authentication status from auth context
  const { isAuthenticated } = useAuth();
   const { t, i18n } = useTranslation();
  // States for modals
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);

  // Always call the hook, but skip the query if we already have reviews
  const { data: apiReviews, isLoading: isLoadingReviews } =
    useGetReviewsByProductQuery(productId, {
      skip: existingReviews.length > 0,
    });

  // Use the API hooks from reviewApi.js
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();

  const [reviews, setReviews] = useState(
    existingReviews.length > 0
      ? existingReviews.map((review) => ({
          id: review.id,
          rating: Number.parseInt(review.rating),
          text: review.title,
          date: review.created_at || new Date().toISOString(),
          source: review.source,
        }))
      : []
  );

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    source: "site",
  });

  useEffect(() => {
    if (apiReviews && existingReviews.length === 0) {
      setReviews(apiReviews);
    }
  }, [apiReviews, existingReviews]);

  const averageRating =
    (reviewStats.rating ? Number.parseFloat(reviewStats.rating) : 0) ||
    (reviews.length
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(2)
      : "0.00");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show warning modal
      setIsWarningModalVisible(true);
      return;
    }
    
    if (!newReview.rating || !newReview.title?.trim()) return;

    try {
      await submitReview({
        productId,
        rating: newReview.rating,
        title: newReview.title,
        source: newReview.source,
      }).unwrap();

      const review = {
        id: Date.now(),
        rating: newReview.rating,
        text: newReview.title,
        date: new Date().toISOString(),
        source: newReview.source,
      };

      setReviews((currentReviews) =>
        Array.isArray(currentReviews) ? [review, ...currentReviews] : [review]
      );
      setNewReview({
        rating: 0,
        title: "",
        source: "site",
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Modal handlers
  const handleLoginClick = () => {
    setIsWarningModalVisible(false);
    setIsLoginModalVisible(true);
  };

  const handleSignUpClick = () => {
    setIsWarningModalVisible(false);
    setIsSignUpModalVisible(true);
  };

  return (
    <div className={styles.root}>
      {/* Warning Modal */}
      <Modal
        open={isWarningModalVisible}
        onCancel={() => setIsWarningModalVisible(false)}
        footer={null}
        closeIcon={<span>×</span>}
      >
        <div style={{ textAlign: 'center', padding: '10px 0'}}>
          <p style={{ marginBottom: '20px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {t("common.Register_or_use_your_existing_account_to_post_a_comment")}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button
              type="primary"
              onClick={handleLoginClick}
              style={{ minWidth: '100px' }}
            >
              {t("profile.login")}
            </Button>
            <Button 
              onClick={handleSignUpClick}
              style={{ minWidth: '100px' }}
              type="primary"
            >
               {t("profile.registration")}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Login Modal */}
      <LoginModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
      
      {/* SignUp Modal */}
      <SignUpModal
        isVisible={isSignUpModalVisible}
        onClose={() => setIsSignUpModalVisible(false)}
      />
      
      <div className={styles.header}>
        <h2 className={styles.title}>  {t("common.comment")}({reviews.length})</h2>
        <div className={styles.ratingStar}>
          <span>{averageRating}</span>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  Number.parseFloat(averageRating) >= star
                    ? styles.starFilled
                    : styles.starEmpty
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmitReview}>
          <h3 className={styles.formTitle}>  {t("common.Writecomment")}</h3>

          <div className={styles.formRating}>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) =>
                setNewReview((prev) => ({ ...prev, rating }))
              }
              interactive
            />
          </div>

          <textarea
            className={styles.formTextarea}
            value={newReview.title}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder={t("common.comment")}
          />

          <button
            type="submit"
            className={styles.formSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ugratmak..." : t("common.Writecomment")}
          </button>
        </form>

        <div className={styles.reviews}>
          {isLoadingReviews ? (
            <div>Ýüklenýär...</div>
          ) : reviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewsItem}>
                  <StarRating rating={review.rating} />
                  <p className={styles.reviewsText}>{review.text}</p>
                  <span className={styles.reviewsDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.reviewsEmpty}>
              Bu haryt barada teswir ýazylmandyr
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;