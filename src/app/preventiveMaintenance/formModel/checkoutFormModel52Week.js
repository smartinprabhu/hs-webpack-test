export default {
  formId: 'checkoutForm',
  formField: {
    Week: {
      name: 'week',
      label: 'Week',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      requiredErrorMsg: 'Maintenance Team is required',
    },
    startingDate: {
      name: 'starts_on',
      label: 'Starts On',
    },
    endDate: {
      name: 'ends_on',
      label: 'Ends On',
    },
    Duration: {
      name: 'duration',
      label: 'Duration (Hours)',
    },
    schedulePeriod: {
      name: 'schedule_period_id',
      label: 'Scheduled Period',
    },
    MaintenanceYear: {
      name: 'maintenance_year_id',
      label: 'Maintenance Year',
    },    
  },
};
