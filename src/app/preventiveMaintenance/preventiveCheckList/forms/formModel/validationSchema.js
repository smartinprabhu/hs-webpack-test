import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    questionTitle,
    questionType,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [questionTitle.name]: Yup.string()
    .required(`${questionTitle.requiredErrorMsg}`),
  [questionType.name]: Yup.string()
    .required(`${questionType.requiredErrorMsg}`),
});

export default validationSchema;
