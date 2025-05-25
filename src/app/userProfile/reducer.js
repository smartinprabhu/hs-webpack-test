/* eslint-disable semi */
const initialState = {
  updateImage: {},
  deleteGuestList: {},
  modalWindow: false,
  updateLangInfo: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case 'UPDATE_USER_IMAGE':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: true }),
        modalWindow: true,
      };
    case 'UPDATE_USER_IMAGE_SUCCESS':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: false, data: action.payload, err: null }),
        modalWindow: true,
      };
      case 'DELETE_GUEST':
      return {
        ...state,
        deleteGuestList: (state.deleteGuestList, { loading: true, err: undefined, data: undefined }),
      };
    case 'DELETE_GUEST_SUCCESS':
      return {
        ...state,
        deleteGuestList: (state.deleteGuestList, { loading: false, err: undefined, data: action.payload.data }),
      };
    case 'DELETE_GUEST_FAILURE':
      return {
        ...state,
        deleteGuestList: (state.deleteGuestList, { loading: false, err: action.error.data, data: undefined }),
      };
    case 'RESET_DELETE_GUEST': {
      return {
        ...state,
        deleteGuestList: (state.deleteGuestList, { loading: false, data: null, err: null }),
      };
    }
      case 'GET_GUEST_LIST':
        return {
          ...state,
          guestListInfo: (state.guestListInfo, { loading: true, err: undefined, data: undefined }),
        };
      case 'GET_GUEST_LIST_SUCCESS':
        return {
          ...state,
          guestListInfo: (state.guestListInfo, { loading: false, err: undefined, data: action.payload.data }),
        };
      case 'GET_GUEST_LIST_FAILURE':
        return {
          ...state,
          guestListInfo: (state.guestListInfo, { loading: false, err: action.error.data, data: undefined }),
        };
    case 'UPDATE_USER_IMAGE_FAILURE':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: false, err: action.error, data: null }),
        modalWindow: true,
      };
    case 'RESET_USER_PROFILE': {
      return {
        ...state,
        updateImage: {},
      };
    }
    case 'OPEN_MODAL_WINDOW': {
      return {
        ...state,
        modalWindow: true,
      };
    }
    case 'CLOSE_MODAL_WINDOW': {
      return {
        ...state,
        modalWindow: false,
      };
    }
    case 'RESET_DATA': {
      return {
        ...state,
        updateImage: (state.updateImage, { loading: false, data: null, err: null }),
      };
    }
    case 'UPDATE_LANG_USER':
      return {
        ...state,
        updateLangInfo: (state.updateLangInfo, { loading: true }),
        modalWindow: true,
      };
    case 'UPDATE_LANG_USER_SUCCESS':
      return {
        ...state,
        updateLangInfo: (state.updateLangInfo, { loading: false, data: action.payload, err: null }),
        modalWindow: true,
      };
    case 'UPDATE_LANG_USER_FAILURE':
      return {
        ...state,
        updateLangInfo: (state.updateLangInfo, { loading: false, err: action.error, data: null }),
        modalWindow: true,
      };
    case 'RESET_LANG_DATA': {
      return {
        ...state,
        updateLangInfo: (state.updateLangInfo, { loading: false, data: null, err: null }),
      };
    }
    default:
      return state;
  }
}

export default reducer;
