import {
  getUserInfo, getUserRolesInfo, updateUserImage, updateUserInfo,
} from './actions';

export function getUserDetails(accessToken) {
  return (dispatch) => {
    dispatch(getUserInfo(accessToken));
  };
}


export function updateUserDetails(accessToken) {
  return (dispatch) => {
    dispatch(updateUserInfo(accessToken));
  };
}

export function getUserRoles(accessToken) {
  return (dispatch) => {
    dispatch(getUserRolesInfo(accessToken));
  };
}

export function updateUserProfileImage(id, file) {
  return (dispatch) => {
    dispatch(updateUserImage(id, file));
  };
}
