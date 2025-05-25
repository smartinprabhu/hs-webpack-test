/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import contactFormModel from './contactFormModel';

import { getGlobalEmailRegex } from '../../../../../util/appUtils';

const {
  formField: {
    nameValue,
    type,
    visitorType,
    gender,
    phone,
    email,
  },
} = contactFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [type.name]: Yup.string()
    .required(`${type.requiredErrorMsg}`)
    .max(10, 'Code is too large'),
  [visitorType.name]: Yup.string()
    .nullable()
    .required(`${visitorType.requiredErrorMsg}`),
  [phone.name]: Yup.string()
    .required(`${phone.requiredErrorMsg}`)
    .matches(mobileRegEx, phone.invalidErrorMsg)
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(12, 'Mobile number should not be more than 12 digits'),
  [email.name]: Yup.string()
    .required(`${email.requiredErrorMsg}`)
    .matches(mailRegEx, email.invalidErrorMsg)
    .max(50, 'Email is too large'),
  [gender.name]: Yup.string()
    .nullable()
    .required(`${gender.requiredErrorMsg}`),
});

export default validationSchema;
