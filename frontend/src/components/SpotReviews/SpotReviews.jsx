import { useDispatch, useSelector } from "react-redux";
import { fetchSpotReviews } from "../../store/reviews";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import './SpotReviews.css'

const SpotReviews = () => {

  const { spotId } = useParams();

  const dispatch = useDispatch();

  const reviews = Object.values(useSelector((state) => state.reviews))

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, spotId])

  return (
    <>
      {reviews && reviews.map((review) => (
        <li
          className="reviewsList"
          key={review.id}>
          <span style={{ fontSize: '18px' }}>
            {review.User.firstName}
          </span>
          <span style={{ fontSize: '14px', color: 'grey' }}>
            {review.createdAt &&
            review.createdAt
            }
          </span>

          <span style={{ fontSize: '12px' }}>
            {review.review} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut tristique et egestas quis ipsum suspendisse ultrices gravida. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper. Mauris sit amet massa vitae tortor condimentum lacinia quis.
          </span>
        </li>
      ))}
    </>
  )
}

export default SpotReviews;
