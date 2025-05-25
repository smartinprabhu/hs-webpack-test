import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    employeeId,
    pantryId,
    spaceId,
  },
} = checkoutFormModel;

export default {
  [employeeId.name]: '',
  [pantryId.name]: '',
  [spaceId.name]: '',
};
