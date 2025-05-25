export default {
  formId: 'contactForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    type: {
      name: 'type',
      label: 'Contact',
      label1: 'Invoice Address',
      label2: 'Shipping Address',
      label3: 'Other Address',
      label4: 'Private Address',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    visitorType: {
      name: 'visitor_type',
      label: 'Visitor Type',
      required: true,
      requiredErrorMsg: 'Visitor Type is required',
    },
    gender: {
      name: 'gender',
      label: 'Gender',
      required: true,
      requiredErrorMsg: 'Gender is required',
    },
    phone: {
      name: 'phone',
      label: 'Phone',
      required: true,
      requiredErrorMsg: 'Phone is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
    },
    userId: {
      name: 'user_id',
      label: 'Related User',
      required: false,
    },
    addressLineOne: {
      name: 'street',
      label: 'Address Line 1',
      required: false,
    },
    addressLineTwo: {
      name: 'street2',
      label: 'Address Line 2',
      required: false,
    },
    cityValue: {
      name: 'city',
      label: 'City',
      required: false,
    },
    countryId: {
      name: 'country_id',
      label: 'Country',
      required: false,
    },
    stateId: {
      name: 'state_id',
      label: 'State',
      required: false,
    },
    zip: {
      name: 'zip',
      label: 'ZIP',
      required: false,
    },
  },
};
