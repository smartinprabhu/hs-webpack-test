export default {
  formId: 'mailRegistrationForm',
  formField: {
    email: {
      name: 'email',
      label: 'Email*',
      placeholder: 'abc@example.com',
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Invalid email',
      regEx: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    },
    otp: {
      name: 'otp',
      label: 'OTP*',
      requiredErrorMsg: 'OTP is required',
    },
  },
};
