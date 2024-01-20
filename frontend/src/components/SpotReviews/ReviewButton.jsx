
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "./CreateReviewModal";


const ReviewButton = () => {

  return (
    <OpenModalButton
      buttonText="Post Your Review"
      modalComponent={<CreateReviewModal />}
      />
  )
}

export default ReviewButton;
