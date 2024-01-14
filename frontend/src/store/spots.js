const LOAD_SPOTS = 'spots/LOAD_SPOTS'

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
})


export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots')

  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpots(spots))
  }
}


const spotsReducer = (state = { }, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsState = {...state}
      action.spots.Spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      })
      return spotsState
    }
    default:
      return state
  }
}

export default spotsReducer;
