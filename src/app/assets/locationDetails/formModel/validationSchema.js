/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import locationFormModel from './locationFormModel';

const {
  formField: {
    spaceName,
    shortCode,
    Type,
    maintenanceTeam,
    company,
  },
} = locationFormModel;

const validationSchema = Yup.object().shape({
  [spaceName.name]: Yup.string()
    .required(`${spaceName.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [shortCode.name]: Yup.string()
    .required(`${shortCode.requiredErrorMsg}`)
    .max(30, 'Code is too large'),
  [Type.name]: Yup.string()
    .nullable()
    .required(`${Type.requiredErrorMsg}`),
  [maintenanceTeam.name]: Yup.string()
    .nullable()
    .required(`${maintenanceTeam.requiredErrorMsg}`),
  [company.name]: Yup.string()
    .nullable()
    .required(`${company.requiredErrorMsg}`),
});

export default validationSchema;
