/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import formModel from './formModel';

const {
  formField: {
    newPassword,
    password,
  },
} = formModel;

const validationSchema = Yup.object().shape({
  [newPassword.name]: Yup.string()
    .required(`${newPassword.requiredErrorMsg}`)
    .min(8, 'Password should not be less than 8 digits'),
  [password.name]: Yup.string()
    .oneOf([Yup.ref('new_password'), null], "Passwords don't match!")
    .required(`${password.requiredErrorMsg}`)
    .min(8, 'Password should not be less than 8 digits'),
});

export default validationSchema;
