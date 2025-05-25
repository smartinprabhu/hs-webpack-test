import {
  getVendorsListInfo, getVendorsCountInfo,
  getPartnerTagsInfo, getPaymentTermsInfo,
  getFiscalPositionsInfo, getWebsitesInfo,
  getAccountsInfo, getSupportSlasInfo,
  getTaxDataInfo, createRfqInfo,
  createVendorInfo, getRequestQuotationListInfo, getRequestQuotationCountInfo, getVendorGroupsInfo, purchaseStateChangeInfo, emailStateChangeInfo, createComposeEmailInfo,
  getQuotatioDetailInfo, getUpdateRfqInfo, getProductOrdersInfo, getPrintReports, getTransferDetailInfo,
  getTaxesInfo, getTransfersInfo, validateStateChangeInfo, createStockScraps, getTemplateInfo, getTemplateDetails, getMoveOrders,
  getVendorDetails, getVendorContactsInfo,
  getVendorBanksInfo, getTagsSelecetd, storeLogNotesInfo,
  getActivityTypesInfo, addActivityInfo,
  getStockPickingTypesInfo, updateReceiptInfo,
  createReceiptInfo, getStockLocationsInfo, getStockWarehousesInfo,
  getMoveProductsInfo, getMoveProductsV1Info, updateTransferNoStatusInfo,
  getPurchaseAgreementInfo, getPurchaseRequestInfo, getBankLists, getVendorExportInfo, getRequestExportInfo,
  getProductsListInfo, getProductsCountInfo, createProduct, createReorderingRules, productCategoryList,
  getHsCodeInfo, getCustomerTaxesInfo, getLocationRouteInfo, getProductDetailsInfo,
  updateProductInfo, getSellerIdsInfo, getProductsExportInfo,
  getTransferExportInfo, backorderChangeInfo, createBank,
  getPurchaseRequestListInfo, getPurchaseRequestExportInfo, getProductQuantityInfo,
  getPurchaseRequestCountInfo, getPurchaseRequestDetails, getProductNames, getUnitNames,
  getMeasuresInfo, getReOrderingRulesInfo, getReOrderingCountInfo, getProductTypesInfo,
  getReOrderingRulesExportInfo, getReorderRuleDetailsInfo, updateReOrderingRuleInfo, createPurchaseRequestInfo,
  getIndustriesInfo, getRequestProductInfo, getPurchaseProjects, getPurchaseAccounts, getPurchaseLocations, getPurchaseBudgets, getPurchaseSubCategorys, getTransfersCountInfo,
  getStockPickingTypesListInfo, getStockProductsInfo, getStockQuantProductsInfo, getScrapProductsInfo, getPurchaseAgreementListInfo, getPurchaseAgreementCountInfo,
  getPurchaseAgreementListExportInfo, getPurchaseAgreementDetails, agreementStateChangeInfo,
  createAgreementRequestInfo, getAgreeProductInfo, getCodeExistsInfo, getAgreementTypes, cancelTtransferInfo, updateTransferStatusInfo, getInventoryDepartments, getProductCategoryGroups, productsListData,
  getMoveProductsDetails, setUnreserveProductsInfo, getCompanyPriceInfo,
} from './actions'; 

