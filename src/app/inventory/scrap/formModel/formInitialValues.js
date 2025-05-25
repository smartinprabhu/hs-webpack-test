import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    locationId,
    productUomId,
    dateExpected,
    scrapLocationId,
    scrapQty,
    origin,
    productId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [locationId.name]: '',
  [productUomId.name]: '',
  [dateExpected.name]: false,
  [scrapLocationId.name]: '',
  [scrapQty.name]: 1,
  [origin.name]: '',
  [productId.name]: '',
};
