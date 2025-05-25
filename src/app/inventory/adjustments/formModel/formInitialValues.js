import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    locationId,
    inventoryOf,
    inventoryDate,
    companyId,
    Exhausted,
    categoryId,
    productId,
    lineIds,
    Comments,
    reasonId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [locationId.name]: '',
  [inventoryOf.name]: 'none',
  [inventoryDate.name]: '',
  [companyId.name]: '',
  [Exhausted.name]: true,
  [categoryId.name]: '',
  [productId.name]: '',
  [Comments.name]: '',
  [reasonId.name]: '',
  [lineIds.name]: [],
};
