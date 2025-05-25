import checkoutFormModel from './checkoutFormModelInbound';

const {
  formField: {
    recipientValue,
    employeeIds,
    departmentId,
    collectedOn,
    collectedBy,
    notesValue,
    courierId,
    trackingNo,
    parcelDimensions,
    senderValue,
    shelfValue,
    receivedOn,
    receivedBy,
    employeeIdSequence,
    employeeWorkEmail,
  },
} = checkoutFormModel;

export default {
  [recipientValue.name]: { value: 'Employee', label: 'Employee' },
  [employeeIds.name]: '',
  [departmentId.name]: '',
  [collectedOn.name]: '',
  [collectedBy.name]: '',
  [notesValue.name]: '',
  [courierId.name]: '',
  [trackingNo.name]: '',
  [parcelDimensions.name]: { value: 'Letter', label: 'Letter' },
  [senderValue.name]: '',
  [shelfValue.name]: '',
  [receivedOn.name]: '',
  [receivedBy.name]: '',
  [employeeIdSequence.name]: '',
  [employeeWorkEmail.name]: '',
};
