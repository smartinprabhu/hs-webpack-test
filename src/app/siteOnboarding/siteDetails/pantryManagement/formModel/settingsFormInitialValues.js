import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    sendOrderCreatedNot,
    sendUpdateNot,
    sendConfirmNot,
    sendDeliverNot,
    sendCancelNot,
    enableQrDelivery,
    cleaningThreshold,
    IntegrateInventory,
  },
} = checkoutFormModel;

export default {
  [sendOrderCreatedNot.name]: '',
  [sendUpdateNot.name]: '',
  [sendConfirmNot.name]: '',
  [sendDeliverNot.name]: '',
  [sendCancelNot.name]: '',
  [enableQrDelivery.name]: '',
  [cleaningThreshold.name]: '20.00',
  [IntegrateInventory.name]: '',
};
