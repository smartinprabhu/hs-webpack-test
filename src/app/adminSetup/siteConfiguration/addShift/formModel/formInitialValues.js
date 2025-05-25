import shiftFormModel from './shiftFormModel';

const {
  formField: {
    nameValue,
    description,
    startTime,
    duration,
    lcGrace,
    egGrace,
    halfDayFrom,
    halfDayTo,
    ltPeriod,
  },
} = shiftFormModel;

export default {
  [nameValue.name]: '',
  [description.name]: '',
  [startTime.name]: '',
  [duration.name]: '',
  [lcGrace.name]: 0.00,
  [egGrace.name]: 0.00,
  [halfDayFrom.name]: 0.00,
  [halfDayTo.name]: 0.00,
  [ltPeriod.name]: 0.00,
};
