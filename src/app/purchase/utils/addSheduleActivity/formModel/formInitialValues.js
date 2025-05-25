import scheduleFormModel from './scheduleFormModel';

const {
  formField: {
    activityTypeId,
    summary,
    dateDeadline,
    userId,
    Note,
  },
} = scheduleFormModel;

export default {
  [activityTypeId.name]: '',
  [summary.name]: '',
  [dateDeadline.name]: '',
  [userId.name]: '',
  [Note.name]: '',
};
