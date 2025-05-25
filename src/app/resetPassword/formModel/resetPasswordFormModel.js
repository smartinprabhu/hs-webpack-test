export default {
  formId: 'resetPasswordForm',
  formField: {
    email: {
      name: 'email',
      label: 'Please enter your registered email to reset the password',
      placeholder: 'abc@example.com',
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Invalid email (e.g. abc@example.com)',
      maxLengthError: 'Email is too long - should be atmost 50 characters.',
      regEx: /^[^\s@]+@[^\s@]+\.[^\s@]{2,50}$/,
    },
  },
};
