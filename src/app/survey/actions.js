/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import surveyCustomData from './data/customData.json';
import { SurveyModule } from '../util/field';

export const GET_SURVEY_LIST_INFO = 'GET_SURVEY_LIST_INFO';
export const GET_SURVEY_LIST_INFO_SUCCESS = 'GET_SURVEY_LIST_INFO_SUCCESS';
export const GET_SURVEY_LIST_INFO_FAILURE = 'GET_SURVEY_LIST_INFO_FAILURE';

export const GET_SURVEY_COUNT_INFO = 'GET_SURVEY_COUNT_INFO';
export const GET_SURVEY_COUNT_INFO_SUCCESS = 'GET_SURVEY_COUNT_INFO_SUCCESS';
export const GET_SURVEY_COUNT_INFO_FAILURE = 'GET_SURVEY_COUNT_INFO_FAILURE';

export const GET_SURVEY_EXPORT_LIST_INFO = 'GET_SURVEY_EXPORT_LIST_INFO';
export const GET_SURVEY_EXPORT_LIST_INFO_SUCCESS = 'GET_SURVEY_EXPORT_LIST_INFO_SUCCESS';
export const GET_SURVEY_EXPORT_LIST_INFO_FAILURE = 'GET_SURVEY_EXPORT_LIST_INFO_FAILURE';

export const GET_SURVEY_DETAILS_INFO = 'GET_SURVEY_DETAILS_INFO';
export const GET_SURVEY_DETAILS_INFO_SUCCESS = 'GET_SURVEY_DETAILS_INFO_SUCCESS';
export const GET_SURVEY_DETAILS_INFO_FAILURE = 'GET_SURVEY_DETAILS_INFO_FAILURE';

export const GET_SV_DASHBOARD_INFO = 'GET_SV_DASHBOARD_INFO';
export const GET_SV_DASHBOARD_INFO_SUCCESS = 'GET_SV_DASHBOARD_INFO_SUCCESS';
export const GET_SV_DASHBOARD_INFO_FAILURE = 'GET_SV_DASHBOARD_INFO_FAILURE';

export const GET_SURVEY_STATE_CHANGE_INFO = 'GET_SURVEY_STATE_CHANGE_INFO';
export const GET_SURVEY_STATE_CHANGE_INFO_SUCCESS = 'GET_SURVEY_STATE_CHANGE_INFO_SUCCESS';
export const GET_SURVEY_STATE_CHANGE_INFO_FAILURE = 'GET_SURVEY_STATE_CHANGE_INFO_FAILURE';

export const CREATE_SURVEY_INFO = 'CREATE_SURVEY_INFO';
export const CREATE_SURVEY_INFO_SUCCESS = 'CREATE_SURVEY_INFO_SUCCESS';
export const CREATE_SURVEY_INFO_FAILURE = 'CREATE_SURVEY_INFO_FAILURE';

export const GET_ST_INFO = 'GET_ST_INFO';
export const GET_ST_INFO_SUCCESS = 'GET_ST_INFO_SUCCESS';
export const GET_ST_INFO_FAILURE = 'GET_ST_INFO_FAILURE';

export const GET_EP_INFO = 'GET_EP_INFO';
export const GET_EP_INFO_SUCCESS = 'GET_EP_INFO_SUCCESS';
export const GET_EP_INFO_FAILURE = 'GET_EP_INFO_FAILURE';

export const GET_ST_GROUP_INFO = 'GET_ST_GROUP_INFO';
export const GET_ST_GROUP_INFO_SUCCESS = 'GET_ST_GROUP_INFO_SUCCESS';
export const GET_ST_GROUP_INFO_FAILURE = 'GET_ST_GROUP_INFO_FAILURE';

export const GET_SQ_GROUP_INFO = 'GET_SQ_GROUP_INFO';
export const GET_SQ_GROUP_INFO_SUCCESS = 'GET_SQ_GROUP_INFO_SUCCESS';
export const GET_SQ_GROUP_INFO_FAILURE = 'GET_SQ_GROUP_INFO_FAILURE';

