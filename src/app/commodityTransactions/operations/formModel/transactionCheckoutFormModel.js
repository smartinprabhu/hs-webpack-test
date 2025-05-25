export default {
  formId: 'configTransactionForm',
  formField: {
    tankerId: {
      name: 'tanker_id',
      label: 'Select Tanker',
      requiredErrorMsg: 'Tanker is required',
    },
    name: {
      name: 'name',
      label: 'Registration No',
    },
    commodityId: {
      name: 'commodity',
      label: 'Commodity',
    },
    vendorId: {
      name: 'vendor_id',
      label: 'Vendor',
    },
    capacityValue: {
      name: 'capacity',
      label: 'Capacity',
    },
    uomId: {
      name: 'uom_id',
      label: 'Unit of Measure',
    },
    blockId: {
      name: 'location_id',
      label: 'Block',
      requiredErrorMsg: 'Block is required',
    },
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
    inData: {
      name: 'in_datetime',
      label: 'In Date',
      requiredErrorMsg: 'In Date is required',
    },
    outData: {
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
      requiredErrorMsg: 'Amount is required',
    },
    amountEnable: {
      name: 'is_enable_amount',
      label: 'Enable Amount',
    },
  },
};
