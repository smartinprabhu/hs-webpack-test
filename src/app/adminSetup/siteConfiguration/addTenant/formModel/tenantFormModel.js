export default {
  formId: 'tenantForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobile: {
      name: 'mobile',
      label: 'Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Email is not valid (e.g. abc@example.com)',
    },
  },
};
