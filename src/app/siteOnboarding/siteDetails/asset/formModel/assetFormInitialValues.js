import checkoutFormModel from './assetCheckoutFormModel';

const {
  formField: {
    name,
    categNo,
    parentId,
    aliasNameCateg,
    commodityId,
    typeValue,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [categNo.name]: '',
  [parentId.name]: '',
  [aliasNameCateg.name]: '',
  [commodityId.name]: '',
  [typeValue.name]: '',
};
