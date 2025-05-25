import { getEmployeeList, checkAvailabilityOfWorkStation, setSpaceId } from '../../actions';

export default function getAllEmployees(keyword) {
  return (dispatch) => {
    dispatch(getEmployeeList(keyword));
  };
}

export function checkAvailabilityForWorkStation(availableObj) {
  return (dispatch) => {
    dispatch(checkAvailabilityOfWorkStation(availableObj));
    dispatch(setSpaceId(availableObj.space_id));
  };
}
