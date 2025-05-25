import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    categoryId,
    subCategorId,
    assetId,
    typeCategory,
    equipmentId,
  },
} = checkoutFormModel;

export default {
  [categoryId.name]: '',
  [subCategorId.name]: '',
  [assetId.name]: '',
  [equipmentId.name]: '',
  [typeCategory.name]: 'equipment',
};
