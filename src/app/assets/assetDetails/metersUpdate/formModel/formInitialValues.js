import meterFormModel from './meterFormModel';

const {
  formField: {
    meterId,
    theoreticalTime,
    theoricalUtilization,
    actualUtilization,
    resourceCalendarId,
    activeType,
    createMo,
  },
} = meterFormModel;

export default {
  [meterId.name]: '',
  [theoreticalTime.name]: '',
  [theoricalUtilization.name]: '',
  [actualUtilization.name]: '',
  [resourceCalendarId.name]: '',
  [activeType.name]: '',
  [createMo.name]: '',
};
