import * as Yup from 'yup';
import registrationModel from './registrationFormModel';

const {
  formField: {
    firstName,
    lastName,
    workNumber,
    password,
    repeatPassword,
  },
} = registrationModel;

const registrationValidationSchema = Yup.object({
  [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
  [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
  [workNumber.name]: Yup.string().required([workNumber.requiredErrorMsg]).matches(workNumber.regEx, workNumber.invalidErrorMsg),
  [password.name]: Yup.string().required(`${password.requiredErrorMsg}`).min(8, password.minLengthError).matches(password.regEx, password.invalidErrorMsg),
  [repeatPassword.name]: Yup.string().required(`${repeatPassword.requiredErrorMsg}`).oneOf([Yup.ref(`${password.name}`), null], repeatPassword.invalidErrorMsg),
});

export default registrationValidationSchema;
