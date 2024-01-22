import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrUserSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";

const CurrUserSpots = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = (useSelector(state => state.session.user))
  const spots = Object.values(useSelector(state => state.spots))

  const userSpots = []
  spots.forEach(spot => {
    if (spot.ownerId === user.id)
      userSpots.push(spot)
  })

  useEffect(() => {
    dispatch(loadCurrUserSpots())
  }, [dispatch])

  return (
    <>
      <h2>Manage Spots</h2>
      <button
        onClick={()=> navigate('/spots/new')}
      >Create a New Spot</button>
      <ul className="spotsContainer">
        {userSpots && userSpots.map(spot => (
          <li
            className="spotsCards"
            key={spot.id}
          >
            <div className="userSpotCards">
              <img src={spot.previewImage} alt={spot.name} />
              <div className='spotDeets'>
                <span>{spot.city},{spot.state}</span>
                <span><i className="fa-solid fa-star" />&nbsp;{spot.avgRating}</span>
              </div>
              <span className='price'>${spot.price}<span className='text'> night</span></span>
            </div>
          </li>
        ))
        }
      </ul>
    </>
  )
}

export default CurrUserSpots;
