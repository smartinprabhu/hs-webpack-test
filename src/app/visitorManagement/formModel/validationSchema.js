import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    visitorType,
    nameValue,
    mobile,
    email,
    visitorPhoto,
    employeeMobile,
    hostName,
    hostEmail,
    hostCompany,
    organization,
    idProof,
    idDetails,
    documentProof,
    plannedIn,
    purpose,
    tenantId,
  },
} = checkoutFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

const validationSchema = Yup.object().shape({
  [visitorType.name]: Yup.string().when('has_visitor_type', {
    is: 'Required',
    then: Yup.string().required(`${visitorType.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  [purpose.name]: Yup.string().when('has_purpose', {
    is: 'Required',
    then: Yup.string().required(`${purpose.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(50, 'Name is too large'),
  [mobile.name]: Yup.string().when('has_visitor_mobile', {
    is: 'Required',
    then: Yup.string()
      .required(`${mobile.requiredErrorMsg}`)
      .matches(mobileRegEx, 'Invalid mobile.')
      .min(10, 'Mobile number should not be less than 10 digits.')
      .max(13, 'Mobile number should not be more than 13 digits.'),
    otherwise: Yup.string()
      .matches(mobileRegEx, 'Invalid mobile.')
      .min(10, 'Mobile number should not be less than 10 digits.')
      .max(13, 'Mobile number should not be more than 13 digits.'),
  }),
  [email.name]: Yup.string().when('has_visitor_email', {
    is: 'Required',
    then: Yup.string().required(`${email.requiredErrorMsg}`).matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
    otherwise: Yup.string().matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
  }),
  [employeeMobile.name]: Yup.string()
    .matches(mobileRegEx, 'Invalid mobile')
    .min(10, 'Mobile number should not be less than 10 digits')
    .max(13, 'Mobile number should not be more than 13 digits'),
  [hostName.name]: Yup.string().when('has_host_name', {
    is: 'Required',
    then: Yup.string().required(`${hostName.requiredErrorMsg}`)
      .max(50, 'Host name is too large'),
  }),
  [organization.name]: Yup.string().when('has_visitor_company', {
    is: 'Required',
    then: Yup.string().required(`${organization.requiredErrorMsg}`),
    otherwise: Yup.string().max(70, 'Name is too large'),
  }),
  [hostEmail.name]: Yup.string().when('has_host_email', {
    is: 'Required',
    then: Yup.string().required(`${hostEmail.requiredErrorMsg}`)
      .matches(mailRegEx, 'Invalid email ID')
      .max(50, 'Email is too large'),
  }),
  [tenantId.name]: Yup.string().when('has_host_company', {
    is: 'Required',
    then: Yup.string().required(`${tenantId.requiredErrorMsg}`),
  }),
  [idProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().required(`${idProof.requiredErrorMsg}`),
  }),
  [visitorPhoto.name]: Yup.string().when('has_photo', {
    is: 'Required',
    then: Yup.string().required(`${visitorPhoto.requiredErrorMsg}`),
  }),
  [idDetails.name]: Yup.string().when('has_vistor_id_details', {
    is: 'Required',
    then: Yup.string().nullable().required(`${idDetails.requiredErrorMsg}`),
  }),
  [documentProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().required(`${documentProof.requiredErrorMsg}`),
  }),
  [plannedIn.name]: Yup.string()
    .required(`${plannedIn.requiredErrorMsg}`),
});

export default validationSchema;
