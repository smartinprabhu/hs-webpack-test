import { CALL_API } from '../../middleware/api';

export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

export const UPDATE_USER_CONFIG_INFO = 'UPDATE_USER_CONFIG_INFO';
export const UPDATE_USER_CONFIG_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_CONFIG_INFO_FAILURE = 'UPDATE_USER_CONFIG_INFO_FAILURE';

export const GET_USER_ACCESS = 'GET_USER_ACCESS';
export const GET_USER_ACCESS_SUCCESS = 'GET_USER_ACCESS_SUCCESS';
export const GET_USER_ACCESS_FAILURE = 'GET_USER_ACCESS_FAILURE';
export const SAVE_PIN_ENABLE_DATA = 'SAVE_PIN_ENABLE_DATA';

export const UPDATE_USER_IMAGE = 'UPDATE_USER_IMAGE';
export const UPDATE_USER_IMAGE_SUCCESS = 'UPDATE_USER_IMAGE_SUCCESS';
export const UPDATE_USER_IMAGE_FAILURE = 'UPDATE_USER_IMAGE_FAILURE';

export function getUserInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'userinformation',
      types: [GET_USER_INFO, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateUserInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'userinformation',
      types: [UPDATE_USER_CONFIG_INFO, UPDATE_USER_CONFIG_INFO_SUCCESS, UPDATE_USER_CONFIG_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}


export function getUserRolesInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'configuration',
      types: [GET_USER_ACCESS, GET_USER_ACCESS_SUCCESS, GET_USER_ACCESS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateUserImage(id, file) {
  const payload = {
    ids: `[${id}]`, values: { image: file },
  };
  return {
    [CALL_API]: {
      endpoint: 'write/res.users',
      types: [UPDATE_USER_IMAGE, UPDATE_USER_IMAGE_SUCCESS, UPDATE_USER_IMAGE_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
