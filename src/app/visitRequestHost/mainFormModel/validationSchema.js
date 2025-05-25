/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

const {
  formField: {
    otp,
    isOTPVerified,
    idProof,
    companyName,
    documentProof,
    imageMedium,
    Purpose,
    PurposeText,
    Disclaimer,
    idDetails,
  },
} = formModel;

const validationSchema = Yup.object().shape({
  [otp.name]: Yup.string().when('has_otp_verification', {
    is: 'Required',
    then: Yup.string().required(`${otp.requiredErrorMsg}`)
      .max(10, 'OTP is too large'),
  }),
  [companyName.name]: Yup.string().when('has_visitor_company', {
    is: 'Required',
    then: Yup.string().required(`${companyName.requiredErrorMsg}`)
      .max(100, 'Organization name is too large'),
  }),
  [Purpose.name]: Yup.string().when('has_purpose', {
    is: 'Required',
    then: Yup.string().nullable().required(`${Purpose.requiredErrorMsg}`),
  }),
  [PurposeText.name]: Yup.string().when('has_purpose_text', {
    is: 'Required',
    then: Yup.string().nullable().required(`${PurposeText.requiredErrorMsg}`),
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
