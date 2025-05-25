/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    nameValue,
    mobileValue,
    employeeCode,
    diclaimerValue,
    otp,
    emailValue,
    isOTPVerified,
    locationId,
    partnerId,
  },
} = formModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;
const lettersRegEx = /^[a-zA-Z\s]*$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string().when('has_reviwer_name', {
    is: 'Required',
    then: Yup.string().required(`${nameValue.requiredErrorMsg}`).matches(lettersRegEx, 'Letters only allowed').max(50, 'Name is too large'),
    otherwise: Yup.string().matches(lettersRegEx, 'Letters only allowed').max(50, 'Name is too large'),
  }),
  [mobileValue.name]: Yup.string().when('has_reviwer_mobile', {
    is: 'Required',
    then: Yup.string()
      .required(`${mobileValue.requiredErrorMsg}`)
      .matches(mobileRegEx, 'Invalid mobile')
      .min(10, 'Mobile number should not be less than 10 digits')
      .max(13, 'Mobile number should not be more than 13 digits'),
    otherwise: Yup.string()
      .matches(mobileRegEx, 'Invalid mobile')
      .min(10, 'Mobile number should not be less than 10 digits')
      .max(13, 'Mobile number should not be more than 13 digits'),
  }),
  [emailValue.name]: Yup.string().when('has_reviwer_email', {
    is: 'Required',
    then: Yup.string().required(`${emailValue.requiredErrorMsg}`).matches(mailRegEx, 'Invalid email ID').max(50, 'Email is too large'),
    otherwise: Yup.string().matches(mailRegEx, 'Invalid email ID').max(50, 'Email is too large'),
  }),
  [employeeCode.name]: Yup.string().when('has_employee_code', {
    is: 'Required',
    then: Yup.string().required(`${employeeCode.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  has_email_validation: Yup.string()
    .required(`${emailValue.requiredErrorMsg}`),
  [otp.name]: Yup.string().when('requires_verification_by_otp', {
    is: true,
    then: Yup.string().required(`${otp.requiredErrorMsg}`).max(10, 'OTP is too large'),
  }),
  [isOTPVerified.name]: Yup.string().when('requires_verification_by_otp', {
    is: true,
    then: Yup.string().required(`${isOTPVerified.requiredErrorMsg}`),
  }),
  [diclaimerValue.name]: Yup.string().when('has_disclaimer', {
    is: 'Required',
    then: Yup.string().required(`${diclaimerValue.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  [locationId.name]: Yup.string().when('has_location', {
    is: 'Required',
    then: Yup.string().required(`${locationId.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  [partnerId.name]: Yup.string().when('has_tenant', {
    is: 'Required',
    then: Yup.string().required(`${partnerId.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
});

export default validationSchema;
