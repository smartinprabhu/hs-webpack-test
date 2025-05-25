/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import tenantFormModel from './tenantFormModel';

const {
  formField: {
    nameValue,
  },
} = tenantFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
});

export default validationSchema;
