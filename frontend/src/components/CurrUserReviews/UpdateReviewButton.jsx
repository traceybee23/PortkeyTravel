import OpenModalButton from "../OpenModalButton";
import UpdateReview from "./UpdateReviewModal";


const UpdateReviewButton = (reviewId, spotId) => {


  return (
    <OpenModalButton
    buttonText={"Edit"}
    reviewId={reviewId}
    modalComponent={<UpdateReview reviewId={reviewId} spotId={spotId}/>}
    />
  )

}

export default UpdateReviewButton;
