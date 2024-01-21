import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviews';
import StarRatingInput from './StarRatingInput';


const CreateReview = () => {


  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const spot = useSelector(state => state.spots)

  const spotId = ((Object.keys(spot).join()))

  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars
    }

    dispatch(createReview(spotId, newReview))
    .then(closeModal)

  }

  const onChange = (e) => {
    const number = e.target.value;
    setStars(parseInt(number))
  }

  return (
    <div className='reviewForm'>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='Leave your review here...'
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <StarRatingInput
          onChange={onChange}
          stars={stars}
          />
        <button type='submit'></button>

      </form>
    </div>
  )
}

export default CreateReview;
