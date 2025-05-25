/* eslint-disable linebreak-style */
const initialState = {
  attendanceLogs: {},
  attendanceCount: {},
  attendanceExportInfo: {},
  attendanceFiltersInfo: {},
  attendanceReportFiltersInfo: {},
  attendanceDetailsInfo: {},
  createExportInfo: {},
  exportLinkInfo: {},
  attendanceCountLoading: false,
  attendanceCountErr: null,
};
function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_ATTENDANCE_DATA':
      return {
        ...state,
        attendanceLogs: (state.attendanceLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_ATTENDANCE_DATA_SUCCESS':
      return {
        ...state,
        attendanceLogs: (state.attendanceLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ATTENDANCE_DATA_FAILURE':
      return {
        ...state,
        attendanceLogs: (state.attendanceLogs, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ATTENDANCE_COUNT':
      return {
        ...state,
        attendanceCountLoading: true,
      };
    case 'GET_ATTENDANCE_COUNT_SUCCESS':
      return {
        ...state,
        attendanceCount: (state.attendanceCount, action.payload),
        attendanceCountLoading: false,
      };
    case 'GET_ATTENDANCE_COUNT_FAILURE':
      return {
        ...state,
        attendanceCountErr: (state.attendanceCountErr, action.error),
        attendanceCountLoading: false,
      };
    case 'GET_ATTEDANCE_EXPORT':
      return {
        ...state,
        attendanceExportInfo: (state.attendanceExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ATTEDANCE_EXPORT_SUCCESS':
      return {
        ...state,
        attendanceExportInfo: (state.attendanceLogs, { loading: false, data: action.payload.data, err: null }),

      };
    case 'GET_ATTEDANCE_EXPORT_FAILURE':
      return {
        ...state,
        attendanceExportInfo: (state.attendanceExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'ATTENDANCE_FILTERS':
      return {
        ...state,
        attendanceFiltersInfo: (state.attendanceFiltersInfo, action.payload),
      };
    case 'GET_ATTEDANCE_DETAILS':
      return {
        ...state,
        attendanceDetailsInfo: (state.attendanceDetailsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ATTEDANCE_DETAILS_SUCCESS':
      return {
        ...state,
        attendanceDetailsInfo: (state.attendanceDetailsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ATTEDANCE_DETAILS_FAILURE':
      return {
        ...state,
        attendanceDetailsInfo: (state.attendanceDetailsInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CREATE_ATT_EXPORT_INFO':
      return {
        ...state,
        createExportInfo: (state.createExportInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_ATT_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        createExportInfo: (state.createExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_ATT_EXPORT_INFO_FAILURE':
      return {
        ...state,
        createExportInfo: (state.createExportInfo, { loading: false, data: null, err: action.error }),
      };
    case 'RESET_CREATE_ATT_EXPORT_INFO':
      return {
        ...state,
        createExportInfo: (state.createExportInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_EXPORT_LINK_INFO':
      return {
        ...state,
        exportLinkInfo: (state.exportLinkInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPORT_LINK_INFO_SUCCESS':
      return {
        ...state,
        exportLinkInfo: (state.exportLinkInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_EXPORT_LINK_INFO_FAILURE':
      return {
        ...state,
        exportLinkInfo: (state.exportLinkInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXPORT_LINK_INFO':
      return {
        ...state,
        exportLinkInfo: (state.exportLinkInfo, { loading: false, err: null, data: null }),
      };
    case 'ATTENDANCE_REPORT':
      return {
        ...state,
        attendanceReportFiltersInfo: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