export const VENDOR_FILTERS = 'VENDOR_FILTERS';
export const RFQ_FILTERS = 'RFQ_FILTERS';
export const TRANSFER_FILTERS = 'TRANSFER_FILTERS';
export const RESET_ADD_VENDOR_INFO = 'RESET_ADD_VENDOR_INFO';
export const RESET_ADD_PR_INFO = 'RESET_ADD_PR_INFO';
export const RESET_ADD_RFQ_INFO = 'RESET_ADD_RFQ_INFO';
export const GET_PURCHASE_STATE_RESET_INFO = 'GET_PURCHASE_STATE_RESET_INFO';
export const RESET_QUOTATION_INFO = 'RESET_QUOTATION_INFO';
export const RESET_UPDATE_RFQ_INFO = 'RESET_UPDATE_RFQ_INFO';
export const RESET_PRINT_INFO = 'RESET_PRINT_INFO';
export const RESET_TRANSFER_INFO = 'RESET_TRANSFER_INFO';
export const GET_VALIDATE_STATE_RESET_INFO = 'GET_VALIDATE_STATE_RESET_INFO';
export const RESET_SCRAP = 'RESET_SCRAP';
export const RESET_PRODUCT = 'RESET_PRODUCT';
export const RESET_TEMPLATE = 'RESET_TEMPLATE';
export const RESET_TEMPLATE_DETAIL = 'RESET_TEMPLATE_DETAIL';
export const RESET_MOVE_ORDERS = 'RESET_MOVE_ORDERS';
export const RESET_COMPSOE_EMAIL = 'RESET_COMPSOE_EMAIL';
export const STORE_CONTACTS = 'STORE_CONTACTS';
export const STORE_LOG_NOTES_RESET = 'STORE_LOG_NOTES_RESET';
export const RESET_ADD_ACTIVITY_INFO = 'RESET_ADD_ACTIVITY_INFO';
export const RESET_ADD_RECEIPT = 'RESET_ADD_RECEIPT';
export const IS_PO = 'IS_PO';
export const IS_REQUESTQUOTATION = 'IS_REQUESTQUOTATION';
export const RESET_UPDATE_RECEIPT = 'RESET_UPDATE_RECEIPT';
export const RESET_VENDOR_BANK = 'RESET_VENDOR_BANK';
export const GET_ROWS_VENDOR = 'GET_ROWS_VENDOR';
export const GET_ROWS_REQUEST = 'GET_ROWS_REQUEST';
export const GET_ROWS_PRODUCT = 'GET_ROWS_PRODUCT';
export const GET_ROWS_TRANSFERS = 'GET_ROWS_TRANSFERS';
export const CLEAR_ADD_PRODUCT = 'CLEAR_ADD_PRODUCT';
export const PRODUCT_FILTERS = 'PRODUCT_FILTERS';
export const CLEAR_EDIT_PRODUCT = 'CLEAR_EDIT_PRODUCT';
export const CLEAR_SELLER_IDS_INFO = 'CLEAR_SELLER_IDS_INFO';
export const FILTER_VALUES = 'FILTER_VALUES';
export const RESET_BACKORDER = 'RESET_BACKORDER';
export const CLEAR_ADD_BANK = 'CLEAR_ADD_BANK';
export const GET_ROWS_PURCHASE_REQUEST = 'GET_ROWS_PURCHASE_REQUEST';
export const PR_FILTERS = 'PR_FILTERS';
export const CLEAR_TAXES_DATA = 'CLEAR_TAXES_DATA';
export const REORDERING_RULES_FILTERS = 'REORDERING_RULES_FILTERS';
export const SET_TABLE_DATA = 'SET_TABLE_DATA';
export const CLEAR_TABLE_DATA = 'CLEAR_TABLE_DATA';
export const GET_ROWS_REORDERING_RULES = 'GET_ROWS_REORDERING_RULES';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_VIEW_PRODUCT = 'SET_VIEW_PRODUCT';
export const CLEAR_ADD_REORDER = 'CLEAR_ADD_REORDER';
export const CLEAR_EDIT_REODRDER = 'CLEAR_EDIT_REODRDER';
export const PRODUCT_REDIRECT_ID = 'PRODUCT_REDIRECT_ID';
export const GET_EMAIL_STATE_RESET_INFO = 'GET_EMAIL_STATE_RESET_INFO';
export const AGREE_FILTERS = 'AGREE_FILTERS';
export const GET_ROWS_AGREES = 'GET_ROWS_AGREES';
export const GET_AGREE_STATE_RESET_INFO = 'GET_AGREE_STATE_RESET_INFO';
export const RESET_ADD_AGREE_INFO = 'RESET_ADD_AGREE_INFO';
export const RESET_AGREE_INFO = 'RESET_AGREE_INFO';
export const RESET_VENDOR_TAGS = 'RESET_VENDOR_TAGS';
export const RESET_CANCEL_TRANSFER_INFO = 'RESET_CANCEL_TRANSFER_INFO';
export const RESET_TRANSFER_STATUS_INFO = 'RESET_TRANSFER_STATUS_INFO';
export const REORDERING_FILTERS = 'REORDERING_FILTERS';
export const RESET_PRODUCT_QUANTITY_INFO = 'RESET_PRODUCT_QUANTITY_INFO';
export const RESET_UNRESERVE_PRODUCTS_INFO = 'RESET_UNRESERVE_PRODUCTS_INFO';

