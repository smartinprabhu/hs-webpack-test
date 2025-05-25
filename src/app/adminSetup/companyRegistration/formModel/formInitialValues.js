import companyFormModel from './companyFormModel';

const {
  formField: {
    nameValue,
    mobile,
    email,
    jobPosition,
    companyName,
    address,
    countryId,
    website,
  },
} = companyFormModel;

export default {
  [nameValue.name]: '',
  [mobile.name]: '',
  [email.name]: '',
  [jobPosition.name]: '',
  [companyName.name]: '',
  [address.name]: '',
  [countryId.name]: '',
  [website.name]: '',
};
