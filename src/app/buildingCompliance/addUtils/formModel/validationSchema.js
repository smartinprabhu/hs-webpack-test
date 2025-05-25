/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import tenantFormModel from './tenantFormModel';

const {
  formField: {
    nameValue,
  },
} = tenantFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string().trim()
    .required(`${nameValue.requiredErrorMsg}`),
});

export default validationSchema;
