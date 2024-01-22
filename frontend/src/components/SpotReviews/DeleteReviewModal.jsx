import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';


const DeleteReview = ({reviewId}) => {

  const dispatch = useDispatch();

  const {closeModal} = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteReview(reviewId))
    .then(closeModal)
  }

  return (
    <li>
      <h3>Confirm Delete</h3>
      <span>Are you sure you want to delete this review?</span>
      <button onClick={handleDelete}>Yes (Delete Review)</button>
      <button onClick={closeModal}>No (Keep Review)</button>
    </li>
  )

}

export default DeleteReview;
