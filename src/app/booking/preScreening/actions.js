import { CALL_API } from '../../../middleware/api';
import AuthService from '../../util/authService';

export const PRE_SCREENING_PROCESS = 'PRE_SCREENING_PROCESS';
export const PRE_SCREENING_PROCESS_SUCCESS = 'PRE_SCREENING_PROCESS_SUCCESS';
export const PRE_SCREENING_PROCESS_ERROR = 'PRE_SCREENING_PROCESS_ERROR';

export const GET_QUESTIONARY_DATA = 'GET_QUESTIONARY_DATA';
export const GET_QUESTIONARY_DATA_SUCCESS = 'GET_QUESTIONARY_DATA_SUCCESS';
export const GET_QUESTIONARY_DATA_ERROR = 'GET_QUESTIONARY_DATA_ERROR';

export function questionaireDataGetCall(checkListId) {
  return {
    [CALL_API]: {
      endpoint: `prescreen/questionnaire/?ids=[${checkListId}]`,
      types: [GET_QUESTIONARY_DATA, GET_QUESTIONARY_DATA_SUCCESS, GET_QUESTIONARY_DATA_ERROR],
      method: 'GET',
      payload: AuthService.getAccessToken,
    },
  };
}

export function preScreeningPostCall(data) {
  return {
    [CALL_API]: {
      endpoint: 'prescreen/questionnaire/response/create',
      types: [PRE_SCREENING_PROCESS, PRE_SCREENING_PROCESS_SUCCESS, PRE_SCREENING_PROCESS_ERROR],
      method: 'POST',
      payload: { values: data },
    },
  };
}
