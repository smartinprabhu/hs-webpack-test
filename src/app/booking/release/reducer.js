import { SAVE_RELEASE, SAVE_RELEASE_SUCCESS, SAVE_RELEASE_FALURE } from './actions';

const initialState = {
  releaseInfo: {},
};

// eslint-disable-next-line default-param-last
function releaseReducer(state = initialState, action) {
  // eslint-disable-next-line no-param-reassign
  state.releaseInfo = {};
  switch (action.type) {
    case SAVE_RELEASE:
      return {
        ...state,
        releaseInfo: (state.releaseInfo, { loading: true }),
      };
    case SAVE_RELEASE_SUCCESS:
      return {
        ...state,
        releaseInfo: (state.releaseInfo, { loading: false, data: action.payload.data, err: {} }),
      };
    case SAVE_RELEASE_FALURE:
      return {
        ...state,
        releaseInfo: (state.releaseInfo, { loading: false, err: action.error.data, data: [] }),
      };
    default:
      return state;
  }
}

export default releaseReducer;
