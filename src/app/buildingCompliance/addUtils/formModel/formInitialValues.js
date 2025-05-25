import tenantFormModel from './tenantFormModel';

const {
  formField: {
    nameValue,
  },
} = tenantFormModel;

export default {
  [nameValue.name]: '',
};
