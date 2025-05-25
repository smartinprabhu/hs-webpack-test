import checkoutFormModel from './pantrycheckoutFormModel';

const {
  formField: {
    name,
    maintenanceTeam,
    spaces,
    workingTime,
    companyId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [maintenanceTeam.name]: '',
  [spaces.name]: '',
  [workingTime.name]: '',
  [companyId.name]: '',
};
