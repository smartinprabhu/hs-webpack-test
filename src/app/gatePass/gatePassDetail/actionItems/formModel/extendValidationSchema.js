/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './extendFormModel';

const {
  formField: {
    plannedStartTime,
    plannedEndTime,
    approvalAuthority,
    userId,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({
  /* [plannedEndTime.name]: Yup.number()
    .required(`${plannedEndTime.requiredErrorMsg}`)
    .test({
      name: 'max',
      exclusive: false,
      params: { },
      message: 'Final reading should be greater than or equal to initial reading',
      test(value) {
        // You can access the plannedStartTime field with `this.parent`.
        return value >= this.parent.planned_start_time;
      },
    }), */
  [plannedEndTime.name]: Yup.string()
    .required(`${plannedEndTime.requiredErrorMsg}`),
  [plannedStartTime.name]: Yup.string()
    .required(`${plannedStartTime.requiredErrorMsg}`),
  [plannedStartTime.name]: Yup.string()
    .required(`${plannedStartTime.requiredErrorMsg}`),
  [approvalAuthority.name]: Yup.string().when('type_of_request', (val) => {
    let valNew = val;
    const valueCheck = JSON.stringify(val);
    if (typeof valueCheck === 'object' && Object.keys(valueCheck).length > 0) {
      valNew = JSON.parse(valueCheck) && JSON.parse(valueCheck).value;
    }
    if (valNew && valNew.value && valNew.value !== 'Normal') {
      return Yup.string().required(`${approvalAuthority.requiredErrorMsg}`);
    }
  }),
  [userId.name]: Yup.string().when('type_of_request', (val) => {
    let valNew = val;
    const valueCheck = JSON.stringify(val);
    if (typeof valueCheck === 'object' && Object.keys(valueCheck).length > 0) {
      valNew = JSON.parse(valueCheck) && JSON.parse(valueCheck).value;
    }
    if (valNew && valNew.value && valNew.value !== 'Normal') {
      return Yup.string().required(`${userId.requiredErrorMsg}`);
    }
  }),
});

export default validationSchema;
