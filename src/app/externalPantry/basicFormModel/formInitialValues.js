import formModel from './formModel';

const {
  formField: {
    nameValue,
    email,
    pantry,
    space,
    isValidproducts,
  },
} = formModel;

export default {
  [nameValue.name]: '',
  [email.name]: '',
  [pantry.name]: '',
  [space.name]: '',
  [isValidproducts.name]: '',
};
