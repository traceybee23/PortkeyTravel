import OpenModalButton from "../OpenModalButton";
import UpdateReview from "./UpdateReviewModal";


const UpdateReviewButton = ({reviewData, spotId}) => {


  return (
    <OpenModalButton
    buttonText={"Update"}
    spotId={spotId}
    reviewData={reviewData}
    modalComponent={<UpdateReview reviewData={reviewData} />}
    />
  )

}

export default UpdateReviewButton;
