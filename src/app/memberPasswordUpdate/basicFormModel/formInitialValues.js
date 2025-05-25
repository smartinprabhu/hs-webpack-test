import formModel from './formModel';

const {
  formField: {
    newPassword,
    password,
  },
} = formModel;

export default {
  [newPassword.name]: '',
  [password.name]: '',
};
