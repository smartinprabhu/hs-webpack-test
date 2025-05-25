/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import userFormModel from './userFormModel';

import { getGlobalEmailRegex } from '../../../../util/appUtils';

const {
  formField: {
    name,
    email,
    employeeId,
    companyId,
    roleIds,
    associateId,
    phoneNumber,
    associateTo,
    Password,
    companyIds,
  },
} = userFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const validationObj = {
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [employeeId.name]: Yup.string()
    .required(`${employeeId.requiredErrorMsg}`)
    .max(50, 'EmployeeId is too large'),
  [companyId.name]: Yup.string()
    .nullable()
    .required(`${companyId.requiredErrorMsg}`),
  [roleIds.name]: Yup.string()
    .nullable()
    .required(`${roleIds.requiredErrorMsg}`),
  [companyIds.name]: Yup.string()
    .nullable()
    .required(`${companyIds.requiredErrorMsg}`),
  [associateTo.name]: Yup.string()
    .nullable()
    .required(`${associateTo.requiredErrorMsg}`),
  // [associateId.name]: Yup.string().when('associates_to', (val) => {
  //   if (val !== 'Client') {
  //     return Yup.string().required(`${associateId.requiredErrorMsg}`);
  //   }
  // }),
  [phoneNumber.name]: Yup.string()
    .matches(mobileRegEx, 'Invalid mobile no')
    .min(10, 'Mobile Number should not be less than 10 digits')
    .max(12, 'Mobile Number should not be more than 12 digits'),
};

const returnValidationObj = (isAdUser) => {
  if (!isAdUser) {
    validationObj[Password.name] = Yup.string()
      .required(`${Password.requiredErrorMsg}`)
      .matches(passRegex, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.')
      .min(8, 'Password length should be at least 8');

    validationObj[email.name] = Yup.string()
      .required(`${email.requiredErrorMsg}`)
      .matches(mailRegEx, email.invalidErrorMsg)
      .max(50, 'Email is too large');
  }
  return validationObj;
};

const validationSchema = (isAdUser) => Yup.object().shape(returnValidationObj(isAdUser));

export default validationSchema;