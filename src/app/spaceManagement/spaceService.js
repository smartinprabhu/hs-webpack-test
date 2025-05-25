import {
  getFloorViewInfo,
  getEmployeeInfo,
  getFloorChildInfo,
  uploadFloorMap,
  updateSpaceInfo,
  getSpaceCategoryInfo,
  updateSpaces,
  resetData,
  clearDropdownDatas,
  newBulkDraggableSpace,
  isbulkUpdateSpaces,
  isupdateDragSpace,
  isPopoverOpenWindow,
  setDiscardEnable,
  clearUpdateMapInfo
}
  from './actions';

export const SPACE_FILTERS = 'SPACE_FILTERS';
export const SPACE_SELECT = 'SPACE_SELECT';
export const SET_CATEG = 'SET_CATEG';

export function getFloorView(parentId, model) {
  return (dispatch) => {
    dispatch(getFloorViewInfo(parentId, model));
  };
}

export function getFloorChild(parentId, model, spaceCategories) {
  return (dispatch) => {
    dispatch(getFloorChildInfo(parentId, model, spaceCategories));
  };
}

export function uploadFloorImage(id, file) {
  return (dispatch) => {
    dispatch(uploadFloorMap(id, file));
  };
}

export function getEmployee(id, file, keyword) {
  return (dispatch) => {
    dispatch(getEmployeeInfo(id, file, keyword));
  };
}
export function updateSpaceDetails(id, payload) {
  return (dispatch) => {
    dispatch(updateSpaceInfo(id, payload));
  };
}
export function getSpaceCategory(company, model) {
  return (dispatch) => {
    dispatch(getSpaceCategoryInfo(company, model));
  };
}

export function getSpaceFilters(addValues) {
  const result = { statuses: addValues };
  return {
    type: SPACE_FILTERS,
    payload: result,
  };
}
export function setCategoryInfo(payload) {
  return {
    type: SET_CATEG,
    payload,
  };
}
export function getSelectSpace(addValues) {
  const result = { statuses: addValues };
  return {
    type: SPACE_SELECT,
    payload: result,
  };
}

export function bulkUpdateSpaces(bulkSpaces) {
  return (dispatch) => {
    dispatch(updateSpaces(bulkSpaces));
  };
}

export function newBulkDraggableSpaceData(spaces) {
  return (dispatch) => {
    dispatch(newBulkDraggableSpace(spaces));
  };
}

export function isbulkUpdateData(data) {
  return (dispatch) => {
    dispatch(isbulkUpdateSpaces(data));
  };
}

export function isdragSpaceUpdate(data) {
  return (dispatch) => {
    dispatch(isupdateDragSpace(data));
  };
}

export function isOpenPopoverWindow(data) {
  return (dispatch) => {
    dispatch(isPopoverOpenWindow(data));
  };
}

export function setDiscard(data) {
  return (dispatch) => {
    dispatch(setDiscardEnable(data));
  };
}

export function resetSaveData() {
  return (dispatch) => {
    dispatch(resetData());
  };
}

export function clearDropdownData() {
  return (dispatch) => {
    dispatch(clearDropdownDatas());
  };
}


export function clearUpdateMapData() {
  return (dispatch) => {
    dispatch(clearUpdateMapInfo());
  };
}

