import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    locationId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(50, 'Audit Description is too large'),
  [locationId.name]: Yup.string()
    .nullable()
    .required(`${locationId.requiredErrorMsg}`),
});

export default validationSchema;
