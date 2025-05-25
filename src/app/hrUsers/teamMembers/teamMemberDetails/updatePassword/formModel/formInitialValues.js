import passwordFormModel from './passwordFormModel';

const {
  formField: {
    newPassword,
    password,
  },
} = passwordFormModel;

export default {
  [newPassword.name]: '',
  [password.name]: '',
};
