import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    shortName,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Warehouse is too large'),
  [shortName.name]: Yup.string()
    .required(`${shortName.requiredErrorMsg}`)
    .max(30, 'Short Name is too large'),
});

export default validationSchema;
