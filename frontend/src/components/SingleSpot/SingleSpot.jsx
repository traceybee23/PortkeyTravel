import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSingleSpot } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import ReviewButton from "../SpotReviews/ReviewButton"
import { fetchSpotReviews } from "../../store/reviews";
import './SingleSpot.css'

const SingleSpot = () => {

  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots ? state.spots[spotId] : null);

  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const reviews = Object.values(useSelector((state) => state.reviews))

  const needBreak = (() => spot.description.split('').some(ele => ele === " "))

  useEffect(() => {

    dispatch(fetchSingleSpot(spotId));

    if (reviews.length) {
      dispatch(fetchSpotReviews(spotId));
    }


  }, [dispatch, spotId, reviews.length])



  const shouldDisplayReviewButton =
    sessionUser &&
    spot &&
    spot.Owner &&
    sessionUser.id !== spot.Owner.id &&
    !reviews.some((review) => review.userId === sessionUser.id && review.spotId === spot.id)



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
            <span className="spotDescription">&nbsp;&nbsp;&nbsp;{spot.description && needBreak() ? (
              <span>{spot.description}</span>
            ) : (
              <span style={{wordBreak: "break-all"}}>{spot.description}</span>
            )
            }</span>
            <div className="reserveContainer">
              <span className='reservePrice' style={{ fontWeight: 'bold' }}>${Number.parseFloat(`${spot.price}`).toFixed(2)}&nbsp;night&nbsp;</span>
              <span className="starAndReview" style={{ fontSize: '13px' }}><i className="fa-solid fa-star" />&nbsp;{spot.avgStarRating}
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
          {shouldDisplayReviewButton &&
            <div className="reviewButton">
              <ReviewButton />
            </div>
          }
        </div>
        {
          spot.numReviews >= 1 &&
          <SpotReviews spotId={spotId} />
        }
        {
          spot.numReviews < 1 && shouldDisplayReviewButton &&
          <span>Be the first to post a review!</span>
        }
      </div>
    </>
  )
}

export default SingleSpot;
