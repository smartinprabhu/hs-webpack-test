import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    productBatch,
    productAccess,
    accessCompany,
    reorderLevel,
    remainderAlert,
    recipients,
  },
} = checkoutFormModel;

export default {
  [productBatch.name]: '30',
  [productAccess.name]: { value: 'Own Site Level', label: 'Own Site Level' },
  [accessCompany.name]: '',
  [reorderLevel.name]: '',
  [remainderAlert.name]: '',
  [recipients.name]: '',
};
