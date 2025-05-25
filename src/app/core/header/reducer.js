/* eslint-disable comma-dangle */
import {
  SWITCH_COMPANY,
  SWITCH_COMPANY_SUCCESS,
  SWITCH_COMPANY_FAILURE,
} from "./actions";

const initialState = {
  switchCompanyInfo: {},
  popoverInfo: {},
  announcementInfo: {},
  viewerInfo: {},
  announcementsInfo: {},
  menuExpand: false,
  userTncInfo: {},
  headerData: {},
};

function reducer(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case SWITCH_COMPANY:
      return {
        ...state,
        switchCompanyInfo:
          (state.switchCompanyInfo, { loading: true, error: null, data: null }),
      };
    case "UPDATE_HEADER_DATA":
      return {
        ...state,
        headerData: (state.headerData, action.payload),
      };
    case SWITCH_COMPANY_SUCCESS:
      return {
        ...state,
        switchCompanyInfo:
          (state.switchCompanyInfo,
          { loading: false, error: null, data: action.payload }),
      };
    case SWITCH_COMPANY_FAILURE:
      return {
        ...state,
        switchCompanyInfo:
          (state.switchCompanyInfo,
          { loading: false, error: action.payload.response, data: null }),
      };
    case "GET_ANNOUNCEMENT_MODAL":
      return {
        ...state,
        popoverInfo: (state.popoverInfo, action.payload),
      };
    case "MARK_AS_READ_MODAL":
      return {
        ...state,
        announcementsInfo: (state.announcementsInfo, action.payload),
      };
    case "GET_ANNOUNCEMENTS_INFO":
      return {
        ...state,
        announcementInfo: (state.announcementInfo, { loading: true }),
      };
    case "GET_ANNOUNCEMENTS_INFO_SUCCESS":
      return {
        ...state,
        announcementInfo:
          (state.announcementInfo,
          { loading: false, data: action.payload.data }),
      };
    case "GET_ANNOUNCEMENTS_INFO_FAILURE":
      return {
        ...state,
        announcementInfo:
          (state.announcementInfo, { loading: false, err: action.error }),
      };
    case "SAVE_VIEWER_INFO":
      return {
        ...state,
        viewerInfo:
          (state.viewerInfo, { loading: true, data: null, err: null }),
      };
    case "SAVE_VIEWER_INFO_SUCCESS":
      return {
        ...state,
        viewerInfo:
          (state.viewerInfo,
          { loading: false, data: action.payload.data, err: null }),
      };
    case "SAVE_VIEWER_INFO_FAILURE":
      return {
        ...state,
        viewerInfo:
          (state.viewerInfo, { loading: false, err: action.error, data: null }),
      };
    case "SAVE_TNC_INFO":
      return {
        ...state,
        userTncInfo:
          (state.userTncInfo, { loading: true, data: null, err: null }),
      };
    case "SAVE_TNC_INFO_SUCCESS":
      return {
        ...state,
        userTncInfo:
          (state.userTncInfo,
          { loading: false, data: action.payload, err: null }),
      };
    case "SAVE_TNC_INFO_FAILURE":
      return {
        ...state,
        userTncInfo:
          (state.userTncInfo,
          { loading: false, err: action.error, data: null }),
      };

    case "SET_MENU_EXPAND":
      return {
        ...state,
        menuExpand: (state.menuExpand, action.payload),
      };
    default:
      return state;
  }
}

export default reducer;
