import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    inboundCollectionPeriod,
    outboundCollectionPeriod,
    inboundRemainder,
    outboundRemainder,
  },
} = checkoutFormModel;

export default {
  [inboundCollectionPeriod.name]: '',
  [outboundCollectionPeriod.name]: '',
  [inboundRemainder.name]: '',
  [outboundRemainder.name]: '',
};
