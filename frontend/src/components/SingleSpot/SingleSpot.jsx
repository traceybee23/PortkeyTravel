import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSingleSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import ReviewButton from "../SpotReviews/ReviewButton"
import './SingleSpot.css'

const SingleSpot = () => {

  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots ? state.spots[spotId] : null);

  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const reviews = Object.values(useSelector((state) => state.reviews))

  useEffect(() => {
    dispatch(fetchSingleSpot(spotId));
  }, [dispatch, spotId])


  return (
    spot && spot.Owner &&
    <>
      <div className="singleSpotDeets">
        <>
          <h2>{spot.name}</h2>
          <h4>{spot.city}, {spot.state}, {spot.country}</h4>
          <div className="imageContainer">
            {spot.SpotImages !== "No available spot images" && spot.SpotImages.map(image => (
              image.preview &&
              <img className="spotImages" key={image.id} src={image.url} />
            ))}
            {spot.SpotImages !== "No available spot images" && spot.SpotImages.map(image => (
              !image.preview &&
              <img className="spotImages" key={image.id} src={image.url} />
            ))}
          </div>
          <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
          <div className="detailsContainer">
            <p className="spotDescription">&nbsp;&nbsp;&nbsp;{spot.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut tristique et egestas quis ipsum suspendisse ultrices gravida. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. <br></br>&nbsp;&nbsp;&nbsp;Pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper. Mauris sit amet massa vitae tortor condimentum lacinia quis. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Purus in mollis nunc sed id semper. </p>
            <div className="reserveContainer">
              <span style={{ fontWeight: 'bold' }}>${spot.price}&nbsp;night&nbsp;</span>
              <span style={{ fontSize: '13px' }}><i className="fa-solid fa-star" />&nbsp;{spot.avgStarRating}
                {spot.numReviews && spot.numReviews > 1 &&
                  <span style={{ fontSize: '13px' }}>&nbsp;·&nbsp;{spot.numReviews}&nbsp;Reviews </span>
                }
                {spot.numReviews === 1 &&
                  <span style={{ fontSize: '13px' }}>&nbsp;·&nbsp;{spot.numReviews} Review </span>
                }
              </span>
              <button onClick={() => window.alert("Feature Coming Soon...")}>Reserve</button>
            </div>
          </div>
        </>
        <div className="reviewContainer">
          <span><i className="fa-solid fa-star" />&nbsp;{spot.avgStarRating}</span>
          {spot.numReviews && spot.numReviews > 1 &&
            <>
              <span>&nbsp;·&nbsp;{spot.numReviews} Reviews </span>
            </>
          }
          {spot.numReviews === 1 &&
            <span>&nbsp;·&nbsp;{spot.numReviews} Review </span>
          }
        </div>
        <div>
          {sessionUser && (sessionUser.id !== spot.Owner.id )  && reviews.every((review) => review.userId !== sessionUser.id) &&
            <ReviewButton />
          }

        </div>
        {
          spot.numReviews >= 1 &&
          <SpotReviews spotId={spotId} />
        }
        {
          spot.numReviews < 1 &&
          <span>Be the first to post a review!</span>
        }
      </div>
    </>
  )
}

export default SingleSpot;
