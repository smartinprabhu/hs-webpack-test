export default {
  formId: 'InboundForm',
  formField: {
    recipientValue: {
      name: 'recipient',
      label: 'Recipient',
      requiredErrorMsg: 'Recipient is required',
    },
    employeeIds: {
      name: 'employee_id',
      label: 'Name',
    },
    departmentId: {
      name: 'department_id',
      label: 'Department',
    },
    employeeIdSequence:{
      name:'employee_id_seq',
      label:'Employee ID'
    },
    employeeWorkEmail:{
      name:'employee_work_email',
      label: 'Email Id'
    },
    collectedOn: {
      name: 'collected_on',
      label: 'Delivered On',
    },
    collectedBy: {
      name: 'collected_by',
      label: 'Delivered By',
    },
    notesValue: {
      name: 'notes',
      label: 'Notes',
    },
    courierId: {
      name: 'courier_id',
      label: 'Courier',
    },
    trackingNo: {
      name: 'tracking_no',
      label: 'Tracking Number',
    },
    parcelDimensions: {
      name: 'parcel_dimensions',
      label: 'Parcel Dimensions',
    },
    senderValue: {
      name: 'sender',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    shelfValue: {
      name: 'shelf',
      label: 'Shelf',
    },
    receivedOn: {
      name: 'received_on',
      label: 'Registered On',
    },
    receivedBy: {
      name: 'received_by',
      label: 'Registered By',
    },
  },
};
