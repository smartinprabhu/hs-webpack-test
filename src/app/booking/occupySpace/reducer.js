import { OCCUPY_SPACE, OCCUPY_SPACE_SUCCESS, OCCUPY_SPACE_FALURE } from './actions';

const initialState = {
  occupyResponse: {},
};

// eslint-disable-next-line default-param-last
function occupyReducer(state = initialState, action) {
  // eslint-disable-next-line no-param-reassign
  state.occupyResponse = {};
  switch (action.type) {
    case OCCUPY_SPACE:
      return {
        ...state,
        occupyResponse: (state.occupyResponse, { loading: true }),
      };
    case OCCUPY_SPACE_SUCCESS:
      return {
        ...state,
        occupyResponse: (state.occupyResponse,
        { loading: false, data: action.payload.data, err: {} }),
      };
    case OCCUPY_SPACE_FALURE:
      return {
        ...state,
        occupyResponse: (state.occupyResponse,
        { loading: false, err: action.error.data, data: {} }),
      };
    default:
      return state;
  }
}

export default occupyReducer;
