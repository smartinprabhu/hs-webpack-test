/* eslint-disable consistent-return */
import * as Yup from 'yup';
import NaturefoWorkCheckoutFormModel from './naturefoWorkCheckoutFormModel';

const {
  formField: {
    title,
    preparednessCheckList,
  },
} = NaturefoWorkCheckoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [preparednessCheckList.name]: Yup.string()
    .required(`${preparednessCheckList.requiredErrorMsg}`),
});

export default validationSchema;
