import formModel from './formModel';

const {
  formField: {
    visitorType,
    nameValue,
    mobile,
    email,
  },
} = formModel;

export default {
  [visitorType.name]: '',
  [nameValue.name]: '',
  [mobile.name]: '',
  [email.name]: '',
};
