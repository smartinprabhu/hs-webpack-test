import contactFormModel from './contactFormModel';

const {
  formField: {
    nameValue,
    type,
    visitorType,
    gender,
    phone,
    email,
    userId,
    addressLineOne,
    addressLineTwo,
    cityValue,
    countryId,
    stateId,
    zip,
  },
} = contactFormModel;

export default {
  [nameValue.name]: '',
  [type.name]: 'contact',
  [visitorType.name]: '',
  [gender.name]: '',
  [phone.name]: '',
  [email.name]: '',
  [userId.name]: '',
  [addressLineOne.name]: '',
  [addressLineTwo.name]: '',
  [cityValue.name]: '',
  [countryId.name]: '',
  [stateId.name]: '',
  [zip.name]: '',
};
