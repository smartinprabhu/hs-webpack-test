/* eslint-disable max-len */
import { getDatesOfQuery } from './rfq/utils/utils';
import { CALL_API } from '../../middleware/api';
import quotationColumns from './rfq/data/customData.json';
import requestColumns from './purchaseRequest/data/customData.json';
import purchaseAgreementCustomData from './purchaseAgreement/data/customData.json';

export const GET_VENDORS_INFO = 'GET_VENDORS_INFO';
export const GET_VENDORS_INFO_SUCCESS = 'GET_VENDORS_INFO_SUCCESS';
export const GET_VENDORS_INFO_FAILURE = 'GET_VENDORS_INFO_FAILURE';

export const GET_VENDORS_COUNT_INFO = 'GET_VENDORS_COUNT_INFO';
export const GET_VENDORS_COUNT_INFO_SUCCESS = 'GET_VENDORS_COUNT_INFO_SUCCESS';
export const GET_VENDORS_COUNT_INFO_FAILURE = 'GET_VENDORS_COUNT_INFO_FAILURE';

export const GET_RFQ_INFO = 'GET_RFQ_INFO';
export const GET_RFQ_INFO_SUCCESS = 'GET_RFQ_INFO_SUCCESS';
export const GET_RFQ_INFO_FAILURE = 'GET_RFQ_INFO_FAILURE';

export const GET_RFQ_COUNT_INFO = 'GET_RFQ_COUNT_INFO';
export const GET_RFQ_COUNT_INFO_SUCCESS = 'GET_RFQ_COUNT_INFO_SUCCESS';
export const GET_RFQ_COUNT_INFO_FAILURE = 'GET_RFQ_COUNT_INFO_FAILURE';

export const GET_TRANSFERS_INFO = 'GET_TRANSFERS_INFO';
export const GET_TRANSFERS_INFO_SUCCESS = 'GET_TRANSFERS_INFO_SUCCESS';
export const GET_TRANSFERS_INFO_FAILURE = 'GET_TRANSFERS_INFO_FAILURE';

export const GET_PURCHASE_STATE_CHANGE_INFO = 'GET_PURCHASE_STATE_CHANGE_INFO';
export const GET_PURCHASE_STATE_CHANGE_INFO_SUCCESS = 'GET_PURCHASE_STATE_CHANGE_INFO_SUCCESS';
export const GET_PURCHASE_STATE_CHANGE_INFO_FAILURE = 'GET_PURCHASE_STATE_CHANGE_INFO_FAILURE';

export const GET_VALIDATE_INFO = 'GET_VALIDATE_INFO';
export const GET_VALIDATE_INFO_SUCCESS = 'GET_VALIDATE_INFO_SUCCESS';
export const GET_VALIDATE_INFO_FAILURE = 'GET_VALIDATE_INFO_FAILURE';

export const GET_PRINT_CHANGE_INFO = 'GET_PRINT_CHANGE_INFO';
export const GET_PRINT_CHANGE_INFO_SUCCESS = 'GET_PRINT_CHANGE_INFO_SUCCESS';
export const GET_PRINT_CHANGE_INFO_FAILURE = 'GET_PRINT_CHANGE_INFO_FAILURE';

export const CREATE_EMAIL_INFO = 'CREATE_EMAIL_INFO';
export const CREATE_EMAIL_INFO_SUCCESS = 'CREATE_EMAIL_INFO_SUCCESS';
export const CREATE_EMAIL_INFO_FAILURE = 'CREATE_EMAIL_INFO_FAILURE';

export const CREATE_SCRAP_INFO = 'CREATE_SCRAP_INFO';
export const CREATE_SCRAP_INFO_SUCCESS = 'CREATE_SCRAP_INFO_SUCCESS';
export const CREATE_SCRAP_INFO_FAILURE = 'CREATE_SCRAP_INFO_FAILURE';

export const GET_VENDOR_GROUP_INFO = 'GET_VENDOR_GROUP_INFO';
export const GET_VENDOR_GROUP_INFO_SUCCESS = 'GET_VENDOR_GROUP_INFO_SUCCESS';
export const GET_VENDOR_GROUP_INFO_FAILURE = 'GET_VENDOR_GROUP_INFO_FAILURE';

export const GET_PARTNER_TAGS_INFO = 'GET_PARTNER_TAGS_INFO';
export const GET_PARTNER_TAGS_INFO_SUCCESS = 'GET_PARTNER_TAGS_INFO_SUCCESS';
export const GET_PARTNER_TAGS_INFO_FAILURE = 'GET_PARTNER_TAGS_INFO_FAILURE';

export const GET_PAYMENT_TERMS_INFO = 'GET_PAYMENT_TERMS_INFO';
export const GET_PAYMENT_TERMS_INFO_SUCCESS = 'GET_PAYMENT_TERMS_INFO_SUCCESS';
export const GET_PAYMENT_TERMS_INFO_FAILURE = 'GET_PAYMENT_TERMS_INFO_FAILURE';

export const GET_WEBSITES_INFO = 'GET_WEBSITES_INFO';
export const GET_WEBSITES_INFO_SUCCESS = 'GET_WEBSITES_INFO_SUCCESS';
export const GET_WEBSITES_INFO_FAILURE = 'GET_WEBSITES_INFO_FAILURE';

export const GET_FISCAL_POSITIONS_INFO = 'GET_FISCAL_POSITIONS_INFO';
export const GET_FISCAL_POSITIONS_INFO_SUCCESS = 'GET_FISCAL_POSITIONS_INFO_SUCCESS';
export const GET_FISCAL_POSITIONS_INFO_FAILURE = 'GET_FISCAL_POSITIONS_INFO_FAILURE';

export const GET_INVOICE_ACCOUNTS_INFO = 'GET_INVOICE_ACCOUNTS_INFO';
export const GET_INVOICE_ACCOUNTS_INFO_SUCCESS = 'GET_INVOICE_ACCOUNTS_INFO_SUCCESS';
export const GET_INVOICE_ACCOUNTS_INFO_FAILURE = 'GET_INVOICE_ACCOUNTS_INFO_FAILURE';

export const GET_SLA_INFO = 'GET_SLA_INFO';
export const GET_SLA_INFO_SUCCESS = 'GET_SLA_INFO_SUCCESS';
export const GET_SLA_INFO_FAILURE = 'GET_SLA_INFO_FAILURE';

export const CREATE_VENDOR_INFO = 'CREATE_VENDOR_INFO';
export const CREATE_VENDOR_INFO_SUCCESS = 'CREATE_VENDOR_INFO_SUCCESS';
export const CREATE_VENDOR_INFO_FAILURE = 'CREATE_VENDOR_INFO_FAILURE';

export const GET_TAX_DETAILS_INFO = 'GET_TAX_DETAILS_INFO';
export const GET_TAX_DETAILS_INFO_SUCCESS = 'GET_TAX_DETAILS_INFO_SUCCESS';
export const GET_TAX_DETAILS_INFO_FAILURE = 'GET_TAX_DETAILS_INFO_FAILURE';

export const CREATE_RFQ_INFO = 'CREATE_RFQ_INFO';
export const CREATE_RFQ_INFO_SUCCESS = 'CREATE_RFQ_INFO_SUCCESS';
export const CREATE_RFQ_INFO_FAILURE = 'CREATE_RFQ_INFO_FAILURE';

export const GET_QUOTATION_DETAILS_INFO = 'GET_QUOTATION_DETAILS_INFO';
export const GET_QUOTATION_DETAILS_INFO_SUCCESS = 'GET_QUOTATION_DETAILS_INFO_SUCCESS';
export const GET_QUOTATION_DETAILS_INFO_FAILURE = 'GET_QUOTATION_DETAILS_INFO_FAILURE';

export const GET_TRANSFER_DETAILS_INFO = 'GET_TRANSFER_DETAILS_INFO';
export const GET_TRANSFER_DETAILS_INFO_SUCCESS = 'GET_TRANSFER_DETAILS_INFO_SUCCESS';
export const GET_TRANSFER_DETAILS_INFO_FAILURE = 'GET_TRANSFER_DETAILS_INFO_FAILURE';

export const UPDATE_RFQ_INFO = 'UPDATE_RFQ_INFO';
export const UPDATE_RFQ_INFO_SUCCESS = 'UPDATE_RFQ_INFO_SUCCESS';
export const UPDATE_RFQ_INFO_FAILURE = 'UPDATE_RFQ_INFO_FAILURE';

export const GET_PRODUCT_ORDERDS_INFO = 'GET_PRODUCT_ORDERDS_INFO';
export const GET_PRODUCT_ORDERDS_INFO_SUCCESS = 'GET_PRODUCT_ORDERDS_INFO_SUCCESS';
export const GET_PRODUCT_ORDERDS_INFO_FAILURE = 'GET_PRODUCT_ORDERDS_INFO_FAILURE';

export const GET_TAXES_INFO = 'GET_TAXES_INFO';
export const GET_TAXES_INFO_SUCCESS = 'GET_TAXES_INFO_SUCCESS';
export const GET_TAXES_INFO_FAILURE = 'GET_TAXES_INFO_FAILURE';

