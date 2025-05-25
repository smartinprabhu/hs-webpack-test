import {
  PRE_SCREENING_PROCESS, PRE_SCREENING_PROCESS_SUCCESS, PRE_SCREENING_PROCESS_ERROR,
  GET_QUESTIONARY_DATA, GET_QUESTIONARY_DATA_SUCCESS, GET_QUESTIONARY_DATA_ERROR,
} from './actions';

const initialState = {
  questionarieData: {},
  preScreeningProcess: {},
};

// eslint-disable-next-line default-param-last
function preScreeningProcessReducer(state = initialState, action) {
  // eslint-disable-next-line no-param-reassign
  state.preScreeningProcess = {};
  switch (action.type) {
    case PRE_SCREENING_PROCESS:
      return {
        ...state,
        preScreeningProcess: (state.preScreeningProcess, { loading: true }),
      };
    case PRE_SCREENING_PROCESS_SUCCESS:
      return {
        ...state,
        preScreeningProcess: (state.preScreeningProcess,
        { loading: false, data: action.payload.data, err: {} }),
      };
    case PRE_SCREENING_PROCESS_ERROR:
      return {
        ...state,
        preScreeningProcess: (state.preScreeningProcess,
        { loading: false, err: action.error.data, data: {} }),
      };
    case GET_QUESTIONARY_DATA:
      return {
        ...state,
        questionarieData: (state.questionarieData, { loading: true }),
      };
    case GET_QUESTIONARY_DATA_SUCCESS:
      return {
        ...state,
        questionarieData: (state.questionarieData,
        { loading: false, data: action.payload.data, err: {} }),
      };
    case GET_QUESTIONARY_DATA_ERROR:
      return {
        ...state,
        questionarieData: (state.questionarieData,
        { loading: false, err: action.payload, data: {} }),
      };
    default:
      return state;
  }
}

export default preScreeningProcessReducer;
