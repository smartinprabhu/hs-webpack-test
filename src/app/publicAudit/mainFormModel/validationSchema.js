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
  },
} = formModel;

const mailRegEx = getGlobalEmailRegex();

const validationSchema = Yup.object().shape({
  [otp.name]: Yup.string()
    .required(`${otp.requiredErrorMsg}`)
    .max(10, 'OTP is too large'),
  [plannedIn.name]: Yup.string()
    .required(`${plannedIn.requiredErrorMsg}`),
  [companyName.name]: Yup.string().when('has_visitor_company', {
    is: 'Required',
    then: Yup.string().required(`${companyName.requiredErrorMsg}`)
      .max(100, 'Organization name is too large'),
  }),
  [Company.name]: Yup.string().when('has_host_company', {
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
  [hostCompany.name]: Yup.string().when('has_host_company', {
    is: 'Required',
    then: Yup.string().nullable().required(`${hostCompany.requiredErrorMsg}`),
  }),
  [isOTPVerified.name]: Yup.string()
    .required(`${isOTPVerified.requiredErrorMsg}`),
  [documentProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().required(`${documentProof.requiredErrorMsg}`),
  }),
  [idProof.name]: Yup.string().when('has_identity_proof', {
    is: 'Required',
    then: Yup.string().nullable().required(`${idProof.requiredErrorMsg}`),
  }),
  [imageMedium.name]: Yup.string().when('has_photo', {
    is: 'Required',
    then: Yup.string().nullable().required(`${imageMedium.requiredErrorMsg}`),
  }),
});

export default validationSchema;
