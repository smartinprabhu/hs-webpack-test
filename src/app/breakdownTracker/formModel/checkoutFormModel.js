export default {
  formId: 'trackercheckoutForm',
  formField: {
    raisedBy: {
      name: 'raised_by_id',
      label: 'Raised By',
    },
    title: {
      name: 'title',
      label: 'Title',
      required: true,
      requiredErrorMsg: 'Title is required',
    },
    raisedOn: {
      name: 'raised_on',
      label: 'Raised On*',
      required: true,
      requiredErrorMsg: 'Raised is required',
    },
    incidentDate: {
      name: 'incident_date',
      label: 'Incident Date',
      required: true,
      requiredErrorMsg: 'Incident Date is required',
    },
    serviceCategoryId: {
      name: 'service_category_id',
      label: 'Service Category',
      requiredErrorMsg: 'Service Category is required',
    },
    ciriticalitys: {
      name: 'ciriticality',
      label: 'Criticality',
      requiredErrorMsg: 'Criticality is required',
    },
    descriptionOfBreakdown: {
      name: 'description_of_breakdown',
      label: 'Description of Breakdown/Failure',
      required: true,
      requiredErrorMsg: 'Description of Breakdown/Failure is required',
    },
    resultsInStatutoryNonCompliance: {
      name: 'is_results_in_statutory_non_compliance',
      label: 'Results in Statutory Non-Compliance?',
    },
    breakdownDueToAgeing: {
      name: 'is_breakdown_due_to_ageing',
      label: 'Breakdown due to Ageing?',
    },
    isServiceImpacted: {
      name: 'is_service_impacted',
      label: 'Is Service Impacted?',
    },
    serviceImpactedIds: {
      name: 'services_impacted_ids',
      label: 'Services Impacted',
      requiredErrorMsg: 'Service Impacted is required',
    },
    incidentAge: {
      name: 'incident_age',
      label: 'Incident Age',
    },
    expectedClosureDate: {
      name: 'expexted_closure_date',
      label: 'Expected Closure Date',
      required: true,
      requiredErrorMsg: 'Expected Closure Date is required',
    },
    attendedOn: {
      name: 'attended_on',
      label: 'Attended On',
    },
    actionTaken: {
      name: 'action_taken',
      label: 'Action Taken',
    },
    closedOn: {
      name: 'closed_on',
      label: 'Closed On',
    },
    remark: {
      name: 'remarks',
      label: 'Remarks',
    },
    companyId: {
      name: 'company_id',
      label: 'Site',
    },
    types: {
      name: 'type',
      label: 'Space',
      label1: 'Equipment',
      requiredErrorMsg: 'Type is required',
    },
    spaceId: {
      name: 'space_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    equipmentId: {
      name: 'equipment_id',
      label: 'Asset',
      requiredErrorMsg: 'Asset is required',
    },
    amcStatus: {
      name: 'amc_status',
      label: 'AMC Status',
      requiredErrorMsg: 'AMC Status is required',
    },
    vendorName: {
      name: 'vendor_name',
      label: 'Vendor Name',
    },
    complaintNo: {
      name: 'complaint_no',
      label: 'Complaint No',
    },
    vendorSrNumber: {
      name: 'vendor_sr_number',
      label: 'Vendor FSR Number (Field Service Number)',
    },
    Priority: {
      name: 'priority',
      label: 'Priority',
    },
  },
};
