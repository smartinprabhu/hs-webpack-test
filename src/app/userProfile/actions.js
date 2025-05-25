import { CALL_API } from '../../middleware/api';
import AuthService from '../util/authService';

export const UPDATE_USER_IMAGE = 'UPDATE_USER_IMAGE';
export const UPDATE_USER_IMAGE_SUCCESS = 'UPDATE_USER_IMAGE_SUCCESS';
export const UPDATE_USER_IMAGE_FAILURE = 'UPDATE_USER_IMAGE_FAILURE';

export const RESET_USER_PROFILE = 'RESET_USER_PROFILE';
export const OPEN_MODAL_WINDOW = 'OPEN_MODAL_WINDOW';
export const CLOSE_MODAL_WINDOW = 'CLOSE_MODAL_WINDOW';

export const GET_GUEST_LIST = 'GET_GUEST_LIST';
export const GET_GUEST_LIST_SUCCESS = 'GET_GUEST_LIST_SUCCESS';
export const GET_GUEST_LIST_FAILURE = 'GET_GUEST_LIST_FAILURE';
export const RESET_DATA = 'RESET_DATA';

export const RESET_DELETE_GUEST = 'RESET_DELETE_GUEST';
export const DELETE_GUEST = 'DELETE_GUEST';
export const DELETE_GUEST_SUCCESS = 'DELETE_GUEST_SUCCESS';
export const DELETE_GUEST_FAILURE = 'DELETE_GUEST_FAILURE';
const accessToken = AuthService.getAccessToken;
export const RESET_LANG_DATA = 'RESET_LANG_DATA';

export const UPDATE_LANG_USER = 'UPDATE_LANG_USER';
export const UPDATE_LANG_USER_SUCCESS = 'UPDATE_LANG_USER_SUCCESS';
export const UPDATE_LANG_USER_FAILURE = 'UPDATE_LANG_USER_FAILURE';

export function updateUserImage(id, result) {
  const payload = {
    ids: `[${id}]`, values: result,
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

export function deleteGuestItem(employeeId, guest) {
  return {
    [CALL_API]: {
      endpoint: `guest/archive?employee_id=${employeeId}&guest_id=${guest.id}`,
      types: [DELETE_GUEST, DELETE_GUEST_SUCCESS, DELETE_GUEST_FAILURE],
      method: 'PUT',
      payload: accessToken,
    },
  };
}

export function resetDeleteGuestData() {
  return {
    type: RESET_DELETE_GUEST,
  };
}

export function getGuestListInfo(employeeId, name) {
  return {
    [CALL_API]: {
      endpoint: `guest/list?employee_id=${employeeId}&name=${name}`,
      types: [GET_GUEST_LIST, GET_GUEST_LIST_SUCCESS, GET_GUEST_LIST_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function updateUserLang(id, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: 'write/res.users',
      types: [UPDATE_LANG_USER, UPDATE_LANG_USER_SUCCESS, UPDATE_LANG_USER_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function resetProfileModalWindow() {
  return {
    type: RESET_USER_PROFILE,
  };
}

export function openUserProfileWindow() {
  return {
    type: OPEN_MODAL_WINDOW,
  };
}

export function closeUserProfileWindow() {
  return {
    type: CLOSE_MODAL_WINDOW,
  };
}
export function resetData() {
  return {
    type: RESET_DATA,
  };
}

export function resetLangData() {
  return {
    type: RESET_LANG_DATA,
  };
}
