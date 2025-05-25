export default {
  formId: 'scrapForm',
  formField: {
    name: {
      name: 'name',
      label: 'Description',
      requiredErrorMsg: 'Description is required',
    },
    locationId: {
      name: 'location_id',
      label: 'From Location',
      requiredErrorMsg: 'From Location is required',
    },
    productId: {
      name: 'product_id',
      label: 'Product',
      requiredErrorMsg: 'Product is required',
    },
    productUomId: {
      name: 'product_uom_id',
      label: 'Product UOM',
      requiredErrorMsg: 'Product UOM is required',
    },
    dateExpected: {
      name: 'date_expected',
      label: 'Expected Date',
    },
    scrapLocationId: {
      name: 'scrap_location_id',
      label: 'Scrap Location',
      requiredErrorMsg: 'Scrap Location is required',
    },
    scrapQty: {
      name: 'scrap_qty',
      label: 'Quantity',
      requiredErrorMsg: 'Quantity is required',
    },
    origin: {
      name: 'origin',
      label: 'Source Document',
    },
  },
};
