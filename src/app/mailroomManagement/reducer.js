const initialState = {
  mailInboundFilters: {},
  mailInbounds: {},
  mailInboundsExport: {},
  mailInboundsCount: null,
  mailInboundsCountErr: null,
  mailInboundsCountLoading: false,
  mailDashboard: {},
  mailOutboundFilters: {},
  mailOutbounds: {},
  mailOutboundsExport: {},
  mailOutboundsCount: null,
  mailOutboundsCountErr: null,
  mailOutboundsCountLoading: false,
  mailOutboundDetail: {},
  mailInboundDetail: {},
  reportMailRoomInfo: {},
  courierInfo: {},
  addCourier: {}
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case 'GET_MAILROOM_INBOUND_COUNT_INFO':
      return {
        ...state,
        mailInboundsCount: null,
        mailInboundsCountErr: null,
        mailInboundsCountLoading: true
      };
    case 'GET_MAILROOM_INBOUND_COUNT_INFO_SUCCESS':
      return {
        ...state,
        mailInboundsCountErr: null,
        mailInboundsCount: (state.mailInboundsCount, action.payload),
        mailInboundsCountLoading: false
      };
    case 'GET_MAILROOM_INBOUND_COUNT_INFO_FAILURE':
      return {
        ...state,
        mailInboundsCountErr: (state.mailInboundsCountErr, action.error),
        mailInboundsCount: (state.mailInboundsCount, false),
        mailInboundsCountLoading: false
      };
    case 'MAIL_INBOUND_FILTERS':
      return {
        ...state,
        mailInboundFilters: (state.mailInboundFilters, action.payload)
      };
    case 'GET_MAILROOM_INBOUND_INFO':
      return {
        ...state,
        mailInbounds: (state.mailInbounds, { loading: true, data: null, err: null })
      };
    case 'GET_MAILROOM_INBOUND_INFO_SUCCESS':
      return {
        ...state,
        mailInbounds: (state.mailInbounds, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAILROOM_INBOUND_INFO_FAILURE':
      return {
        ...state,
        mailInbounds: (state.mailInbounds, { loading: false, err: action.error, data: null })
      };
    case 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO':
      return {
        ...state,
        mailInboundsExport: (state.mailInboundsExport, { loading: true, data: null, err: null })
      };
    case 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        mailInboundsExport: (state.mailInboundsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        mailInboundsExport: (state.mailInboundsExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_MAILROOM_DASHBOARD_INFO':
      return {
        ...state,
        mailDashboard: (state.mailDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_MAILROOM_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        mailDashboard: (state.mailDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAILROOM_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        mailDashboard: (state.mailDashboard, { loading: false, err: action.error, data: null })
      };
    case 'GET_MAILROOM_OUTBOUND_COUNT_INFO':
      return {
        ...state,
        mailOutboundsCount: null,
        mailOutboundsCountErr: null,
        mailOutboundsCountLoading: true
      };
    case 'GET_MAILROOM_OUTBOUND_COUNT_INFO_SUCCESS':
      return {
        ...state,
        mailInboundsCountErr: null,
        mailOutboundsCount: (state.mailOutboundsCount, action.payload),
        mailOutboundsCountLoading: false
      };
    case 'GET_MAILROOM_OUTBOUND_COUNT_INFO_FAILURE':
      return {
        ...state,
        mailOutboundsCountErr: (state.mailOutboundsCountErr, action.error),
        mailOutboundsCount: (state.mailOutboundsCount, false),
        mailOutboundsCountLoading: false
      };
    case 'MAIL_OUTBOUND_FILTERS':
      return {
        ...state,
        mailOutboundFilters: (state.mailOutboundFilters, action.payload)
      };
    case 'GET_MAILROOM_OUTBOUND_INFO':
      return {
        ...state,
        mailOutbounds: (state.mailOutbounds, { loading: true, data: null, err: null })
      };
    case 'GET_MAILROOM_OUTBOUND_INFO_SUCCESS':
      return {
        ...state,
        mailOutbounds: (state.mailOutbounds, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAILROOM_OUTBOUND_INFO_FAILURE':
      return {
        ...state,
        mailOutbounds: (state.mailOutbounds, { loading: false, err: action.error, data: null })
      };
    case 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO':
      return {
        ...state,
        mailOutboundsExport: (state.mailOutboundsExport, { loading: true, data: null, err: null })
      };
    case 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        mailOutboundsExport: (state.mailOutboundsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        mailOutboundsExport: (state.mailOutboundsExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_INBOUND_MAIL_DETAILS_INFO':
      return {
        ...state,
        mailInboundDetail: (state.mailInboundDetail, { loading: true, data: null, err: null })
      };
    case 'GET_INBOUND_MAIL_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        mailInboundDetail: (state.mailInboundDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INBOUND_MAIL_DETAILS_INFO_FAILURE':
      return {
        ...state,
        mailInboundDetail: (state.mailInboundDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_OUTBOUND_MAIL_DETAILS_INFO':
      return {
        ...state,
        mailOutboundDetail: (state.mailOutboundDetail, { loading: true, data: null, err: null })
      };
    case 'GET_OUTBOUND_MAIL_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        mailOutboundDetail: (state.mailOutboundDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OUTBOUND_MAIL_DETAILS_INFO_FAILURE':
      return {
        ...state,
        mailOutboundDetail: (state.mailOutboundDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_REPORT_INFO':
      return {
        ...state,
        reportMailRoomInfo: (state.reportMailRoomInfo, { loading: true })
      };
    case 'GET_REPORT_INFO_SUCCESS':
      return {
        ...state,
        reportMailRoomInfo: (state.reportMailRoomInfo, { loading: false, data: action.payload.data })
      };
    case 'GET_REPORT_INFO_FAILURE':
      return {
        ...state,
        reportMailRoomInfo: (state.reportMailRoomInfo, { loading: false, err: action.error })
      };
    case 'RESET_REPORT_INFO':
      return {
        ...state,
        reportMailRoomInfo: (state.reportMailRoomInfo, { loading: false, err: null, data: null })
      };
    case 'GET_COURIER_INFO':
      return {
        ...state,
        courierInfo: (state.courierInfo, { loading: true, data: null, err: null })
      };
    case 'GET_COURIER_INFO_SUCCESS':
      return {
        ...state,
        courierInfo: (state.courierInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_COURIER_INFO_FAILURE':
      return {
        ...state,
        courierInfo: (state.courierInfo, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_COURIER':
      return {
        ...state,
        addCourier: (state.addCourier, { loading: true, data: null, err: null })
      };
    case 'CREATE_COURIER_SUCCESS':
      return {
        ...state,
        addCourier: (state.addCourier, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_COURIER_FAILURE':
      return {
        ...state,
        addCourier: (state.addCourier, { loading: false, err: action.error, data: null })
      };
    case 'RESET_COURIER_DATA':
      return {
        ...state,
        addCourier: (state.addCourier, { loading: false, err: null, data: null })
      };
    default:
      return state;
  }
}

export default reducer;