export const GET_SL_GROUP_INFO = 'GET_SL_GROUP_INFO';
export const GET_SL_GROUP_INFO_SUCCESS = 'GET_SL_GROUP_INFO_SUCCESS';
export const GET_SL_GROUP_INFO_FAILURE = 'GET_SL_GROUP_INFO_FAILURE';

export const UPDATE_SURVEY_INFO = 'UPDATE_SURVEY_INFO';
export const UPDATE_SURVEY_INFO_SUCCESS = 'UPDATE_SURVEY_INFO_SUCCESS';
export const UPDATE_SURVEY_INFO_FAILURE = 'UPDATE_SURVEY_INFO_FAILURE';

export const GET_QUESTION_INFO = 'GET_QUESTION_INFO';
export const GET_QUESTION_INFO_SUCCESS = 'GET_QUESTION_INFO_SUCCESS';
export const GET_QUESTION_INFO_FAILURE = 'GET_QUESTION_INFO_FAILURE';

export const GET_SURVEY_ANSWERS_INFO = 'GET_SURVEY_ANSWERS_INFO';
export const GET_SURVEY_ANSWERS_INFO_SUCCESS = 'GET_SURVEY_ANSWERS_INFO_SUCCESS';
export const GET_SURVEY_ANSWERS_INFO_FAILURE = 'GET_SURVEY_ANSWERS_INFO_FAILURE';

export const GET_QUESTION_IDS_INFO = 'GET_QUESTION_IDS_INFO';
export const GET_QUESTION_IDS_INFO_SUCCESS = 'GET_QUESTION_IDS_INFO_SUCCESS';
export const GET_QUESTION_IDS_INFO_FAILURE = 'GET_QUESTION_IDS_INFO_FAILURE';

export const GET_CHOICE_INFO = 'GET_CHOICE_INFO';
export const GET_CHOICE_INFO_SUCCESS = 'GET_CHOICE_INFO_SUCCESS';
export const GET_CHOICE_INFO_FAILURE = 'GET_CHOICE_INFO_FAILURE';

export const GET_MATRIX_INFO = 'GET_MATRIX_INFO';
export const GET_MATRIX_INFO_SUCCESS = 'GET_MATRIX_INFO_SUCCESS';
export const GET_MATRIX_INFO_FAILURE = 'GET_MATRIX_INFO_FAILURE';

export const DELETE_ANSWERS_INFO = 'DELETE_ANSWERS_INFO';
export const DELETE_ANSWERS_INFO_SUCCESS = 'DELETE_ANSWERS_INFO_SUCCESS';
export const DELETE_ANSWERS_INFO_FAILURE = 'DELETE_ANSWERS_INFO_FAILURE';

export const GET_ANSWER_DETAILS_INFO = 'GET_ANSWER_DETAILS_INFO';
export const GET_ANSWER_DETAILS_INFO_SUCCESS = 'GET_ANSWER_DETAILS_INFO_SUCCESS';
export const GET_ANSWER_DETAILS_INFO_FAILURE = 'GET_ANSWER_DETAILS_INFO_FAILURE';

export const GET_ANSWER_LIST_DETAILS_INFO = 'GET_ANSWER_LIST_DETAILS_INFO';
export const GET_ANSWER_LIST_DETAILS_INFO_SUCCESS = 'GET_ANSWER_LIST_DETAILS_INFO_SUCCESS';
export const GET_ANSWER_LIST_DETAILS_INFO_FAILURE = 'GET_ANSWER_LIST_DETAILS_INFO_FAILURE';

export const GET_ANSWER_LIST_EXPORT_INFO = 'GET_ANSWER_LIST_EXPORT_INFO';
export const GET_ANSWER_LIST_DETAILS_EXPORT_SUCCESS = 'GET_ANSWER_LIST_DETAILS_EXPORT_SUCCESS';
export const GET_ANSWER_LIST_DETAILS_EXPORT_FAILURE = 'GET_ANSWER_LIST_DETAILS_EXPORT_FAILURE';

