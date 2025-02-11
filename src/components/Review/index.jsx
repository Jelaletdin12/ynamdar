import React, { useState } from "react";
import { Star } from "lucide-react";
import styles from "./review.module.scss";

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
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.text.trim()) return;

    const review = {
      id: Date.now(),
      ...newReview,
      date: new Date().toISOString(),
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, text: "" });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Teswir({reviews.length})
        </h2>
        <div className={styles.ratingStar}>
          <span>4.5</span>
          <div>
          <Star/>
          <Star/>
          <Star/>
          <Star/>
          <Star/>
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
            value={newReview.text}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Teswir"
          />

          <button type="submit" className={styles.formSubmit}>
            Teswir ýaz
          </button>
        </form>

        <div className={styles.reviews}>
          {reviews.length > 0 ? (
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
