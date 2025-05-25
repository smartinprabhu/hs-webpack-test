import formModel from './formModel';

const {
  formField: {
    otp,
    companyName,
    Purpose,
    PurposeText,
    isOTPVerified,
    idProof,
    documentProof,
    imageMedium,
    Disclaimer,
  },
} = formModel;

export default {
  [otp.name]: '',
  [companyName.name]: '',
  [Purpose.name]: '',
  [PurposeText.name]: '',
  [isOTPVerified.name]: '',
  [idProof.name]: '',
  [documentProof.name]: '',
  [imageMedium.name]: '',
  [Disclaimer.name]: '',
};
