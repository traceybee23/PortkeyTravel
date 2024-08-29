import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { updateReview } from "../../store/reviews";
import StarRatingInput from "../SpotReviews/StarRatingInput";
import { userReviews } from "../../store/reviews";


const UpdateReview = ({ reviewData }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // const reviewData = useSelector((state) => state.reviews);
  console.log(reviewData , "CLG");
  const [review, setReview] = useState(reviewData?.review);
  const [stars, setStars] = useState(reviewData?.stars);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    let errObj = {};
    if (!review) errObj.review = "review is required.";
    if (review && review?.length < 10)
      errObj.review = "reviews must be at least 10 characters in length.";
    if (review && review?.length > 2000)
      errObj.review = "reviews must be 2000 characters in length at most.";
    if (!stars) errObj.stars = "star rating is required.";
    setErrors(errObj);
  }, [review, stars]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors({});

    const newData = {
      id: reviewData.id,
      review,
      stars,
    };

    await dispatch(updateReview(newData)).then(() => {
      dispatch(userReviews())
    })

    .then(closeModal)
      // .catch(async (response) => {
      //   const data = await response.json();
      //   return data;
      // });
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <div className="updateReviewModal">
      <form onSubmit={handleUpdate}>
        <h2>Edit</h2>
        {errors.review && <span className='errors'>{errors.review}</span>}
        {errors.stars && <span className='errors'>{errors.stars}</span>}
        <textarea
          className="textBox"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder={review}
          name="review"
          rows="6"
        />
        <StarRatingInput onChange={onChange} stars={stars} />
        <button type="submit" disabled={review?.length < 10 || !stars}>
          update your review
        </button>
      </form>
    </div>
  );
};

export default UpdateReview;
