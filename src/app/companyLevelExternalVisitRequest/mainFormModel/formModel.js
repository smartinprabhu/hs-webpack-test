export default {
  formId: 'visitorHostForm',
  formField: {
    nameValue: {
      name: 'visitor_name',
      label: 'Visitor Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobile: {
      name: 'phone',
      label: 'Visitor Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email',
      label: 'Visitor Email',
      required: true,
      requiredErrorMsg: 'Email is required',
    },
    plannedIn: {
      name: 'planned_in',
      label: 'Visit On',
      required: true,
      requiredErrorMsg: 'Visit On is required',
    },
  },
};
