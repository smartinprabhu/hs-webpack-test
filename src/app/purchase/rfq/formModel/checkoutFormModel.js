export default {
  formId: 'rfqForm',
  formField: {
    partnerId: {
      name: 'partner_id',
      label: 'Vendor',
      requiredErrorMsg: 'Vendor is required',
    },
    partnerRef: {
      name: 'partner_ref',
      label: 'Vendor Reference',
      requiredErrorMsg: 'Vendor Reference is required',
    },
    dateOrder: {
      name: 'date_order',
      label: 'Order Date',
      requiredErrorMsg: 'Order Date is required',
      required: true,
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
      requiredErrorMsg: 'Company is required',
    },
    requisitionId: {
      name: 'requisition_id',
      label: 'Purchase Agreement',
      requiredErrorMsg: 'Purchase Agreement is required',
    },
    requestId: {
      name: 'request_id',
      label: 'Purchase Request',
      requiredErrorMsg: 'Purchase Request is required',
    },
    pickingTypeId: {
      name: 'picking_type_id',
      label: 'Deliver To',
      requiredErrorMsg: 'Deliver To is required',
    },
    datePlanned: {
      name: 'date_planned',
      label: 'Scheduled Date',
    },
    incotermId: {
      name: 'incoterm_id',
      label: 'Incoterm',
    },
    userId: {
      name: 'user_id',
      label: 'Purchase Respresentative',
    },
    invoiceStatus: {
      name: 'invoice_status',
      label: 'Billing Status',
    },
    paymentTermId: {
      name: 'payment_term_id',
      label: 'Payment Terms',
    },
    fiscalPositionId: {
      name: 'fiscal_position_id',
      label: 'Fiscal Position',
    },
  },
};
