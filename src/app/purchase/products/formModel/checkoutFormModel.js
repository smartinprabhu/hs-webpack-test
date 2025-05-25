export default {
  formId: 'productForm',
  formField: {
    productName: {
      name: 'name',
      label: 'Product Name',
      requiredErrorMsg: 'Product Name is required',
    },
    categoryId: {
      name: 'categ_id',
      label: 'Product Category',
      requiredErrorMsg: 'Product Category is required',
      isRequired: true,
    },
    productType: {
      name: 'type',
      label: 'Product Type',
      requiredErrorMsg: 'Product Type is required',
      isRequired: true,
    },
    sales: {
      name: 'sale_ok',
      label: 'Can be Sold',
      requiredErrorMsg: 'Can be Sold is required',
    },
    purchase: {
      name: 'purchase_ok',
      label: 'Can be Purchased',
      requiredErrorMsg: 'Can be Purchased is required',
    },
    maintenance: {
      name: 'maintenance_ok',
      label: 'Can be used in Maintenance',
      requiredErrorMsg: 'Can be used in Maintenance is required',
    },
    interanalReference: {
      name: 'default_code',
      label: 'Internal Reference',
    },
    barcodeId: {
      name: 'barcode',
      label: 'Barcode',
    },
    cost: {
      name: 'standard_price',
      label: 'Cost',
    },
    company: {
      name: 'company_id',
      label: 'Company',
    },
    salesprice: {
      name: 'list_price',
      label: 'Sales Price',
    },
    hscode: {
      name: 'hs_code_id',
      label: 'H.S. Code',
    },
    specificationValue: {
      name: 'specification',
      label: 'Specification',
    },
    brandValue: {
      name: 'brand',
      label: 'Brand',
    },
    department: {
      name: 'department_id',
      label: 'Department',
    },
    reorderLevel: {
      name: 'reordering_min_qty',
      label: 'Reorder Level',
    },
    alertLevel: {
      name: 'alert_level_qty',
      label: 'Alert Level',
    },
    reorderQuantity: {
      name: 'reordering_max_qty',
      label: 'Reorder Quantity',
    },
    perferredValue: {
      name: 'preferred_vendor',
      label: 'Preferred Vendor',
    },
    countryOfOrigin: {
      name: 'origin_country_id',
      label: 'Country of Origin',
    },
    customerTaxes: {
      name: 'taxes_id',
      label: 'Customer Taxes',
    },
    descriptionId: {
      name: 'description',
      label: '',
    },
    routes: {
      name: 'route_ids',
      label: 'Routes',
    },
    days: {
      name: 'sale_delay',
      label: 'Days',
    },
    weightId: {
      name: 'weight',
      label: 'Weight',
    },
    volumeId: {
      name: 'volume',
      label: 'Volume',
    },
    responsible: {
      name: 'responsible_id',
      label: 'Responsible User (Logistic Operations for this Product)',
      requiredErrorMsg: 'Responsible is Required',
      isRequired: true,
    },
    image: {
      name: 'image_medium',
      label: 'Product Image',
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
    uniqueCode: {
      name: 'unique_code',
      label: 'Product Code',
      requiredErrorMsg: 'Product Code is required',
      isRequired: false,
    },
  },
};
