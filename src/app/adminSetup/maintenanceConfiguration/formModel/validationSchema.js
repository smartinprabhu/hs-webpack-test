/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    typeId,
    fromDate,
    toDate,
  },
} = checkoutFormModel;

export default [
  Yup.object().shape({
    [title.name]: Yup.string()
      .nullable()
      .required(`${title.requiredErrorMsg}`),
    [typeId.name]: Yup.string()
      .nullable()
      .required(`${typeId.requiredErrorMsg}`),
    [fromDate.name]: Yup.date()
      .required(`${fromDate.requiredErrorMsg}`),
    [toDate.name]: Yup.date()
      .required(`${toDate.requiredErrorMsg}`),
  }),
];
