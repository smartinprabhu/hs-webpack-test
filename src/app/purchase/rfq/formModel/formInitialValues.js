import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    partnerId,
    partnerRef,
    requisitionId,
    dateOrder,
    companyId,
    requestId,
    pickingTypeId,
    datePlanned,
    incotermId,
    userId,
    invoiceStatus,
    paymentTermId,
    fiscalPositionId,
  },
} = checkoutFormModel;

export default {
  [partnerId.name]: '',
  [partnerRef.name]: '',
  [requisitionId.name]: '',
  [dateOrder.name]: '',
  [companyId.name]: '',
  [requestId.name]: '',
  [pickingTypeId.name]: '',
  [datePlanned.name]: false,
  [incotermId.name]: '',
  [userId.name]: '',
  [invoiceStatus.name]: {
    value: 'no',
    label: 'Nothing to Bill',
  },
  [paymentTermId.name]: '',
  [fiscalPositionId.name]: '',
};
