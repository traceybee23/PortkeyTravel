import OpenModalButton from "../OpenModalButton";
import UpdateReview from "./UpdateReviewModal";


const UpdateReviewButton = ({reviewData}) => {


  return (
    <OpenModalButton
    buttonText={"Update"}
    reviewData={reviewData}
    modalComponent={<UpdateReview reviewData={reviewData} />}
    />
  )

}

export default UpdateReviewButton;
