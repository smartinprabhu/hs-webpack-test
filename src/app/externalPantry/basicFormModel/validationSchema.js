/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

const {
  formField: {
    nameValue,
    email,
    pantry,
    space,
    isValidproducts,
  },
} = formModel;

const mailRegEx = /^[_a-zA-Z0-9.-]+(\.[_a-z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$/;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string().when('has_employee_name', {
    is: 'Required',
    then: Yup.string().required(`${nameValue.requiredErrorMsg}`).max(50, 'Name is too large'),
    otherwise: Yup.string().max(50, 'Name is too large.'),
  }),
  [email.name]: Yup.string().when('has_employee_email', {
    is: 'Required',
    then: Yup.string().required(`${email.requiredErrorMsg}`).matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
    otherwise: Yup.string().matches(mailRegEx, 'Invalid email ID.').max(50, 'Email is too large.'),
  }),
  [pantry.name]: Yup.string()
    .nullable()
    .required(`${pantry.requiredErrorMsg}`),
  [space.name]: Yup.string().when('has_space_required', {
    is: 'Required',
    then: Yup.string().nullable().required(`${space.requiredErrorMsg}`),
    otherwise: Yup.string().nullable(),
  }),
  [isValidproducts.name]: Yup.string().required(`${pantry.requiredErrorMsg}`),
});

export default validationSchema;
