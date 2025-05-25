import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    shortName,
    partnerId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [shortName.name]: '',
  [partnerId.name]: '',
};
