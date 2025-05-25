export default {
  formId: 'purchaseagreementForm',
  formField: {
    purchaseRepresentative: {
      name: 'user_id',
      label: 'Purchase Representative',
      required: true,
      requiredErrorMsg: 'Purchase representative is required',
    },
    agreementType: {
      name: 'type_id',
      label: 'Agreement Type',
      required: true,
      requiredErrorMsg: 'Agreement type is required',
    },
    vendor: {
      name: 'vendor_id',
      label: 'Vendor',
    },
    agreementDeadline: {
      name: 'date_end',
      label: 'Agreement Deadline',
    },
    orderingDate: {
      name: 'ordering_date',
      label: 'Ordering Date',
    },
    scheduledDate: {
      name: 'schedule_date',
      label: 'Scheduled Date',
    },
    sourceDocument: {
      name: 'origin',
      label: 'Source Document',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
    },
  },
};
