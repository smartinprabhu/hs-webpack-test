import { CALL_API } from '../../middleware/api';

export const GET_EMPLOYEE_INFO = 'GET_EMPLOYEE_INFO';
export const GET_EMPLOYEE_INFO_SUCCESS = 'GET_EMPLOYEE_INFO_SUCCESS';
export const GET_EMPLOYEE_INFO_FAILURE = 'GET_EMPLOYEE_INFO_FAILURE';

export const GET_FLOORS_CHILD_INFO = 'GET_FLOORS_CHILD_INFO';
export const GET_FLOORS_CHILD_SUCCESS = 'GET_FLOORS_CHILD_SUCCESS';
export const GET_FLOORS_CHILD_FAILURE = 'GET_FLOORS_CHILD_FAILURE';

export const GET_FLOORS_VIEW_INFO = 'GET_FLOORS_VIEW_INFO';
export const GET_FLOORS_VIEW_SUCCESS = 'GET_FLOORS_VIEW_SUCCESS';
export const GET_FLOORS_VIEW_FAILURE = 'GET_FLOORS_VIEW_FAILURE';
export const CLEAR_DROPDOWN_DATAS = 'CLEAR_DROPDOWN_DATAS';

export const GET_SPACE_CATEGORY_INFO = 'GET_SPACE_CATEGORY_INFO';
export const GET_SPACE_CATEGORY_SUCCESS = 'GET_SPACE_CATEGORY_SUCCESS';
export const GET_SPACE_CATEGORY_FAILURE = 'GET_SPACE_CATEGORY_FAILURE';

export const UPDATE_FLOOR_MAP = 'UPDATE_FLOOR_MAP';
export const UPDATE_FLOOR_MAP_SUCCESS = 'UPDATE_FLOOR_MAP_SUCCESS';
export const UPDATE_FLOOR_MAP_FAILURE = 'UPDATE_FLOOR_MAP_FAILURE';

export const UPDATE_SPACE_INFO = 'UPDATE_SPACE_INFO';
export const UPDATE_SPACE_INFO_SUCCESS = 'UPDATE_SPACE_INFO_SUCCESS';
export const UPDATE_SPACE_INFO_FAILURE = 'UPDATE_SPACE_INFO_FAILURE';

export const UPDATE_SPACES_INFO = 'UPDATE_SPACES_INFO';
export const UPDATE_SPACES_SUCCESS = 'UPDATE_SPACES_SUCCESS';
export const UPDATE_SPACES_FAILURE = 'UPDATE_SPACES_FAILURE';
export const RESET_DATA = 'RESET_DATA';

export const BULK_DRAGGABLE_SPACES = 'BULK_DRAGGABLE_SPACES';

export const BULK_DISCARD_DATA = 'BULK_DISCARD_DATA';

export const BULK_UPDATE_SPACES = 'BULK_UPDATE_SPACES';

export const UPDATE_DRAG_SPACE = 'UPDATE_DRAG_SPACE';

export const POPOVER_OPEN_WINDOW = 'POPOVER_OPEN_WINDOW';

export const CLEAR_UPDATE_MAP_DATA = 'CLEAR_UPDATE_MAP_DATA';

export function getFloorViewInfo(parentId, model) {
  return {
    [CALL_API]: {
      endpoint: `read/${model}?domain=[]&ids=[${parentId}]&fields=["id","name","space_name","asset_category_id","parent_id","company_id","asset_subcategory_id","area_sqft",
      "max_occupancy","latitude","longitude","type_id","sub_type_id","maintenance_team_id",
      "employee_id","path_name","space_status","tenant_id","child_ids","is_booking_allowed","sequence_asset_hierarchy","upload_images","file_path"]`,
      types: [GET_FLOORS_VIEW_INFO, GET_FLOORS_VIEW_SUCCESS, GET_FLOORS_VIEW_FAILURE],
      method: 'GET',
      parentId,
    },
  };
}

export function getFloorChildInfo(parentId, model, spaceCategories) {
  // ["is_booking_allowed","=",true],
  let payload = `domain=[["parent_id","child_of",${parentId}]`;
  if (spaceCategories && spaceCategories.length) {
    payload = `${payload}, ["asset_category_id", "in", ["${spaceCategories.join('","')}"]]`;
  }
  payload = `${payload}]&model=${model}&fields=["space_name","longitude","latitude","sub_type_id","space_status","sequence_asset_hierarchy","asset_category_id","path_name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_FLOORS_CHILD_INFO, GET_FLOORS_CHILD_SUCCESS, GET_FLOORS_CHILD_FAILURE],
      method: 'GET',
      parentId,
    },
  };
}

export function newBulkDraggableSpace(data) {
  return {
    type: BULK_DRAGGABLE_SPACES,
    payload: data,
  };
}

export function isbulkUpdateSpaces(data) {
  return {
    type: BULK_UPDATE_SPACES,
    payload: data,
  };
}

export function clearUpdateMapInfo(data) {
  return {
    type: CLEAR_UPDATE_MAP_DATA,
    payload: data,
  };
}
export function isupdateDragSpace(data) {
  return {
    type: UPDATE_DRAG_SPACE,
    payload: data,
  };
}

export function isPopoverOpenWindow(data) {
  return {
    type: POPOVER_OPEN_WINDOW,
    payload: data,
  };
}

export function setDiscardEnable(data) {
  return {
    type: BULK_DISCARD_DATA,
    payload: data,
  };
}

export function uploadFloorMap(id, file) {
  const payload = {
    ids: `[${id}]`, values: { upload_images: file },
  };
  return {
    [CALL_API]: {
      endpoint: 'write/mro.equipment.location',
      types: [UPDATE_FLOOR_MAP, UPDATE_FLOOR_MAP_SUCCESS, UPDATE_FLOOR_MAP_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getEmployeeInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","employee_id","employee_id_seq"]&limit=10&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EMPLOYEE_INFO, GET_EMPLOYEE_INFO_SUCCESS, GET_EMPLOYEE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateSpaceInfo(id, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: 'write/mro.equipment.location',
      types: [UPDATE_SPACE_INFO, UPDATE_SPACE_INFO_SUCCESS, UPDATE_SPACE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
export function updateSpaces(data) {
  return {
    [CALL_API]: {
      endpoint: 'space/bulkupdate',
      types: [UPDATE_SPACES_INFO, UPDATE_SPACES_SUCCESS, UPDATE_SPACES_FAILURE],
      method: 'PUT',
      payload: data,
    },
  };
}
export function getSpaceCategoryInfo() {
  return {
    [CALL_API]: {
      endpoint: 'space_category/list/bookable',
      types: [GET_SPACE_CATEGORY_INFO, GET_SPACE_CATEGORY_SUCCESS, GET_SPACE_CATEGORY_FAILURE],
      method: 'GET',
    },
  };
}
export function resetData() {
  return {
    type: RESET_DATA,
  };
}

export function clearDropdownDatas() {
  return {
    type: CLEAR_DROPDOWN_DATAS,
  };
}
