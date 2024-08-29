import OpenModalButton from "../OpenModalButton";
import UpdateReview from "./UpdateReviewModal";


const UpdateReviewButton = ({reviewData}) => {


  return (
    <OpenModalButton
    buttonText={"Edit"}
    reviewData={reviewData}
    modalComponent={<UpdateReview reviewData={reviewData} />}
    />
  )

}

export default UpdateReviewButton;
