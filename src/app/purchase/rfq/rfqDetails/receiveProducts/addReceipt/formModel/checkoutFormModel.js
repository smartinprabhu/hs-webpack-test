export default {
  formId: 'rfqForm',
  formField: {
    partnerId: {
      name: 'partner_id',
      label: 'Vendor',
      requiredErrorMsg: 'Vendor is required',
    },
    pickingTypeId: {
      name: 'picking_type_id',
      label: 'Operation Type',
      requiredErrorMsg: 'Operation Type is required',
    },
    locationDestId: {
      name: 'location_dest_id',
      label: 'Destination Location',
      requiredErrorMsg: 'Destination Location is required',
    },
    locationId: {
      name: 'location_id',
      label: 'Source Location',
      requiredErrorMsg: 'Source Location is required',
    },
    scheduledDate: {
      name: 'scheduled_date',
      label: 'Scheduled Date',
      requiredErrorMsg: 'Scheduled Date is required',
      required: true,
    },
    origin: {
      name: 'origin',
      label: 'PO/SO No',
      requiredErrorMsg: 'Source Doucument is required',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
    },
    note: {
      name: 'note',
      label: 'Description',
    },
    moveType: {
      name: 'move_type',
      label: 'Shipping Policy',
      requiredErrorMsg: 'Shipping Policy is required',
    },
    Priority: {
      name: 'priority',
      label: 'Priority',
    },
    dcNo: {
      name: 'dc_no',
      label: 'DC#',
      requiredErrorMsg: 'DC# is required',
    },
    poNo: {
      name: 'po_no',
      label: 'PO#',
      requiredErrorMsg: 'PO# is required',
    },
    useIn: {
      name: 'use_in',
      label: 'Use In',
      requiredErrorMsg: 'Use In is required',
    },
    assetId: {
      name: 'asset_id',
      label: 'Equipment',
      requiredErrorMsg: 'Equipment is required',
    },
    spaceId: {
      name: 'space_id',
      label: 'Location',
      requiredErrorMsg: 'Location is required',
    },
    employeeId: {
      name: 'employee_id',
      label: 'Employee',
      requiredErrorMsg: 'Employee is required',
    },
    departmentId: {
      name: 'department_id',
      label: 'Department',
      requiredErrorMsg: 'Department is required',
    },
    categoryId: {
      name: 'product_categ_id',
      label: 'Product Category',
      requiredErrorMsg: 'Product Category is required',
    },
  },
};
