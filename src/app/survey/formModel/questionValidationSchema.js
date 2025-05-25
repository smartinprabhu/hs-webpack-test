import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    questionTitle,
    parentId,
    questionOption,
  },
} = checkoutFormModel;

const questionValidationSchema = Yup.object().shape({
  [questionTitle.name]: Yup.string()
    .nullable()
    .required(`${questionTitle.requiredErrorMsg}`),
  [parentId.name]: Yup.string().when('is_enable_condition', {
    is: true,
    then: Yup.string().required('Question is required'),
  }),
  [questionOption.name]: Yup.string().when('is_enable_condition', {
    is: true,
    then: Yup.string().required('Option is required'),
  }),
});

export default questionValidationSchema;
