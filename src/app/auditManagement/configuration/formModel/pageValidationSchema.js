import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    pageTitle,
  },
} = checkoutFormModel;

const pageValidationSchema = Yup.object().shape({
  [pageTitle.name]: Yup.string()
    .nullable()
    .required(`${pageTitle.requiredErrorMsg}`),
});

export default pageValidationSchema;
