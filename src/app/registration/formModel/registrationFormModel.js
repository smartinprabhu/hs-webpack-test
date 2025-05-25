export default {
  formId: 'registrationForm',
  formField: {
    firstName: {
      name: 'firstName',
      label: 'First Name*',
      requiredErrorMsg: 'First Name is required',
    },
    lastName: {
      name: 'lastName',
      label: 'Last Name*',
      requiredErrorMsg: 'Last Name is required',
    },
    workNumber: {
      name: 'workNumber',
      label: 'Work Number*',
      requiredErrorMsg: 'Work Number is required',
      invalidErrorMsg: 'Invalid Mobile Number ',
      regEx: /^\d+$/,
    },
    password: {
      name: 'password',
      label: 'Password*',
      requiredErrorMsg: 'Password is required',
      minLengthError: 'Password is too short - should be 8 chars minimum.',
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
