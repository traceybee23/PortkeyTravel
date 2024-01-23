import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal"

const DeleteReviewButton = (reviewId) => {

  return (
    <OpenModalButton
    buttonText="Delete"
    reviewId={reviewId}
    modalComponent={<DeleteReviewModal reviewId={reviewId} />}
    />
  )
}

export default DeleteReviewButton;
