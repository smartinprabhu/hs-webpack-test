import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    personName,
    mobileValue,
    emailValue,
    space,
    subject,
    categoryId,
    subCategorId,
    descriptionValue,
    otp,
    isOTPVerified,
    attachmentValue,
    attachmentType,
    workLocation
  },
} = checkoutFormModel;

export default {
  [personName.name]: '',
  [mobileValue.name]: '',
  [emailValue.name]: '',
  [space.name]: '',
  [subject.name]: '',
  [categoryId.name]: '',
  [subCategorId.name]: '',
  [descriptionValue.name]: '',
  [otp.name]: '',
  [isOTPVerified.name]: '',
  [attachmentValue.name]: '',
  [attachmentType.name]: '',
  [workLocation.name]: '',
  has_email_validation: 'no',
};
