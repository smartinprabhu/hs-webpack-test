export default {
  formId: 'productFormPantry',
  formField: {
    productName: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    categoryId: {
      name: 'categ_id',
      label: 'Product Category',
      requiredErrorMsg: 'Product Category is required',
      isRequired: true,
    },
    minimumOrderQty: {
      name: 'minimum_order_qty',
      label: 'Minimum Order Qty',
    },
    maximumOrderQty: {
      name: 'maximum_order_qty',
      label: 'Maximum Order Qty',
    },
    newUntil: {
      name: 'new_until',
      label: 'New Until',
    },
    pantryId: {
      name: 'pantry_ids',
      label: 'Pantry',
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
    pantryname: {
      name: 'pantry_ids',
      label: 'Pantry',
    },
    imageMedium: {
      name: 'image_medium',
      label: 'Product Image',
    },
    status: {
      name: 'active',
      label: 'Status',
    },
  },
};
