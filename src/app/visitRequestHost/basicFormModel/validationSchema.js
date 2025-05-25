/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    nameValue,
    mobile,
    email,
  },
} = formModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(50, 'Name is too large'),
  [mobile.name]: Yup.string().when('has_visitor_mobile', {
    is: 'Required',
    then: Yup.string()
      .required(`${mobile.requiredErrorMsg}`)
      .matches(mobileRegEx, 'Invalid mobile.')
      .min(10, 'Mobile number should not be less than 10 digits.')
      .max(13, 'Mobile number should not be more than 13 digits.'),
    otherwise: Yup.string()
      .matches(mobileRegEx, 'Invalid mobile.')
      .min(10, 'Mobile number should not be less than 10 digits.')
      .max(13, 'Mobile number should not be more than 13 digits.'),
  }),
  [email.name]: Yup.string().when('has_visitor_email', {
    is: 'Required',
    then: Yup.string().required(`${email.requiredErrorMsg}`).matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
    otherwise: Yup.string().matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
  }),
});

export default validationSchema;
