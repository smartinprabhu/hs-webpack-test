export default {
  formId: 'PurchaseRequestForm',
  formField: {
    requisitionName: {
      name: 'requisition_name',
      label: 'Requisition Purpose',
      requiredErrorMsg: 'Requisition Purpose is required',
    },
    projects: {
      name: 'project_id',
      label: 'Projects',
    },
    accounts: {
      name: 'account_id',
      label: 'Accounts',
    },
    location: {
      name: 'location_id',
      label: 'Location',
    },
    budget: {
      name: 'budget_id',
      label: 'Budget',
    },
    subCategory: {
      name: 'sub_category_id',
      label: 'Sub Category',
    },
    vendor: {
      name: 'partner_id',
      label: 'Vendor',
    },
    requestorName: {
      name: 'requestor_full_name',
      label: 'Requestor Name',
    },
    email: {
      name: 'requestor_email',
      label: 'Email',
    },
    siteSpoc: {
      name: 'site_spoc',
      label: 'Site SPOC',
      requiredErrorMsg: 'Site SPOC is required',
    },
    siteContactDetails: {
      name: 'site_contact_details',
      label: 'Site Contact Details',
      requiredErrorMsg: 'Site Contact Details is required',
    },
    billingAddress: {
      name: 'bill_to_address',
      label: 'Billing Address',
    },
    shippingAddress: {
      name: 'ship_to_address',
      label: 'Shipping Address',
    },
    comments: {
      name: 'comments',
      label: 'Comments',
    },
    requisationCode: {
      name: 'HS_requisition_id',
      label: 'Requisation Code',
    },
    description: {
      name: 'purpose_description',
      label: 'Description',
    },
  },
};
