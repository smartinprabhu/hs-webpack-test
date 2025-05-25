import passwordFormModel from './passwordFormModel';

const {
  formField: {
    newPassword,
    password,
    currentPassword,
  },
} = passwordFormModel;

export default {
  [newPassword.name]: '',
  [currentPassword.name]: '',
  [password.name]: '',
};
