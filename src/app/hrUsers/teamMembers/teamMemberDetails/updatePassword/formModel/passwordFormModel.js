export default {
  formId: 'updatePasswordForm',
  formField: {
    newPassword: {
      name: 'new_password',
      label: 'New Password',
      required: false,
      requiredErrorMsg: 'New Password is required',
    },
    password: {
      name: 'password',
      label: 'Password',
      required: false,
      requiredErrorMsg: 'Confirm Password',
    },
  },
};
