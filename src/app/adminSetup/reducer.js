/* eslint-disable comma-dangle */
const initialState = {
  companyDetail: {},
  siteDetails: {},
  siteExportInfo: {},
  employeesCount: null,
  employeesCountErr: null,
  employeeCountLoading: false,
  employeeFilters: {},
  employeesInfo: {},
  employeeDetails: {},
  employeeNeighbours: {},
  neighbourSpacesInfo: {},
  updateEmployee: {},
  teamCount: null,
  teamCountErr: null,
  teamCountLoading: false,
  teamInfo: {},
  MemberCount: null,
  teamMemberCountErr: null,
  teamMemberCountLoading: false,
  teamMemeberInfo: {},
  shiftCount: null,
  shiftCountErr: null,
  shiftCountLoading: false,
  shiftInfo: {},
  tenantCount: null,
  tenantCountErr: null,
  tenantCountLoading: false,
  tenantInfo: {},
  teamLeaderInfo: {},
  teamCategoryInfo: {},
  workingTimeInfo: {},
  maintenanceCostInfo: {},
  sietInfo: {},
  createTeamInfo: {},
  countriesInfo: {},
  statesInfo: {},
  createSiteInfo: {},
  updateSiteInfo: {},
  createShiftInfo: {},
  createTenantinfo: {},
  createToolsinfo: {},
  createPartsInfo: {},
  productCategoryInfo: {},
  userFilters: {},
  userListInfo: {},
  userCount: null,
  userCountErr: null,
  userCountLoading: false,
  roleGroupsInfo: {},
  createUserInfo: {},
  updateUserInfo: {},
  shiftsInfo: {},
  departmentsInfo: {},
  companyCategoriesInfo: {},
  companySubCategoriesInfo: {},
  currencyInfo: {},
  nomenclatureInfo: {},
  incotermInfo: {},
  updateCompanyInfo: {},
  sitesListInfo: {},
  sitesCount: null,
  sitesCountErr: null,
  sitesCountLoading: false,
  siteFilters: {},
  countryGroupsInfo: {},
  userDetails: {},
  allowCompanies: {},
  tenantDetail: {},
  covidResources: {},
  tenantUpdateInfo: {},
  checklistSelected: {},
  allCountriesInfo: {},
  companyRegisterInfo: {},
  currentWorkingTab: {},
  editTeamInfo: {},
  allowedCompanies: {},
  existsUserCount: {},
  teamDetail: {},
  selectedMembers: {},
  teamSpaces: {},
  memberTeams: {},
  teamsExportInfo: {},
  teamMembersExportInfo: {},
  vpConfig: {},
  shiftsExportInfo: {},
  tenantsExportInfo: {},
  shiftDetail: {},
  updateShiftInfo: {},
  deleteTeamInfo: {},
  updateUserPasswordInfo: {},
  memberDesginations: {},
  userSessionData: {},
  userSessionRemoveInfo: {},
  activeStep: 0,
  checkListData: {},
  teamsFilters: {},
  regionsInfo: {},
  teamMemberFilters: {},
  allCompanyTeams: {},
  userTeams: {},
  updateTeamsInfo: {},
  updateVisitor: {},
  selectedSpaces: {},
  modifiedData: {},
  bulkInspectionInfo: {},
  bulkInspectionExportInfo: {},
  bulkInspectionCount: null,
  bulkInspectionCountErr: null,
  bulkInspectionCountLoading: false,
  archiveInfo: {},
  passwordExistsInfo: {},
  adminPPMList: {},
  adminPPMCount: null,
  adminPPMCountErr: null,
  adminPPMCountLoading: false,
  adminPPMExport: {},
  adminInspectionList: {},
  adminInspectionCount: null,
  adminInspectionCountErr: null,
  adminInspectionCountLoading: false,
  adminInspectionExport: {},
  notificationCountDR: 0,
  inspectionFilters: {
    customFilters: [],
  },
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'UPDATE_TEAMS_INFO':
      return {
        ...state,
        updateTeamsInfo: (state.updateTeamsInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TEAMS_INFO_SUCCESS':
      return {
        ...state,
        updateTeamsInfo: (state.updateTeamsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TEAMS_INFO_FAILURE':
      return {
        ...state,
        updateTeamsInfo: (state.updateTeamsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_TEAMS_INFO_FAILURE':
      return {
        ...state,
        updateTeamsInfo: (state.updateTeamsInfo, { loading: false, err: false, data: null }),
      };
    case 'GET_USER_TEAMS_INFO':
      return {
        ...state,
        userTeams: (state.userTeams, { loading: true, data: null, err: null }),
      };
    case 'GET_USER_TEAMS_INFO_SUCCESS':
      return {
        ...state,
        userTeams: (state.userTeams, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_USER_TEAMS_INFO_FAILURE':
      return {
        ...state,
        userTeams: (state.userTeams, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALL_TEAMS_INFO':
      return {
        ...state,
        allCompanyTeams: (state.allCompanyTeams, { loading: true, data: null, err: null }),
      };
    case 'GET_ALL_TEAMS_INFO_SUCCESS':
      return {
        ...state,
        allCompanyTeams: (state.allCompanyTeams, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALL_TEAMS_INFO_FAILURE':
      return {
        ...state,
        allCompanyTeams: (state.allCompanyTeams, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPANY_INFO':
      return {
        ...state,
        companyDetail: (state.companyDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        companyDetail: (state.companyDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPANY_INFO_FAILURE':
      return {
        ...state,
        companyDetail: (state.companyDetail, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_COMPANY_DETAIL':
      return {
        ...state,
        companyDetail: (state.companyDetail, { loading: false, err: null, data: null }),
      };
    case 'GET_SITE_INFO':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_INFO_SUCCESS':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_INFO_FAILURE':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SITE_INFO':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_TEAM_INFO':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_INFO_SUCCESS':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_INFO_FAILURE':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAM_COUNT':
      return {
        ...state,
        teamCountLoading: true,
      };
    case 'GET_TEAM_COUNT_SUCCESS':
      return {
        ...state,
        teamCount: (state.teamCount, action.payload),
        teamCountLoading: false,
      };
    case 'GET_TEAM_COUNT_FAILURE':
      return {
        ...state,
        teamCountErr: (state.teamCountErr, action.error),
        teamCountLoading: false,
      };
    case 'GET_TEAM_MEMBER_INFO':
      return {
        ...state,
        teamMemberInfo: (state.teamMemberInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_MEMBER_INFO_SUCCESS':
      return {
        ...state,
        teamMemberInfo: (state.teamMemberInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_MEMBER_INFO_FAILURE':
      return {
        ...state,
        teamMemberInfo: (state.teamMemberInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAM_MEMBER_COUNT':
      return {
        ...state,
        teamMemberCountLoading: true,
      };
    case 'GET_TEAM_MEMBER_COUNT_SUCCESS':
      return {
        ...state,
        teamMemberCount: (state.teamMemberCount, action.payload.data),
        teamMemberCountLoading: false,
      };
    case 'GET_TEAM_MEMBER_COUNT_SEARCH_SUCCESS':
      return {
        ...state,
        teamMemberCount: (state.teamMemberCount, action.payload),
        teamMemberCountLoading: false,
      };
    case 'GET_TEAM_MEMBER_COUNT_FAILURE':
      return {
        ...state,
        teamMemberCountErr: (state.teamMemberCountErr, action.error),
        teamMemberCountLoading: false,
      };
    case 'GET_SHIFT_INFO':
      return {
        ...state,
        shiftInfo: (state.shiftInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SHIFT_INFO_SUCCESS':
      return {
        ...state,
        shiftInfo: (state.shiftInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SHIFT_INFO_FAILURE':
      return {
        ...state,
        shiftInfo: (state.shiftInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SHIFT_COUNT':
      return {
        ...state,
        shiftCountLoading: true,
      };
    case 'GET_SHIFT_COUNT_SUCCESS':
      return {
        ...state,
        shiftCount: (state.shiftCount, action.payload.data),
        shiftCountLoading: false,
      };
    case 'GET_SHIFT_COUNT_FAILURE':
      return {
        ...state,
        shiftCountErr: (state.shiftCountErr, action.error),
        shiftCountLoading: false,
      };
    case 'GET_TENANT_INFO':
      return {
        ...state,
        tenantInfo: (state.tenantInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TENANT_INFO_SUCCESS':
      return {
        ...state,
        tenantInfo: (state.tenantInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TENANT_INFO_FAILURE':
      return {
        ...state,
        tenantInfo: (state.tenantInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TENANT_COUNT':
      return {
        ...state,
        tenantCountLoading: true,
      };
    case 'GET_TENANT_COUNT_SUCCESS':
      return {
        ...state,
        tenantCount: (state.tenantCount, action.payload.data),
        tenantCountLoading: false,
      };
    case 'GET_TENANT_COUNT_FAILURE':
      return {
        ...state,
        tenantCountErr: (state.tenantCountErr, action.error),
        tenantCountLoading: false,
      };
    case 'GET_TEAM_LEADER_INFO':
      return {
        ...state,
        teamLeaderInfo: (state.teamLeaderInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_LEADER_INFO_SUCCESS':
      return {
        ...state,
        teamLeaderInfo: (state.teamLeaderInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_LEADER_INFO_FAILURE':
      return {
        ...state,
        teamLeaderInfo: (state.teamLeaderInfo, { loading: false, err: action.error, data: null }),
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
    case 'GET_WORKING_TIME_INFO':
      return {
        ...state,
        workingTimeInfo: (state.workingTimeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WORKING_TIME_INFO_SUCCESS':
      return {
        ...state,
        workingTimeInfo: (state.workingTimeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORKING_TIME_INFO_FAILURE':
      return {
        ...state,
        workingTimeInfo: (state.workingTimeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAINTENANCE_COST_ANALYSIS':
      return {
        ...state,
        maintenanceCostInfo: (state.maintenanceCostInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_COST_ANALYSIS_SUCCESS':
      return {
        ...state,
        maintenanceCostInfo: (state.maintenanceCostInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_COST_ANALYSIS_FAILURE':
      return {
        ...state,
        maintenanceCostInfo: (state.maintenanceCostInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SITES':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITES_SUCCESS':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITES_FAILURE':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEES_COUNT':
      return {
        ...state,
        employeeCountLoading: true,
      };
    case 'GET_EMPLOYEES_COUNT_SUCCESS':
      return {
        ...state,
        employeesCount: (state.employeesCount, action.payload.data),
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
    case 'GET_EMPLOYEES_INFO':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEES_INFO_SUCCESS':
      return {
        ...state,
        employeesInfo: (state.employeesInfo, { loading: false, data: action.payload.data, err: null }),
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
        employeeDetails: (state.employeeDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EMPLOYEE_DETAILS_FAILURE':
      return {
        ...state,
        employeeDetails: (state.employeeDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NEIGHBOUR_DETAILS':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours, { loading: true, data: null, err: null }),
      };
    case 'GET_NEIGHBOUR_DETAILS_SUCCESS':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NEIGHBOUR_DETAILS_FAILURE':
      return {
        ...state,
        employeeNeighbours: (state.employeeNeighbours, { loading: false, err: action.error, data: null }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo, { loading: true, data: null, err: null }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS_SUCCESS':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'LOAD_NEIGHBOUR_DETAILS_FAILURE':
      return {
        ...state,
        neighbourSpacesInfo: (state.neighbourSpacesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO':
      return {
        ...state,
        updateEmployee: (state.updateEmployee, { loading: true, data: null, err: null }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO_SUCCESS':
      return {
        ...state,
        updateEmployee: (state.updateEmployee, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_UPDATE_EMPLOYEE_INFO_FAILURE':
      return {
        ...state,
        updateEmployee: (state.updateEmployee, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EMPLOYEE_UPDATE':
      return {
        ...state,
        updateEmployee: (state.updateEmployee, { loading: false, data: null, err: null }),
      };
    case 'CREATE_TEAM_INFO':
      return {
        ...state,
        createTeamInfo: (state.createTeamInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_TEAM_INFO_SUCCESS':
      return {
        ...state,
        createTeamInfo: (state.createTeamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_TEAM_INFO_FAILURE':
      return {
        ...state,
        createTeamInfo: (state.createTeamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_TEAM_INFO':
      return {
        ...state,
        createTeamInfo: (state.createTeamInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_COUNTRIES_INFO':
      return {
        ...state,
        countriesInfo: (state.countriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COUNTRIES_INFO_SUCCESS':
      return {
        ...state,
        countriesInfo: (state.countriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COUNTRIES_INFO_FAILURE':
      return {
        ...state,
        countriesInfo: (state.countriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATES_INFO':
      return {
        ...state,
        statesInfo: (state.statesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATES_INFO_SUCCESS':
      return {
        ...state,
        statesInfo: (state.statesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STATES_INFO_FAILURE':
      return {
        ...state,
        statesInfo: (state.statesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_SITE_INFO':
      return {
        ...state,
        createSiteInfo: (state.createSiteInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SITE_INFO_SUCCESS':
      return {
        ...state,
        createSiteInfo: (state.createSiteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'RESET_CREATE_SITE_INFO':
      return {
        ...state,
        createSiteInfo: (state.createSiteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_SITE_INFO_FAILURE':
      return {
        ...state,
        createSiteInfo: (state.createSiteInfo, { loading: false, err: null, data: null })
      };
    case 'UPDATE_SITE_INFO':
      return {
        ...state,
        updateSiteInfo: (state.updateSiteInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SITE_INFO_SUCCESS':
      return {
        ...state,
        updateSiteInfo: (state.updateSiteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SITE_INFO_FAILURE':
      return {
        ...state,
        updateSiteInfo: (state.updateSiteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_SITE_INFO':
      return {
        ...state,
        updateSiteInfo: (state.updateSiteInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_SHIFT_INFO':
      return {
        ...state,
        createShiftInfo: (state.createShiftInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SHIFT_INFO_SUCCESS':
      return {
        ...state,
        createShiftInfo: (state.createShiftInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SHIFT_INFO_FAILURE':
      return {
        ...state,
        createShiftInfo: (state.createShiftInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_SHIFT_INFO':
      return {
        ...state,
        createShiftInfo: (state.createShiftInfo, { loading: false, err: null, data: null })
      };
    case 'CREATE_TENANT_INFO':
      return {
        ...state,
        createTenantinfo: (state.createTenantinfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_TENANT_INFO_SUCCESS':
      return {
        ...state,
        createTenantinfo: (state.createTenantinfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_TENANT_INFO_FAILURE':
      return {
        ...state,
        createTenantinfo: (state.createTenantinfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_TENANT_INFO':
      return {
        ...state,
        createTenantinfo: (state.createTenantinfo, { loading: false, err: null, data: null })
      };
    case 'CREATE_TOOLS_INFO':
      return {
        ...state,
        createToolsinfo: (state.createToolsinfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_TOOLS_INFO_SUCCESS':
      return {
        ...state,
        createToolsinfo: (state.createToolsinfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_TOOLS_INFO_FAILURE':
      return {
        ...state,
        createToolsinfo: (state.createToolsinfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_TOOLS_INFO':
      return {
        ...state,
        createToolsinfo: (state.createToolsinfo, { loading: false, err: null, data: null })
      };
    case 'GET_PRODUCT_CATEGORY_INFO':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_PARTS_INFO':
      return {
        ...state,
        createPartsInfo: (state.createPartsInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PARTS_INFO_SUCCESS':
      return {
        ...state,
        createPartsInfo: (state.createPartsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PARTS_INFO_FAILURE':
      return {
        ...state,
        createPartsInfo: (state.createPartsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_PARTS_INFO':
      return {
        ...state,
        createPartsInfo: (state.createPartsInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_USER_LIST_INFO':
      return {
        ...state,
        userListInfo: (state.userListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_USER_LIST_INFO_SUCCESS':
      return {
        ...state,
        userListInfo: (state.userListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_USER_LIST_INFO_FAILURE':
      return {
        ...state,
        userListInfo: (state.userListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_USERS_COUNT':
      return {
        ...state,
        userCountLoading: true,
      };
    case 'GET_USERS_COUNT_SUCCESS':
      return {
        ...state,
        userCount: (state.userCount, action.payload),
        userCountLoading: false,
      };
    case 'GET_USERS_COUNT_FAILURE':
      return {
        ...state,
        userCountErr: (state.userCountErr, action.error),
        userCount: (state.userCount, action.error),
        userCountLoading: false,
      };
    case 'USER_FILTERS':
      return {
        ...state,
        userFilters: (state.userFilters, action.payload),
      };
    case 'GET_ROLES_GROUP_INFO':
      return {
        ...state,
        roleGroupsInfo: (state.roleGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ROLES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        roleGroupsInfo: (state.roleGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ROLES_GROUP_INFO_FAILURE':
      return {
        ...state,
        roleGroupsInfo: (state.roleGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_USER_INFO':
      return {
        ...state,
        createUserInfo: (state.createUserInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_USER_INFO_SUCCESS':
      return {
        ...state,
        createUserInfo: (state.createUserInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_USER_INFO_FAILURE':
      return {
        ...state,
        createUserInfo: (state.createUserInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_USER_INFO':
      return {
        ...state,
        createUserInfo: (state.createUserInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        updateUserInfo: (state.updateUserInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_USER_INFO_SUCCESS':
      return {
        ...state,
        updateUserInfo: (state.updateUserInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_USER_INFO_FAILURE':
      return {
        ...state,
        updateUserInfo: (state.updateUserInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_USER_INFO':
      return {
        ...state,
        updateUserInfo: (state.updateUserInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SHIFTS_INFO':
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SHIFTS_INFO_SUCCESS':
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SHIFTS_INFO_FAILURE':
      return {
        ...state,
        shiftsInfo: (state.shiftsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DEPARTMENTS_INFO':
      return {
        ...state,
        departmentsInfo: (state.departmentsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_DEPARTMENTS_INFO_SUCCESS':
      return {
        ...state,
        departmentsInfo: (state.departmentsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DEPARTMENTS_INFO_FAILURE':
      return {
        ...state,
        departmentsInfo: (state.departmentsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPANY_CATEGORIES_INFO':
      return {
        ...state,
        companyCategoriesInfo: (state.companyCategoriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        companyCategoriesInfo: (state.companyCategoriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPANY_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        companyCategoriesInfo: (state.companyCategoriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPANY_SUBCATEGORIES_INFO':
      return {
        ...state,
        companySubCategoriesInfo: (state.companySubCategoriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_SUBCATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        companySubCategoriesInfo: (state.companySubCategoriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPANY_SUBCATEGORIES_INFO_FAILURE':
      return {
        ...state,
        companySubCategoriesInfo: (state.companySubCategoriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CURRENCY_INFO':
      return {
        ...state,
        currencyInfo: (state.currencyInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CURRENCY_INFO_SUCCESS':
      return {
        ...state,
        currencyInfo: (state.currencyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CURRENCY_INFO_FAILURE':
      return {
        ...state,
        currencyInfo: (state.currencyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCOTERM_INFO':
      return {
        ...state,
        incotermInfo: (state.incotermInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INCOTERM_INFO_SUCCESS':
      return {
        ...state,
        incotermInfo: (state.incotermInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCOTERM_INFO_FAILURE':
      return {
        ...state,
        incotermInfo: (state.incotermInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NOMENCLATURE_INFO':
      return {
        ...state,
        nomenclatureInfo: (state.nomenclatureInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_NOMENCLATURE_INFO_SUCCESS':
      return {
        ...state,
        nomenclatureInfo: (state.nomenclatureInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_NOMENCLATURE_INFO_FAILURE':
      return {
        ...state,
        nomenclatureInfo: (state.nomenclatureInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_COMPANY_INFO':
      return {
        ...state,
        updateCompanyInfo: (state.updateCompanyInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        updateCompanyInfo: (state.updateCompanyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_COMPANY_INFO_FAILURE':
      return {
        ...state,
        updateCompanyInfo: (state.updateCompanyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_COMPANY_INFO':
      return {
        ...state,
        updateCompanyInfo: (state.updateCompanyInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SITES_LIST_INFO':
      return {
        ...state,
        sitesListInfo: (state.sitesListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITES_LIST_INFO_SUCCESS':
      return {
        ...state,
        sitesListInfo: (state.sitesListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITES_LIST_INFO_FAILURE':
      return {
        ...state,
        sitesListInfo: (state.sitesListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SITES_COUNT':
      return {
        ...state,
        sitesCountLoading: true,
      };
    case 'GET_SITES_COUNT_SUCCESS':
      return {
        ...state,
        sitesCount: (state.sitesCount, action.payload),
        sitesCountLoading: false,
      };
    case 'GET_SITES_COUNT_FAILURE':
      return {
        ...state,
        sitesCountErr: (state.sitesCountErr, action.error),
        sitesCount: (state.userCsitesCountount, action.error),
        sitesCountLoading: false,
      };
    case 'SITE_FILTERS':
      return {
        ...state,
        siteFilters: (state.siteFilters, action.payload),
      };
    case 'GET_COUNTRIES_GROUP_INFO':
      return {
        ...state,
        countryGroupsInfo: (state.countryGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COUNTRIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        countryGroupsInfo: (state.countryGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COUNTRIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        countryGroupsInfo: (state.countryGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_USER_DETAILS':
      return {
        ...state,
        userDetails: (state.userDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_USER_DETAILS_SUCCESS':
      return {
        ...state,
        userDetails: (state.userDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_USER_DETAILS_FAILURE':
      return {
        ...state,
        userDetails: (state.userDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_USER_INFO':
      return {
        ...state,
        userDetails: (state.userDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_ALLOW_COMPANIES':
      return {
        ...state,
        allowCompanies: (state.allowCompanies, { loading: true, data: null, err: null }),
      };
    case 'GET_ALLOW_COMPANIES_SUCCESS':
      return {
        ...state,
        allowCompanies: (state.allowCompanies, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALLOW_COMPANIES_FAILURE':
      return {
        ...state,
        allowCompanies: (state.allowCompanies, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALLOW_COMPANIES_RESET':
      return {
        ...state,
        allowCompanies: (state.allowCompanies, { loading: false, err: null, data: null }),
      };
    case 'GET_TENANT_DETAILS':
      return {
        ...state,
        tenantDetail: (state.tenantDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_TENANT_DETAILS_SUCCESS':
      return {
        ...state,
        tenantDetail: (state.tenantDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TENANT_DETAILS_FAILURE':
      return {
        ...state,
        tenantDetail: (state.tenantDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COVID_RESOURCES':
      return {
        ...state,
        covidResources: (state.covidResources, { loading: true, data: null, err: null }),
      };
    case 'GET_COVID_RESOURCES_SUCCESS':
      return {
        ...state,
        covidResources: (state.covidResources, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COVID_RESOURCES_FAILURE':
      return {
        ...state,
        covidResources: (state.covidResources, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_TENANT_INFO':
      return {
        ...state,
        tenantUpdateInfo: (state.tenantUpdateInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TENANT_INFO_SUCCESS':
      return {
        ...state,
        tenantUpdateInfo: (state.tenantUpdateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TENANT_INFO_FAILURE':
      return {
        ...state,
        tenantUpdateInfo: (state.tenantUpdateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_TENANT_INFO':
      return {
        ...state,
        tenantUpdateInfo: (state.tenantUpdateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CLSELECTED_DETAILS':
      return {
        ...state,
        checklistSelected: (state.checklistSelected, { loading: true, data: null, err: null }),
      };
    case 'GET_CLSELECTED_DETAILS_SUCCESS':
      return {
        ...state,
        checklistSelected: (state.checklistSelected, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CLSELECTED_DETAILS_FAILURE':
      return {
        ...state,
        checklistSelected: (state.checklistSelected, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALL_COUNTRIES_INFO':
      return {
        ...state,
        allCountriesInfo: (state.allCountriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALL_COUNTRIES_INFO_SUCCESS':
      return {
        ...state,
        allCountriesInfo: (state.allCountriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALL_COUNTRIES_INFO_FAILURE':
      return {
        ...state,
        allCountriesInfo: (state.allCountriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'SAVE_COMPANY_INFO':
      return {
        ...state,
        companyRegisterInfo: (state.companyRegisterInfo, { loading: true, data: null, err: null }),
      };
    case 'SAVE_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        companyRegisterInfo: (state.companyRegisterInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'SAVE_COMPANY_INFO_FAILURE':
      return {
        ...state,
        companyRegisterInfo: (state.companyRegisterInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_COMPANY_INFO_SAVE':
      return {
        ...state,
        companyRegisterInfo: (state.companyRegisterInfo, { loading: false, err: null, data: null }),
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentWorkingTab: (state.currentWorkingTab, { data: action.payload }),
      };
    case 'EDIT_TEAM_INFO':
      return {
        ...state,
        editTeamInfo: (state.editTeamInfo, { loading: true, data: null, err: null }),
      };
    case 'EDIT_TEAM_INFO_SUCCESS':
      return {
        ...state,
        editTeamInfo: (state.editTeamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'EDIT_TEAM_INFO_FAILURE':
      return {
        ...state,
        editTeamInfo: (state.editTeamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALLOWED_MODULES_INFO':
      return {
        ...state,
        allowedCompanies: (state.allowedCompanies, { loading: true, data: null, err: null }),
      };
    case 'GET_ALLOWED_MODULES_INFO_SUCCESS':
      return {
        ...state,
        allowedCompanies: (state.allowedCompanies, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALLOWED_MODULES_INFO_FAILURE':
      return {
        ...state,
        allowedCompanies: (state.allowedCompanies, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EDIT_TEAM':
      return {
        ...state,
        editTeamInfo: (state.editTeamInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_EXISTS_USERS_COUNT':
      return {
        ...state,
        existsUserCount: (state.existsUserCount, { loading: true, data: null, err: null }),
      };
    case 'GET_EXISTS_USERS_COUNT_SUCCESS':
      return {
        ...state,
        existsUserCount: (state.existsUserCount, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXISTS_USERS_COUNT_FAILURE':
      return {
        ...state,
        existsUserCount: (state.existsUserCount, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXISTS_USERS_COUNT':
      return {
        ...state,
        existsUserCount: (state.existsUserCount, { loading: false, data: null, err: null }),
      };
    case 'GET_TEAM_DETAILS':
      return {
        ...state,
        teamDetail: (state.teamDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_DETAILS_SUCCESS':
      return {
        ...state,
        teamDetail: (state.teamDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_DETAILS_FAILURE':
      return {
        ...state,
        teamDetail: (state.teamDetail, { loading: false, err: action.error, data: null }),
      };
    case 'STORE_SELECTED_MEMBERS':
      return {
        ...state,
        selectedMembers: (state.selectedMembers, action.payload),
      };
    case 'STORE_SELECTED_SPACES':
      return {
        ...state,
        selectedSpaces: (state.selectedSpaces, action.payload),
      };
    case 'STORE_MODIFIED_Data':
      return {
        ...state,
        modifiedData: (state.modifiedData, action.payload),
      };
    case 'RESET_SELECTED_MEMBERS':
      return {
        ...state,
        selectedMembers: (state.selectedMembers, []),
      };
    case 'GET_TEAM_SPACES':
      return {
        ...state,
        teamSpaces: (state.teamSpaces, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_SPACES_SUCCESS':
      return {
        ...state,
        teamSpaces: (state.teamSpaces, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_SPACES_FAILURE':
      return {
        ...state,
        teamSpaces: (state.teamSpaces, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MEMBER_TEAMS':
      return {
        ...state,
        memberTeams: (state.memberTeams, { loading: true, data: null, err: null }),
      };
    case 'GET_MEMBER_TEAMS_SUCCESS':
      return {
        ...state,
        memberTeams: (state.memberTeams, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MEMBER_TEAMS_FAILURE':
      return {
        ...state,
        memberTeams: (state.memberTeams, { loading: false, err: action.error, data: null }),
      };

    case 'GET_TEAM_EXPORT_INFO':
      return {
        ...state,
        teamsExportInfo: (state.teamsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        teamsExportInfo: (state.teamsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_EXPORT_INFO_FAILURE':
      return {
        ...state,
        teamsExportInfo: (state.teamsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAM_MEMBERS_EXPORT_INFO':
      return {
        ...state,
        teamMembersExportInfo: (state.teamMembersExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_MEMBERS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        teamMembersExportInfo: (state.teamMembersExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_MEMBERS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        teamMembersExportInfo: (state.teamMembersExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'VISITOR_PASS_CONFIG':
      return {
        ...state,
        vpConfig: (state.vpConfig, { loading: true, data: null, err: null }),
      };
    case 'VISITOR_PASS_CONFIG_SUCCESS':
      return {
        ...state,
        vpConfig: (state.vpConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'VISITOR_PASS_CONFIG_FAILURE':
      return {
        ...state,
        vpConfig: (state.vpConfig, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SHIFTS_EXPORT_INFO':
      return {
        ...state,
        shiftsExportInfo: (state.shiftsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SHIFTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        shiftsExportInfo: (state.shiftsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SHIFTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        shiftsExportInfo: (state.shiftsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TENANTS_EXPORT_INFO':
      return {
        ...state,
        tenantsExportInfo: (state.tenantsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TENANTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        tenantsExportInfo: (state.tenantsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TENANTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        tenantsExportInfo: (state.tenantsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SHIFT_DETAILS':
      return {
        ...state,
        shiftDetail: (state.shiftDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_SHIFT_DETAILS_SUCCESS':
      return {
        ...state,
        shiftDetail: (state.shiftDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SHIFT_DETAILS_FAILURE':
      return {
        ...state,
        shiftDetail: (state.shiftDetail, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SHIFT_INFO':
      return {
        ...state,
        updateShiftInfo: (state.updateShiftInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SHIFT_INFO_SUCCESS':
      return {
        ...state,
        updateShiftInfo: (state.updateShiftInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SHIFT_INFO_FAILURE':
      return {
        ...state,
        updateShiftInfo: (state.updateShiftInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_SHIFT_INFO':
      return {
        ...state,
        updateShiftInfo: (state.updateShiftInfo, { loading: false, data: null, err: null }),
      };
    case 'DELETE_MEMBER_TEAM_INFO':
      return {
        ...state,
        deleteTeamInfo: (state.deleteTeamInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_MEMBER_TEAM_INFO_SUCCESS':
      return {
        ...state,
        deleteTeamInfo: (state.deleteTeamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_MEMBER_TEAM_INFO_FAILURE':
      return {
        ...state,
        deleteTeamInfo: (state.deleteTeamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TEAM_DELETE_INFO':
      return {
        ...state,
        deleteTeamInfo: (state.deleteTeamInfo, { loading: false, data: null, err: null }),
      };
    case 'USER_PASSWORD_UPDATE_INFO':
      return {
        ...state,
        updateUserPasswordInfo: (state.updateUserPasswordInfo, { loading: true, data: null, err: null }),
      };
    case 'USER_PASSWORD_UPDATE_INFO_SUCCESS':
      return {
        ...state,
        updateUserPasswordInfo: (state.updateUserPasswordInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'USER_PASSWORD_UPDATE_INFO_FAILURE':
      return {
        ...state,
        updateUserPasswordInfo: (state.updateUserPasswordInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_USER_PASSWORD_UPDATE_INFO':
      return {
        ...state,
        updateUserPasswordInfo: (state.updateUserPasswordInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_DESIGNATIONS_INFO':
      return {
        ...state,
        memberDesginations: (state.memberDesginations, { loading: true, data: null, err: null }),
      };
    case 'GET_DESIGNATIONS_INFO_SUCCESS':
      return {
        ...state,
        memberDesginations: (state.memberDesginations, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DESIGNATIONS_INFO_FAILURE':
      return {
        ...state,
        memberDesginations: (state.memberDesginations, { loading: false, err: action.error, data: null }),
      };
    case 'USER_SESSION_INFO':
      return {
        ...state,
        userSessionData: (state.userSessionData, { loading: true, data: null, err: null }),
      };
    case 'USER_SESSION_INFO_SUCCESS':
      return {
        ...state,
        userSessionData: (state.userSessionData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'USER_SESSION_INFO_FAILURE':
      return {
        ...state,
        userSessionData: (state.userSessionData, { loading: false, err: action.error, data: null }),
      };
    case 'USER_SESSION_REMOVE_INFO':
      return {
        ...state,
        userSessionRemoveInfo: (state.userSessionRemoveInfo, { loading: true, data: null, err: null }),
      };
    case 'USER_SESSION_REMOVE_INFO_SUCCESS':
      return {
        ...state,
        userSessionRemoveInfo: (state.userSessionRemoveInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'USER_SESSION_REMOVE_INFO_FAILURE':
      return {
        ...state,
        userSessionRemoveInfo: (state.userSessionRemoveInfo, { loading: false, err: action.error, data: null }),
      };
    case 'DATA_FILTERS':
      return {
        ...state,
        checkListData: (state.checkListData, action.payload),
      };
    case 'ACTIVE_STEP':
      return {
        ...state,
        activeStep: (state.activeStep, action.payload),
      };
    case 'TEAM_FILTERS':
      return {
        ...state,
        teamsFilters: (state.teamsFilters, action.payload)
      };
    case 'TEAM_MEMBER_FILTERS':
      return {
        ...state,
        teamMemberFilters: (state.teamMemberFilters, action.payload)
      };
    case 'CLEAR_TEAM_MEMBER_FILTERS':
      return {
        ...state,
        teamMemberFilters: {},
      };
    case 'RESET_ADD_TEAM_INFO':
      return {
        ...state,
        createTeamInfo: (state.createTeamInfo, { loading: false, err: null, data: null })
      };
    case 'GET_COMPANY_REGIONS_INFO':
      return {
        ...state,
        regionsInfo: (state.regionsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_REGIONS_INFO_SUCCESS':
      return {
        ...state,
        regionsInfo: (state.regionsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPANY_REGIONS_INFO_FAILURE':
      return {
        ...state,
        regionsInfo: (state.regionsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_TENANT_NO_INFO':
      return {
        ...state,
        updateVisitor: (state.updateVisitor, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TENANT_NO_INFO_SUCCESS':
      return {
        ...state,
        updateVisitor: (state.updateVisitor, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TENANT_NO_INFO_FAILURE':
      return {
        ...state,
        updateVisitor: (state.updateVisitor, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TENANT_NO_INFO':
      return {
        ...state,
        updateVisitor: (state.updateVisitor, { loading: false, data: null, err: null }),
      };
    case 'GET_BULKINSP_INFO':
      return {
        ...state,
        bulkInspectionInfo: (state.bulkInspectionInfo, { loading: true }),
      };
    case 'GET_BULKINSP_INFO_SUCCESS':
      return {
        ...state,
        bulkInspectionInfo: (state.bulkInspectionInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_BULKINSP_INFO_FAILURE':
      return {
        ...state,
        bulkInspectionInfo: (state.bulkInspectionInfo, { loading: false, err: action.error }),
      };
    case 'GET_BULKINSP_EXPORT_INFO':
      return {
        ...state,
        bulkInspectionExportInfo: (state.bulkInspectionExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BULKINSP_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        bulkInspectionExportInfo: (state.bulkInspectionExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BULKINSP_EXPORT_INFO_FAILURE':
      return {
        ...state,
        bulkInspectionExportInfo: (state.bulkInspectionExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BULKINSP_COUNT':
      return {
        ...state,
        bulkInspectionCountLoading: true,
      };
    case 'GET_BULKINSP_COUNT_SUCCESS':
      return {
        ...state,
        bulkInspectionCount: (state.bulkInspectionCount, action.payload),
        bulkInspectionCountLoading: false,
      };
    case 'GET_BULKINSP_COUNT_FAILURE':
      return {
        ...state,
        bulkInspectionCountErr: (state.bulkInspectionCountErr, action.error),
        bulkInspectionCountLoading: false,
      };
    case 'ARCHIVE_INFO':
      return {
        ...state,
        archiveInfo: (state.archiveInfo, { loading: true, data: null, err: null })
      };
    case 'ARCHIVE_INFO_SUCCESS':
      return {
        ...state,
        archiveInfo: (state.archiveInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'ARCHIVE_INFO_FAILURE':
      return {
        ...state,
        archiveInfo: (state.archiveInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_ARCHIVE_INFO':
      return {
        ...state,
        archiveInfo: (state.archiveInfo, { loading: false, data: null, err: null })
      };
    case 'GET_SITE_EXPORT_INFO':
      return {
        ...state,
        siteExportInfo: (state.siteExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        siteExportInfo: (state.siteExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_EXPORT_INFO_FAILURE':
      return {
        ...state,
        siteExportInfo: (state.siteExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PASSWORD_EXISTS_INFO':
      return {
        ...state,
        passwordExistsInfo: (state.passwordExistsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PASSWORD_EXISTS_INFO_SUCCESS':
      return {
        ...state,
        passwordExistsInfo: (state.passwordExistsInfo, { loading: false, data: action.payload.status, err: null }),
      };
    case 'GET_PASSWORD_EXISTS_INFO_FAILURE':
      return {
        ...state,
        passwordExistsInfo: (state.passwordExistsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PASSWORD_EXISTS_INFO':
      return {
        ...state,
        passwordExistsInfo: (state.passwordExistsInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ADMIN_PPM_LIST_INFO':
      return {
        ...state,
        adminPPMList: (state.adminPPMList, { loading: true, data: null, err: null }),
      };
    case 'GET_ADMIN_PPM_LIST_INFO_SUCCESS':
      return {
        ...state,
        adminPPMList: (state.adminPPMList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ADMIN_PPM_LIST_INFO_FAILURE':
      return {
        ...state,
        adminPPMList: (state.adminPPMList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ADMIN_PPM_COUNT':
      return {
        ...state,
        adminPPMCountLoading: true,
        adminPPMCount: null,
        adminPPMCountErr: null,
      };
    case 'GET_ADMIN_PPM_COUNT_SUCCESS':
      return {
        ...state,
        adminPPMCount: (state.adminPPMCount, action.payload),
        adminPPMCountErr: null,
        adminPPMCountLoading: false,
      };
    case 'GET_ADMIN_PPM_COUNT_FAILURE':
      return {
        ...state,
        adminPPMCountErr: (state.adminPPMCountErr, action.error),
        adminPPMCount: null,
        adminPPMCountLoading: false,
      };
    case 'GET_ADMIN_PPM_EXPORT_INFO':
      return {
        ...state,
        adminPPMExport: (state.adminPPMExport, { loading: true, data: null, err: null }),
      };
    case 'GET_ADMIN_PPM_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        adminPPMExport: (state.adminPPMExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ADMIN_PPM_EXPORT_INFO_FAILURE':
      return {
        ...state,
        adminPPMExport: (state.adminPPMExport, { loading: false, err: action.error, data: null }),
      };
    case 'INSPECTION_FILTERS':
      return {
        ...state,
        inspectionFilters: (state.inspectionFilters, action.payload),
      };
    case 'INCREMENT_NOTIFICATION_COUNT':
      return {
        ...state,
        notificationCountDR: (state.notificationCountDR, action.payload),
      };
    case 'RESET_NOTIFICATION_COUNT':
      return {
        ...state,
        notificationCountDR: 0,
      };
    case 'GET_ADMIN_INSPECTION_LIST_INFO':
      return {
        ...state,
        adminInspectionList: (state.adminInspectionList, { loading: true, data: null, err: null }),
      };
    case 'GET_ADMIN_INSPECTION_LIST_INFO_SUCCESS':
      return {
        ...state,
        adminInspectionList: (state.adminInspectionList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ADMIN_INSPECTION_LIST_INFO_FAILURE':
      return {
        ...state,
        adminInspectionList: (state.adminInspectionList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ADMIN_INSPECTION_COUNT':
      return {
        ...state,
        adminInspectionCountLoading: true,
        adminInspectionCount: null,
        adminInspectionCountErr: null,
      };
    case 'GET_ADMIN_INSPECTION_COUNT_SUCCESS':
      return {
        ...state,
        adminInspectionCount: (state.adminInspectionCount, action.payload),
        adminInspectionCountErr: null,
        adminInspectionCountLoading: false,
      };
    case 'GET_ADMIN_INSPECTION_COUNT_FAILURE':
      return {
        ...state,
        adminInspectionCountErr: (state.adminInspectionCountErr, action.error),
        adminInspectionCount: null,
        adminInspectionCountLoading: false,
      };
    case 'GET_ADMIN_INSPECTION_EXPORT_INFO':
      return {
        ...state,
        adminInspectionExport: (state.adminInspectionExport, { loading: true, data: null, err: null }),
      };
    case 'GET_ADMIN_INSPECTION_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        adminInspectionExport: (state.adminInspectionExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ADMIN_INSPECTION_EXPORT_INFO_FAILURE':
      return {
        ...state,
        adminInspectionExport: (state.adminInspectionExport, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
