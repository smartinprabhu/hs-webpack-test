export default {
  formId: 'bankForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    bankCode: {
      name: 'bic',
      label: 'Bank Identifier Code',
    },
    address: {
      name: 'street',
      label: 'Address',
    },
    city: {
      name: 'city',
      label: 'City',
    },
    stateId: {
      name: 'state_id',
      label: 'State',
    },
    countryId: {
      name: 'country_id',
      label: 'Country',
    },
    zip: {
      name: 'zip',
      label: 'ZIP',
    },
    phone: {
      name: 'phone',
      label: 'Phone',
    },
    email: {
      name: 'email',
      label: 'Email',
    },
  },
};
