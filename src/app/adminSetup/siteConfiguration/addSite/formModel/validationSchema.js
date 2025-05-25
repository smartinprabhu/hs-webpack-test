/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import siteFormModel from './siteFormModel';

const {
  formField: {
    nameValue,
    shortCode,
    addressLineOne,
    cityValue,
    countryId,
    stateId,
    latitude,
    longitude,
    timeZone,
  },
} = siteFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [shortCode.name]: Yup.string()
    .required(`${shortCode.requiredErrorMsg}`)
    .max(10, 'Code is too large'),
  [addressLineOne.name]: Yup.string()
    .required(`${addressLineOne.requiredErrorMsg}`)
    .max(50, 'Name is too large'),
  [cityValue.name]: Yup.string()
    .required(`${cityValue.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [countryId.name]: Yup.string()
    .nullable()
    .required(`${countryId.requiredErrorMsg}`),
  [stateId.name]: Yup.string()
    .nullable()
    .required(`${stateId.requiredErrorMsg}`),
  [latitude.name]: Yup.string()
    .required(`${latitude.requiredErrorMsg}`),
  [longitude.name]: Yup.string()
    .required(`${longitude.requiredErrorMsg}`),
  [timeZone.name]: Yup.string()
    .required(`${timeZone.requiredErrorMsg}`),  
});

export default validationSchema;
