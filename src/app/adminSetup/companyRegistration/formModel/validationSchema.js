/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import companyFormModel from './companyFormModel';

import { getGlobalEmailRegex } from '../../../util/appUtils';

const {
  formField: {
    nameValue,
    mobile,
    email,
    companyName,
    website,
  },
} = companyFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;
const urlOnly = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(50, 'Name is too large'),
  [mobile.name]: Yup.string()
    .required(`${mobile.requiredErrorMsg}`)
    .matches(mobileRegEx, 'Invalid mobile.')
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(12, 'Mobile number should not be more than 12 digits'),
  [email.name]: Yup.string()
    .required(`${email.requiredErrorMsg}`)
    .matches(mailRegEx, 'Invalid email ID.')
    .max(50, 'Email is too large'),
  [companyName.name]: Yup.string()
    .required(`${companyName.requiredErrorMsg}`)
    .max(50, 'Company Name is too large'),
  [website.name]: Yup.string()
    .matches(urlOnly, 'Invalid URL.')
    .max(50, 'Website URL is too large'),
});

export default validationSchema;