export function getVendorsList(company, model, limit, offset, states, languages, customFilters, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getVendorsListInfo(company, model, limit, offset, states, languages, customFilters, sortByValue, sortFieldValue));
  };
}

export function getVendorExport(company, model, limit, offset, fields, states, languages, customFilters, rows) {
  return (dispatch) => {
    dispatch(getVendorExportInfo(company, model, limit, offset, fields, states, languages, customFilters, rows));
  };
}

export function getVendorsCount(company, model, states, languages, customFilters) {
  return (dispatch) => {
    dispatch(getVendorsCountInfo(company, model, states, languages, customFilters));
  };
}

export function getRequestQuotationList(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue, isPo) {
  return (dispatch) => {
    dispatch(getRequestQuotationListInfo(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue, isPo));
  };
}

export function getRequestExport(company, model, limit, offset, fields, states, order, vendor, customFilters, sortByValue, sortFieldValue, isPo, rows) {
  return (dispatch) => {
    dispatch(getRequestExportInfo(company, model, limit, offset, fields, states, order, vendor, customFilters, sortByValue, sortFieldValue, isPo, rows));
  };
}

export function getRequestQuotationCount(company, model, states, order, vendor, customFilters, isPo) {
  return (dispatch) => {
    dispatch(getRequestQuotationCountInfo(company, model, states, order, vendor, customFilters, isPo));
  };
}

export function purchaseStateChange(id, state, model, contex) {
  return (dispatch) => {
    dispatch(purchaseStateChangeInfo(id, state, model, contex));
  };
}

export function emailStateChange(id, state, model) {
  return (dispatch) => {
    dispatch(emailStateChangeInfo(id, state, model));
  };
}

export function getPurchaseAgreements(company, model, vendor) {
  return (dispatch) => {
    dispatch(getPurchaseAgreementInfo(company, model, vendor));
  };
}

export function getPurchaseRequests(company, model) {
  return (dispatch) => {
    dispatch(getPurchaseRequestInfo(company, model));
  };
}

export function validateStateChange(id, state, model) {
  return (dispatch) => {
    dispatch(validateStateChangeInfo(id, state, model));
  };
}

export function backorderChange(id, state, model) {
  return (dispatch) => {
    dispatch(backorderChangeInfo(id, state, model));
  };
}

export function getPrintReport(id, reportName, options) {
  return (dispatch) => {
    dispatch(getPrintReports(id, reportName, options));
  };
}

export function getVendorFilters(statusValues, languageValues, customFiltersList) {
  const result = { statuses: statusValues, languages: languageValues, customFilters: customFiltersList };
  return {
    type: VENDOR_FILTERS,
    payload: result,
  };
}

export function getQuotationFilters(statusValues, orderValues, vendorValues, customFiltersList) {
  const result = {
    statuses: statusValues, orderes: orderValues, vendores: vendorValues, customFilters: customFiltersList,
  };
  return {
    type: RFQ_FILTERS,
    payload: result,
  };
}

export function setInitialValues(filter, search, columns, download) {
  return {
    type: FILTER_VALUES,
    payload: {
      filter, search, columns, download,
    },
  };
}

export function getTransferFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: TRANSFER_FILTERS,
    payload: result,
  };
}

export function createComposeEmail(model, payload) {
  return (dispatch) => {
    dispatch(createComposeEmailInfo(model, payload));
  };
}

export function getVendorGroups(company, model) {
  return (dispatch) => {
    dispatch(getVendorGroupsInfo(company, model));
  };
}

export function getPartnerTags(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPartnerTagsInfo(company, model, keyword));
  };
}

export function getPaymentTerms(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPaymentTermsInfo(company, model, keyword));
  };
}

export function getWebsites(company, model, keyword) {
  return (dispatch) => {
    dispatch(getWebsitesInfo(company, model, keyword));
  };
}

