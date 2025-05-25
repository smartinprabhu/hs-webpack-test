import * as Yup from 'yup';
import locationFormModel from './locationFormModel';

const {
  formField: {
    name,
  },
} = locationFormModel;

const locationValidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Location is too large'),
});

export default locationValidationSchema;