export const GET_TEMPLATE_INFO = 'GET_TEMPLATE_INFO';
export const GET_TEMPLATE_INFO_SUCCESS = 'GET_TEMPLATE_INFO_SUCCESS';
export const GET_TEMPLATE_INFO_FAILURE = 'GET_TEMPLATE_INFO_FAILURE';

export const GET_TEMP_DETAIL_INFO = 'GET_TEMP_DETAIL_INFO';
export const GET_TEMP_DETAIL_INFO_SUCCESS = 'GET_TEMP_DETAIL_INFO_SUCCESS';
export const GET_TEMP_DETAIL_INFO_FAILURE = 'GET_TEMP_DETAIL_INFO_FAILURE';

export const GET_MOVE_ORDERDS_INFO = 'GET_MOVE_ORDERDS_INFO';
export const GET_MOVE_ORDERDS_INFO_SUCCESS = 'GET_MOVE_ORDERDS_INFO_SUCCESS';
export const GET_MOVE_ORDERDS_INFO_FAILURE = 'GET_MOVE_ORDERDS_INFO_FAILURE';

export const GET_VENDOR_DETAILS = 'GET_VENDOR_DETAILS';
export const GET_VENDOR_DETAILS_SUCCESS = 'GET_VENDOR_DETAILS_SUCCESS';
export const GET_VENDOR_DETAILS_FAILURE = 'GET_VENDOR_DETAILS_FAILURE';

export const GET_VENDOR_CONTACTS_INFO = 'GET_VENDOR_CONTACTS_INFO';
export const GET_VENDOR_CONTACTS_INFO_SUCCESS = 'GET_VENDOR_CONTACTS_INFO_SUCCESS';
export const GET_VENDOR_CONTACTS_INFO_FAILURE = 'GET_VENDOR_CONTACTS_INFO_FAILURE';

export const GET_VENDOR_BANKS_INFO = 'GET_VENDOR_BANKS_INFO';
export const GET_VENDOR_BANKS_INFO_SUCCESS = 'GET_VENDOR_BANKS_INFO_SUCCESS';
export const GET_VENDOR_BANKS_INFO_FAILURE = 'GET_VENDOR_BANKS_INFO_FAILURE';

export const GET_VENDOR_TAGS = 'GET_VENDOR_TAGS';
export const GET_VENDOR_TAGS_SUCCESS = 'GET_VENDOR_TAGS_SUCCESS';
export const GET_VENDOR_TAGS_FAILURE = 'GET_VENDOR_TAGS_FAILURE';

export const STORE_LOG_NOTES = 'STORE_LOG_NOTES';
export const STORE_LOG_NOTES_SUCCESS = 'STORE_LOG_NOTES_SUCCESS';
export const STORE_LOG_NOTES_FAILURE = 'STORE_LOG_NOTES_FAILURE';

export const GET_ACTIVITY_TYPES = 'GET_ACTIVITY_TYPES';
export const GET_ACTIVITY_TYPES_SUCCESS = 'GET_ACTIVITY_TYPES_SUCCESS';
export const GET_ACTIVITY_TYPES_FAILURE = 'GET_ACTIVITY_TYPES_FAILURE';

export const CREATE_MAIL_ACTIVITY_INFO = 'CREATE_MAIL_ACTIVITY_INFO';
export const CREATE_MAIL_ACTIVITY_INFO_SUCCESS = 'CREATE_MAIL_ACTIVITY_INFO_SUCCESS';
export const CREATE_MAIL_ACTIVITY_INFO_FAILURE = 'CREATE_MAIL_ACTIVITY_INFO_FAILURE';

export const GET_STOCK_PICKING_TYPES_INFO = 'GET_STOCK_PICKING_TYPES_INFO';
export const GET_STOCK_PICKING_TYPES_INFO_SUCCESS = 'GET_STOCK_PICKING_TYPES_INFO_SUCCESS';
export const GET_STOCK_PICKING_TYPES_INFO_FAILURE = 'GET_STOCK_PICKING_TYPES_INFO_FAILURE';

export const CREATE_RECEIPT_INFO = 'CREATE_RECEIPT_INFO';
export const CREATE_RECEIPT_INFO_SUCCESS = 'CREATE_RECEIPT_INFO_SUCCESS';
export const CREATE_RECEIPT_INFO_FAILURE = 'CREATE_RECEIPT_INFO_FAILURE';

export const UPDATE_RECEIPT_INFO = 'UPDATE_RECEIPT_INFO';
export const UPDATE_RECEIPT_INFO_SUCCESS = 'UPDATE_RECEIPT_INFO_SUCCESS';
export const UPDATE_RECEIPT_INFO_FAILURE = 'UPDATE_RECEIPT_INFO_FAILURE';

export const GET_STOCK_LOCATIONS_INFO = 'GET_STOCK_LOCATIONS_INFO';
export const GET_STOCK_LOCATIONS_INFO_SUCCESS = 'GET_STOCK_LOCATIONS_INFO_SUCCESS';
export const GET_STOCK_LOCATIONS_INFO_FAILURE = 'GET_STOCK_LOCATIONS_INFO_FAILURE';

export const GET_MOVE_PRODUCTS_INFO = 'GET_MOVE_PRODUCTS_INFO';
export const GET_MOVE_PRODUCTS_INFO_SUCCESS = 'GET_MOVE_PRODUCTS_INFO_SUCCESS';
export const GET_MOVE_PRODUCTS_INFO_FAILURE = 'GET_MOVE_PRODUCTS_INFO_FAILURE';

export const GET_PURCHASE_AGREEMENT_INFO = 'GET_PURCHASE_AGREEMENT_INFO';
export const GET_PURCHASE_AGREEMENT_INFO_FAILURE = 'GET_PURCHASE_AGREEMENT_INFO_FAILURE';
export const GET_PURCHASE_AGREEMENT_INFO_SUCCESS = 'GET_PURCHASE_AGREEMENT_INFO_SUCCESS';

export const GET_PURCHASE_REQUEST_INFO = 'GET_PURCHASE_REQUEST_INFO';
export const GET_PURCHASE_REQUEST_INFO_FAILURE = 'GET_PURCHASE_REQUEST_INFO_FAILURE';
export const GET_PURCHASE_REQUEST_INFO_SUCCESS = 'GET_PURCHASE_REQUEST_INFO_SUCCESS';

export const GET_BANKS_INFO = 'GET_BANKS_INFO';
export const GET_BANKS_INFO_FAILURE = 'GET_BANKS_INFO_FAILURE';
export const GET_BANKS_INFO_SUCCESS = 'GET_BANKS_INFO_SUCCESS';

export const GET_VENDORS_EXPORT_INFO = 'GET_VENDORS_EXPORT_INFO';
export const GET_VENDORS_EXPORT_INFO_SUCCESS = 'GET_VENDORS_EXPORT_INFO_SUCCESS';
export const GET_VENDORS_EXPORT_INFO_FAILURE = 'GET_VENDORS_EXPORT_INFO_FAILURE';

export const GET_RFQ_EXPORT_INFO = 'GET_RFQ_EXPORT_INFO';
export const GET_RFQ_EXPORT_INFO_SUCCESS = 'GET_RFQ_EXPORT_INFO_SUCCESS';
export const GET_RFQ_EXPORT_INFO_FAILURE = 'GET_RFQ_EXPORT_INFO_FAILURE';

export const GET_PRODUCTS_LIST = 'GET_PRODUCTS_LIST';
export const GET_PRODUCTS_SUCCESS_LIST = 'GET_PRODUCTS_SUCCESS_LIST';
export const GET_PRODUCTS_FAILURE_LIST = 'GET_PRODUCTS_FAILURE_LIST';

export const GET_PRODUCTS_COUNT = 'GET_PRODUCTS_COUNT';
export const GET_PRODUCTS_COUNT_SUCCESS = 'GET_PRODUCTS_COUNT_SUCCESS';
export const GET_PRODUCTS_COUNT_FAILURE = 'GET_PRODUCTS_COUNT_FAILURE';

export const ADD_PRODUCT = 'ADD_PRODUCT';
export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_FAILURE = 'ADD_PRODUCT_FAILURE';

export const PRODUCT_CATEGORY_INFO = 'PRODUCT_CATEGORY_INFO';
export const PRODUCT_CATEGORY_INFO_SUCCESS = 'PRODUCT_CATEGORY_INFO_SUCCESS';
export const PRODUCT_CATEGORY_INFO_FAILURE = 'PRODUCT_CATEGORY_INFO_FAILURE';

export const GET_HS_CODE = 'GET_HS_CODE';
export const GET_HS_CODE_SUCCESS = 'GET_HS_CODE_SUCCESS';
export const GET_HS_CODE_FAILURE = 'GET_HS_CODE_FAILURE';

export const GET_CUSTOMER_TAXES = 'GET_CUSTOMER_TAXES';
export const GET_CUSTOMER_TAXES_SUCCESS = 'GET_CUSTOMER_TAXES_SUCCESS';
export const GET_CUSTOMER_TAXES_FAILURE = 'GET_CUSTOMER_TAXES_FAILURE';

export const GET_LOCATION_ROUTE = 'GET_ROUTE';
export const GET_LOCATION_ROUTE_SUCCESS = 'GET_LOCATION_ROUTE_SUCCESS';
export const GET_LOCATION_ROUTE_FAILURE = 'GET_LOCATION_ROUTE_FAILURE';