export function getFiscalPositions(company, model, keyword) {
  return (dispatch) => {
    dispatch(getFiscalPositionsInfo(company, model, keyword));
  };
}

export function getSupportSlas(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSupportSlasInfo(company, model, keyword));
  };
}

export function getAccounts(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getAccountsInfo(company, model, type, keyword));
  };
}

export function getBankList(company, model) {
  return (dispatch) => {
    dispatch(getBankLists(company, model));
  };
}

export function createVendor(model, payload) {
  return (dispatch) => {
    dispatch(createVendorInfo(model, payload));
  };
}

export function createPurchaseRequest(model, payload) {
  return (dispatch) => {
    dispatch(createPurchaseRequestInfo(model, payload));
  };
}

export function createStockScrap(model, payload) {
  return (dispatch) => {
    dispatch(createStockScraps(model, payload));
  };
}

export function createRfq(model, payload) {
  return (dispatch) => {
    dispatch(createRfqInfo(model, payload));
  };
}

export function getTaxData(id, model) {
  return (dispatch) => {
    dispatch(getTaxDataInfo(id, model));
  };
}

export function resetAddVendorInfo(result) {
  return {
    type: RESET_ADD_VENDOR_INFO,
    payload: result,
  };
}

export function resetAddRequestInfo(result) {
  return {
    type: RESET_ADD_PR_INFO,
    payload: result,
  };
}

export function resetAddRfqInfo(result) {
  return {
    type: RESET_ADD_RFQ_INFO,
    payload: result,
  };
}

