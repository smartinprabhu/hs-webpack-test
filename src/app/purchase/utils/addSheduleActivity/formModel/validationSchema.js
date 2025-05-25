/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './scheduleFormModel';

const {
  formField: {
    activityTypeId,
    dateDeadline,
    summary,
    Note,
    userId,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({
  [activityTypeId.name]: Yup.string()
    .nullable()
    .required(`${activityTypeId.requiredErrorMsg}`),
  [userId.name]: Yup.string()
    .nullable()
    .required(`${userId.requiredErrorMsg}`),
  [dateDeadline.name]: Yup.string()
    .required(`${dateDeadline.requiredErrorMsg}`),
  [summary.name]: Yup.string()
    .required(`${summary.requiredErrorMsg}`),
  [Note.name]: Yup.string()
    .required(`${Note.requiredErrorMsg}`),
});

export default validationSchema;