export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const GET_PRODUCT_DETAILS_SUCCESS = 'GET_PRODUCT_DETAILS_SUCCESS';
export const GET_PRODUCT_DETAILS_FAILURE = 'GET_PRODUCT_DETAILS_FAILURE';

export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const EDIT_PRODUCT_SUCCESS = 'EDIT_PRODUCT_SUCCESS';
export const EDIT_PRODUCT_FAILURE = 'EDIT_PRODUCT_FAILURE';

export const GET_SELLER_IDS = 'GET_SELLER_IDS';
export const GET_SELLER_IDS_SUCCESS = 'GET_SELLER_IDS_SUCCESS';
export const GET_SELLER_IDS_FAILURE = 'GET_SELLER_IDS_FAILURE';

export const GET_PRODUCTS_EXPORT = 'GET_PRODUCTS_EXPORT';
export const GET_PRODUCTS_EXPORT_SUCCESS = 'GET_PRODUCTS_EXPORT_SUCCESS';
export const GET_PRODUCTS_EXPORT_FAILURE = 'GET_PRODUCTS_EXPORT_FAILURE';

export const GET_TRANSFERS_EXPORT_INFO = 'GET_TRANSFERS_EXPORT_INFO';
export const GET_TRANSFERS_EXPORT_INFO_SUCCESS = 'GET_TRANSFERS_EXPORT_INFO_SUCCESS';
export const GET_TRANSFERS_EXPORT_INFO_FAILURE = 'GET_TRANSFERS_EXPORT_INFO_FAILURE';

export const GET_BACKORDER_INFO = 'GET_BACKORDER_INFO';
export const GET_BACKORDER_INFO_SUCCESS = 'GET_BACKORDER_INFO_SUCCESS';
export const GET_BACKORDER_INFO_FAILURE = 'GET_BACKORDER_INFO_FAILURE';

export const ADD_BANK = 'ADD_BANK';
export const ADD_BANK_SUCCESS = 'ADD_BANK_SUCCESS';
export const ADD_BANK_FAILURE = 'ADD_BANK_FAILURE';

export const GET_PR_INFO = 'GET_PR_INFO';
export const GET_PR_INFO_SUCCESS = 'GET_PR_INFO_SUCCESS';
export const GET_PR_INFO_FAILURE = 'GET_PR_INFO_FAILURE';

export const GET_PR_EXPORT_INFO = 'GET_PR_EXPORT_INFO';
export const GET_PR_EXPORT_INFO_SUCCESS = 'GET_PR_EXPORT_INFO_SUCCESS';
export const GET_PR_EXPORT_INFO_FAILURE = 'GET_PR_EXPORT_INFO_FAILURE';

export const GET_PR_COUNT_INFO = 'GET_PR_COUNT_INFO';
export const GET_PR_COUNT_INFO_SUCCESS = 'GET_PR_COUNT_INFO_SUCCESS';
export const GET_PR_COUNT_INFO_FAILURE = 'GET_PR_COUNT_INFO_FAILURE';

export const GET_PR_DETAILS_INFO = 'GET_PR_DETAILS_INFO';
export const GET_PR_DETAILS_INFO_SUCCESS = 'GET_PR_DETAILS_INFO_SUCCESS';
export const GET_PR_DETAILS_INFO_FAILURE = 'GET_PR_DETAILS_INFO_FAILURE';

export const GET_PR_NAME_INFO = 'GET_PR_NAME_INFO';
export const GET_PR_NAME_INFO_SUCCESS = 'GET_PR_NAME_INFO_SUCCESS';
export const GET_PR_NAME_INFO_FAILURE = 'GET_PR_NAME_INFO_FAILURE';

export const GET_STOCK_WAREHOUSE_INFO = 'GET_STOCK_WAREHOUSE_INFO';
export const GET_STOCK_WAREHOUSE_INFO_SUCCESS = 'GET_STOCK_WAREHOUSE_INFO_SUCCESS';
export const GET_STOCK_WAREHOUSE_INFO_FAILURE = 'GET_STOCK_WAREHOUSE_INFO_FAILURE';

export const GET_UM_NAME_INFO = 'GET_UM_NAME_INFO';
export const GET_UM_NAME_INFO_SUCCESS = 'GET_UM_NAME_INFO_SUCCESS';
export const GET_UM_NAME_INFO_FAILURE = 'GET_UM_NAME_INFO_FAILURE';

export const GET_MEASURES = 'GET_MEASURES';
export const GET_MEASURES_SUCCESS = 'GET_MEASURES_SUCCESS';
export const GET_MEASURES_FAILURE = 'GET_MEASURES_FAILURE';

export const GET_REORDERING_RULES_INFO = 'GET_REORDERING_RULES_INFO';
export const GET_REORDERING_RULES_INFO_SUCCESS = 'GET_REORDERING_RULES_INFO_SUCCESS';
export const GET_REORDERING_RULES_INFO_FAILURE = 'GET_REORDERING_RULES_INFO_FAILURE';

export const GET_REORDERING_RULES_COUNT = 'GET_REORDERING_RULES_COUNT';
export const GET_REORDERING_RULES_COUNT_SUCCESS = 'GET_REORDERING_RULES_COUNT_SUCCESS';
export const GET_REORDERING_RULES_COUNT_FAILURE = 'GET_REORDERING_RULES_COUNT_FAILURE';

export const GET_PRODUCT_TYPE = 'GET_PRODUCT_TYPE';
export const GET_PRODUCT_TYPE_SUCCESS = 'GET_PRODUCT_TYPE_SUCCESS';
export const GET_PRODUCT_TYPE_FAILURE = 'GET_PRODUCT_TYPE_FAILURE';

export const ADD_REORDERING_RULES = 'ADD_REORDERING_RULES';
export const ADD_REORDERING_RULES_SUCCESS = 'ADD_REORDERING_RULES_SUCCESS';
export const ADD_REORDERING_RULES_FAILURE = 'ADD_REORDERING_RULES_FAILURE';

export const GET_REORDERING_RULES_EXPORT = 'GET_REORDERING_RULES_EXPORT';
export const GET_REORDERING_RULES_EXPORT_SUCCESS = 'GET_REORDERING_RULES_EXPORT_SUCCESS';
export const GET_REORDERING_RULES_EXPORT_FAILURE = 'GET_REORDERING_RULES_EXPORT_FAILURE';

export const GET_REORDER_RULE_DETAILS = 'GET_REORDER_RULE_DETAILS';
export const GET_REORDER_RULE_DETAILS_SUCCESS = 'GET_REORDER_RULE_DETAILS_SUCCESS';
export const GET_REORDER_RULE_DETAILS_FAILURE = 'GET_REORDER_RULE_DETAILS_FAILURE';

export const UPDATE_REORDERING_RULE = 'UPDATE_REORDERING_RULE';
export const UPDATE_REORDERING_RULE_SUCCESS = 'UPDATE_REORDERING_RULE_SUCCESS';
export const UPDATE_REORDERING_RULE_FAILURE = 'UPDATE_REORDERING_RULE_FAILURE';

export const GET_INDUSTRIES = 'GET_INDUSTRIES';
export const GET_INDUSTRIES_SUCCESS = 'GET_INDUSTRIES_SUCCESS';
export const GET_INDUSTRIES_FAILURE = 'GET_INDUSTRIES_FAILURE';

export const GET_EMAIL_STATE_CHANGE_INFO = 'GET_EMAIL_STATE_CHANGE_INFO';
export const GET_EMAIL_STATE_CHANGE_INFO_SUCCESS = 'GET_EMAIL_STATE_CHANGE_INFO_SUCCESS';
export const GET_EMAIL_STATE_CHANGE_INFO_FAILURE = 'GET_EMAIL_STATE_CHANGE_INFO_FAILURE';

export const CREATE_PR_INFO = 'CREATE_PR_INFO';
export const CREATE_PR_INFO_SUCCESS = 'CREATE_PR_INFO_SUCCESS';
export const CREATE_PR_INFO_FAILURE = 'CREATE_PR_INFO_FAILURE';

export const GET_RP_INFO = 'GET_RP_INFO';
export const GET_RP_INFO_SUCCESS = 'GET_RP_INFO_SUCCESS';
export const GET_RP_INFO_FAILURE = 'GET_RP_INFO_FAILURE';

export const GET_AGP_INFO = 'GET_AGP_INFO';
export const GET_AGP_INFO_SUCCESS = 'GET_AGP_INFO_SUCCESS';
export const GET_AGP_INFO_FAILURE = 'GET_AGP_INFO_FAILURE';

export const GET_PR_PROJECT = 'GET_PR_PROJECT';
export const GET_PR_PROJECT_SUCCESS = 'GET_PR_PROJECT_SUCCESS';
export const GET_PR_PROJECT_FAILURE = 'GET_PR_PROJECT_FAILURE';

export const GET_PR_ACCOUNT = 'GET_PR_ACCOUNT';
export const GET_PR_ACCOUNT_SUCCESS = 'GET_PR_ACCOUNT_SUCCESS';
export const GET_PR_ACCOUNT_FAILURE = 'GET_PR_ACCOUNT_FAILURE';