export const GET_ANSWER_DETAILS_COUNT_INFO = 'GET_ANSWER_DETAILS_COUNT_INFO';
export const GET_ANSWER_DETAILS_COUNT_INFO_SUCCESS = 'GET_ANSWER_DETAILS_COUNT_INFO_SUCCESS';
export const GET_ANSWER_DETAILS_COUNT_INFO_FAILURE = 'GET_ANSWER_DETAILS_COUNT_INFO_FAILURE';

export const GET_SURVEY_LOCATIONS_INFO = 'GET_SURVEY_LOCATIONS_INFO';
export const GET_SURVEY_LOCATIONS_INFO_SUCCESS = 'GET_SURVEY_LOCATIONS_INFO_SUCCESS';
export const GET_SURVEY_LOCATIONS_INFO_FAILURE = 'GET_SURVEY_LOCATIONS_INFO_FAILURE';

export const GET_SURVEY_DOMAINS_INFO = 'GET_SURVEY_DOMAINS_INFO';
export const GET_SURVEY_DOMAINS_INFO_SUCCESS = 'GET_SURVEY_DOMAINS_INFO_SUCCESS';
export const GET_SURVEY_DOMAINS_INFO_FAILURE = 'GET_SURVEY_DOMAINS_INFO_FAILURE';

export const GET_SURVEY_TENANTS_INFO = 'GET_SURVEY_TENANTS_INFO';
export const GET_SURVEY_TENANTS_INFO_SUCCESS = 'GET_SURVEY_TENANTS_INFO_SUCCESS';
export const GET_SURVEY_TENANTS_INFO_FAILURE = 'GET_SURVEY_TENANTS_INFO_FAILURE';

export const GET_SURVEY_RC_INFO = 'GET_SURVEY_RC_INFO';
export const GET_SURVEY_RC_INFO_SUCCESS = 'GET_SURVEY_RC_INFO_SUCCESS';
export const GET_SURVEY_RC_INFO_FAILURE = 'GET_SURVEY_RC_INFO_FAILURE';

export const GET_SURVEY_QTN_GROUP_INFO = 'GET_SURVEY_QTN_GROUP_INFO';
export const GET_SURVEY_QTN_GROUP_INFO_SUCCESS = 'GET_SURVEY_QTN_GROUP_INFO_SUCCESS';
export const GET_SURVEY_QTN_GROUP_INFO_FAILURE = 'GET_SURVEY_QTN_GROUP_INFO_FAILURE';

export const GET_AUDIT_STANDARDS_INFO = 'GET_AUDIT_STANDARDS_INFO';
export const GET_AUDIT_STANDARDS_INFO_SUCCESS = 'GET_AUDIT_STANDARDS_INFO_SUCCESS';
export const GET_AUDIT_STANDARDS_INFO_FAILURE = 'GET_AUDIT_STANDARDS_INFO_FAILURE';

