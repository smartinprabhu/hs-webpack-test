import {
  getImportantContacts, setBookingInfo, getBookingList, cancelBooking, getGuestListInfo, saveHostInfo, clearSaveDataToSpaceView, saveDataToSpaceView,
  getWorkStationsList, getShiftsList, saveBooking, saveGroupBooking, saveGuestInfo, addGuestInfo, saveRemovedNodeWithEmployee,
  clearDeleteError, resetBookingAction, getFloorViewInfo, getWorkStationCategories, clearBookingObj, clearMultipleDaysSpacesInfo,
  getFloorSpacesById, getMultidaysShiftList, getMultidaysAvailabilitySpaces, setSpaceId, saveMultidaysBooking,
  saveNewGuest, resetGuestData, getSpacesCapBooking, clearCapLimitObj, saveErrorMessage, saveCalendarDate, saveSetRefresh,
  updateGuestInfo, clearMultidaysShiftInfo, setMapExpansion, saveParticipantslist, saveGuestlist, disableFieldsData, saveSelectedHost,
} from './actions';
import { getUtcDate } from '../shared/dateTimeConvertor';

export const RESET_GUEST_UPDATE = 'RESET_GUEST_UPDATE';

export function saveCalendarDateInfo(data) {
  return (dispatch) => {
    dispatch(saveCalendarDate(data));
  };
}

export function setSelectedHost(data) {
  return (dispatch) => {
    dispatch(saveSelectedHost(data));
  };
}

export function setGuestlist(data) {
  return (dispatch) => {
    dispatch(saveGuestlist(data));
  };
}
export function setParticipantslist(data) {
  return (dispatch) => {
    dispatch(saveParticipantslist(data));
  };
}

export function setDisableFields(data) {
  return (dispatch) => {
    dispatch(disableFieldsData(data));
  };
}

export function saveNewGuestInfo(data) {
  return (dispatch) => {
    dispatch(saveNewGuest(data));
  };
}

export function resetGuestDataInfo(data) {
  return (dispatch) => {
    dispatch(resetGuestData(data));
  };
}

function getImpContacts() {
  return (dispatch) => {
    fetch('src/app/data/contacts.json')
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          dispatch(getImportantContacts(res));
        }
        return res;
      });
  };
}

export function getBookingsList(companyId, employeeId) {
  const plannedOut = getUtcDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
  return (dispatch) => {
    dispatch(getBookingList(plannedOut, companyId, employeeId));
  };
}

export function setBookingData(data) {
  return (dispatch) => {
    dispatch(setBookingInfo(data));
  };
}

export function setremovedNodeWithEmployee(data) {
  return (dispatch) => {
    dispatch(saveRemovedNodeWithEmployee(data));
  };
}

export function setSavedDataToSpaceView(data) {
  return (dispatch) => {
    dispatch(saveDataToSpaceView(data));
  };
}
export function removeSaveDataToSpaceView() {
  return (dispatch) => {
    dispatch(clearSaveDataToSpaceView());
  };
}

export function saveBookingData(data) {
  return (dispatch) => {
    dispatch(saveBooking(data));
  };
}

export function setErrorMessage(data) {
  return (dispatch) => {
    dispatch(saveErrorMessage(data));
  };
}

export function saveGroupBookingData(data) {
  return (dispatch) => {
    dispatch(saveGroupBooking(data));
  };
}

export function getShiftsData(shiftDate) {
  return (dispatch) => {
    dispatch(getShiftsList(shiftDate));
  };
}
export function getMultidaysShiftData(shiftDate) {
  return (dispatch) => {
    dispatch(getMultidaysShiftList(shiftDate));
  };
}
export function clearMultiDayShiftInfo() {
  return (dispatch) => {
    dispatch(clearMultidaysShiftInfo());
  };
}
export function getWorkStationsData(sideId, fromDate, toDate, categoryId, type, showAll) {
  return (dispatch) => {
    dispatch(getWorkStationsList(sideId, fromDate, toDate, categoryId, type, showAll));
  };
}

export function removeBooking(bookingId) {
  return (dispatch) => {
    dispatch(cancelBooking(bookingId));
  };
}

export function clearErr() {
  return (dispatch) => {
    dispatch(clearDeleteError());
  };
}

export function resetBooking() {
  return (dispatch) => {
    dispatch(resetBookingAction());
  };
}

export function getFloorView(model, companyId) {
  return (dispatch) => {
    dispatch(getFloorViewInfo(model, companyId));
  };
}

export function getCategoriesOfWorkStations() {
  return (dispatch) => {
    dispatch(getWorkStationCategories());
  };
}

export function clearBookingInfo() {
  return (dispatch) => {
    dispatch(clearBookingObj());
  };
}

export function getSpacesByFloorId(sideId, fromDate, toDate, categoryId) {
  return (dispatch) => {
    dispatch(getFloorSpacesById(sideId, fromDate, toDate, categoryId));
  };
}

export function getMultidaysAvailabilitySpacesInfo(spaceId, fromDate, toDate, shiftId, categoryId, hostId) {
  return (dispatch) => {
    dispatch(getMultidaysAvailabilitySpaces(spaceId, fromDate, toDate, shiftId, categoryId, hostId));
    // dispatch(setSpaceId(spaceId));
  };
}
export function setAvailabilitySpaceId(spaceId) {
  return (dispatch) => {
    dispatch(setSpaceId(spaceId));
  };
}

export function getGuestList(empId, name) {
  return (dispatch) => {
    dispatch(getGuestListInfo(empId, name));
  };
}

export function saveGuest(empId, data) {
  return (dispatch) => {
    dispatch(saveGuestInfo(empId, data));
  };
}

export function updateGuest(guestId, guestInfo, employeeId) {
  return (dispatch) => {
    dispatch(updateGuestInfo(guestId, guestInfo, employeeId));
  };
}

export function resetGuestInfo(result) {
  return {
    type: RESET_GUEST_UPDATE,
    payload: result,
  };
}

export function addGuestData(data) {
  return (dispatch) => {
    dispatch(addGuestInfo(data));
  };
}
export function saveHostData(data) {
  return (dispatch) => {
    dispatch(saveHostInfo(data));
  };
}

export function setRefresh(data) {
  return (dispatch) => {
    dispatch(saveSetRefresh(data));
  };
}

export function clearMultipleDaysSpacesData(data) {
  return (dispatch) => {
    dispatch(clearMultipleDaysSpacesInfo(data));
  };
}
export function saveMultidaysBookingData(data) {
  return (dispatch) => {
    dispatch(saveMultidaysBooking(data));
  };
}
export function getSpacesCapBookingData(data) {
  return (dispatch) => {
    dispatch(getSpacesCapBooking(data));
  };
}
export function clearCapLimitData(data) {
  return (dispatch) => {
    dispatch(clearCapLimitObj(data));
  };
}
export function setMapExpansionInfo(data) {
  return (dispatch) => {
    dispatch(setMapExpansion(data));
  };
}
export default getImpContacts;