export const GET_PR_LOCATION = 'GET_PR_LOCATION';
export const GET_PR_LOCATION_SUCCESS = 'GET_PR_LOCATION_SUCCESS';
export const GET_PR_LOCATION_FAILURE = 'GET_PR_LOCATION_FAILURE';

export const GET_PR_BUDGET = 'GET_PR_BUDGET';
export const GET_PR_BUDGET_SUCCESS = 'GET_PR_BUDGET_SUCCESS';
export const GET_PR_BUDGET_FAILURE = 'GET_PR_BUDGET_FAILURE';

export const GET_PR_SUBCATEGORY = 'GET_PR_SUBCATEGORY';
export const GET_PR_SUBCATEGORY_SUCCESS = 'GET_PR_SUBCATEGORY_SUCCESS';
export const GET_PR_SUBCATEGORY_FAILURE = 'GET_PR_SUBCATEGORY_FAILURE';

export const GET_TRANSFERS_COUNT_INFO = 'GET_TRANSFERS_COUNT_INFO';
export const GET_TRANSFERS_COUNT_INFO_SUCCESS = 'GET_TRANSFERS_COUNT_INFO_SUCCESS';
export const GET_TRANSFERS_COUNT_INFO_FAILURE = 'GET_TRANSFERS_COUNT_INFO_FAILURE';

export const GET_STOCK_PICKING_TYPES_LIST_INFO = 'GET_STOCK_PICKING_TYPES_LIST_INFO';
export const GET_STOCK_PICKING_TYPES_LIST_INFO_SUCCESS = 'GET_STOCK_PICKING_TYPES_LIST_INFO_SUCCESS';
export const GET_STOCK_PICKING_TYPES_LIST_INFO_FAILURE = 'GET_STOCK_PICKING_TYPES_LIST_INFO_FAILURE';

export const GET_STOCK_PRODUCTS_INFO = 'GET_STOCK_PRODUCTS_INFO';
export const GET_STOCK_PRODUCTS_INFO_SUCCESS = 'GET_STOCK_PRODUCTS_INFO_SUCCESS';
export const GET_STOCK_PRODUCTS_INFO_FAILURE = 'GET_STOCK_PRODUCTS_INFO_FAILURE';

export const GET_QUANT_PRODUCTS_INFO = 'GET_QUANT_PRODUCTS_INFO';
export const GET_QUANT_PRODUCTS_INFO_SUCCESS = 'GET_QUANT_PRODUCTS_INFO_SUCCESS';
export const GET_QUANT_PRODUCTS_INFO_FAILURE = 'GET_QUANT_PRODUCTS_INFO_FAILURE';

export const GET_SCRAP_PRODUCTS_INFO = 'GET_SCRAP_PRODUCTS_INFO';
export const GET_SCRAP_PRODUCTS_INFO_SUCCESS = 'GET_SCRAP_PRODUCTS_INFO_SUCCESS';
export const GET_SCRAP_PRODUCTS_INFO_FAILURE = 'GET_SCRAP_PRODUCTS_INFO_FAILURE';

export const GET_AGREE_LIST_INFO = 'GET_AGREE_LIST_INFO';
export const GET_AGREE_LIST_INFO_SUCCESS = 'GET_AGREE_LIST_INFO_SUCCESS';
export const GET_AGREE_LIST_INFO_FAILURE = 'GET_AGREE_LIST_INFO_FAILURE';

export const GET_AGREE_COUNT_INFO = 'GET_AGREE_COUNT_INFO';
export const GET_AGREE_COUNT_INFO_SUCCESS = 'GET_AGREE_COUNT_INFO_SUCCESS';
export const GET_AGREE_COUNT_INFO_FAILURE = 'GET_AGREE_COUNT_INFO_FAILURE';

export const GET_AGREE_EXPORT_LIST_INFO = 'GET_AGREE_EXPORT_LIST_INFO';
export const GET_AGREE_EXPORT_LIST_INFO_SUCCESS = 'GET_AGREE_EXPORT_LIST_INFO_SUCCESS';
export const GET_AGREE_EXPORT_LIST_INFO_FAILURE = 'GET_AGREE_EXPORT_LIST_INFO_FAILURE';

export const GET_AGREE_DETAILS_INFO = 'GET_AGREE_DETAILS_INFO';
export const GET_AGREE_DETAILS_INFO_SUCCESS = 'GET_AGREE_DETAILS_INFO_SUCCESS';
export const GET_AGREE_DETAILS_INFO_FAILURE = 'GET_AGREE_DETAILS_INFO_FAILURE';

export const GET_AGREE_STATE_CHANGE_INFO = 'GET_AGREE_STATE_CHANGE_INFO';
export const GET_AGREE_STATE_CHANGE_INFO_SUCCESS = 'GET_AGREE_STATE_CHANGE_INFO_SUCCESS';
export const GET_AGREE_STATE_CHANGE_INFO_FAILURE = 'GET_AGREE_STATE_CHANGE_INFO_FAILURE';

export const CREATE_AGREE_INFO = 'CREATE_AGREE_INFO';
export const CREATE_AGREE_INFO_SUCCESS = 'CREATE_AGREE_INFO_SUCCESS';
export const CREATE_AGREE_INFO_FAILURE = 'CREATE_AGREE_INFO_FAILURE';

export const GET_AT_INFO = 'GET_AT_INFO';
export const GET_AT_INFO_SUCCESS = 'GET_AT_INFO_SUCCESS';
export const GET_AT_INFO_FAILURE = 'GET_AT_INFO_FAILURE';

export const PRODUCT_FILTERS = 'PRODUCT_FILTERS';
export const CANCEL_TRANSFER_INFO = 'CANCEL_TRANSFER_INFO';
export const CANCEL_TRANSFER_INFO_SUCCESS = 'CANCEL_TRANSFER_INFO_SUCCESS';
export const CANCEL_TRANSFER_INFO_FAILURE = 'CANCEL_TRANSFER_INFO_FAILURE';

export const UPDATE_TRANSFER_STATUS_INFO = 'UPDATE_TRANSFER_STATUS_INFO';
export const UPDATE_TRANSFER_STATUS_INFO_SUCCESS = 'UPDATE_TRANSFER_STATUS_INFO_SUCCESS';
export const UPDATE_TRANSFER_STATUS_INFO_FAILURE = 'UPDATE_TRANSFER_STATUS_INFO_FAILURE';

export const GET_ID_INFO = 'GET_ID_INFO';
export const GET_ID_INFO_SUCCESS = 'GET_ID_INFO_SUCCESS';
export const GET_ID_INFO_FAILURE = 'GET_ID_INFO_FAILURE';

export const PCG_INFO = 'PCG_INFO';
export const PCG_INFO_SUCCESS = 'PCG_INFO_SUCCESS';
export const PCG_INFO_FAILURE = 'PCG_INFO_FAILURE';

export const GET_PRODUCT_DATA_INFO = 'GET_PRODUCT_DATA_INFO';
export const GET_PRODUCT_DATA_SUCCESS = 'GET_PRODUCT_DATA_SUCCESS';
export const GET_PRODUCT_DATA_FAILURE = 'GET_PRODUCT_DATA_FAILURE';

export const UPDATE_TRANSFER_NO_STATUS_INFO = 'UPDATE_TRANSFER_NO_STATUS_INFO';
export const UPDATE_TRANSFER_NO_STATUS_INFO_SUCCESS = 'UPDATE_TRANSFER_NO_STATUS_INFO_SUCCESS';
export const UPDATE_TRANSFER_NO_STATUS_INFO_FAILURE = 'UPDATE_TRANSFER_NO_STATUS_INFO_FAILURE';

export const GET_MOVE_PRODUCTS_DETAIL = 'GET_MOVE_PRODUCTS_DETAIL';
export const GET_MOVE_PRODUCTS_DETAIL_SUCCESS = 'GET_MOVE_PRODUCTS_DETAIL_SUCCESS';
export const GET_MOVE_PRODUCTS_DETAIL_FAILURE = 'GET_MOVE_PRODUCTS_DETAIL_FAILURE';

export const GET_MOVE_PRODUCTSV1_INFO = 'GET_MOVE_PRODUCTSV1_INFO';
export const GET_MOVE_PRODUCTSV1_INFO_SUCCESS = 'GET_MOVE_PRODUCTSV1_INFO_SUCCESS';
export const GET_MOVE_PRODUCTSV1_INFO_FAILURE = 'GET_MOVE_PRODUCTSV1_INFO_FAILURE';

export const GET_PRODUCT_CODES_INFO = 'GET_PRODUCT_CODES_INFO';
export const GET_PRODUCT_CODES_INFO_SUCCESS = 'GET_PRODUCT_CODES_INFO_SUCCESS';
export const GET_PRODUCT_CODES_INFO_FAILURE = 'GET_PRODUCT_CODES_INFO_FAILURE';

export const GET_PRODUCT_QUANTITY_INFO = 'GET_PRODUCT_QUANTITY_INFO';
export const GET_PRODUCT_QUANTITY_INFO_SUCCESS = 'GET_PRODUCT_QUANTITY_INFO_SUCCESS';
export const GET_PRODUCT_QUANTITY_INFO_FAILURE = 'GET_PRODUCT_QUANTITY_INFO_FAILURE';

