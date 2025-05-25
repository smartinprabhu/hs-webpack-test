/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import shiftFormModel from './shiftFormModel';

const {
  formField: {
    nameValue,
    description,
    startTime,
    duration,
  },
} = shiftFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(2, 'Only two characters are allowed'),
  [description.name]: Yup.string()
    .required(`${description.requiredErrorMsg}`)
    .max(50, 'Description is too large'),
  [startTime.name]: Yup.number()
    .nullable()
    .required(`${startTime.requiredErrorMsg}`),
  [duration.name]: Yup.number()
    .nullable()
    .required(`${duration.requiredErrorMsg}`),
});

export default validationSchema;
