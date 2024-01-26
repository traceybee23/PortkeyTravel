import { csrfFetch } from './csrf'
const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const SINGLE_SPOT = 'spots/SINGLE_SPOT'
const LOAD_SPOT_IMAGES = 'images/LOAD_SPOT_IMAGES'
const REMOVE_SPOT = 'spots/DELETE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const CLEAR_SPOT_DATA = 'spots/CLEAR_SPOT_DATA'

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
})

const loadSingleSpot = (spot) => ({
  type: SINGLE_SPOT,
  spot
})

export const loadSpotImages = (spotImage, spotId) => ({
  type: LOAD_SPOT_IMAGES,
  spotImage,
  spotId
});

export const editSpot = (spot) => ( {
  type: UPDATE_SPOT,
  spot
})

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId
})

export const clearSpotData = () => ({
  type: CLEAR_SPOT_DATA
})


export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots')

  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots))
  }
}

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  })

  if (response.ok) {
    dispatch(removeSpot(spotId));
  } else {
    const errors = await response.json();
    return errors;
  }
}

export const fetchSingleSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`)
  if (response.ok) {
    const spotDeets = await response.json();
    dispatch(loadSingleSpot(spotDeets, spotId))
    
  } else {
    const errors = await response.json();
    return errors;
  }
}

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot)
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(loadSingleSpot(newSpot));
    return newSpot
  }else {
    const errors = await response.json();
    return errors;
  }
}

export const createSpotImage = (spotId, spotImage) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotImage)
  })

  if (response.ok) {
    const image = await response.json();
    dispatch(loadSpotImages(image, spotId))
    return image
  }else {
    const errors = await response.json();
    return errors;
  }
}

export const loadCurrUserSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`)

  if(response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots))
    return spots;
  }else {
    const errors = await response.json();
    return errors;
  }
}

export const updateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch( `/api/spots/${spotId}`,{
  method: 'PUT',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(spot)
  })

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(editSpot(updatedSpot));
    return updatedSpot;
  } else {
    const errors = await response.json();
    return errors;
  }
}


const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsState = {}
      action.spots.Spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      })
      return spotsState
    }
    case SINGLE_SPOT: {
      const spotsState = {}
      spotsState[action.spot.id] = action.spot
      return spotsState
    }
    case LOAD_SPOT_IMAGES:
      return { ...state, [action.spotId.id]: action.spotImage }
    case UPDATE_SPOT:
      return {...state, [action.spot.id]: action.spot };
    case REMOVE_SPOT: {
      const newState = {...state}
      delete newState[action.spotId]
      return newState
    }
    case CLEAR_SPOT_DATA: {
      return {}
    }
    default:
      return state
  }
}

export default spotsReducer;
