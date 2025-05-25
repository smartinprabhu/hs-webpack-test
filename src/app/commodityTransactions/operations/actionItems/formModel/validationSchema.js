/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './formModel';

const {
  formField: {
    finalReading,
    outDate,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({
  [finalReading.name]: Yup.number()
    .required(`${finalReading.requiredErrorMsg}`)
    .test({
      name: 'max',
      exclusive: false,
      params: { },
      message: 'Final reading should be greater than or equal to initial reading',
      test(value) {
        // You can access the initial_reading field with `this.parent`.
        return value >= this.parent.initial_reading;
      },
    }),
  [outDate.name]: Yup.string()
    .required(`${outDate.requiredErrorMsg}`),
});

export default validationSchema;
