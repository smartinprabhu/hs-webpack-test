/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import siteFormModel from './checkoutFormModel';

const {
  formField: {
    nameValue,
    parentSite,
    siteCategory,
    countryId,
    stateId,
    timeZone,
    currency,
    allowedModule,
  },
} = siteFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(40, 'Name is too large'),
  [parentSite.name]: Yup.string()
    .nullable()
    .required(`${parentSite.requiredErrorMsg}`),
  [siteCategory.name]: Yup.string()
    .nullable()
    .required(`${siteCategory.requiredErrorMsg}`),
  [countryId.name]: Yup.string()
    .nullable()
    .required(`${countryId.requiredErrorMsg}`),
  [stateId.name]: Yup.string()
    .nullable()
    .required(`${stateId.requiredErrorMsg}`),
  [timeZone.name]: Yup.string()
    .required(`${timeZone.requiredErrorMsg}`),
  [currency.name]: Yup.string()
    .required(`${currency.requiredErrorMsg}`),
  [allowedModule.name]: Yup.string()
    .required(`${allowedModule.requiredErrorMsg}`),
});

export default validationSchema;