export const GET_UNRESERVE_PRODUCTS_INFO = 'GET_UNRESERVE_PRODUCTS_INFO';
export const GET_UNRESERVE_PRODUCTS_INFO_SUCCESS = 'GET_UNRESERVE_PRODUCTS_INFO_SUCCESS';
export const GET_UNRESERVE_PRODUCTS_INFO_FAILURE = 'GET_UNRESERVE_PRODUCTS_INFO_FAILURE';

export const GET_COMPANY_PRICE_INFO = 'GET_COMPANY_PRICE_INFO';
export const GET_COMPANY_PRICE_INFO_SUCCESS = 'GET_COMPANY_PRICE_INFO_SUCCESS';
export const GET_COMPANY_PRICE_INFO_FAILURE = 'GET_COMPANY_PRICE_INFO_FAILURE';

export function getIndustriesInfo(model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INDUSTRIES, GET_INDUSTRIES_SUCCESS, GET_INDUSTRIES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReOrderingRulesExportInfo(model, productId, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  let payload = 'domain=[';
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  console.log(payload, 'payloaddddddd');
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_REORDERING_RULES_EXPORT, GET_REORDERING_RULES_EXPORT_SUCCESS, GET_REORDERING_RULES_EXPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReorderRuleDetailsInfo(model, id) {
  const payload = `model=${model}&ids=[${id}]`;
  return {
    [CALL_API]: {
      endpoint: `read?${payload}`,
      types: [GET_REORDER_RULE_DETAILS, GET_REORDER_RULE_DETAILS_SUCCESS, GET_REORDER_RULE_DETAILS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateReOrderingRuleInfo(model, id, data) {
  const payload = { ids: `[${id}]`, values: data };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_REORDERING_RULE, UPDATE_REORDERING_RULE_SUCCESS, UPDATE_REORDERING_RULE_SUCCESS],
      method: 'PUT',
      payload,
    },
  };
}

export function getReOrderingRulesInfo(model, companyId, limit, offset, sortByValue, sortFieldValue, customFilters, globalFilter, productId) {
  let payload = `domain=[["company_id","in",[${companyId}]]`;
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  if (productId && productId.length) {
    payload = `${payload},["product_id","in",[${productId}]]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=["name", "active", "warehouse_id", "location_id", "product_id", "product_uom", "product_min_qty","product_max_qty","qty_multiple","product_alert_level_qty"]`;
  if (limit) {
    payload = `${payload}&limit=${limit}`;
  }
  if (offset) {
    payload = `${payload}&offset=${offset}`;
  }
  if (sortFieldValue) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue) {
    payload = `${payload} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_REORDERING_RULES_INFO, GET_REORDERING_RULES_INFO_SUCCESS, GET_REORDERING_RULES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReOrderingCountInfo(model, companyId, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${companyId}]]`;
  // if (productTypes && productTypes.length) {
  //   payload = `${payload},["product_id","in",[${productTypes}]]`;
  // }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_REORDERING_RULES_COUNT, GET_REORDERING_RULES_COUNT_SUCCESS, GET_REORDERING_RULES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getProductTypesInfo(model) {
  const payload = `domain=[]&model=${model}&fields=[]&groupby=["product_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PRODUCT_TYPE, GET_PRODUCT_TYPE_SUCCESS, GET_PRODUCT_TYPE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getProductsListInfo(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter) {
  const fields = ['name', 'categ_id', 'qty_available', 'uom_id', 'standard_price','reordering_min_qty', 'reordering_max_qty', 'alert_level_qty', 'specification', 'unique_code', 'brand', 'preferred_vendor', 'type', 'reserved_quantity'];
  let payload = `domain=[["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue) {
    payload = `${payload} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PRODUCTS_LIST, GET_PRODUCTS_SUCCESS_LIST, GET_PRODUCTS_FAILURE_LIST],
      method: 'GET',
      payload,
    },
  };
}

export function getProductsExportInfo(company, model, limit, offset, fields, categories, types, customFilters, rows, sortBy, sortField, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortField) {
    payload = `${payload}&order=${sortField}`;
  }

  if (sortBy) {
    payload = `${payload} ${sortBy}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PRODUCTS_EXPORT, GET_PRODUCTS_EXPORT_SUCCESS, GET_PRODUCTS_EXPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductsCountInfo(company, model, categories, types, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PRODUCTS_COUNT, GET_PRODUCTS_COUNT_SUCCESS, GET_PRODUCTS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createProduct(model, data) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [ADD_PRODUCT, ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE],
      method: 'POST',
      payload: data,
    },
  };
}

export function createReorderingRules(model, data) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [ADD_REORDERING_RULES, ADD_REORDERING_RULES_SUCCESS, ADD_REORDERING_RULES_FAILURE],
      method: 'POST',
      payload: data,
    },
  };
}

export function getMeasuresInfo(model, keyword, category) {
  let payload = 'domain=[';
  if (category) {
    payload = `domain=[["category_id","=",${category}]`;
  }
  if (keyword && keyword.length) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MEASURES, GET_MEASURES_SUCCESS, GET_MEASURES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createBank(model, data) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [ADD_BANK, ADD_BANK_SUCCESS, ADD_BANK_FAILURE],
      method: 'POST',
      payload: data,
    },
  };
}

