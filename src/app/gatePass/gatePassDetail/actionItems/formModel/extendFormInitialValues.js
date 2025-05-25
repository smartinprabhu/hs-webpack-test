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
  [typeofRequest.name]: 'Normal',
  [plannedStartTime.name]: '',
  [plannedEndTime.name]: '',
  [approvalAuthority.name]: '',
  [userId.name]: '',
};
