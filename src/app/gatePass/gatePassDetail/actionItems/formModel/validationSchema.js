/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './formModel';

const {
  formField: {
    validatedOn,
    validatedStatus,
    validatedBy,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({
  [validatedOn.name]: Yup.string()
    .required(`${validatedOn.requiredErrorMsg}`),
  [validatedStatus.name]: Yup.string()
    .required(`${validatedStatus.requiredErrorMsg}`),
  [validatedBy.name]: Yup.string()
    .required(`${validatedBy.requiredErrorMsg}`),
});

export default validationSchema;
