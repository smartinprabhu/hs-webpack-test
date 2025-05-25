/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    system,
    auditorName,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [dateAudit.name]: Yup.string()
    .required(`${dateAudit.requiredErrorMsg}`),
  [system.name]: Yup.string()
    .required(`${system.requiredErrorMsg}`),
  [auditorName.name]: Yup.string()
    .required(`${auditorName.requiredErrorMsg}`),
});

export default validationSchema;
