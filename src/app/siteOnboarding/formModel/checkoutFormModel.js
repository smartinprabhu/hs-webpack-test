export default {
  formId: 'siteForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    shortCode: {
      name: 'code',
      label: 'Short Code',
    },
    parentSite: {
      name: 'parent_id',
      label: 'Parent Site',
      required: true,
      requiredErrorMsg: 'Parent Site is required',
    },
    regionId: {
      name: 'region_id',
      label: 'Region',
    },
    siteCategory: {
      name: 'res_company_categ_id',
      label: 'Category',
      required: true,
      requiredErrorMsg: 'Category is required',
    },
    subCategory: {
      name: 'company_subcateg_id',
      label: 'Sub Category',
    },
    area: {
      name: 'area_sqft',
      label: 'Total Area (sqft)',
    },
    addressLineOne: {
      name: 'street',
      label: 'Address',
      required: true,
      requiredErrorMsg: 'Address is required',
    },
    cityValue: {
      name: 'city',
      label: 'City',
      required: true,
      requiredErrorMsg: 'City is required',
    },
    countryId: {
      name: 'country_id',
      label: 'Country',
      required: true,
      requiredErrorMsg: 'Country is required',
    },
    stateId: {
      name: 'state_id',
      label: 'State',
      required: true,
      requiredErrorMsg: 'State is required',
    },
    pincode: {
      name: 'zip',
      label: 'Pincode',
    },
    timeZone: {
      name: 'company_tz',
      label: 'Timezone',
      required: true,
      requiredErrorMsg: 'Timezone is required',
    },
    currency: {
      name: 'currency_id',
      label: 'Currency',
      required: true,
      requiredErrorMsg: 'Currency is required',
    },
    copyConfiguration: {
      name: 'copy_from_company_id',
      label: 'Copy Configuration From',
    },
    allowedModule: {
      name: 'allowed_module_ids',
      label: 'Modules',
    },
  },
};