export function getSurveyLocationsInfo(model, ids) {
  const payload = `domain=[["id","in",${JSON.stringify(ids)}]]&model=${model}&fields=["id","name","path_name","asset_category_id"]&limit=${ids.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_LOCATIONS_INFO, GET_SURVEY_LOCATIONS_INFO_SUCCESS, GET_SURVEY_LOCATIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyTenantsInfo(model, ids) {
  const payload = `domain=[["id","in",${JSON.stringify(ids)}]]&model=${model}&fields=["id","name","display_name"]&limit=${ids.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_TENANTS_INFO, GET_SURVEY_TENANTS_INFO_SUCCESS, GET_SURVEY_TENANTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyRecipientsInfo(model, ids) {
  const payload = `domain=[["id","in",${JSON.stringify(ids)}]]&model=${model}&fields=["id","name","display_name"]&limit=${ids.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_RC_INFO, GET_SURVEY_RC_INFO_SUCCESS, GET_SURVEY_RC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = SurveyModule.surveyApiField;
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["title","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_LIST_INFO, GET_SURVEY_LIST_INFO_SUCCESS, GET_SURVEY_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_EXPORT_LIST_INFO, GET_SURVEY_EXPORT_LIST_INFO_SUCCESS, GET_SURVEY_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyCountInfo(company, model, customFilters, globalFilter, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["title","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SURVEY_COUNT_INFO, GET_SURVEY_COUNT_INFO_SUCCESS, GET_SURVEY_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_SURVEY_DETAILS_INFO, GET_SURVEY_DETAILS_INFO_SUCCESS, GET_SURVEY_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSurveyDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      // endpoint: 'dashboard_data?name=Survey Dashboard',
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Survey Dashboard`,

      types: [GET_SV_DASHBOARD_INFO, GET_SV_DASHBOARD_INFO_SUCCESS, GET_SV_DASHBOARD_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function surveyStateChangeInfo(id, state, modelName, contex) {
  let payload = {};
  if (contex) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, context: contex,
    };
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_SURVEY_STATE_CHANGE_INFO, GET_SURVEY_STATE_CHANGE_INFO_SUCCESS, GET_SURVEY_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function createSurveyInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SURVEY_INFO, CREATE_SURVEY_INFO_SUCCESS, CREATE_SURVEY_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getStatusInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","color_code"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ST_INFO, GET_ST_INFO_SUCCESS, GET_ST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEscalationPolicyInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","id"]&limit=20&offset=0&order=id DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EP_INFO, GET_EP_INFO_SUCCESS, GET_EP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStatusGroupsInfo(company, model) {
  const payload = `domain=[["stage_id","!=",false]]&model=${model}&fields=["stage_id"]&groupby=["stage_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ST_GROUP_INFO, GET_ST_GROUP_INFO_SUCCESS, GET_ST_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyQuestionsInfo(model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["question","ilike","${keyword}"],`;
  }
  payload = `${payload}["type","=","simple_choice"], ["id", "!=", false]]&model=${model}&fields=[]&limit=20&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SQ_GROUP_INFO, GET_SQ_GROUP_INFO_SUCCESS, GET_SQ_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyQuestionsGroupsInfo(model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]&limit=20&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_QTN_GROUP_INFO, GET_SURVEY_QTN_GROUP_INFO_SUCCESS, GET_SURVEY_QTN_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyOptionsInfo(model, ids) {
  let payload = 'domain=[';

  if (ids) {
    payload = `${payload}["id","in",[${ids}]],`;
  }
  payload = `${payload}["id", "!=", false]]&model=${model}&fields=[]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SL_GROUP_INFO, GET_SL_GROUP_INFO_SUCCESS, GET_SL_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateSurveyInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_SURVEY_INFO, UPDATE_SURVEY_INFO_SUCCESS, UPDATE_SURVEY_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSurveyPagesInfo(model, id) {
  let payload = 'domain=[';

  if (id) {
    payload = `${payload}["id","in",[${id}]]`;
  }

  payload = `${payload}]&model=${model}&fields=["title","question_ids"]&order=create_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_QUESTION_INFO, GET_QUESTION_INFO_SUCCESS, GET_QUESTION_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAnswersReportInfo(id, start, end) {
  return {
    [CALL_API]: {
      endpoint: `getSurvey/result?uuid=${id}&start_date=${start}&end_date=${end}`,
      types: [GET_SURVEY_ANSWERS_INFO, GET_SURVEY_ANSWERS_INFO_SUCCESS, GET_SURVEY_ANSWERS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSurveyQuestionIdsInfo(model, id) {
  let payload = 'domain=[';

  if (id) {
    payload = `${payload}["id","in",[${id}]]`;
  }

  payload = `${payload}]&model=${model}&fields=["column_nb","comment_count_as_answer","comments_allowed","has_attachment","helper_text","applicable_score","procedure","risk_level","question_group_id","comments_message","constr_error_msg","constr_mandatory","description","display_mode","is_enable_condition","matrix_subtype","validation_error_msg","validation_length_max","validation_email","validation_length_min","validation_max_date","validation_min_date","validation_max_float_value","validation_min_float_value","validation_required","based_on_ids","id","labels_ids","labels_ids_2","applicable_standard_ids","page_id","parent_id","question","type"]&order=create_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_QUESTION_IDS_INFO, GET_QUESTION_IDS_INFO_SUCCESS, GET_QUESTION_IDS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getChoiceOptionsInfo(model, ids) {
  let payload = 'domain=[';

  if (ids && ids.length > 0) {
    payload = `${payload}["id","in",[${ids}]],`;
  }
  payload = `${payload}["id", "!=", false]]&model=${model}&fields=["id","favicon","color","emoji","value","sequence","quizz_mark","is_remark_required","is_ncr","is_not_acceptable"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHOICE_INFO, GET_CHOICE_INFO_SUCCESS, GET_CHOICE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMatrixOptionsInfo(model, ids) {
  let payload = 'domain=[';

  if (ids && ids.length > 0) {
    payload = `${payload}["id","in",[${ids}]],`;
  }
  payload = `${payload}["id", "!=", false]]&model=${model}&fields=["id","value","sequence","quizz_mark"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MATRIX_INFO, GET_MATRIX_INFO_SUCCESS, GET_MATRIX_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getDeleteAnswersInfo(ids, modelName) {
  const payload = {
    ids: `[${ids}]`, model: modelName,
  };
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_ANSWERS_INFO, DELETE_ANSWERS_INFO_SUCCESS, DELETE_ANSWERS_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getAnswersDetailsInfo(company, model, id, start, end, offset, searchValue) {
  /* let payload = `domain=[["company_id","in",[${company}]],["survey_id","=",${id}],["state","=","done"]`;
   if (start && end) {
     payload = `${payload},["date_create",">=","${start}"],["date_create","<=","${end}"]`;
   }
   payload = `${payload}]&model=${model}&fields=["reviwer_name","quizz_score"]&groupby=["reviwer_name"]`;
   return {
     [CALL_API]: {
       endpoint: `read_group?${payload}`,
       types: [GET_ANSWER_DETAILS_INFO, GET_ANSWER_DETAILS_INFO_SUCCESS, GET_ANSWER_DETAILS_INFO_FAILURE],
       method: 'GET',
       payload,
     },
   }; */
  const fields = '["id","reviwer_mobile","reviwer_name","email","employee_code","quizz_score","date_create",("partner_id", ["id", "display_name", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "path_name"]),("block_id", ["id", "space_name"]),("floor_id", ["id", "space_name"])]),("location_id", ["id", "path_name",("block_id", ["id", "space_name"]),("floor_id", ["id", "space_name"])]),["user_input_line_ids", ["id", ("page_id", ["id", "title"]),("question_id", ["id", "question", "sequence"]), "date_create", "answer_type", "value_text", "value_free_text", "value_number", "value_date", ("value_suggested", ["id", "value"])]]]';
  let payload = `domain=[["company_id","in",[${company}]],["survey_id","=",${id}]`;
  if (start && end) {
    payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
  }
  if (searchValue) {
    payload = `${payload},"|","|",["reviwer_name","ilike","${searchValue}"],["reviwer_mobile","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
  }
  payload = `${payload},["state","=","done"]]&model=${model}&fields=${fields}&offset=${offset}&limit=1&order=id DESC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ANSWER_DETAILS_INFO, GET_ANSWER_DETAILS_INFO_SUCCESS, GET_ANSWER_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAnswersDetailsCountInfo(company, model, id, start, end, searchValue) {
  let payload = `domain=[["company_id","in",[${company}]],["survey_id","=",${id}]`;
  if (start && end) {
    payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
  }
  if (searchValue) {
    payload = `${payload},"|","|",["reviwer_name","ilike","${searchValue}"],["reviwer_mobile","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
  }
  payload = `${payload},["state","=","done"]]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ANSWER_DETAILS_COUNT_INFO, GET_ANSWER_DETAILS_COUNT_INFO_SUCCESS, GET_ANSWER_DETAILS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAnswersListInfo(company, model, id, name, start, end) {
  // eslint-disable-next-line max-len
  const fields = '["id","reviwer_mobile","reviwer_name","email","employee_code","quizz_score","date_create",("partner_id", ["id", "display_name", "name"]),["user_input_line_ids", ["id", ("question_id", ["id", "question"]), "date_create", "answer_type", "value_text", "value_free_text", "value_number", "value_date", ("value_suggested", ["id", "value"])]]]';
  let payload = `domain=[["company_id","in",[${company}]],["survey_id","=",${id}]`;
  if (!name) {
    payload = `${payload},["id","=",false]`;
  } else {
    payload = `${payload},["id","=",${name}]`;
  }
  if (start && end) {
    payload = `${payload},["date_create",">=","${start}"],["date_create","<=","${end}"]`;
  }
  payload = `${payload},["state","=","done"]]&fields=${fields}&offset=0&limit=1000`;
  return {
    [CALL_API]: {
      endpoint: `getSurvey/sorted/answers?${payload}`,
      types: [GET_ANSWER_LIST_DETAILS_INFO, GET_ANSWER_LIST_DETAILS_INFO_SUCCESS, GET_ANSWER_LIST_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getAnswersListInfoPDF(company, model, id, name, start, end, limit, searchValue) {
  // eslint-disable-next-line max-len
  const fields = '["id","reviwer_mobile","reviwer_name","email","employee_code","quizz_score","date_create",("partner_id", ["id", "display_name", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "path_name"]),("block_id", ["id", "space_name"]),("floor_id", ["id", "space_name"])]),("location_id", ["id", "path_name",("block_id", ["id", "space_name"]),("floor_id", ["id", "space_name"])]),["user_input_line_ids", ["id", ("page_id", ["id", "title"]),("question_id", ["id", "question", "sequence"]), "date_create", "answer_type", "value_text", "value_free_text", "value_number", "value_date", ("value_suggested", ["id", "value"])]]]';
  let payload = `domain=[["company_id","in",[${company}]],["survey_id","=",${id}]`;
  if (start && end) {
    payload = `${payload},["create_date",">=","${start}"],["create_date","<=","${end}"]`;
  }
  // if (!name) {
  // payload = `${payload},["reviwer_name","=",false]`;
  // } else {
  // payload = `${payload},["reviwer_name","in",${JSON.stringify(name)}]`;
  // }
  if (searchValue) {
    payload = `${payload},"|","|",["reviwer_name","ilike","${searchValue}"],["reviwer_mobile","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
  }
  payload = `${payload},["state","=","done"]]&fields=${fields}&offset=0&limit=${limit}`;
  return {
    [CALL_API]: {
      endpoint: `getSurvey/sorted/answers?${payload}`,
      types: [GET_ANSWER_LIST_EXPORT_INFO, GET_ANSWER_LIST_DETAILS_EXPORT_SUCCESS, GET_ANSWER_LIST_DETAILS_EXPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSurveyDomainsInfo(model, ids) {
  const payload = `domain=[["id","in",${JSON.stringify(ids)}]]&model=${model}&fields=["id","name"]&limit=${ids.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SURVEY_DOMAINS_INFO, GET_SURVEY_DOMAINS_INFO_SUCCESS, GET_SURVEY_DOMAINS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditStandardsInfo(company, model) {
  const payload = `domain=[${company}]&model=${model}&fields=["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_AUDIT_STANDARDS_INFO, GET_AUDIT_STANDARDS_INFO_SUCCESS, GET_AUDIT_STANDARDS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
