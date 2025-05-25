const initialState = {
  vendorsCount: null,
  vendorsCountErr: null,
  vendorCountLoading: false,
  vendorFilters: {},
  vendorRows: {},
  vendorExportInfo: {},
  vendorsInfo: {},
  requestInfo: {},
  requestCountLoading: false,
  requestCountErr: null,
  requestCount: null,
  requestFilters: {},
  requestExportInfo: {},
  requestDetails: {},
  requestProductOrders: {},
  agreeProductOrders: {},
  addPurchaseRequestInfo: {},
  purchaseRequestRows: {},
  quotationCount: null,
  quotationCountErr: null,
  quotationCountLoading: false,
  quotationFilters: {},
  transferFilters: {},
  quotationInfo: {},
  partnerTagsInfo: {},
  paymentTerms: {},
  websitesInfo: {},
  fiscalPositions: {},
  accountInvoiceInfo: {},
  slaInfo: {},
  addVendorInfo: {},
  taxInfo: {},
  addRfqInfo: {},
  vendorGroupInfo: {},
  quotationDetails: {},
  stateChangeInfo: {},
  composeEmailInfo: {},
  updateRfqInfo: {},
  productOrders: {},
  taxesInfo: {},
  transfersInfo: {},
  transfersRows: {},
  transfersExportInfo: {},
  printReportInfo: {},
  transferDetails: {},
  stateValidateInfo: {},
  stockScrapInfo: {},
  templateInfo: {},
  templateDetails: {},
  moveOrders: {},
  vendorDetails: {},
  vendorContacts: {},
  vendorBanks: {},
  contactsInfo: {},
  vendorTags: {},
  storeLogInfo: {},
  activityTypesInfo: {},
  createActivityInfo: {},
  addReceiptInfo: {},
  updateReceiptInfo: {},
  pickingTypes: {},
  stockLocations: {},
  stockWarehouses: {},
  moveProducts: {},
  moveProductsV1: {},
  purchaseAgreementInfo: {},
  purchaseRequestInfo: {},
  purchaseRequestExportInfo: {},
  requestRows: {},
  bankList: {},
  isPO: false,
  productRedirectId: false,
  productsInfo: {},
  productsCount: {},
  addProductInfo: {},
  addReorderInfo: {},
  productCategoryInfo: {},
  productRows: {},
  hsCodeInfo: {},
  customerTaxesInfo: {},
  productFiltersInfo: {
    customFilters: [],
  },
  locationRouteInfo: {},
  productDetailsInfo: {},
  productsExportInfo: {},
  updateProductInfo: {},
  sellerIdsInfo: {},
  filterInitailValues: {},
  backorderInfo: {},
  isRequestQuotation: false,
  productNameInfo: {},
  unitNameInfo: {},
  addBankInfo: {},
  measuresInfo: {},
  reOrderingRulesCount: {},
  reorderingCountLoading: false,
  reOrderingRulesInfo: {},
  productTypes: {},
  reOrderingRulesFilters: {},
  vendorTableInfo: [],
  reOrderingRulesExportInfo: {},
  reOrderingRulesRows: {},
  reOrderingRuleDetailsInfo: {},
  isProducts: false,
  newProductId: false,
  updateReorderInfo: {},
  industriesInfo: {},
  emailChangeInfo: {},
  purchaseProjectInfo: {},
  purchaseAccountInfo: {},
  purchaseLocationInfo: {},
  purchaseBudgetInfo: {},
  purchaseSubCategoryInfo: {},
  transfersCount: null,
  transfersErr: null,
  transfersCountLoading: false,
  operationTypesInfo: {},
  stockProducts: {},
  stockQuantInfo: {},
  scrapProducts: {},
  purchaseAgreementFilters: {},
  purchaseAgreementListInfo: {},
  purchaseAgreementExport: {},
  purchaseAgreementRows: {},
  purchaseAgreementCount: null,
  purchaseAgreementCountErr: null,
  purchaseAgreementCountLoading: false,
  purchaseAgreementDetails: {},
  agreementStateChangeInfo: {},
  addPurchaseAgreementInfo: {},
  agreementTypeInfo: {},
  cancelTransferInfo: {},
  statusUpdateInfo: {},
  departmentMembers: {},
  departmentInfo: {},
  productCategoryGroup: {},
  reorderingFilters: {},
  productsData: {},
  noStatusUpdateInfo: {},
  moveProductsDetaills: {},
  uniqueCodeRecords: {},
  productQuantityInfo: {},
  unreserveInfo: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_RFQ_COUNT_INFO':
      return {
        ...state,
        quotationCountLoading: true,
      };
    case 'GET_RFQ_COUNT_INFO_SUCCESS':
      return {
        ...state,
        quotationCount: (state.quotationCount, action.payload),
        quotationCountLoading: false,
      };
    case 'GET_RFQ_COUNT_INFO_FAILURE':
      return {
        ...state,
        quotationCountErr: (state.quotationCountErr, action.error),
        quotationCountLoading: false,
      };
    case 'RFQ_FILTERS':
      return {
        ...state,
        quotationFilters: (state.quotationFilters, action.payload),
      };
    case 'GET_ROWS_TRANSFERS':
      return {
        ...state,
        transfersRows: (state.transfersRows, action.payload),
      };
    case 'FILTER_VALUES':
      return {
        ...state,
        filterInitailValues: (state.filterInitailValues, action.payload),
      };
    case 'TRANSFER_FILTERS':
      return {
        ...state,
        transferFilters: (state.transferFilters, action.payload),
      };
    case 'GET_RFQ_INFO':
      return {
        ...state,
        quotationInfo: (state.quotationInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_RFQ_INFO_SUCCESS':
      return {
        ...state,
        quotationInfo: (state.quotationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RFQ_INFO_FAILURE':
      return {
        ...state,
        quotationInfo: (state.quotationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRINT_CHANGE_INFO':
      return {
        ...state,
        printReportInfo: (state.printReportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRINT_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        printReportInfo: (state.printReportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRINT_CHANGE_INFO_FAILURE':
      return {
        ...state,
        printReportInfo: (state.printReportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PRINT_INFO':
      return {
        ...state,
        printReportInfo: (state.printReportInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_PURCHASE_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PURCHASE_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_PURCHASE_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PURCHASE_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_EMAIL_STATE_CHANGE_INFO':
      return {
        ...state,
        emailChangeInfo: (state.emailChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMAIL_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        emailChangeInfo: (state.emailChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_EMAIL_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        emailChangeInfo: (state.emailChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMAIL_STATE_RESET_INFO':
      return {
        ...state,
        emailChangeInfo: (state.emailChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_VALIDATE_INFO':
      return {
        ...state,
        stateValidateInfo: (state.stateValidateInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VALIDATE_INFO_SUCCESS':
      return {
        ...state,
        stateValidateInfo: (state.stateValidateInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_VALIDATE_INFO_FAILURE':
      return {
        ...state,
        stateValidateInfo: (state.stateValidateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VALIDATE_STATE_RESET_INFO':
      return {
        ...state,
        stateValidateInfo: (state.stateValidateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_BACKORDER_INFO':
      return {
        ...state,
        backorderInfo: (state.backorderInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BACKORDER_INFO_SUCCESS':
      return {
        ...state,
        backorderInfo: (state.backorderInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_BACKORDER_INFO_FAILURE':
      return {
        ...state,
        backorderInfo: (state.backorderInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_BACKORDER':
      return {
        ...state,
        backorderInfo: (state.backorderInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_EMAIL_INFO':
      return {
        ...state,
        composeEmailInfo: (state.composeEmailInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_EMAIL_INFO_SUCCESS':
      return {
        ...state,
        composeEmailInfo: (state.composeEmailInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_EMAIL_INFO_FAILURE':
      return {
        ...state,
        composeEmailInfo: (state.composeEmailInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_COMPSOE_EMAIL':
      return {
        ...state,
        composeEmailInfo: (state.composeEmailInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_SCRAP_INFO':
      return {
        ...state,
        stockScrapInfo: (state.stockScrapInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SCRAP_INFO_SUCCESS':
      return {
        ...state,
        stockScrapInfo: (state.stockScrapInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SCRAP_INFO_FAILURE':
      return {
        ...state,
        stockScrapInfo: (state.stockScrapInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SCRAP':
      return {
        ...state,
        stockScrapInfo: (state.stockScrapInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_VENDORS_COUNT_INFO':
      return {
        ...state,
        vendorCountLoading: true,
      };
    case 'GET_VENDORS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        vendorsCount: (state.vendorsCount, action.payload),
        vendorCountLoading: false,
      };
    case 'GET_VENDORS_COUNT_INFO_FAILURE':
      return {
        ...state,
        vendorsCountErr: (state.vendorsCountErr, action.error),
        vendorCountLoading: false,
      };
    case 'VENDOR_FILTERS':
      return {
        ...state,
        vendorFilters: (state.vendorFilters, action.payload),
      };
    case 'GET_VENDORS_INFO':
      return {
        ...state,
        vendorsInfo: (state.vendorsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDORS_INFO_SUCCESS':
      return {
        ...state,
        vendorsInfo: (state.vendorsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDORS_INFO_FAILURE':
      return {
        ...state,
        vendorsInfo: (state.vendorsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PARTNER_TAGS_INFO':
      return {
        ...state,
        partnerTagsInfo: (state.partnerTagsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PARTNER_TAGS_INFO_SUCCESS':
      return {
        ...state,
        partnerTagsInfo: (state.partnerTagsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARTNER_TAGS_INFO_FAILURE':
      return {
        ...state,
        partnerTagsInfo: (state.partnerTagsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PAYMENT_TERMS_INFO':
      return {
        ...state,
        paymentTerms: (state.paymentTerms, { loading: true, data: null, err: null }),
      };
    case 'GET_PAYMENT_TERMS_INFO_SUCCESS':
      return {
        ...state,
        paymentTerms: (state.paymentTerms, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PAYMENT_TERMS_INFO_FAILURE':
      return {
        ...state,
        paymentTerms: (state.paymentTerms, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WEBSITES_INFO':
      return {
        ...state,
        websitesInfo: (state.websitesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WEBSITES_INFO_SUCCESS':
      return {
        ...state,
        websitesInfo: (state.websitesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WEBSITES_INFO_FAILURE':
      return {
        ...state,
        websitesInfo: (state.websitesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FISCAL_POSITIONS_INFO':
      return {
        ...state,
        fiscalPositions: (state.fiscalPositions, { loading: true, data: null, err: null }),
      };
    case 'GET_FISCAL_POSITIONS_INFO_SUCCESS':
      return {
        ...state,
        fiscalPositions: (state.fiscalPositions, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_FISCAL_POSITIONS_INFO_FAILURE':
      return {
        ...state,
        fiscalPositions: (state.fiscalPositions, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INVOICE_ACCOUNTS_INFO':
      return {
        ...state,
        accountInvoiceInfo: (state.accountInvoiceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INVOICE_ACCOUNTS_INFO_SUCCESS':
      return {
        ...state,
        accountInvoiceInfo: (state.accountInvoiceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INVOICE_ACCOUNTS_INFO_FAILURE':
      return {
        ...state,
        accountInvoiceInfo: (state.accountInvoiceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_INFO':
      return {
        ...state,
        slaInfo: (state.slaInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_INFO_SUCCESS':
      return {
        ...state,
        slaInfo: (state.slaInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_INFO_FAILURE':
      return {
        ...state,
        slaInfo: (state.slaInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_VENDOR_INFO':
      return {
        ...state,
        addVendorInfo: (state.addVendorInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_VENDOR_INFO_SUCCESS':
      return {
        ...state,
        addVendorInfo: (state.addVendorInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_VENDOR_INFO_FAILURE':
      return {
        ...state,
        addVendorInfo: (state.addVendorInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_VENDOR_INFO':
      return {
        ...state,
        addVendorInfo: (state.addVendorInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_PR_INFO':
      return {
        ...state,
        addPurchaseRequestInfo: (state.addPurchaseRequestInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PR_INFO_SUCCESS':
      return {
        ...state,
        addPurchaseRequestInfo: (state.addPurchaseRequestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PR_INFO_FAILURE':
      return {
        ...state,
        addPurchaseRequestInfo: (state.addPurchaseRequestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_PR_INFO':
      return {
        ...state,
        addPurchaseRequestInfo: (state.addPurchaseRequestInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_TAX_DETAILS_INFO':
      return {
        ...state,
        taxInfo: (state.taxInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TAX_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        taxInfo: (state.taxInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TAX_DETAILS_INFO_FAILURE':
      return {
        ...state,
        taxInfo: (state.taxInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_NAME_INFO':
      return {
        ...state,
        productNameInfo: (state.productNameInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_NAME_INFO_SUCCESS':
      return {
        ...state,
        productNameInfo: (state.productNameInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_NAME_INFO_FAILURE':
      return {
        ...state,
        productNameInfo: (state.productNameInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_UM_NAME_INFO':
      return {
        ...state,
        unitNameInfo: (state.unitNameInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_UM_NAME_INFO_SUCCESS':
      return {
        ...state,
        unitNameInfo: (state.unitNameInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_UM_NAME_INFO_FAILURE':
      return {
        ...state,
        unitNameInfo: (state.unitNameInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_RFQ_INFO':
      return {
        ...state,
        addRfqInfo: (state.addRfqInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_RFQ_INFO_SUCCESS':
      return {
        ...state,
        addRfqInfo: (state.addRfqInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_RFQ_INFO_FAILURE':
      return {
        ...state,
        addRfqInfo: (state.addRfqInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_RFQ_INFO':
      return {
        ...state,
        addRfqInfo: (state.addRfqInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_VENDOR_GROUP_INFO':
      return {
        ...state,
        vendorGroupInfo: (state.vendorGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_GROUP_INFO_SUCCESS':
      return {
        ...state,
        vendorGroupInfo: (state.vendorGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_GROUP_INFO_FAILURE':
      return {
        ...state,
        vendorGroupInfo: (state.vendorGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_QUOTATION_DETAILS_INFO':
      return {
        ...state,
        quotationDetails: (state.quotationDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_QUOTATION_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        quotationDetails: (state.quotationDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUOTATION_DETAILS_INFO_FAILURE':
      return {
        ...state,
        quotationDetails: (state.quotationDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_QUOTATION_INFO':
      return {
        ...state,
        quotationDetails: (state.quotationDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_TRANSFER_DETAILS_INFO':
      return {
        ...state,
        transferDetails: (state.transferDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_TRANSFER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        transferDetails: (state.transferDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRANSFER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        transferDetails: (state.transferDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TRANSFER_INFO':
      return {
        ...state,
        transferDetails: (state.transferDetails, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_RFQ_INFO':
      return {
        ...state,
        updateRfqInfo: (state.updateRfqInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_RFQ_INFO_SUCCESS':
      return {
        ...state,
        updateRfqInfo: (state.updateRfqInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_RFQ_INFO_FAILURE':
      return {
        ...state,
        updateRfqInfo: (state.updateRfqInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_RFQ_INFO':
      return {
        ...state,
        updateRfqInfo: (state.updateRfqInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_RP_INFO':
      return {
        ...state,
        requestProductOrders: (state.requestProductOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_RP_INFO_SUCCESS':
      return {
        ...state,
        requestProductOrders: (state.requestProductOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RP_INFO_FAILURE':
      return {
        ...state,
        requestProductOrders: (state.requestProductOrders, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_ORDERDS_INFO':
      return {
        ...state,
        productOrders: (state.productOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_ORDERDS_INFO_SUCCESS':
      return {
        ...state,
        productOrders: (state.productOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_ORDERDS_INFO_FAILURE':
      return {
        ...state,
        productOrders: (state.productOrders, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PRODUCT':
      return {
        ...state,
        productOrders: (state.productOrders, { loading: false, err: null, data: null }),
      };
    case 'GET_TRANSFERS_INFO':
      return {
        ...state,
        transfersInfo: (state.transfersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TRANSFERS_INFO_SUCCESS':
      return {
        ...state,
        transfersInfo: (state.transfersInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRANSFERS_INFO_FAILURE':
      return {
        ...state,
        transfersInfo: (state.transfersInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TAXES_INFO':
      return {
        ...state,
        taxesInfo: (state.taxesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TAXES_INFO_SUCCESS':
      return {
        ...state,
        taxesInfo: (state.taxesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TAXES_INFO_FAILURE':
      return {
        ...state,
        taxesInfo: (state.taxesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEMPLATE_INFO':
      return {
        ...state,
        templateInfo: (state.templateInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEMPLATE_INFO_SUCCESS':
      return {
        ...state,
        templateInfo: (state.templateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEMPLATE_INFO_FAILURE':
      return {
        ...state,
        templateInfo: (state.templateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TEMPLATE':
      return {
        ...state,
        templateInfo: (state.templateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_TEMP_DETAIL_INFO':
      return {
        ...state,
        templateDetails: (state.templateDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_TEMP_DETAIL_INFO_SUCCESS':
      return {
        ...state,
        templateDetails: (state.templateDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEMP_DETAIL_INFO_FAILURE':
      return {
        ...state,
        templateDetails: (state.templateDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TEMPLATE_DETAIL':
      return {
        ...state,
        templateDetails: (state.templateDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_MOVE_ORDERDS_INFO':
      return {
        ...state,
        moveOrders: (state.moveOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_MOVE_ORDERDS_INFO_SUCCESS':
      return {
        ...state,
        moveOrders: (state.moveOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MOVE_ORDERDS_INFO_FAILURE':
      return {
        ...state,
        moveOrders: (state.moveOrders, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_MOVE_ORDERS':
      return {
        ...state,
        moveOrders: (state.moveOrders, { loading: false, err: null, data: null }),
      };
    case 'GET_VENDOR_DETAILS':
      return {
        ...state,
        vendorDetails: (state.vendorDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_DETAILS_SUCCESS':
      return {
        ...state,
        vendorDetails: (state.vendorDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_DETAILS_FAILURE':
      return {
        ...state,
        vendorDetails: (state.vendorDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VENDOR_CONTACTS_INFO':
      return {
        ...state,
        vendorContacts: (state.vendorContacts, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_CONTACTS_INFO_SUCCESS':
      return {
        ...state,
        vendorContacts: (state.vendorContacts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_CONTACTS_INFO_FAILURE':
      return {
        ...state,
        vendorContacts: (state.vendorContacts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VENDOR_BANKS_INFO':
      return {
        ...state,
        vendorBanks: (state.vendorBanks, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_BANKS_INFO_SUCCESS':
      return {
        ...state,
        vendorBanks: (state.vendorBanks, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_BANKS_INFO_FAILURE':
      return {
        ...state,
        vendorBanks: (state.vendorBanks, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_VENDOR_BANK':
      return {
        ...state,
        vendorBanks: (state.vendorBanks, { loading: false, err: null, data: null }),
      };
    case 'GET_BANKS_INFO':
      return {
        ...state,
        bankList: (state.bankList, { loading: true, data: null, err: null }),
      };
    case 'GET_BANKS_INFO_SUCCESS':
      return {
        ...state,
        bankList: (state.bankList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BANKS_INFO_FAILURE':
      return {
        ...state,
        bankList: (state.bankList, { loading: false, err: action.error, data: null }),
      };
    case 'STORE_CONTACTS':
      return {
        ...state,
        contactsInfo: (state.contactsInfo, action.payload),
      };
    case 'GET_VENDOR_TAGS':
      return {
        ...state,
        vendorTags: (state.vendorTags, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_TAGS_SUCCESS':
      return {
        ...state,
        vendorTags: (state.vendorTags, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_TAGS_FAILURE':
      return {
        ...state,
        vendorTags: (state.vendorTags, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_VENDOR_TAGS':
      return {
        ...state,
        vendorTags: (state.vendorTags, { loading: false, err: null, data: null }),
      };
    case 'STORE_LOG_NOTES':
      return {
        ...state,
        storeLogInfo: (state.storeLogInfo, { loading: true, data: null, err: null }),
      };
    case 'STORE_LOG_NOTES_SUCCESS':
      return {
        ...state,
        storeLogInfo: (state.storeLogInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'STORE_LOG_NOTES_FAILURE':
      return {
        ...state,
        storeLogInfo: (state.storeLogInfo, { loading: false, err: action.error, data: null }),
      };
    case 'STORE_LOG_NOTES_RESET':
      return {
        ...state,
        storeLogInfo: (state.storeLogInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ACTIVITY_TYPES':
      return {
        ...state,
        activityTypesInfo: (state.activityTypesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ACTIVITY_TYPES_SUCCESS':
      return {
        ...state,
        activityTypesInfo: (state.activityTypesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ACTIVITY_TYPES_FAILURE':
      return {
        ...state,
        activityTypesInfo: (state.activityTypesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_MAIL_ACTIVITY_INFO':
      return {
        ...state,
        createActivityInfo: (state.createActivityInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_MAIL_ACTIVITY_INFO_SUCCESS':
      return {
        ...state,
        createActivityInfo: (state.createActivityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_MAIL_ACTIVITY_INFO_FAILURE':
      return {
        ...state,
        createActivityInfo: (state.createActivityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_ACTIVITY_INFO':
      return {
        ...state,
        createActivityInfo: (state.createActivityInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_STOCK_PICKING_TYPES_INFO':
      return {
        ...state,
        pickingTypes: (state.pickingTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_PICKING_TYPES_INFO_SUCCESS':
      return {
        ...state,
        pickingTypes: (state.pickingTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_PICKING_TYPES_INFO_FAILURE':
      return {
        ...state,
        pickingTypes: (state.pickingTypes, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_RECEIPT_INFO':
      return {
        ...state,
        addReceiptInfo: (state.addReceiptInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_RECEIPT_INFO_SUCCESS':
      return {
        ...state,
        addReceiptInfo: (state.addReceiptInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_RECEIPT_INFO_FAILURE':
      return {
        ...state,
        addReceiptInfo: (state.addReceiptInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_RECEIPT':
      return {
        ...state,
        addReceiptInfo: (state.addReceiptInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_RECEIPT_INFO':
      return {
        ...state,
        updateReceiptInfo: (state.updateReceiptInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_RECEIPT_INFO_SUCCESS':
      return {
        ...state,
        updateReceiptInfo: (state.updateReceiptInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_RECEIPT_INFO_FAILURE':
      return {
        ...state,
        updateReceiptInfo: (state.updateReceiptInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_RECEIPT':
      return {
        ...state,
        updateReceiptInfo: (state.updateReceiptInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_STOCK_LOCATIONS_INFO':
      return {
        ...state,
        stockLocations: (state.stockLocations, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_LOCATIONS_INFO_SUCCESS':
      return {
        ...state,
        stockLocations: (state.stockLocations, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_LOCATIONS_INFO_FAILURE':
      return {
        ...state,
        stockLocations: (state.stockLocations, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STOCK_WAREHOUSE_INFO':
      return {
        ...state,
        stockWarehouses: (state.stockWarehouses, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_WAREHOUSE_INFO_SUCCESS':
      return {
        ...state,
        stockWarehouses: (state.stockWarehouses, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_WAREHOUSE_INFO_FAILURE':
      return {
        ...state,
        stockWarehouses: (state.stockWarehouses, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MOVE_PRODUCTS_INFO':
      return {
        ...state,
        moveProducts: (state.moveProducts, { loading: true, data: null, err: null }),
      };
    case 'GET_MOVE_PRODUCTS_INFO_SUCCESS':
      return {
        ...state,
        moveProducts: (state.moveProducts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MOVE_PRODUCTS_INFO_FAILURE':
      return {
        ...state,
        moveProducts: (state.moveProducts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MOVE_PRODUCTSV1_INFO':
      return {
        ...state,
        moveProductsV1: (state.moveProductsV1, { loading: true, data: null, err: null }),
      };
    case 'GET_MOVE_PRODUCTSV1_INFO_SUCCESS':
      return {
        ...state,
        moveProductsV1: (state.moveProductsV1, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MOVE_PRODUCTSV1_INFO_FAILURE':
      return {
        ...state,
        moveProductsV1: (state.moveProductsV1, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MOVE_PRODUCTS_DETAIL':
      return {
        ...state,
        moveProductsDetaills: (state.moveProductsDetaills, { loading: true, data: null, err: null }),
      };
    case 'GET_MOVE_PRODUCTS_DETAIL_SUCCESS':
      return {
        ...state,
        moveProductsDetaills: (state.moveProductsDetaills, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MOVE_PRODUCTS_DETAIL_FAILURE':
      return {
        ...state,
        moveProductsDetaills: (state.moveProductsDetaills, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VENDORS_EXPORT_INFO':
      return {
        ...state,
        vendorExportInfo: (state.vendorExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDORS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        vendorExportInfo: (state.vendorExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDORS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        vendorExportInfo: (state.vendorExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TRANSFERS_EXPORT_INFO':
      return {
        ...state,
        transfersExportInfo: (state.transfersExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TRANSFERS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        transfersExportInfo: (state.transfersExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRANSFERS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        transfersExportInfo: (state.transfersExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_RFQ_EXPORT_INFO':
      return {
        ...state,
        purchaseRequestExportInfo: (state.purchaseRequestExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_RFQ_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        purchaseRequestExportInfo: (state.purchaseRequestExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RFQ_EXPORT_INFO_FAILURE':
      return {
        ...state,
        purchaseRequestExportInfo: (state.purchaseRequestExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCTS_EXPORT':
      return {
        ...state,
        productsExportInfo: (state.productsExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCTS_EXPORT_SUCCESS':
      return {
        ...state,
        productsExportInfo: (state.productsExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCTS_EXPORT_FAILURE':
      return {
        ...state,
        productsExportInfo: (state.productsExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PURCHASE_AGREEMENT_INFO':
      return {
        ...state,
        purchaseAgreementInfo: (state.purchaseAgreementInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PURCHASE_AGREEMENT_INFO_SUCCESS':
      return {
        ...state,
        purchaseAgreementInfo: (state.purchaseAgreementInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PURCHASE_AGREEMENT_INFO_FAILURE':
      return {
        ...state,
        purchaseAgreementInfo: (state.purchaseAgreementInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PURCHASE_REQUEST_INFO':
      return {
        ...state,
        purchaseRequestInfo: (state.purchaseRequestInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PURCHASE_REQUEST_INFO_SUCCESS':
      return {
        ...state,
        purchaseRequestInfo: (state.purchaseRequestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PURCHASE_REQUEST_INFO_FAILURE':
      return {
        ...state,
        purchaseRequestInfo: (state.purchaseRequestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_VENDOR':
      return {
        ...state,
        vendorRows: (state.vendorRows, action.payload),
      };
    case 'GET_ROWS_REQUEST':
      return {
        ...state,
        requestRows: (state.requestRows, action.payload),
      };
    case 'GET_ROWS_PRODUCT':
      return {
        ...state,
        productRows: (state.productRows, action.payload),
      };
    case 'IS_PO':
      return {
        ...state,
        isPO: action.payload,
      };
    case 'IS_REQUESTQUOTATION':
      return {
        ...state,
        isRequestQuotation: action.payload,
      };
    case 'PRODUCT_REDIRECT_ID':
      return {
        ...state,
        productRedirectId: action.payload,
      };
    case 'GET_PRODUCTS_LIST':
      return {
        ...state,
        productsInfo: (state.productsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCTS_SUCCESS_LIST':
      return {
        ...state,
        productsInfo: (state.productsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCTS_FAILURE_LIST':
      return {
        ...state,
        productsInfo: (state.productsInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_PRODUCTS_COUNT':
      return {
        ...state,
        productsCount: (state.productsCount, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCTS_COUNT_SUCCESS':
      return {
        ...state,
        productsCount: (state.productsCount, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_PRODUCTS_COUNT_FAILURE':
      return {
        ...state,
        productsCount: (state.productsCount, { loading: false, data: null, err: action.error }),
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        addProductInfo: (state.addProductInfo, { loading: true, data: null, err: null }),
      };
    case 'ADD_PRODUCT_SUCCESS':
      return {
        ...state,
        addProductInfo: (state.addProductInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'ADD_PRODUCT_FAILURE':
      return {
        ...state,
        addProductInfo: (state.addProductInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_ADD_PRODUCT':
      return {
        ...state,
        addProductInfo: (state.addProductInfo, { loading: false, data: null, err: null }),
      };
    case 'ADD_REORDERING_RULES':
      return {
        ...state,
        addReorderInfo: (state.addReorderInfo, { loading: true, data: null, err: null }),
      };
    case 'ADD_REORDERING_RULES_SUCCESS':
      return {
        ...state,
        addReorderInfo: (state.addReorderInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'ADD_REORDERING_RULES_FAILURE':
      return {
        ...state,
        addReorderInfo: (state.addReorderInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_ADD_REORDER':
      return {
        ...state,
        addReorderInfo: (state.addReorderInfo, { loading: false, data: null, err: null }),
      };
    case 'ADD_BANK':
      return {
        ...state,
        addBankInfo: (state.addBankInfo, { loading: true, data: null, err: null }),
      };
    case 'ADD_BANK_SUCCESS':
      return {
        ...state,
        addBankInfo: (state.addBankInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'ADD_BANK_FAILURE':
      return {
        ...state,
        addBankInfo: (state.addBankInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_ADD_BANK':
      return {
        ...state,
        addBankInfo: (state.addBankInfo, { loading: false, data: null, err: null }),
      };
    case 'PRODUCT_CATEGORY_INFO':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'PRODUCT_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'PRODUCT_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_HS_CODE':
      return {
        ...state,
        hsCodeInfo: (state.hsCodeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_HS_CODE_SUCCESS':
      return {
        ...state,
        hsCodeInfo: (state.hsCodeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HS_CODE_FAILURE':
      return {
        ...state,
        hsCodeInfo: (state.hsCodeInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_CUSTOMER_TAXES':
      return {
        ...state,
        customerTaxesInfo: (state.customerTaxesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CUSTOMER_TAXES_SUCCESS':
      return {
        ...state,
        customerTaxesInfo: (state.customerTaxesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CUSTOMER_TAXES_FAILURE':
      return {
        ...state,
        customerTaxesInfo: (state.customerTaxesInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_LOCATION_ROUTE':
      return {
        ...state,
        locationRouteInfo: (state.locationRouteInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_ROUTE_SUCCESS':
      return {
        ...state,
        locationRouteInfo: (state.locationRouteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_ROUTE_FAILURE':
      return {
        ...state,
        locationRouteInfo: (state.locationRouteInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_PRODUCT_DETAILS':
      return {
        ...state,
        productDetailsInfo: (state.productDetailsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_DETAILS_SUCCESS':
      return {
        ...state,
        productDetailsInfo: (state.productDetailsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_DETAILS_FAILURE':
      return {
        ...state,
        productDetailsInfo: (state.productDetailsInfo, { loading: false, data: null, err: action.error }),
      };
    case 'EDIT_PRODUCT':
      return {
        ...state,
        updateProductInfo: (state.updateProductInfo, { loading: true, data: null, err: null }),
      };
    case 'EDIT_PRODUCT_SUCCESS':
      return {
        ...state,
        updateProductInfo: (state.updateProductInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'EDIT_PRODUCT_FAILURE':
      return {
        ...state,
        updateProductInfo: (state.updateProductInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_SELLER_IDS':
      return {
        ...state,
        sellerIdsInfo: (state.sellerIdsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SELLER_IDS_SUCCESS':
      return {
        ...state,
        sellerIdsInfo: (state.sellerIdsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SELLER_IDS_FAILURE':
      return {
        ...state,
        sellerIdsInfo: (state.sellerIdsInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_SELLER_IDS_INFO':
      return {
        ...state,
        sellerIdsInfo: (state.sellerIdsInfo, { loading: false, data: null, err: null }),
      };
    case 'CLEAR_EDIT_PRODUCT':
      return {
        ...state,
        updateProductInfo: (state.updateProductInfo, { loading: false, data: null, err: null }),
      };
    case 'PRODUCT_FILTERS':
      return {
        ...state,
        productFiltersInfo: (state.productFiltersInfo, action.payload),
      };
    case 'GET_PR_INFO':
      return {
        ...state,
        requestInfo: (state.requestInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_INFO_SUCCESS':
      return {
        ...state,
        requestInfo: (state.requestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_INFO_FAILURE':
      return {
        ...state,
        requestInfo: (state.requestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_COUNT_INFO':
      return {
        ...state,
        requestCountLoading: true,
      };
    case 'GET_PR_COUNT_INFO_SUCCESS':
      return {
        ...state,
        requestCount: (state.requestCount, action.payload),
        requestCountLoading: false,
      };
    case 'GET_PR_COUNT_INFO_FAILURE':
      return {
        ...state,
        requestCountErr: (state.requestCountErr, action.error),
        requestCountLoading: false,
      };
    case 'PR_FILTERS':
      return {
        ...state,
        requestFilters: (state.requestFilters, action.payload),
      };
    case 'GET_PR_EXPORT_INFO':
      return {
        ...state,
        requestExportInfo: (state.requestExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        requestExportInfo: (state.requestExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_EXPORT_INFO_FAILURE':
      return {
        ...state,
        requestExportInfo: (state.requestExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_DETAILS_INFO':
      return {
        ...state,
        requestDetails: (state.requestDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        requestDetails: (state.requestDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_DETAILS_INFO_FAILURE':
      return {
        ...state,
        requestDetails: (state.requestDetails, { loading: false, data: null, err: action.error }),
      };
    case 'GET_ROWS_PURCHASE_REQUEST':
      return {
        ...state,
        purchaseRequestRows: (state.purchaseRequestRows, action.payload),
      };
    case 'GET_MEASURES':
      return {
        ...state,
        measuresInfo: (state.measuresInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MEASURES_SUCCESS':
      return {
        ...state,
        measuresInfo: (state.measuresInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MEASURES_FAILURE':
      return {
        ...state,
        measuresInfo: (state.measuresInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_TAXES_DATA':
      return {
        ...state,
        taxesInfo: (state.taxesInfo, { loading: null, data: null, err: null }),
      };
    case 'GET_REORDERING_RULES_INFO':
      return {
        ...state,
        reOrderingRulesInfo: (state.reOrderingRulesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_REORDERING_RULES_INFO_SUCCESS':
      return {
        ...state,
        reOrderingRulesInfo: (state.reOrderingRulesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REORDERING_RULES_INFO_FAILURE':
      return {
        ...state,
        reOrderingRulesInfo: (state.reOrderingRulesInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_REORDERING_RULES_COUNT':
      return {
        ...state,
        reOrderingRulesCount: (state.reOrderingRulesCount, { loading: true, data: null, err: null }),
        reorderingCountLoading: true,
      };
    case 'GET_REORDERING_RULES_COUNT_SUCCESS':
      return {
        ...state,
        reOrderingRulesCount: (state.reOrderingRulesCount, { loading: false, data: action.payload, err: null }),
        reorderingCountLoading: false,
      };
    case 'GET_REORDERING_RULES_COUNT_FAILURE':
      return {
        ...state,
        reOrderingRulesCount: (state.reOrderingRulesCount, { loading: false, data: null, err: action.error }),
        reorderingCountLoading: false,
      };
    case 'GET_PRODUCT_TYPE':
      return {
        ...state,
        productTypes: (state.productTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_TYPE_SUCCESS':
      return {
        ...state,
        productTypes: (state.productTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_TYPE_FAILURE':
      return {
        ...state,
        productTypes: (state.productTypes, { loading: false, data: null, err: action.error }),
      };
    case 'REORDERING_RULES_FILTERS':
      return {
        ...state,
        reOrderingRulesFilters: (state.reOrderingRulesFilters, action.payload),
      };
    case 'SET_TABLE_DATA':
      return {
        ...state,
        vendorTableInfo: (state.vendorTableInfo, action.payload),
      };
    case 'CLEAR_TABLE_DATA':
      return {
        ...state,
        vendorTableInfo: (state.vendorTableInfo, []),
      };
    case 'GET_REORDERING_RULES_EXPORT':
      return {
        ...state,
        reOrderingRulesExportInfo: (state.reOrderingRulesExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_REORDERING_RULES_EXPORT_SUCCESS':
      return {
        ...state,
        reOrderingRulesExportInfo: (state.reOrderingRulesExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REORDERING_RULES_EXPORT_FAILURE':
      return {
        ...state,
        reOrderingRulesExportInfo: (state.reOrderingRulesExportInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_ROWS_REORDERING_RULES':
      return {
        ...state,
        reOrderingRulesRows: (state.reOrderingRulesRows, action.payload),
      };
    case 'GET_REORDER_RULE_DETAILS':
      return {
        ...state,
        reOrderingRuleDetailsInfo: (state.reOrderingRuleDetailsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_REORDER_RULE_DETAILS_SUCCESS':
      return {
        ...state,
        reOrderingRuleDetailsInfo: (state.reOrderingRuleDetailsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REORDER_RULE_DETAILS_FAILURE':
      return {
        ...state,
        reOrderingRuleDetailsInfo: (state.reOrderingRuleDetailsInfo, { loading: false, data: null, err: action.error }),
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        isProducts: (state.isProducts, action.payload),
      };
    case 'SET_VIEW_PRODUCT':
      return {
        ...state,
        newProductId: (state.newProductId, action.payload),
      };
    case 'UPDATE_REORDERING_RULE':
      return {
        ...state,
        updateReorderInfo: (state.updateReorderInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_REORDERING_RULE_SUCCESS':
      return {
        ...state,
        updateReorderInfo: (state.updateReorderInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_REORDERING_RULE_FAILURE':
      return {
        ...state,
        updateReorderInfo: (state.updateReorderInfo, { loading: false, data: null, err: action.error }),
      };
    case 'CLEAR_EDIT_REODRDER':
      return {
        ...state,
        updateReorderInfo: (state.updateReorderInfo, { loading: null, data: null, err: null }),
      };
    case 'GET_INDUSTRIES':
      return {
        ...state,
        industriesInfo: (state.industriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INDUSTRIES_SUCCESS':
      return {
        ...state,
        industriesInfo: (state.industriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INDUSTRIES_FAILURE':
      return {
        ...state,
        industriesInfo: (state.industriesInfo, { loading: false, data: null, err: action.error }),
      };
    case 'GET_PR_PROJECT':
      return {
        ...state,
        purchaseProjectInfo: (state.purchaseProjectInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_PROJECT_SUCCESS':
      return {
        ...state,
        purchaseProjectInfo: (state.purchaseProjectInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_PROJECT_FAILURE':
      return {
        ...state,
        purchaseProjectInfo: (state.purchaseProjectInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_ACCOUNT':
      return {
        ...state,
        purchaseAccountInfo: (state.purchaseAccountInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_ACCOUNT_SUCCESS':
      return {
        ...state,
        purchaseAccountInfo: (state.purchaseAccountInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_ACCOUNT_FAILURE':
      return {
        ...state,
        purchaseAccountInfo: (state.purchaseAccountInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_LOCATION':
      return {
        ...state,
        purchaseLocationInfo: (state.purchaseLocationInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_LOCATION_SUCCESS':
      return {
        ...state,
        purchaseLocationInfo: (state.purchaseLocationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_LOCATION_FAILURE':
      return {
        ...state,
        purchaseLocationInfo: (state.purchaseLocationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_BUDGET':
      return {
        ...state,
        purchaseBudgetInfo: (state.purchaseBudgetInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_BUDGET_SUCCESS':
      return {
        ...state,
        purchaseBudgetInfo: (state.purchaseBudgetInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_BUDGET_FAILURE':
      return {
        ...state,
        purchaseBudgetInfo: (state.purchaseBudgetInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PR_SUBCATEGORY':
      return {
        ...state,
        purchaseSubCategoryInfo: (state.purchaseSubCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PR_SUBCATEGORY_SUCCESS':
      return {
        ...state,
        purchaseSubCategoryInfo: (state.purchaseSubCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PR_SUBCATEGORY_FAILURE':
      return {
        ...state,
        purchaseSubCategoryInfo: (state.purchaseSubCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TRANSFERS_COUNT_INFO':
      return {
        ...state,
        transfersCountLoading: true,
      };
    case 'GET_TRANSFERS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        transfersCount: (state.transfersCount, action.payload),
        transfersCountLoading: false,
      };
    case 'GET_TRANSFERS_COUNT_INFO_FAILURE':
      return {
        ...state,
        transfersCountErr: (state.transfersCountErr, action.error),
        transfersCountLoading: false,
      };
    case 'GET_STOCK_PICKING_TYPES_LIST_INFO':
      return {
        ...state,
        operationTypesInfo: (state.operationTypesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_PICKING_TYPES_LIST_INFO_SUCCESS':
      return {
        ...state,
        operationTypesInfo: (state.operationTypesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_PICKING_TYPES_LIST_INFO_FAILURE':
      return {
        ...state,
        operationTypesInfo: (state.operationTypesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STOCK_PRODUCTS_INFO':
      return {
        ...state,
        stockProducts: (state.stockProducts, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_PRODUCTS_INFO_SUCCESS':
      return {
        ...state,
        stockProducts: (state.stockProducts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_PRODUCTS_INFO_FAILURE':
      return {
        ...state,
        stockProducts: (state.stockProducts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_QUANT_PRODUCTS_INFO':
      return {
        ...state,
        stockQuantInfo: (state.stockQuantInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_QUANT_PRODUCTS_INFO_SUCCESS':
      return {
        ...state,
        stockQuantInfo: (state.stockQuantInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUANT_PRODUCTS_INFO_FAILURE':
      return {
        ...state,
        stockQuantInfo: (state.stockQuantInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SCRAP_PRODUCTS_INFO':
      return {
        ...state,
        scrapProducts: (state.scrapProducts, { loading: true, data: null, err: null }),
      };
    case 'GET_SCRAP_PRODUCTS_INFO_SUCCESS':
      return {
        ...state,
        scrapProducts: (state.scrapProducts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SCRAP_PRODUCTS_INFO_FAILURE':
      return {
        ...state,
        scrapProducts: (state.scrapProducts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AGREE_COUNT_INFO':
      return {
        ...state,
        purchaseAgreementCountLoading: true,
      };
    case 'GET_AGREE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        purchaseAgreementCount: (state.purchaseAgreementCount, action.payload),
        purchaseAgreementCountLoading: false,
      };
    case 'GET_AGREE_COUNT_INFO_FAILURE':
      return {
        ...state,
        purchaseAgreementCountErr: (state.purchaseAgreementCountErr, action.error),
        purchaseAgreementCount: (state.purchaseAgreementCount, false),
        purchaseAgreementCountLoading: false,
      };
    case 'AGREE_FILTERS':
      return {
        ...state,
        purchaseAgreementFilters: (state.purchaseAgreementFilters, action.payload),
      };
    case 'GET_AGREE_LIST_INFO':
      return {
        ...state,
        purchaseAgreementListInfo: (state.purchaseAgreementListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AGREE_LIST_INFO_SUCCESS':
      return {
        ...state,
        purchaseAgreementListInfo: (state.purchaseAgreementListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AGREE_LIST_INFO_FAILURE':
      return {
        ...state,
        purchaseAgreementListInfo: (state.purchaseAgreementListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AGREE_EXPORT_LIST_INFO':
      return {
        ...state,
        purchaseAgreementExport: (state.purchaseAgreementExport, { loading: true, data: null, err: null }),
      };
    case 'GET_AGREE_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        purchaseAgreementExport: (state.purchaseAgreementExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AGREE_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        purchaseAgreementExport: (state.purchaseAgreementExport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_AGREES':
      return {
        ...state,
        purchaseAgreementRows: (state.purchaseAgreementRows, action.payload),
      };
    case 'GET_AGREE_DETAILS_INFO':
      return {
        ...state,
        purchaseAgreementDetails: (state.purchaseAgreementDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_AGREE_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        purchaseAgreementDetails: (state.purchaseAgreementDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AGREE_DETAILS_INFO_FAILURE':
      return {
        ...state,
        purchaseAgreementDetails: (state.purchaseAgreementDetails, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_AGREE_INFO':
      return {
        ...state,
        purchaseAgreementDetails: (state.purchaseAgreementDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_AGREE_STATE_CHANGE_INFO':
      return {
        ...state,
        agreementStateChangeInfo: (state.agreementStateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AGREE_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        agreementStateChangeInfo: (state.agreementStateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_AGREE_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        agreementStateChangeInfo: (state.agreementStateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AGREE_STATE_RESET_INFO':
      return {
        ...state,
        agreementStateChangeInfo: (state.agreementStateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_AGREE_INFO':
      return {
        ...state,
        addPurchaseAgreementInfo: (state.addPurchaseAgreementInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_AGREE_INFO_SUCCESS':
      return {
        ...state,
        addPurchaseAgreementInfo: (state.addPurchaseAgreementInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_AGREE_INFO_FAILURE':
      return {
        ...state,
        addPurchaseAgreementInfo: (state.addPurchaseAgreementInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_AGREE_INFO':
      return {
        ...state,
        addPurchaseAgreementInfo: (state.addPurchaseAgreementInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_AGP_INFO':
      return {
        ...state,
        agreeProductOrders: (state.agreeProductOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_AGP_INFO_SUCCESS':
      return {
        ...state,
        agreeProductOrders: (state.agreeProductOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AGP_INFO_FAILURE':
      return {
        ...state,
        agreeProductOrders: (state.agreeProductOrders, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AT_INFO':
      return {
        ...state,
        agreementTypeInfo: (state.agreementTypeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AT_INFO_SUCCESS':
      return {
        ...state,
        agreementTypeInfo: (state.agreementTypeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AT_INFO_FAILURE':
      return {
        ...state,
        agreementTypeInfo: (state.agreementTypeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CANCEL_TRANSFER_INFO':
      return {
        ...state,
        cancelTransferInfo: (state.cancelTransferInfo, { loading: true, data: null, err: null }),
      };
    case 'CANCEL_TRANSFER_INFO_SUCCESS':
      return {
        ...state,
        cancelTransferInfo: (state.cancelTransferInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CANCEL_TRANSFER_INFO_FAILURE':
      return {
        ...state,
        cancelTransferInfo: (state.cancelTransferInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CANCEL_TRANSFER_INFO':
      return {
        ...state,
        cancelTransferInfo: (state.cancelTransferInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_TRANSFER_STATUS_INFO':
      return {
        ...state,
        statusUpdateInfo: (state.statusUpdateInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TRANSFER_STATUS_INFO_SUCCESS':
      return {
        ...state,
        statusUpdateInfo: (state.statusUpdateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_TRANSFER_STATUS_INFO_FAILURE':
      return {
        ...state,
        statusUpdateInfo: (state.statusUpdateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TRANSFER_STATUS_INFO':
      return {
        ...state,
        statusUpdateInfo: (state.statusUpdateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_DEP_INFO':
      return {
        ...state,
        departmentMembers: (state.departmentMembers, { loading: true, data: null, err: null }),
      };
    case 'GET_DEP_INFO_SUCCESS':
      return {
        ...state,
        departmentMembers: (state.departmentMembers, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DEP_INFO_FAILURE':
      return {
        ...state,
        departmentMembers: (state.departmentMembers, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ID_INFO':
      return {
        ...state,
        departmentInfo: (state.departmentInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ID_INFO_SUCCESS':
      return {
        ...state,
        departmentInfo: (state.departmentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ID_INFO_FAILURE':
      return {
        ...state,
        departmentInfo: (state.departmentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'PCG_INFO':
      return {
        ...state,
        productCategoryGroup: (state.productCategoryGroup, { loading: true, data: null, err: null }),
      };
    case 'PCG_INFO_SUCCESS':
      return {
        ...state,
        productCategoryGroup: (state.productCategoryGroup, { loading: false, data: action.payload.data, err: null }),
      };
    case 'PCG_INFO_FAILURE':
      return {
        ...state,
        productCategoryGroup: (state.productCategoryGroup, { loading: false, err: action.error, data: null }),
      };
    case 'REORDERING_FILTERS':
      return {
        ...state,
        reorderingFilters: (state.reorderingFilters, action.payload),
      };
    case 'GET_PRODUCT_DATA_INFO':
      return {
        ...state,
        productsData: (state.productsData, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_DATA_SUCCESS':
      return {
        ...state,
        productsData: (state.productsData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_DATA_FAILURE':
      return {
        ...state,
        productsData: (state.productsData, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_TRANSFER_NO_STATUS_INFO':
      return {
        ...state,
        noStatusUpdateInfo: (state.noStatusUpdateInfo, { loading: true, err: action.error, data: null }),
      };
    case 'UPDATE_TRANSFER_NO_STATUS_INFO_SUCCESS':
      return {
        ...state,
        noStatusUpdateInfo: (state.noStatusUpdateInfo, { loading: false, err: false, data: action.payload.data }),
      };
    case 'UPDATE_TRANSFER_NO_STATUS_INFO_FAILURE':
      return {
        ...state,
        noStatusUpdateInfo: (state.noStatusUpdateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_CODES_INFO':
      return {
        ...state,
        uniqueCodeRecords: (state.uniqueCodeRecords, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_CODES_INFO_SUCCESS':
      return {
        ...state,
        uniqueCodeRecords: (state.uniqueCodeRecords, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_CODES_INFO_FAILURE':
      return {
        ...state,
        uniqueCodeRecords: (state.uniqueCodeRecords, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_QUANTITY_INFO':
      return {
        ...state,
        productQuantityInfo: (state.productQuantityInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_QUANTITY_INFO_SUCCESS':
      return {
        ...state,
        productQuantityInfo: (state.productQuantityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_QUANTITY_INFO_FAILURE':
      return {
        ...state,
        productQuantityInfo: (state.productQuantityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PRODUCT_QUANTITY_INFO':
      return {
        ...state,
        productQuantityInfo: (state.productQuantityInfo, { loading: false, err: null, data: null }),
      };
      case 'GET_UNRESERVE_PRODUCTS_INFO':
        return {
          ...state,
          unreserveInfo: (state.unreserveInfo, { loading: true, data: null, err: null }),
        };
      case 'GET_UNRESERVE_PRODUCTS_INFO_SUCCESS':
        return {
          ...state,
          unreserveInfo: (state.unreserveInfo, { loading: false, data: action.payload.status, err: null }),
        };
      case 'GET_UNRESERVE_PRODUCTS_INFO_FAILURE':
        return {
          ...state,
          unreserveInfo: (state.unreserveInfo, { loading: false, err: action.error, data: null }),
        };
      case 'RESET_UNRESERVE_PRODUCTS_INFO':
        return {
          ...state,
          unreserveInfo: (state.unreserveInfo, { loading: false, err: null, data: null }),
        };
        case 'GET_COMPANY_PRICE_INFO':
          return {
            ...state,
            companyPrice: (state.companyPrice, { loading: true, data: null, err: null }),
          };
        case 'GET_COMPANY_PRICE_INFO_SUCCESS':
          return {
            ...state,
            companyPrice: (state.companyPrice, { loading: false, data: action.payload.data, err: null }),
          };
        case 'GET_COMPANY_PRICE_INFO_FAILURE':
          return {
            ...state,
            companyPrice: (state.companyPrice, { loading: false, err: action.error, data: null }),
          };
    default:
      return state;
  }
}

export default reducer;