export function resetPurchaseState(result) {
  return {
    type: GET_PURCHASE_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetEmailState(result) {
  return {
    type: GET_EMAIL_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetUpdateRfqInfo(result) {
  return {
    type: RESET_UPDATE_RFQ_INFO,
    payload: result,
  };
}

export function resetPrint(result) {
  return {
    type: RESET_PRINT_INFO,
    payload: result,
  };
}

export function resetQuotationInfo(result) {
  return {
    type: RESET_QUOTATION_INFO,
    payload: result,
  };
}

export function resetAgreementInfo(result) {
  return {
    type: RESET_AGREE_INFO,
    payload: result,
  };
}

export function resetTransferInfo(result) {
  return {
    type: RESET_TRANSFER_INFO,
    payload: result,
  };
}

export function resetValidateState(result) {
  return {
    type: GET_VALIDATE_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetBackorder(result) {
  return {
    type: RESET_BACKORDER,
    payload: result,
  };
}

export function resetScrap(result) {
  return {
    type: RESET_SCRAP,
    payload: result,
  };
}

export function resetProducts(result) {
  return {
    type: RESET_PRODUCT,
    payload: result,
  };
}

export function resetTemplate(result) {
  return {
    type: RESET_TEMPLATE,
    payload: result,
  };
}

export function resetTemplateDetail(result) {
  return {
    type: RESET_TEMPLATE_DETAIL,
    payload: result,
  };
}

export function resetComposeEmail(result) {
  return {
    type: RESET_COMPSOE_EMAIL,
    payload: result,
  };
}

export function resetMoveOrder(result) {
  return {
    type: RESET_MOVE_ORDERS,
    payload: result,
  };
}

export function getQuotatioDetail(id, model) {
  return (dispatch) => {
    dispatch(getQuotatioDetailInfo(id, model));
  };
}

export function getTransferDetail(id, model) {
  return (dispatch) => {
    dispatch(getTransferDetailInfo(id, model));
  };
}

export function updateRfq(id, model, result) {
  return (dispatch) => {
    dispatch(getUpdateRfqInfo(id, model, result));
  };
}

export function getProductOrders(ids, model, tyoe) {
  return (dispatch) => {
    dispatch(getProductOrdersInfo(ids, model, tyoe));
  };
}

export function getStockProducts(ids, model) {
  return (dispatch) => {
    dispatch(getStockProductsInfo(ids, model));
  };
}

export function getStockQuantProducts(ids, locationId, model) {
  return (dispatch) => {
    dispatch(getStockQuantProductsInfo(ids, locationId, model));
  };
}

export function getRequestProduct(ids, model) {
  return (dispatch) => {
    dispatch(getRequestProductInfo(ids, model));
  };
}

export function getAgreeProduct(ids, model) {
  return (dispatch) => {
    dispatch(getAgreeProductInfo(ids, model));
  };
}

export function getMoveOrder(args, context, state, modelName) {
  return (dispatch) => {
    dispatch(getMoveOrders(args, context, state, modelName));
  };
}

export function getTransfers(companies, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, code) {
  return (dispatch) => {
    dispatch(getTransfersInfo(companies, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, code));
  };
}

export function getTransferExport(companies, modelName, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, code) {
  return (dispatch) => {
    dispatch(getTransferExportInfo(companies, modelName, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, code));
  };
}

export function getTaxes(ids, model) {
  return (dispatch) => {
    dispatch(getTaxesInfo(ids, model));
  };
}

export function getProductName(ids, model) {
  return (dispatch) => {
    dispatch(getProductNames(ids, model));
  };
}

export function getUnitName(ids, model) {
  return (dispatch) => {
    dispatch(getUnitNames(ids, model));
  };
}

export function getTemplate(name, model) {
  return (dispatch) => {
    dispatch(getTemplateInfo(name, model));
  };
}

export function getTemplateDetail(result, method, model) {
  return (dispatch) => {
    dispatch(getTemplateDetails(result, method, model));
  };
}

export function getVendorDetail(id, model) {
  return (dispatch) => {
    dispatch(getVendorDetails(id, model));
  };
}

export function getVendorContacts(id, model) {
  return (dispatch) => {
    dispatch(getVendorContactsInfo(id, model));
  };
}

export function getVendorBanks(id, model) {
  return (dispatch) => {
    dispatch(getVendorBanksInfo(id, model));
  };
}

export function storeContacts(payload) {
  const result = { data: payload };
  return {
    type: STORE_CONTACTS,
    payload: result,
  };
}

export function getVendorTags(id, model) {
  return (dispatch) => {
    dispatch(getTagsSelecetd(id, model));
  };
}

export function getActivityTypes(id, model) {
  return (dispatch) => {
    dispatch(getActivityTypesInfo(id, model));
  };
}

export function storeLogNotes(model, payload) {
  return (dispatch) => {
    dispatch(storeLogNotesInfo(model, payload));
  };
}

export function resetLogNote(result) {
  return {
    type: STORE_LOG_NOTES_RESET,
    payload: result,
  };
}

export function addActivity(model, payload) {
  return (dispatch) => {
    dispatch(addActivityInfo(model, payload));
  };
}

export function resetActivityInfo(result) {
  return {
    type: RESET_ADD_ACTIVITY_INFO,
    payload: result,
  };
}

export function getStockPickingTypes(company, model, keyword, type) {
  return (dispatch) => {
    dispatch(getStockPickingTypesInfo(company, model, keyword, type));
  };
}

export function updateReceipt(id, model, result) {
  return (dispatch) => {
    dispatch(updateReceiptInfo(id, model, result));
  };
}

export function createReceipt(model, payload) {
  return (dispatch) => {
    dispatch(createReceiptInfo(model, payload));
  };
}

export function resetUpdateReceiptInfo(result) {
  return {
    type: RESET_UPDATE_RECEIPT,
    payload: result,
  };
}

export function resetVendorBank(result) {
  return {
    type: RESET_VENDOR_BANK,
    payload: result,
  };
}

export function resetAddReceiptInfo(result) {
  return {
    type: RESET_ADD_RECEIPT,
    payload: result,
  };
}

export function setIsPo(result) {
  return {
    type: IS_PO,
    payload: result,
  };
}

export function setIsRequestQuotation(result) {
  return {
    type: IS_REQUESTQUOTATION,
    payload: result,
  };
}

export function setProductRedirectId(result) {
  return {
    type: PRODUCT_REDIRECT_ID,
    payload: result,
  };
}

export function getStockLocations(company, model, keyword, type, parentLocation) {
  return (dispatch) => {
    dispatch(getStockLocationsInfo(company, model, keyword, type, parentLocation));
  };
}

export function getStockWarehouses(company, model, keyword) {
  return (dispatch) => {
    dispatch(getStockWarehousesInfo(company, model, keyword));
  };
}

export function getMoveProducts(ids, model, type, isMini, productId) {
  return (dispatch) => {
    dispatch(getMoveProductsInfo(ids, model, type, isMini, productId));
  };
}
export function getMoveProductsData(ids, model, type, isMini, productId) {
  return (dispatch) => {
    dispatch(getMoveProductsDetails(ids, model, type, isMini, productId));
  };
}

export function getMoveProductsV1(ids, model, type, isMini, productId) {
  return (dispatch) => {
    dispatch(getMoveProductsV1Info(ids, model, type, isMini, productId));
  };
}

export function getScrapProducts(id, model) {
  return (dispatch) => {
    dispatch(getScrapProductsInfo(id, model));
  };
}

export function getProductList(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getProductsListInfo(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter));
  };
}

export function getProductsExport(company, model, limit, offset, fields, categories, types, customFilters, rows, sortBy, sortField, globalFilter) {
  return (dispatch) => {
    dispatch(getProductsExportInfo(company, model, limit, offset, fields, categories, types, customFilters, rows, sortBy, sortField, globalFilter));
  };
}
export function getProductsCount(company, model, categories, types, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getProductsCountInfo(company, model, categories, types, customFilters, globalFilter));
  };
}
export function addProduct(model, data) {
  return (dispatch) => {
    dispatch(createProduct(model, data));
  };
}

export function addReorderingRules(model, data) {
  return (dispatch) => {
    dispatch(createReorderingRules(model, data));
  };
}

export function addBank(model, data) {
  return (dispatch) => {
    dispatch(createBank(model, data));
  };
}
export function getProductCategoryInfo(company, model, categoryKeyword, isReport, startDate, endDate, opType, isInventory) {
  return (dispatch) => {
    dispatch(productCategoryList(company, model, categoryKeyword, isReport, startDate, endDate, opType, isInventory));
  };
}
export function getProductsInfo(company, model, keyword, inventory, startDate, endDate, type, categories) {
  return (dispatch) => {
    dispatch(productsListData(company, model, keyword, inventory, startDate, endDate, type, categories));
  };
}

export function getProductCategoryGroup(company, model) {
  return (dispatch) => {
    dispatch(getProductCategoryGroups(company, model));
  };
}

export function clearAddProduct(result) {
  return {
    type: CLEAR_ADD_PRODUCT,
    payload: result,
  };
}
export function getHsCode(company, model) {
  return (dispatch) => {
    dispatch(getHsCodeInfo(company, model));
  };
}
export function getCustomerTaxes(company, model, type) {
  return (dispatch) => {
    dispatch(getCustomerTaxesInfo(company, model, type));
  };
}

export function productFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PRODUCT_FILTERS,
    payload: result,
  };
}

