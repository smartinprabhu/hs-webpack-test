import {
  CLEAR_RESET_PASSWORD_DATA, SHOW_RESET_PASSWORD,
} from './action';

const initialState = {
  checkResetPasswordLinkInfo: {},
  passwordPrivacyPolicyInfo: {},
  resetPasswordInfo: {},
  resetPasswordLinkInfo: {},
  session: null,
};
function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case 'RESET_PASSWORD':
      return {
        ...state,
        resetPasswordInfo: (state.resetPasswordInfo, { loading: true })
      };
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        resetPasswordInfo: (state.resetPasswordInfo, { loading: false, data: action.payload.data })
      };
    case 'RESET_PASSWORD_FAILURE':
      return {
        ...state,
        resetPasswordInfo: (state.resetPasswordInfo, { loading: false, err: action.error.data })
      };
    case 'GET_PASSWORD_POLICY':
      return {
        ...state,
        passwordPrivacyPolicyInfo: (state.passwordPrivacyPolicyInfo, { loading: true })
      };
    case 'GET_PASSWORD_POLICY_SUCCESS':
      return {
        ...state,
        passwordPrivacyPolicyInfo: (state.passwordPrivacyPolicyInfo, { loading: false, data: action.payload })
      };
    case 'GET_PASSWORD_POLICY_FAILURE':
      return {
        ...state,
        passwordPrivacyPolicyInfo: (state.passwordPrivacyPolicyInfo, { loading: false, err: action.error.data })
      };
    case 'RESET_PASSWORD_LINK':
      return {
        ...state,
        resetPasswordLinkInfo: (state.resetPasswordLinkInfo, { loading: true })
      };
    case 'RESET_PASSWORD_LINK_SUCCESS':
      return {
        ...state,
        resetPasswordLinkInfo:
          (state.resetPasswordLinkInfo, { loading: false, data: action.payload.data })
      };
    case 'RESET_PASSWORD_LINK_FAILURE':
      return {
        ...state,
        resetPasswordLinkInfo: (state.resetPasswordLinkInfo, { loading: false, err: action.error.data })
      };
    case 'CHECK_RESET_PASSWORD_LINK':
      return {
        ...state,
        checkResetPasswordLinkInfo: (state.checkResetPasswordLinkInfo, { loading: true })
      };
    case 'CHECK_RESET_PASSWORD_LINK_SUCCESS':
      return {
        ...state,
        checkResetPasswordLinkInfo: (state.checkResetPasswordLinkInfo, { loading: false, data: action.status })
      };
    case 'CHECK_RESET_PASSWORD_LINK_FAILURE':
      return {
        ...state,
        checkResetPasswordLinkInfo: (state.checkResetPasswordLinkInfo, { loading: false, err: action.error.data })
      };
    case 'SAVE_SESSIONUUID':
      return {
        ...state,
        session: action.payload
      };

    case CLEAR_RESET_PASSWORD_DATA:
      return {
        ...state,
        resetPasswordLinkInfo: (state.resetPasswordLinkInfo, { loading: false, data: null, err: null })
      };

    case SHOW_RESET_PASSWORD:
      return {
        ...state,
        resetPasswordInfo: (state.resetPasswordInfo, {
          loading: false, data: null, err: null, passwordPrivacyPolicyInfo: null
        })
      };

    default: return state;
  }
}
export default reducer;
