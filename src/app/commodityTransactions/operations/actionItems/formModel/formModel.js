export default {
  formId: 'tankerOutForm',
  formField: {
    deliveryChallan: {
      name: 'delivery_challan',
      label: 'Delivery Challan',
    },
    initialReading: {
      name: 'initial_reading',
      label: 'Initial Reading',
      requiredErrorMsg: 'Initial Reading is required',
    },
    finalReading: {
      name: 'final_reading',
      label: 'Final Reading',
      requiredErrorMsg: 'Final Reading is required',
    },
    inDate: {
      name: 'in_datetime',
      label: 'In Date',
      requiredErrorMsg: 'In Date is required',
    },
    outDate: {
      name: 'out_datetime',
      label: 'Out Date',
      requiredErrorMsg: 'Out Date is required',
    },
    remark: {
      name: 'remark',
      label: 'Remark',
    },
    amountVal: {
      name: 'amount',
      label: 'Amount',
    },
  },
};
