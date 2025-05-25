import registartionModel from './registrationFormModel';

const {
  formField: {
    firstName,
    lastName,
    workNumber,
    password,
    repeatPassword,
  },
} = registartionModel;

export default {
  [firstName.name]: '',
  [lastName.name]: '',
  [workNumber.name]: '',
  [password.name]: '',
  [repeatPassword.name]: '',
};
