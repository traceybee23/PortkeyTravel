import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal"

const DeleteReviewButton = () => {
  return (
    <OpenModalButton
    buttonText="Delete"
    modalComponent={<DeleteReviewModal />}
    />
  )
}

export default DeleteReviewButton;
