import scheduleFormModel from './extendFormModel';

const {
  formField: {
    extendType,
    typeofRequest,
    plannedStartTime,
    plannedEndTime,
    approvalAuthority,
    userId,
  },
} = scheduleFormModel;

export default {
  [extendType.name]: 'Current Date',
  [typeofRequest.name]: '',
  [plannedStartTime.name]: '',
  [plannedEndTime.name]: '',
  [approvalAuthority.name]: '',
  [userId.name]: '',
  date_valid: 'yes',
};
