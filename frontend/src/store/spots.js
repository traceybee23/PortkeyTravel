import { csrfFetch } from './csrf'
const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const SINGLE_SPOT = 'spots/SINGLE_SPOT'
const LOAD_SPOT_IMAGES = 'images/LOAD_SPOT_IMAGES'
const DELETE_SPOT = 'spots/DELETE_SPOT'

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

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId
})


export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots')

  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots))
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
  console.log("CREATE SPOT",response)
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(loadSingleSpot(newSpot));
    return newSpot
  }
}

export const createSpotImage = (spotId, spotImage) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotImage)
  })
  console.log("CREATE IMAGE",response)
  if (response.ok) {
    const image = await response.json();
    dispatch(loadSpotImages(image, spotId))
    return image
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
      return { ...state, [action.spotId]: action.spotImage }
    default:
      return state
  }
}

export default spotsReducer;
