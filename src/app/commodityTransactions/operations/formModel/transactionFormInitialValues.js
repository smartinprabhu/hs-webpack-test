import checkoutFormModel from './transactionCheckoutFormModel';

const {
  formField: {
    tankerId,
    blockId,
    name,
    commodityId,
    vendorId,
    capacityValue,
    uomId,
    deliveryChallan,
    initialReading,
    inData,
    outData,
    remark,
    amountVal,
    amountEnable,
  },
} = checkoutFormModel;

export default {
  [tankerId.name]: '',
  [blockId.name]: '',
  [name.name]: '',
  [commodityId.name]: '',
  [vendorId.name]: '',
  [capacityValue.name]: '0.00',
  [uomId.name]: '',
  [deliveryChallan.name]: '',
  [initialReading.name]: '0.00',
  [amountVal.name]: '0.00',
  [inData.name]: '',
  [outData.name]: false,
  [remark.name]: '',
  [amountEnable.name]: false,
};
