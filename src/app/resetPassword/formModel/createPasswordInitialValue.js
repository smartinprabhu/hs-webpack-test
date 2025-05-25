import createPasswordModel from './createPasswordFormModel';

const {
  formField: {
    password,
    repeatPassword,
  },
} = createPasswordModel;

export default {
  [password.name]: '',
  [repeatPassword.name]: '',
};
