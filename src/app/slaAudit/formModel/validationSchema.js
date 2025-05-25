/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    auditTemplateId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [dateAudit.name]: Yup.string()
    .required(`${dateAudit.requiredErrorMsg}`),
  [auditTemplateId.name]: Yup.string()
    .required(`${auditTemplateId.requiredErrorMsg}`),
});

export default validationSchema;
