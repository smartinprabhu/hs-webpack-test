/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
  Button, Popover, PopoverHeader, PopoverBody, Row, Col, Tooltip, Badge,
} from 'reactstrap';
import differenceBy from 'lodash/differenceBy';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ready from '@images/ready.svg';
import booked from '@images/booked.svg';
import maintain from '@images/maintain.svg';
import partialBooked from '@images/partialBooked.svg';
import selected from '@images/selected.svg';
import unavailableIcon from '@images/empty.svg';
import TimeZoneDateConvertor from '@shared/dateTimeConvertor';
import DisplayTimezone from '@shared/timezoneDisplay';
import { StringsMeta } from '../../../util/appUtils';

import './layoutFloorView.scss';
import {
  setAvailabilitySpaceId,
} from '../../bookingService';

const availableIcon = ({
  spaceIndex,
  cx,
  cy,
  workSpaceInfo,
  treeBookingType,
  employeesForWorkStation,
  setSelectedEmployeeToWorkStation,
  setFloorViewData,
  floorData,
  BookingData,
  setFloorObject,
  floorObject,
  setFloorDataToSelectedSpaceView,
  setEmployeesForWorkStation,
  selectErrMsg,
  setSelectErrMsg,
  dropDownEmployees,
  iconHeight,
  iconWidth,
  xAxis,
  yAxis,
}) => {
  const dispatch = useDispatch();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [bookingPopoverOpen, setBookingPopoverOpen] = useState(false);
  const [bookingAllowed, setBookingAllowed] = useState(false);
  const [spaceTaken, setSpaceTaken] = useState(false);
  const { userRoles } = useSelector((state) => state.user)
  // const { userRoles } = useSelector((state) => state.config);
  const showOccupant = userRoles && userRoles.data && userRoles.data.access && userRoles.data.booking && userRoles.data.booking.show_occupant;
  // const { saveHostInfo } = useSelector((state) => state.bookingInfo);
  const saveHostInfo = '';
  const disablePartialBooking = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disable_partial_booking;
  const partialBookingSpace = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disabled_space_categories;
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const togglePopover = () => setPopoverOpen(!popoverOpen);
  const workStationAvailabilityCheck = (workstation) => {
    // const availableObject = {
    //   from_date: BookingData.site.planned_in,
    //   to_date: BookingData.site.planned_out,
    //   space_id: workstation.id,
    //   shift_id: BookingData.site.id,
    //   category_id: BookingData.workStationType.id,
    // };
    // dispatch(checkAvailabilityForWorkStation(availableObject));
    dispatch(setAvailabilitySpaceId(workstation.id));
    // dispatch(getMultidaysAvailabilitySpacesInfo(workstation.id, BookingData.site.planned_in, BookingData.site.planned_out, BookingData.site.id, BookingData.workStationType.id));
  };
  const checkSpaceCategory = () => {
    if (partialBookingSpace.length !== 0) {
      return partialBookingSpace.map((item) => item).includes(workSpaceInfo && workSpaceInfo.space_category && workSpaceInfo.space_category.name);
    }
    return false;
  };
  const book = (space) => {
    const reAssignWorkStation = [...floorData];
    const checkExistingWorkStationIndex = findIndex(floorData, { id: space.id });
    let removeEmpFromDropDown = dropDownEmployees;
    if (treeBookingType === 'group' && (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room')) {
      if (checkExistingWorkStationIndex >= 0) {
        setFloorObject(reAssignWorkStation);
        workStationAvailabilityCheck(space);
        togglePopover();
      } else if (checkExistingWorkStationIndex < 0 && dropDownEmployees.length >= 1) {
        const assignWorkSpace = space;
        assignWorkSpace.employee = removeEmpFromDropDown[dropDownEmployees.length - 1];
        reAssignWorkStation.push(assignWorkSpace);
        setFloorViewData(reAssignWorkStation);
        removeEmpFromDropDown = filter(
          removeEmpFromDropDown,
          (emp) => emp.id === removeEmpFromDropDown[dropDownEmployees.length - 1].id,
        );
        setSelectedEmployeeToWorkStation(removeEmpFromDropDown);
        setFloorObject(reAssignWorkStation);
        workStationAvailabilityCheck(space);
        togglePopover();
      } else {
        setSelectErrMsg(true);
      }
    } else if (checkExistingWorkStationIndex >= 0) {
      setFloorObject(reAssignWorkStation);
      workStationAvailabilityCheck(space);
      togglePopover();
    } else if (checkExistingWorkStationIndex < 0 && dropDownEmployees.length === 1) {
      const assignWorkSpace = space;
      assignWorkSpace.employee = removeEmpFromDropDown[0];
      reAssignWorkStation.push(assignWorkSpace);
      setFloorViewData(reAssignWorkStation);
      removeEmpFromDropDown = filter(
        removeEmpFromDropDown,
        (emp) => emp.id === removeEmpFromDropDown[0].id,
      );
      setSelectedEmployeeToWorkStation(removeEmpFromDropDown);
      setFloorObject(reAssignWorkStation);
      workStationAvailabilityCheck(space);
      togglePopover();
    } else {
      setSelectErrMsg(true);
    }
  };
  const handleEmployeeChange = (employee, workSpaceObj) => {
    setBookingAllowed(true);
    const reAssignWorkStation = [...floorData];
    let removeEmpFromDropDown = dropDownEmployees;
    if (treeBookingType === 'individual') {
      reAssignWorkStation[0] = workSpaceObj;
      reAssignWorkStation[0].employee = removeEmpFromDropDown[0];
      setFloorViewData(reAssignWorkStation);
      setSelectedEmployeeToWorkStation([]);
    } else if (treeBookingType === 'group') {
      const checkExistingWorkStationIndex = findIndex(floorData, { id: workSpaceObj.id });
      if (checkExistingWorkStationIndex >= 0) {
        reAssignWorkStation[checkExistingWorkStationIndex] = workSpaceObj;
        removeEmpFromDropDown.push(reAssignWorkStation[checkExistingWorkStationIndex].employee);
        setSelectedEmployeeToWorkStation([employee]);
        reAssignWorkStation[checkExistingWorkStationIndex].employee = employee;
        setFloorViewData(reAssignWorkStation);
        removeEmpFromDropDown = filter(removeEmpFromDropDown, (emp) => emp.id === employee.id);
        setSelectErrMsg(false);
      } else {
        const assignWorkSpace = workSpaceObj;
        assignWorkSpace.employee = employee;
        reAssignWorkStation.push(assignWorkSpace);
        setFloorViewData(reAssignWorkStation);
        removeEmpFromDropDown = filter(removeEmpFromDropDown, (emp) => emp.id === employee.id);
        setSelectedEmployeeToWorkStation(removeEmpFromDropDown);
        setSelectErrMsg(false);
      }
    }
  };
  const setEmployeeInWorkStaion = (reAssignEmployeeToWorkstation) => {
    const floorObj = floorObject;
    const removeEmpFromDropDown = dropDownEmployees;
    removeEmpFromDropDown.push(reAssignEmployeeToWorkstation[0].employee);
    setSelectedEmployeeToWorkStation(uniq(reAssignEmployeeToWorkstation.flat(), 'id'));
    setFloorViewData(floorObj);
  };
  useEffect(() => {
    setBookingAllowed(false);
    if (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room') {
      if (employeesForWorkStation.length > workSpaceInfo.max_occupancy || floorObject.length === 1) {
        setUnavailable(true);
      } else {
        setUnavailable(false);
      }
    } else if (BookingData && BookingData.workStationType && BookingData.workStationType.type !== 'room') {
      if ((floorObject.length === (employeesForWorkStation && employeesForWorkStation.length))) {
        setUnavailable(true);
      } else {
        setUnavailable(false);
      }
    }
  }, [floorObject, employeesForWorkStation]);

  useEffect(() => {
    if (floorData) {
      setFloorDataToSelectedSpaceView(dropDownEmployees);
      setSpaceTaken(false);
    }
  }, [floorData]);
  const setPopover = () => {
    if (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room') {
      if (employeesForWorkStation.length > workSpaceInfo.max_occupancy || floorObject.length === 1) {
        setPopoverOpen(false);
      } else {
        const reAssignEmployeeToWorkstation = differenceBy(floorData, floorObject);
        if (reAssignEmployeeToWorkstation && reAssignEmployeeToWorkstation.length > 0) {
          setEmployeeInWorkStaion(reAssignEmployeeToWorkstation);
          setPopoverOpen(!popoverOpen);
        }
        setSelectErrMsg(false);
        setPopoverOpen(!popoverOpen);
      }
    // eslint-disable-next-line no-dupe-else-if
    } else if (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && floorObject.length === 1) {
      setPopoverOpen(false);
    } else if (BookingData && BookingData.workStationType && BookingData.workStationType.type !== 'room' && (floorObject.length) === (dropDownEmployees && dropDownEmployees.length) + floorObject.length) {
      setPopoverOpen(false);
    } else {
      const reAssignEmployeeToWorkstation = differenceBy(floorData, floorObject);
      if (reAssignEmployeeToWorkstation && reAssignEmployeeToWorkstation.length > 0) {
        setEmployeeInWorkStaion(reAssignEmployeeToWorkstation);
        setPopoverOpen(!popoverOpen);
      }
      setSelectErrMsg(false);
      setPopoverOpen(!popoverOpen);
    }
  };

  const allowPopover = (spaceSelected) => {
    const spaceId = floorObject.find((spaces) => spaces.id === spaceSelected.id);
    if (spaceId) {
      setPopoverOpen(false);
      setUnavailable(true);
      setSpaceTaken(true);
      return null;
    }
    setPopover();
  };

  const closePopover = () => {
    const floorObj = [...floorObject];
    const floorDataObj = [...floorData];
    const differenceBetweenFloorArrays = differenceWith(floorDataObj, floorObj, isEqual);
    if (differenceBetweenFloorArrays && differenceBetweenFloorArrays.length > 0) {
      const reAssignEmployees = differenceBetweenFloorArrays.map((floorDataObject) => {
        const removeEmpFromDropDown = [...dropDownEmployees];
        removeEmpFromDropDown.push(floorDataObject.employee);
        return removeEmpFromDropDown;
      });

      setEmployeesForWorkStation(uniq(reAssignEmployees.flat(), 'id'));
      const assignFloorData = differenceWith(floorObj, differenceBetweenFloorArrays, isEqual);
      setFloorViewData(assignFloorData);
    }
    setPopoverOpen(!popoverOpen);
  };
  const bookingPopover = (bookingItem) => (
    <React.Fragment key={bookingItem.id}>
      <Row className="text-left">
        <Col sm="12">
          Emp Name:
          {' '}
          {bookingItem.employee_name}
          {' '}
          {bookingItem.is_host && (
            <Badge color="success" className="float-right">
              Host
            </Badge>
          )}
        </Col>
        <Col sm="12">
          Emp Number:
          {' '}
          {bookingItem.employee_number}
        </Col>
        <Col sm="12">
          Booked time:
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_out} format="YYYY-MM-D" />
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_in} format="LT" />
          {' '}
          <DisplayTimezone />
          {' '}
          -
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_out} format="YYYY-MM-D" />
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_out} format="LT" />
          {' '}
          <DisplayTimezone />
        </Col>
      </Row>
    </React.Fragment>
  );
  const showToolTip = (node) => {
    const array = [];
    let bookingIndex = 1;
    if (node.shifts && node.shifts.length) {
      node.shifts.map((shift) => {
        if (shift.bookings && shift.bookings.length) {
          shift.bookings.map((booking) => {
            if (BookingData && BookingData.workStationType && ((BookingData.workStationType.type === 'room' && booking.is_host === true) || BookingData.workStationType.type !== 'room')) {
              array.push(booking);
            }
          });
        }
      });
    }
    if (array.length) {
      return (
        <>
          {array.map((bookingItem, index) => (
            <React.Fragment key={bookingIndex++}>
              {index < 2 ? (
                <>
                  {bookingPopover(bookingItem)}
                  <hr className="my-2 tooltipBorder" />
                </>
              ) : ''}
              {index === 3 ? (<span className="font-weight-800">...</span>) : ''}
            </React.Fragment>
          ))}
        </>
      );
    }
  };
  let popoverIndex = 1;

  const validateGuestOrParticipant = () => {
    if (dropDownEmployees && dropDownEmployees.length) {
      const guestType = dropDownEmployees.filter((item) => item && item.type === 'guest');
      const participantType = dropDownEmployees.filter((item) => item && item.type === 'partcipant');
      if (guestType.length && participantType.length) {
        return StringsMeta.EMPLOYEE_OR_GUEST;
      }
      if (guestType.length) {
        return StringsMeta.SELECT_GUEST;
      }
      if (participantType.length) {
        return StringsMeta.SELECT_EMPLOYEE;
      }
      return StringsMeta.SELECT_HOST;
    }
  };
  const bookingInputPopover = () => (
    <Popover trigger="legacy" placement="top" className="icon-popover" isOpen={popoverOpen} target={spaceIndex} toggle={() => allowPopover(workSpaceInfo)}>
      <PopoverHeader>
        <div>
          <span className="light-text">Work Space:</span>
          <span className="popover-text-color">{workSpaceInfo.space_name}</span>
        </div>
        <div className="mt-3">
          <span className="light-text">Path:</span>
          <span className="popover-text-color">{workSpaceInfo.path_name}</span>
        </div>
      </PopoverHeader>
      <PopoverBody>
        {treeBookingType !== 'individual' && BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
        <div className="mb-2">
          <span className="light-text">Occupancy:</span>
          <span className="popover-text-color">{workSpaceInfo.max_occupancy}</span>
        </div>
        )}
        {treeBookingType !== 'individual' && (
        <span className="light-text">
          Please add people for whom you want to book a space:
        </span>
        )}
        <Row className="mb-2 mt-2">
          <Col sm="12">
            <Select
              options={BookingData.workStationType.type === 'room' && saveHostInfo && treeBookingType === 'group' && saveHostInfo.id ? [dropDownEmployees] : dropDownEmployees}
              name="employee"
              placeholder={(BookingData.workStationType.type === 'room') ? 'Select Host' : dropDownEmployees && dropDownEmployees.length > 0 && (validateGuestOrParticipant())}
              isDisabled={dropDownEmployees && dropDownEmployees.length === 0}
              onChange={(values) => handleEmployeeChange(values, workSpaceInfo)}
              defaultValue={BookingData.workStationType.type === 'room' && saveHostInfo && treeBookingType === 'group' && saveHostInfo.id ? dropDownEmployees : !(dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                  && dropDownEmployees[0]) ? '' : dropDownEmployees && dropDownEmployees.length === 0 ? '' : (dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                    && dropDownEmployees[0])}
            />
          </Col>
        </Row>
        {selectErrMsg && (
        <Row className="mb-2">
          <Col sm="12" className="text-center text-danger">
            Please Select Atleast One Employee
          </Col>
        </Row>
        )}
        <Row className="mt-4">
          <Col sm="12">
            <Button className="addButton" size="sm" onClick={closePopover}>Close</Button>
            {(bookingAllowed || ((dropDownEmployees && dropDownEmployees.length === 1) || (BookingData.workStationType.type === 'room' && saveHostInfo && saveHostInfo.id))) && (
            <Button
              className="addButton book-btn"
              size="sm"
              onClick={() => book(workSpaceInfo)}
              data-testid="book"
            >
              Book
            </Button>
            )}
          </Col>
        </Row>
      </PopoverBody>
    </Popover>
  );
  return (
    <>
      {workSpaceInfo.status === 'Ready' && workSpaceInfo.is_booking_allowed && (
        <>
          <image
            id={spaceIndex}
            xlinkHref={(treeBookingType !== 'individual'
              && BookingData
              && BookingData.workStationType
              && BookingData.workStationType.type === 'room'
              && employeesForWorkStation.length > workSpaceInfo.max_occupancy) || unavailable ? unavailableIcon : popoverOpen ? selected : ready}
            x={cx}
            y={cy}
            height={iconHeight}
            width={iconWidth}
            style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
            className="svg-image-style"
            onClick={() => allowPopover(workSpaceInfo)}
            data-testid={spaceIndex}
          />
          <div>
            <Popover trigger="legacy" placement="top" className="icon-popover" isOpen={popoverOpen} target={spaceIndex} toggle={() => allowPopover(workSpaceInfo)}>
              <PopoverHeader>
                <div>
                  <span className="light-text">Work Space:</span>
                  <span className="popover-text-color">{workSpaceInfo.space_name}</span>
                </div>
                <div className="mt-3">
                  <span className="light-text">Path:</span>
                  <span className="popover-text-color">{workSpaceInfo.path_name}</span>
                </div>
              </PopoverHeader>
              <PopoverBody>
                {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                  <div className="mb-2">
                    <span className="light-text">Occupancy:</span>
                    <span className="popover-text-color">{workSpaceInfo.max_occupancy}</span>

                  </div>
                )}
                {treeBookingType !== 'individual' && (
                  <span className="light-text">
                    Please add people for whom you want to book a space:
                  </span>
                )}
                <Row className="mb-2 mt-2">
                  <Col sm="12">
                    <Select
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={BookingData.workStationType.type === 'room' && saveHostInfo && treeBookingType === 'group' && saveHostInfo.id ? [saveHostInfo] : dropDownEmployees}
                      name="employee"
                      placeholder={(BookingData.workStationType.type === 'room') ? 'Select Host' : dropDownEmployees && dropDownEmployees.length > 0 && (validateGuestOrParticipant())}
                      isDisabled={dropDownEmployees && dropDownEmployees.length === 0}
                      onChange={(values) => handleEmployeeChange(values, workSpaceInfo)}
                      defaultValue={BookingData.workStationType.type === 'room' && saveHostInfo && treeBookingType === 'group' && saveHostInfo.id ? saveHostInfo : !(dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                        && dropDownEmployees[0]) ? '' : dropDownEmployees && dropDownEmployees.length === 0 ? '' : (dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                          && dropDownEmployees[0])}
                    />
                  </Col>
                </Row>
                {selectErrMsg && (
                  <Row className="mb-2">
                    <Col sm="12" className="text-center text-danger">
                      Please Select Atleast One Employee
                    </Col>
                  </Row>
                )}
                <Row className="mt-4">
                  <Col sm="12">
                    <Button className="addButton close-btn" size="sm" onClick={closePopover}>Close</Button>
                    {(bookingAllowed || ((dropDownEmployees && dropDownEmployees.length === 1) || (BookingData.workStationType.type === 'room' && saveHostInfo && saveHostInfo.id))) && (
                      <Button
                        className="addButton book-btn"
                        size="sm"
                        onClick={() => book(workSpaceInfo)}
                        data-testid="book"
                      >
                        Book
                      </Button>
                    )}
                  </Col>
                </Row>
              </PopoverBody>
            </Popover>
            {showOccupant && !spaceTaken && (
              <Tooltip placement="right" isOpen={tooltipOpen} target={spaceIndex} toggle={toggle}>
                <Row className="mx-3">
                  <span>
                    <Row sm="12">
                      Neighborhood Name:
                      {' '}
                      {workSpaceInfo.parent && workSpaceInfo.parent.name}
                    </Row>
                    <Row sm="12">
                      Space Name:
                      {' '}
                      {workSpaceInfo.space_name}
                    </Row>
                    <Row sm="12">
                      Space Status:
                      {' '}
                      {workSpaceInfo.status}
                    </Row>
                    {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                      <Row sm="12">
                        Occupancy:
                        {' '}
                        {workSpaceInfo.max_occupancy}
                      </Row>
                    )}
                  </span>
                </Row>
              </Tooltip>
            )}
            {showOccupant && spaceTaken && (
              <Tooltip placement="right" isOpen={tooltipOpen} target={spaceIndex} toggle={toggle}>
                <Row className="mx-3">
                  <span>
                    <Row sm="12">
                      Neighborhood Name:
                      {' '}
                      {workSpaceInfo.parent && workSpaceInfo.parent.name}
                    </Row>
                    <Row sm="12">
                      Space Name:
                      {' '}
                      {workSpaceInfo.space_name}
                    </Row>
                    <Row sm="12">
                      Space Status:
                      {' '}
                      Already Selected
                    </Row>
                    { BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                      <Row sm="12">
                        Occupancy:
                        {' '}
                        {workSpaceInfo.max_occupancy}
                      </Row>
                    )}
                  </span>
                </Row>
              </Tooltip>
            )}
          </div>
        </>
      )}
      {workSpaceInfo.status === 'Partial' && (
        <>
          <image
            id={spaceIndex}
            xlinkHref={(treeBookingType !== 'individual'
              && BookingData
              && BookingData.workStationType
              && BookingData.workStationType.type === 'room'
              && employeesForWorkStation.length > workSpaceInfo.max_occupancy) || unavailable ? unavailableIcon : popoverOpen ? selected : partialBooked}
            x={cx}
            y={cy}
            height={iconHeight}
            width={iconWidth}
            style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
            className="svg-image-style"
            onClick={() => setBookingPopoverOpen(true)}
            data-testid={spaceIndex}
          />
          <div>
            {/* <Popover trigger="legacy" placement="top" isOpen={popoverOpen} target={spaceIndex} toggle={setPopover}>
              <PopoverHeader>
                {showOccupant && (
                  <div className="float-right">
                    <FontAwesomeIcon icon={faInfoCircle} onClick={() => setBookingPopoverOpen(true)} id={`booking-${spaceIndex}`} />
                  </div>
                )}
                <div>
                  <span className="light-text">Work Space:</span>
                  {workSpaceInfo.space_name}
                </div>
                <div className="mt-3">
                  <span className="light-text">Path:</span>
                  {workSpaceInfo.path_name}
                </div>
              </PopoverHeader>
              <PopoverBody>
                {treeBookingType !== 'individual' && BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                  <div className="mb-2">
                    <span className="light-text">Occupancy:</span>
                    {workSpaceInfo.max_occupancy}
                  </div>
                )}
                {treeBookingType !== 'individual' && (
                  <span className="light-text">
                    Please add people for whom you want to book a space:
                  </span>
                )}
                <Row className="mb-2 mt-2">
                  <Col sm="12">
                    <Select
                      options={BookingData.workStationType.type === 'room' && saveHostInfo && saveHostInfo.id ? [saveHostInfo] : dropDownEmployees}
                      name="employee"
                      placeholder={(BookingData.workStationType.type === 'room') ? 'Select Host' : dropDownEmployees && dropDownEmployees.length > 0 && (validateGuestOrParticipant())}
                      onChange={(values) => handleEmployeeChange(values, workSpaceInfo)}
                      defaultValue={BookingData.workStationType.type === 'room' && saveHostInfo && saveHostInfo.id ? saveHostInfo : !(dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                        && dropDownEmployees[0]) ? '' : dropDownEmployees && dropDownEmployees.length === 0 ? '' : (dropDownEmployees && dropDownEmployees.length && dropDownEmployees.length === 1
                        && dropDownEmployees[0])}
                      isDisabled={dropDownEmployees && dropDownEmployees.length === 0}
                    />
                  </Col>
                </Row>
                {selectErrMsg && (
                  <Row className="mb-2">
                    <Col sm="12" className="text-center text-danger">
                      Please Select Atleast One Employee
                    </Col>
                  </Row>
                )}
                <Row className="mt-4">
                  <Col sm="12">
                    <Button className="addButton" size="sm" onClick={closePopover}>Close</Button>
                    {(bookingAllowed || (dropDownEmployees && dropDownEmployees.length === 1)) && (<Button className="addButton" size="sm" onClick={() => book(workSpaceInfo)} data-testid="book">Book</Button>)}
                  </Col>
                </Row>
              </PopoverBody>
            </Popover> */}
            {bookingPopoverOpen && disablePartialBooking && checkSpaceCategory() && (
              <Popover
                placement="top"
                isOpen={bookingPopoverOpen}
                target={`${spaceIndex}`}
                toggle={() => setBookingPopoverOpen(false)}
                trigger="legacy"
              >
                <PopoverHeader className="pop-head">Booking Details</PopoverHeader>
                <PopoverBody className="bookingPopover thin-scrollbar">
                  <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                    Space Name:
                    {' '}
                    {workSpaceInfo.space_name}
                  </Row>
                  <Row sm="12" className="ml-1">
                    Space Status:
                    {' '}
                    {workSpaceInfo.status}
                  </Row>
                  {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                    <Row sm="12" className="ml-1">
                      Occupancy:
                      {' '}
                      {workSpaceInfo.max_occupancy}
                    </Row>
                  )}
                  <hr className="my-2 tooltipBorder" />
                  {showOccupant && workSpaceInfo.shifts && workSpaceInfo.shifts.length && workSpaceInfo.shifts.map((shift) => (
                    <div key={popoverIndex++}>
                      <span className="font-weight-800">
                        {shift.bookings && shift.bookings.length
                          ? (<TimeZoneDateConvertor date={shift.planned_in} format="dddd D  MMMM YYYY" />)
                          : ''}
                      </span>
                      {shift.bookings && shift.bookings.length ? shift.bookings.map((bookingItem) => (
                        <React.Fragment key={bookingItem.id}>
                          {BookingData && BookingData.workStationType && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room')
                            ? (bookingPopover(bookingItem)) : ''}
                          {shift.bookings.length > 1 && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room') ? (<br />) : ''}
                        </React.Fragment>
                      )) : ''}
                      {shift.bookings && shift.bookings.length ? (<hr className="my-2 tooltipBorder" />) : ''}
                    </div>
                  ))}
                </PopoverBody>
              </Popover>
            )}

            {disablePartialBooking && checkSpaceCategory(workSpaceInfo) ? '' : bookingInputPopover()}

            {showOccupant && (
              <Tooltip placement="right" isOpen={tooltipOpen} target={spaceIndex} toggle={toggle} className="mytooltip">
                <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                  Neighborhood Name:
                  {' '}
                  {workSpaceInfo.parent && workSpaceInfo.parent.name}
                </Row>
                <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                  Space Name:
                  {' '}
                  {workSpaceInfo.space_name}
                </Row>
                <Row sm="12" className="ml-1">
                  Space Status:
                  {' '}
                  {workSpaceInfo.status}
                </Row>
                {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                  <Row sm="12" className="ml-1">
                    Occupancy:
                    {' '}
                    {workSpaceInfo.max_occupancy}
                  </Row>
                )}
                <hr className="my-2 tooltipBorder" />
                {showToolTip(workSpaceInfo)}
              </Tooltip>
            )}
          </div>
        </>
      )}
      {workSpaceInfo.status === 'Booked' && (
        <>
          <image
            id={spaceIndex}
            xlinkHref={booked}
            x={cx}
            y={cy}
            height={iconHeight}
            width={iconWidth}
            style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
            className="svg-image-style"
            data-testid={spaceIndex}
            onClick={() => setBookingPopoverOpen(true)}
          />
          {showOccupant && (
            <Tooltip placement="right" isOpen={tooltipOpen} target={spaceIndex} toggle={toggle} className="mytooltip">
              <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                Neighborhood Name:
                {' '}
                {workSpaceInfo.parent && workSpaceInfo.parent.name}
              </Row>
              <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                Space Name:
                {' '}
                {workSpaceInfo.space_name}
              </Row>
              <Row sm="12" className="ml-1">
                Space Status:
                {' '}
                {workSpaceInfo.status}
              </Row>
              {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                <Row sm="12" className="ml-1">
                  Occupancy:
                  {' '}
                  {workSpaceInfo.max_occupancy}
                </Row>
              )}
              <hr className="my-2 tooltipBorder" />
              {showToolTip(workSpaceInfo)}
            </Tooltip>
          )}
          {bookingPopoverOpen && (
            <Popover
              placement="top"
              isOpen={bookingPopoverOpen}
              target={spaceIndex}
              toggle={() => setBookingPopoverOpen(false)}
              trigger="legacy"
            >
              <PopoverHeader className="pop-head">Booking Details</PopoverHeader>
              <PopoverBody className="bookingPopover thin-scrollbar">
                <Row sm="12" className={`${showOccupant}` ? 'mr-3 ml-1' : 'ml-1'}>
                  Space Name:
                  {' '}
                  {workSpaceInfo.space_name}
                </Row>
                <Row sm="12" className="ml-1">
                  Space Status:
                  {' '}
                  {workSpaceInfo.status}
                </Row>
                {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                  <Row sm="12" className="ml-1">
                    Occupancy:
                    {' '}
                    {workSpaceInfo.max_occupancy}
                  </Row>
                )}
                <hr className="my-2 tooltipBorder" />
                {showOccupant && workSpaceInfo.shifts && workSpaceInfo.shifts.length && workSpaceInfo.shifts.map((shift) => (
                  <div key={popoverIndex++}>
                    <span className="font-weight-800">
                      {shift.bookings && shift.bookings.length
                        ? (<TimeZoneDateConvertor date={shift.planned_out} format="dddd D  MMMM YYYY" />)
                        : ''}
                    </span>
                    {shift.bookings && shift.bookings.length ? shift.bookings.map((bookingItem) => (
                      <React.Fragment key={bookingItem.id}>
                        {BookingData && BookingData.workStationType && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room')
                          ? (bookingPopover(bookingItem)) : ''}
                        {shift.bookings.length > 1 && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room') ? (<br />) : ''}
                      </React.Fragment>
                    )) : ''}
                    {shift.bookings && shift.bookings.length ? (<hr className="my-2 tooltipBorder" />) : ''}
                  </div>
                ))}
              </PopoverBody>
            </Popover>
          )}
        </>
      )}
      {workSpaceInfo.status === 'Maintenance in Progress' && (
        <>
          <image
            id={spaceIndex}
            xlinkHref={maintain}
            x={cx}
            y={cy}
            height={iconHeight}
            width={iconWidth}
            style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
            className="svg-image-style"
            data-testid={spaceIndex}
          />
          {showOccupant && (
            <Tooltip placement="right" isOpen={tooltipOpen} target={spaceIndex} toggle={toggle}>
              <Row className="ml-3">
                <Row sm="12">
                  Neighborhood Name:
                  {' '}
                  {workSpaceInfo.parent && workSpaceInfo.parent.name}
                </Row>
                <Row sm="12" className="mr-2">
                  Space Name:
                  {' '}
                  {workSpaceInfo.space_name}
                </Row>
                <Row sm="12">
                  Space Status:
                  {' '}
                  {workSpaceInfo.status}
                </Row>
              </Row>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
};

export default availableIcon;
