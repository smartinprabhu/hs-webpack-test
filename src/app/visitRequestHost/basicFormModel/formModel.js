export default {
  formId: 'visitorForm',
  formField: {
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
