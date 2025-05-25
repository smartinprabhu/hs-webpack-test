/* eslint-disable linebreak-style */
const initialState = {
  auditLogs: {},
  assetGauges: {},
  assetMeters: {},
  equipmentsInfo: {},
  createSpaceInfo: {},
  createBreakdownInfo: {},
  equipmentsDetails: {},
  equipmentsExportInfo: {},
  getFloorsInfo: {},
  equipmentsCount: null,
  equipmentsCountErr: null,
  equipmentsCountLoading: false,
  categoriesInfo: {},
  teamsInfo: {},
  reportedByInfo: {},
  acceptedByInfo: {},
  employeesInfo: {},
  employeeListInfo: {},
  hoursInfo: {},
  partnersInfo: {},
  addAssetInfo: {},
  categoryGroupsInfo: {},
  spaceChilds: {},
  floorChilds: {},
  spaceEquipments: {},
  spaceExportEquipments: {},
  selectedSpace: {},
  stateChangeInfo: {},
  spaceTypesInfo: {},
  spaceSubTypesInfo: {},
  moveAssetInfo: {},
  getSpaceInfo: {},
  assetDashboard: {},
  releatedAssets: {},
  expiryAssets: {},
  equipmentFilters: {
    customFilters: [],
  },
  maintenanceGroups: {},
  maintenanceDueGroups: {},
  assetsCategoryGroups: {},
  assetsTicketGroups: {},
  equipmentRows: {},
  updateEquipment: {},
  updateLocationInfo: {},
  unspscCodes: {},
  unspscOtherCodes: {},
  spaceLineValues: {},
  buildingsInfo: {},
  buildingChilds: {},
  locationImage: {},
  addLocationInfo: {},
  operativeInfo: {},
  loading: true,
  spacesCount: null,
  spacesCountErr: null,
  spacesCountLoading: false,
  gaugesInfo: {},
  metersInfo: {},
  mailActivityLogs: {},
  assetReadings: {},
  assetHistoryCard: {},
  assetReadingsDetail: {},
  dataLines: {},
  readingsLog: {},
  readingsLogCount: null,
  readingsLogCountErr: null,
  readingsLogCountLoading: false,
  readingsLogFilters: {},
  readingsLogExportInfo: {},
  readingsList: {},
  checkList: {},
  teamCategoryInfo: {},
  alarmCategoryInfo: {},
  alarmRecipientsInfo: {},
  alarmActionsInfo: {},
  addReadingInfo: {},
  spaceName: {},
  assetNameInfo: {},
  readingRedirectId: false,
  spacePathList: {},
  vendorGroupsInfo: {},
  bulkImportInitiateInfo: {},
  bulkUploadInfo: {},
  qrCodeImageInfo: {},
  incidentReportInfo: {},
  floorMapEquipments: {},
  buildingSpaces: {},
  auditInfo: {},
  equipmentCategoryInfo: {},
  warrentyAgeInfo: {},
  globalCategories: {},
  allLocationsInfo: {},
  assetMisplacedInfo: {},
  assetAvailabilityInfo: {},
  visitPurposes: {},
  maintenanceGroupsInfo: {},
  sortedValue: {
    sortBy: '',
    sortField: '',
  },
  sortedValueDashboard: {
    sortBy: 'DESC',
    sortField: 'id',
  },
  equipmentSensorsInfo: {},
  equipmentTrendSensorsInfo: {},
  currentThreshold: [],
  spaceThresholds: {},
  currentAssetDate: false,
  aqDashboardConfig: {},
  shiftHandoverFilters: {},
  auditReportFiltersInfo: {},
  availabilityReportFiltersInfo: {},
  misplacedFiltersInfo: {},
  warrantyAgeFilterInfo: {},
  exportInitialData: {},
  locationInfo: {},
  spaceInfo: {},
  locationExportInfo: {},
  locationCount: null,
  locationCountLoading: false,
  locationCountErr: null,
  dropdownLocationInfo: {},
  categoryCountInfo: {},
  assetCategoryInfo: {},
  assetCategoryExportInfo: {},
  assetCategoryCount: null,
  assetCategoryCountErr: null,
  assetCategoryCountLoading: false,
  equipmentCostInfo: {},
  spaceTableCount: null,
  spaceTableCountErr: null,
  spaceTableCountLoading: false,
  spaceTableExportInfo: {},
  spaceTableInfo: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'WARRANTY_AGE_REPORT':
      return {
        ...state,
        warrantyAgeFilterInfo: action.payload,
      };
    case 'MISPLACED_REPORT':
      return {
        ...state,
        misplacedFiltersInfo: action.payload,
      };
    case 'SHIFT_HAND_OVER_REPORT':
      return {
        ...state,
        shiftHandoverFilters: action.payload,
      };
    case 'AUDIT_REPORT':
      return {
        ...state,
        auditReportFiltersInfo: action.payload,
      };
    case 'AVAILABILITY_REPORT':
      return {
        ...state,
        availabilityReportFiltersInfo: action.payload,
      };
    case 'SET_SORTING':
      return {
        ...state,
        sortedValue: action.payload,
      };
    case 'SET_SORTING_DASHBOARD':
      return {
        ...state,
        sortedValueDashboard: action.payload,
      };
    case 'GET_TREE_DATA':
      return {
        ...state,
        allLocationsInfo: (state.allLocationsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TREE_DATA_SUCCESS':
      return {
        ...state,
        allLocationsInfo: (state.allLocationsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TREE_DATA_FAILURE':
      return {
        ...state,
        allLocationsInfo: (state.allLocationsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EQUIPMENTS_INFO':
      return {
        ...state,
        equipmentsInfo: (state.equipmentsInfo, { loading: true }),
      };
    case 'GET_EQUIPMENTS_INFO_SUCCESS':
      return {
        ...state,
        equipmentsInfo: (state.equipmentsInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_EQUIPMENTS_INFO_FAILURE':
      return {
        ...state,
        equipmentsInfo: (state.equipmentsInfo, { loading: false, err: action.error }),
      };
    case 'GET_EQUIPMENTS_EXPORT_INFO':
      return {
        ...state,
        equipmentsExportInfo: (state.equipmentsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EQUIPMENTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        equipmentsExportInfo: (state.equipmentsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EQUIPMENTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        equipmentsExportInfo: (state.equipmentsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EQUIPMENTS_COUNT':
      return {
        ...state,
        equipmentsCountLoading: true,
      };
    case 'GET_EQUIPMENTS_COUNT_SUCCESS':
      return {
        ...state,
        equipmentsCount: (state.equipmentsCount, action.payload),
        equipmentsCountLoading: false,
      };
    case 'GET_EQUIPMENTS_COUNT_FAILURE':
      return {
        ...state,
        equipmentsCountErr: (state.equipmentsCountErr, action.error),
        equipmentsCountLoading: false,
      };
    case 'GET_CATEGORIES_INFO':
      return {
        ...state,
        categoriesInfo: (state.categoriesInfo, { loading: true }),
      };
    case 'GET_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        categoriesInfo: (state.categoriesInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        categoriesInfo: (state.categoriesInfo, { loading: false, err: action.error }),
      };
    case 'GET_SP_INFO':
      return {
        ...state,
        spacePathList: (state.spacePathList, { loading: true }),
      };
    case 'GET_SP_INFO_SUCCESS':
      return {
        ...state,
        spacePathList: (state.spacePathList, { loading: false, data: action.payload.data }),
      };
    case 'GET_SP_INFO_FAILURE':
      return {
        ...state,
        spacePathList: (state.spacePathList, { loading: false, err: action.error }),
      };
    case 'GET_TEAMS_INFO':
      return {
        ...state,
        teamsInfo: (state.teamsInfo, { loading: true }),
      };
    case 'GET_TEAMS_INFO_SUCCESS':
      return {
        ...state,
        teamsInfo: (state.teamsInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_TEAMS_INFO_FAILURE':
      return {
        ...state,
        teamsInfo: (state.teamsInfo, { loading: false, err: action.error }),
      };
    case 'GET_REPORTED_BY_INFO':
      return {
        ...state,
        reportedByInfo: (state.reportedByInfo, { loading: true }),
      };
    case 'GET_REPORTED_BY_INFO_SUCCESS':
      return {
        ...state,
        reportedByInfo: (state.reportedByInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_REPORTED_BY_INFO_FAILURE':
      return {
        ...state,
        reportedByInfo: (state.reportedByInfo, { loading: false, err: action.error }),
      };
    case 'GET_ACCEPTED_BY_INFO':
      return {
        ...state,
        acceptedByInfo: (state.acceptedByInfo, { loading: true }),
      };
    case 'GET_ACCEPTED_BY_INFO_SUCCESS':
      return {
        ...state,
        acceptedByInfo: (state.acceptedByInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_ACCEPTED_BY_INFO_FAILURE':
      return {
        ...state,
        acceptedByInfo: (state.acceptedByInfo, { loading: false, err: action.error }),
      };
    case 'GET_EMPLOYESS_INFO':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: true }),
      };
    case 'GET_EMPLOYESS_INFO_SUCCESS':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_EMPLOYESS_INFO_FAILURE':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: false, err: action.error }),
      };
    case 'CREATE_ASSET_INFO':
      return {
        ...state,
        addAssetInfo: (state.addAssetInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_ASSET_INFO_SUCCESS':
      return {
        ...state,
        addAssetInfo: (state.addAssetInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_ASSET_INFO_FAILURE':
      return {
        ...state,
        addAssetInfo: (state.addAssetInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_LOCATION_INFO':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_LOCATION_INFO_SUCCESS':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_LOCATION_INFO_FAILURE':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_LOCATION_INFO':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_ADD_ASSET_INFO':
      return {
        ...state,
        addAssetInfo: (state.addAssetInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CATEGORIES_GROUP_INFO':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: true }),
      };
    case 'GET_CATEGORIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_CATEGORIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: false, err: action.error }),
      };
    case 'GET_VENDORS_GROUP_INFO':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: true }),
      };
    case 'GET_VENDORS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_VENDORS_GROUP_INFO_FAILURE':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, err: action.error }),
      };
    case 'GET_MAINTENANCE_GROUP_INFO':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_GROUP_INFO_FAILURE':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSET_DETAILS':
      return {
        ...state,
        equipmentsDetails: (state.equipmentsDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_DETAILS_SUCCESS':
      return {
        ...state,
        equipmentsDetails: (state.equipmentsDetails,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_DETAILS_FAILURE':
      return {
        ...state,
        equipmentsDetails: (state.equipmentsDetails,
        { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ASSET_DETAILS':
      return {
        ...state,
        equipmentsDetails: (state.equipmentsDetails, { loading: false, data: null, err: null }),
      };
    case 'GET_SPACE_CHILDS':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_CHILDS_SUCCESS':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_CHILDS_FAILURE':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FLOOR_CHILDS':
      return {
        ...state,
        floorChilds: (state.floorChilds, { loading: true, data: null, err: null }),
      };
    case 'GET_FLOOR_CHILDS_SUCCESS':
      return {
        ...state,
        floorChilds: (state.floorChilds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_FLOOR_CHILDS_FAILURE':
      return {
        ...state,
        floorChilds: (state.floorChilds, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FLOORS_INFO':
      return {
        ...state,
        getFloorsInfo: (state.getFloorsInfo, { loading: true }),
      };
    case 'GET_FLOORS_INFO_SUCCESS':
      return {
        ...state,
        getFloorsInfo: (state.getFloorsInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_FLOORS_INFO_FAILURE':
      return {
        ...state,
        getFloorsInfo: (state.getFloorsInfo, { loading: false, err: action.error }),
      };
    case 'GET_SPACE_INFO':
      return {
        ...state,
        getSpaceInfo: (state.getSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_INFO_SUCCESS':
      return {
        ...state,
        getSpaceInfo: (state.getSpaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_INFO_FAILURE':
      return {
        ...state,
        getSpaceInfo: (state.getSpaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SPACE_INFO':
      return {
        ...state,
        getSpaceInfo: (state.getSpaceInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SPACE_NAME':
      return {
        ...state,
        spaceName: (state.spaceName, { loading: true }),
      };
    case 'GET_SPACE_NAME_SUCCESS':
      return {
        ...state,
        spaceName: (state.spaceName, { loading: false, data: action.payload.data }),
      };
    case 'GET_SPACE_NAME_FAILURE':
      return {
        ...state,
        spaceName: (state.spaceName, { loading: false, err: action.error }),
      };
    case 'GET_ASSET_NAME':
      return {
        ...state,
        assetNameInfo: (state.assetNameInfo, { loading: true }),
      };
    case 'GET_ASSET_NAME_SUCCESS':
      return {
        ...state,
        assetNameInfo: (state.assetNameInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_ASSET_NAME_FAILURE':
      return {
        ...state,
        assetNameInfo: (state.assetNameInfo, { loading: false, err: action.error }),
      };
    case 'GET_ASSETS_DASHBOARD_INFO':
      return {
        ...state,
        assetDashboard: (state.assetDashboard, { loading: true }),
      };
    case 'GET_ASSETS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        assetDashboard: (state.assetDashboard, { loading: false, data: action.payload.data }),
      };
    case 'GET_ASSETS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        assetDashboard: (state.assetDashboard, { loading: false, err: action.error }),
      };
    case 'GET_EXPIRY_ASSETS_INFO':
      return {
        ...state,
        expiryAssets: (state.expiryAssets, { loading: true }),
      };
    case 'GET_EXPIRY_ASSETS_INFO_SUCCESS':
      return {
        ...state,
        expiryAssets: (state.expiryAssets, { loading: false, data: action.payload.data }),
      };
    case 'GET_EXPIRY_ASSETS_INFO_FAILURE':
      return {
        ...state,
        expiryAssets: (state.expiryAssets, { loading: false, err: action.error }),
      };
    case 'GET_AUDIT_LOGS_INFO':
      return {
        ...state,
        auditLogs: (state.auditLogs, { loading: true }),
      };
    case 'GET_AUDIT_LOGS_INFO_SUCCESS':
      return {
        ...state,
        auditLogs: (state.auditLogs, { loading: false, data: action.payload.data }),
      };
    case 'GET_AUDIT_LOGS_INFO_FAILURE':
      return {
        ...state,
        auditLogs: (state.auditLogs, { loading: false, err: action.error }),
      };
    case 'GET_RELEATED_ASSETS_INFO':
      return {
        ...state,
        releatedAssets: (state.releatedAssets, { loading: true }),
      };
    case 'GET_RELEATED_ASSETS_INFO_SUCCESS':
      return {
        ...state,
        releatedAssets: (state.releatedAssets, { loading: false, data: action.payload.data }),
      };
    case 'GET_RELEATED_ASSETS_INFO_FAILURE':
      return {
        ...state,
        releatedAssets: (state.releatedAssets, { loading: false, err: action.error }),
      };
    case 'GET_MN_GROUPS_INFO':
      return {
        ...state,
        maintenanceGroups: (state.maintenanceGroups, { loading: true }),
      };
    case 'GET_MN_GROUPS_INFO_SUCCESS':
      return {
        ...state,
        maintenanceGroups: (state.maintenanceGroups, { loading: false, data: action.payload.data }),
      };
    case 'GET_MN_GROUPS_INFO_FAILURE':
      return {
        ...state,
        maintenanceGroups: (state.maintenanceGroups, { loading: false, err: action.error }),
      };
    case 'GET_MN_GROUPS_DUE_INFO':
      return {
        ...state,
        maintenanceDueGroups: (state.maintenanceDueGroups, { loading: true }),
      };
    case 'GET_MN_GROUPS_DUE_INFO_SUCCESS':
      return {
        ...state,
        maintenanceDueGroups: (state.maintenanceDueGroups, { loading: false, data: action.payload.data }),
      };
    case 'GET_MN_GROUPS_DUE_INFO_FAILURE':
      return {
        ...state,
        maintenanceDueGroups: (state.maintenanceDueGroups, { loading: false, err: action.error }),
      };
    case 'GET_SPACE_ASSETS_GROUPS':
      return {
        ...state,
        assetsCategoryGroups: (state.assetsCategoryGroups, { loading: true }),
      };
    case 'GET_SPACE_ASSETS_GROUPS_SUCCESS':
      return {
        ...state,
        assetsCategoryGroups: (state.assetsCategoryGroups, { loading: false, data: action.payload.data }),
      };
    case 'GET_SPACE_ASSETS_GROUPS_FAILURE':
      return {
        ...state,
        assetsCategoryGroups: (state.assetsCategoryGroups, { loading: false, err: action.error }),
      };
    case 'GET_SPACE_EQUIPMENTS':
      return {
        ...state,
        spaceEquipments: (state.spaceEquipments, { loading: true }),
      };
    case 'GET_SPACE_EQUIPMENTS_SUCCESS':
      return {
        ...state,
        spaceEquipments: (state.spaceEquipments, { loading: false, data: action.payload.data }),
      };
    case 'GET_SPACE_EQUIPMENTS_FAILURE':
      return {
        ...state,
        spaceEquipments: (state.spaceEquipments, { loading: false, err: action.error }),
      };

    case 'GET_SPACE_EXPORT_EQUIPMENTS':
      return {
        ...state,
        spaceExportEquipments: (state.spaceExportEquipments, { loading: true }),
      };
    case 'GET_SPACE_EXPORT_EQUIPMENTS_SUCCESS':
      return {
        ...state,
        spaceExportEquipments: (state.spaceExportEquipments, { loading: false, data: action.payload.data }),
      };
    case 'GET_SPACE_EXPORT_EQUIPMENTS_FAILURE':
      return {
        ...state,
        spaceExportEquipments: (state.spaceExportEquipments, { loading: false, err: action.error }),
      };

    case 'RESET_SPACE_EXPORT_EQUIPMENTS':
      return {
        ...state,
        spaceExportEquipments: (state.spaceExportEquipments, { loading: false, err: null, data: null }),
      };

    case 'RESET_SPACE_EQUIPMENTS':
      return {
        ...state,
        spaceEquipments: (state.spaceEquipments, { loading: false, err: null, data: null }),
      };
    case 'GET_SPACE_TICKETS_GROUPS':
      return {
        ...state,
        assetsTicketGroups: (state.assetsTicketGroups, { loading: true }),
      };
    case 'GET_SPACE_TICKETS_GROUPS_SUCCESS':
      return {
        ...state,
        assetsTicketGroups: (state.assetsTicketGroups, { loading: false, data: action.payload.data }),
      };
    case 'GET_SPACE_TICKETS_GROUPS_FAILURE':
      return {
        ...state,
        assetsTicketGroups: (state.assetsTicketGroups, { loading: false, err: action.error }),
      };
    case 'GET_ASSET_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_ASSET_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_GAUGES_INFO':
      return {
        ...state,
        assetGauges: (state.assetGauges, { loading: true, data: null, err: null }),
      };
    case 'GET_GAUGES_INFO_SUCCESS':
      return {
        ...state,
        assetGauges: (state.assetGauges, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_GAUGES_INFO_FAILURE':
      return {
        ...state,
        assetGauges: (state.assetGauges, { loading: false, err: action.error, data: null }),
      };
    case 'GET_READINGS_INFO':
      return {
        ...state,
        assetReadings: (state.assetReadings, { loading: true, data: null, err: null }),
      };
    case 'GET_READINGS_INFO_SUCCESS':
      return {
        ...state,
        assetReadings: (state.assetReadings, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_READINGS_INFO_FAILURE':
      return {
        ...state,
        assetReadings: (state.assetReadings, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ASSET_READINGS':
      return {
        ...state,
        assetReadings: (state.assetReadings, { loading: false, err: null, data: null }),
      };
    case 'GET_HISTORY_CARD_INFO':
      return {
        ...state,
        assetHistoryCard: (state.assetHistoryCard, { loading: true, data: null, err: null }),
      };
    case 'GET_HISTORY_CARD_INFO_SUCCESS':
      return {
        ...state,
        assetHistoryCard: (state.assetHistoryCard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HISTORY_CARD_INFO_FAILURE':
      return {
        ...state,
        assetHistoryCard: (state.assetHistoryCard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_READINGS_DETAIL_INFO':
      return {
        ...state,
        assetReadingsDetail: (state.assetReadingsDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_READINGS_DETAIL_INFO_SUCCESS':
      return {
        ...state,
        assetReadingsDetail: (state.assetReadingsDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_READINGS_DETAIL_INFO_FAILURE':
      return {
        ...state,
        assetReadingsDetail: (state.assetReadingsDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DATALINE_INFO':
      return {
        ...state,
        dataLines: (state.dataLines, { loading: true, data: null, err: null }),
      };
    case 'GET_DATALINE_INFO_SUCCESS':
      return {
        ...state,
        dataLines: (state.dataLines, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DATALINE_INFO_FAILURE':
      return {
        ...state,
        dataLines: (state.dataLines, { loading: false, err: action.error, data: null }),
      };
    case 'GET_READINGS_LOG_INFO':
      return {
        ...state,
        readingsLog: (state.readingsLog, { loading: true, data: null, err: null }),
      };
    case 'GET_READINGS_LOG_INFO_SUCCESS':
      return {
        ...state,
        readingsLog: (state.readingsLog, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_READINGS_LOG_INFO_FAILURE':
      return {
        ...state,
        readingsLog: (state.readingsLog, { loading: false, err: action.error, data: null }),
      };
    case 'GET_READINGSLOG_COUNT':
      return {
        ...state,
        readingsLogCountLoading: true,
      };
    case 'GET_READINGSLOG_COUNT_SUCCESS':
      return {
        ...state,
        readingsLogCount: (state.readingsLogCount, action.payload),
        readingsLogCountLoading: false,
      };
    case 'GET_READINGSLOG_COUNT_FAILURE':
      return {
        ...state,
        readingsLogCountErr: (state.readingsLogCountErr, action.error),
        readingsLogCountLoading: false,
      };
    case 'READING_LOG_FILTERS':
      return {
        ...state,
        readingsLogFilters: (state.readingsLogFilters, action.payload),
      };
    case 'GET_READINGSLOG_EXPORT_INFO':
      return {
        ...state,
        readingsLogExportInfo: (state.readingsLogExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_READINGSLOG_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        readingsLogExportInfo: (state.readingsLogExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_READINGSLOG_EXPORT_INFO_FAILURE':
      return {
        ...state,
        readingsLogExportInfo: (state.readingsLogExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_READINGS':
      return {
        ...state,
        readingsList: (state.readingsList, { loading: true, data: null, err: null }),
      };
    case 'GET_READINGS_SUCCESS':
      return {
        ...state,
        readingsList: (state.readingsList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_READINGS_FAILURE':
      return {
        ...state,
        readingsList: (state.readingsList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_METERS_INFO':
      return {
        ...state,
        assetMeters: (state.assetMeters, { loading: true, data: null, err: null }),
      };
    case 'GET_METERS_INFO_SUCCESS':
      return {
        ...state,
        assetMeters: (state.assetMeters, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_METERS_INFO_FAILURE':
      return {
        ...state,
        assetMeters: (state.assetMeters, { loading: false, err: action.error, data: null }),
      };
    case 'EQUIPMENT_FILTERS':
      return {
        ...state,
        equipmentFilters: (state.equipmentFilters, action.payload),
      };
    case 'GET_ROWS_EQUIPMENT':
      return {
        ...state,
        equipmentRows: (state.equipmentRows, action.payload),
      };
    case 'GET_SCRAP_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: null, err: null }),
      };
    case 'STORE_SELECT_SPACE':
      return {
        ...state,
        selectedSpace: (state.selectedSpace, { data: action.payload }),
      };
    case 'RESET_SELECT_SPACE':
      return {
        ...state,
        selectedSpace: (state.selectedSpace, { data: null }),
      };
    case 'STORE_INITIAL_EXPORT_DATA':
      return {
        ...state,
        exportInitialData: (state.exportInitialData, { data: action.payload.data }),
      };
    case 'RESET_INITIAL_EXPORT_DATA':
      return {
        ...state,
        exportInitialData: (state.exportInitialData, { data: null }),
      };
    case 'GET_ASSET_MOVE_INFO':
      return {
        ...state,
        moveAssetInfo: (state.moveAssetInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_MOVE_INFO_SUCCESS':
      return {
        ...state,
        moveAssetInfo: (state.moveAssetInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_MOVE_INFO_FAILURE':
      return {
        ...state,
        moveAssetInfo: (state.moveAssetInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ASSET_MOVE_INFO':
      return {
        ...state,
        moveAssetInfo: (state.moveAssetInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_EQUIPMENT_INFO':
      return {
        ...state,
        updateEquipment: (state.updateEquipment, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_EQUIPMENT_INFO_SUCCESS':
      return {
        ...state,
        updateEquipment: (state.updateEquipment, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_EQUIPMENT_INFO_FAILURE':
      return {
        ...state,
        updateEquipment: (state.updateEquipment, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_EQUIPMENT_INFO':
      return {
        ...state,
        updateEquipment: (state.updateEquipment, { loading: false, err: null, data: null }),
      };
    case 'GET_HOURS_INFO':
      return {
        ...state,
        hoursInfo: (state.hoursInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_HOURS_INFO_SUCCESS':
      return {
        ...state,
        hoursInfo: (state.hoursInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HOURS_INFO_FAILURE':
      return {
        ...state,
        hoursInfo: (state.hoursInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PARTNERS_INFO':
      return {
        ...state,
        partnersInfo: (state.partnersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PARTNERS_INFO_SUCCESS':
      return {
        ...state,
        partnersInfo: (state.partnersInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARTNERS_INFO_FAILURE':
      return {
        ...state,
        partnersInfo: (state.partnersInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_TYPES_INFO':
      return {
        ...state,
        spaceTypesInfo: (state.spaceTypesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_TYPES_INFO_SUCCESS':
      return {
        ...state,
        spaceTypesInfo: (state.spaceTypesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_TYPES_INFO_FAILURE':
      return {
        ...state,
        spaceTypesInfo: (state.spaceTypesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_SUB_TYPES_INFO':
      return {
        ...state,
        spaceSubTypesInfo: (state.spaceSubTypesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_SUB_TYPES_INFO_SUCCESS':
      return {
        ...state,
        spaceSubTypesInfo: (state.spaceSubTypesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_SUB_TYPES_INFO_FAILURE':
      return {
        ...state,
        spaceSubTypesInfo: (state.spaceSubTypesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_SPACE_INFO':
      return {
        ...state,
        createSpaceInfo: (state.createSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SPACE_INFO_SUCCESS':
      return {
        ...state,
        createSpaceInfo: (state.createSpaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SPACE_INFO_FAILURE':
      return {
        ...state,
        createSpaceInfo: (state.createSpaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_SPACE_INFO':
      return {
        ...state,
        createSpaceInfo: (state.createSpaceInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_BREAKDOWN_INFO':
      return {
        ...state,
        createBreakdownInfo: (state.createBreakdownInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_BREAKDOWN_INFO_SUCCESS':
      return {
        ...state,
        createBreakdownInfo: (state.createBreakdownInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_BREAKDOWN_INFO_FAILURE':
      return {
        ...state,
        createBreakdownInfo: (state.createBreakdownInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_BREAKDOWN':
      return {
        ...state,
        createBreakdownInfo: (state.createBreakdownInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ROWS_RESET_INFO':
      return {
        ...state,
        equipmentRows: (state.equipmentRows, {}),
      };
    case 'GET_UNSPSC_INFO':
      return {
        ...state,
        unspscCodes: (state.unspscCodes, { loading: true, data: null, err: null }),
      };
    case 'GET_UNSPSC_INFO_SUCCESS':
      return {
        ...state,
        unspscCodes: (state.unspscCodes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_UNSPSC_INFO_FAILURE':
      return {
        ...state,
        unspscCodes: (state.unspscCodes, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_LOCATION_INFO':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_LOCATION_INFO_SUCCESS':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_LOCATION_INFO_FAILURE':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_LOCATION_INFO':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_UNSPSC_OTHER_INFO':
      return {
        ...state,
        unspscOtherCodes: (state.unspscOtherCodes, { loading: true, data: null, err: null }),
      };
    case 'GET_UNSPSC_OTHER_INFO_SUCCESS':
      return {
        ...state,
        unspscOtherCodes: (state.unspscOtherCodes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_UNSPSC_OTHER_INFO_FAILURE':
      return {
        ...state,
        unspscOtherCodes: (state.unspscOtherCodes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEES_LIST_INFO':
      return {
        ...state,
        employeeListInfo: (state.employeeListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEES_LIST_INFO_SUCCESS':
      return {
        ...state,
        employeeListInfo: (state.employeeListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EMPLOYEES_LIST_INFO_FAILURE':
      return {
        ...state,
        employeeListInfo: (state.employeeListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_LINES_INFO':
      return {
        ...state,
        spaceLineValues: (state.spaceLineValues, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_LINES_INFO_SUCCESS':
      return {
        ...state,
        spaceLineValues: (state.spaceLineValues, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_LINES_INFO_FAILURE':
      return {
        ...state,
        spaceLineValues: (state.spaceLineValues, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BUILDINGS_INFO':
      return {
        ...state,
        buildingsInfo: (state.buildingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BUILDINGS_INFO_SUCCESS':
      return {
        ...state,
        buildingsInfo: (state.buildingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BUILDINGS_INFO_FAILURE':
      return {
        ...state,
        buildingsInfo: (state.buildingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BUILDING_CHILDS':
      return {
        ...state,
        buildingChilds: (state.buildingChilds, { loading: true, data: null, err: null }),
      };
    case 'GET_BUILDING_CHILDS_SUCCESS':
      return {
        ...state,
        buildingChilds: (state.buildingChilds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BUILDING_CHILDS_FAILURE':
      return {
        ...state,
        buildingChilds: (state.buildingChilds, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_IMAGE':
      return {
        ...state,
        locationImage: (state.locationImage, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_IMAGE_SUCCESS':
      return {
        ...state,
        locationImage: (state.locationImage, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_IMAGE_FAILURE':
      return {
        ...state,
        locationImage: (state.locationImage, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_LOCATION_INFO':
      return {
        ...state,
        locationImage: (state.locationImage, { loading: false, err: null, data: null }),
      };
    case 'GET_OPERATIVE_CHANGE_INFO':
      return {
        ...state,
        operativeInfo: (state.operativeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_OPERATIVE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        operativeInfo: (state.operativeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OPERATIVE_CHANGE_FAILURE':
      return {
        ...state,
        operativeInfo: (state.operativeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_OPERATIVE_INFO':
      return {
        ...state,
        operativeInfo: (state.operativeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SPACES_COUNT':
      return {
        ...state,
        spacesCountLoading: true,
      };
    case 'GET_SPACES_COUNT_SUCCESS':
      return {
        ...state,
        spacesCount: (state.spacesCount, action.payload),
        spacesCountLoading: false,
      };
    case 'GET_SPACES_COUNT_FAILURE':
      return {
        ...state,
        spacesCountErr: (state.spacesCountErr, action.error),
        spacesCountLoading: false,
      };
    case 'GET_GAUGES_LIST_INFO':
      return {
        ...state,
        gaugesInfo: (state.gaugesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_GAUGES_LIST_INFO_SUCCESS':
      return {
        ...state,
        gaugesInfo: (state.gaugesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_GAUGES_LIST_INFO_FAILURE':
      return {
        ...state,
        gaugesInfo: (state.gaugesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_METERS_LIST_INFO':
      return {
        ...state,
        metersInfo: (state.metersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_METERS_LIST_INFO_SUCCESS':
      return {
        ...state,
        metersInfo: (state.metersInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_METERS_LIST_INFO_FAILURE':
      return {
        ...state,
        metersInfo: (state.metersInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAIL_ACTIVITIES':
      return {
        ...state,
        mailActivityLogs: (state.mailActivityLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_MAIL_ACTIVITIES_SUCCESS':
      return {
        ...state,
        mailActivityLogs: (state.mailActivityLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAIL_ACTIVITIES_FAILURE':
      return {
        ...state,
        mailActivityLogs: (state.mailActivityLogs, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_INFO':
      return {
        ...state,
        checkList: (state.checkList, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        checkList: (state.checkList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        checkList: (state.checkList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAM_CATEGORY_INFO':
      return {
        ...state,
        teamCategoryInfo: (state.teamCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        teamCategoryInfo: (state.teamCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        teamCategoryInfo: (state.teamCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALARM_CATEGORY_INFO':
      return {
        ...state,
        alarmCategoryInfo: (state.alarmCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARM_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        alarmCategoryInfo: (state.alarmCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARM_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        alarmCategoryInfo: (state.alarmCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALARM_RECIPIENTS_INFO':
      return {
        ...state,
        alarmRecipientsInfo: (state.alarmRecipientsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARM_RECIPIENTS_INFO_SUCCESS':
      return {
        ...state,
        alarmRecipientsInfo: (state.alarmRecipientsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARM_RECIPIENTS_INFO_FAILURE':
      return {
        ...state,
        alarmRecipientsInfo: (state.alarmRecipientsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALARM_ACTIONS_INFO':
      return {
        ...state,
        alarmActionsInfo: (state.alarmActionsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARM_ACTIONS_INFO_SUCCESS':
      return {
        ...state,
        alarmActionsInfo: (state.alarmActionsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARM_ACTIONS_INFO_FAILURE':
      return {
        ...state,
        alarmActionsInfo: (state.alarmActionsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_READING_INFO':
      return {
        ...state,
        addReadingInfo: (state.addReadingInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_READING_INFO_SUCCESS':
      return {
        ...state,
        addReadingInfo: (state.addReadingInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_READING_INFO_FAILURE':
      return {
        ...state,
        addReadingInfo: (state.addReadingInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_READING_INFO':
      return {
        ...state,
        addReadingInfo: (state.addReadingInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_EXPORT':
      return {
        ...state,
        equipmentsExportInfo: (state.equipmentsExportInfo, { loading: false, err: null, data: null }),
      };
    case 'READING_REDIRECT_ID':
      return {
        ...state,
        readingRedirectId: action.payload,
      };
    case 'CREATE_IMPORT_ID_INFO':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_SUCCESS':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_FAILURE':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: true, err: null, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO_SUCCESS':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPLOAD_IMPORT_INFO_FAILURE':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPLOAD_BULK_INFO':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_QR_IMAGE_INFO':
      return {
        ...state,
        qrCodeImageInfo: (state.qrCodeImageInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_QR_IMAGE_INFO_SUCCESS':
      return {
        ...state,
        qrCodeImageInfo: (state.qrCodeImageInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QR_IMAGE_INFO_FAILURE':
      return {
        ...state,
        qrCodeImageInfo: (state.qrCodeImageInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_REPORT_INFO':
      return {
        ...state,
        incidentReportInfo: (state.incidentReportInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_INCIDENT_REPORT_INFO_SUCCESS':
      return {
        ...state,
        incidentReportInfo: (state.incidentReportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_REPORT_INFO_FAILURE':
      return {
        ...state,
        incidentReportInfo: (state.incidentReportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAP_EQUIPMENTS':
      return {
        ...state,
        floorMapEquipments: (state.floorMapEquipments, { loading: true, err: null, data: null }),
      };
    case 'GET_MAP_EQUIPMENTS_SUCCESS':
      return {
        ...state,
        floorMapEquipments: (state.floorMapEquipments, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAP_EQUIPMENTS_FAILURE':
      return {
        ...state,
        floorMapEquipments: (state.floorMapEquipments, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_FLOOR_MAP_EQUIPMENTS':
      return {
        ...state,
        floorMapEquipments: (state.floorMapEquipments, { loading: false, err: null, data: null }),
      };
    case 'GET_ALL_SPACES':
      return {
        ...state,
        buildingSpaces: (state.buildingSpaces, { loading: true, err: null, data: null }),
      };
    case 'GET_ALL_SPACES_SUCCESS':
      return {
        ...state,
        buildingSpaces: (state.buildingSpaces, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALL_SPACES_FAILURE':
      return {
        ...state,
        buildingSpaces: (state.buildingSpaces, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AUDIT_INFO':
      return {
        ...state,
        auditInfo: (state.auditInfo, { loading: true }),
      };
    case 'GET_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        auditInfo: (state.auditInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_AUDIT_INFO_FAILURE':
      return {
        ...state,
        auditInfo: (state.auditInfo, { loading: false, err: action.error }),
      };
    case 'RESET_AUDIT_INFO':
      return {
        ...state,
        auditInfo: (state.auditInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CATEGORY_IMAGE_INFO':
      return {
        ...state,
        equipmentCategoryInfo: (state.equipmentCategoryInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_CATEGORY_IMAGE_INFO_SUCCESS':
      return {
        ...state,
        equipmentCategoryInfo: (state.equipmentCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CATEGORY_IMAGE_INFO_FAILURE':
      return {
        ...state,
        equipmentCategoryInfo: (state.equipmentCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WA_INFO':
      return {
        ...state,
        warrentyAgeInfo: (state.warrentyAgeInfo, { loading: true }),
      };
    case 'GET_WA_INFO_SUCCESS':
      return {
        ...state,
        warrentyAgeInfo: (state.warrentyAgeInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_WA_INFO_FAILURE':
      return {
        ...state,
        warrentyAgeInfo: (state.warrentyAgeInfo, { loading: false, err: action.error }),
      };
    case 'RESET_WO_REPORT':
      return {
        ...state,
        warrentyAgeInfo: (state.warrentyAgeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_GLOBAL_CATEGORIES_INFO':
      return {
        ...state,
        globalCategories: (state.globalCategories, { loading: true, err: null, data: null }),
      };
    case 'GET_GLOBAL_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        globalCategories: (state.globalCategories, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_GLOBAL_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        globalCategories: (state.globalCategories, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_INCIDENT_INFO':
      return {
        ...state,
        incidentReportInfo: (state.incidentReportInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_AVL_INFO':
      return {
        ...state,
        assetAvailabilityInfo: (state.assetAvailabilityInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_AVL_INFO':
      return {
        ...state,
        assetAvailabilityInfo: (state.assetAvailabilityInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_AVL_INFO_SUCCESS':
      return {
        ...state,
        assetAvailabilityInfo: (state.assetAvailabilityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AVL_INFO_FAILURE':
      return {
        ...state,
        assetAvailabilityInfo: (state.assetAvailabilityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_MP_INFO':
      return {
        ...state,
        assetMisplacedInfo: (state.assetMisplacedInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_MP_INFO':
      return {
        ...state,
        assetMisplacedInfo: (state.assetMisplacedInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_MP_INFO_SUCCESS':
      return {
        ...state,
        assetMisplacedInfo: (state.assetMisplacedInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MP_INFO_FAILURE':
      return {
        ...state,
        assetMisplacedInfo: (state.assetMisplacedInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SENSOR_INFO':
      return {
        ...state,
        equipmentSensorsInfo: (state.equipmentSensorsInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_SENSOR_INFO_SUCCESS':
      return {
        ...state,
        equipmentSensorsInfo: (state.equipmentSensorsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SENSOR_INFO_FAILURE':
      return {
        ...state,
        equipmentSensorsInfo: (state.equipmentSensorsInfo, { loading: false, err: true, data: null }),
      };
    case 'GET_SENSOR_TREND_INFO':
      return {
        ...state,
        equipmentTrendSensorsInfo: (state.equipmentTrendSensorsInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_SENSOR_TREND_INFO_SUCCESS':
      return {
        ...state,
        equipmentTrendSensorsInfo: (state.equipmentTrendSensorsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SENSOR_TREND_INFO_FAILURE':
      return {
        ...state,
        equipmentTrendSensorsInfo: (state.equipmentTrendSensorsInfo, { loading: false, err: true, data: null }),
      };
    case 'SET_CURRENT_THRESHOLD':
      return {
        ...state,
        currentThreshold: action.payload,
      };
    case 'GET_THRESHOLDS_DATA_INFO':
      return {
        ...state,
        spaceThresholds: (state.spaceThresholds, { loading: true, data: null, err: null }),
      };
    case 'GET_THRESHOLDS_DATA_INFO_SUCCESS':
      return {
        ...state,
        spaceThresholds: (state.spaceThresholds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_THRESHOLDS_DATA_INFO_FAILURE':
      return {
        ...state,
        spaceThresholds: (state.spaceThresholds, { loading: false, err: action.error, data: null }),
      };
    case 'SET_ASSET_DATE':
      return {
        ...state,
        currentAssetDate: action.payload,
      };
    case 'GET_AQ_CONFIG':
      return {
        ...state,
        aqDashboardConfig: (state.aqDashboardConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_AQ_CONFIG_SUCCESS':
      return {
        ...state,
        aqDashboardConfig: (state.aqDashboardConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AQ_CONFIG_FAILURE':
      return {
        ...state,
        aqDashboardConfig: (state.aqDashboardConfig, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VP_INFO':
      return {
        ...state,
        visitPurposes: (state.visitPurposes, { loading: true, err: null, data: null }),
      };
    case 'GET_VP_INFO_SUCCESS':
      return {
        ...state,
        visitPurposes: (state.visitPurposes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VP_INFO_FAILURE':
      return {
        ...state,
        visitPurposes: (state.visitPurposes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_DATA_COUNT_INFO':
      return {
        ...state,
        locationCountLoading: true,
      };
    case 'GET_LOCATION_DATA_COUNT_INFO_SUCCESS':
      return {
        ...state,
        locationCount: (state.locationCount, action.payload),
        locationCountLoading: false,
      };
    case 'GET_LOCATION_DATA_COUNT_INFO_FAILURE':
      return {
        ...state,
        locationCountErr: (state.locationCountErr, action.error),
        locationCountLoading: false,
      };
    case 'GET_LOCATION_DATA_INFO':
      return {
        ...state,
        locationInfo: (state.locationInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_DATA_INFO_SUCCESS':
      return {
        ...state,
        locationInfo: (state.locationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_DATA_INFO_FAILURE':
      return {
        ...state,
        locationInfo: (state.locationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_DROP_INFO':
      return {
        ...state,
        dropdownLocationInfo: (state.dropdownLocationInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_DROP_INFO_SUCCESS':
      return {
        ...state,
        dropdownLocationInfo: (state.dropdownLocationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_DROP_INFO_FAILURE':
      return {
        ...state,
        dropdownLocationInfo: (state.dropdownLocationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_DATA_EXPORT_INFO':
      return {
        ...state,
        locationExportInfo: (state.locationExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_DATA_EXPORT_SUCCESS':
      return {
        ...state,
        locationExportInfo: (state.locationExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_DATA_EXPORT_FAILURE':
      return {
        ...state,
        locationExportInfo: (state.locationExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACES_INFO':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACES_INFO_SUCCESS':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACES_INFO_FAILURE':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CATEGORIES_COUNT':
      return {
        ...state,
        categoryCountErr: null,
        categoryCountLoading: true,
      };
    case 'GET_CATEGORIES_COUNT_SUCCESS':
      return {
        ...state,
        categoryCountErr: null,
        categoryCountInfo: (state.categoryCountInfo, action.payload),
        categoryCountLoading: false,
      };
    case 'GET_CATEGORIES_COUNT_FAILURE':
      return {
        ...state,
        categoryCountErr: (state.categoryCountErr, action.error),
        categoryCountInfo: (state.categoryCountInfo, false),
        categoryCountLoading: false,
      };
    case 'GET_ASSETCAT_INFO':
      return {
        ...state,
        assetCategoryInfo: (state.assetCategoryInfo, { loading: true }),
      };
    case 'GET_ASSETCAT_INFO_SUCCESS':
      return {
        ...state,
        assetCategoryInfo: (state.assetCategoryInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_ASSETCAT_INFO_FAILURE':
      return {
        ...state,
        assetCategoryInfo: (state.assetCategoryInfo, { loading: false, err: action.error }),
      };
    case 'GET_ASSETCAT_EXPORT_INFO':
      return {
        ...state,
        assetCategoryExportInfo: (state.assetCategoryExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSETCAT_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        assetCategoryExportInfo: (state.assetCategoryExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSETCAT_EXPORT_INFO_FAILURE':
      return {
        ...state,
        assetCategoryExportInfo: (state.assetCategoryExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSETCAT_COUNT':
      return {
        ...state,
        assetCategoryCountLoading: true,
      };
    case 'GET_ASSETCAT_COUNT_SUCCESS':
      return {
        ...state,
        assetCategoryCount: (state.assetCategoryCount, action.payload),
        assetCategoryCountLoading: false,
      };
    case 'GET_ASSETCAT_COUNT_FAILURE':
      return {
        ...state,
        assetCategoryCountErr: (state.assetCategoryCountErr, action.error),
        assetCategoryCountLoading: false,
      };
    case 'GET_EQUIPMENT_COST_INFO':
      return {
        ...state,
        equipmentCostInfo: (state.equipmentCostInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EQUIPMENT_COST_INFO_SUCCESS':
      return {
        ...state,
        equipmentCostInfo: (state.equipmentCostInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EQUIPMENT_COST_INFO_FAILURE':
      return {
        ...state,
        equipmentCostInfo: (state.equipmentCostInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_TABLE_INFO':
      return {
        ...state,
        spaceTableInfo: (state.spaceTableInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_SPACE_TABLE_INFO_SUCCESS':
      return {
        ...state,
        spaceTableInfo: (state.spaceTableInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_TABLE_INFO_FAILURE':
      return {
        ...state,
        spaceTableInfo: (state.spaceTableInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_TABLE_EXPORT_INFO':
      return {
        ...state,
        spaceTableExportInfo: (state.spaceTableExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_TABLE_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        spaceTableExportInfo: (state.spaceTableExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_TABLE_EXPORT_INFO_FAILURE':
      return {
        ...state,
        spaceTableExportInfo: (state.spaceTableExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_TABLE_COUNT_INFO':
      return {
        ...state,
        spaceTableCount: null,
        spaceTableCountErr: null,
        spaceTableCountLoading: true,
      };
    case 'GET_SPACE_TABLE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        spaceTableCount: (state.spaceTableCount, action.payload),
        spaceTableCountErr: null,
        spaceTableCountLoading: false,
      };
    case 'GET_SPACE_TABLE_COUNT_INFO_FAILURE':
      return {
        ...state,
        spaceTableCount: null,
        spaceTableCountErr: (state.spaceTableCountErr, action.error),
        spaceTableCountLoading: false,
      };
    default:
      return state;
  }
}

export default reducer;
