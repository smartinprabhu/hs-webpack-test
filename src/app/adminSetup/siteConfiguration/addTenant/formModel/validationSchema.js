/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import tenantFormModel from './tenantFormModel';

import { getGlobalEmailRegex } from '../../../../util/appUtils';

const {
  formField: {
    nameValue,
    mobile,
    email,
  },
} = tenantFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`),

  [mobile.name]: Yup.string()
    .required(`${mobile.requiredErrorMsg}`)
    .matches(mobileRegEx, 'Invalid mobile')
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(13, 'Mobile number should not be more than 13 digits'),
  [email.name]: Yup.string()
    .required(`${email.requiredErrorMsg}`)
    .matches(mailRegEx, email.invalidErrorMsg)
    .max(50, 'Email is too large'),
});

export default validationSchema;
