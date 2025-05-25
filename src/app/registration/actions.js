import { CALL_API } from '../../middleware/api';

export const CHECK_EMAIL = 'CHECK_EMAIL';
export const CHECK_EMAIL_SUCCESS = 'CHECK_EMAIL_SUCCESS';
export const CHECK_EMAIL_FAILURE = 'CHECK_EMAIL_FAILURE';
export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const RESET_REGISTRATION = 'RESET_REGISTRATION';
export const SHOW_REGISTRATION = 'SHOW_REGISTRATION';

export const getMailValidation = (mailId, token, tenantId) => ({
  [CALL_API]: {
    endpoint: 'employee/validate_email',
    types: [CHECK_EMAIL, CHECK_EMAIL_SUCCESS, CHECK_EMAIL_FAILURE],
    method: 'POST',
    payload: {
      tenant_id: tenantId,
      email_id: mailId,
      token,
    },
  },
});

export const validateOtp = (userData) => ({
  [CALL_API]: {
    endpoint: `employee/validate_otp?session_token=${userData.session}&otp=${userData.otp}&email_id=${userData.email}&token=${userData.token}`,
    types: [CHECK_EMAIL, CHECK_EMAIL_SUCCESS, CHECK_EMAIL_FAILURE],
    method: 'POST',
  },
});

export const userRegistration = (userData) => ({
  [CALL_API]: {
    endpoint: `employee/register?token=${userData.token}
    &session_token=${userData.session}&first_name=${userData.firstName}
    &last_name=${userData.lastName}&work_email=${userData.email}&work_phone=${userData.workNumber}
    &password=${userData.password}&retype_password=${userData.repeatPassword}`,
    types: [REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE],
    method: 'POST',
  },
});

export function resetRegistrationProcess() {
  return {
    type: RESET_REGISTRATION,
  };
}

export function showRegistrationForm() {
  return {
    type: SHOW_REGISTRATION,
  };
}
