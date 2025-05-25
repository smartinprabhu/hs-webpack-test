import { CALL_API } from '../../middleware/api';

export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD = 'RESET_PASSWORD';

export const GET_PASSWORD_POLICY_SUCCESS = 'GET_PASSWORD_POLICY_SUCCESS';
export const GET_PASSWORD_POLICY_FAILURE = 'GET_PASSWORD_POLICY_FAILURE';
export const GET_PASSWORD_POLICY = 'GET_PASSWORD_POLICY';

export const RESET_PASSWORD_LINK_SUCCESS = 'RESET_PASSWORD_LINK_SUCCESS';
export const RESET_PASSWORD_LINK_FAILURE = 'RESET_PASSWORD_LINK_FAILURE';
export const RESET_PASSWORD_LINK = 'RESET_PASSWORD_LINK';

export const CHECK_RESET_PASSWORD_LINK = 'CHECK_RESET_PASSWORD_LINK';
export const CHECK_RESET_PASSWORD_LINK_SUCCESS = 'CHECK_RESET_PASSWORD_LINK_SUCCESS';
export const CHECK_RESET_PASSWORD_LINK_FAILURE = 'CHECK_RESET_PASSWORD_LINK_FAILURE';

export const SAVE_SESSIONUUID = 'SAVE_SESSIONUUID';
export const CLEAR_RESET_PASSWORD_DATA = 'CLEAR_RESET_PASSWORD_DATA';
export const SHOW_RESET_PASSWORD = 'SHOW_RESET_PASSWORD';

// to sent reset password link

export function getResetPasswordLink(data) {
  return {
    [CALL_API]: {
      endpoint: 'user/forgot_password',
      types: [
        RESET_PASSWORD_LINK, RESET_PASSWORD_LINK_SUCCESS, RESET_PASSWORD_LINK_FAILURE,
      ],
      method: 'POST',
      payload: data,
    },
  };
}

// to get reset password policy

export function getPasswordPolicy() {
  return {
    [CALL_API]: {
      endpoint: 'user/password_policy?token=45g1FGWa8ILBJQl9sNEaevmYo2TgYP',
      types: [
        GET_PASSWORD_POLICY,
        GET_PASSWORD_POLICY_SUCCESS,
        GET_PASSWORD_POLICY_FAILURE,
      ],
      method: 'GET',
    },
  };
}

// to check check_reset_password_link

export function checkResetPasswordLink(values) {
  return {
    [CALL_API]: {
      endpoint: 'user/check_reset_password_link',
      types: [
        CHECK_RESET_PASSWORD_LINK,
        CHECK_RESET_PASSWORD_LINK_SUCCESS,
        CHECK_RESET_PASSWORD_LINK_FAILURE,
      ],
      method: 'POST',
      payload: values,
    },
  };
}

// to reset password

export function resetPassword(data) {
  return {
    [CALL_API]: {
      endpoint: 'user/reset_password',
      types: [
        RESET_PASSWORD,
        RESET_PASSWORD_SUCCESS,
        RESET_PASSWORD_FAILURE,
      ],
      method: 'POST',
      payload: data,
    },
  };
}

// to save session_uuid

export function saveSessionId(value) {
  return {
    type: SAVE_SESSIONUUID,
    payload: value,
  };
}

export function clearResetPassowrdRes() {
  return {
    type: CLEAR_RESET_PASSWORD_DATA,
  };
}

export function showForgotMailFormData() {
  return {
    type: CLEAR_RESET_PASSWORD_DATA,
  };
}

export function showResetPasswordFormData() {
  return {
    type: SHOW_RESET_PASSWORD,
  };
}
