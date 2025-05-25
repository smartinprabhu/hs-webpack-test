/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';

import formModel from './formModel';
import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    otp,
    companyName,
    Company,
    contactPerson,
    isOTPVerified,
    idProof,
    documentProof,
    hostCompany,
    plannedIn,
    imageMedium,
    Purpose,
    Disclaimer,
    idDetails,
  },
} = formModel;

const mailRegEx = getGlobalEmailRegex();

const validationSchema = Yup.object().shape({
  [otp.name]: Yup.string().when('has_otp_verification', {
    is: 'Required',
    then: Yup.string().required(`${otp.requiredErrorMsg}`)
      .max(10, 'OTP is too large'),
  }),
  [plannedIn.name]: Yup.string()
    .required(`${plannedIn.requiredErrorMsg}`),
  [companyName.name]: Yup.string().when('has_visitor_company', {
    is: 'Required',
    then: Yup.string().required(`${companyName.requiredErrorMsg}`)
      .max(100, 'Organization name is too large'),
  }),
  [Company.name]: Yup.string().when('has_host_name', {
    is: 'Required',
    then: Yup.string().required(`${Company.requiredErrorMsg}`)
      .max(100, 'Host name is too large'),
  }),
  [contactPerson.name]: Yup.string().when('has_host_email', {
    is: 'Required',
    then: Yup.string().required(`${contactPerson.requiredErrorMsg}`)
      .matches(mailRegEx, 'Invalid email ID')
      .max(50, 'Email is too large'),
  }),
  [Purpose.name]: Yup.string().when('has_purpose', {
    is: 'Required',
    then: Yup.string().required(`${Purpose.requiredErrorMsg}`),
  }),
  [hostCompany.name]: Yup.string().when('has_host_company', {
    is: 'Required',
    then: Yup.string().nullable().required(`${hostCompany.requiredErrorMsg}`),
  }),
  [isOTPVerified.name]: Yup.string().when('has_otp_verification', {
    is: 'Required',
    then: Yup.string().required(`${isOTPVerified.requiredErrorMsg}`),
  }),
  [documentProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().required(`${documentProof.requiredErrorMsg}`),
  }),
  [idProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().nullable().required(`${idProof.requiredErrorMsg}`),
  }),
  [idDetails.name]: Yup.string().when('has_visitor_id_details', {
    is: 'Required',
    then: Yup.string().nullable().required(`${idDetails.requiredErrorMsg}`),
  }),
  [imageMedium.name]: Yup.string().when('has_photo', {
    is: 'Required',
    then: Yup.string().nullable().required(`${imageMedium.requiredErrorMsg}`),
  }),
  [Disclaimer.name]: Yup.string().when('is_enable_conditions', {
    is: 'Required',
    then: Yup.string().required(`${Disclaimer.requiredErrorMsg}`),
  }),
});

export default validationSchema;
