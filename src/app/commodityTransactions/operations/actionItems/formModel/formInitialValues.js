import scheduleFormModel from './formModel';

const {
  formField: {
    deliveryChallan,
    initialReading,
    inDate,
    outDate,
    remark,
    amountVal,
  },
} = scheduleFormModel;

export default {
  [deliveryChallan.name]: '',
  [initialReading.name]: '',
  [inDate.name]: '',
  [outDate.name]: '',
  [remark.name]: '',
  [amountVal.name]: '',
};
