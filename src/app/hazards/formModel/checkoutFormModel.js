export default {
  formId: 'hxHazardform',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
    },
    companyId: {
      name: 'company_id',
      label: 'Site',
    },
    typeCategory: {
      name: 'type_category',
      label: 'Space',
      label1: 'Equipment',
    },
    targetClosureDate: {
      name: 'target_closure_date',
      label: 'Target Closure Date',
      required: false,
      requiredErrorMsg: 'Target Closure Date is required',
    },
    incidentOn: {
      name: 'incident_on',
      label: 'Report On',
      required: true,
      requiredErrorMsg: 'Report On is required',
    },
    categoryId: {
      name: 'category_id',
      label: 'Category',
      required: true,
      requiredErrorMsg: 'Category is required',
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
      label: 'Description',
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
    incidentTypeId: {
      name: 'incident_type_id',
      label: 'Type of Activity / Hazard',
      required: true,
      requiredErrorMsg: 'Type of Activity / Hazard is required',
    },
  },
};
