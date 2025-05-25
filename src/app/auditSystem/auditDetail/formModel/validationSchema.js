/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
});

export default validationSchema;
