import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    purchaseRepresentative,
    agreementType,
    vendor,
    agreementDeadline,
    orderingDate,
    scheduledDate,
    sourceDocument,
    companyId,

  },
} = checkoutFormModel;

export default {
  [purchaseRepresentative.name]: '',
  [agreementType.name]: '',
  [vendor.name]: '',
  [agreementDeadline.name]: '',
  [orderingDate.name]: '',
  [scheduledDate.name]: '',
  [sourceDocument.name]: '',
  [companyId.name]: '',
};
