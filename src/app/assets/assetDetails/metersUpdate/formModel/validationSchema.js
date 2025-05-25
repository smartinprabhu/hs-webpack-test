/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import meterFormModel from './meterFormModel';

const {
  formField: {
    meterId,
    theoreticalTime,
    theoricalUtilization,
    actualUtilization,
    resourceCalendarId,
  },
} = meterFormModel;

const validationSchema = Yup.object().shape({
  [meterId.name]: Yup.string()
    .nullable()
    .required(`${meterId.requiredErrorMsg}`),
  [theoreticalTime.name]: Yup.number()
    .nullable()
    .required(`${theoreticalTime.requiredErrorMsg}`),
  [theoricalUtilization.name]: Yup.number()
    .nullable()
    .required(`${theoricalUtilization.requiredErrorMsg}`),
  [actualUtilization.name]: Yup.number()
    .nullable()
    .required(`${actualUtilization.requiredErrorMsg}`),
  [resourceCalendarId.name]: Yup.string()
    .nullable()
    .required(`${resourceCalendarId.requiredErrorMsg}`),
});

export default validationSchema;
