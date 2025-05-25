import formModel from './formModel';

const {
  formField: {
    nameValue,
    mobile,
    email,
  },
} = formModel;

export default {
  [nameValue.name]: '',
  [mobile.name]: '',
  [email.name]: '',
};
