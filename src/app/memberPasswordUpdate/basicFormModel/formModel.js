export default {
  formId: 'memberPasswordUpdateForm',
  formField: {
    newPassword: {
      name: 'new_password',
      label: 'New Password',
      required: true,
      requiredErrorMsg: 'New Password is required',
    },
    password: {
      name: 'password',
      label: 'Confirm Password',
      required: true,
      requiredErrorMsg: 'Confirm Password',
    },
  },
};
