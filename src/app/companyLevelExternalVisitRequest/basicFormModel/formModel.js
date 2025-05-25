export default {
  formId: 'hostForm',
  formField: {
    Company: {
      name: 'host_name',
      label: 'Host Name',
      required: true,
      requiredErrorMsg: 'Host Name is required',
    },
    contactPerson: {
      name: 'host_email',
      label: 'Host Official Email',
      required: true,
      requiredErrorMsg: 'Host Email is required',
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
    disclaimer: {
      name: 'disclaimer',
      label: 'Disclaimer',
      required: true,
      requiredErrorMsg: 'Disclaimer verified',
    },
  },
};
