import {
  CHECK_EMAIL, CHECK_EMAIL_SUCCESS, CHECK_EMAIL_FAILURE,
  REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE, RESET_REGISTRATION, SHOW_REGISTRATION,
} from './actions';

const initialState = {
  mailResponse: {},
  userRegistartionResponse: {},
  errorMessage: {},
  registerLoading: false,
  sessionToken: '',
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case CHECK_EMAIL:
      return {
        ...state,
        registerLoading: true,
      };

    case CHECK_EMAIL_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        mailResponse: action.payload.data,
        errorMessage: {},
        sessionToken: action.payload.data.session_token,
      };

    case CHECK_EMAIL_FAILURE:
      return {
        ...state,
        registerLoading: false,
        errorMessage: action.error.data,
      };

    case REGISTER_USER:
      return {
        ...state,
        registerLoading: true,
        errorMessage: {},
      };

    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        userRegistartionResponse: action.payload.data,
        errorMessage: {},
      };

    case REGISTER_USER_FAILURE:
      return {
        ...state,
        registerLoading: false,
        errorMessage: action.error.data,
        userRegistartionResponse: {},
      };

    case RESET_REGISTRATION:
      return {
        ...state,
        registerLoading: false,
        mailResponse: {},
        errorMessage: {},
      };

    case SHOW_REGISTRATION:
      return {
        ...state,
        registerLoading: false,
        userRegistartionResponse: {},
        errorMessage: {},
      };
    default: return {
      ...state,
    };
  }
}

export default reducer;
