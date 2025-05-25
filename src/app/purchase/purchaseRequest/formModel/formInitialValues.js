import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    requisitionName,
    projects,
    accounts,
    location,
    budget,
    subCategory,
    vendor,
    requestorName,
    email,
    siteSpoc,
    siteContactDetails,
    billingAddress,
    shippingAddress,
    comments,
    requisationCode,
    description,
  },
} = checkoutFormModel;

export default {
  [requisitionName.name]: '',
  [projects.name]: '',
  [accounts.name]: '',
  [location.name]: '',
  [budget.name]: '',
  [subCategory.name]: '',
  [vendor.name]: '',
  [requestorName.name]: '',
  [email.name]: '',
  [siteSpoc.name]: '',
  [siteContactDetails.name]: '',
  [billingAddress.name]: '',
  [shippingAddress.name]: '',
  [comments.name]: '',
  [requisationCode.name]: '',
  [description.name]: '',
};
