import formModel from './formModel';

const {
  formField: {
    otp,
    companyName,
    Company,
    contactPerson,
    Purpose,
    hostCompany,
    isOTPVerified,
    idProof,
    documentProof,
    plannedIn,
    imageMedium,
  },
} = formModel;

export default {
  [otp.name]: '',
  [companyName.name]: '',
  [Company.name]: '',
  [contactPerson.name]: '',
  [Purpose.name]: '',
  [hostCompany.name]: '',
  [isOTPVerified.name]: '',
  [idProof.name]: '',
  [documentProof.name]: '',
  [plannedIn.name]: '',
  [imageMedium.name]: '',
};
