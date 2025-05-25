import scheduleFormModel from './formModel';

const {
  formField: {
    dateValue,
    dateReturnValue,
    entityType,
    remark,
    location,
    employeeId,
    assetIds,
  },
} = scheduleFormModel;

export default {
  [dateValue.name]: '',
  [dateReturnValue.name]: '',
  [entityType.name]: '',
  [remark.name]: '',
  [location.name]: '',
  [employeeId.name]: '',
  [assetIds.name]: '',
};
