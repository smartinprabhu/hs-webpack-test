/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    Company,
    contactPerson,
    isOTPVerified,
    otp,
    disclaimer,
  },
} = formModel;

const mailRegEx = getGlobalEmailRegex();

const validationSchema = Yup.object().shape({
  [Company.name]: Yup.string().when('has_host_name', {
    is: 'Required',
    then: Yup.string().required(`${Company.requiredErrorMsg}`)
      .max(100, 'Host name is too large'),
  }),
  [contactPerson.name]: Yup.string().when('has_host_email', {
    is: 'Required',
    then: Yup.string().required(`${contactPerson.requiredErrorMsg}`)
      .matches(mailRegEx, 'Invalid email ID')
      .max(50, 'Email is too large'),
  }),
  [isOTPVerified.name]: Yup.string().when('has_host_email', {
    is: 'Required',
    then: Yup.string().required(`${isOTPVerified.requiredErrorMsg}`),
  }),
  [otp.name]: Yup.string().when('has_host_email', {
    is: 'Required',
    then: Yup.string().required(`${otp.requiredErrorMsg}`)
      .max(10, 'OTP is too large'),
  }),
  [disclaimer.name]: Yup.string()
    .required(`${disclaimer.requiredErrorMsg}`),
});

export default validationSchema;
