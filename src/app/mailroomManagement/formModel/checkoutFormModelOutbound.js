export default {
  formId: 'OutboundForm',
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
    sentOn: {
      name: 'sent_on',
      label: 'Registered On',
    },
    sentBy: {
      name: 'sent_by',
      label: 'Registered By',
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
    sentTo: {
      name: 'sent_to',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    addressValue: {
      name: 'address',
      label: 'Address',
    },
    shelfValue: {
      name: 'shelf',
      label: 'Shelf',
    },
    deliveredOn: {
      name: 'delivered_on',
      label: 'Delivered On',
    },
    deliveredBy: {
      name: 'delivered_by',
      label: 'Delivered By',
    },
    agentName: {
      name: 'agent_name',
      label: 'Agent Name',
    },
  },
};
