import checkoutFormModel from './productCategorycheckoutFormModel';

const {
  formField: {
    name,
    parentId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [parentId.name]: '',
};
