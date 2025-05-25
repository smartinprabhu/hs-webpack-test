const initialState = {
  surveyFilters: {},
  surveyListInfo: {},
  surveyExport: {},
  surveyRows: {},
  surveyCount: null,
  surveyCountErr: null,
  surveyCountLoading: false,
  surveyDetails: {},
  surveyDashboard: {},
  stateChangeInfo: {},
  addSurveyInfo: {},
  surveyStatus: {},
  statusGroupInfo: {},
  surveyQuestionInfo: {},
  surveyOptionInfo: {},
  choiceSelected: {},
  matrixSelected: {},
  questionsInfo: {},
  pagesInfo: {},
  pageData: {},
  surveyUpdateInfo: {},
  pageQuestionList: {},
  surveyAnswerReport: {},
  questionList: {},
  choiceOptionInfo: {},
  matrixOptionInfo: {},
  deleteAnsweresInfo: {},
  answerDetails: {},
  answersListInfo: {},
  currentTab: 'This month',
  answersListExport: {},
  answersListCount: {},
  savedViewId: null,
  surveyLocations: {},
  surveyTenants: {},
  surveyRecipients: {},
  surveyDomains: {},
  surveyEpolicy: {},
  surveyQtnGroups: {},
  auditStandards: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_SURVEY_COUNT_INFO':
      return {
        ...state,
        surveyCountLoading: true,
      };
    case 'GET_SURVEY_COUNT_INFO_SUCCESS':
      return {
        ...state,
        surveyCount: (state.surveyCount, action.payload),
        surveyCountLoading: false,
      };
    case 'GET_SURVEY_COUNT_INFO_FAILURE':
      return {
        ...state,
        surveyCountErr: (state.surveyCountErr, action.error),
        surveyCount: (state.surveyCount, false),
        surveyCountLoading: false,
      };
    case 'SURVEY_FILTERS':
      return {
        ...state,
        surveyFilters: (state.surveyFilters, action.payload),
      };
    case 'GET_SURVEY_LIST_INFO':
      return {
        ...state,
        surveyListInfo: (state.surveyListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_LIST_INFO_SUCCESS':
      return {
        ...state,
        surveyListInfo: (state.surveyListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_LIST_INFO_FAILURE':
      return {
        ...state,
        surveyListInfo: (state.surveyListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_EXPORT_LIST_INFO':
      return {
        ...state,
        surveyExport: (state.surveyExport, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        surveyExport: (state.surveyExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        surveyExport: (state.surveyExport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_SURVEYS':
      return {
        ...state,
        surveyRows: (state.surveyRows, action.payload),
      };
    case 'SAVE_VIEW_ID':
      return {
        ...state,
        savedViewId: (state.savedViewId, action.payload),
      };
    case 'GET_SURVEY_DETAILS_INFO':
      return {
        ...state,
        surveyDetails: (state.surveyDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        surveyDetails: (state.surveyDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_DETAILS_INFO_FAILURE':
      return {
        ...state,
        surveyDetails: (state.surveyDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SV_DASHBOARD_INFO':
      return {
        ...state,
        surveyDashboard: (state.surveyDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_SV_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        surveyDashboard: (state.surveyDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SV_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        surveyDashboard: (state.surveyDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_SURVEY_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_SURVEY_INFO':
      return {
        ...state,
        addSurveyInfo: (state.addSurveyInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SURVEY_INFO_SUCCESS':
      return {
        ...state,
        addSurveyInfo: (state.addSurveyInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SURVEY_INFO_FAILURE':
      return {
        ...state,
        addSurveyInfo: (state.addSurveyInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_SURVEY_INFO':
      return {
        ...state,
        addSurveyInfo: (state.addSurveyInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ST_INFO':
      return {
        ...state,
        surveyStatus: (state.surveyStatus, { loading: true, data: null, err: null }),
      };
    case 'GET_ST_INFO_SUCCESS':
      return {
        ...state,
        surveyStatus: (state.surveyStatus, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ST_INFO_FAILURE':
      return {
        ...state,
        surveyStatus: (state.surveyStatus, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EP_INFO':
      return {
        ...state,
        surveyEpolicy: (state.surveyEpolicy, { loading: true, data: null, err: null }),
      };
    case 'GET_EP_INFO_SUCCESS':
      return {
        ...state,
        surveyEpolicy: (state.surveyEpolicy, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EP_INFO_FAILURE':
      return {
        ...state,
        surveyEpolicy: (state.surveyEpolicy, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ST_GROUP_INFO':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ST_GROUP_INFO_SUCCESS':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ST_GROUP_INFO_FAILURE':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SQ_GROUP_INFO':
      return {
        ...state,
        surveyQuestionInfo: (state.surveyQuestionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SQ_GROUP_INFO_SUCCESS':
      return {
        ...state,
        surveyQuestionInfo: (state.surveyQuestionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SQ_GROUP_INFO_FAILURE':
      return {
        ...state,
        surveyQuestionInfo: (state.surveyQuestionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SL_GROUP_INFO':
      return {
        ...state,
        surveyOptionInfo: (state.surveyOptionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SL_GROUP_INFO_SUCCESS':
      return {
        ...state,
        surveyOptionInfo: (state.surveyOptionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SL_GROUP_INFO_FAILURE':
      return {
        ...state,
        surveyOptionInfo: (state.surveyOptionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_CHOICE_SELECTED':
      return {
        ...state,
        choiceSelected: (state.choiceSelected, action.payload),
      };
    case 'GET_ROWS_MATRIX_SELECTED':
      return {
        ...state,
        matrixSelected: (state.matrixSelected, action.payload),
      };
    case 'STORE_QUESTIONS':
      return {
        ...state,
        questionsInfo: (state.questionsInfo, action.payload),
      };
    case 'STORE_PAGES':
      return {
        ...state,
        pagesInfo: (state.pagesInfo, action.payload),
      };
    case 'STORE_PAGE_DATA':
      return {
        ...state,
        pageData: (state.pageData, action.payload),
      };
    case 'RESET_PAGE_DATA':
      return {
        ...state,
        pageData: (state.pageData, { loading: false, err: null, data: null }),
      };
    case 'RESET_STORE_QUESTIONS':
      return {
        ...state,
        questionsInfo: (state.questionsInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_STORE_PAGES':
      return {
        ...state,
        pagesInfo: (state.pagesInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_SURVEY_INFO':
      return {
        ...state,
        surveyUpdateInfo: (state.surveyUpdateInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SURVEY_INFO_SUCCESS':
      return {
        ...state,
        surveyUpdateInfo: (state.surveyUpdateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SURVEY_INFO_FAILURE':
      return {
        ...state,
        surveyUpdateInfo: (state.surveyUpdateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_SURVEY_INFO':
      return {
        ...state,
        surveyUpdateInfo: (state.surveyUpdateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_QUESTION_INFO':
      return {
        ...state,
        pageQuestionList: (state.pageQuestionList, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTION_INFO_SUCCESS':
      return {
        ...state,
        pageQuestionList: (state.pageQuestionList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUESTION_INFO_FAILURE':
      return {
        ...state,
        pageQuestionList: (state.pageQuestionList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_ANSWERS_INFO':
      return {
        ...state,
        surveyAnswerReport: (state.surveyAnswerReport, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_ANSWERS_INFO_SUCCESS':
      return {
        ...state,
        surveyAnswerReport: (state.surveyAnswerReport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_ANSWERS_INFO_FAILURE':
      return {
        ...state,
        surveyAnswerReport: (state.surveyAnswerReport, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SURVEY_ANSWERES':
      return {
        ...state,
        surveyAnswerReport: (state.surveyAnswerReport, { loading: false, data: null, err: null }),
      };
    case 'GET_QUESTION_IDS_INFO':
      return {
        ...state,
        questionList: (state.questionList, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTION_IDS_INFO_SUCCESS':
      return {
        ...state,
        questionList: (state.questionList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUESTION_IDS_INFO_FAILURE':
      return {
        ...state,
        questionList: (state.questionList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHOICE_INFO':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHOICE_INFO_SUCCESS':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHOICE_INFO_FAILURE':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MATRIX_INFO':
      return {
        ...state,
        matrixOptionInfo: (state.matrixOptionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MATRIX_INFO_SUCCESS':
      return {
        ...state,
        matrixOptionInfo: (state.matrixOptionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MATRIX_INFO_FAILURE':
      return {
        ...state,
        matrixOptionInfo: (state.matrixOptionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'DELETE_ANSWERS_INFO':
      return {
        ...state,
        deleteAnsweresInfo: (state.deleteAnsweresInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_ANSWERS_INFO_SUCCESS':
      return {
        ...state,
        deleteAnsweresInfo: (state.deleteAnsweresInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'DELETE_ANSWERS_INFO_FAILURE':
      return {
        ...state,
        deleteAnsweresInfo: (state.deleteAnsweresInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DELETE_ANSWERES':
      return {
        ...state,
        deleteAnsweresInfo: (state.deleteAnsweresInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_ANSWER_DETAILS_INFO':
      return {
        ...state,
        answerDetails: (state.answerDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_ANSWER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        answerDetails: (state.answerDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ANSWER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        answerDetails: (state.answerDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ANSWER_LIST_DETAILS_INFO':
      return {
        ...state,
        answersListInfo: (state.answersListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ANSWER_LIST_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        answersListInfo: (state.answersListInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_ANSWER_LIST_DETAILS_INFO_FAILURE':
      return {
        ...state,
        answersListInfo: (state.answersListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'ACTIVE_RESET':
      return {
        ...state,
        currentTab: (state.currentTab, action.payload),
      };
    case 'CLEAR_ANSWERS_DATA':
      return {
        ...state,
        answerDetails: (state.answerDetails, { loading: false, data: null, err: null }),

      };
    case 'CLEAR_EXPORT_ANSWERS':
      return {
        ...state,
        answersListExport: (state.answersListExport, { loading: false, data: null, err: null }),
      };
    case 'GET_ANSWER_LIST_EXPORT_INFO':
      return {
        ...state,
        answersListExport: (state.answersListExport, { loading: true, data: null, err: null }),
      };
    case 'GET_ANSWER_LIST_DETAILS_EXPORT_SUCCESS':
      return {
        ...state,
        answersListExport: (state.answersListExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ANSWER_LIST_DETAILS_EXPORT_FAILURE':
      return {
        ...state,
        answersListExport: (state.answersListExport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ANSWER_DETAILS_COUNT_INFO':
      return {
        ...state,
        answersListCount: (state.answersListCount, { loading: true, data: null, err: null }),
      };
    case 'GET_ANSWER_DETAILS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        answersListCount: (state.answersListCount, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_ANSWER_DETAILS_COUNT_INFO_FAILURE':
      return {
        ...state,
        answersListCount: (state.answersListCount, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_LOCATIONS_INFO':
      return {
        ...state,
        surveyLocations: (state.surveyLocations, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_LOCATIONS_INFO_SUCCESS':
      return {
        ...state,
        surveyLocations: (state.surveyLocations, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_LOCATIONS_INFO_FAILURE':
      return {
        ...state,
        surveyLocations: (state.surveyLocations, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_TENANTS_INFO':
      return {
        ...state,
        surveyTenants: (state.surveyTenants, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_TENANTS_INFO_SUCCESS':
      return {
        ...state,
        surveyTenants: (state.surveyTenants, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_TENANTS_INFO_FAILURE':
      return {
        ...state,
        surveyTenants: (state.surveyTenants, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_RC_INFO':
      return {
        ...state,
        surveyRecipients: (state.surveyRecipients, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_RC_INFO_SUCCESS':
      return {
        ...state,
        surveyRecipients: (state.surveyRecipients, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_RC_INFO_FAILURE':
      return {
        ...state,
        surveyRecipients: (state.surveyRecipients, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_DOMAINS_INFO':
      return {
        ...state,
        surveyDomains: (state.surveyDomains, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_DOMAINS_INFO_SUCCESS':
      return {
        ...state,
        surveyDomains: (state.surveyDomains, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_DOMAINS_INFO_FAILURE':
      return {
        ...state,
        surveyDomains: (state.surveyDomains, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SURVEY_QTN_GROUP_INFO':
      return {
        ...state,
        surveyQtnGroups: (state.surveyQtnGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_SURVEY_QTN_GROUP_INFO_SUCCESS':
      return {
        ...state,
        surveyQtnGroups: (state.surveyQtnGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SURVEY_QTN_GROUP_INFO_FAILURE':
      return {
        ...state,
        surveyQtnGroups: (state.surveyQtnGroups, { loading: false, err: action.error, data: null }),
      };
    case 'GET_AUDIT_STANDARDS_INFO':
      return {
        ...state,
        auditStandards: (state.auditStandards, { loading: true, data: null, err: null }),
      };
    case 'GET_AUDIT_STANDARDS_INFO_SUCCESS':
      return {
        ...state,
        auditStandards: (state.auditStandards, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AUDIT_STANDARDS_INFO_FAILURE':
      return {
        ...state,
        auditStandards: (state.auditStandards, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
