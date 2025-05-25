import * as Yup from 'yup';
import createPasswordModel from './createPasswordFormModel';

const {
  formField: {
    password,
    repeatPassword,
  },
} = createPasswordModel;

const createPasswordSchema = Yup.object({
  [password.name]: Yup.string()
    .required(`${password.requiredErrorMsg}`)
    .min(8, password.minLengthError)
    .max(12, password.maxLengthError)
    .matches(password.regEx, password.invalidErrorMsg),
  [repeatPassword.name]: Yup.string()
    .required(`${repeatPassword.requiredErrorMsg}`)
    .oneOf([Yup.ref(`${password.name}`), null], repeatPassword.invalidErrorMsg),
});

export default createPasswordSchema;
