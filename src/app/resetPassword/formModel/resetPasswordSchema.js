import * as Yup from 'yup';
import resetPasswordModel from './resetPasswordFormModel';

const {
  formField: {
    email,
  },
} = resetPasswordModel;

const resetPasswordSchema = Yup.object({
  [email.name]: Yup.string().required(`${email.requiredErrorMsg}`).max(50, email.maxLengthError).matches(email.regEx, email.invalidErrorMsg),
});

export default resetPasswordSchema;
