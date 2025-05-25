export default {
  formId: 'companyForm',
  formField: {
    nameValue: {
      name: 'contact_name',
      label: 'Name',
      required: false,
      requiredErrorMsg: 'Name is required',
    },
    mobile: {
      name: 'mobile',
      label: 'Mobile',
      required: false,
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email_from',
      label: 'Company Email',
      required: false,
      requiredErrorMsg: 'Email is required',
    },
    jobPosition: {
      name: 'function',
      label: 'Job Position',
      required: false,
    },
    companyName: {
      name: 'name',
      label: 'Company Name',
      required: false,
      requiredErrorMsg: 'Company is required',
    },
    address: {
      name: 'street',
      label: 'Address',
      required: false,
    },
    countryId: {
      name: 'country_id',
      label: 'Country',
      required: false,
    },
    website: {
      name: 'website',
      label: 'Website',
      required: false,
    },
  },
};
