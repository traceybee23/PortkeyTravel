import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

const createReview = () => {

  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault();

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
        <div>Stars</div>

      </form>
    </div>
  )
}

export default createReview;
