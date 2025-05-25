export default {
  formId: 'createPasswordForm',
  formField: {
    password: {
      name: 'password',
      label: 'Password*',
      requiredErrorMsg: 'Password is required',
      minLengthError: 'Password is too short - should be 8 chars minimum.',
      maxLengthError: 'Password is too long - should be 12 chars maximum.',
      invalidErrorMsg: 'Password must contain at least one uppercase letter, one lowercase letter and one number and a special character',
      regEx: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    },
    repeatPassword: {
      name: 'repeatPassword',
      label: 'Re-type Password*',
      requiredErrorMsg: 'Re-type Password is required',
      invalidErrorMsg: 'Should match with Password',
    },
  },
};
