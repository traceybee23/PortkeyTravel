import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots, loadCurrUserSpots } from "../../store/spots";
import { useNavigate, Link } from "react-router-dom";
import './CurrUserSpots.css'

import DeleteSpotButton from "./DeleteSpotButton";

const CurrUserSpots = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = (useSelector(state => state.session.user))
  const spots = Object.values(useSelector(state => state.spots))

  const filtered = spots.filter(spot => spot.ownerId === user.id)

  useEffect(() => {
    dispatch(fetchSpots())
    if (filtered.length) {
      dispatch(loadCurrUserSpots())
        .catch(async (response) => {
          const data = await response.json();
          if (data) {
            console.log(data)
          }
        })
    }
  }, [dispatch, filtered.length])


  return (
    <>
      <h2>Manage Spots</h2>
      {
        !filtered.length ? (
          <Link className="createSpotLink"
            onClick={() => navigate('/spots/new')}
          >Create a New Spot</Link>
        ) : (
          <>
            <Link className="createSpotLink"
              onClick={() => navigate('/spots/new')}
            >Create a New Spot</Link>
            <ul className="spotsContainer">
              {filtered && filtered.map(spot => (
                <li
                  className="spotsCards"
                  key={spot.id}
                >
                  <Link style={{ textDecoration: 'none', color: 'black' }} to={`/spots/${spot.id}`}>
                    <div className="userSpotCards">
                      <img src={spot.previewImage} alt={spot.name} />
                      <div className='spotDeets'>
                        <span>{spot.city},&nbsp;{spot.state}</span>
                        <span><i className="fa-solid fa-star" />&nbsp;{spot.avgRating}</span>
                      </div>
                      <span className='price'>${Number.parseFloat(`${spot.price}`).toFixed(2)}<span className='text'> night</span></span>
                    </div>
                  </Link>
                  <div className="updateDeleteButtons">
                    <button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                    <DeleteSpotButton spotId={spot.id} />
                  </div>
                </li>
              ))
              }
            </ul>
          </>
        )
      }
    </>
  )
}

export default CurrUserSpots;
