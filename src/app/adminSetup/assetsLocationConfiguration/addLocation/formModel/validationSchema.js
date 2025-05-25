/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import userFormModel from './userFormModel';

const {
  formField: {
    spaceName,
    Type,
  },
} = userFormModel;

const validationSchema = Yup.object().shape({
  [spaceName.name]: Yup.string()
    .required(`${spaceName.requiredErrorMsg}`)
    .max(50, 'Name is too large'),
  [Type.name]: Yup.string()
    .nullable()
    .required(`${Type.requiredErrorMsg}`),
});

export default validationSchema;
