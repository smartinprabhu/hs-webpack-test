import tenantFormModel from './tenantFormModel';

const {
  formField: {
    nameValue,
    bankCode,
    address,
    city,
    stateId,
    countryId,
    zip,
    phone,
    email,
  },
} = tenantFormModel;

export default {
  [nameValue.name]: '',
  [bankCode.name]: '',
  [address.name]: '',
  [city.name]: '',
  [stateId.name]: '',
  [countryId.name]: '',
  [zip.name]: '',
  [phone.name]: '',
  [email.name]: '',
};
