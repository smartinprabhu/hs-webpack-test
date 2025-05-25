/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import groupBy from 'lodash/groupBy';
import mapKeys from 'lodash/mapKeys';
import filter from 'lodash/filter';
import moment from 'moment-timezone';

function buildHostObj(workSpace, site, bookFor, bookingType, host, plannedTime) {
  return {
    space_id: workSpace.id,
    shift_id: site.id,
    planned_in: workSpace.employee.new_planned_in
      ? workSpace.employee.new_planned_in : workSpace.max_occupancy && workSpace.max_occupancy && plannedTime > 0 ? plannedTime.plannedIn : site.planned_in,
    planned_out: workSpace.employee.new_planned_out
      ? workSpace.employee.new_planned_out : workSpace.max_occupancy && workSpace.max_occupancy && plannedTime > 0 ? plannedTime.plannedOut : site.planned_out,
    employee_id: workSpace.employee.id,
    book_for: bookFor,
    booking_type: bookingType,
    is_host: host,
    is_full_shift_booking: workSpace.isFullShiftBook ? 1 : 0,
  };
}
function saveObject(workSpace, site, userInfo, multidays, bookingType, host, type, hostEmp) {
  return {
    space_id: workSpace.id,
    shift_id: site.id,
    planned_in: multidays.planned_in,
    planned_out: multidays.planned_out,
    employee_id: type === 'guest' ? hostEmp.id : workSpace.employee.id,
    book_for: workSpace.employee.id === userInfo.data.employee.id ? 'myself' : 'other',
    booking_type: bookingType,
    is_host: workSpace.employee.is_host ? workSpace.employee.is_host : host,
    is_guest: workSpace.employee.is_guest ? workSpace.employee.is_guest : false,
    visitor_ids: workSpace.employee.visitor_ids ? JSON.stringify(workSpace.employee.visitor_ids) : [],
    is_full_shift_booking: site && site.dragType ? 0 : 1,
    date: moment(multidays.planned_out).format('YYYY-MM-D'),
    child: [],
  };
}
export default function multidayBookingObj(selectedWorkSpace, bookingData, userInfo, employees, treeViewBookingType, allEmployees, hostInfo) {
  const bookingArray = [];
  if (bookingData && bookingData.workStationType && bookingData.workStationType.type !== 'room') {
    const spacesArray = [];
    if (selectedWorkSpace && selectedWorkSpace.length > 1) {
      selectedWorkSpace.map((workSpace) => {
        workSpace.multidaysBookings && workSpace.multidaysBookings.length && workSpace.multidaysBookings.map((multidays) => {
          spacesArray.push(saveObject(workSpace, bookingData.site, userInfo, multidays, treeViewBookingType, false, workSpace.employee.type, hostInfo));
        });
      });
    } else if (selectedWorkSpace && selectedWorkSpace.length === 1) {
      selectedWorkSpace[0].multidaysBookings && selectedWorkSpace[0].multidaysBookings.length && selectedWorkSpace[0].multidaysBookings.map((multidays) => {
        spacesArray.push(saveObject(selectedWorkSpace[0], bookingData.site, userInfo, multidays, treeViewBookingType, false, selectedWorkSpace[0].employee.type, hostInfo));
      });
    }
    const spacesObj = groupBy(spacesArray, 'date');
    mapKeys(spacesObj, (value) => {
      bookingArray.push(value);
    });
  } else {
    const roomArray = [];
    const guestEmployees = filter(allEmployees, (emp) => emp.type === 'guest');
    const partcipantEmployees = filter(allEmployees, (emp) => emp.type === 'participant');
    if (selectedWorkSpace && selectedWorkSpace.length === 1) {
      const visitorIds = [];
      if (guestEmployees && guestEmployees.length) {
        guestEmployees.map((emp) => {
          visitorIds.push(emp.id);
        });
        selectedWorkSpace[0].employee.is_guest = true;
        selectedWorkSpace[0].employee.visitor_ids = visitorIds;
      }
      selectedWorkSpace[0].multidaysBookings && selectedWorkSpace[0].multidaysBookings.length && selectedWorkSpace[0].multidaysBookings.map((multidays) => {
        roomArray.push(saveObject(selectedWorkSpace[0], bookingData.site, userInfo, multidays, treeViewBookingType, true, selectedWorkSpace[0].employee.type, hostInfo));
      });
      if (roomArray && roomArray.length && treeViewBookingType === 'group' && partcipantEmployees && partcipantEmployees.length) {
        roomArray.map((spaces) => {
          partcipantEmployees.map((employee) => {
            const workSpace = selectedWorkSpace[0];
            workSpace.employee = employee;
            spaces.child.push(saveObject(workSpace, bookingData.site, userInfo, { planned_in: spaces.planned_in, planned_out: spaces.planned_out }, treeViewBookingType, false));
          });
        });
      }
      if (roomArray && roomArray.length) {
        roomArray.map((spaces) => {
          bookingArray.push([spaces]);
        });
      }
    }
  }
  return bookingArray;
}
function buildObj(workSpace, site, plannedTime) {
  return {
    space_id: workSpace.id,
    shift_id: site.id,
    planned_in: workSpace.employee.new_planned_in
      ? workSpace.employee.new_planned_in
      : workSpace.max_occupancy && workSpace.max_occupancy > 0 && plannedTime ? plannedTime.plannedIn : site.planned_in,
    planned_out: workSpace.employee.new_planned_out
      ? workSpace.employee.new_planned_out
      : workSpace.max_occupancy && workSpace.max_occupancy > 0 && plannedTime ? plannedTime.plannedOut : site.planned_out,
    employee_id: workSpace.employee.id,
    is_full_shift_booking: workSpace.isFullShiftBook ? 1 : 0,
  };
}

