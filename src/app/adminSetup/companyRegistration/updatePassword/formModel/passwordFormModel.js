export default {
  formId: 'updatePasswordForm',
  formField: {
    newPassword: {
      name: 'new_password',
      label: 'Old Password',
      required: true,
      requiredErrorMsg: 'Old Password is required',
    },
    currentPassword: {
      name: 'current_password',
      label: 'Current Password',
      required: true,
      requiredErrorMsg: 'Current Password is required',
    },
    password: {
      name: 'password',
      label: 'Password',
      required: true,
      requiredErrorMsg: 'Confirm Password',
    },
  },
};
