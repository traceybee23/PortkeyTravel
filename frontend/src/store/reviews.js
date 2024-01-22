import { csrfFetch } from "./csrf"
import { fetchSingleSpot } from "./spots"

const LOAD_SPOT_REVIEWS = 'reviews/LOAD_REVIEWS'
const CLEAR_SPOT_REVIEWS = 'reviews/CLEAR_SPOT_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'

const loadSpotReviews = (reviews, spotId) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews,
  spotId
})

export const clearSpotReviews = () => ({
  type: CLEAR_SPOT_REVIEWS
})

export const receiveReview = (review, spotId) => ({
  type: CREATE_REVIEW,
  review,
  spotId
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

export const createReview = (spotId, review) => async (dispatch, getState) => {
  const sessionUser = getState().session.user;

  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...review, userId: sessionUser.id }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(receiveReview(data));
    dispatch(fetchSingleSpot(spotId));
    dispatch(fetchSpotReviews(spotId));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const reviewState = {...state}
      if(action.reviews.Reviews !== "New"){
        action.reviews.Reviews.forEach((review) => {
          reviewState[review.id] = review
        })}
      return reviewState
    }
    case CLEAR_SPOT_REVIEWS: {
      return {};
    }
    case CREATE_REVIEW : {
      const reviewState = {...state}
      reviewState[action.review.id] = action.review
      return reviewState
    }
    default:
      return state
  }
}

export default reviewsReducer
