import locationFormModel from './teamFormModel';

const {
  formField: {
    maintenanceTeam,
    workingTime,
    teamCategory,
    hourlyLabourCost,
    maitenanceCostsAnalyticAccount,
    type,
    responsible,
    space,
    companyId,
  },
} = locationFormModel;

export default {
  [maintenanceTeam.name]: '',
  [responsible.name]: '',
  [space.name]: '',
  [workingTime.name]: '',
  [teamCategory.name]: '',
  [hourlyLabourCost.name]: '',
  [maitenanceCostsAnalyticAccount.name]: '',
  [companyId.name]: '',
  [type.name]: 'FM Team',
};
