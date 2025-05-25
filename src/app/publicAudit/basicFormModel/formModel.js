export default {
  formId: 'feedbackForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobileValue: {
      name: 'mobile',
      label: 'Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    emailValue: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
    },
    otp: {
      name: 'otp_code',
      label: 'OTP Code',
      required: true,
      requiredErrorMsg: 'OTP Code is required',
    },
    isOTPVerified: {
      name: 'is_otp_verified',
      label: 'Is OTP Verified',
      required: true,
      requiredErrorMsg: 'OTP not verified',
    },
  },
};
