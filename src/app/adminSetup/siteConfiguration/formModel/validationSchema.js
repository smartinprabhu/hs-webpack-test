/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import teamFormModel from './teamFormModel';

const {
  formField: {
    maintenanceTeam,
    teamCategory,
    type,
    workingTime,
    maitenanceCostsAnalyticAccount,
    companyId,
  },
} = teamFormModel;

const validationSchema = Yup.object().shape({
  [maintenanceTeam.name]: Yup.string()
    .required(`${maintenanceTeam.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [teamCategory.name]: Yup.string()
    .nullable()
    .required(`${teamCategory.requiredErrorMsg}`),
  [type.name]: Yup.string()
    .nullable()
    .required(`${type.requiredErrorMsg}`),
  [maitenanceCostsAnalyticAccount.name]: Yup.string()
    .nullable()
    .required(`${maitenanceCostsAnalyticAccount.requiredErrorMsg}`),
  [workingTime.name]: Yup.string()
    .nullable()
    .required(`${workingTime.requiredErrorMsg}`),
  /* [companyId.name]: Yup.string()
    .nullable()
    .required(`${companyId.requiredErrorMsg}`), */
});

export default validationSchema;
