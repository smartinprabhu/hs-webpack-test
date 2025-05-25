import {
  SAVE_ACCESS, SAVE_ACCESS_SUCCESS, SAVE_ACCESS_FALURE,
  GET_BOOKING_LIST, GET_BOOKING_LIST_SUCCESS, GET_BOOKING_LIST_FAILURE,
} from './actions';

const initialState = {
  accessInfo: {},
  bookingListInfo: {},
};

// eslint-disable-next-line default-param-last
function accessReducer(state = initialState, action) {
  // eslint-disable-next-line no-param-reassign
  state.accessInfo = { err: null };
  switch (action.type) {
    case SAVE_ACCESS:
      return {
        ...state,
        accessInfo: (state.accessInfo, { loading: true }),
      };
    case SAVE_ACCESS_SUCCESS:
      return {
        ...state,
        accessInfo: (state.accessInfo, { loading: false, data: action.payload.data, err: {} }),
      };
    case SAVE_ACCESS_FALURE:
      return {
        ...state,
        accessInfo: (state.accessInfo, { loading: false, err: action.error.data, data: {} }),
      };
    case GET_BOOKING_LIST:
      return {
        ...state,
        bookingListInfo: (state.bookingListInfo, {
          loading: true, err: {},
        }),
      };
    case GET_BOOKING_LIST_SUCCESS: return {
      ...state,
      bookingListInfo: (state.bookingListInfo, {
        loading: false, data: action.payload.data, err: {},
      }),
    };
    case GET_BOOKING_LIST_FAILURE: return {
      ...state,
      bookingListInfo: (state.bookingListInfo, {
        loading: false, err: action.error.data, data: {},
      }),
    };
    default:
      return state;
  }
}

export default accessReducer;
