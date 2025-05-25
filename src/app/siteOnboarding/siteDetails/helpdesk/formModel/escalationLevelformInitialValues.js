import checkoutFormModel from './escalationLevelcheckoutFormModel';

const {
  formField: {
    title,
    types,
    space,
    recipients,
    levels,
    equipmentCategory,
    spaceCategory,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [types.name]: { value: 'equipment', label: 'Equipment' },
  [space.name]: '',
  [recipients.name]: '',
  [levels.name]: { value: 'level1', label: 'Level 1' },
  [equipmentCategory.name]: '',
  [spaceCategory.name]: '',
};
