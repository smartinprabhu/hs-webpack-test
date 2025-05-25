import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    productName,
    categoryId,
    minimumOrderQty,
    maximumOrderQty,
    newUntil,
    pantryId,
    unitOfMeasure,
    imageMedium,
    purchaseUnitOfMeasure,
    status,
  },
} = checkoutFormModel;

export default {
  [productName.name]: '',
  [categoryId.name]: '',
  [minimumOrderQty.name]: '0.00',
  [maximumOrderQty.name]: '0.00',
  [newUntil.name]: '',
  [pantryId.name]: '',
  [unitOfMeasure.name]: '',
  [imageMedium.name]: false,
  [purchaseUnitOfMeasure.name]: '',
  [status.name]: { value: 'Active', label: 'Active' },
};
