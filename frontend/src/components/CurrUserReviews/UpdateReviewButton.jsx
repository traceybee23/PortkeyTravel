import OpenModalButton from "../OpenModalButton";
import UpdateReview from "./UpdateReviewModal";


const UpdateReviewButton = (reviewId) => {

  return (
    <OpenModalButton
    buttonText={"Update"}
    reviewId={reviewId}
    modalComponent={<UpdateReview reviewId={reviewId}/>}
    />
  )

}

export default UpdateReviewButton;
