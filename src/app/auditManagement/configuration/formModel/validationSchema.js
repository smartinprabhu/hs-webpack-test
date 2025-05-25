import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    code,
    departmentId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .nullable()
    .required(`${title.requiredErrorMsg}`),
  [code.name]: Yup.string()
    .nullable()
    .required(`${code.requiredErrorMsg}`),
  [departmentId.name]: Yup.string()
    .nullable()
    .required(`${departmentId.requiredErrorMsg}`),
});

export default validationSchema;
