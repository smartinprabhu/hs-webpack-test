import * as Yup from 'yup';

import { getGlobalEmailRegex } from '../../../util/appUtils';

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const neighbourhoodValidationSchema = Yup.object().shape({
  work_phone: Yup.string()
    .matches(mobileRegEx, 'Invalid phone number')
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(12, 'Mobile number should not be more than 12 digits'),
  work_email: Yup.string()
    .matches(mailRegEx, 'Invalid email')
    .max(50, 'Email is too large'),
  space_neighbour_ids: Yup.string()
    .nullable()
    .required(mailRegEx, 'Neighbourhood required'),
});

export default neighbourhoodValidationSchema;
