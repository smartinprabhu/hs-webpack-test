export default {
  formId: 'reorderForm',
  formField: {
    name: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
      isRequired: true,
    },
    productId: {
      name: 'product_id',
      label: 'Product',
      requiredErrorMsg: 'Product is required',
      isRequired: true,
    },
    warehouse: {
      name: 'warehouse_id',
      label: 'Warehouse',
      requiredErrorMsg: 'Warehouse is required',
      isRequired: true,
    },
    location: {
      name: 'location_id',
      label: 'Location',
      requiredErrorMsg: 'Location is required',
      isRequired: true,
    },
    leadType: {
      name: 'lead_type',
      label: '',
      isRequired: true,
      requiredErrorMsg: 'Required',
    },
    leadDays: {
      name: 'lead_days',
      label: 'Lead Time',
    },
    company: {
      name: 'company_id',
      label: 'Company',
      isRequired: true,
    },
    multiQuantity: {
      name: 'qty_multiple',
      label: 'Quantity Multiple',
    },
    minQuantity: {
      name: 'product_min_qty',
      label: 'Reorder Level',
      requiredErrorMsg: 'Reorder Level is required',
      isRequired: true,
    },
    maxQuantity: {
      name: 'product_max_qty',
      label: 'Reorder Quantity',
    },
    alertQuantity: {
      name: 'product_alert_level_qty',
      label: 'Alert Level',
      requiredErrorMsg: 'Alert Level is required',
      isRequired: true,
    },
    productUnitOfMeasure: {
      name: 'product_uom',
      label: 'Product Unit of Measure',
      requiredErrorMsg: 'Product Unit of Measure is required',
      isRequired: true,
    },
  },
};
