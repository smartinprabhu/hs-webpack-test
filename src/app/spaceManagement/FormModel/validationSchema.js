import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    Name,
    locationId,
    categoryId,
    maintenanceTeamId,
  },
} = checkoutFormModel;

export default [
  Yup.object().shape({
    [Name.name]: Yup.string().required(`${Name.requiredErrorMsg}`),
    [locationId.name]: Yup.string()
      .nullable()
      .required(`${locationId.requiredErrorMsg}`),
    [categoryId.name]: Yup.string()
      .nullable()
      .required(`${categoryId.requiredErrorMsg}`),
    [maintenanceTeamId.name]: Yup.string()
      .nullable()
      .required(`${maintenanceTeamId.requiredErrorMsg}`),
  }),
];
