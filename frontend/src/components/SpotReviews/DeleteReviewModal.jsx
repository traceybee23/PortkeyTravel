import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';

const DeleteReview = ({reviewId}) => {

  const dispatch = useDispatch();

  const {closeModal} = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReview(reviewId.reviewId))
    .then(closeModal)
    .catch(async (response) => {
      const data = await response.json();
      return data;
    })
  }

  return (
    <li>
      <h3>Confirm Delete</h3>
      <span>Are you sure you want to delete this review?</span>
      <button onClick={handleDelete}>Yes (Delete Review)</button>
      <button style={{backgroundColor: "darkgrey"}} onClick={closeModal}>No (Keep Review)</button>
    </li>
  )

}

export default DeleteReview;
