import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    Operation,
    Type,
    Weight,
    loggedOn,
    Tenant,
    Vendor,
    carriedBy,
    accompaniedBy,
    securityBy,
  },
} = checkoutFormModel;

export default {
  [Operation.name]: '',
  [Type.name]: '',
  [Weight.name]: '',
  [loggedOn.name]: '',
  [Vendor.name]: '',
  [Tenant.name]: '',
  [carriedBy.name]: '',
  [accompaniedBy.name]: '',
  [securityBy.name]: '',
};
