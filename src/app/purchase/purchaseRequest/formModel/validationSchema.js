import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    requisitionName,
    siteSpoc,
    siteContactDetails,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [requisitionName.name]: Yup.string()
    .required(`${requisitionName.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [siteSpoc.name]: Yup.string()
    .required('Site SPOC is required'),
  [siteContactDetails.name]: Yup.string()
    .required('Site Contact Details is required'),
});

export default validationSchema;
