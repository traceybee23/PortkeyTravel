import { useDispatch, useSelector } from "react-redux";
import { fetchSpotReviews, clearSpotReviews } from "../../store/reviews";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import DeleteReviewButton from "./DeleteReviewButton";
import "./SpotReviews.css";
import UpdateReviewButton from "../CurrUserReviews/UpdateReviewButton";

const SpotReviews = () => {
  const { spotId } = useParams();

  const dispatch = useDispatch();

  const reviews = Object.values(useSelector((state) => state.reviews));

  const sessionUser = useSelector((state) => state.session.user);

  reviews.sort((a, b) => b.id - a.id);


  useEffect(() => {
    dispatch(fetchSpotReviews(spotId));
    return () => {
      dispatch(clearSpotReviews());
    };
  }, [dispatch, spotId]);

  const getDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    return [month, " ", year];
  };

  return (
    <>
      {reviews &&
        reviews.map((review) => (
          <li className="reviewsList" key={review.id}>
            <span style={{ fontSize: "18px" }}>
              {sessionUser && sessionUser.id === review.User?.id
                ? sessionUser.firstName
                : review.User?.firstName}
            </span>
            <span style={{ fontSize: "14px", color: "grey" }}>
              {review.createdAt && getDate(review.createdAt)}
            </span>
            <span style={{ fontSize: "12px" }}>{review.review}</span>
            {sessionUser && sessionUser.id === review.User?.id && (
              <div className="reviewButtonContainer">
                <span>
                  <UpdateReviewButton spotId={spotId} reviewData={review} />
                </span>
                <span>
                  <DeleteReviewButton reviewId={review.id} />
                </span>
              </div>
            )}
          </li>
        ))}
    </>
  );
};

export default SpotReviews;
