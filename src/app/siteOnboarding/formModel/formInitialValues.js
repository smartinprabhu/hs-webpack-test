import siteFormModel from './checkoutFormModel';

const {
  formField: {
    nameValue,
    shortCode,
    parentSite,
    siteCategory,
    subCategory,
    area,
    addressLineOne,
    regionId,
    cityValue,
    countryId,
    stateId,
    pincode,
    currency,
    timeZone,
    copyConfiguration,
    allowedModule,
  },
} = siteFormModel;

export default {
  [nameValue.name]: '',
  [shortCode.name]: '',
  [parentSite.name]: '',
  [siteCategory.name]: '',
  [subCategory.name]: '',
  [area.name]: '',
  [addressLineOne.name]: '',
  [cityValue.name]: '',
  [countryId.name]: '',
  [stateId.name]: '',
  [pincode.name]: '',
  [currency.name]: '',
  [timeZone.name]: '',
  [copyConfiguration.name]: '',
  [allowedModule.name]: '',
  [regionId.name]: '',
};
