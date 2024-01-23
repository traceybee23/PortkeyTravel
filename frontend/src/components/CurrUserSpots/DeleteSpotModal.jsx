import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import { deleteSpot } from "../../store/spots";

const DeleteSpot = ({spotId}) => {

  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSpot(spotId.spotId))
    .then(closeModal)
    .catch(async (response) => {
      const data = await response.json();
      return data;
    })
  }

  return (
    <li>
    <h3>Confirm Delete</h3>
    <span>Are you sure you want to delete this spot?</span>
    <button onClick={handleDelete}>Yes (Delete Spot)</button>
    <button style={{backgroundColor: "darkgrey"}} onClick={closeModal}>No (Keep Spot)</button>
  </li>
  )
}

export default DeleteSpot;
