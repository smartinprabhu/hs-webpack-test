const initialState = {
  companyDetail: {},
  employeesCount: null,
  employeesCountErr: null,
  employeeCountLoading: false,
  employeeFilters: {},
  employeesInfo: {},
  employeeExportInfo: {},
  employeeDetails: {},
  employeeNeighbours: {},
  neighbourSpacesInfo: {},
  updateEmployee: {},
  deleteEmployeeInfo: {},
};
// eslint-disable-next-line default-param-last
function employeeReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_COMPANY_INFO':
      return {
        ...state,
        companyDetail: (state.companyDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        companyDetail: (state.companyDetail,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_COMPANY_INFO_FAILURE':
      return {
        ...state,
        companyDetail: (state.companyDetail,
        {
          loading: false, err: action.error, data: null,
        }),
      };
    case 'GET_EMPLOYEES_COUNT':
      return {
        ...state,
        employeeCountLoading: true,
      };
    case 'GET_EMPLOYEES_COUNT_SUCCESS':
      return {
        ...state,
        employeesCount: (state.employeesCount, action.payload),
        employeeCountLoading: false,
      };
    case 'GET_EMPLOYEES_COUNT_FAILURE':
      return {
        ...state,
        employeesCountErr: (state.employeesCountErr, action.error),
        employeeCountLoading: false,
      };
    case 'EMPLOYEE_FILTERS':
      return {
        ...state,
        employeeFilters: (state.employeeFilters, action.payload),
      };
    case 'GET_EMPLOYEES_EXPORT_INFO':
      return {
        ...state,
        employeeExportInfo: (state.employeeExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEES_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        employeeExportInfo: (state.employeeExportInfo,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_EMPLOYEES_EXPORT_INFO_FAIILURE':
      return {
        ...state,
        employeeExportInfo: (state.employeeExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEES_INFO':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEES_INFO_SUCCESS':
      return {
        ...state,
        employeesInfo: (state.employeesInfo,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_EMPLOYEES_INFO_FAILURE':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEE_DETAILS':
      return {
        ...state,
        employeeDetails: (state.employeeDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEE_DETAILS_SUCCESS':
      return {
        ...state,
        employeeDetails: (state.employeeDetails,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_EMPLOYEE_DETAILS_FAILURE':
      return {
        ...state,
        employeeDetails: (state.employeeDetails,
        {
          loading: false, err: action.error, data: null,
        }),
      };
    case 'GET_NEIGHBOUR_DETAILS':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours, { loading: true, data: null, err: null }),
      };
    case 'GET_NEIGHBOUR_DETAILS_SUCCESS':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_NEIGHBOUR_DETAILS_FAILURE':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours,
        {
          loading: false, err: action.error, data: null,
        }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo,
        {
          loading: true, data: null, err: null,
        }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS_SUCCESS':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS_FAILURE':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo,
        {
          loading: false, err: action.error, data: null,
        }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO':
      return {
        ...state,
        updateEmployee: (state.updateEmployee, { loading: true, data: null, err: null }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO_SUCCESS':
      return {
        ...state,
        updateEmployee: (state.updateEmployee,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO_FAILURE':
      return {
        ...state,
        updateEmployee: (state.updateEmployee,
        {
          loading: false, err: action.error, data: null,
        }),
      };
    case 'RESET_EMPLOYEE_UPDATE':
      return {
        ...state,
        updateEmployee: (state.updateEmployee,
        {
          loading: false, data: null, err: null,
        }),
      };
    case 'RESET_DELETE_EMPLOYEE_INFO':
      return {
        ...state,
        deleteEmployeeInfo: (state.deleteEmployee, { loading: null, data: null, err: null }),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        deleteEmployeeInfo: (state.deleteEmployee, { loading: true, data: null, err: null }),
      };
    case 'DELETE_EMPLOYEE_SUCCESS':
      return {
        ...state,
        deleteEmployeeInfo: (state.deleteEmployee, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_EMPLOYEE_FAILURE':
      return {
        ...state,
        deleteEmployeeInfo: (state.deleteEmployee, { loading: false, data: null, err: action.error.data }),
      };
    default:
      return state;
  }
}

export default employeeReducer;
