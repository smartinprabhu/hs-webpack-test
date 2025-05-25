import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    employeeId,
    pantryId,
    spaceId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [employeeId.name]: Yup.string()
    .nullable()
    .required(`${employeeId.requiredErrorMsg}`),
  [pantryId.name]: Yup.string()
    .nullable()
    .required(`${pantryId.requiredErrorMsg}`),
  [spaceId.name]: Yup.string()
    .nullable()
    .required(`${spaceId.requiredErrorMsg}`),
});

export default validationSchema;
