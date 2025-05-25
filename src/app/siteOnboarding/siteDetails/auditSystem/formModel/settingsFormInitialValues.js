import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    autoCreateTicket,
    subCategoryId,
    categoryId,
    spaceId,
    companyId,
  },
} = checkoutFormModel;

export default {
  [autoCreateTicket.name]: '',
  [subCategoryId.name]: '',
  [categoryId.name]: '',
  [spaceId.name]: '',
  [companyId.name]: '',
};
