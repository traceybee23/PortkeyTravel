import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
import { userReviews } from "../../store/reviews";
import DeleteReviewButton from "../SpotReviews/DeleteReviewButton";
import UpdateReviewButton from "./UpdateReviewButton";
import "./CurrUserReviews.css";


const CurrUserReviews = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const user = useSelector((state) => state.session.user);
  const reviews = Object.values(useSelector((state) => state.reviews));

  console.log(reviews, "Curr user reviews")
  useEffect(() => {
    dispatch(userReviews());
  }, [dispatch]);

  const getDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    return [month, " ", year];
  };

  return (
    <div className="review-card-container">
      <h2 className="mr-title">Manage Reviews</h2>
      {reviews &&
        reviews.map((review) => (
          <li key={review?.id}>
            <div className="review-cards">
              <h3 style={{ marginBottom: "0" }}>
                {review?.Spot && review?.Spot.name}
              </h3>
              <span style={{ fontSize: "14px", color: "grey" }}>
                {review?.createdAt && getDate(review?.createdAt)}
              </span>
              <div>{review?.review}</div>
              <div>
                <span className="deleteReviewButton">
                  <DeleteReviewButton reviewId={review?.id} />
                </span>
                <span className="deleteReviewButton">
                  <UpdateReviewButton reviewData={review} />
                </span>
              </div>
            </div>
          </li>
        ))}
    </div>
  );
};

export default CurrUserReviews;
