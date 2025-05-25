import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    partnerId,
    partnerRef,
    dateOrder,
    companyId,
    datePlanned,
    incotermId,
    pickingTypeId,
    userId,
    invoiceStatus,
    paymentTermId,
    fiscalPositionId,
    requisitionId,
    requestId,
  },
} = checkoutFormModel;

export default {
  [partnerId.name]: '',
  [partnerRef.name]: '',
  [dateOrder.name]: '',
  [companyId.name]: '',
  [pickingTypeId.name]: '',
  [datePlanned.name]: false,
  [incotermId.name]: '',
  [userId.name]: '',
  [requisitionId.name]: '',
  [requestId.name]: '',
  [invoiceStatus.name]: {
    value: 'no',
    label: 'Nothing to Bill',
  },
  [paymentTermId.name]: '',
  [fiscalPositionId.name]: '',
};
