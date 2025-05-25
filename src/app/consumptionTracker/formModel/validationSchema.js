/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    trackerTemplateId,
    startDate,
    endDate,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [dateAudit.name]: Yup.string()
    .required(`${dateAudit.requiredErrorMsg}`),
  [trackerTemplateId.name]: Yup.string()
    .required(`${trackerTemplateId.requiredErrorMsg}`),
  [startDate.name]: Yup.string()
    .required(`${startDate.requiredErrorMsg}`),
  [endDate.name]: Yup.string()
    .required(`${endDate.requiredErrorMsg}`),
});

export default validationSchema;
