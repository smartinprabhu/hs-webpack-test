/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unreachable */

import {
  GET_BOOKING_LIST,
  GET_BOOKING_LIST_FAILURE,
  GET_BOOKING_LIST_SUCCESS,
  GET_IMPORTANT_CONTACTS,
  SET_BOOKING_DATA,
  GET_WORK_STATIONS_DATA,
  GET_WORK_STATIONS_DATA_SUCCESS,
  GET_SHIFTS_DATA,
  GET_SHIFTS_DATA_SUCCESS,
  GET_SHIFTS_DATA_FAILURE,
  GET_FLOOR_VIEW,
  GET_FLOOR_VIEW_SUCCESS,
  GET_FLOOR_VIEW_FAILURE,
  SAVE_BOOKING,
  SAVE_BOOKING_SUCCESS,
  SAVE_BOOKING_FALURE,
  SAVE_GROUP_BOOKING,
  SAVE_GROUP_BOOKING_FAILURE,
  SAVE_GROUP_BOOKING_SUCCESS,
  GET_ALL_EMPLOYEE_LIST,
  GET_ALL_EMPLOYEE_LIST_SUCCESS,
  GET_ALL_EMPLOYEE_LIST_FAILURE,
  DELETE_BOOKING,
  DELETE_BOOKING_FAILURE,
  DELETE_BOOKING_SUCCESS,
  GET_WORK_STATIONS_DATA_FAILURE,
  RESET_BOOKING,
  GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS,
  GET_CATEGORIES_OF_WORKSTATIONS,
  GET_CATEGORIES_OF_WORKSTATIONS_FAILURE,
  GET_AVAILABILITY_OF_WORK_STATION,
  GET_AVAILABILITY_OF_WORK_STATION_FAILURE,
  GET_AVAILABILITY_OF_WORK_STATION_SUCCESS,
  SET_SPACE_ID,
  CLEAR_BOOKING_OBJ,
  GET_FLOOR_SPACES,
  GET_FLOOR_SPACES_SUCCESS,
  GET_FLOOR_SPACES_FAILURE,
  GET_MULTIDAYS_SHIFT_DATA,
  GET_MULTIDAYS_SHIFT_DATA_SUCCESS,
  GET_MULTIDAYS_SHIFT_DATA_FAILURE,
  GET_MULTIDAYS_AVAILABILITY_OF_SPACES,
  GET_MULTIDAYS_AVAILABILITY_OF_SPACES_SUCCESS,
  GET_MULTIDAYS_AVAILABILITY_OF_SPACES_FAILURE,
  SAVE_MULTIDAYS_BOOKING,
  SAVE_MULTIDAYS_BOOKING_SUCCESS,
  SAVE_MULTIDAYS_BOOKING_FAILURE,
  SAVE_GUEST,
  SAVE_GUEST_SUCCESS,
  SAVE_GUEST_FAILURE,
  GET_GUEST_LIST,
  GET_GUEST_LIST_SUCCESS,
  GET_GUEST_LIST_FAILURE,
  ADD_GUEST,
  SAVE_HOST,
  CLEAR_MULTIDAYS_AVAILABILITY_OF_SPACES,
  CLEAR_MULTIDAYS_SHIFT_INFO,
  RESET_GUEST_DATA,
  SAVE_NEW_GUEST,
  GET_EMPLOYEE_SPACE_VALIDITY,
  GET_EMPLOYEE_SPACE_VALIDITY_SUCCESS,
  GET_EMPLOYEE_SPACE_VALIDITY_FAILURE,
  CLEAR_CAP_LIMIT_DATA,
  SET_ERROR_MESSAGE,
  SAVE_CALENDAR_DATE,
  SAVE_SET_REFRESH,
  SAVE_GUEST_LIST,
  SAVE_PARTICIPANTS_LIST,
  SAVE_SELECTED_HOST,
  DISABLE_FIELDS,
  SAVE_REMOVED_NODE_WITH_EMPLOYEE,
  SAVE_DATA_TO_SPACE_VIEW,
  CLEAR_SAVE_DATA_TO_SPACE_VIEW,
} from './actions';

