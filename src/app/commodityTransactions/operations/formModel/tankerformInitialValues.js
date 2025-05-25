import checkoutFormModel from './tankercheckoutFormModel';

const {
  formField: {
    name,
    commodityId,
    vendorId,
    capacityValue,
    uomId,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [commodityId.name]: '',
  [vendorId.name]: '',
  [capacityValue.name]: '0.00',
  [uomId.name]: '',
};
