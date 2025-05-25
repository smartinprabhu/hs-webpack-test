import {
  updateUserImage, resetProfileModalWindow, getGuestListInfo, deleteGuestItem,
  openUserProfileWindow, closeUserProfileWindow, resetData, resetDeleteGuestData,
  updateUserLang, resetLangData,
} from './actions';

export function updateUserProfileImage(id, file) {
  return (dispatch) => {
    dispatch(updateUserImage(id, file));
  };
}

export function updateUserLanguage(id, file) {
  return (dispatch) => {
    dispatch(updateUserLang(id, file));
  };
}

export function resetUserProfileModalWindow() {
  return (dispatch) => {
    dispatch(resetProfileModalWindow());
  };
}

export function openUserProfileModalWindow() {
  return (dispatch) => {
    dispatch(openUserProfileWindow());
  };
}

export function closeUserProfileModalWindow() {
  return (dispatch) => {
    dispatch(closeUserProfileWindow());
  };
}
export function resetUpdateImageData() {
  return (dispatch) => {
    dispatch(resetData());
  };
}

export function getGuestList(empId, name) {
  return (dispatch) => {
    dispatch(getGuestListInfo(empId, name));
  };
}

export function deleteGuest(employeeId, guest) {
  return (dispatch) => {
    dispatch(deleteGuestItem(employeeId, guest));
  };
}

export function resetDeleteGuest() {
  return (dispatch) => {
    dispatch(resetDeleteGuestData());
  };
}
export function resetLanguageData() {
  return (dispatch) => {
    dispatch(resetLangData());
  };
}
