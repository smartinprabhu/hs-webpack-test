import tenantFormModel from './tenantFormModel';

const {
  formField: {
    nameValue,
    mobile,
    email,
  },
} = tenantFormModel;

export default {
  [nameValue.name]: '',
  [mobile.name]: '',
  [email.name]: '',
};
