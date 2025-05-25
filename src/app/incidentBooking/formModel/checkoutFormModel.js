export default {
  formId: 'hxIncidentform',
  formField: {
    title: {
      name: 'name',
      label: 'Subject',
      requiredErrorMsg: 'Subject is required',
    },
    typeCategory: {
      name: 'type_category',
      label: 'Type',
      label1: 'Space',
      label2: 'Equipment',
    },
    targetClosureDate: {
      name: 'target_closure_date',
      label: 'Target Closure Date',
      required: false,
      requiredErrorMsg: 'Target Closure Date is required',
    },
    incidentOn: {
      name: 'incident_on',
      label: 'Incident On',
      required: true,
      requiredErrorMsg: 'Incident On is required',
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
    },
    severityId: {
      name: 'severity_id',
      label: 'Severity',
      required: true,
      requiredErrorMsg: 'Severity is required',
    },
    priorityId: {
      name: 'priority_id',
      label: 'Priority',
      required: true,
      requiredErrorMsg: 'Priority is required',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      required: true,
      requiredErrorMsg: 'Maintenance Team is required',
    },
    description: {
      name: 'description',
      label: 'Summary of the Incident',
    },
    personsWitnessed: {
      name: 'person_witnessed',
      label: 'Persons Witnessed',
    },
    equipmentId: {
      name: 'equipment_id',
      label: 'Equipment',
      required: true,
      requiredErrorMsg: 'Equipment is required',
    },
    assetId: {
      name: 'asset_id',
      label: 'Space',
      required: true,
      requiredErrorMsg: 'Space is required',
    },
    probabilityId: {
      name: 'probability_id',
      label: 'Probability',
    },
    incidentTypeId: {
      name: 'incident_type_id',
      label: 'Incident Type',
      required: true,
      requiredErrorMsg: 'Incident Type is required',
    },
  },
};
