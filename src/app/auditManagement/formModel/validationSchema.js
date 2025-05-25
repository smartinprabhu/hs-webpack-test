import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    auditSystemId,
    auditSpocId,
    plannedStartDate,
    plannedEndDate,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [auditSystemId.name]: Yup.string()
    .required(`${auditSystemId.requiredErrorMsg}`),
  [auditSpocId.name]: Yup.string()
    .required(`${auditSpocId.requiredErrorMsg}`),
  [plannedStartDate.name]: Yup.string()
    .required(`${plannedStartDate.requiredErrorMsg}`),
  [plannedEndDate.name]: Yup.string()
    .required(`${plannedEndDate.requiredErrorMsg}`),
  date_valid: Yup.string()
    .required(`${plannedEndDate.requiredErrorMsg}`),
});

export default validationSchema;
