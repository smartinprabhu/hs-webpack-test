/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    purpose,
    Reference,
    requestor,
    RequestedOn,
    space,
    bearerName,
    bearerReturnOn,
    bearerMobile,
    bearerEmail,
    vendorId,
    gatePassType,
  },
} = checkoutFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [purpose.name]: Yup.string()
    .trim().required()
    .required(`${purpose.requiredErrorMsg}`),
  [requestor.name]: Yup.string()
    .required(`${requestor.requiredErrorMsg}`),
  /* [gatePassType.name]: Yup.string()
    .required(`${gatePassType.requiredErrorMsg}`), */
  [RequestedOn.name]: Yup.string()
    .required(`${RequestedOn.requiredErrorMsg}`),
  [bearerName.name]: Yup.string()
    .required(`${bearerName.requiredErrorMsg}`),
  date_valid: Yup.string()
    .required(`${bearerReturnOn.requiredErrorMsg}`),
  [bearerMobile.name]: Yup.string().when('has_bearer_mobile', {
    is: 'Required',
    then: Yup.string().required(`${bearerMobile.requiredErrorMsg}`)
      .matches(mobileRegEx, 'Invalid Mobile.')
      .min(10, 'Mobile number should not be less than 10 digits')
      .max(12, 'Mobile number should not be more than 12 digits'),
  }),
  [bearerEmail.name]: Yup.string().when('has_bearer_email', {
    is: 'Required',
    then: Yup.string().required(`${bearerEmail.requiredErrorMsg}`)
      .matches(mailRegEx, 'Invalid Email ID.')
      .max(50, 'Email is too large'),
  }),
  [vendorId.name]: Yup.string().when('has_vendor', {
    is: 'Required',
    then: Yup.string().required(`${vendorId.requiredErrorMsg}`),
  }),
  [space.name]: Yup.string().when('has_space', {
    is: 'Required',
    then: Yup.string().required(`${space.requiredErrorMsg}`),
  }),
  [Reference.name]: Yup.string().when('has_reference', {
    is: 'Required',
    then: Yup.string().required(`${Reference.requiredErrorMsg}`)
      .max(50, 'Reference is too large'),
  }),
});

export default validationSchema;
