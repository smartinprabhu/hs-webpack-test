import { getConfiguration, getCovidResources } from './actions';

export function getConfig() {
  return (dispatch) => {
    dispatch(getConfiguration());
  };
}

export function getCovidResourcesInfo() {
  return (dispatch) => {
    dispatch(getCovidResources());
  };
}
