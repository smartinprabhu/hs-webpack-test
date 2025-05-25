export default {
  formId: 'adjustmentForm',
  formField: {
    name: {
      name: 'name',
      label: 'Audit Description',
      requiredErrorMsg: 'Audit Description is required',
    },
    locationId: {
      name: 'location_id',
      label: 'Audit Location',
      requiredErrorMsg: 'Audit Location is required',
    },
    inventoryOf: {
      name: 'filter',
      label: 'All Products',
      label1: 'One Product Category',
      label2: 'One Product Only',
      label3: 'Select Products Manually',
      requiredErrorMsg: 'Inventory of is required',
    },
    inventoryDate: {
      name: 'date',
      label: 'Inventory Date',
      requiredErrorMsg: 'Inventory Date is required',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
    },
    Exhausted: {
      name: 'exhausted',
      label: 'Include Exhausted Products',
    },
    categoryId: {
      name: 'category_id',
      label: 'Product Category',
    },
    Comments: {
      name: 'comments',
      label: 'Comments',
    },
    productId: {
      name: 'product_id',
      label: 'Inventoried Product',
    },
    reasonId: {
      name: 'reason_id',
      label: 'Reason',
    },
    lineIds: {
      name: 'line_ids',
      label: 'Inventoried Product',
    },
  },
};
