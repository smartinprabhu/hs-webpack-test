import {
  getSurveyListInfo, getSurveyCountInfo, getDeleteAnswersInfo, getAnswersListInfo,
  getSurveyListExportInfo, getSurveyDetails, getSurveyDashboardInfo, surveyStateChangeInfo, getAnswersReportInfo,
  createSurveyInfo, getStatusInfo, getStatusGroupsInfo, getSurveyQuestionsInfo, getSurveyOptionsInfo, updateSurveyInfo, getSurveyLocationsInfo,
  getSurveyPagesInfo, getSurveyQuestionIdsInfo, getAuditStandardsInfo, getSurveyQuestionsGroupsInfo, getSurveyTenantsInfo, getSurveyDomainsInfo, getAnswersDetailsCountInfo, getChoiceOptionsInfo, getMatrixOptionsInfo, getAnswersDetailsInfo, getAnswersListInfoPDF, getSurveyRecipientsInfo, getEscalationPolicyInfo,
} from './actions';

export const SURVEY_FILTERS = 'SURVEY_FILTERS';
export const GET_ROWS_SURVEYS = 'GET_ROWS_SURVEYS';
export const GET_SURVEY_STATE_RESET_INFO = 'GET_SURVEY_STATE_RESET_INFO';
export const RESET_ADD_SURVEY_INFO = 'RESET_ADD_SURVEY_INFO';
export const GET_ROWS_CHOICE_SELECTED = 'GET_ROWS_CHOICE_SELECTED';
export const GET_ROWS_MATRIX_SELECTED = 'GET_ROWS_MATRIX_SELECTED';
export const STORE_QUESTIONS = 'STORE_QUESTIONS';
export const STORE_PAGES = 'STORE_PAGES';
export const STORE_PAGE_DATA = 'STORE_PAGE_DATA';
export const RESET_STORE_QUESTIONS = 'RESET_STORE_QUESTIONS';
export const RESET_STORE_PAGES = 'RESET_STORE_PAGES';
export const RESET_UPDATE_SURVEY_INFO = 'RESET_UPDATE_SURVEY_INFO';
export const RESET_DELETE_ANSWERES = 'RESET_DELETE_ANSWERES';
export const ACTIVE_RESET = 'ACTIVE_RESET';
export const CLEAR_ANSWERS_DATA = 'CLEAR_ANSWERS_DATA';
export const CLEAR_EXPORT_ANSWERS = 'CLEAR_EXPORT_ANSWERS';
export const RESET_PAGE_DATA = 'RESET_PAGE_DATA';
export const RESET_SURVEY_ANSWERES = 'RESET_SURVEY_ANSWERES';

export function getSurveyLocations(modal, ids) {
  return (dispatch) => {
    dispatch(getSurveyLocationsInfo(modal, ids));
  };
}

export function getSurveyTenants(model, ids) {
  return (dispatch) => {
    dispatch(getSurveyTenantsInfo(model, ids));
  };
}

export function getSurveyRecipients(model, ids) {
  return (dispatch) => {
    dispatch(getSurveyRecipientsInfo(model, ids));
  };
}

export function getSurveyList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getSurveyListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getSurveyListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getSurveyListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getSurveyCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getSurveyCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getSurveyFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: SURVEY_FILTERS,
    payload: result,
  };
}

export function getSurveyRows(payload) {
  return {
    type: GET_ROWS_SURVEYS,
    payload,
  };
}

export function getSurveyDetail(id, modelName) {
  return (dispatch) => {
    dispatch(getSurveyDetails(id, modelName));
  };
}

export function getSurveyDashboard(start, end) {
  return (dispatch) => {
    dispatch(getSurveyDashboardInfo(start, end));
  };
}

export function surveyStateChange(id, state, model, contex) {
  return (dispatch) => {
    dispatch(surveyStateChangeInfo(id, state, model, contex));
  };
}

export function resetSurveyState(result) {
  return {
    type: GET_SURVEY_STATE_RESET_INFO,
    payload: result,
  };
}

export function createSurvey(model, payload) {
  return (dispatch) => {
    dispatch(createSurveyInfo(model, payload));
  };
}

export function resetAddSurvey(result) {
  return {
    type: RESET_ADD_SURVEY_INFO,
    payload: result,
  };
}

export function getStatus(company, model, keyword) {
  return (dispatch) => {
    dispatch(getStatusInfo(company, model, keyword));
  };
}

export function getEscalationPolicy(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEscalationPolicyInfo(company, model, keyword));
  };
}

