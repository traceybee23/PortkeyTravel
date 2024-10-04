import { csrfFetch } from "./csrf"
import { fetchSingleSpot } from "./spots"

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const CLEAR_SPOT_REVIEWS = 'reviews/CLEAR_SPOT_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';

const loadSpotReviews = (reviews, spotId) => ({
  type: LOAD_SPOT_REVIEWS,
  reviews,
  spotId
})

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews
})

export const clearSpotReviews = () => ({
  type: CLEAR_SPOT_REVIEWS
})

export const receiveReview = (review, spotId) => ({
  type: CREATE_REVIEW,
  review,
  spotId
})

const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId
})

const modifyReview = (review) => ({
  type: UPDATE_REVIEW,
  review
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

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    dispatch(removeReview(reviewId));
  } else {
    const errors = await response.json();
    return errors;
  }
}

export const updateReview = (reviewData) => async dispatch => {
  console.log(reviewData, "thunk")
  const response = await csrfFetch(`/api/reviews/${reviewData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(modifyReview(data));
  } else {
    const errors = await response.json();
    return errors;
  }

}

export const userReviews = () => async dispatch => {
  const response = await csrfFetch('/api/reviews/current')

  if (response.ok) {
    const userReviews = await response.json();

    dispatch(loadReviews(userReviews))

  } else {
    const errors = await response.json();
    return errors;
  }
}

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      const reviewState = {}
      action.reviews.Reviews.forEach((review) => {
        reviewState[review.id] = review
      })
      
      return reviewState
    }
    case LOAD_SPOT_REVIEWS: {
      const reviewState = {}
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
    case REMOVE_REVIEW: {
      const newState = {...state};
      delete newState[action.reviewId];
      return newState;
    }
    case UPDATE_REVIEW: {
      console.log(action.review, "reducer")
      return {...state, [action.review.id]: action.review}
    }
    default:
      return state
  }
}

export default reviewsReducer
