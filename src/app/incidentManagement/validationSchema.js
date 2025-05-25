import * as Yup from 'yup';
import checkoutFormModel from '../helpdesk/formModel/checkoutFormModel';

import { getGlobalEmailRegex } from '../util/appUtils';

const {
  formField: {
    company,
    personName,
    Mobile,
    Email,
    subject,
    categoryId,
    subCategorId,
    assetId,
    equipmentId,
    incidentTypeId,
  },
} = checkoutFormModel;

const mailRegEx = getGlobalEmailRegex();
const mobileRegEx = /^\d+$/;

export default [
  Yup.object().shape({
    [company.name]: Yup.string()
      .nullable()
      .required(`${company.requiredErrorMsg}`),
    [personName.name]: Yup.string()
      .nullable()
      .required(`${personName.requiredErrorMsg}`),
    [Mobile.name]: Yup.string()
      .required(`${Mobile.requiredErrorMsg}`)
      .matches(mobileRegEx, Mobile.invalidErrorMsg)
      .min(10, 'Mobile number should not be less than 10 digits')
      .max(12, 'Mobile number should not be more than 12 digits'),
    [Email.name]: Yup.string()
      .required(`${Email.requiredErrorMsg}`)
      .matches(mailRegEx, Email.invalidErrorMsg)
      .max(50, 'Email is too large'),
    [subject.name]: Yup.string()
      .required(`${subject.requiredErrorMsg}`)
      .max(150, 'Subject is too large'),
    [categoryId.name]: Yup.string()
      .nullable()
      .required(`${categoryId.requiredErrorMsg}`),
    [subCategorId.name]: Yup.string()
      .nullable()
      .required(`${subCategorId.requiredErrorMsg}`),
    [equipmentId.name]: Yup.string().when('type_category', {
      is: 'equipment',
      then: Yup.string().required('Equipment is required'),
    }),
    [assetId.name]: Yup.string().when('type_category', {
      is: 'asset',
      then: Yup.string().required('Space is required'),
    }),
    [incidentTypeId.name]: Yup.string()
      .nullable()
      .required(`${incidentTypeId.requiredErrorMsg}`),
  }),
];
