const initialState = {
  ppmInfo: {},
  ppmCount: null,
  ppmCountErr: null,
  ppmCountLoading: false,
  checklistInfo: {},
  checklistCount: null,
  checklistCountErr: null,
  checklistCountLoading: false,
  ppmFilters: {},
  toolsListInfo: {},
  toolsCountLoading: false,
  toolsCount: null,
  toolsCountErr: null,
  partsCount: null,
  partsCountLoading: false,
  partsCountErr: null,
  partsListInfo: {},
  checkListFilters: {
    customFilters: []
  },
  partsFilters: {},
  toolsFilters: {},
  updateToolInfo: {},
  checklistDeleteInfo: {},
  operationDeleteInfo: {},
  operationExportData: {},
  checklistExportData: {},
  toolsExportData: {},
  partsExportData: {},
  operationalFilters: {},
  expensesListInfo: {},
  expensesCount: null,
  expensesCountLoading: false,
  expensesCountErr: null,
  expensesGroupsInfo: {},
  expensesDetailInfo: {},
  expensesTypeInfo: {},
  expensesExportData: {},
  addExpensesInfo: {},
  expensesSubTypeInfo: {},
  bulkImportExpensesInfo: {},
  bulkUploadExpenses: {},
  activestep: 0,
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_PPM_SCHEDULE_COUNT':
      return {
        ...state,
        ppmCountLoading: true,
      };
    case 'GET_PPM_SCHEDULE_COUNT_SUCCESS':
      return {
        ...state,
        ppmCount: (state.ppmCount, action.payload),
        ppmCountLoading: false,
      };
    case 'GET_PPM_SCHEDULE_COUNT_FAILURE':
      return {
        ...state,
        ppmCountErr: (state.ppmCountErr, action.error),
        ppmCountLoading: false,
      };
    case 'GET_CHECKLIST_COUNT':
      return {
        ...state,
        checklistCountLoading: true,
      };
    case 'GET_CHECKLIST_COUNT_SUCCESS':
      return {
        ...state,
        checklistCount: (state.checklistCount, action.payload.data),
        checklistCountLoading: false,
      };
    case 'GET_CHECKLIST_COUNT_FAILURE':
      return {
        ...state,
        checklistCountErr: (state.checklistCountErr, action.error),
        checklistCountLoading: false,
      };
    case 'PPM_FILTERS':
      return {
        ...state,
        ppmFilters: (state.ppmFilters, action.payload),
      };
    case 'GET_PPM_SCHEDULE_INFO':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_SCHEDULE_INFO_SUCCESS':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_SCHEDULE_INFO_FAILURE':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_INFO':
      return {
        ...state,
        checklistInfo: (state.checklistInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        checklistInfo: (state.checklistInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        checklistInfo: (state.checklistInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TOOLS_INFO':
      return {
        ...state,
        toolsListInfo: (state.toolsListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TOOLS_INFO_SUCCESS':
      return {
        ...state,
        toolsListInfo: (state.toolsListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TOOLS_INFO_FAILURE':
      return {
        ...state,
        toolsListInfo: (state.toolsListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TOOLS_COUNT':
      return {
        ...state,
        toolsCountLoading: true,
      };
    case 'GET_TOOLS_COUNT_SUCCESS':
      return {
        ...state,
        toolsCount: (state.toolsCount, action.payload.data),
        toolsCountLoading: false,
      };
    case 'GET_TOOLS_COUNT_FAILURE':
      return {
        ...state,
        toolsCountErr: (state.toolsCountErr, action.error),
        toolsCountLoading: false,
      };
    case 'GET_PARTS_COUNT':
      return {
        ...state,
        partsCountLoading: true,
      };
    case 'GET_PARTS_COUNT_SUCCESS':
      return {
        ...state,
        partsCount: (state.partsCount, action.payload.data),
        partsCountLoading: false,
      };
    case 'GET_PARTS_COUNT_FAILURE':
      return {
        ...state,
        partsCountErr: (state.partsCountErr, action.error),
        partsCountLoading: false,
      };
    case 'GET_PARTS_INFO':
      return {
        ...state,
        partsListInfo: (state.partsListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PARTS_INFO_SUCCESS':
      return {
        ...state,
        partsListInfo: (state.partsListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARTS_INFO_FAILURE':
      return {
        ...state,
        partsListInfo: (state.partsListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_INFO':
      return {
        ...state,
        expensesListInfo: (state.expensesListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_INFO_SUCCESS':
      return {
        ...state,
        expensesListInfo: (state.expensesListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_INFO_FAILURE':
      return {
        ...state,
        expensesListInfo: (state.expensesListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_COUNT':
      return {
        ...state,
        expensesCountLoading: true,
      };
    case 'GET_EXPENSES_COUNT_SUCCESS':
      return {
        ...state,
        expensesCount: (state.expensesCount, action.payload.data),
        expensesCountLoading: false,
      };
    case 'GET_EXPENSES_COUNT_FAILURE':
      return {
        ...state,
        expensesCountErr: (state.expensesCountErr, action.error),
        expensesCountLoading: false,
      };
    case 'CHECKLIST_FILTERS':
      return {
        ...state,
        checkListFilters: (state.checkListFilters, action.payload),
      };
    case 'PARTS_FILTERS':
      return {
        ...state,
        partsFilters: (state.partsFilters, action.payload),
      };
    case 'OPERATIONAL_FILTERS':
      return {
        ...state,
        operationalFilters: (state.operationalFilters, action.payload),
      };
    case 'TOOLS_FILTERS':
      return {
        ...state,
        toolsFilters: (state.toolsFilters, action.payload),
      };
    case 'UPDATE_TOOL_INFO':
      return {
        ...state,
        updateToolInfo: (state.updateToolInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TOOL_INFO_SUCCESS':
      return {
        ...state,
        updateToolInfo: (state.updateToolInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TOOL_INFO_FAILURE':
      return {
        ...state,
        updateToolInfo: (state.updateToolInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_TOOl_INFO':
      return {
        ...state,
        updateToolInfo: (state.updateToolInfo, { loading: false, data: null, err: null }),
      };
    case 'DELETE_CHECKLIST_INFO':
      return {
        ...state,
        checklistDeleteInfo: (state.checklistDeleteInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        checklistDeleteInfo: (state.checklistDeleteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        checklistDeleteInfo: (state.checklistDeleteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DELETE_CHECKLIST_INFO':
      return {
        ...state,
        checklistDeleteInfo: (state.checklistDeleteInfo, { loading: false, data: null, err: null }),
      };
    case 'DELETE_OPERATION_INFO':
      return {
        ...state,
        operationDeleteInfo: (state.operationDeleteInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_OPERATION_INFO_SUCCESS':
      return {
        ...state,
        operationDeleteInfo: (state.operationDeleteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_OPERATION_INFO_FAILURE':
      return {
        ...state,
        operationDeleteInfo: (state.operationDeleteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DELETE_OPERATION_INFO':
      return {
        ...state,
        operationDeleteInfo: (state.operationDeleteInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_OPERATIONS_EXPORT_INFO':
      return {
        ...state,
        operationExportData: (state.operationExportData, { loading: true, data: null, err: null }),
      };
    case 'GET_OPERATIONS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        operationExportData: (state.operationExportData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OPERATIONS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        operationExportData: (state.operationExportData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_EXPORT_INFO':
      return {
        ...state,
        checklistExportData: (state.checklistExportData, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        checklistExportData: (state.checklistExportData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_EXPORT_INFO_FAILURE':
      return {
        ...state,
        checklistExportData: (state.checklistExportData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TOOLS_EXPORT_INFO':
      return {
        ...state,
        toolsExportData: (state.toolsExportData, { loading: true, data: null, err: null }),
      };
    case 'GET_TOOLS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        toolsExportData: (state.toolsExportData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TOOLS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        toolsExportData: (state.toolsExportData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PARTS_EXPORT_INFO':
      return {
        ...state,
        partsExportData: (state.partsExportData, { loading: true, data: null, err: null }),
      };
    case 'GET_PARTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        partsExportData: (state.partsExportData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        partsExportData: (state.partsExportData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_GROUP_INFO':
      return {
        ...state,
        expensesGroupsInfo: (state.expensesGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        expensesGroupsInfo: (state.expensesGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_GROUP_INFO_FAILURE':
      return {
        ...state,
        expensesGroupsInfo: (state.expensesGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_DETAILS_INFO':
      return {
        ...state,
        expensesDetailInfo: (state.expensesDetailInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        expensesDetailInfo: (state.expensesDetailInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_DETAILS_INFO_FAILURE':
      return {
        ...state,
        expensesDetailInfo: (state.expensesDetailInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_TYPE_INFO':
      return {
        ...state,
        expensesTypeInfo: (state.expensesTypeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_TYPE_INFO_SUCCESS':
      return {
        ...state,
        expensesTypeInfo: (state.expensesTypeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_TYPE_INFO_FAILURE':
      return {
        ...state,
        expensesTypeInfo: (state.expensesTypeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_SUB_TYPE_INFO':
      return {
        ...state,
        expensesSubTypeInfo: (state.expensesSubTypeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_SUB_TYPE_INFO_SUCCESS':
      return {
        ...state,
        expensesSubTypeInfo: (state.expensesSubTypeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_SUB_TYPE_INFO_FAILURE':
      return {
        ...state,
        expensesSubTypeInfo: (state.expensesSubTypeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXPENSES_EXPORT_INFO':
      return {
        ...state,
        expensesExportData: (state.expensesExportData, { loading: true, data: null, err: null }),
      };
    case 'GET_EXPENSES_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        expensesExportData: (state.expensesExportData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXPENSES_EXPORT_INFO_FAILURE':
      return {
        ...state,
        expensesExportData: (state.expensesExportData, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_EXPENSES_INFO':
      return {
        ...state,
        addExpensesInfo: (state.addExpensesInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_EXPENSES_INFO_SUCCESS':
      return {
        ...state,
        addExpensesInfo: (state.addExpensesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_EXPENSES_INFO_FAILURE':
      return {
        ...state,
        addExpensesInfo: (state.addExpensesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXPENSES_INFO':
      return {
        ...state,
        addExpensesInfo: (state.addExpensesInfo, { loading: false, data: null, err: null }),
      };
    case 'UPDATE_EXPENSES_INFO':
      return {
        ...state,
        updateExpensesInfo: (state.updateExpensesInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_EXPENSES_INFO_SUCCESS':
      return {
        ...state,
        updateExpensesInfo: (state.updateExpensesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_EXPENSES_INFO_FAILURE':
      return {
        ...state,
        updateExpensesInfo: (state.updateExpensesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXPENSES_UPDATE':
      return {
        ...state,
        updateExpensesInfo: (state.updateExpensesInfo, { loading: false, data: null, err: null }),
      };
    case 'CREATE_IMPORT_ID_INFO':
      return {
        ...state,
        bulkImportExpensesInfo: (state.bulkImportExpensesInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_SUCCESS':
      return {
        ...state,
        bulkImportExpensesInfo: (state.bulkImportExpensesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_FAILURE':
      return {
        ...state,
        bulkImportExpensesInfo: (state.bulkImportExpensesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO':
      return {
        ...state,
        bulkUploadExpenses: (state.bulkUploadExpenses, { loading: true, err: null, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO_SUCCESS':
      return {
        ...state,
        bulkUploadExpenses: (state.bulkUploadExpenses, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPLOAD_IMPORT_INFO_FAILURE':
      return {
        ...state,
        bulkUploadExpenses: (state.bulkUploadExpenses, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPLOAD_BULK_INFO':
      return {
        ...state,
        bulkUploadExpenses: (state.bulkUploadExpenses, { loading: false, err: null, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