export function getStatusGroups(company, model) {
  return (dispatch) => {
    dispatch(getStatusGroupsInfo(company, model));
  };
}

export function getSurveyQuestions(model, keyword) {
  return (dispatch) => {
    dispatch(getSurveyQuestionsInfo(model, keyword));
  };
}

export function getSurveyQuestionsGroups(model, keyword) {
  return (dispatch) => {
    dispatch(getSurveyQuestionsGroupsInfo(model, keyword));
  };
}


export function getSurveyOptions(model, ids) {
  return (dispatch) => {
    dispatch(getSurveyOptionsInfo(model, ids));
  };
}

export function getChoiceData(result) {
  return {
    type: GET_ROWS_CHOICE_SELECTED,
    payload: result,
  };
}

export function getMatrixData(result) {
  return {
    type: GET_ROWS_MATRIX_SELECTED,
    payload: result,
  };
}

export function storeQuestions(payload) {
  const result = { data: payload };
  return {
    type: STORE_QUESTIONS,
    payload: result,
  };
}

export function storePages(payload) {
  const result = { data: payload };
  return {
    type: STORE_PAGES,
    payload: result,
  };
}

export function setPageData(payload) {
  return {
    type: STORE_PAGE_DATA,
    payload,
  };
}

export function resetPageData(result) {
  return {
    type: RESET_PAGE_DATA,
    payload: result,
  };
}

export function resetSurveyAnswers(result) {
  return {
    type: RESET_SURVEY_ANSWERES,
    payload: result,
  };
}

export function resetStoreQuestions(result) {
  return {
    type: RESET_STORE_QUESTIONS,
    payload: result,
  };
}

export function resetStorePages(result) {
  return {
    type: RESET_STORE_PAGES,
    payload: result,
  };
}

export function updateSurvey(id, payload, model) {
  return (dispatch) => {
    dispatch(updateSurveyInfo(id, payload, model));
  };
}

export function resetUpdateSurvey(result) {
  return {
    type: RESET_UPDATE_SURVEY_INFO,
    payload: result,
  };
}

export function getSurveyPages(model, id) {
  return (dispatch) => {
    dispatch(getSurveyPagesInfo(model, id));
  };
}

export function getAnswersReport(id, start, end) {
  return (dispatch) => {
    dispatch(getAnswersReportInfo(id, start, end));
  };
}

export function getSurveyQuestionIds(model, id) {
  return (dispatch) => {
    dispatch(getSurveyQuestionIdsInfo(model, id));
  };
}

export function getChoiceOptions(model, ids) {
  return (dispatch) => {
    dispatch(getChoiceOptionsInfo(model, ids));
  };
}

export function getMatrixOptions(model, ids) {
  return (dispatch) => {
    dispatch(getMatrixOptionsInfo(model, ids));
  };
}

export function getDeleteAnswers(ids, model) {
  return (dispatch) => {
    dispatch(getDeleteAnswersInfo(ids, model));
  };
}

export function resetDeleteAnswers(result) {
  return {
    type: RESET_DELETE_ANSWERES,
    payload: result,
  };
}

export function getAnswersDetails(company, model, id, start, end, offset, searchValue) {
  return (dispatch) => {
    dispatch(getAnswersDetailsInfo(company, model, id, start, end, offset, searchValue));
  };
}

export function getAnswersList(company, model, id, name, start, end) {
  return (dispatch) => {
    dispatch(getAnswersListInfo(company, model, id, name, start, end));
  };
}

export function clearExportAnswersData(payload) {
  const result = payload;
  return {
    type: CLEAR_EXPORT_ANSWERS,
    payload: result,
  };
}

export function clearAnswersData(payload) {
  const result = payload;
  return {
    type: CLEAR_ANSWERS_DATA,
    payload: result,
  };
}

export function setActive(payload) {
  const result = payload;
  return {
    type: ACTIVE_RESET,
    payload: result,
  };
}

export function getAnswersListInPDF(company, model, id, name, start, end, limit, searchValue) {
  return (dispatch) => {
    dispatch(getAnswersListInfoPDF(company, model, id, name, start, end, limit, searchValue));
  };
}

export function getAnswersDetailsCount(company, model, id, start, end, searchValue) {
  return (dispatch) => {
    dispatch(getAnswersDetailsCountInfo(company, model, id, start, end, searchValue));
  };
}

export function getSurveyDomains(modal, ids) {
  return (dispatch) => {
    dispatch(getSurveyDomainsInfo(modal, ids));
  };
}

export function getAuditStandards(company, model) {
  return (dispatch) => {
    dispatch(getAuditStandardsInfo(company, model));
  };
}
