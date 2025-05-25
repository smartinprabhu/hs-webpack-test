export default {
  formId: 'checkoutexpensesForm',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
    },
    typeId: {
      name: 'type_id',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    equipmentId: {
      name: 'equipment_id',
      label: 'Equipment',
    },
    consumptionCost: {
      name: 'consumption',
      label: 'Consumption',
    },
    unitCost: {
      name: 'unit_cost',
      label: 'Unit Cost',
    },
    totalCost: {
      name: 'total_cost',
      label: 'Total Cost',
    },
    subType: {
      name: 'item_id',
      label: 'Sub Type',
    },
    fromDate: {
      name: 'from_date',
      label: 'From Date',
      requiredErrorMsg: 'From Date is required',
    },
    toDate: {
      name: 'to_date',
      label: 'To Date',
      requiredErrorMsg: 'To Date is required',
    },
    descriptionValue: {
      name: 'description',
      label: 'Description',
    },
  },
};
