import { useDispatch, useSelector } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SpotReviews = () => {

  const {spotId} = useParams();

  const dispatch = useDispatch();

  const reviews = Object.values(useSelector((state) => state.reviews))

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, spotId])

  return (
    <>
    {reviews && reviews.map((review) => (
      <li key={review.id}>
        <span>
        {review.User.firstName}
        </span>
        <span>
          {review.createdAt}
        </span>
        {review.review}
      </li>
    ))}
    </>
  )
}

export default SpotReviews;
