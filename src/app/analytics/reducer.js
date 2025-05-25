const initialState = {
  analyticsInfo: {},
  nativeDashboard: {},
  ninjaDashboard: {},
  ninjaDashboardItem: {},
  selectedDashboard: false,
  ninjaDashboardCode: {
    loading: true,
  },
  updateLayoutInfo: {},
  sldInfo: {},
  ninjaDrillCode: {},
  ninjaDashboardDrill: {},
  updateNinjaChartItemInfo: {},
  ninjaChartInfo: {},
  dcDashboardInfo: {},
  treeDashboardInfo: {},
  ninjaDashboardExpandCode: {},
  ninjaDefaultFilters: {},
  sldRouteData: {},
  ninjaCodeCache: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_SLD':
      return {
        ...state,
        sldInfo: (state.sldInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SLD_SUCCESS':
      return {
        ...state,
        sldInfo: (state.sldInfo, { loading: false, err: null, data: action.payload.data }),
      };
    case 'GET_SLD_FAILURE':
      return {
        ...state,
        sldInfo: (state.sldInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ANALYTICS_INFO':
      return {
        ...state,
        analyticsInfo: (state.analyticsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ANALYTICS_INFO_SUCCESS':
      return {
        ...state,
        analyticsInfo: (state.analyticsInfo, { loading: false, err: null, data: action.payload.data }),
      };
    case 'GET_ANALYTICS_INFO_FAILURE':
      return {
        ...state,
        analyticsInfo: (state.analyticsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NATIVE_DASHBOARD_INFO':
      return {
        ...state,
        nativeDashboard: (state.nativeDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_NATIVE_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        nativeDashboard: (state.nativeDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NATIVE_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        nativeDashboard: (state.nativeDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NINJA_DASHBOARD_INFO':
      return {
        ...state,
        ninjaDashboard: (state.ninjaDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboard: (state.ninjaDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_TIMER_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboard: (state.ninjaDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        ninjaDashboard: (state.ninjaDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NINJA_DASHBOARD_ITEM_INFO':
      return {
        ...state,
        ninjaDashboardItem: (state.ninjaDashboardItem, { loading: true, data: null, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_ITEM_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboardItem: (state.ninjaDashboardItem, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_ITEM_INFO_FAILURE':
      return {
        ...state,
        ninjaDashboardItem: (state.ninjaDashboardItem, { loading: false, err: action.error, data: null }),
      };
    case 'STORE_SELECT_DASHBOARD':
      return {
        ...state,
        selectedDashboard: (state.selectedDashboard, action.payload),
      };
    case 'RESET_SELECT_DASHBOARD':
      return {
        ...state,
        selectedDashboard: (state.selectedDashboard, false),
      };
    case 'GET_ND_DETAILS_INFO':
      return {
        ...state,
        ninjaDashboardCode: (state.ninjaDashboardCode, { loading: true, data: null, err: null }),
      };
    case 'GET_ND_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboardCode: { loading: false, data: action.payload.data, err: null },
        ninjaCodeCache: {
          ...state.ninjaCodeCache,
          [action.id]: { data: action.payload.data, timestamp: Date.now() },
        },
      };
    case 'GET_ND_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ninjaDashboardCode: (state.ninjaDashboardCode, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ND_DETAILS_INFO':
      return {
        ...state,
        ninjaDashboardCode: (state.ninjaDashboardCode, { loading: false, data: null, err: null }),
      };
    case 'UPDATE_DASHBOARD_LAYOUT_INFO':
      return {
        ...state,
        updateLayoutInfo: (state.updateLayoutInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_DASHBOARD_LAYOUT_INFO_SUCCESS':
      return {
        ...state,
        updateLayoutInfo: (state.updateLayoutInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_DASHBOARD_LAYOUT_INFO_FAILURE':
      return {
        ...state,
        updateLayoutInfo: (state.updateLayoutInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_DASHBOARD_LAYOUT_INFO':
      return {
        ...state,
        updateLayoutInfo: (state.updateLayoutInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_ND_DRILL_DETAILS_INFO':
      return {
        ...state,
        ninjaDrillCode: (state.ninjaDrillCode, { loading: true, data: null, err: null }),
      };
    case 'GET_ND_DRILL_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ninjaDrillCode: (state.ninjaDrillCode, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ND_DRILL_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ninjaDrillCode: (state.ninjaDrillCode, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NINJA_DASHBOARD_DRILL_INFO':
      return {
        ...state,
        ninjaDashboardDrill: (state.ninjaDashboardDrill, { loading: true, data: null, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_DRILL_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboardDrill: (state.ninjaDashboardDrill, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NINJA_DASHBOARD_DRILL_INFO_FAILURE':
      return {
        ...state,
        ninjaDashboardDrill: (state.ninjaDashboardDrill, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NINJA_DASHBOARD_TIMER_DRILL_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboardDrill: (state.ninjaDashboardDrill, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHART_ITEM_DETAILS_INFO':
      return {
        ...state,
        ninjaChartInfo: (state.ninjaChartInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHART_ITEM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ninjaChartInfo: (state.ninjaChartInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHART_ITEM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ninjaChartInfo: (state.ninjaChartInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_DASHBOARD_ITEM_INFO':
      return {
        ...state,
        updateNinjaChartItemInfo: (state.updateNinjaChartItemInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_DASHBOARD_ITEM_INFO_SUCCESS':
      return {
        ...state,
        updateNinjaChartItemInfo: (state.updateNinjaChartItemInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_DASHBOARD_ITEM_INFO_FAILURE':
      return {
        ...state,
        updateNinjaChartItemInfo: (state.updateNinjaChartItemInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_DASHBOARD_ITEM_INFO':
      return {
        ...state,
        updateNinjaChartItemInfo: (state.updateNinjaChartItemInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_DC_DASHBOARD_INFO':
      return {
        ...state,
        dcDashboardInfo: (state.dcDashboardInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_DC_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        dcDashboardInfo: (state.dcDashboardInfo, { loading: false, err: null, data: action.payload.data }),
      };
    case 'GET_DC_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        dcDashboardInfo: (state.dcDashboardInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TREE_DASHBOARD_DETAILS_INFO':
      return {
        ...state,
        treeDashboardInfo: (state.treeDashboardInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TREE_DASHBOARD_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        treeDashboardInfo: (state.treeDashboardInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TREE_DASHBOARD_DETAILS_INFO_FAILURE':
      return {
        ...state,
        treeDashboardInfo: (state.treeDashboardInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TREE_DASHBOARD_DETAILS_INFO':
      return {
        ...state,
        treeDashboardInfo: (state.treeDashboardInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ND_DETAILS_EXPAND_INFO':
      return {
        ...state,
        ninjaDashboardExpandCode: (state.ninjaDashboardExpandCode, { loading: true, data: null, err: null }),
      };
    case 'GET_ND_DETAILS_EXPAND_INFO_SUCCESS':
      return {
        ...state,
        ninjaDashboardExpandCode: (state.ninjaDashboardExpandCode, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ND_DETAILS_EXPAND_INFO_FAILURE':
      return {
        ...state,
        ninjaDashboardExpandCode: (state.ninjaDashboardExpandCode, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ND_DETAILS_EXPAND_INFO':
      return {
        ...state,
        ninjaDashboardExpandCode: (state.ninjaDashboardExpandCode, { loading: false, data: null, err: null }),
      };
    case 'GET_DEFAULT_FILTERS_INFO':
      return {
        ...state,
        ninjaDefaultFilters: (state.ninjaDefaultFilters, { loading: true, data: null, err: null }),
      };
    case 'GET_DEFAULT_FILTERS_INFO_SUCCESS':
      return {
        ...state,
        ninjaDefaultFilters: (state.ninjaDefaultFilters, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DEFAULT_FILTERS_INFO_FAILURE':
      return {
        ...state,
        ninjaDefaultFilters: (state.ninjaDefaultFilters, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DEFAULT_FILTERS_INFO':
      return {
        ...state,
        ninjaDefaultFilters: (state.ninjaDefaultFilters, { loading: false, data: null, err: null }),
      };
    case 'RESET_NINJA_DASHBOARD_INFO':
      return {
        ...state,
        ninjaDashboard: (state.ninjaDashboard, { loading: false, data: null, err: null }),
      };
    case 'STORE_SLD_DATA':
      return {
        ...state,
        sldRouteData: (state.sldRouteData, action.payload),
      };
    case 'GET_ND_DETAILS_FROM_CACHE':
      return {
        ...state,
        ninjaDashboardCode: { loading: false, data: action.payload.data, err: null },
      };
    default:
      return state;
  }
}

export default reducer;
