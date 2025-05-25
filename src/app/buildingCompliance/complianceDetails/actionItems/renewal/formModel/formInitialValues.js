import scheduleFormModel from './scheduleFormModel';

const {
  formField: {
    userId,
    dateTime,
    description,
    versionStatus,
    complianceEvidenceId,
    document,
  },
} = scheduleFormModel;

export default {
  [userId.name]: '',
  [dateTime.name]: '',
  [description.name]: '',
  [complianceEvidenceId.name]: '',
  [versionStatus.name]: { value: 'Working', label: 'Working' },
  [document.name]: '',
};
