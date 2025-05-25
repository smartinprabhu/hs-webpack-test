/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import passwordFormModel from './passwordFormModel';

const {
  formField: {
    newPassword,
    password,
    currentPassword,
  },
} = passwordFormModel;

const validationSchema = Yup.object().shape({
  [currentPassword.name]: Yup.string()
    .required(`${currentPassword.requiredErrorMsg}`)
    .min(8, 'Password should not be less than 8 digits'),
  [newPassword.name]: Yup.string()
    .notOneOf([Yup.ref('current_password')], 'New password should not be the same as the old password!')
    .required(`${newPassword.requiredErrorMsg}`)
    .min(8, 'Password should not be less than 8 digits'),
  [password.name]: Yup.string()
    .oneOf([Yup.ref('new_password'), null], "Passwords don't match!")
    .required(`${password.requiredErrorMsg}`)
    .min(8, 'Password should not be less than 8 digits'),
});

export default validationSchema;
