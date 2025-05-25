import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    Operation,
    Type,
    loggedOn,
    securityBy,
    carriedBy,
    accompaniedBy,
    Weight,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [Operation.name]: Yup.string()
    .nullable()
    .required(`${Operation.requiredErrorMsg}`),
  [Weight.name]: Yup.number()
    .required(`${Weight.requiredErrorMsg}`),
  [Type.name]: Yup.string()
    .nullable()
    .required(`${Type.requiredErrorMsg}`),
  [loggedOn.name]: Yup.string()
    .nullable()
    .required(`${loggedOn.requiredErrorMsg}`),
  [securityBy.name]: Yup.string().when('is_has_security', {
    is: 'Required',
    then: Yup.string().required('Security by is Required'),
  }),
  [carriedBy.name]: Yup.string().when('is_has_carried', {
    is: 'Required',
    then: Yup.string().required('Carried By is required'),
  }),
  [accompaniedBy.name]: Yup.string().when('is_has_accompanied', {
    is: 'Required',
    then: Yup.string().required('Accompanied By is required'),
  }),
});

export default validationSchema;
