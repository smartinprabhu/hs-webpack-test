import { CALL_API } from "../../../middleware/api";

export const SWITCH_COMPANY = "SWITCH_COMPANY";
export const SWITCH_COMPANY_SUCCESS = "SWITCH_COMPANY_SUCCESS";
export const SWITCH_COMPANY_FAILURE = "SWITCH_COMPANY_FAILURE";

export const GET_ANNOUNCEMENTS_INFO = "GET_ANNOUNCEMENTS_INFO";
export const GET_ANNOUNCEMENTS_INFO_SUCCESS = "GET_ANNOUNCEMENTS_INFO_SUCCESS";
export const GET_ANNOUNCEMENTS_INFO_FAILURE = "GET_ANNOUNCEMENTS_INFO_FAILURE";

export const SAVE_VIEWER_INFO = "SAVE_VIEWER_INFO";
export const SAVE_VIEWER_INFO_SUCCESS = "SAVE_VIEWER_INFO_SUCCESS";
export const SAVE_VIEWER_INFO_FAILURE = "SAVE_VIEWER_INFO_FAILURE";

export const SAVE_TNC_INFO = "SAVE_TNC_INFO";
export const SAVE_TNC_INFO_SUCCESS = "SAVE_TNC_INFO_SUCCESS";
export const SAVE_TNC_INFO_FAILURE = "SAVE_TNC_INFO_FAILURE";

export function switchCompany(data) {
  return {
    [CALL_API]: {
      endpoint: "user/switch_company",
      types: [SWITCH_COMPANY, SWITCH_COMPANY_SUCCESS, SWITCH_COMPANY_FAILURE],
      method: "PUT",
      payload: data,
    },
  };
}

export function getAnnouncementsInfo(
  company,
  modelName,
  sortByValue,
  sortFieldValue
) {
  let payload = `domain=[["company_id","in",[${company}]],["state","=","active"]]`;
  payload = `${payload}&model=${modelName}&order=${sortFieldValue} ${sortByValue}`;
  return {
    [CALL_API]: {
      endpoint: `announcement/list?${payload}`,
      types: [
        GET_ANNOUNCEMENTS_INFO,
        GET_ANNOUNCEMENTS_INFO_SUCCESS,
        GET_ANNOUNCEMENTS_INFO_FAILURE,
      ],
      method: "GET",
      payload,
    },
  };
}

export function saveViewerInfo(model, data) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [
        SAVE_VIEWER_INFO,
        SAVE_VIEWER_INFO_SUCCESS,
        SAVE_VIEWER_INFO_FAILURE,
      ],
      method: "POST",
      payload: data,
    },
  };
}

export function saveTnCInfo(model, id, result) {
  return {
    [CALL_API]: {
      endpoint: "write",
      types: [SAVE_TNC_INFO, SAVE_TNC_INFO_SUCCESS, SAVE_TNC_INFO_FAILURE],
      method: "PUT",
      payload: {
        model: model,
        ids: `[${id}]`,
        values: result,
      },
    },
  };
}

export function updateHeaderData(payload) {
  return {
    type: "UPDATE_HEADER_DATA",
    payload,
  };
}
