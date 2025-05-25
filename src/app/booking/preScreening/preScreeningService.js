import { questionaireDataGetCall, preScreeningPostCall } from './actions';

export function getQuestionaireData(checkListId) {
  return (dispatch) => {
    dispatch(questionaireDataGetCall(checkListId));
  };
}

export function saveProcessedPreScreening(data) {
  return (dispatch) => {
    dispatch(preScreeningPostCall(data));
  };
}
