import * as Yup from 'yup';
import checkoutFormModel from './pantrycheckoutFormModel';

const {
  formField: {
    name,
    maintenanceTeam,
  },
} = checkoutFormModel;

const pantryvalidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [maintenanceTeam.name]: Yup.string()
    .nullable()
    .required(`${maintenanceTeam.requiredErrorMsg}`),
});

export default pantryvalidationSchema;