export function getLocationRoute(company, model) {
  return (dispatch) => {
    dispatch(getLocationRouteInfo(company, model));
  };
}
export function getProductDetails(model, id, viewModel) {
  return (dispatch) => {
    dispatch(getProductDetailsInfo(model, id, viewModel));
  };
}

export function updateProduct(model, id, data) {
  return (dispatch) => {
    dispatch(updateProductInfo(model, id, data));
  };
}
export function getSellerIds(model, ids) {
  return (dispatch) => {
    dispatch(getSellerIdsInfo(model, ids));
  };
}
export function clearEditProduct(result) {
  return {
    type: CLEAR_EDIT_PRODUCT,
    payload: result,
  };
}
export function clearSellerIdsInfo(result) {
  return {
    type: CLEAR_SELLER_IDS_INFO,
    payload: result,
  };
}

export function getCheckedRowsVendor(payload) {
  return {
    type: GET_ROWS_VENDOR,
    payload,
  };
}

export function getCheckedRowsRequest(payload) {
  return {
    type: GET_ROWS_REQUEST,
    payload,
  };
}

export function getCheckedRowsProducts(payload) {
  return {
    type: GET_ROWS_PRODUCT,
    payload,
  };
}

export function getCheckedRowsTransfers(payload) {
  return {
    type: GET_ROWS_TRANSFERS,
    payload,
  };
}

