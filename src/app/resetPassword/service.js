import {
  resetPassword, checkResetPasswordLink, getPasswordPolicy, getResetPasswordLink, clearResetPassowrdRes, showForgotMailFormData, showResetPasswordFormData,
} from './action';

export function createNewPassword(data) {
  return (dispatch) => {
    dispatch(resetPassword(data));
  };
}
export function testResetPasswordLink(values) {
  return (dispatch) => {
    dispatch(checkResetPasswordLink(values));
  };
}
export function getPasswordPolicyInfo() {
  return (dispatch) => {
    dispatch(getPasswordPolicy());
  };
}
export function sendResetPasswordLink(data) {
  return (dispatch) => {
    dispatch(getResetPasswordLink(data));
  };
}

export function clearResetPasswordData() {
  return (dispatch) => {
    dispatch(clearResetPassowrdRes());
  };
}

export function showForgotMailForm() {
  return (dispatch) => {
    dispatch(showForgotMailFormData());
  };
}

export function showResetPasswordForm() {
  return (dispatch) => {
    dispatch(showResetPasswordFormData());
  };
}
