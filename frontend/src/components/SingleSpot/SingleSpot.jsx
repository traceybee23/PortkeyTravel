import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSingleSpot } from "../../store/spots";

const SingleSpot = () => {

  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots ? state.spots[spotId] : null );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleSpot(spotId))
  }, [dispatch, spotId])

  return (
    spot && spot.Owner &&
    <div>
      <h2>{spot.name}</h2>
      <h4>{spot.city}, {spot.state}, {spot.country}</h4>
      <div className="imageContainer">
      {spot.SpotImages && spot.SpotImages.map(image => (
        <li
          className="spotImages"
          key={image.id}
        >
          <img src={image.url} />
        </li>
      ))}
      </div>
      <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
      <p>{spot.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut tristique et egestas quis ipsum suspendisse ultrices gravida. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper. Mauris sit amet massa vitae tortor condimentum lacinia quis. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Purus in mollis nunc sed id semper. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Malesuada proin libero nunc consequat interdum. Sagittis vitae et leo duis ut diam quam nulla. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Enim nulla aliquet porttitor lacus luctus accumsan tortor posuere ac. Malesuada fames ac turpis egestas.</p>
      <div className="reserveContainer">
        <span>${spot.price} night </span>
        <span><i className="fa-solid fa-star" />{spot.avgStarRating} </span>
        {spot.numReviews &&
          <span> · {spot.numReviews} Reviews </span>
            }
        <button onClick={() => window.alert("Feature Coming Soon...")}>Reserve</button>
      </div>
    </div>

  )
}

export default SingleSpot;
