import formModel from './formModel';

const {
  formField: {
    nameValue,
    mobileValue,
    diclaimerValue,
    diclaimer,
    otp,
    employeeCode,
    emailValue,
    isOTPVerified,
    locationId,
    partnerId,
  },
} = formModel;

export default {
  [nameValue.name]: '',
  [mobileValue.name]: '',
  [diclaimerValue.name]: '',
  [diclaimer.name]: '',
  [otp.name]: '',
  [emailValue.name]: '',
  [employeeCode.name]: '',
  [isOTPVerified.name]: '',
  [locationId.name]: '',
  [partnerId.name]: '',
  has_email_validation: 'no',
};
