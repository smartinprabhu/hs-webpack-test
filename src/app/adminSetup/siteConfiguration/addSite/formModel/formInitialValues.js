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

export default {
  [nameValue.name]: '',
  [shortCode.name]: '',
  [addressLineOne.name]: '',
  [cityValue.name]: '',
  [countryId.name]: '',
  [stateId.name]: '',
  [latitude.name]: '',
  [longitude.name]: '',
  [timeZone.name]: '',
};
