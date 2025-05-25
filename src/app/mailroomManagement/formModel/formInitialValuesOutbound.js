import checkoutFormModel from './checkoutFormModelOutbound';

const {
  formField: {
    recipientValue,
    employeeIds,
    departmentId,
    sentOn,
    sentBy,
    notesValue,
    courierId,
    trackingNo,
    parcelDimensions,
    sentTo,
    addressValue,
    shelfValue,
    deliveredOn,
    deliveredBy,
    agentName,
    employeeIdSequence,
    employeeWorkEmail,
  },
} = checkoutFormModel;

export default {
  [recipientValue.name]: { value: 'Employee', label: 'Employee' },
  [employeeIds.name]: '',
  [departmentId.name]: '',
  [sentOn.name]: '',
  [sentBy.name]: '',
  [notesValue.name]: '',
  [courierId.name]: '',
  [trackingNo.name]: '',
  [parcelDimensions.name]: { value: 'Letter', label: 'Letter' },
  [sentTo.name]: '',
  [addressValue.name]: '',
  [shelfValue.name]: '',
  [deliveredOn.name]: '',
  [deliveredBy.name]: '',
  [agentName.name]: '',
  [employeeIdSequence.name]: '',
  [employeeWorkEmail.name]: '',
};
