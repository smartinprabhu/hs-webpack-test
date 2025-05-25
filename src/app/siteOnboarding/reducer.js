const initialState = {
  siteCount: null,
  siteCountErr: null,
  siteCountLoading: false,
  siteFilters: {},
  siteRows: {},
  recipientsLocationId: {},
  invRecipientsLocationId: {},
  spaceId: {},
  siteExportInfo: {},
  siteInfo: {},
  updateSiteInfo: {},
  addSiteInfo: {},
  codeGroupInfo: {},
  parentSiteGroupInfo: {},
  siteDetails: {},
  tcInfo: {},
  allowedModulesInfo: {},
  userSiteInfo: {},
  onBoardCopyInfo: {},
  siteEvidence: {},
  templateSite: {},
  stateChangeInfo: {},
  siteDashboard: {},
  categoryGroupInfo: {},
  parentCompanyInfo: {},
  productCompanyInfo: {},
  companyInfo: {},
  siteReportInfo: {},
  problemCategoryListInfo: {},
  problemCategoryCount: null,
  problemCategoryCountErr: null,
  problemCategoryCountLoading: false,
  problemCategoryDetails: {},
  pcExportListInfo: {},
  problemCategoryFilters: {},
  pcInfo: {},
  problemCategoryGroupListInfo: {},
  problemCategoryGroupCount: null,
  problemCategoryGroupCountErr: null,
  problemCategoryGroupCountLoading: false,
  problemCategoryGroupDetails: {},
  pcgExportListInfo: {},
  problemCategoryGroupFilters: {},
  pcgInfo: {},
  spaceCategoryListInfo: {},
  spaceCategoryCount: null,
  spaceCategoryCountErr: null,
  spaceCategoryCountLoading: false,
  spaceCategoryDetails: {},
  scExportListInfo: {},
  spaceCategoryFilters: {},
  scInfo: {},
  assetCategoryListInfo: {},
  assetCategoryCount: null,
  assetCategoryCountErr: null,
  assetCategoryCountLoading: false,
  assetCategoryDetails: {},
  acExportListInfo: {},
  assetCategoryFilters: {},
  acInfo: {},
  helpdeskSettingsInfo: {},
  gatePassSettingsInfo: {},
  auditSettingsInfo: {},
  workpermitSettingsInfo: {},
  inventorySettingsInfo: {},
  ppmSettingsInfo: {},
  pantrySettingsInfo: {},
  visitorSettingsInfo: {},
  allowedHostId: [],
  allowedDomainId: [],
  visitorTypeId: [],
  assetId: [],
  inspectionSettingsInfo: {},
  recipientsInfo: {},
  whatsappInfoList: {},
  mailInfoList: {},
  insMailInfoList: {},
  incRepBInfoList: {},
  incRepAInfoList: {},
  subCatInfoList: {},
  catInfoList: {},
  audSpaceInfoList: {},
  smsInfoList: {},
  accessGroupInfo: {},
  visitorGroupInfo: {},
  assetGroupInfo: {},
  labelListInfo: {},
  updateSiteConfigInfo: {},
  escalationLevelFilters: {},
  escalationLevelListInfo: {},
  escalationLevelCountLoading: {},
  escalationLevelCount: {},
  escalationLevelCountErr: {},
  eslExportListInfo: {},
  spaceInfo: {},
  equipmentInfo: {},
  spaceCategoryInfo: {},
  mailroomSettingsInfo: {},
  esInfo: {},
  escalationRecipientsInfo: {},
  orderLines: {},
  equipmentId: [],
  spaceCategoryId: [],
  problemCategoryId: [],
  warhouseIds: {},
  onboardingSummary: {},
  hxModuleUpdate: {},
  hxTaskUpdate: {},
  taskMessages: {},
  taskChecklists: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_SITE_COUNT_INFO':
      return {
        ...state,
        siteCountLoading: true,
      };
    case 'GET_SITE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        siteCount: (state.siteCount, action.payload),
        siteCountLoading: false,
      };
    case 'GET_SITE_COUNT_INFO_FAILURE':
      return {
        ...state,
        siteCountErr: (state.siteCountErr, action.error),
        siteCountLoading: false,
      };
    case 'SITE_FILTERS':
      return {
        ...state,
        siteFilters: (state.siteFilters, action.payload),
      };
    case 'GET_SITE_INFO':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_INFO_SUCCESS':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_INFO_FAILURE':
      return {
        ...state,
        siteInfo: (state.siteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_SITE_INFO':
      return {
        ...state,
        addSiteInfo: (state.addSiteInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SITE_INFO_SUCCESS':
      return {
        ...state,
        addSiteInfo: (state.addSiteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SITE_INFO_FAILURE':
      return {
        ...state,
        addSiteInfo: (state.addSiteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_SITE_INFO':
      return {
        ...state,
        addSiteInfo: (state.addSiteInfo, { loading: false, err: null, data: null }),
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
    case 'UPDATE_CONFIG_INFO':
      return {
        ...state,
        updateSiteConfigInfo: (state.updateSiteConfigInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        updateSiteConfigInfo: (state.updateSiteConfigInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CONFIG_INFO_FAILURE':
      return {
        ...state,
        updateSiteConfigInfo: (state.updateSiteConfigInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_SITE_INFO':
      return {
        ...state,
        updateSiteInfo: (state.updateSiteInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CODE_GROUP_INFO':
      return {
        ...state,
        codeGroupInfo: (state.codeGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CODE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        codeGroupInfo: (state.codeGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CODE_GROUP_INFO_FAILURE':
      return {
        ...state,
        codeGroupInfo: (state.codeGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PS_GROUP_INFO':
      return {
        ...state,
        parentSiteGroupInfo: (state.parentSiteGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        parentSiteGroupInfo: (state.parentSiteGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PS_GROUP_INFO_FAILURE':
      return {
        ...state,
        parentSiteGroupInfo: (state.parentSiteGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO_SUCCESS':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO_FAILURE':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SITE_DETAILS':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_DETAILS_SUCCESS':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_DETAILS_FAILURE':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DETAIL_SITE_INFO':
      return {
        ...state,
        siteDetails: (state.siteDetails, { loading: false, err: null, data: null }),
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
    case 'GET_ROWS_SITE':
      return {
        ...state,
        siteRows: (state.siteRows, action.payload),
      };
    case 'GET_RECIPIENT_ID':
      return {
        ...state,
        recipientsLocationId: (state.recipientsLocationId, action.payload),
      };
    case 'GET_INV_RECIPIENT_ID':
      return {
        ...state,
        invRecipientsLocationId: (state.invRecipientsLocationId, action.payload),
      };
    case 'GET_SPACE_ID':
      return {
        ...state,
        spaceId: (state.spaceId, action.payload),
      };
    case 'GET_PC_ID':
      return {
        ...state,
        problemCategoryId: (state.problemCategoryId, action.payload),
      };
    case 'GET_EQUIPMENT_ID':
      return {
        ...state,
        equipmentId: (state.equipmentId, action.payload),
      };
    case 'GET_SPACE_CATEGORY_ID':
      return {
        ...state,
        spaceCategoryId: (state.spaceCategoryId, action.payload),
      };
    case 'GET_HOST_ID':
      return {
        ...state,
        allowedHostId: (state.allowedHostId, action.payload),
      };
    case 'GET_DOMAIN_ID':
      return {
        ...state,
        allowedDomainId: (state.allowedDomainId, action.payload),
      };
    case 'GET_VISITOR_TYPE_ID':
      return {
        ...state,
        visitorTypeId: (state.visitorTypeId, action.payload),
      };
    case 'GET_ASSET_ID':
      return {
        ...state,
        assetId: (state.assetId, action.payload),
      };
    case 'GET_TC_INFO':
      return {
        ...state,
        tcInfo: (state.tcInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TC_INFO_SUCCESS':
      return {
        ...state,
        tcInfo: (state.tcInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TC_INFO_FAILURE':
      return {
        ...state,
        tcInfo: (state.tcInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TC':
      return {
        ...state,
        tcInfo: (state.tcInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_AG_INFO':
      return {
        ...state,
        accessGroupInfo: (state.accessGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AG_INFO_SUCCESS':
      return {
        ...state,
        accessGroupInfo: (state.accessGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AG_INFO_FAILURE':
      return {
        ...state,
        accessGroupInfo: (state.accessGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VT_INFO':
      return {
        ...state,
        visitorGroupInfo: (state.visitorGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VT_INFO_SUCCESS':
      return {
        ...state,
        visitorGroupInfo: (state.visitorGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VT_INFO_FAILURE':
      return {
        ...state,
        visitorGroupInfo: (state.visitorGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSET_INFO':
      return {
        ...state,
        assetGroupInfo: (state.assetGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_INFO_SUCCESS':
      return {
        ...state,
        assetGroupInfo: (state.assetGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_INFO_FAILURE':
      return {
        ...state,
        assetGroupInfo: (state.assetGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LB_INFO':
      return {
        ...state,
        labelListInfo: (state.labelListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_LB_INFO_SUCCESS':
      return {
        ...state,
        labelListInfo: (state.labelListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LB_INFO_FAILURE':
      return {
        ...state,
        labelListInfo: (state.labelListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SITE_CATEGORY':
      return {
        ...state,
        parentCompanyInfo: (state.parentCompanyInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_CATEGORY_SUCCESS':
      return {
        ...state,
        parentCompanyInfo: (state.parentCompanyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_CATEGORY_FAILURE':
      return {
        ...state,
        parentCompanyInfo: (state.parentCompanyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_COMPANY':
      return {
        ...state,
        productCompanyInfo: (state.productCompanyInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_COMPANY_SUCCESS':
      return {
        ...state,
        productCompanyInfo: (state.productCompanyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_COMPANY_FAILURE':
      return {
        ...state,
        productCompanyInfo: (state.productCompanyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPANY_INFO':
      return {
        ...state,
        companyInfo: (state.companyInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        companyInfo: (state.companyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPANY_INFO_FAILURE':
      return {
        ...state,
        companyInfo: (state.companyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALLOWED_MODULE_INFO':
      return {
        ...state,
        allowedModulesInfo: (state.allowedModulesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALLOWED_MODULE_INFO_SUCCESS':
      return {
        ...state,
        allowedModulesInfo: (state.allowedModulesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALLOWED_MODULE_INFO_FAILURE':
      return {
        ...state,
        allowedModulesInfo: (state.allowedModulesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_USER_INFO':
      return {
        ...state,
        userSiteInfo: (state.userSiteInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_USER_INFO_SUCCESS':
      return {
        ...state,
        userSiteInfo: (state.userSiteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_USER_INFO_FAILURE':
      return {
        ...state,
        userSiteInfo: (state.userSiteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COPY_MODULE':
      return {
        ...state,
        onBoardCopyInfo: (state.onBoardCopyInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COPY_MODULE_SUCCESS':
      return {
        ...state,
        onBoardCopyInfo: (state.onBoardCopyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COPY_MODULE_FAILURE':
      return {
        ...state,
        onBoardCopyInfo: (state.onBoardCopyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_COPY_STATUS':
      return {
        ...state,
        onBoardCopyInfo: (state.onBoardCopyInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SITE_DASHBOARD_INFO':
      return {
        ...state,
        siteDashboard: (state.siteDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_SITE_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        siteDashboard: (state.siteDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SITE_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        siteDashboard: (state.siteDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PC_LIST_INFO':
      return {
        ...state,
        problemCategoryListInfo: (state.problemCategoryListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PC_LIST_INFO_SUCCESS':
      return {
        ...state,
        problemCategoryListInfo: (state.problemCategoryListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PC_LIST_INFO_FAILURE':
      return {
        ...state,
        problemCategoryListInfo: (state.problemCategoryListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PC_COUNT_INFO':
      return {
        ...state,
        problemCategoryCountLoading: true,
      };
    case 'GET_PC_COUNT_INFO_SUCCESS':
      return {
        ...state,
        problemCategoryCount: (state.problemCategoryCount, action.payload),
        problemCategoryCountLoading: false,
      };
    case 'GET_PC_COUNT_INFO_FAILURE':
      return {
        ...state,
        problemCategoryCountErr: (state.problemCategoryCountErr, action.error),
        problemCategoryCount: (state.problemCategoryCount, false),
        problemCategoryCountLoading: false,
      };
    case 'GET_PC_EXPORT_LIST_INFO':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PC_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PC_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'PC_FILTERS':
      return {
        ...state,
        problemCategoryFilters: (state.problemCategoryFilters, action.payload),
      };
    case 'GET_PC_INFO':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PC_INFO_SUCCESS':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PC_INFO_FAILURE':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PCG_LIST_INFO':
      return {
        ...state,
        problemCategoryGroupListInfo: (state.problemCategoryGroupListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PCG_LIST_INFO_SUCCESS':
      return {
        ...state,
        problemCategoryGroupListInfo: (state.problemCategoryGroupListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PCG_LIST_INFO_FAILURE':
      return {
        ...state,
        problemCategoryGroupListInfo: (state.problemCategoryGroupListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PCG_COUNT_INFO':
      return {
        ...state,
        problemCategoryGroupCountLoading: true,
      };
    case 'GET_PCG_COUNT_INFO_SUCCESS':
      return {
        ...state,
        problemCategoryGroupCount: (state.problemCategoryGroupCount, action.payload),
        problemCategoryGroupCountLoading: false,
      };
    case 'GET_PCG_COUNT_INFO_FAILURE':
      return {
        ...state,
        problemCategoryGroupCountErr: (state.problemCategoryGroupCountErr, action.error),
        problemCategoryGroupCount: (state.problemCategoryGroupCount, false),
        problemCategoryGroupCountLoading: false,
      };
    case 'GET_PCG_EXPORT_LIST_INFO':
      return {
        ...state,
        pcgExportListInfo: (state.pcgExportListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PCG_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        pcgExportListInfo: (state.pcgExportListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PCG_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        pcgExportListInfo: (state.pcgExportListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'PCG_FILTERS':
      return {
        ...state,
        problemCategoryGroupFilters: (state.problemCategoryGroupFilters, action.payload),
      };
    case 'GET_PCG_INFO':
      return {
        ...state,
        pcgInfo: (state.pcgInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PCG_INFO_SUCCESS':
      return {
        ...state,
        pcgInfo: (state.pcgInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PCG_INFO_FAILURE':
      return {
        ...state,
        pcgInfo: (state.pcgInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ES_INFO':
      return {
        ...state,
        esInfo: (state.esInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ES_INFO_SUCCESS':
      return {
        ...state,
        esInfo: (state.esInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ES_INFO_FAILURE':
      return {
        ...state,
        esInfo: (state.esInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SC_LIST_INFO':
      return {
        ...state,
        spaceCategoryListInfo: (state.spaceCategoryListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SC_LIST_INFO_SUCCESS':
      return {
        ...state,
        spaceCategoryListInfo: (state.spaceCategoryListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SC_LIST_INFO_FAILURE':
      return {
        ...state,
        spaceCategoryListInfo: (state.spaceCategoryListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SC_COUNT_INFO':
      return {
        ...state,
        spaceCategoryCountLoading: true,
      };
    case 'GET_SC_COUNT_INFO_SUCCESS':
      return {
        ...state,
        spaceCategoryCount: (state.spaceCategoryCount, action.payload),
        spaceCategoryCountLoading: false,
      };
    case 'GET_SC_COUNT_INFO_FAILURE':
      return {
        ...state,
        spaceCategoryCountErr: (state.spaceCategoryCountErr, action.error),
        spaceCategoryCount: (state.spaceCategoryCount, false),
        spaceCategoryCountLoading: false,
      };
    case 'GET_SC_EXPORT_LIST_INFO':
      return {
        ...state,
        scExportListInfo: (state.scExportListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SC_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        scExportListInfo: (state.scExportListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SC_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        scExportListInfo: (state.scExportListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'SC_FILTERS':
      return {
        ...state,
        spaceCategoryFilters: (state.spaceCategoryFilters, action.payload),
      };
    case 'GET_SC_INFO':
      return {
        ...state,
        scInfo: (state.scInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SC_INFO_SUCCESS':
      return {
        ...state,
        scInfo: (state.scInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SC_INFO_FAILURE':
      return {
        ...state,
        scInfo: (state.scInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AC_LIST_INFO':
      return {
        ...state,
        assetCategoryListInfo: (state.assetCategoryListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AC_LIST_INFO_SUCCESS':
      return {
        ...state,
        assetCategoryListInfo: (state.assetCategoryListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AC_LIST_INFO_FAILURE':
      return {
        ...state,
        assetCategoryListInfo: (state.assetCategoryListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AC_COUNT_INFO':
      return {
        ...state,
        assetCategoryCountLoading: true,
      };
    case 'GET_AC_COUNT_INFO_SUCCESS':
      return {
        ...state,
        assetCategoryCount: (state.assetCategoryCount, action.payload),
        assetCategoryCountLoading: false,
      };
    case 'GET_AC_COUNT_INFO_FAILURE':
      return {
        ...state,
        assetCategoryCountErr: (state.assetCategoryCountErr, action.error),
        assetCategoryCount: (state.assetCategoryCount, false),
        assetCategoryCountLoading: false,
      };
    case 'GET_AC_EXPORT_LIST_INFO':
      return {
        ...state,
        acExportListInfo: (state.acExportListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AC_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        acExportListInfo: (state.acExportListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AC_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        acExportListInfo: (state.acExportListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'AC_FILTERS':
      return {
        ...state,
        assetCategoryFilters: (state.assetCategoryFilters, action.payload),
      };
    case 'GET_AC_INFO':
      return {
        ...state,
        acInfo: (state.acInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AC_INFO_SUCCESS':
      return {
        ...state,
        acInfo: (state.acInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AC_INFO_FAILURE':
      return {
        ...state,
        acInfo: (state.acInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HS_DETAILS_INFO':
      return {
        ...state,
        helpdeskSettingsInfo: (state.helpdeskSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_HS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        helpdeskSettingsInfo: (state.helpdeskSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        helpdeskSettingsInfo: (state.helpdeskSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AUDIT_DETAILS_INFO':
      return {
        ...state,
        auditSettingsInfo: (state.auditSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AUDIT_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        auditSettingsInfo: (state.auditSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AUDIT_DETAILS_INFO_FAILURE':
      return {
        ...state,
        auditSettingsInfo: (state.auditSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WS_DETAILS_INFO':
      return {
        ...state,
        workpermitSettingsInfo: (state.workpermitSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        workpermitSettingsInfo: (state.workpermitSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        workpermitSettingsInfo: (state.workpermitSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INV_DETAILS_INFO':
      return {
        ...state,
        inventorySettingsInfo: (state.inventorySettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INV_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        inventorySettingsInfo: (state.inventorySettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INV_DETAILS_INFO_FAILURE':
      return {
        ...state,
        inventorySettingsInfo: (state.inventorySettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_DETAILS_INFO':
      return {
        ...state,
        ppmSettingsInfo: (state.ppmSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ppmSettingsInfo: (state.ppmSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ppmSettingsInfo: (state.ppmSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAILROOM_DETAILS_INFO':
      return {
        ...state,
        mailroomSettingsInfo: (state.mailroomSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAILROOM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        mailroomSettingsInfo: (state.mailroomSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAILROOM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        mailroomSettingsInfo: (state.mailroomSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PANTRY_DETAILS_INFO':
      return {
        ...state,
        pantrySettingsInfo: (state.pantrySettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PANTRY_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        pantrySettingsInfo: (state.pantrySettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PANTRY_DETAILS_INFO_FAILURE':
      return {
        ...state,
        pantrySettingsInfo: (state.pantrySettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VMS_DETAILS_INFO':
      return {
        ...state,
        visitorSettingsInfo: (state.visitorSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VMS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        visitorSettingsInfo: (state.visitorSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VMS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        visitorSettingsInfo: (state.visitorSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INS_DETAILS_INFO':
      return {
        ...state,
        inspectionSettingsInfo: (state.inspectionSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        inspectionSettingsInfo: (state.inspectionSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        inspectionSettingsInfo: (state.inspectionSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ESL_LIST_INFO':
      return {
        ...state,
        escalationLevelListInfo: (state.escalationLevelListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ESL_LIST_INFO_SUCCESS':
      return {
        ...state,
        escalationLevelListInfo: (state.escalationLevelListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ESL_LIST_INFO_FAILURE':
      return {
        ...state,
        escalationLevelListInfo: (state.escalationLevelListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ESL_COUNT_INFO':
      return {
        ...state,
        escalationLevelCountLoading: true,
      };
    case 'GET_ESL_COUNT_INFO_SUCCESS':
      return {
        ...state,
        escalationLevelCount: (state.escalationLevelCount, action.payload),
        escalationLevelCountLoading: false,
      };
    case 'GET_ESL_COUNT_INFO_FAILURE':
      return {
        ...state,
        escalationLevelCountErr: (state.escalationLevelCountErr, action.error),
        escalationLevelCount: (state.escalationLevelCount, false),
        escalationLevelCountLoading: false,
      };
    case 'GET_ESL_EXPORT_LIST_INFO':
      return {
        ...state,
        eslExportListInfo: (state.eslExportListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ESL_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        eslExportListInfo: (state.eslExportListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ESL_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        eslExportListInfo: (state.eslExportListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'ESL_FILTERS':
      return {
        ...state,
        escalationLevelFilters: (state.escalationLevelFilters, action.payload),
      };
    case 'GET_SPACE_INFO':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_INFO_SUCCESS':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACE_INFO_FAILURE':
      return {
        ...state,
        spaceInfo: (state.spaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_RECIPIENTS_INFO':
      return {
        ...state,
        recipientsInfo: (state.recipientsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_RECIPIENTS_INFO_SUCCESS':
      return {
        ...state,
        recipientsInfo: (state.recipientsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RECIPIENTS_INFO_FAILURE':
      return {
        ...state,
        recipientsInfo: (state.recipientsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ESCALATION_RECIPIENTS_INFO':
      return {
        ...state,
        escalationRecipientsInfo: (state.escalationRecipientsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ESCALATION_RECIPIENTS_INFO_SUCCESS':
      return {
        ...state,
        escalationRecipientsInfo: (state.escalationRecipientsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ESCALATION_RECIPIENTS_INFO_FAILURE':
      return {
        ...state,
        escalationRecipientsInfo: (state.escalationRecipientsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WP_INFO':
      return {
        ...state,
        whatsappInfoList: (state.whatsappInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_WP_INFO_SUCCESS':
      return {
        ...state,
        whatsappInfoList: (state.whatsappInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WP_INFO_FAILURE':
      return {
        ...state,
        whatsappInfoList: (state.whatsappInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAIL_INFO':
      return {
        ...state,
        mailInfoList: (state.mailInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_MAIL_INFO_SUCCESS':
      return {
        ...state,
        mailInfoList: (state.mailInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAIL_INFO_FAILURE':
      return {
        ...state,
        mailInfoList: (state.mailInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INS_MAIL_INFO':
      return {
        ...state,
        insMailInfoList: (state.insMailInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_INS_MAIL_INFO_SUCCESS':
      return {
        ...state,
        insMailInfoList: (state.insMailInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INS_MAIL_INFO_FAILURE':
      return {
        ...state,
        insMailInfoList: (state.insMailInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INC_REP_B_INFO':
      return {
        ...state,
        incRepBInfoList: (state.incRepBInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_INC_REP_B_INFO_SUCCESS':
      return {
        ...state,
        incRepBInfoList: (state.incRepBInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INC_REP_B_INFO_FAILURE':
      return {
        ...state,
        incRepBInfoList: (state.incRepBInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INC_REP_A_INFO':
      return {
        ...state,
        incRepAInfoList: (state.incRepAInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_INC_REP_A_INFO_SUCCESS':
      return {
        ...state,
        incRepAInfoList: (state.incRepAInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INC_REP_A_INFO_FAILURE':
      return {
        ...state,
        incRepAInfoList: (state.incRepAInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SUB_CAT_INFO':
      return {
        ...state,
        subCatInfoList: (state.subCatInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_SUB_CAT_INFO_SUCCESS':
      return {
        ...state,
        subCatInfoList: (state.subCatInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SUB_CAT_INFO_FAILURE':
      return {
        ...state,
        subCatInfoList: (state.subCatInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CAT_INFO':
      return {
        ...state,
        catInfoList: (state.catInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_CAT_INFO_SUCCESS':
      return {
        ...state,
        catInfoList: (state.catInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET__CAT_INFO_FAILURE':
      return {
        ...state,
        catInfoList: (state.catInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AUD_SPACE_INFO':
      return {
        ...state,
        audSpaceInfoList: (state.audSpaceInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_AUD_SPACE_INFO_SUCCESS':
      return {
        ...state,
        audSpaceInfoList: (state.audSpaceInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AUD_SPACE_INFO_FAILURE':
      return {
        ...state,
        audSpaceInfoList: (state.audSpaceInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SMS_INFO':
      return {
        ...state,
        smsInfoList: (state.smsInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_SMS_INFO_SUCCESS':
      return {
        ...state,
        smsInfoList: (state.smsInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SMS_INFO_FAILURE':
      return {
        ...state,
        smsInfoList: (state.smsInfoList, { loading: false, err: action.error, data: null }),
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
    case 'GET_SPACECAT_INFO':
      return {
        ...state,
        spaceCategoryInfo: (state.spaceCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACECAT_INFO_SUCCESS':
      return {
        ...state,
        spaceCategoryInfo: (state.spaceCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACECAT_INFO_FAILURE':
      return {
        ...state,
        spaceCategoryInfo: (state.spaceCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_GP_DETAILS_INFO':
      return {
        ...state,
        gatePassSettingsInfo: (state.gatePassSettingsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_GP_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        gatePassSettingsInfo: (state.gatePassSettingsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_GP_DETAILS_INFO_FAILURE':
      return {
        ...state,
        gatePassSettingsInfo: (state.gatePassSettingsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ORDER_LINE_INFO':
      return {
        ...state,
        orderLines: (state.orderLines, { loading: true, data: null, err: null }),
      };
    case 'GET_ORDER_LINE_INFO_SUCCESS':
      return {
        ...state,
        orderLines: (state.orderLines, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ORDER_LINE_INFO_FAILURE':
      return {
        ...state,
        orderLines: (state.orderLines, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WAREHOUSE_GROUP_INFO':
      return {
        ...state,
        warhouseIds: (state.warhouseIds, { loading: true, data: null, err: null }),
      };
    case 'GET_WAREHOUSE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        warhouseIds: (state.warhouseIds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WAREHOUSE_GROUP_INFO_FAILURE':
      return {
        ...state,
        warhouseIds: (state.warhouseIds, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_WAREHOUSE_ID_INFO':
      return {
        ...state,
        warhouseIds: (state.warhouseIds, { loading: false, err: null, data: null }),
      };
    case 'GET_CONFIGURATION_SUMMARY_INFO':
      return {
        ...state,
        onboardingSummary: (state.onboardingSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_CONFIGURATION_SUMMARY_INFO_SUCCESS':
      return {
        ...state,
        onboardingSummary: (state.onboardingSummary, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CONFIGURATION_SUMMARY_INFO_FAILURE':
      return {
        ...state,
        onboardingSummary: (state.onboardingSummary, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_HX_TASK_INFO':
      return {
        ...state,
        hxTaskUpdate: (state.hxTaskUpdate, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_HX_TASK_INFO_SUCCESS':
      return {
        ...state,
        hxTaskUpdate: (state.hxTaskUpdate, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_HX_TASK_INFO_FAILURE':
      return {
        ...state,
        hxTaskUpdate: (state.hxTaskUpdate, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_HX_TASK_INFO':
      return {
        ...state,
        hxTaskUpdate: (state.hxTaskUpdate, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_HX_MODULE_INFO':
      return {
        ...state,
        hxModuleUpdate: (state.hxModuleUpdate, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_HX_MODULE_INFO_SUCCESS':
      return {
        ...state,
        hxModuleUpdate: (state.hxModuleUpdate, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_HX_MODULE_INFO_FAILURE':
      return {
        ...state,
        hxModuleUpdate: (state.hxModuleUpdate, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_HX_MODULE_INFO':
      return {
        ...state,
        hxModuleUpdate: (state.hxModuleUpdate, { loading: false, err: null, data: null }),
      };
    case 'GET_TASK_MESSAGES_INFO':
      return {
        ...state,
        taskMessages: (state.taskMessages, { loading: true, data: null, err: null }),
      };
    case 'GET_TASK_MESSAGES_INFO_SUCCESS':
      return {
        ...state,
        taskMessages: (state.taskMessages, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TASK_MESSAGES_INFO_FAILURE':
      return {
        ...state,
        taskMessages: (state.taskMessages, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO':
      return {
        ...state,
        taskChecklists: (state.taskChecklists, { loading: true, data: null, err: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        taskChecklists: (state.taskChecklists, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        taskChecklists: (state.taskChecklists, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
