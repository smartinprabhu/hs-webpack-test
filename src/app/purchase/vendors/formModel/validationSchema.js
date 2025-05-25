import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

import { getGlobalEmailRegex } from '../../../util/appUtils';

const {
  formField: {
    name,
    address,
    city,
    stateId,
    countryId,
    zip,
    mobile,
    email,
    website,
    Lang,
    categoryId,
    filePath,
  },
} = checkoutFormModel;

const mailRegEx = getGlobalEmailRegex();
const urlOnly = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [stateId.name]: Yup.string()
    .nullable()
    .required(`${stateId.requiredErrorMsg}`),
  [categoryId.name]: Yup.string(),
  [countryId.name]: Yup.string()
    .nullable()
    .required(`${countryId.requiredErrorMsg}`),
  [Lang.name]: Yup.string()
    .nullable()
    .required(`${Lang.requiredErrorMsg}`),
  [email.name]: Yup.string()
    .required(`${email.requiredErrorMsg}`)
    .matches(mailRegEx, 'Invalid email')
    .max(50, 'Email is too large'),
  [mobile.name]: Yup.string()
    .required(`${mobile.requiredErrorMsg}`)
    .matches(mobileRegEx, 'Invalid mobile.')
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(12, 'Mobile number should not be more than 12 digits'),
  [website.name]: Yup.string()
    .matches(urlOnly, 'Invalid URL')
    .required('Website is required'),
  [address.name]: Yup.string()
    .required('Address is required'),
  [city.name]: Yup.string()
    .required('City is required'),
  [zip.name]: Yup.number()
    .required('ZIP is required'),
  [filePath.name]: Yup.string()
    .matches(urlOnly, 'Invalid URL'),
});

export default validationSchema;
