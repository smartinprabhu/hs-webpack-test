import * as Yup from 'yup';

import { getGlobalEmailRegex } from '../../../util/appUtils';

const lettersOnly = /^[a-zA-Z ]*$/;
const mailRegEx = getGlobalEmailRegex();
const urlOnly = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const companyValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .matches(lettersOnly, 'Only letters are allowed')
    .max(30, 'Name is too large'),
  res_company_categ_id: Yup.string()
    .nullable()
    .required('Category is required'),
  country_id: Yup.string()
    .nullable()
    .required('Country is required'),
  state_id: Yup.string()
    .nullable()
    .required('State is required'),
  company_tz: Yup.string()
    .nullable()
    .required('Time Zone is required'),
  currency_id: Yup.string()
    .nullable()
    .required('Currency is required'),
  website: Yup.string()
    .required('Website is required'),
  street: Yup.string()
    .required('Address is required'),
  city: Yup.string()
    .required('City is required'),
  zip: Yup.number()
    .required('ZIP is required'),
  email: Yup.string()
    .matches(mailRegEx, 'Invalid email Id'),
  social_twitter: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
  social_facebook: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
  social_github: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
  social_linkedin: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
  social_youtube: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
  social_instagram: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
});

export default companyValidationSchema;
