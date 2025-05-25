export default {
  formId: 'configPantryForm',
  formField: {
    name: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    maintenanceTeam: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      required: true,
      requiredErrorMsg: 'Maintenance Team is required',
    },
    spaces: {
      name: 'spaces_ids',
      label: 'Spaces',
    },
    workingTime: {
      name: 'resource_calendar_id',
      label: 'Working Time',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
      requiredErrorMsg: 'Company is required',
    },
  },
};
