import { GET_BOOKINGS, GET_BOOKINGS_SUCCESS, GET_BOOKINGS_FAILURE, SAVE_BOOKINGLAYOUT_VIEW } from './actions';

const initialState = {
  bookingsList: {},
  saveBookingLayoutViews: null,
};

// eslint-disable-next-line default-param-last
function myBookingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BOOKINGS: return {
      ...state,
    };
    case GET_BOOKINGS_SUCCESS: return {
      ...state,
      bookingsList: action.payload.data,
    };
    case SAVE_BOOKINGLAYOUT_VIEW:
      return {
        ...state,
        saveBookingLayoutViews: (state.saveBookingLayoutViews, action.payload),
      };
    case GET_BOOKINGS_FAILURE: return {
      ...state,
      bookingsList: (state.bookingsList, { err: action.error.data }),
    };
    default: return {
      ...state,
    };
  }
}

export default myBookingsReducer;
