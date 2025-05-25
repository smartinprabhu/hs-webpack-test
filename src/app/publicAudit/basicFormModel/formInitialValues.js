import formModel from './formModel';

const {
  formField: {
    nameValue,
    mobileValue,
    otp,
    emailValue,
    isOTPVerified,
  },
} = formModel;

export default {
  [nameValue.name]: '',
  [mobileValue.name]: '',
  [otp.name]: '',
  [emailValue.name]: '',
  [isOTPVerified.name]: '',
};
