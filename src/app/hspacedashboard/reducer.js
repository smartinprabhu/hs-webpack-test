import {
  GET_CONFIGURATION,
  GET_CONFIGURATION_SUCCESS,
  GET_COVID_RESOURSES,
  GET_CONFIGURATION_FAILURE,
  GET_COVID_RESOURSES_SUCCESS,
  GET_COVID_RESOURSES_FAILURE,
} from './actions';

const initialState = {
  configObj: {},
  covidResources: {},
};

// eslint-disable-next-line default-param-last
function configReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONFIGURATION:
      return {
        ...state,
        configObj: (state.configObj, { loading: true, err: null }),
      };
    case GET_CONFIGURATION_SUCCESS:
      return {
        ...state,
        configObj: (state.configObj, { loading: false, err: null, data: action.payload.data }),
      };
    case GET_CONFIGURATION_FAILURE:
      return {
        ...state,
        configObj: (state.configObj, { loading: false, err: action.error.data, data: null }),
      };
    case GET_COVID_RESOURSES:
      return {
        ...state,
        covidResources: (state.covidResources, { loading: true, err: null }),
      };
    case GET_COVID_RESOURSES_SUCCESS:
      return {
        ...state,
        covidResources: (state.covidResources,
        { loading: false, err: null, data: action.payload.data }),
      };
    case GET_COVID_RESOURSES_FAILURE:
      return {
        ...state,
        covidResources: (state.covidResources,
        { loading: false, data: null, err: action.error.data }),
      };
    default:
      return state;
  }
}

export default configReducer;
