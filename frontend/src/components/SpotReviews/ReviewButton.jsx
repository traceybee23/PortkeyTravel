import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "./CreateReviewModal";
import './SpotReviews.css'

const ReviewButton = () => {

  return (
    <OpenModalButton
      buttonText="Post Your Review"
      modalComponent={<CreateReviewModal />}
      />
  )
}

export default ReviewButton;