const initialState = {
  importantContacts: [],
  bookingInfo: {},
  deleteInfo: {},
  workStations: {},
  bookingList: {},
  shiftsInfo: {},
  newBooking: {},
  employees: [],
  floorView: {},
  categories: {},
  workStationAvailability: {},
  workSpaceId: null,
  availabilityResponse: {},
  spacesForFloor: {},
  multidaysShiftsInfo: {},
  multidaysAvailabilityInfo: {},
  multidaysBookingInfo: {},
  guestListInfo: {},
  guestSaveInfo: {},
  addGuestInfo: {},
  saveHostInfo: {},
  updateGuestINFO: {},
  saveNewGuest: false,
  capsLimitInfo: {},
  errorMessage: false,
  calendarDate: false,
  refreshInfo: null,
  mapExpansionInfo: false,
  savedParticipantsData: [],
  savedGuestData: [],
  hostData: null,
  disableFields: null,
  removedNodeWithEmployee: [],
  savedDataToSpaceView: [],
};

// eslint-disable-next-line default-param-last
function bookingUserReducer(state = initialState, action) {
  // eslint-disable-next-line no-param-reassign
  state.deleteInfo = {};
  switch (action.type) {
    case GET_BOOKING_LIST:
      return {
        ...state,
        bookingList: { loading: true },
        newBooking: (state.newBooking, { loading: false, data: undefined, err: undefined }),
        multidaysBookingInfo: (state.multidaysBookingInfo, { loading: false, err: undefined, data: undefined }),
        multidaysAvailabilityInfo: (state.multidaysAvailabilityInfo, { loading: false, err: undefined, data: undefined }),
        workStations: null,
        bookingInfo: {},
      };
    case GET_BOOKING_LIST_SUCCESS:
      return {
        ...state,
        bookingList: (state.bookingList, { loading: false, data: action.payload.data, err: {} }),
      };
    case GET_BOOKING_LIST_FAILURE:
      return {
        ...state,
        bookingList: (state.bookingList, { loading: false, err: action.error.data, data: [] }),
      };
    case SAVE_GROUP_BOOKING:
    case SAVE_BOOKING:
      return {
        ...state,
        newBooking: (state.newBooking, { loading: true }),
      };
    case SAVE_BOOKING_SUCCESS:
      return {
        ...state,
        newBooking: (state.newBooking,
        { loading: false, data: action.payload.data, err: undefined }),
      };
    case SAVE_GROUP_BOOKING_FAILURE:
    case SAVE_BOOKING_FALURE:
      return {
        ...state,
        newBooking: (state.newBooking, { loading: false, err: action.error.data, data: undefined }),
      };
    case SAVE_GROUP_BOOKING_SUCCESS:
      return {
        ...state,
        newBooking: (state.newBooking,
        { loading: false, err: undefined, data: action.payload.data }),
      };
    case RESET_BOOKING:
      return {
        ...state,
        multidaysBookingInfo: (state.multidaysBookingInfo,
        { loading: false, err: undefined, data: undefined }),
        newBooking: (state.newBooking,
        { loading: false, err: undefined, data: undefined }),
      };
    case GET_SHIFTS_DATA:
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: true }),
      };
    case GET_SHIFTS_DATA_SUCCESS:
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: false, data: action.payload.data, err: {} }),
        newBooking: (state.newBooking, {}),
      };
    case GET_SHIFTS_DATA_FAILURE:
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: false, data: [], err: action.error.data }),
      };
    case GET_WORK_STATIONS_DATA:
      return {
        ...state,
        workStations: (state.workStations, { loading: true, data: null, err: null }),
        newBooking: {},
      };
    case GET_WORK_STATIONS_DATA_SUCCESS:
      return {
        ...state,
        workStations: (state.workStations, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_WORK_STATIONS_DATA_FAILURE:
      return {
        ...state,
        workStations: (state.workStations, { loading: false, data: null, err: action.error.data }),
      };
    case GET_IMPORTANT_CONTACTS:
      return {
        ...state,
        importantContacts: (state.importantContacts, action.payload),
      };
    case SET_BOOKING_DATA:
      return {
        ...state,
        bookingInfo: (state.bookingInfo, action.payload),
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: (state.errorMessage, action.payload),
      };
    case GET_ALL_EMPLOYEE_LIST:
      return {
        ...state,
        employees: (state.employees, { loading: true, err: undefined, data: undefined }),
      };
    case GET_ALL_EMPLOYEE_LIST_SUCCESS:
      return {
        ...state,
        employees: (state.employees, action.payload.data),
      };
    case GET_ALL_EMPLOYEE_LIST_FAILURE:
      return {
        ...state,
        employees: (state.employees, []),
      };
    case GET_FLOOR_VIEW:
      return {
        ...state,
        floorView: (state.floorView, { loading: true }),
      };
    case GET_FLOOR_VIEW_SUCCESS:
      return {
        ...state,
        floorView: (state.floorView, { loading: false, data: action.payload.data, err: {} }),
      };
    case GET_FLOOR_VIEW_FAILURE:
      return {
        ...state,
        floorView: (state.floorView, { loading: false, data: [], err: action.error.data }),
      };
    case DELETE_BOOKING:
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: true }),
      };
    case DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        deleteInfo: (state.deleteInfo,
        { loading: false, data: action.payload.data, err: undefined }),
      };
    case DELETE_BOOKING_FAILURE:
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: false, err: action.error.data, data: undefined }),
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        deleteInfo: (state.deleteInfo, {}),
      };
    case GET_CATEGORIES_OF_WORKSTATIONS:
      return {
        ...state,
        categories: (state.categories, { loading: true, err: undefined, data: undefined }),
      };
    case GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS:
      return {
        ...state,
        categories:
          (state.categories, { loading: false, err: undefined, data: action.payload.data }),
      };
    case GET_CATEGORIES_OF_WORKSTATIONS_FAILURE:
      return {
        ...state,
        categories: (state.categories, { loading: false, err: action.error.data, data: undefined }),
      };
    case GET_AVAILABILITY_OF_WORK_STATION:
      return {
        ...state,
        workStationAvailability:
          (state.workStationAvailability, { loading: true, err: undefined, data: undefined }),
      };
    case GET_AVAILABILITY_OF_WORK_STATION_SUCCESS:
      return {
        ...state,
        workStationAvailability:
          (state.workStationAvailability,
          { loading: false, err: undefined, data: action.payload.data }),
        availabilityResponse:
          { ...state.availabilityResponse, [state.workSpaceId]: action.payload.data },
      };
    case GET_AVAILABILITY_OF_WORK_STATION_FAILURE:
      return {
        ...state,
        workStationAvailability:
          (state.workStationAvailability,
          { loading: false, err: action.error.data, data: undefined }),
        availabilityResponse:
          { ...state.availabilityResponse, [state.workSpaceId]: action.error.data },
      };
    case CLEAR_BOOKING_OBJ:
      return {
        ...state,
        bookingInfo: {},
      };

    case GET_FLOOR_SPACES:
      return {
        ...state,
        spacesForFloor:
          (state.spacesForFloor, { loading: true, err: undefined, data: undefined }),
      };
    case GET_FLOOR_SPACES_SUCCESS:
      return {
        ...state,
        spacesForFloor:
          (state.spacesForFloor,
          { loading: false, err: undefined, data: action.payload.data }),
      };
    case GET_FLOOR_SPACES_FAILURE:
      return {
        ...state,
        spacesForFloor:
          (state.spacesForFloor,
          { loading: false, err: action.error.data, data: undefined }),
      };
    case SET_SPACE_ID:
      return {
        ...state,
        workSpaceId: action.payload,
        availabilityResponse: { ...state.availabilityResponse, [action.payload]: state.multidaysAvailabilityInfo.data },
      };
    case GET_MULTIDAYS_SHIFT_DATA:
      return {
        ...state,
        multidaysShiftsInfo: (state.multidaysShiftsInfo, { loading: true, err: undefined, data: undefined }),
      };
    case GET_MULTIDAYS_SHIFT_DATA_SUCCESS:
      return {
        ...state,
        multidaysShiftsInfo: (state.multidaysShiftsInfo, { loading: false, err: undefined, data: action.payload.data }),
      };
    case GET_MULTIDAYS_SHIFT_DATA_FAILURE:
      return {
        ...state,
        multidaysShiftsInfo: (state.multidaysShiftsInfo, { loading: false, err: action.error.data, data: undefined }),
      };
    case CLEAR_MULTIDAYS_SHIFT_INFO:
      return {
        ...state,
        multidaysShiftsInfo: {},
      };
    case GET_MULTIDAYS_AVAILABILITY_OF_SPACES:
      return {
        ...state,
        multidaysAvailabilityInfo: (state.multidaysAvailabilityInfo, { loading: true, err: undefined, data: undefined }),
      };
    case GET_MULTIDAYS_AVAILABILITY_OF_SPACES_SUCCESS:
      return {
        ...state,
        multidaysAvailabilityInfo: (state.multidaysAvailabilityInfo, { loading: false, err: undefined, data: action.payload.data }),
        // availabilityResponse: { ...state.availabilityResponse, [state.workSpaceId]: action.payload.data },
      };
    case GET_MULTIDAYS_AVAILABILITY_OF_SPACES_FAILURE:
      return {
        ...state,
        multidaysAvailabilityInfo: (state.multidaysAvailabilityInfo, { loading: false, err: action.error.data, data: undefined }),
        // availabilityResponse: { ...state.availabilityResponse, [state.workSpaceId]: action.error.data },
      };
    case SAVE_MULTIDAYS_BOOKING:
      return {
        ...state,
        multidaysBookingInfo: (state.multidaysBookingInfo, { loading: true, err: undefined, data: undefined }),
      };
    case SAVE_MULTIDAYS_BOOKING_SUCCESS:
      return {
        ...state,
        multidaysBookingInfo: (state.multidaysBookingInfo, { loading: false, err: undefined, data: action.payload.data }),
      };
    case SAVE_MULTIDAYS_BOOKING_FAILURE:
      return {
        ...state,
        multidaysBookingInfo: (state.multidaysBookingInfo, { loading: false, err: action.error.data, data: undefined }),
      };
    case 'RESET_GUEST_UPDATE':
      return {
        ...state,
        updateGuestINFO: (state.updateGuestINFO, { loading: false, data: null, err: null }),
      };
    case 'UPDATE_GUEST':
      return {
        ...state,
        updateGuestINFO: (state.updateGuestINFO, { loading: true }),
        modalWindow: true,
      };
    case 'UPDATE_GUEST_SUCCESS':
      return {
        ...state,
        updateGuestINFO: (state.updateGuestINFO, { loading: false, data: action.payload.data, err: null }),
        modalWindow: true,
      };
    case 'UPDATE_GUEST_FAILURE':
      return {
        ...state,
        updateGuestINFO: (state.updateGuestINFO, { loading: false, err: action.error.data, data: null }),
        modalWindow: true,
      };
    case SAVE_GUEST:
      return {
        ...state,
        guestSaveInfo: (state.guestSaveInfo, { loading: true, err: undefined, data: undefined }),
      };
    case SAVE_GUEST_SUCCESS:
      return {
        ...state,
        guestSaveInfo: (state.guestSaveInfo, { loading: false, err: undefined, data: action.payload.data }),
      };
    case SAVE_GUEST_FAILURE:
      return {
        ...state,
        guestSaveInfo: (state.guestSaveInfo, { loading: false, err: action.error.data, data: undefined }),
      };
    case RESET_GUEST_DATA: {
      return {
        ...state,
        guestSaveInfo: (state.guestSaveInfo, { loading: false, err: undefined, data: undefined }),
      };
    }
    case SAVE_NEW_GUEST: {
      return {
        ...state,
        saveNewGuest: (state.saveNewGuest, action.payload),
      };
    }
    case GET_GUEST_LIST:
      return {
        ...state,
        guestListInfo: (state.guestListInfo, { loading: true, err: undefined, data: undefined }),
      };
    case GET_GUEST_LIST_SUCCESS:
      return {
        ...state,
        guestListInfo: (state.guestListInfo, { loading: false, err: undefined, data: action.payload.data }),
      };
    case GET_GUEST_LIST_FAILURE:
      return {
        ...state,
        guestListInfo: (state.guestListInfo, { loading: false, err: action.error.data, data: undefined }),
      };
    case ADD_GUEST:
      return {
        ...state,
        addGuestInfo: (state.addGuestInfo, { data: action.payload }),
      };
    case SAVE_HOST:
      return {
        ...state,
        saveHostInfo: (state.saveHostInfo, action.payload),
      };
    case CLEAR_MULTIDAYS_AVAILABILITY_OF_SPACES:
      return {
        ...state,
        multidaysAvailabilityInfo: (state.multidaysAvailabilityInfo, { loading: false, err: null, data: null }),
      };
    case GET_EMPLOYEE_SPACE_VALIDITY:
      return {
        ...state,
        capsLimitInfo: (state.capsLimitInfo, { loading: true, err: undefined, data: undefined }),
      };
    case GET_EMPLOYEE_SPACE_VALIDITY_SUCCESS:
      return {
        ...state,
        capsLimitInfo: (state.capsLimitInfo, { loading: false, err: undefined, data: action.payload.data }),
      };
    case GET_EMPLOYEE_SPACE_VALIDITY_FAILURE:
      return {
        ...state,
        capsLimitInfo: (state.capsLimitInfo, { loading: false, err: action.error.data, data: null }),
      };
    case CLEAR_CAP_LIMIT_DATA:
      return {
        ...state,
        capsLimitInfo: {},
      };
    case SAVE_CALENDAR_DATE:
      return {
        ...state,
        calendarDate: (state.calendarDate, action.payload),
      };
    case SAVE_SET_REFRESH:
      return {
        ...state,
        refreshInfo: (state.refreshInfo, action.payload),
      };
    case SAVE_PARTICIPANTS_LIST:
      return {
        ...state,
        savedParticipantsData: (state.savedParticipantsData, action.payload),
      };
    case SAVE_GUEST_LIST:
      return {
        ...state,
        savedGuestData: (state.savedGuestData, action.payload),
      };
    case SAVE_SELECTED_HOST:
      return {
        ...state,
        hostData: (state.hostData, action.payload),
      };
    case DISABLE_FIELDS:
      return {
        ...state,
        disableFields: (state.disableFields, action.payload),
      };
    case 'SET_MAP_EXPANSION':
      return {
        ...state,
        mapExpansionInfo: (state.mapExpansionInfo, action.payload),
      };
    case SAVE_REMOVED_NODE_WITH_EMPLOYEE:
      return {
        ...state,
        removedNodeWithEmployee: (state.removedNodeWithEmployee, action.payload),
      };
    case SAVE_DATA_TO_SPACE_VIEW:
      return {
        ...state,
        savedDataToSpaceView: (state.savedDataToSpaceView, action.payload),
      };
    case CLEAR_SAVE_DATA_TO_SPACE_VIEW:
      return {
        ...state,
        savedDataToSpaceView: [],
      };
    default:
      return state;
  }
}

export default bookingUserReducer;
