export default {
  formId: 'visitorForm',
  formField: {
    visitorType: {
      name: 'type_of_visitor',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    nameValue: {
      name: 'visitor_name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobile: {
      name: 'phone',
      label: 'Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
    },
  },
};
