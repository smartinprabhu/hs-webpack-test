export default {
  formId: 'productForm',
  formField: {
    productName: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    categoryId: {
      name: 'categ_id',
      label: 'Category',
      requiredErrorMsg: 'Category is required',
      isRequired: true,
    },
    productType: {
      name: 'type',
      label: 'Type',
      requiredErrorMsg: 'Type is required',
      isRequired: true,
    },
    cost: {
      name: 'standard_price',
      label: 'Cost',
    },
    salesprice: {
      name: 'list_price',
      label: 'Sales Price',
    },
    descriptionId: {
      name: 'description',
      label: 'Description',
    },
    weightId: {
      name: 'weight',
      label: 'Weight',
    },
    volumeId: {
      name: 'volume',
      label: 'Volume',
    },
    unitOfMeasure: {
      name: 'uom_id',
      label: 'Unit of Measure',
      requiredErrorMsg: 'Unit of Measure is required',
      isRequired: true,
    },
    purchaseUnitOfMeasure: {
      name: 'uom_po_id',
      label: 'Purchase Unit of Measure',
      requiredErrorMsg: 'Purchase Unit of Measure is required',
      isRequired: true,
    },
  },
};
