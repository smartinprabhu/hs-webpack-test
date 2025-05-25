export default {
  formId: 'trackercheckoutForm',
  formField: {
    raisedBy: {
      name: 'requested_by',
      label: 'Requested By',
      required: true,
      requiredErrorMsg: 'Requested is required',
    },
    title: {
      name: 'subject',
      label: 'Subject',
      required: true,
      requiredErrorMsg: 'Subject is required',
    },
    raisedOn: {
      name: 'generated_on',
      label: 'Generated On',
      required: true,
      requiredErrorMsg: 'Generated is required',
    },
    incidentDate: {
      name: 'planned_sla_end_date',
      label: 'Planned SLA End Date',
    },
    categoryId: {
      name: 'category_id',
      label: 'Category',
      required: true,
      requiredErrorMsg: 'Category is required',
    },
    subCategoryId: {
      name: 'sub_category_id',
      label: 'Sub Category',
      required: true,
      requiredErrorMsg: 'Sub Category is required',
    },
    Severity: {
      name: 'severity',
      label: 'Severity',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
    },
    descriptionOfBreakdown: {
      name: 'description',
      label: 'Description',
    },
    remark: {
      name: 'resolution',
      label: 'Resolution',
    },
    companyId: {
      name: 'company_id',
      label: 'Site',
    },
    types: {
      name: 'type_category',
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
  },
};
