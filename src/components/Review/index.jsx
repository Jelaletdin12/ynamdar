"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import styles from "./review.module.scss";
import {
  useSubmitReviewMutation,
  useGetReviewsByProductQuery,
} from "../../app/api/reviewApi";

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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Teswir({reviews.length})</h2>
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
          <h3 className={styles.formTitle}>Teswir ýaz</h3>

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
            placeholder="Teswir"
          />

          <button
            type="submit"
            className={styles.formSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Göndermek..." : "Teswir ýaz"}
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
