import { switchCompany, getAnnouncementsInfo, saveViewerInfo, saveTnCInfo } from './actions';

export const GET_ANNOUNCEMENT_MODAL = 'GET_ANNOUNCEMENT_MODAL';
export const MARK_AS_READ_MODAL = 'MARK_AS_READ_MODAL';
export const SET_MENU_EXPAND = 'SET_MENU_EXPAND';

export default function userSwitchCompany(data) {
  return (dispatch) => {
    dispatch(switchCompany(data));
  };
}

export function getAnnouncementById(result) {
  return {
    type: GET_ANNOUNCEMENT_MODAL,
    payload: result,
  };
}

export function markAsReadAnnouncements(result) {
  return {
    type: MARK_AS_READ_MODAL,
    payload: result,
  };
}

export function getAnnouncementList(company, model, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getAnnouncementsInfo(company, model, sortByValue, sortFieldValue));
  };
}

export function saveViewer(model, result) {
  return (dispatch) => {
    dispatch(saveViewerInfo(model, result));
  };
}

export function saveTnC(model, id, result) {
  return (dispatch) => {
    dispatch(saveTnCInfo(model, id, result));
  };
}

export function setMenuExpand(result) {
  return {
    type: SET_MENU_EXPAND,
    payload: result,
  };
}
