const initialState = {
  userInfo: {},
  userRoles: {},
  updateImage: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_USER_INFO':
      return {
        ...state,
        userInfo: (state.userInfo, { loading: true }),
      };
    case 'GET_USER_INFO_SUCCESS':
      return {
        ...state,
        userInfo: (state.userInfo, { loading: false, data: action.payload.data }),
        loading: false,
      };
    case 'GET_USER_INFO_FAILURE':
      return {
        ...state,
        userInfo: (state.userInfo, { loading: false, err: action.error }),
        loading: false,
      };
    case 'UPDATE_USER_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        userInfo: (state.userInfo, { loading: false, data: action.payload.data }),
        loading: false,
      };
    case 'GET_USER_ACCESS':
      return {
        ...state,
        userRoles: (state.userRoles, { loading: true, data: null, err: null }),
      };
    case 'GET_USER_ACCESS_SUCCESS':
      return {
        ...state,
        userRoles: (state.userRoles, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_USER_ACCESS_FAILURE':
      return {
        ...state,
        userRoles: (state.userRoles, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_USER_IMAGE':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_USER_IMAGE_SUCCESS':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_USER_IMAGE_FAILURE':
      return {
        ...state,
        updateImage: (state.updateImage, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
