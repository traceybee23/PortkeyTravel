import OpenModalButton from "../OpenModalButton"
import DeleteSpotModal from "./DeleteSpotModal"

const DeleteSpotButton = (spotId) => {
  return (
    <OpenModalButton
    buttonText="Delete"
    spotId={spotId}
    modalComponent={<DeleteSpotModal spotId={spotId} />}
    />
  )
}

export default DeleteSpotButton;
