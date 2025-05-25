export default {
  formId: 'escalationLevelForm',
  formField: {
    title: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    types: {
      name: 'type_category',
      label: 'Type',
    },
    space: {
      name: 'location_ids',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    recipients: {
      name: 'recipients_ids',
      label: 'Recipients',
      requiredErrorMsg: 'Recipients is required',
    },
    levels: {
      name: 'level',
      label: 'Level',
    },
    equipmentCategory: {
      name: 'category_id',
      label: 'Equipment Category',
    },
    spaceCategory: {
      name: 'space_category_id',
      label: 'Space Category',
    },
  },
};
