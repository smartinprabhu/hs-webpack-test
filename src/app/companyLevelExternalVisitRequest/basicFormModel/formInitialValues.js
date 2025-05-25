import formModel from './formModel';

const {
  formField: {
    Company,
    contactPerson,
    isOTPVerified,
    otp,
    disclaimer,
  },
} = formModel;

export default {
  [Company.name]: '',
  [contactPerson.name]: '',
  [isOTPVerified.name]: '',
  [otp.name]: '',
  [disclaimer.name]: '',
};
