import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useNavigate } from 'react-router-dom'
import './Spots.css'

const SpotsIndex = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const spots = Object.values(useSelector((state) => state.spots))


  useEffect(() => {
    dispatch(fetchSpots())
  }, [dispatch])

  return (
    <div className='spots'>
      <h1>LairBnB</h1>
      <ul className='spotsContainer'>
        {spots && spots.map((spot) => (
          <li
            onClick={() => navigate(`/api/spots/${spot.id}`)}
            className='spotsCards'
            key={spot.id}>
            <img src={spot.previewImage} alt={spot.name} />
            <div className='spotDeets'>
            <span>{spot.city},{spot.state}</span>
            <span><i className="fa-solid fa-star" />{spot.avgRating}</span>
            </div>
            <span className='price'>${spot.price}<span className='text'> night</span></span>

          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpotsIndex;
