import { CALL_API } from '../../middleware/api';

export const GET_CONFIGURATION = 'GET_CONFIGURATION';
export const GET_CONFIGURATION_SUCCESS = 'GET_CONFIGURATION_SUCCESS';
export const GET_CONFIGURATION_FAILURE = 'GET_CONFIGURATION_FAILURE';
export const GET_COVID_RESOURSES = 'GET_COVID_RESOURSES';
export const GET_COVID_RESOURSES_SUCCESS = 'GET_COVID_RESOURSES_SUCCESS';
export const GET_COVID_RESOURSES_FAILURE = 'GET_COVID_RESOURSES_FAILURE';

export function getConfiguration() {
  return {
    [CALL_API]: {
      endpoint: 'configuration',
      types: [GET_CONFIGURATION, GET_CONFIGURATION_SUCCESS, GET_CONFIGURATION_FAILURE],
      method: 'GET',
    },
  };
}

export function getCovidResources() {
  return {
    [CALL_API]: {
      endpoint: 'resource/list',
      types: [GET_COVID_RESOURSES, GET_COVID_RESOURSES_SUCCESS, GET_COVID_RESOURSES_FAILURE],
      method: 'GET',
    },
  };
}