export function getLocationRouteInfo(company, model) {
  const payload = `domain=[["product_selectable", "=", true]]&model=${model}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_LOCATION_ROUTE, GET_LOCATION_ROUTE_SUCCESS, GET_LOCATION_ROUTE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function productCategoryList(company, model, categoryKeyword, isReport, startDate, endDate, opType, isInventory) {
  let payload = `domain=[["id","!=",false]]&model=${model}&limit=100&offset=0&order=name ASC&fields=["name","display_name"]`;
  if (categoryKeyword && categoryKeyword.length > 0) {
    payload = `domain=[["id","!=",false],["name","ilike","${categoryKeyword}"]]&model=${model}&limit=100&offset=0&order=name ASC&fields=["name","display_name"]`;
  }
 // let endPoint = `search_read?${payload}`;
  let endPoint = 'inventory/product/category';
  if (isReport) {
    endPoint = `transfers/product/category?start_date=${startDate}&end_date=${endDate}&operation_type=${opType}`;
  } else if (isInventory) {
    endPoint = 'inventory/product/category';
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [PRODUCT_CATEGORY_INFO, PRODUCT_CATEGORY_INFO_SUCCESS, PRODUCT_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function productsListData(company, model, keyword, inventory, startDate, endDate, type, categories) {
  let payload = `domain=[["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["unique_code","ilike","${keyword}"]`;
  }
  let cat = '';
  if(categories && categories.length){
    cat = `&category=${JSON.stringify(categories)}`
  }
  return {
    [CALL_API]: {
      endpoint: inventory ? `transfers/product/list?start_date=${startDate}&end_date=${endDate}&operation_type=${type}${encodeURIComponent(cat)}` : `search_read?${payload}]&model=${model}&limit=20&fields=["name","unique_code"]`,
      types: [GET_PRODUCT_DATA_INFO, GET_PRODUCT_DATA_SUCCESS, GET_PRODUCT_DATA_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getProductCategoryGroups(company, model) {
  const payload = `domain=[["categ_id","!=",false]]&model=${model}&fields=["categ_id"]&groupby=["categ_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [PCG_INFO, PCG_INFO_SUCCESS, PCG_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHsCodeInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&limit=100&offset=0&fields=["display_name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HS_CODE, GET_HS_CODE_SUCCESS, GET_HS_CODE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCustomerTaxesInfo(company, model, type) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (type && type === 'purchase') {
    payload = `${payload},["type_tax_use","=","purchase"]`;
  } else {
    payload = `${payload},["type_tax_use","=","sale"]`;
  }

  payload = `${payload}]&model=${model}&limit=100&offset=0&order=name ASC&fields=["id","name","display_name","amount"]`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CUSTOMER_TAXES, GET_CUSTOMER_TAXES_SUCCESS, GET_CUSTOMER_TAXES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductDetailsInfo(modelName, id, viewModel) {
  const fields = '["id","name","qty_available","reserved_quantity","standard_price","unique_code",("location_id",["id", "name","display_name"]), ("categ_id", ["id", "name","display_name"]),"image_medium",("company_id", ["id", "name"]),("preferred_vendor", ["id", "name"]),"create_date",("department_id", ["id", "name"]),("uom_id", ["id", "name",("category_id",["id","name"])]),"type","reordering_min_qty","reordering_max_qty","alert_level_qty","specification","brand","standard_price",["message_ids", ["id"]]]';

  const payload = `["id","=",${id}]`;

  let endPoint = `isearch_read_v2/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`;

  if (viewModel && (viewModel === 'product.product_report_view' || viewModel === 'product.company_product_report_view')) {
    endPoint = `read/${modelName}?ids=[${id}]&fields=[]`;
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_PRODUCT_DETAILS, GET_PRODUCT_DETAILS_SUCCESS, GET_PRODUCT_DETAILS_FAILURE],
      method: viewModel ? 'GET' : 'POST',
      payload,
    },
  };
}

export function updateProductInfo(model, id, data) {
  const payload = { ids: `[${id}]`, values: data };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [EDIT_PRODUCT, EDIT_PRODUCT_SUCCESS, EDIT_PRODUCT_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSellerIdsInfo(model, ids) {
  const payload = `domain=[["id","in",[${ids}]]]&model=${model}&fields=[]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SELLER_IDS, GET_SELLER_IDS_SUCCESS, GET_SELLER_IDS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorsListInfo(company, model, limit, offset, states, languages, customFilters, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]],["supplier","=",true],["parent_id","=",false]`;
  if (states && states.length === 1) {
    if (states[0] === 'person') {
      payload = `${payload},["is_company","=",false]`;
    } else if (states[0] === 'company') {
      payload = `${payload},["is_company","=",true]`;
    }
  }
  if (languages && languages.length > 0) {
    payload = `${payload},["lang","in",${JSON.stringify(languages)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["name","mobile","email","lang","street","company_type","create_date","company_id"]&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VENDORS_INFO, GET_VENDORS_INFO_SUCCESS, GET_VENDORS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorExportInfo(company, model, limit, offset, fields, states, languages, customFilters, rows) {
  let payload = `domain=[["company_id","in",[${company}]],["supplier","=",true],["parent_id","=",false]`;
  if (states && states.length === 1) {
    if (states[0] === 'person') {
      payload = `${payload},["is_company","=",false]`;
    } else if (states[0] === 'company') {
      payload = `${payload},["is_company","=",true]`;
    }
  }
  if (languages && languages.length > 0) {
    payload = `${payload},["lang","in",${JSON.stringify(languages)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VENDORS_EXPORT_INFO, GET_VENDORS_EXPORT_INFO_SUCCESS, GET_VENDORS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorsCountInfo(company, model, states, languages, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]],["supplier", "=", true],["parent_id", "=", false]`;
  if (states && states.length === 1) {
    if (states[0] === 'person') {
      payload = `${payload},["is_company","=",false]`;
    } else if (states[0] === 'company') {
      payload = `${payload},["is_company","=",true]`;
    }
  }
  if (languages && languages.length > 0) {
    payload = `${payload},["lang","in",${JSON.stringify(languages)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VENDORS_COUNT_INFO, GET_VENDORS_COUNT_INFO_SUCCESS, GET_VENDORS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRequestQuotationListInfo(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue, isPo) {
  const fields = quotationColumns && quotationColumns.quotationListFields ? quotationColumns.quotationListFields : [];
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (isPo && states && states.length === 0) {
    payload = `${payload},["state", "in", ["purchase", "done"]]`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(states)}]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["date_order",">=","${start}"],["date_order","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_RFQ_INFO, GET_RFQ_INFO_SUCCESS, GET_RFQ_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRequestExportInfo(company, model, limit, offset, fields, states, order, vendor, customFilters, isPo, rows) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (isPo && states && states.length === 0) {
    payload = `${payload},["state", "in", ["purchase", "done"]]`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["date_order",">=","${start}"],["date_order","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_RFQ_EXPORT_INFO, GET_RFQ_EXPORT_INFO_SUCCESS, GET_RFQ_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRequestQuotationCountInfo(company, model, states, order, vendor, customFilters, isPo) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (isPo && states && states.length === 0) {
    payload = `${payload},["state", "in", ["purchase", "done"]]`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(states)}]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["date_order",">=","${start}"],["date_order","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_RFQ_COUNT_INFO, GET_RFQ_COUNT_INFO_SUCCESS, GET_RFQ_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function purchaseStateChangeInfo(id, state, modelName, contex) {
  let payload = {};
  if (contex) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, context: contex,
    };
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_PURCHASE_STATE_CHANGE_INFO, GET_PURCHASE_STATE_CHANGE_INFO_SUCCESS, GET_PURCHASE_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function emailStateChangeInfo(id, state, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_EMAIL_STATE_CHANGE_INFO, GET_EMAIL_STATE_CHANGE_INFO_SUCCESS, GET_EMAIL_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function validateStateChangeInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_VALIDATE_INFO, GET_VALIDATE_INFO_SUCCESS, GET_VALIDATE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function backorderChangeInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_BACKORDER_INFO, GET_BACKORDER_INFO_SUCCESS, GET_BACKORDER_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getPrintReports(id, reportName, options) {
  let payload = `ids=[${id}]&report=${reportName}`;
  if (options) {
    payload = `ids=[${id}]&report=${reportName}&options=${JSON.stringify(options)}`;
  }
  return {
    [CALL_API]: {
      endpoint: `report?${payload}`,
      types: [GET_PRINT_CHANGE_INFO, GET_PRINT_CHANGE_INFO_SUCCESS, GET_PRINT_CHANGE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createComposeEmailInfo(result, modelName) {
  const formValues = { model: modelName, values: result };
  return {
    [CALL_API]: {
      endpoint: `create/${modelName}`,
      types: [CREATE_EMAIL_INFO, CREATE_EMAIL_INFO_SUCCESS, CREATE_EMAIL_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function getVendorGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["partner_id","!=",false]]&model=${model}&fields=["partner_id"]&groupby=["partner_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_VENDOR_GROUP_INFO, GET_VENDOR_GROUP_INFO_SUCCESS, GET_VENDOR_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPartnerTagsInfo(company, model) {
  const payload = `domain=[]&model=${model}&fields=["name"]&limit=200&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PARTNER_TAGS_INFO, GET_PARTNER_TAGS_INFO_SUCCESS, GET_PARTNER_TAGS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPaymentTermsInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PAYMENT_TERMS_INFO, GET_PAYMENT_TERMS_INFO_SUCCESS, GET_PAYMENT_TERMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWebsitesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WEBSITES_INFO, GET_WEBSITES_INFO_SUCCESS, GET_WEBSITES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getFiscalPositionsInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_FISCAL_POSITIONS_INFO, GET_FISCAL_POSITIONS_INFO_SUCCESS, GET_FISCAL_POSITIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAccountsInfo(company, model, type, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (type && type.length > 0) {
    payload = `${payload},["internal_type","=","${type}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INVOICE_ACCOUNTS_INFO, GET_INVOICE_ACCOUNTS_INFO_SUCCESS, GET_INVOICE_ACCOUNTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSupportSlasInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SLA_INFO, GET_SLA_INFO_SUCCESS, GET_SLA_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createVendorInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_VENDOR_INFO, CREATE_VENDOR_INFO_SUCCESS, CREATE_VENDOR_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createPurchaseRequestInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_PR_INFO, CREATE_PR_INFO_SUCCESS, CREATE_PR_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createRfqInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_RFQ_INFO, CREATE_RFQ_INFO_SUCCESS, CREATE_RFQ_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createStockScraps(id, result) {
  const formValues = { picking_ids: `[${id}]`, values: result };
  return {
    [CALL_API]: {
      endpoint: 'inventory/return',
      types: [CREATE_SCRAP_INFO, CREATE_SCRAP_INFO_SUCCESS, CREATE_SCRAP_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function getTaxDataInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=["id","name","amount"]`,
      types: [GET_TAX_DETAILS_INFO, GET_TAX_DETAILS_INFO_SUCCESS, GET_TAX_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getProductNames(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=["id","name"]`,
      types: [GET_PR_NAME_INFO, GET_PR_NAME_INFO_SUCCESS, GET_PR_NAME_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getUnitNames(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=["id","name"]`,
      types: [GET_UM_NAME_INFO, GET_UM_NAME_INFO_SUCCESS, GET_UM_NAME_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getQuotatioDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_QUOTATION_DETAILS_INFO, GET_QUOTATION_DETAILS_INFO_SUCCESS, GET_QUOTATION_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTransferDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_TRANSFER_DETAILS_INFO, GET_TRANSFER_DETAILS_INFO_SUCCESS, GET_TRANSFER_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getUpdateRfqInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_RFQ_INFO, UPDATE_RFQ_INFO_SUCCESS, UPDATE_RFQ_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getProductOrdersInfo(values, modelName, type) {
  let payload = '';
  if (type && type === 'scrap') {
    payload = `domain=[["move_id","in",[${values}]]]`;
  } else {
    payload = `domain=[["id","in",[${values}]]]`;
  }
  payload = `${payload}&model=${modelName}&fields=`;
  payload = `${payload}["name","display_name","product_id","date_planned","product_qty","product_uom_id","price_unit","price_subtotal","company_id","taxes_id","product_uom_qty","product_uom","qty_done","location_id","location_dest_id"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PRODUCT_ORDERDS_INFO, GET_PRODUCT_ORDERDS_INFO_SUCCESS, GET_PRODUCT_ORDERDS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStockProductsInfo(ids, model) {
  let payload = `domain=[["id","in",[${ids}]]]`;
  payload = `${payload}&model=${model}&fields=["display_name","type","uom_id","qty_available"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_PRODUCTS_INFO, GET_STOCK_PRODUCTS_INFO_SUCCESS, GET_STOCK_PRODUCTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStockQuantProductsInfo(ids, locationId, model) {
  let payload = `domain=[["product_id","in",[${ids}]]`;
  if (locationId) {
    payload = `${payload},["location_id","in",[${locationId}]]`;
  }
  payload = `${payload}]&model=${model}&fields=`;
  payload = `${payload}["display_name","product_id","location_id","quantity","reserved_quantity","product_uom_id"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_QUANT_PRODUCTS_INFO, GET_QUANT_PRODUCTS_INFO_SUCCESS, GET_QUANT_PRODUCTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRequestProductInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=`;
  payload = `${payload}["name","display_name","product_id","date_planned","product_qty","product_uom_id","price_unit","price_subtotal","company_id","taxes_id","product_uom_qty","qty_done"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_RP_INFO, GET_RP_INFO_SUCCESS, GET_RP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAgreeProductInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=`;
  payload = `${payload}["product_id","product_qty","qty_ordered","product_uom_id","schedule_date","account_analytic_id","price_unit"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AGP_INFO, GET_AGP_INFO_SUCCESS, GET_AGP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMoveOrders(arg, contex, state, modelName) {
  const payload = {
    args: arg, context: contex, model: modelName, method: state,
  };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_MOVE_ORDERDS_INFO, GET_MOVE_ORDERDS_INFO_SUCCESS, GET_MOVE_ORDERDS_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getTransfersInfo(companies, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, code) {
  let payload = `domain=[["company_id","in",[${companies}]]`;

  if (code) {
    payload = `${payload},["picking_type_code","=","${code}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${modelName}&fields=${JSON.stringify(['name', 'use_in', 'asset_id', 'space_id', 'employee_id', 'department_id', 'location_dest_id', 'location_id', 'partner_id', 'date', 'requested_on', 'expires_on', 'origin', 'group_id', 'backorder_id', 'request_state', 'priority', 'picking_type_id', 'picking_type_code', 'note', 'dc_no', 'po_no', 'cancel_comment'])}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TRANSFERS_INFO, GET_TRANSFERS_INFO_SUCCESS, GET_TRANSFERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTransfersCountInfo(companies, modelName, customFilters, globalFilter, code) {
  let payload = `domain=[["company_id","in",[${companies}]]`;
  if (code) {
    payload = `${payload},["picking_type_code","=","${code}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  payload = `${payload}]&model=${modelName}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TRANSFERS_COUNT_INFO, GET_TRANSFERS_COUNT_INFO_SUCCESS, GET_TRANSFERS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTransferExportInfo(companies, modelName, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, code) {
  let payload = `domain=[["company_id","in",[${companies}]]`;
  if (code) {
    payload = `${payload},["picking_type_code","=","${code}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${modelName}&fields=${JSON.stringify(fields)}
  &limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TRANSFERS_EXPORT_INFO, GET_TRANSFERS_EXPORT_INFO_SUCCESS, GET_TRANSFERS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTaxesInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["id","name","amount"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TAXES_INFO, GET_TAXES_INFO_SUCCESS, GET_TAXES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTemplateInfo(name, modelName) {
  let payload = 'domain=[';
  if (name) {
    payload = `${payload}["name","ilike","${name}"]`;
  }
  payload = `${payload}]&model=${modelName}&fields=["id","name"]&limit=1`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEMPLATE_INFO, GET_TEMPLATE_INFO_SUCCESS, GET_TEMPLATE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTemplateDetails(result, method, modelName) {
  const payload = `method=${method}&args=[${result}]&model=${modelName}`;

  return {
    [CALL_API]: {
      endpoint: `call?${payload}`,
      types: [GET_TEMP_DETAIL_INFO, GET_TEMP_DETAIL_INFO_SUCCESS, GET_TEMP_DETAIL_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getVendorDetails(id, modelName) {
  // const fields = assetColumns && assetColumns.viewFields ? assetColumns.viewFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_VENDOR_DETAILS, GET_VENDOR_DETAILS_SUCCESS, GET_VENDOR_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getVendorContactsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["name","email","mobile"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VENDOR_CONTACTS_INFO, GET_VENDOR_CONTACTS_INFO_SUCCESS, GET_VENDOR_CONTACTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorBanksInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["bank_id","acc_number"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VENDOR_BANKS_INFO, GET_VENDOR_BANKS_INFO_SUCCESS, GET_VENDOR_BANKS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTagsSelecetd(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["id","name"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VENDOR_TAGS, GET_VENDOR_TAGS_SUCCESS, GET_VENDOR_TAGS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function storeLogNotesInfo(modelName, formValues) {
  const payload = { model: modelName, values: formValues };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [STORE_LOG_NOTES, STORE_LOG_NOTES_SUCCESS, STORE_LOG_NOTES_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getActivityTypesInfo(company, model) {
  const payload = `domain=[]&model=${model}&fields=["name"]&limit=100&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ACTIVITY_TYPES, GET_ACTIVITY_TYPES_SUCCESS, GET_ACTIVITY_TYPES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function addActivityInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_MAIL_ACTIVITY_INFO, CREATE_MAIL_ACTIVITY_INFO_SUCCESS, CREATE_MAIL_ACTIVITY_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getStockPickingTypesInfo(company, model, keyword, type) {
  let payload = '';
  if (type) {
    payload = 'domain=[["code","!=",false]';
  } else {
    payload = 'domain=[["code","=","incoming"]';
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["code","name","warehouse_id","default_location_src_id","default_location_dest_id"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_PICKING_TYPES_INFO, GET_STOCK_PICKING_TYPES_INFO_SUCCESS, GET_STOCK_PICKING_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createReceiptInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: 'inventory',
      types: [CREATE_RECEIPT_INFO, CREATE_RECEIPT_INFO_SUCCESS, CREATE_RECEIPT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateReceiptInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_RECEIPT_INFO, UPDATE_RECEIPT_INFO_SUCCESS, UPDATE_RECEIPT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getStockLocationsInfo(company, model, keyword, type, parentLocation) {
  let payload = `domain=[["company_id","in",[${company}]],["usage","=","internal"]`;
  if (type && type.length > 0 && type !== 'inventory' && type !== 'scrap' && type !== 'scraplocation') {
    payload = `${payload},["${type}","=",true]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (type && type === 'inventory') {
    payload = `${payload},["usage","not in",["supplier", "production", "view"]]`;
  }
  /* if (type && type === 'scrap') {
    payload = `${payload},["usage","=","internal"]`;
  } */
  if (type && type === 'scraplocation') {
    payload = `${payload},["scrap_location","=",true]`;
  }
  if (parentLocation) {
    payload = `${payload},["id","child_of",${parentLocation}]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","location_id","display_name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_LOCATIONS_INFO, GET_STOCK_LOCATIONS_INFO_SUCCESS, GET_STOCK_LOCATIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStockWarehousesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_WAREHOUSE_INFO, GET_STOCK_WAREHOUSE_INFO_SUCCESS, GET_STOCK_WAREHOUSE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAgreementInfo(company, model, vendor) {
  let payload = `domain=[["company_id","in",[${company}]],["state", "in", ["in_progress", "open", "ongoing"]]`;
  if (vendor) {
    payload = `${payload},["vendor_id","=",${vendor}]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=100&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PURCHASE_AGREEMENT_INFO, GET_PURCHASE_AGREEMENT_INFO_SUCCESS, GET_PURCHASE_AGREEMENT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMoveProductsInfo(values, modelName, type, isMini, productId) {
  let payload = `domain=[["id","in",[${values}]]`;
  if (productId) {
    payload = `domain=[["product_id","in",[${productId}]]`;
  }
  if (type) {
    if (type === 'not_scrapped') {
      payload = `${payload},["scrapped","!=",true]`;
    }
    if (type === 'scrapped') {
      payload = `${payload},["scrapped","!=",false]`;
    }
  }
  let endPoint = '';
  if (isMini) {
    payload = `${payload}]&model=${modelName}&fields=["name",("product_uom", ["id", "name"]),("product_id", ["id", "name", "brand", ""unique_code"", ("categ_id", ["id", "name"]), "specification"]),"reserved_availability","product_uom_qty","quantity_done","is_quantity_done_editable","state"]&limit=200`;
    endPoint = 'search';
  } else {
    payload = `${payload}]&model=${modelName}&fields=["name","scrapped","product_uom","product_id","location_id","location_dest_id","reserved_availability","product_uom_qty","quantity_done","is_quantity_done_editable","state"]&limit=200`;
    endPoint = 'search_read';
  }
  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_MOVE_PRODUCTS_INFO, GET_MOVE_PRODUCTS_INFO_SUCCESS, GET_MOVE_PRODUCTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getMoveProductsDetails(values, modelName, type, isMini, productId) {
  let payload = `domain=[["id","in",[${values}]]`;
  if (productId) {
    payload = `domain=[["product_id","in",[${productId}]]`;
  }
  if (type) {
    if (type === 'not_scrapped') {
      payload = `${payload},["scrapped","!=",true]`;
    }
    if (type === 'scrapped') {
      payload = `${payload},["scrapped","!=",false]`;
    }
  }
  let endPoint = '';
  payload = `${payload}]&model=${modelName}&fields=["name",("product_uom", ["id", "name"]),("product_id", ["id", "name", "brand", "unique_code", ("categ_id", ["id", "name"]), "specification"]),"reserved_availability","product_uom_qty","quantity_done","is_quantity_done_editable","state"]&limit=200`;
  endPoint = 'search';
  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_MOVE_PRODUCTS_DETAIL, GET_MOVE_PRODUCTS_DETAIL_SUCCESS, GET_MOVE_PRODUCTS_DETAIL_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMoveProductsV1Info(values, modelName, type, isMini, productId) {
  let payload = `domain=[["id","in",[${values}]]`;
  if (productId) {
    payload = `domain=[["product_id","in",[${productId}]]`;
  }
  if (type) {
    if (type === 'not_scrapped') {
      payload = `${payload},["scrapped","!=",true]`;
    }
    if (type === 'scrapped') {
      payload = `${payload},["scrapped","!=",false]`;
    }
  }
  let endPoint = '';
  if (isMini) {
    payload = `${payload}]&model=${modelName}&fields=["id","name",("product_uom", ["id", "name"]),("product_id", ["id", "name", "brand", "unique_code", ("categ_id", ["id", "name"]), "specification"]),"reserved_availability","product_uom_qty","quantity_done","is_quantity_done_editable","state"]&limit=200`;
    endPoint = 'search';
  } else {
    payload = `${payload}]&model=${modelName}&fields=["name","scrapped","product_uom","product_id","location_id","location_dest_id","reserved_availability","product_uom_qty","quantity_done","is_quantity_done_editable","state"]&limit=200`;
    endPoint = 'search_read';
  }
  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_MOVE_PRODUCTSV1_INFO, GET_MOVE_PRODUCTSV1_INFO_SUCCESS, GET_MOVE_PRODUCTSV1_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScrapProductsInfo(id, modelName) {
  let payload = `domain=[["picking_id","in",[${id}]]`;
  payload = `${payload}]&model=${modelName}&fields=["scrap_qty","product_uom_id","product_id","location_id","scrap_location_id","state"]&limit=200`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SCRAP_PRODUCTS_INFO, GET_SCRAP_PRODUCTS_INFO_SUCCESS, GET_SCRAP_PRODUCTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseRequestInfo(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload}]&model=${model}&fields=["display_name"]&limit=20&offset=0&order=display_name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PURCHASE_REQUEST_INFO, GET_PURCHASE_REQUEST_INFO_SUCCESS, GET_PURCHASE_REQUEST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBankLists(company, model) {
  const payload = `domain=[]&model=${model}&fields=["name"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BANKS_INFO, GET_BANKS_INFO_SUCCESS, GET_BANKS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseRequestListInfo(company, model, limit, offset, states, order, vendor, customFilters, sortByValue, sortFieldValue) {
  const fields = requestColumns && requestColumns.requestListFields ? requestColumns.requestListFields : [];
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (states && states.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(states)}]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_INFO, GET_PR_INFO_SUCCESS, GET_PR_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseRequestExportInfo(company, model, limit, offset, fields, states, order, vendor, customFilters, rows) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(states)}]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_EXPORT_INFO, GET_PR_EXPORT_INFO_SUCCESS, GET_PR_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseRequestCountInfo(company, model, states, order, vendor, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(states)}]`;
  }
  if (order && order.length > 0) {
    const dates = getDatesOfQuery(order);
    if (dates.length > 0) {
      const start = `${dates[0]} 18:29:59`;
      const end = `${dates[1]} 18:30:00`;
      payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
    }
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload},["partner_id","in",[${vendor}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PR_COUNT_INFO, GET_PR_COUNT_INFO_SUCCESS, GET_PR_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseRequestDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_PR_DETAILS_INFO, GET_PR_DETAILS_INFO_SUCCESS, GET_PR_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getPurchaseProjects(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_PROJECT, GET_PR_PROJECT_SUCCESS, GET_PR_PROJECT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAccounts(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_ACCOUNT, GET_PR_ACCOUNT_SUCCESS, GET_PR_ACCOUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseLocations(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_LOCATION, GET_PR_LOCATION_SUCCESS, GET_PR_LOCATION_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseBudgets(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_BUDGET, GET_PR_BUDGET_SUCCESS, GET_PR_BUDGET_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseSubCategorys(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PR_SUBCATEGORY, GET_PR_SUBCATEGORY_SUCCESS, GET_PR_SUBCATEGORY_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStockPickingTypesListInfo(company, model, types, warehouses, customFilters) {
  let payload = 'domain=[["code","!=",false]';
  if (types && types.length > 0) {
    payload = `${payload},["code","in",${JSON.stringify(types)}]`;
  }
  if (warehouses && warehouses.length > 0) {
    payload = `${payload},["warehouse_id","in",[${warehouses}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["code","warehouse_id","count_picking_waiting","count_picking_late","count_picking_backorders","count_picking_ready","default_location_src_id","default_location_dest_id","name"]`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_PICKING_TYPES_LIST_INFO, GET_STOCK_PICKING_TYPES_LIST_INFO_SUCCESS, GET_STOCK_PICKING_TYPES_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAgreementListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  const fields = purchaseAgreementCustomData && purchaseAgreementCustomData.listFieldsAgree ? purchaseAgreementCustomData.listFieldsAgree : [];
  let payload = 'domain=[';

  if (keyword && keyword.length) {
    payload = `${payload}["visitor_name","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload}${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AGREE_LIST_INFO, GET_AGREE_LIST_INFO_SUCCESS, GET_AGREE_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAgreementListExportInfo(company, model, limit, offset, fields, customFilters, rows) {
  let payload = 'domain=[';

  if (customFilters && customFilters.length) {
    payload = `${payload}${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload}, ["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AGREE_EXPORT_LIST_INFO, GET_AGREE_EXPORT_LIST_INFO_SUCCESS, GET_AGREE_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAgreementCountInfo(company, model, customFilters, keyword) {
  let payload = 'domain=[';

  if (keyword && keyword.length) {
    payload = `${payload}["visitor_name","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload}${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_AGREE_COUNT_INFO, GET_AGREE_COUNT_INFO_SUCCESS, GET_AGREE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPurchaseAgreementDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_AGREE_DETAILS_INFO, GET_AGREE_DETAILS_INFO_SUCCESS, GET_AGREE_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function agreementStateChangeInfo(id, state, modelName, contex) {
  let payload = {};
  if (contex) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, context: contex,
    };
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_AGREE_STATE_CHANGE_INFO, GET_AGREE_STATE_CHANGE_INFO_SUCCESS, GET_AGREE_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function createAgreementRequestInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_AGREE_INFO, CREATE_AGREE_INFO_SUCCESS, CREATE_AGREE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getAgreementTypes(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AT_INFO, GET_AT_INFO_SUCCESS, GET_AT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function cancelTtransferInfo(id, messageTicket) {
  const formValues = { ids: `[${id}]`, cancel_comment: messageTicket };
  return {
    [CALL_API]: {
      endpoint: 'inventory/cancel',
      types: [CANCEL_TRANSFER_INFO, CANCEL_TRANSFER_INFO_SUCCESS, CANCEL_TRANSFER_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function updateTransferStatusInfo(id, result, stockType) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  if (stockType) {
    payload.stock_type = stockType;
  }
  return {
    [CALL_API]: {
      endpoint: 'inventory',
      types: [UPDATE_TRANSFER_STATUS_INFO, UPDATE_TRANSFER_STATUS_INFO_SUCCESS, UPDATE_TRANSFER_STATUS_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getInventoryDepartments(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ID_INFO, GET_ID_INFO_SUCCESS, GET_ID_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateTransferNoStatusInfo(id, result, stockType) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  if (stockType) {
    payload.stock_type = stockType;
  }
  return {
    [CALL_API]: {
      endpoint: 'inventory',
      types: [UPDATE_TRANSFER_NO_STATUS_INFO, UPDATE_TRANSFER_NO_STATUS_INFO_SUCCESS, UPDATE_TRANSFER_NO_STATUS_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getCompanyPriceInfo(productId) {
  // const payload = `domain=[["name","=","standard_price"],["res_id","=","${productId}"],["company_id","in",[${companyIds}]]]&model=ir.property&fields=["id","value_float","company_id","res_id"]`;
  return {
    [CALL_API]: {
      endpoint: `inventory/product/cost?product_id=${productId}`,
      types: [GET_COMPANY_PRICE_INFO, GET_COMPANY_PRICE_INFO_SUCCESS, GET_COMPANY_PRICE_INFO_FAILURE],
      method: 'GET',
      productId,
    },
  };
}

export function getCodeExistsInfo(id, code, modelName) {
  const fields = '["id"]';

  const payload = `["company_id","in",[${id}]],["unique_code","=","${code}"]`;

  return {
    [CALL_API]: {
      endpoint: `search?model=${modelName}&domain=[${payload}]&fields=${fields}&limit=1&order=create_date DESC`,
      types: [GET_PRODUCT_CODES_INFO, GET_PRODUCT_CODES_INFO_SUCCESS, GET_PRODUCT_CODES_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getProductQuantityInfo(locationId, productId) {
  const payload = { location_id: locationId, product_id: productId };

  return {
    [CALL_API]: {
      endpoint: 'inventory/product/qtyonhand',
      types: [GET_PRODUCT_QUANTITY_INFO, GET_PRODUCT_QUANTITY_INFO_SUCCESS, GET_PRODUCT_QUANTITY_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function setUnreserveProductsInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'inventory/unreserve',
      types: [GET_UNRESERVE_PRODUCTS_INFO, GET_UNRESERVE_PRODUCTS_INFO_SUCCESS, GET_UNRESERVE_PRODUCTS_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
