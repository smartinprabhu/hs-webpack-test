import * as Yup from 'yup';

import { getGlobalEmailRegex } from '../../util/appUtils';

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const neighbourhoodValidationSchema = Yup.object().shape({
  work_phone: Yup.string()
    .matches(mobileRegEx, 'Invalid Phone Number')
    .min(10, 'Mobile Number Should not be less than 10 Digits')
    .max(12, 'Mobile Number Should not be more than 12 Digits'),
  email: Yup.string()
    .matches(mailRegEx, 'Invalid Email ID')
    .max(50, 'Email was too Large'),
  space_neighbour_ids: Yup.string()
    .nullable()
    .required(mailRegEx, 'Neighbourhood Required'),
});

export default neighbourhoodValidationSchema;
