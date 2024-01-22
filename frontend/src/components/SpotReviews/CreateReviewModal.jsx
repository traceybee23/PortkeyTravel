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

  const sessionUser = useSelector(state => state.session.user);

  const [firstName, setFirstName] = useState('')
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(sessionUser) setFirstName(sessionUser.firstName)
    const newReview = {
      review,
      stars,
      firstName: firstName
    }
    await dispatch(createReview(spotId, newReview))
    .then(closeModal)

  }

  const onChange = (number) => {

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
        <button type='submit'>Submit Your Review</button>

      </form>
    </div>
  )
}

export default CreateReview;
