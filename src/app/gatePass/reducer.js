/* eslint-disable comma-dangle */
const initialState = {
  gatePassFilters: {},
  gatePasses: {},
  gatePassesExport: {},
  gatePassDetails: {},
  gatePassesCount: null,
  gatePassesCountErr: null,
  gatePassesCountLoading: false,
  gatePassConfig: {},
  gatePassDashboard: {},
  addGatePassInfo: {},
  updateGatePassInfo: {},
  partsSelected: [],
  gatePassAction: {},
  gatePassLoading: false,
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_GATEPASS_COUNT_INFO':
      return {
        ...state,
        gatePassesCount: null,
        gatePassesCountErr: null,
        gatePassesCountLoading: true
      };
    case 'GET_GATEPASS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        gatePassesCountErr: null,
        gatePassesCount: (state.gatePassesCount, action.payload),
        gatePassesCountLoading: false
      };
    case 'GET_GATEPASS_COUNT_INFO_FAILURE':
      return {
        ...state,
        gatePassesCountErr: (state.gatePassesCountErr, action.error),
        gatePassesCount: (state.gatePassesCount, false),
        gatePassesCountLoading: false
      };
    case 'GATEPASS_FILTERS':
      return {
        ...state,
        gatePassFilters: (state.gatePassFilters, action.payload)
      };
    case 'GET_GATEPASS_INFO':
      return {
        ...state,
        gatePasses: (state.gatePasses, { loading: true, data: null, err: null })
      };
    case 'GET_GATEPASS_INFO_SUCCESS':
      return {
        ...state,
        gatePasses: (state.gatePasses, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_GATEPASS_INFO_FAILURE':
      return {
        ...state,
        gatePasses: (state.gatePasses, { loading: false, err: action.error, data: null })
      };
    case 'GET_GATEPASS_EXPORT_LIST_INFO':
      return {
        ...state,
        gatePassesExport: (state.gatePassesExport, { loading: true, data: null, err: null })
      };
    case 'GET_GATEPASS_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        gatePassesExport: (state.gatePassesExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_GATEPASS_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        gatePassesExport: (state.gatePassesExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_GATEPASS_DETAILS_INFO':
      return {
        ...state,
        gatePassDetails: (state.gatePassDetails, { loading: true, data: null, err: null })
      };
    case 'GET_GATEPASS_DETAILS_NO_INFO':
      return {
        ...state,
        gatePassLoading: true
      };
    case 'GET_GATEPASS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        gatePassLoading: false,
        gatePassDetails: (state.gatePassDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_GATEPASS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        gatePassLoading: false,
        gatePassDetails: (state.gatePassDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_GATEPASS_CONFIG_DETAILS_INFO':
      return {
        ...state,
        gatePassConfig: (state.gatePassConfig, { loading: true, data: null, err: null })
      };
    case 'GET_GATEPASS_CONFIG_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        gatePassConfig: (state.gatePassConfig, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_GATEPASS_CONFIG_DETAILS_INFO_FAILURE':
      return {
        ...state,
        gatePassConfig: (state.gatePassConfig, { loading: false, err: action.error, data: null })
      };
    case 'GET_GATEPASS_DASHBOARD_INFO':
      return {
        ...state,
        gatePassDashboard: (state.gatePassDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_GATEPASS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        gatePassDashboard: (state.gatePassDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_GATEPASS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        gatePassDashboard: (state.gatePassDashboard, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_GP_INFO':
      return {
        ...state,
        addGatePassInfo: (state.addGatePassInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_GP_INFO_SUCCESS':
      return {
        ...state,
        addGatePassInfo: (state.addGatePassInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_GP_INFO_FAILURE':
      return {
        ...state,
        addGatePassInfo: (state.addGatePassInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_GP_INFO':
      return {
        ...state,
        addGatePassInfo: (state.addGatePassInfo, { loading: false, err: null, data: null })
      };
    case 'UPDATE_GP_INFO':
      return {
        ...state,
        updateGatePassInfo: (state.updateGatePassInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_GP_INFO_SUCCESS':
      return {
        ...state,
        updateGatePassInfo: (state.updateGatePassInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_GP_INFO_FAILURE':
      return {
        ...state,
        updateGatePassInfo: (state.updateGatePassInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_GP_INFO':
      return {
        ...state,
        updateGatePassInfo: (state.updateGatePassInfo, { loading: false, err: null, data: null })
      };
    case 'GET_ROWS_PARTS_SELECTED':
      return {
        ...state,
        partsSelected: (state.partsSelected, action.payload),
      };
    case 'GET_GP_ACTION_INFO':
      return {
        ...state,
        gatePassAction: (state.gatePassAction, { loading: true, data: null, err: null }),
      };
    case 'GET_GP_ACTION_INFO_SUCCESS':
      return {
        ...state,
        gatePassAction: (state.gatePassAction, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_GP_ACTION_INFO_FAILURE':
      return {
        ...state,
        gatePassAction: (state.gatePassAction, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_GP_ACTION_INFO':
      return {
        ...state,
        gatePassAction: (state.gatePassAction, { loading: false, data: null, err: null }),
      };
    default:
      return state;
  }
}

export default reducer;
