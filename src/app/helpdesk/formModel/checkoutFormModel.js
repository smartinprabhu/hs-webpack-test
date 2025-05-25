export default {
  formId: 'checkoutForm',
  formField: {
    company: {
      name: 'company_id',
      label: 'Site',
      requiredErrorMsg: 'Site is required',
    },
    personName: {
      name: 'requestee_id',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    Mobile: {
      name: 'mobile',
      label: 'Mobile',
      requiredErrorMsg: 'Mobile is required',
      invalidErrorMsg: 'Invalid Mobile Number',
    },
    Email: {
      name: 'email',
      label: 'Email',
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Email is not valid (e.g. abc@example.com)',
    },
    Channel: {
      name: 'channel',
      label: 'Channel',
      requiredErrorMsg: 'Channel is required',
    },
    issueType: {
      name: 'issue_type',
      label: 'Issue Type',
      requiredErrorMsg: 'Issue Type is required',
    },
    assetId: {
      name: 'asset_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    subject: {
      name: 'subject',
      label: 'Subject',
      requiredErrorMsg: 'Subject is required',
    },
    categoryId: {
      name: 'category_id',
      label: 'Problem Category',
      requiredErrorMsg: 'Category is required',
    },
    subCategorId: {
      name: 'sub_category_id',
      label: 'Problem Sub-Category',
      requiredErrorMsg: 'Sub Category is required',
    },
    priority: {
      name: 'priority_id',
      label: 'Priority',
      requiredErrorMsg: 'Priority is required',
    },
    parentId: {
      name: 'parent_id',
      label: 'Parent Ticket',
    },
    equipmentId: {
      name: 'equipment_id',
      label: 'Equipment',
    },
    Description: {
      name: 'description',
      label: 'Description',
    },
    raisedBy: {
      name: 'raise_by',
      label: 'Others',
      label1: 'Self',
    },
    typeCategory: {
      name: 'type_category',
      label:'Type',
      label1: 'Equipment',
      label2: 'Space',
      label3: 'IT',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      requiredErrorMsg: 'Maintenance Team is required',
    },
    incidentTypeId: {
      name: 'incident_type_id',
      label: 'Incident Type',
      requiredErrorMsg: 'Incident Type is required',
    },
    incidentSeverityId: {
      name: 'incident_severity_id',
      label: 'Severity',
    },
    incidentState: {
      name: 'incident_state',
      label: 'Incident State',
    },
    vendorId: {
      name: 'vendor_id',
      label: 'Vendor',
    },
    Constraints: {
      name: 'constraints',
      label: 'Constraints if any',
    },
    Cost: {
      name: 'cost',
      label: 'Cost (INR)',
    },
    ticketType: {
      name: 'ticket_type',
      label: 'Ticket Type',
      requiredErrorMsg: 'Ticket Type is required',
    },
    tenantName: {
      name: 'tenant_name',
      label: 'Tenant Name',
      requiredErrorMsg: 'Tenant is required',
    },
    tenantId: {
      name: 'tenant_id',
      label: 'Tenant',
      requiredErrorMsg: 'Tenant is required',
    },
  },
};
