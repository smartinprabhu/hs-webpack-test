/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './scheduleFormModel';

const {
  formField: {
    userId,
    dateTime,
    description,
    versionStatus,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({
  [userId.name]: Yup.string()
    .nullable()
    .required(`${userId.requiredErrorMsg}`),
  [dateTime.name]: Yup.string()
    .required(`${dateTime.requiredErrorMsg}`),
  [description.name]: Yup.string()
    .required(`${description.requiredErrorMsg}`),
  [versionStatus.name]: Yup.string()
    .required(`${versionStatus.requiredErrorMsg}`),
});

export default validationSchema;