export function buildSaveBookingObject(selectedWorkSpace, bookingData, userInfo, employees, treeViewBookingType, allEmployees) {
  const bookSpaceObj = [];
  let userIndex = -1;
  async function isUserExists(workSpace) {
    workSpace.map((workspace, i) => {
      if (workspace.employee.id === userInfo.data.employee.id) {
        userIndex = i;
      }
    });
  }

  if (selectedWorkSpace && selectedWorkSpace.length === 1 && employees && employees.length === 1) {
    selectedWorkSpace[0].employee = { id: employees[0].id };
  }

  if (selectedWorkSpace && selectedWorkSpace.length === 1) {
    if (bookingData && bookingData.workStationType && bookingData.workStationType.type === 'room' && allEmployees && allEmployees.length > 0) {
      if (selectedWorkSpace[0].employee.id === userInfo.data.employee.id) {
        bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'myself', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
      } else {
        bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'other', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
      }
      allEmployees.map((emp) => {
        if (emp && emp.name) {
          selectedWorkSpace[0].employee = { id: emp.id };
          bookSpaceObj.push(buildObj(selectedWorkSpace[0], bookingData.site, bookingData.maxOccupancyPlannedTime));
        }
      });
    } else if (employees && employees.length > 1) {
      employees.map((emp, index) => {
        if (index === 0) {
          if (emp.id === userInfo.data.employee.id) {
            selectedWorkSpace[0].employee = { id: emp.id };
            bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'myself', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
          } else {
            selectedWorkSpace[0].employee = { id: emp.id };
            bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'other', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
          }
        } else if (emp.id === userInfo.data.employee.id) {
          selectedWorkSpace[0].employee = { id: emp.id };
          bookSpaceObj.push(buildObj(selectedWorkSpace[0], bookingData.site, bookingData.maxOccupancyPlannedTime));
        } else {
          selectedWorkSpace[0].employee = { id: emp.id };
          bookSpaceObj.push(buildObj(selectedWorkSpace[0], bookingData.site, bookingData.maxOccupancyPlannedTime));
        }
      });
    } else if (selectedWorkSpace[0].employee.id === userInfo.data.employee.id) {
      bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'myself', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
    } else {
      bookSpaceObj.push(buildHostObj(selectedWorkSpace[0], bookingData.site, 'other', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
    }
    return bookSpaceObj;
  } if (selectedWorkSpace && selectedWorkSpace.length > 1) {
    isUserExists(selectedWorkSpace);
    if (userIndex >= 0) {
      bookSpaceObj.push(buildHostObj(selectedWorkSpace[userIndex], bookingData.site, 'myself', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
      selectedWorkSpace.map((workSpace, index) => {
        if (index !== userIndex) {
          bookSpaceObj.push(buildObj(workSpace, bookingData.site, bookingData.maxOccupancyPlannedTime));
        }
      });
    } else {
      selectedWorkSpace.map((workSpace, index) => {
        if (index === 0) {
          bookSpaceObj.push(buildHostObj(workSpace, bookingData.site, 'other', treeViewBookingType, true, bookingData.maxOccupancyPlannedTime));
        } else {
          bookSpaceObj.push(buildObj(workSpace, bookingData.site, bookingData.maxOccupancyPlannedTime));
        }
      });
    }
    return bookSpaceObj;
  }
  return undefined;
}
