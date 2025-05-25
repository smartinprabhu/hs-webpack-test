import formModel from './formModel';

const {
  formField: {
    nameValue,
    mobile,
    email,
    plannedIn,
  },
} = formModel;

export default {
  [nameValue.name]: '',
  [mobile.name]: '',
  [email.name]: '',
  [plannedIn.name]: '',
};
