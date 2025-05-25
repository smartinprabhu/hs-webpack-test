import mailRegistartionModel from './mailRegistrationFormModel';

const {
  formField: {
    email,
    otp,
  },
} = mailRegistartionModel;

export default {
  [email.name]: '',
  [otp.name]: '',
};
