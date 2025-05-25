import checkoutFormModel from './problemCategoryGroupcheckoutFormModel';

const {
  formField: {
    name,
    typeCategory,
    isAllAssetCategory,
    equipmentCategoryIds,
    spaceCategoryIds,
    isAllCategory,
    problemCategoryIds,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [typeCategory.name]: { value: 'equipment', label: 'Equipment' },
  [isAllAssetCategory.name]: '',
  [equipmentCategoryIds.name]: '',
  [spaceCategoryIds.name]: '',
  [isAllCategory.name]: '',
  [problemCategoryIds.name]: '',
};
