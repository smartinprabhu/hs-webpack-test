const initialState = {
  ticketsInfo: {},
  categoryGroupsInfo: {},
  stateGroupsInfo: {},
  stateIncidentGroupsInfo: {},
  priorityGroupsInfo: {},
  ticketDetail: {},
  ticketSlaDetail: {},
  ticketSla1Detail: {},
  ticketSla2Detail: {},
  ticketSla3Detail: {},
  ticketSla4Detail: {},
  ticketSla5Detail: {},
  ticketsCount: null,
  ticketsCountErr: null,
  ticketCountLoading: false,
  spacesInfo: {},
  categoryInfo: {},
  spaceList: {},
  subCategoryInfo: {},
  equipmentInfo: {},
  equipmentInfoReport: {},
  addTicketInfo: {},
  equipmentDocuments: {},
  downloadDocument: {},
  documentCreate: {},
  documentCreateAttach: {},
  helpdeskDashboard: {},
  helpdeskRows: {},
  helpdeskFilter: {},
  ticketsExportInfo: {},
  stateMessageInfo: {},
  spaceCascader: {},
  uploadPhoto: {},
  uploadPhotoForm: {},
  stateChangeInfo: {},
  spaceChilds: {},
  closeTicket: {},
  createMessageInfo: {},
  receipents: {},
  priorityList: {},
  ticketCloseState: {},
  loading: true,
  listDataInfo: {},
  listDataCountInfo: null,
  listDataCountErr: null,
  listDataCountLoading: false,
  listDataMultipleInfo: {},
  listDataMultipleCountInfo: null,
  listDataMultipleCountErr: null,
  listDataMultipleCountLoading: false,
  ticketNames: {},
  updateTicketInfo: {},
  escalateTicketInfo: {},
  ticketOrders: {},
  incidentTypes: {},
  ssoToken: {},
  incidentSeverties: {},
  incidentInjuries: {},
  incidentDamages: {},
  incidentTypeGroups: {},
  deleteAttatchmentInfo: {},
  spaceInfoList: {},
  siteCategoriesInfo: {},
  surveyToken: false,
  incidentsOrderInfo: {},
  maintenanceConfigList: {},
  maintenanceConfigurationData: {},
  helpdeskDashboardData: {},
  activeStep: 0,
  helpdeskTeams: {},
  displayNames: {},
  ticketDetailTab: {},
  maintenanceGroupsInfo: {},
  shareTemplateInfo: {},
  shareTicketInfo: {},
  vendorsCustmonList: {},
  helpdeskReportFilters: {},
  helpdeskDetailReportInfo: {},
  regionsGroupsInfo: {},
  multiDocumentsInfo: {},
  moduleFilters: {},
  cxoConfig: {},
  cxoSections: {},
  cxoSectionTypes: {},
  cxoOpsInfo: {},
  cxoDashboardLevels: [],
  updateMultiInfo: {},
  createMultiInfo: {},
  updateBulkInfo: {},
  createBulkInfo: {},
  createBulkInfoAdd: {},
  cxoCompanies: {},
  onHoldRequestInfo: {},
  onHoldApproval: {},
  statusLogsInfo: {},
  deleteBulkInfo: {},
  energyMetersInfo: {},
  tenantConfig: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_TICKETS_INFO':
      return {
        ...state,
        ticketsInfo: (state.ticketsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKETS_INFO_SUCCESS':
      return {
        ...state,
        ticketsInfo: (state.ticketsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKETS_INFO_FAILURE':
      return {
        ...state,
        ticketsInfo: (state.ticketsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DISPLAY_NAME_INFO':
      return {
        ...state,
        displayNames: (state.displayNames, { loading: true, data: null, err: null }),
      };
    case 'GET_DISPLAY_NAME_INFO_SUCCESS':
      return {
        ...state,
        displayNames: (state.displayNames, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DISPLAY_NAME_INFO_FAILURE':
      return {
        ...state,
        displayNames: (state.displayNames, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TICKETS_COUNT':
      return {
        ...state,
        ticketsCount: null,
        ticketsCountErr: null,
        ticketCountLoading: true,
      };
    case 'GET_TICKETS_COUNT_SUCCESS':
      return {
        ...state,
        ticketsCountErr: null,
        ticketsCount: (state.ticketsCount, action.payload),
        ticketCountLoading: false,
      };
    case 'GET_TICKETS_COUNT_FAILURE':
      return {
        ...state,
        ticketsCount: null,
        ticketsCountErr: (state.ticketsCountErr, action.error),
        ticketCountLoading: false,
      };
    case 'GET_SPACES_INFO':
      return {
        ...state,
        spacesInfo: (state.spacesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACES_INFO_SUCCESS':
      return {
        ...state,
        spacesInfo: (state.spacesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACES_INFO_FAILURE':
      return {
        ...state,
        spacesInfo: (state.spacesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACESLIST_INFO':
      return {
        ...state,
        spaceList: (state.spaceList, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACESLIST_INFO_SUCCESS':
      return {
        ...state,
        spaceList: (state.spaceList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACESLIST_INFO_FAILURE':
      return {
        ...state,
        spaceList: (state.spaceList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CATEGORY_INFO':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SUBCATEGORY_INFO':
      return {
        ...state,
        subCategoryInfo: (state.subCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SUBCATEGORY_INFO_SUCCESS':
      return {
        ...state,
        subCategoryInfo: (state.subCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SUBCATEGORY_INFO_FAILURE':
      return {
        ...state,
        subCategoryInfo: (state.subCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EQUIPMENT_INFO':
      return {
        ...state,
        equipmentInfo: (state.equipmentInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EQUIPMENT_INFO_SUCCESS':
      return {
        ...state,
        equipmentInfo: (state.equipmentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EQUIPMENT_INFO_FAILURE':
      return {
        ...state,
        equipmentInfo: (state.equipmentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EQUIPMENT_INFO_REPORT':
      return {
        ...state,
        equipmentInfoReport: (state.equipmentInfoReport, { loading: true, data: null, err: null }),
      };
    case 'GET_EQUIPMENT_INFO_REPORT_SUCCESS':
      return {
        ...state,
        equipmentInfoReport: (state.equipmentInfoReport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EQUIPMENT_INFO_REPORT_FAILURE':
      return {
        ...state,
        equipmentInfoReport: (state.equipmentInfoReport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACE_SEARCH_INFO':
      return {
        ...state,
        spaceInfoList: (state.spaceInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_SEARCH_INFO_SUCCESS':
      return {
        ...state,
        spaceInfoList: (state.spaceInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_SEARCH_INFO_FAILURE':
      return {
        ...state,
        spaceInfoList: (state.spaceInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_TICKET_INFO':
      return {
        ...state,
        addTicketInfo: (state.addTicketInfo, { loading: true, err: null }),
      };
    case 'CREATE_TICKET_INFO_SUCCESS':
      return {
        ...state,
        addTicketInfo: (state.addTicketInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_TICKET_INFO_FAILURE':
      return {
        ...state,
        addTicketInfo: (state.addTicketInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_TICKET_INFO':
      return {
        ...state,
        addTicketInfo: (state.addTicketInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CATEGORIES_GROUP_INFO':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CATEGORIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CATEGORIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        categoryGroupsInfo: (state.categoryGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SUB_CATEGORIES_GROUP_INFO':
      return {
        ...state,
        subCategoryGroupsInfo: (state.subCategoryGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SUB_CATEGORIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        subCategoryGroupsInfo: (state.subCategoryGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SUB_CATEGORIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        subCategoryGroupsInfo: (state.subCategoryGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATES_GROUP_INFO':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STATES_GROUP_INFO_FAILURE':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_STATES_GROUP_INFO':
      return {
        ...state,
        stateIncidentGroupsInfo: (state.stateIncidentGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_STATES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        stateIncidentGroupsInfo: (state.stateIncidentGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_STATES_GROUP_INFO_FAILURE':
      return {
        ...state,
        stateIncidentGroupsInfo: (state.stateIncidentGroupsInfo, { loading: false, err: action.error, data: null }),
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
    case 'GET_REGION_GROUP_INFO':
      return {
        ...state,
        regionsGroupsInfo: (state.regionsGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_REGION_GROUP_INFO_SUCCESS':
      return {
        ...state,
        regionsGroupsInfo: (state.regionsGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REGION_GROUP_INFO_FAILURE':
      return {
        ...state,
        regionsGroupsInfo: (state.regionsGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TICKET_DETAILS_INFO':
      return {
        ...state,
        ticketDetail: (state.ticketDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKET_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketDetail: (state.ticketDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKET_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketDetail: (state.ticketDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_DETAILS_INFO':
      return {
        ...state,
        ticketSlaDetail: (state.ticketSlaDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSlaDetail: (state.ticketSlaDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSlaDetail: (state.ticketSlaDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA1_DETAILS_INFO':
      return {
        ...state,
        ticketSla1Detail: (state.ticketSla1Detail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA1_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSla1Detail: (state.ticketSla1Detail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA1_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSla1Detail: (state.ticketSla1Detail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA2_DETAILS_INFO':
      return {
        ...state,
        ticketSla2Detail: (state.ticketSla2Detail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA2_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSla2Detail: (state.ticketSla2Detail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA2_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSla2Detail: (state.ticketSla2Detail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA3_DETAILS_INFO':
      return {
        ...state,
        ticketSla3Detail: (state.ticketSla3Detail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA3_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSla3Detail: (state.ticketSla3Detail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA3_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSla3Detail: (state.ticketSla3Detail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA4_DETAILS_INFO':
      return {
        ...state,
        ticketSla4Detail: (state.ticketSla4Detail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA4_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSla4Detail: (state.ticketSla4Detail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA4_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSla4Detail: (state.ticketSla4Detail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA5_DETAILS_INFO':
      return {
        ...state,
        ticketSla5Detail: (state.ticketSla5Detail, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA5_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ticketSla5Detail: (state.ticketSla5Detail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA5_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ticketSla5Detail: (state.ticketSla5Detail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DOCUMENT_INFO':
      return {
        ...state,
        equipmentDocuments: (state.equipmentDocuments, { loading: true, data: null, err: null }),
      };
    case 'GET_DOCUMENT_INFO_SUCCESS':
      return {
        ...state,
        equipmentDocuments: (state.equipmentDocuments, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DOCUMENT_INFO_FAILURE':
      return {
        ...state,
        equipmentDocuments: (state.equipmentDocuments, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_DOCUMENT_INFO':
      return {
        ...state,
        documentCreate: (state.documentCreate, { loading: true, data: null, err: null }),
      };
    case 'CREATE_DOCUMENT_INFO_SUCCESS':
      return {
        ...state,
        documentCreate: (state.documentCreate, { loading: false, data: action.payload.job_id || action.payload, err: null }),
      };
    case 'CREATE_DOCUMENT_INFO_FAILURE':
      return {
        ...state,
        documentCreate: (state.documentCreate, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_DOCUMENTATT_INFO':
      return {
        ...state,
        documentCreateAttach: (state.documentCreateAttach, { loading: true, data: null, err: null }),
      };
    case 'CREATE_DOCUMENTATT_INFO_SUCCESS':
      return {
        ...state,
        documentCreateAttach: (state.documentCreateAttach, { loading: false, data: action.payload.job_id || action.payload, err: null }),
      };
    case 'CREATE_DOCUMENTATT_INFO_FAILURE':
      return {
        ...state,
        documentCreateAttach: (state.documentCreateAttach, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DOCUMENTATT_INFO':
      return {
        ...state,
        documentCreate: (state.documentCreate, { loading: false, err: null, data: null }),
        documentCreateAttach: (state.documentCreateAttach, { loading: false, err: null, data: null }),
      };
    case 'GET_DOWNLOAD_INFO':
      return {
        ...state,
        downloadDocument: (state.downloadDocument, { loading: true, data: null, err: null }),
      };
    case 'GET_DOWNLOAD_INFO_SUCCESS':
      return {
        ...state,
        downloadDocument: (state.downloadDocument, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DOWNLOAD_INFO_FAILURE':
      return {
        ...state,
        downloadDocument: (state.downloadDocument, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TICKETS_DASHBOARD_INFO':
      return {
        ...state,
        helpdeskDashboard: (state.helpdeskDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKETS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        helpdeskDashboard: (state.helpdeskDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKETS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        helpdeskDashboard: (state.helpdeskDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TICKETS_EXPORT_INFO':
      return {
        ...state,
        ticketsExportInfo: (state.ticketsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKETS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        ticketsExportInfo: (state.ticketsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKETS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        ticketsExportInfo: (state.ticketsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FILTER_HELPDESK':
      return {
        ...state,
        helpdeskFilter: (state.helpdeskFilter, action.payload),
      };
    case 'GET_ROWS_HELPDESK':
      return {
        ...state,
        helpdeskRows: (state.helpdeskRows, action.payload),
      };
    case 'GET_UPLOAD_IMAGE':
      return {
        ...state,
        uploadPhoto: (state.uploadPhoto, action.payload),
      };
    case 'GET_UPLOAD_IMAGE_FORM':
      return {
        ...state,
        uploadPhotoForm: (state.uploadPhotoForm, action.payload),
      };
    case 'GET_SPACE_RESET_INFO':
      return {
        ...state,
        spaceCascader: (state.spaceCascader, []),
      };
    case 'GET_IMAGE_RESET_INFO':
      return {
        ...state,
        uploadPhoto: (state.uploadPhoto, {}),
        uploadPhotoForm: (state.uploadPhotoForm, {}),
      };
    case 'GET_CASCADER_INFO':
      return {
        ...state,
        spaceCascader: (state.spaceCascader, action.payload),
      };
    case 'GET_CLOSE_RESET_INFO':
      return {
        ...state,
        closeTicket: (state.closeTicket, { loading: false, data: null, err: null }),
      };
    case 'GET_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, {
          loading: false, data: null, result: null, err: null,
        }),
        escalateTicketInfo: (state.escalateTicketInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_HD_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, {
          loading: true, data: null, result: null, err: null,
        }),
      };
    case 'GET_HD_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, {
          loading: false, data: action.payload.data, result: action.payload, err: null,
        }),
      };
    case 'GET_HD_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, {
          loading: false, err: action.error, result: null, data: null,
        }),
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
    case 'CREATE_CLOSE_TICKET_INFO':
      return {
        ...state,
        closeTicket: (state.closeTicket, { loading: true, err: null }),
      };
    case 'CREATE_CLOSE_TICKET_INFO_SUCCESS':
      return {
        ...state,
        closeTicket: (state.closeTicket, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_CLOSE_TICKET_INFO_FAILURE':
      return {
        ...state,
        closeTicket: (state.closeTicket, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MESSAGE_RESET_INFO':
      return {
        ...state,
        createMessageInfo: (state.createMessageInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_MESSAGE_INFO':
      return {
        ...state,
        createMessageInfo: (state.createMessageInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_MESSAGE_INFO_SUCCESS':
      return {
        ...state,
        createMessageInfo: (state.createMessageInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_MESSAGE_INFO_FAILURE':
      return {
        ...state,
        createMessageInfo: (state.createMessageInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_RECEIPENT_INFO':
      return {
        ...state,
        receipents: (state.receipents, { loading: true, data: null, err: null }),
      };
    case 'GET_RECEIPENT_INFO_SUCCESS':
      return {
        ...state,
        receipents: (state.receipents, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RECEIPENT_INFO_FAILURE':
      return {
        ...state,
        receipents: (state.receipents, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRIORITY_INFO':
      return {
        ...state,
        priorityList: (state.priorityList, { loading: true, data: null, err: null }),
      };
    case 'GET_PRIORITY_INFO_SUCCESS':
      return {
        ...state,
        priorityList: (state.priorityList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRIORITY_INFO_FAILURE':
      return {
        ...state,
        priorityList: (state.priorityList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXTRA_LIST_INFO':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXTRA_LIST_INFO_SUCCESS':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXTRA_LIST_INFO_FAILURE':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXTRA_LIST_MULTIPLE':
      return {
        ...state,
        listDataMultipleInfo: (state.listDataMultipleInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXTRA_LIST_MULTIPLE_SUCCESS':
      return {
        ...state,
        listDataMultipleInfo: (state.listDataMultipleInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXTRA_LIST_MULTIPLE_FAILURE':
      return {
        ...state,
        listDataMultipleInfo: (state.listDataMultipleInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXTRA_LIST':
      return {
        ...state,
        listDataMultipleInfo: (state.listDataMultipleInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_EXTRA_COUNT_INFO':
      return {
        ...state,
        listDataCountLoading: true,
      };
    case 'GET_EXTRA_COUNT_INFO_SUCCESS':
      return {
        ...state,
        listDataCountInfo: (state.listDataCountInfo, action.payload),
        listDataCountLoading: false,
      };
    case 'GET_EXTRA_COUNT_INFO_FAILURE':
      return {
        ...state,
        listDataCountErr: (state.listDataCountErr, action.error),
        listDataCountLoading: false,
      };
    case 'GET_EXTRA_COUNT_MULTIPLE':
      return {
        ...state,
        listDataMultipleCountInfo: (state.listDataMultipleCountInfo, false),
        listDataMultipleCountErr: (state.listDataMultipleCountErr, false),
        listDataMultipleCountLoading: true,
      };
    case 'GET_EXTRA_COUNT_MULTIPLE_SUCCESS':
      return {
        ...state,
        listDataMultipleCountInfo: (state.listDataMultipleCountInfo, action.payload),
        listDataMultipleCountLoading: false,
      };
    case 'GET_EXTRA_COUNT_MULTIPLE_FAILURE':
      return {
        ...state,
        listDataMultipleCountInfo: (state.listDataMultipleCountInfo, false),
        listDataMultipleCountErr: (state.listDataMultipleCountErr, action.error),
        listDataMultipleCountLoading: false,
      };
    case 'GET_TICKET_NAMES_INFO':
      return {
        ...state,
        ticketNames: (state.ticketNames, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKET_NAMES_INFO_SUCCESS':
      return {
        ...state,
        ticketNames: (state.ticketNames, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKET_NAMES_INFO_FAILURE':
      return {
        ...state,
        ticketNames: (state.ticketNames, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TICKET_STATE_INFO':
      return {
        ...state,
        ticketCloseState: (state.ticketCloseState, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKET_STATE_INFO_SUCCESS':
      return {
        ...state,
        ticketCloseState: (state.ticketCloseState, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKET_STATE_INFO_FAILURE':
      return {
        ...state,
        ticketCloseState: (state.ticketCloseState, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_TICKET_INFO':
      return {
        ...state,
        updateTicketInfo: (state.updateTicketInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TICKET_INFO_SUCCESS':
      return {
        ...state,
        updateTicketInfo: (state.updateTicketInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TICKET_INFO_SUCCESS_NEW':
      return {
        ...state,
        updateTicketInfo: (state.updateTicketInfo, { loading: false, data: action.payload.status, err: null }),
        onHoldApproval: (state.onHoldApproval, { loading: false, data: action.payload.status, err: null }),
      };
    case 'UPDATE_TICKET_INFO_FAILURE':
      return {
        ...state,
        updateTicketInfo: (state.updateTicketInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_TICKET_INFO':
      return {
        ...state,
        updateTicketInfo: (state.updateTicketInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_ONHOLD_TICKET_INFO':
      return {
        ...state,
        onHoldApproval: (state.onHoldApproval, { loading: false, err: null, data: null }),
      };
    case 'GET_TICKET_ORDERS_INFO':
      return {
        ...state,
        ticketOrders: (state.ticketOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_TICKET_ORDERS_INFO_SUCCESS':
      return {
        ...state,
        ticketOrders: (state.ticketOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TICKET_ORDERS_INFO_FAILURE':
      return {
        ...state,
        ticketOrders: (state.ticketOrders, { loading: false, err: action.error, data: null }),
      };
    case 'ESCALATE_TICKET_INFO':
      return {
        ...state,
        escalateTicketInfo: (state.escalateTicketInfo, { loading: true, data: null, err: null }),
      };
    case 'ESCALATE_TICKET_INFO_SUCCESS':
      return {
        ...state,
        escalateTicketInfo: (state.escalateTicketInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'ESCALATE_TICKET_INFO_FAILURE':
      return {
        ...state,
        escalateTicketInfo: (state.escalateTicketInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TICKET_DETAILS':
      return {
        ...state,
        ticketDetail: (state.ticketDetail, { loading: null, err: null, data: null }),
      };
    case 'GET_INCIDENT_TYPES_INFO':
      return {
        ...state,
        incidentTypes: (state.incidentTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_TYPES_INFO_SUCCESS':
      return {
        ...state,
        incidentTypes: (state.incidentTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_TYPES_INFO_FAILURE':
      return {
        ...state,
        incidentTypes: (state.incidentTypes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_SEVERITY_INFO':
      return {
        ...state,
        incidentSeverties: (state.incidentSeverties, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_SEVERITY_INFO_SUCCESS':
      return {
        ...state,
        incidentSeverties: (state.incidentSeverties, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_SEVERITY_INFO_FAILURE':
      return {
        ...state,
        incidentSeverties: (state.incidentSeverties, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_INJURIES_INFO':
      return {
        ...state,
        incidentInjuries: (state.incidentInjuries, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_INJURIES_INFO_SUCCESS':
      return {
        ...state,
        incidentInjuries: (state.incidentInjuries, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_INJURIES_INFO_FAILURE':
      return {
        ...state,
        incidentInjuries: (state.incidentInjuries, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_DAMAGES_INFO':
      return {
        ...state,
        incidentDamages: (state.incidentDamages, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_DAMAGES_INFO_SUCCESS':
      return {
        ...state,
        incidentDamages: (state.incidentDamages, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_DAMAGES_INFO_FAILURE':
      return {
        ...state,
        incidentDamages: (state.incidentDamages, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENT_TYPES_GROUP_INFO':
      return {
        ...state,
        incidentTypeGroups: (state.incidentTypeGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_TYPES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        incidentTypeGroups: (state.incidentTypeGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_TYPES_GROUP_INFO_FAILURE':
      return {
        ...state,
        incidentTypeGroups: (state.incidentTypeGroups, { loading: false, err: action.error, data: null }),
      };
    case 'DELETE_ATTATCHMENT_INFO':
      return {
        ...state,
        deleteAttatchmentInfo: (state.deleteAttatchmentInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_ATTATCHMENT_INFO_SUCCESS':
      return {
        ...state,
        deleteAttatchmentInfo: (state.deleteAttatchmentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_ATTATCHMENT_INFO_FAILURE':
      return {
        ...state,
        deleteAttatchmentInfo: (state.deleteAttatchmentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DELETE_ATTATCHMENT_INFO':
      return {
        ...state,
        deleteAttatchmentInfo: (state.deleteAttatchmentInfo, { loading: false, data: null, err: null }),
      };
    case 'STORE_SURVEY_TOKEN':
      return {
        ...state,
        surveyToken: (state.surveyToken, action.payload),
      };
    case 'STORE_SSO_TOKEN':
      return {
        ...state,
        ssoToken: (state.ssoToken, action.payload),
      };
    case 'GET_SITE_CATEGORY_INFO':
      return {
        ...state,
        siteCategoriesInfo: (state.siteCategoriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        siteCategoriesInfo: (state.siteCategoriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        siteCategoriesInfo: (state.siteCategoriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ORDER_FULL_INFO':
      return {
        ...state,
        incidentsOrderInfo: (state.incidentsOrderInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ORDER_FULL_INFO_SUCCESS':
      return {
        ...state,
        incidentsOrderInfo: (state.incidentsOrderInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_ORDER_FULL_INFO_FAILURE':
      return {
        ...state,
        incidentsOrderInfo: (state.incidentsOrderInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAINTENANCE_CONFIG_LIST':
      return {
        ...state,
        maintenanceConfigList: (state.maintenanceConfigList, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_CONFIG_SUCCESS_LIST':
      return {
        ...state,
        maintenanceConfigList: (state.maintenanceConfigList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_CONFIG_FAILURE_LIST':
      return {
        ...state,
        maintenanceConfigList: (state.maintenanceConfigList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAINTENANCE_CONFIGUARATION_INFO':
      return {
        ...state,
        maintenanceConfigurationData: (state.maintenanceConfigurationData, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_CONFIGUARATION_INFO_SUCCESS':
      return {
        ...state,
        maintenanceConfigurationData: (state.maintenanceConfigurationData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_CONFIGUARATION_INFO_FAILURE':
      return {
        ...state,
        maintenanceConfigurationData: (state.maintenanceConfigurationData, { loading: false, err: action.error, data: null }),
      };
    case 'ACTIVE_STEP_INFO':
      return {
        ...state,
        activeStep: (state.activeStep, action.payload),
      };
    case 'GET_HELPDESK_TEAMS_INFO':
      return {
        ...state,
        helpdeskTeams: (state.helpdeskTeams, { loading: true, data: null, err: null }),
      };
    case 'GET_HELPDESK_TEAMS_INFO_SUCCESS':
      return {
        ...state,
        helpdeskTeams: (state.helpdeskTeams, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HELPDESK_TEAMS_INFO_FAILURE':
      return {
        ...state,
        helpdeskTeams: (state.helpdeskTeams, { loading: false, err: action.error, data: null }),
      };
    case 'SET_CURRENT_TICKET_DETAIL_TAB':
      return {
        ...state,
        ticketDetailTab: (state.ticketDetailTab, { data: action.payload }),
      };
    case 'GET_MESSAGE_TEMPLATE_INFO':
      return {
        ...state,
        shareTemplateInfo: (state.shareTemplateInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MESSAGE_TEMPLATE_INFO_SUCCESS':
      return {
        ...state,
        shareTemplateInfo: (state.shareTemplateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MESSAGE_TEMPLATE_INFO_FAILURE':
      return {
        ...state,
        shareTemplateInfo: (state.shareTemplateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_MESSAGE_TEMPLATE_INFO':
      return {
        ...state,
        shareTemplateInfo: (state.shareTemplateInfo, { loading: false, err: null, data: null }),
      };
    case 'SHARE_TICKET_INFO':
      return {
        ...state,
        shareTicketInfo: (state.shareTicketInfo, { loading: true, data: null, err: null }),
      };
    case 'SHARE_TICKET_INFO_SUCCESS':
      return {
        ...state,
        shareTicketInfo: (state.shareTicketInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'SHARE_TICKET_INFO_FAILURE':
      return {
        ...state,
        shareTicketInfo: (state.shareTicketInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SHARE_TICKET_INFO':
      return {
        ...state,
        shareTicketInfo: (state.shareTicketInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_HELPDESK_VENDORS_INFO':
      return {
        ...state,
        vendorsCustmonList: (state.vendorsCustmonList, { loading: true, data: null, err: null }),
      };
    case 'GET_HELPDESK_VENDORS_INFO_SUCCESS':
      return {
        ...state,
        vendorsCustmonList: (state.vendorsCustmonList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HELPDESK_VENDORS_INFO_FAILURE':
      return {
        ...state,
        vendorsCustmonList: (state.vendorsCustmonList, { loading: false, err: action.error, data: null }),
      };
    case 'HELPDESK_REPORT_FILTERS':
      return {
        ...state,
        helpdeskReportFilters: (state.helpdeskReportFilters, action.payload),
      };
    case 'GET_HELPDESK_REPORTS_INFO':
      return {
        ...state,
        helpdeskDetailReportInfo: (state.helpdeskDetailReportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_HELPDESK_REPORTS_INFO_SUCCESS':
      return {
        ...state,
        helpdeskDetailReportInfo: (state.helpdeskDetailReportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HELPDESK_REPORTS_INFO_FAILURE':
      return {
        ...state,
        helpdeskDetailReportInfo: (state.helpdeskDetailReportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_HELPDESK_REPORTS_INFO':
      return {
        ...state,
        helpdeskDetailReportInfo: (state.helpdeskDetailReportInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_MULT_DOCUMENT_INFO':
      return {
        ...state,
        multiDocumentsInfo: (state.multiDocumentsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MULT_DOCUMENT_INFO_SUCCESS':
      return {
        ...state,
        multiDocumentsInfo: (state.multiDocumentsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MULT_DOCUMENT_INFO_FAILURE':
      return {
        ...state,
        multiDocumentsInfo: (state.multiDocumentsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MODEL_FILTERS_INFO':
      return {
        ...state,
        moduleFilters: (state.moduleFilters, { loading: true, data: null, err: null }),
      };
    case 'GET_MODEL_FILTERS_INFO_SUCCESS':
      return {
        ...state,
        moduleFilters: (state.moduleFilters, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MODEL_FILTERS_INFO_FAILURE':
      return {
        ...state,
        moduleFilters: (state.moduleFilters, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CXO_CONFIG_INFO':
      return {
        ...state,
        cxoConfig: (state.cxoConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_CXO_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        cxoConfig: (state.cxoConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CXO_CONFIG_INFO_FAILURE':
      return {
        ...state,
        cxoConfig: (state.cxoConfig, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CXO_SECTIONS_INFO':
      return {
        ...state,
        cxoSections: (state.cxoSections, { loading: true, data: null, err: null }),
      };
    case 'GET_CXO_SECTIONS_INFO_SUCCESS':
      return {
        ...state,
        cxoSections: (state.cxoSections, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CXO_SECTIONS_INFO_FAILURE':
      return {
        ...state,
        cxoSections: (state.cxoSections, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CXO_SECTIONS_TYPES_INFO':
      return {
        ...state,
        cxoSectionTypes: (state.cxoSectionTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_CXO_SECTIONS_TYPES_INFO_SUCCESS':
      return {
        ...state,
        cxoSectionTypes: (state.cxoSectionTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CXO_SECTIONS_TYPES_INFO_FAILURE':
      return {
        ...state,
        cxoSectionTypes: (state.cxoSectionTypes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CXO_OP_TYPES_INFO':
      return {
        ...state,
        cxoOpsInfo: (state.cxoOpsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CXO_OP_TYPES_INFO_SUCCESS':
      return {
        ...state,
        cxoOpsInfo: (state.cxoOpsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CXO_OP_TYPES_INFO_FAILURE':
      return {
        ...state,
        cxoOpsInfo: (state.cxoOpsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_MULTI_MODEL_INFO':
      return {
        ...state,
        updateMultiInfo: (state.updateMultiInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_MULTI_MODEL_INFO_SUCCESS':
      return {
        ...state,
        updateMultiInfo: (state.updateMultiInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_MULTI_MODEL_INFO_FAILURE':
      return {
        ...state,
        updateMultiInfo: (state.updateMultiInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_MULTI_MODEL_INFO':
      return {
        ...state,
        updateMultiInfo: (state.updateMultiInfo, { loading: false, err: null, data: null }),
        createMultiInfo: (state.updateMultiInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_MULTI_MODEL_INFO':
      return {
        ...state,
        createMultiInfo: (state.createMultiInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_MULTI_MODEL_INFO_SUCCESS':
      return {
        ...state,
        createMultiInfo: (state.createMultiInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_MULTI_MODEL_INFO_FAILURE':
      return {
        ...state,
        createMultiInfo: (state.createMultiInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_CXO_DASHBOARD_LEVELS':
      return {
        ...state,
        cxoDashboardLevels: (state.cxoDashboardLevels, action.payload),
      };
    case 'GET_CXO_COMPANIES_INFO':
      return {
        ...state,
        cxoCompanies: (state.cxoCompanies, { loading: true, data: null, err: null }),
      };
    case 'GET_CXO_COMPANIES_INFO_SUCCESS':
      return {
        ...state,
        cxoCompanies: (state.cxoCompanies, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CXO_COMPANIES_INFO_FAILURE':
      return {
        ...state,
        cxoCompanies: (state.cxoCompanies, { loading: false, err: action.error, data: null }),
      };
    case 'GET_OH_REQUEST_INFO':
      return {
        ...state,
        onHoldRequestInfo: (state.onHoldRequestInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_OH_REQUEST_INFO_SUCCESS':
      return {
        ...state,
        onHoldRequestInfo: (state.onHoldRequestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OH_REQUEST_INFO_FAILURE':
      return {
        ...state,
        onHoldRequestInfo: (state.onHoldRequestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_OH_REQUEST_INFO':
      return {
        ...state,
        onHoldRequestInfo: (state.onHoldRequestInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_STATUS_LOGS_INFO':
      return {
        ...state,
        statusLogsInfo: (state.statusLogsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATUS_LOGS_INFO_SUCCESS':
      return {
        ...state,
        statusLogsInfo: (state.statusLogsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STATUS_LOGS_INFO_FAILURE':
      return {
        ...state,
        statusLogsInfo: (state.statusLogsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_BULK_INFO':
      return {
        ...state,
        updateBulkInfo: (state.updateBulkInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_BULK_INFO_SUCCESS':
      return {
        ...state,
        updateBulkInfo: (state.updateBulkInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_BULK_INFO_FAILURE':
      return {
        ...state,
        updateBulkInfo: (state.updateBulkInfo, { loading: false, err: action.error, data: null }),
      };
    case 'DELETE_BULK_INFO':
      return {
        ...state,
        deleteBulkInfo: (state.deleteBulkInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_BULK_INFO_SUCCESS':
      return {
        ...state,
        deleteBulkInfo: (state.deleteBulkInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_BULK_INFO_FAILURE':
      return {
        ...state,
        deleteBulkInfo: (state.deleteBulkInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_BULK_INFO':
      return {
        ...state,
        updateBulkInfo: (state.updateBulkInfo, { loading: false, err: null, data: null }),
        createBulkInfo: (state.createBulkInfo, { loading: false, err: null, data: null }),
        deleteBulkInfo: (state.createBulkInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_BULK_ADD_INFO':
      return {
        ...state,
        createBulkInfoAdd: (state.createBulkInfoAdd, { loading: false, err: null, data: null }),
      };
    case 'CREATE_BULK_INFO':
      return {
        ...state,
        createBulkInfo: (state.createBulkInfo, { loading: true, data: null, err: null }),
        createBulkInfoAdd: (state.createBulkInfoAdd, { loading: true, data: null, err: null }),
      };
    case 'CREATE_BULK_INFO_SUCCESS':
      return {
        ...state,
        createBulkInfo: (state.createBulkInfo, { loading: false, data: action.payload.data, err: null }),
        createBulkInfoAdd: (state.createBulkInfoAdd, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_BULK_INFO_FAILURE':
      return {
        ...state,
        createBulkInfo: (state.createBulkInfo, { loading: false, err: action.error, data: null }),
        createBulkInfoAdd: (state.createBulkInfoAdd, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ENERGY_METERS_INFO':
      return {
        ...state,
        energyMetersInfo: (state.energyMetersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ENERGY_METERS_INFO_SUCCESS':
      return {
        ...state,
        energyMetersInfo: (state.energyMetersInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ENERGY_METERS_INFO_FAILURE':
      return {
        ...state,
        energyMetersInfo: (state.energyMetersInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EGET_TENANT_CONFIGUARATION_INFONERGY_METERS_INFO':
      return {
        ...state,
        tenantConfig: (state.tenantConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_TENANT_CONFIGUARATION_INFO_SUCCESS':
      return {
        ...state,
        tenantConfig: (state.tenantConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TENANT_CONFIGUARATION_INFO_FAILURE':
      return {
        ...state,
        tenantConfig: (state.tenantConfig, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