export function resetBank(payload) {
  return {
    type: CLEAR_ADD_BANK,
    payload,
  };
}

export function getPurchaseRequestList(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getPurchaseRequestListInfo(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue));
  };
}

export function getPurchaseRequestExport(company, model, limit, offset, fields, statusValues, orderValues, vendorValues, customFilters, rows) {
  return (dispatch) => {
    dispatch(getPurchaseRequestExportInfo(company, model, limit, offset, fields, statusValues, orderValues, vendorValues, customFilters, rows));
  };
}

export function getPurchaseRequestCount(company, model, statusValues, orderValues, vendorValues, customFilters) {
  return (dispatch) => {
    dispatch(getPurchaseRequestCountInfo(company, model, statusValues, orderValues, vendorValues, customFilters));
  };
}

export function getPurchaseRequestFilters(statusValues, orderValues, vendorValues, customFiltersList) {
  const result = {
    statuses: statusValues, orderes: orderValues, vendores: vendorValues, customFilters: customFiltersList,
  };
  return {
    type: PR_FILTERS,
    payload: result,
  };
}

export function getPurchaseRequestDetail(id, model) {
  return (dispatch) => {
    dispatch(getPurchaseRequestDetails(id, model));
  };
}

export function getCheckedRowsPurchaseRequest(payload) {
  return {
    type: GET_ROWS_PURCHASE_REQUEST,
    payload,
  };
}

export function getMeasures(model, keyword, category) {
  return (dispatch) => {
    dispatch(getMeasuresInfo(model, keyword, category));
  };
}

export function clearTaxesInfo(result) {
  return {
    type: CLEAR_TAXES_DATA,
    payload: result,
  };
}

export function getReOrderingCount(model, companyId, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getReOrderingCountInfo(model, companyId, customFilters, globalFilter));
  };
}

export function getReOrderingRules(model, companyId, limit, offset, sortByValue, sortFieldValue, customFilters, globalFilter, productId) {
  return (dispatch) => {
    dispatch(getReOrderingRulesInfo(model, companyId, limit, offset, sortByValue, sortFieldValue, customFilters, globalFilter, productId));
  };
}

export function reorderingRulesFilters(products, customFilters) {
  const payload = { products, customFilters };
  return {
    type: REORDERING_RULES_FILTERS,
    payload,
  };
}

export function getProductTypes(model) {
  return (dispatch) => {
    dispatch(getProductTypesInfo(model));
  };
}

export function setTableData(result) {
  return {
    type: SET_TABLE_DATA,
    payload: result,
  };
}

export function clearTableData(result) {
  return {
    type: CLEAR_TABLE_DATA,
    payload: result,
  };
}

export function getReOrderingRulesExport(model, productId, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  return (dispatch) => {
    dispatch(getReOrderingRulesExportInfo(model, productId, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows));
  };
}

export function getCheckedRowsReOrderingRules(payload) {
  return {
    type: GET_ROWS_REORDERING_RULES,
    payload,
  };
}

export function getReorderRuleDetails(model, id) {
  return (dispatch) => {
    dispatch(getReorderRuleDetailsInfo(model, id));
  };
}

export function setProducts(payload) {
  return {
    type: SET_PRODUCTS,
    payload,
  };
}

export function setProductId(payload) {
  return {
    type: SET_VIEW_PRODUCT,
    payload,
  };
}

export function clearAddReOrderingRule(payload) {
  return {
    type: CLEAR_ADD_REORDER,
    payload,
  };
}

export function clearEditReOderingRule(payload) {
  return {
    type: CLEAR_EDIT_REODRDER,
    payload,
  };
}

export function updateReorderingRule(model, id, data) {
  return (dispatch) => {
    dispatch(updateReOrderingRuleInfo(model, id, data));
  };
}

export function getIndustries(model, keyword) {
  return (dispatch) => {
    dispatch(getIndustriesInfo(model, keyword));
  };
}

export function getPurchaseProject(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseProjects(company, model, keyword));
  };
}

export function getPurchaseAccount(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseAccounts(company, model, keyword));
  };
}

export function getPurchaseLocation(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseLocations(company, model, keyword));
  };
}

export function getPurchaseBudget(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseBudgets(company, model, keyword));
  };
}

