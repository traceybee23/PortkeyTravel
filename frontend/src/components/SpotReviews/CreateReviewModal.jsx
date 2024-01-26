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
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({})

    if(sessionUser) setFirstName(sessionUser.firstName)
    const newReview = {
      review,
      stars,
      firstName: firstName
    }
    await dispatch(createReview(spotId, newReview))
    .then(closeModal)
    .catch(async (response) => {
      const data = await response.json();
      if (data && data.errors) {
        setErrors(data.errors)
      }
    })

  }

  const onChange = (number) => {
    setStars(parseInt(number))
  }

  return (
    <div className='reviewForm'>
      <h2>How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        {errors.review && <span className='errors'>{errors.review}</span>}
        {errors.stars && <span className='errors'>{errors.stars}</span>}
        <textarea
          className='reviewTextArea'
          placeholder='Leave your review here...'
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
        />
        <StarRatingInput
          onChange={onChange}
          stars={stars}
          />
        <button type='submit' disabled={(review.length < 10) || (!stars)}>Submit Your Review</button>

      </form>
    </div>
  )
}

export default CreateReview;
