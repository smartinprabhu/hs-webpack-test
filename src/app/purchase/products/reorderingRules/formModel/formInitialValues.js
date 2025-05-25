import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    productId,
    warehouse,
    location,
    leadDays,
    leadType,
    multiQuantity,
    minQuantity,
    maxQuantity,
    alertQuantity
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [productId.name]: '',
  [warehouse.name]: '',
  [location.name]: '',
  [leadDays.name]: '1',
  [multiQuantity.name]: '0',
  [minQuantity.name]: '',
  [maxQuantity.name]: '',
  [leadType.name]: '',
  [alertQuantity.name]:''
};
