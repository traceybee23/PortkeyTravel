const LOAD_SPOT_REVIEWS = 'reviews/LOAD_REVIEWS'
const CLEAR_SPOT_REVIEWS = 'reviews/CLEAR_SPOT_REVIEWS'

const loadSpotReviews = (reviews, spotId) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews,
  spotId
})

export const clearSpotReviews = () => ({
  type: CLEAR_SPOT_REVIEWS
})

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`)

  if (response.ok) {
    const spotReviews = await response.json();
    dispatch(loadSpotReviews(spotReviews, spotId))
  } else {
    const errors = await response.json();
    return errors;
  }
}

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const reviewState = {}
        action.reviews.Reviews.forEach((review) => {
          reviewState[review.id] = review
        })
      return reviewState
    }
    case CLEAR_SPOT_REVIEWS: {
      return {};
    }
    default:
      return state
  }
}

export default reviewsReducer
