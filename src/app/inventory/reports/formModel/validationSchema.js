/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

const {
  formField: {
    computeAtDate,
  },
} = formModel;

const validationSchema = Yup.object().shape({
  [computeAtDate.name]: Yup.string()
    .required(`${computeAtDate.requiredErrorMsg}`),
});

export default validationSchema;
