const LOAD_SPOT_REVIEWS = 'reviews/LOAD_REVIEWS'

const loadSpotReviews = (reviews) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews
})

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`)

  if(response.ok) {
    const spotReviews = await response.json();
    dispatch(loadSpotReviews(spotReviews))
  } else {
    const errors = await response.json();
    return errors;
  }
}

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const reviewState = {}
      if (action.reviews.Reviews !== "New" ) {
      action.reviews.Reviews.forEach((review) => {
        reviewState[review.id] = review
      })
      }
      return reviewState
    }
    default:
      return state
  }
}

export default reviewsReducer
