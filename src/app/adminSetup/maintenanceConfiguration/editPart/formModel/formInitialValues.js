import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    productName,
    categoryId,
    productType,
    salesprice,
    cost,
    volumeId,
    weightId,
    unitOfMeasure,
    purchaseUnitOfMeasure,
  },
} = checkoutFormModel;

export default {
  [productName.name]: '',
  [categoryId.name]: '',
  [productType.name]: '',
  [salesprice.name]: '1.00',
  [cost.name]: '0.00',
  [weightId.name]: '0.00',
  [volumeId.name]: '0.00',
  [unitOfMeasure.name]: '',
  [purchaseUnitOfMeasure.name]: '',
};
