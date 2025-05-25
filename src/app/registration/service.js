import {
  getMailValidation, validateOtp, userRegistration, resetRegistrationProcess, showRegistrationForm,
} from './actions';

export function getMailStatus(userData, token, tenantId) {
  return (dispatch) => {
    dispatch(getMailValidation(userData.email, token, tenantId));
  };
}

export function getOtpValidation(userData) {
  return (dispatch) => {
    dispatch(validateOtp(userData));
  };
}

export function registerUser(userData) {
  return (dispatch) => {
    dispatch(userRegistration(userData));
  };
}

export function resetRegistration() {
  return (dispatch) => {
    dispatch(resetRegistrationProcess());
  };
}

export function showRegistration() {
  return (dispatch) => {
    dispatch(showRegistrationForm());
  };
}
