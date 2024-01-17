const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const SINGLE_SPOT = 'spots/SINGLE_SPOT'

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
})

const loadSingleSpot = (spot, spotId) => ({
  type: SINGLE_SPOT,
  spot,
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

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsState = {...state}
      action.spots.Spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      })
      return spotsState
    }
    case SINGLE_SPOT: {
      return { ...state, [action.spot.id]: action.spot }
    }
    default:
      return state
  }
}

export default spotsReducer;
