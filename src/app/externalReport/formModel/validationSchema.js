import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

import { getGlobalEmailRegex } from '../../util/appUtils';

const {
  formField: {
    personName,
    mobileValue,
    emailValue,
    space,
    subject,
    categoryId,
    subCategorId,
    descriptionValue,
    isOTPVerified,
    otp,
    attachmentValue,
    workLocation,
  },
} = checkoutFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;
const lettersRegEx = /^[a-zA-Z\s]*$/;

export default [
  Yup.object().shape({
    [personName.name]: Yup.string().when('has_customer_name', {
      is: 'Required',
      then: Yup.string().required(`${personName.requiredErrorMsg}`).matches(lettersRegEx, 'Letters only allowed').max(50, 'Name is too large'),
      otherwise: Yup.string().matches(lettersRegEx, 'Letters only allowed').max(50, 'Name is too large'),
    }),
    [mobileValue.name]: Yup.string().when('has_customer_mobile', {
      is: 'Required',
      then: Yup.string()
        .required(`${mobileValue.requiredErrorMsg}`)
        .matches(mobileRegEx, 'Invalid mobile')
        .min(10, 'Mobile number should not be less than 10 digits')
        .max(13, 'Mobile number should not be more than 13 digits'),
      otherwise: Yup.string()
        .matches(mobileRegEx, 'Invalid mobile')
        .min(10, 'Mobile number should not be less than 10 digits')
        .max(13, 'Mobile number should not be more than 13 digits'),
    }),
    [emailValue.name]: Yup.string().when('has_customer_email', {
      is: 'Required',
      then: Yup.string().required(`${emailValue.requiredErrorMsg}`).matches(mailRegEx, 'Invalid email ID').max(50, 'Email is too large'),
      otherwise: Yup.string().matches(mailRegEx, 'Invalid email ID').max(50, 'Email is too large'),
    }),
    has_email_validation: Yup.string()
      .required(`${emailValue.requiredErrorMsg}`),
    [otp.name]: Yup.string().when('requires_verification_by_otp', {
      is: true,
      then: Yup.string().required(`${otp.requiredErrorMsg}`).max(10, 'OTP is too large'),
    }),
    [isOTPVerified.name]: Yup.string().when('requires_verification_by_otp', {
      is: true,
      then: Yup.string().required(`${isOTPVerified.requiredErrorMsg}`),
    }),
    [attachmentValue.name]: Yup.string().when('requires_attachment', {
      is: 'Required',
      then: Yup.string().nullable().required(`${attachmentValue.requiredErrorMsg}`),
    }),
    [workLocation.name]: Yup.string().when('has_work_location', {
      is: 'Required',
      then: Yup.string().required(`${workLocation.requiredErrorMsg}`)
        .max(150, 'Work location name is too large'),
    }),
    [space.name]: Yup.string()
      .nullable()
      .required(`${space.requiredErrorMsg}`),
    [subject.name]: Yup.string()
      .required(`${subject.requiredErrorMsg}`),
    [categoryId.name]: Yup.string()
      .nullable()
      .required(`${categoryId.requiredErrorMsg}`),
    [subCategorId.name]: Yup.string()
      .nullable()
      .required(`${subCategorId.requiredErrorMsg}`),
    [descriptionValue.name]: Yup.string()
      .nullable()
      .required(`${descriptionValue.requiredErrorMsg}`),
  }),
];
