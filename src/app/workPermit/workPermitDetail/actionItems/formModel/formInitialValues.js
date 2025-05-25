import scheduleFormModel from './formModel';

const {
  formField: {
    validatedStatus,
    validatedOn,
    validatedBy,
  },
} = scheduleFormModel;

export default {
  [validatedStatus.name]: '',
  [validatedOn.name]: '',
  [validatedBy.name]: '',
};