export function getPurchaseSubCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseSubCategorys(company, model, keyword));
  };
}

export function getTransfersCount(companies, modelName, customFilters, globalFilter, code) {
  return (dispatch) => {
    dispatch(getTransfersCountInfo(companies, modelName, customFilters, globalFilter, code));
  };
}

export function getStockPickingTypesList(company, model, types, warehouses, customFilters) {
  return (dispatch) => {
    dispatch(getStockPickingTypesListInfo(company, model, types, warehouses, customFilters));
  };
}

export function getPurchaseAgreementList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseAgreementListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword));
  };
}

export function getPurchaseAgreementListExport(company, model, limit, offset, fields, customFilters, rows) {
  return (dispatch) => {
    dispatch(getPurchaseAgreementListExportInfo(company, model, limit, offset, fields, customFilters, rows));
  };
}

export function getPurchaseAgreementCount(company, model, customFilters, keyword) {
  return (dispatch) => {
    dispatch(getPurchaseAgreementCountInfo(company, model, customFilters, keyword));
  };
}

export function getPurchaseAgreementFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: AGREE_FILTERS,
    payload: result,
  };
}

export function getPurchaseAgreementRows(payload) {
  return {
    type: GET_ROWS_AGREES,
    payload,
  };
}

export function getPurchaseAgreementDetail(id, modelName) {
  return (dispatch) => {
    dispatch(getPurchaseAgreementDetails(id, modelName));
  };
}

export function agreementStateChange(id, state, model, contex) {
  return (dispatch) => {
    dispatch(agreementStateChangeInfo(id, state, model, contex));
  };
}

export function resetAgreementState(result) {
  return {
    type: GET_AGREE_STATE_RESET_INFO,
    payload: result,
  };
}

export function createAgreementRequest(model, payload) {
  return (dispatch) => {
    dispatch(createAgreementRequestInfo(model, payload));
  };
}

export function resetAddAgreementRequest(result) {
  return {
    type: RESET_ADD_AGREE_INFO,
    payload: result,
  };
}

export function getAgreementType(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAgreementTypes(company, model, keyword));
  };
}

export function resetVendorTags(result) {
  return {
    type: RESET_VENDOR_TAGS,
    payload: result,
  };
}

export function resetCancelTransferInfo(result) {
  return {
    type: RESET_CANCEL_TRANSFER_INFO,
    payload: result,
  };
}

export function cancelTtransfer(id, messageTicket) {
  return (dispatch) => {
    dispatch(cancelTtransferInfo(id, messageTicket));
  };
}

export function resetTransferStatusInfo(result) {
  return {
    type: RESET_TRANSFER_STATUS_INFO,
    payload: result,
  };
}

export function updateTransferStatus(id, result, stockType) {
  return (dispatch) => {
    dispatch(updateTransferStatusInfo(id, result, stockType));
  };
}

export function getInventoryDepartment(company, model, keyword) {
  return (dispatch) => {
    dispatch(getInventoryDepartments(company, model, keyword));
  };
}

export function getReoderingFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: REORDERING_FILTERS,
    payload: result,
  };
}

export function updateTransferNoStatus(id, result, stockType) {
  return (dispatch) => {
    dispatch(updateTransferNoStatusInfo(id, result, stockType));
  };
}

export function getCodeExists(id, code, modelName) {
  return (dispatch) => {
    dispatch(getCodeExistsInfo(id, code, modelName));
  };
}

export function resetProductInfo(result) {
  return {
    type: RESET_PRODUCT_QUANTITY_INFO,
    payload: result,
  };
}

export function getProductQuantity(locationId, productId) {
  return (dispatch) => {
    dispatch(getProductQuantityInfo(locationId, productId));
  };
}

export function setUnreserveProducts(payload) {
  return (dispatch) => {
    dispatch(setUnreserveProductsInfo(payload));
  };
}

export function resetUnreserveProducts(result) {
  return {
    type: RESET_UNRESERVE_PRODUCTS_INFO,
    payload: result,
  };
}

export function getCompanyPrice(productId) {
  return (dispatch) => {
    dispatch(getCompanyPriceInfo(productId));
  };
}
