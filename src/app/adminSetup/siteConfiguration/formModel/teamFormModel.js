export default {
  formId: 'teamForm',
  formField: {
    maintenanceTeam: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    workingTime: {
      name: 'resource_calendar_id',
      label: 'Working Time',
      required: true,
      requiredErrorMsg: 'Working Time is required',
    },
    teamCategory: {
      name: 'team_category_id',
      label: 'Team Category',
      requiredErrorMsg: 'Category is required',
      required: true,
    },
    hourlyLabourCost: {
      name: 'labour_cost_unit',
      required: false,
      label: 'Hourly Labour Cost',
    },
    maitenanceCostsAnalyticAccount: {
      name: 'maintenance_cost_analytic_account_id',
      label: 'Maintenance Costs Analytic Account*',
      required: true,
      requiredErrorMsg: 'Maintenance Costs Analytic Account is required',
    },
    companyId: {
      name: 'company_id',
      label: 'Company*',
      required: true,
      requiredErrorMsg: 'Company is required',
    },
    responsible: {
      name: 'responsible_id',
      label: 'Responsible',
      required: false,
    },
    space: {
      name: 'location_ids',
      label: 'Space',
      required: false,
    },
    type: {
      name: 'team_type',
      label: 'FM Team',
      label1: 'Vendor Team',
      label2: 'Monitoring Team',
      required: true,
    },
  },
};
