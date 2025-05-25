/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row, Col, Card, CardHeader,
} from 'reactstrap';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import { Tooltip } from 'antd';

import Loader from '@shared/loading';
import uniq from 'lodash/uniq';
import find from 'lodash/find';

import { getUtcTimefromZone } from '@shared/dateTimeConvertor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faExclamationCircle, faCompress } from '@fortawesome/free-solid-svg-icons';
import plusIcon from '@images/plusIcon.png';
import minusIcon from '@images/minusIcon.png';
import resetIcon from '@images/reset.png';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import './layoutFloorView.scss';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import AvailableIcon from './availableIcon';
import '../../../spaceManagement/space.scss';
import {
  getMultidaysAvailabilitySpacesInfo, clearCapLimitData, setMapExpansionInfo, setSavedDataToSpaceView, removeSaveDataToSpaceView,
  saveHostData, clearMultipleDaysSpacesData, getSpacesCapBookingData, setErrorMessage, setDisableFields,
} from '../../bookingService';
import CapLimitModalWindow from '../../createBooking/capLimitModal';
import { StringsMeta, apiURL } from '../../../util/appUtils';

const appConfig = require('@app/config/appConfig').default;

// const appModels = require('../../../util/appModels').default;
const FloorViewLayout = ({
  setExpantion, workSpaceSelect, floorId, BookingData, treeBookingType, category, setEmployees, getGroupWorkStations, setSpaceAvailabilityData,
}) => {
  const dispatch = useDispatch();

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [employeesForWorkStation, setEmployeesForWorkStation] = useState([]);
  const [employeesForWorkStationDropDown, setEmployeesForWorkStationDropDown] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [floorObject, setFloorObject] = useState([]);
  const [allEmployees, selectedAllEmployees] = useState([]);
  const [expand, setExpanding] = useState(false);
  const [spacesTrue, setSpacesTrue] = useState(false);
  const [guestKeyword, setGuestKeyword] = useState('');
  const [guestData, setGuestData] = useState([]);
  const [dropDownEmployees, setDropDownEmployees] = useState([]);
  const [validateGetSpaces, setValidateGetSpaces] = useState(false);
  const [expandView, setExpandView] = useState(false);
  const [classExpand, setClassExpand] = useState('');
  const {
    removedNodeWithEmployee, employees, floorView, multidaysAvailabilityInfo, hostData, addGuestInfo, saveNewGuest, capsLimitInfo, savedGuestData, savedParticipantsData,
  } = useSelector((state) => state.bookingInfo);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const [individualGuest, setIndividualGuest] = useState('');
  const [capLimitModal, setCapLimitModal] = useState(false);
  const [empCapLimitArray, setEmpCapLimitArray] = useState([]);
  const [selectedSpaceNameValue, setSelectedSpaceNameValue] = useState([]);
  const updateWorkSpace = (workSpaceObj, employee) => {
    workSpaceSelect(workSpaceObj, employee, allEmployees);
  };
  const companyTimeZone=userInfo &&userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone

  const resetBookingData = () => {
    setFloorData([]);
    setSpacesTrue(false);
    setValidateGetSpaces(false);
    setFloorObject([]);
    setFloorData([]);
    setEmployeesForWorkStation([]);
    setEmployeesForWorkStationDropDown([]);
    getGroupWorkStations([]);
    setSelectedFloor(null);
    selectedAllEmployees([]);
    setDropDownEmployees([]);
    dispatch(removeSaveDataToSpaceView());
    dispatch(clearMultipleDaysSpacesData());
    dispatch(clearCapLimitData());
    dispatch(setDisableFields(false));
  };

  useEffect(() => {
    let payload;
    if (spacesTrue && allEmployees && floorObject) {
      payload = {
        Expand: expand, AllEmployees: allEmployees, FloorObject: floorObject,
      };
      dispatch(setSavedDataToSpaceView(payload));
    }
  }, [expand, allEmployees, floorObject]);

  useEffect(() => {
    if (capsLimitInfo && capsLimitInfo.err && capsLimitInfo.err.error && capsLimitInfo.err.error.message) {
      setSpacesTrue(false);
      setValidateGetSpaces(false);
      dispatch(setDisableFields(false));
    }
    if (capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length) {
      if (capsLimitInfo.data.find((limit) => limit.validity === false)) {
        setCapLimitModal(true);
        setSpacesTrue(false);
        setValidateGetSpaces(false);
        setSelectedFloor(null);
        dispatch(clearMultipleDaysSpacesData());
        dispatch(setDisableFields(false));
      } else {
        setSpacesTrue(true);
      }
    }
  }, [capsLimitInfo]);

  useEffect(() => {
    if (floorId) {
      resetBookingData();
    }
  }, [floorId]);

  useEffect(() => {
    if (capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length === 0) {
      setSpacesTrue(true);
    }
  }, [capsLimitInfo]);

  useEffect(() => {
    setExpantion(expand);
  }, [expand]);

  useEffect(() => {
    if (savedParticipantsData && !savedParticipantsData.length && treeBookingType === 'group') {
      const message = StringsMeta.PARTICIPANTS_NOT_SELECTED_MESSAGE;
      dispatch(setErrorMessage(message));
    } else {
      dispatch(setErrorMessage(false));
    }
  }, [treeBookingType, savedParticipantsData]);

  useEffect(() => {
    if (savedGuestData && !savedGuestData.length) {
      setIndividualGuest(savedGuestData);
    }
  }, [savedGuestData, spacesTrue]);

  useEffect(() => {
    if (treeBookingType) {
      setDisableFields(false);
      dispatch(removeSaveDataToSpaceView());
    }
  }, [treeBookingType, addGuestInfo, floorId]);

  useEffect(() => {
    if (employeesForWorkStation && employeesForWorkStation.length) {
      const empArray = [];
      employeesForWorkStation.filter((datas) => {
        if (datas && datas.type !== 'guest') {
          const obj = {
            employeeName: `${datas.name}`,
            employeeId: `${datas.id}`,
            company: `${userInfo.data.main_company.id}`,
            host: `${datas.is_host}`,
            from_time: `${getUtcTimefromZone(BookingData.site.planned_in, 'YYYY-MM-DD HH:mm:ss',companyTimeZone)}`,
            end_time: `${getUtcTimefromZone(BookingData.site.planned_out, 'YYYY-MM-DD HH:mm:ss',companyTimeZone)}`,
            space_type: `${BookingData.workStationType.id}`,
          };
          empArray.push(obj);
          setEmpCapLimitArray(empArray);
        }
      });
    }
  }, [employeesForWorkStation]);

  useEffect(() => {
    if (saveNewGuest && saveNewGuest.length) {
      setGuestKeyword('');
    }
  }, [saveNewGuest]);

  useEffect(() => {
    if (hostData) {
      dispatch(saveHostData(hostData));
      setValidateGetSpaces(false);
      setSpacesTrue(false);
      dispatch(clearMultipleDaysSpacesData());
      setSelectedFloor(null);
    }
  }, [hostData, addGuestInfo]);

  useEffect(() => {
    const array = [];
    array.push(uniq(savedParticipantsData, 'id'));
    array.push(uniq(savedGuestData, 'id'));
    if (treeBookingType === 'individual' && BookingData && BookingData.workStationType && addGuestInfo && addGuestInfo.data && individualGuest && individualGuest.id) {
      array.push([individualGuest]);
    } else {
      array.push([hostData]);
    }
    setEmployeesForWorkStation(array.flat());
    setEmployees(array.flat());
  }, [hostData, savedParticipantsData, savedGuestData, guestKeyword, addGuestInfo, individualGuest, spacesTrue]);

  useEffect(() => {
    if (employeesForWorkStation && employeesForWorkStation.length) {
      const empArray = [];
      if (floorObject && floorObject.length) {
        floorObject.map((obj) => {
          empArray.push(obj.employee);
        });
        const emp = difference(employeesForWorkStation, empArray);
        setDropDownEmployees(uniq(emp.flat(), 'id'));
      } else {
        setDropDownEmployees(uniq(employeesForWorkStation.flat(), 'id'));
      }
    }
  }, [employeesForWorkStation, validateGetSpaces]);

  useEffect(() => {
    if (treeBookingType) {
      dispatch(clearCapLimitData());
    }
  }, [treeBookingType, floorId]);

  useEffect(() => {
    if (addGuestInfo && !addGuestInfo.data) {
      const removeEmployeeFromFloorData = filter(
        floorData,
        (workspace) => workspace.employee.type !== 'guest',
      );
      setFloorData(removeEmployeeFromFloorData);
      setFloorObject(removeEmployeeFromFloorData);
    }
  }, [addGuestInfo]);

  useEffect(() => {
    if (addGuestInfo) {
      setGuestKeyword('');
      setIndividualGuest('');
      setGuestData([]);
      setFloorData([]);
      setFloorObject([]);
    }
  }, [addGuestInfo]);

  useEffect(() => {
    if (treeBookingType) {
      setEmployeesForWorkStation([
        {
          ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, name: userInfo.data.employee.name,
        },
      ]);
      setEmployeesForWorkStationDropDown([
        {
          ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, name: userInfo.data.employee.name,
        },
      ]);
      setFloorData([]);
      setFloorObject([]);
    }
  }, [treeBookingType, floorId]);
  const setSelectedSpaceView = (employeesData) => {
    selectedAllEmployees(employeesData);
  };

  const getPlannedUtcTime = (time) => getUtcTimefromZone(time, 'YYYY-MM-DD HH:mm:ss', companyTimeZone);
  // useEffect(() => {
  //   if (validateGetSpaces && floorId && spacesTrue && userInfo && userInfo.data.company && (floorView && !floorView.loading) && hostData && hostData.id) {
  //     setLoading(true);
  //     dispatch(getMultidaysAvailabilitySpacesInfo(floorId, getPlannedUtcTime(BookingData.site.custom_planned_in ? BookingData.site.custom_planned_in : BookingData.site.planned_in), getPlannedUtcTime(BookingData.site.custom_planned_out ? BookingData.site.custom_planned_out : BookingData.site.planned_out), BookingData.site.id, category.id || BookingData.workStationType.id, hostData.id));
  //     if (floorView && floorView.data) {
  //       const filterFloorData = floorView && floorView.data && floorView.data.filter((floor) => floor.id === floorId);
  //       setSelectedFloor(filterFloorData[0]);
  //     }
  //     setLoading(false);
  //   }
  // }, [spacesTrue]);

  useEffect(() => {
    if (userInfo && userInfo.data.company && spacesTrue && floorId && (floorView && !floorView.loading) && hostData && hostData.id) {
      setLoading(true);
      dispatch(getMultidaysAvailabilitySpacesInfo(floorId, getPlannedUtcTime(BookingData.site.custom_planned_in ? BookingData.site.custom_planned_in : BookingData.site.planned_in), getPlannedUtcTime(BookingData.site.custom_planned_out ? BookingData.site.custom_planned_out : BookingData.site.planned_out), BookingData.site.id, category.id || BookingData.workStationType.id, hostData.id));
      if (floorView && floorView.data) {
        const filterFloorData = floorView && floorView.data && floorView.data.filter((floor) => floor.id === floorId);
        setSelectedFloor(filterFloorData[0]);
      }
      setLoading(false);
    }
  }, [userInfo, spacesTrue, floorId]);

  useEffect(() => {
    if (empCapLimitArray && empCapLimitArray.length
      && userRoles && userRoles.data && userRoles.data.cap_limit && userRoles.data.cap_limit.enable_cap_limit && userRoles.data.cap_limit.allowed_categories && userRoles.data.cap_limit.allowed_categories.length && find(userRoles.data.cap_limit.allowed_categories, (categ) => categ === BookingData.workStationType.name)) {
      dispatch(getSpacesCapBookingData(empCapLimitArray));
    } else if(!(userRoles && userRoles.data && userRoles.data.cap_limit && userRoles.data.cap_limit.enable_cap_limit)) {
      setSpacesTrue(true);
    }
  }, [spacesTrue, empCapLimitArray]);

  const [selectedEmp, setSelectedEmp] = useState();
  // useEffect(() => {
  //   setEmployeeOptions([]);
  //   if (treeBookingType === 'individual') {
  //     const selectedEmployee = [
  //       {
  //         ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, name: userInfo.data.employee.name,
  //       }];
  //     setEmployeesForWorkStation(selectedEmployee);
  //     setEmployeesForWorkStationDropDown(selectedEmployee);
  //   }
  //   if (employees && employees.length) {
  //     setEmployeeOptions(employees.map((employee) => ({
  //       ...employee, value: employee.name, label: employee.name, name: userInfo.data.employee.name,
  //     })));
  //   }
  // }, [treeBookingType]);

  useEffect(() => {
    if (userInfo) {
      const selectedEmployee = [
        {
          ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, name: userInfo.data.employee.name,
        }];
      setSelectedEmp(selectedEmployee);
    }
  }, [userInfo]);

  useEffect(() =>{
    if(multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading){
      setSelectedSpaceNameValue([]);
    }
  }, [multidaysAvailabilityInfo]);

  const setFloorViewData = (floorViewObj) => {
    setFloorData(floorViewObj);
  };

  const getValidation = () => {
    if (treeBookingType === 'individual') {
      if (addGuestInfo && addGuestInfo.data) {
        if (savedGuestData && savedGuestData.length !== 0) {
          return false;
        }
        return true;
      }
      return false;
    }
    if (addGuestInfo && addGuestInfo.data) {
      if (savedGuestData && savedGuestData.length >= 1) {
        return false;
      }
      return true;
    }
    return false;
  };

  const setSelectedEmployeeToWorkStation = (employee) => {
    if (employee && employee.length > 0) {
      let removeEmpFromDropDown = dropDownEmployees;
      removeEmpFromDropDown = filter(removeEmpFromDropDown, (emp) => emp.id !== employee[0].id);
      setDropDownEmployees(uniq(removeEmpFromDropDown.flat(), 'id'));
    } else {
      setDropDownEmployees(employee);
    }
  };
  const removeNodeWithEmployee = (node) => {
    let removeNodeFromFloorData = floorData;
    const empForWorkStation = dropDownEmployees;
    removeNodeFromFloorData = filter(
      removeNodeFromFloorData,
      (worSpacenode) => worSpacenode.id !== node.id,
    );
    setFloorData(removeNodeFromFloorData);
    setFloorObject(removeNodeFromFloorData);
    empForWorkStation.push(node.employee);
    setDropDownEmployees(dropDownEmployees);
  };

  useEffect(() => {
    if (removedNodeWithEmployee !== []) {
      removeNodeWithEmployee(removedNodeWithEmployee);
    }
  }, [removedNodeWithEmployee]);

  useEffect(() => {
    const myImg = document.getElementById(StringsMeta.MAP_OVERVIEW);
    if (myImg && myImg.style) {
      if (!expand) {
        myImg.style.width = StringsMeta.SIZE_450PX;
      } else {
        myImg.style.width = StringsMeta.SIZE_1100PX;
      }
    }
  }, [expand, multidaysAvailabilityInfo]);

  const [selectErrMsg, setSelectErrMsg] = useState(false);
  const [workSpaceCount, setWorkSpaceCount] = useState([]);

  useEffect(() => {
    if (multidaysAvailabilityInfo && multidaysAvailabilityInfo.data) {
      const workSpaceData = [];
      multidaysAvailabilityInfo.data.map((workSpace) => {
        if (workSpace.longitude !== '' && workSpace.latitude !== '') {
          workSpaceData.push(workSpace);
        }
      });
      setWorkSpaceCount(workSpaceData);
    }
  }, [multidaysAvailabilityInfo]);

  const [iconHeight, setIconHeight] = useState(30);
  const [iconWidth, setIconWidth] = useState(30);
  const [xAxis, setXAxis] = useState(-0.4);
  const [yAxis, setYAxis] = useState(-0.4);
  const [scale, setScale] = useState(1);
  const [newScale, setNewScale] = useState(0.9);

  const wheels = (e) => {
    if (e !== undefined) {
      setScale((e.state.scale).toFixed(1));
    }
    if (scale > newScale) {
      if (iconHeight > 12) {
        setIconWidth(iconWidth - 2);
        setIconHeight(iconHeight - 2);
        setXAxis(xAxis + 0.08);
        setYAxis(yAxis + 0.08);
      }
      setNewScale(scale);
    } else {
      if (iconHeight < 30) {
        setIconWidth(iconWidth + 2);
        setIconHeight(iconHeight + 2);
        setXAxis(xAxis - 0.08);
        setYAxis(yAxis - 0.08);
      }
      setNewScale(scale);
    }
  };
  const scaleUp = () => {
    if (iconHeight > 12) {
      setIconHeight(iconHeight - 4);
      setIconWidth(iconWidth - 4);
      setXAxis(xAxis + 0.15);
      setYAxis(yAxis + 0.15);
    }
  };

  const scaleDown = () => {
    if (iconHeight < 30) {
      setIconHeight(iconHeight + 4);
      setIconWidth(iconWidth + 4);
      setXAxis(xAxis - 0.15);
      setYAxis(yAxis - 0.15);
    }
  };

  const reset = () => {
    setIconHeight(30);
    setIconWidth(30);
    setXAxis(-0.4);
    setYAxis(-0.4);
    setScale(0);
    setNewScale(0.9);
  };

  const onChangeFunction = (e) => {
     setSelectedSpaceNameValue(e);
  };

  useEffect (() => {
    let occupied =0;
    let ready= 0;
    let booked= 0;
    let dataCollection;
    if(multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && multidaysAvailabilityInfo.data.length) {
      multidaysAvailabilityInfo.data.map((space) => {
        if(space.latitude !== '' || space.longitude !== '') {
          if(space.status === "Booked" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
            booked = booked + 1;
          } else if(space.status === "Ready" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
          ready = ready + 1;
          } else if(space.status === "Occupied" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
            occupied = occupied + 1;
          }
        }
      })
    }
    if(BookingData && BookingData.workStationType) {
       dataCollection = [{
        "occupied" : occupied,
        "ready": ready,
        "booked": booked,
        "workstationtype": BookingData.workStationType
      }]
    }
    setSpaceAvailabilityData(dataCollection);
  }, [multidaysAvailabilityInfo]);

  return (
    <div>
      <Row>
        <Col lg="12" sm="12" md="12">
          {!expand && (
            <Row className="mb-2">
              <Col lg={expand ? 6 : 12} sm="12" md="12">

                {multidaysAvailabilityInfo && multidaysAvailabilityInfo.err && multidaysAvailabilityInfo.err.error ? (
                  <div className="text-center text-danger mt-6 mb-5">
                    No spaces available
                  </div>
                ) : ''}
              </Col>
            </Row>
          )}
          {selectedFloor && selectedFloor.file_path && hostData !== null && !getValidation() && multidaysAvailabilityInfo && !multidaysAvailabilityInfo.err && !multidaysAvailabilityInfo.loading && (
            <>
              <Card>
                <CardHeader className="bufferBackground p-2 position-relative mapViewCard">
                  <div>
                    <TextField
                      value={selectedSpaceNameValue}
                      className="searchInputName"
                      placeholder="Search..."
                      onChange={(e) => {
                        onChangeFunction(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            <IconButton className='iconButton'>
                              <SearchIcon className="searchIcon iconButton" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }} />
                  </div>
                </CardHeader>
                <Row className="mx-2">
                  {multidaysAvailabilityInfo && !multidaysAvailabilityInfo.loading && !multidaysAvailabilityInfo.err && (
                    <>
                      {workSpaceCount && workSpaceCount.length === 0 ? (
                        <div className="text-center text-danger no-spaces-text">No spaces available for booking</div>
                      ) : (
                        <>
                          <Col lg="12" sm="12" md="12">
                            <TransformWrapper
                              centerOnInit
                              onZoom={wheels}
                              // maxScale={4}
                              doubleClick={{ disabled: true }}
                            >
                              {({
                                zoomIn, zoomOut, resetTransform, ...rest
                              }) => (
                                <>
                                  <div className="zommcontrols">
                                    <Tooltip title="Reset" placement="right">
                                      <img src={resetIcon} alt="reset" onClick={() => { resetTransform(); reset(); }} width="19" height="19" className="cursor-pointer mr-2 mt-2 ml-3" id="reset" data-testid="reset" />
                                    </Tooltip>
                                    <Tooltip title="Zoom In" placement="right">
                                      <img src={plusIcon} alt="zoomIn" onClick={() => { zoomIn(); scaleUp(); }} width="19" height="19" className="cursor-pointer mr-2 mt-2 ml-3" id="zoomIn" data-testid="zoomIn" />
                                    </Tooltip>
                                    <Tooltip title="Zoom Out" placement="right">
                                      <img src={minusIcon} alt="zoomOut" onClick={() => { zoomOut(); scaleDown(); }} width="19" height="19" className="cursor-pointer mr-2 my-2 ml-3" id="zoomOut" data-testid="zoomOut" />
                                    </Tooltip>
                                    <Tooltip title={expand ? 'Collapse' : 'Expand'} placement="right">
                                      <span className="expand-margin-left">
                                        <FontAwesomeIcon onClick={() => { setExpandView(!(expandView)); dispatch(setMapExpansionInfo(!expand)); setExpanding(!expand); resetTransform(); reset(); }} icon={expand ? faCompress : faExpand} size="lg" width="20" height="20" className="cursor-pointer icon-outline-none" id="expand" />
                                      </span>
                                    </Tooltip>
                                  </div>
                                  <TransformComponent>
                                    <svg
                                      id="map-overview"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 840 606"
                                      className="injected-svg"
                                      preserveAspectRatio="none"
                                    >
                                      <image
                                        href={`${apiURL}${selectedFloor.file_path.replace('+xml', '')}`}
                                        height="100%"
                                        width="100%" />
                                      {multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && multidaysAvailabilityInfo.data.length > 0 && multidaysAvailabilityInfo.data.map((workSpace, index) => (
                                        <>
                                        {workSpace.longitude !== '' && workSpace.latitude !== '' && (
                                        <React.Fragment key={workSpace.id}>
                                          {((workSpace.longitude !== 0 || workSpace.longitude !== '') && (selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 ? workSpace.space_name.toLowerCase().includes(selectedSpaceNameValue?selectedSpaceNameValue.toLowerCase():selectedSpaceNameValue) : workSpace.space_name))
                                           && ((workSpace.latitude !== 0 || workSpace.latitude !== '') && (selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 ? workSpace.space_name.toLowerCase().includes(selectedSpaceNameValue?selectedSpaceNameValue.toLowerCase():selectedSpaceNameValue) : workSpace.space_name))
                                            && (
                                              <AvailableIcon
                                                spaceIndex={`space${index}`}
                                                cx={workSpace.longitude ? workSpace.longitude : undefined}
                                                cy={workSpace.latitude ? workSpace.latitude : undefined}
                                                workSpaceInfo={workSpace}
                                                treeBookingType={treeBookingType}
                                                employeesForWorkStation={employeesForWorkStation}
                                                setSelectedEmployeeToWorkStation={setSelectedEmployeeToWorkStation}
                                                setFloorDataToSelectedSpaceView={setSelectedSpaceView}
                                                employeesForWorkStationDropDown={employeesForWorkStationDropDown}
                                                setFloorViewData={setFloorViewData}
                                                floorData={floorData}
                                                BookingData={BookingData}
                                                setFloorObject={setFloorObject}
                                                floorObject={floorObject}
                                                setEmployeesForWorkStation={setEmployeesForWorkStation}
                                                setSelectErrMsg={setSelectErrMsg}
                                                selectErrMsg={selectErrMsg}
                                                dropDownEmployees={dropDownEmployees}
                                                iconHeight={iconHeight}
                                                spacesTrue={spacesTrue}
                                                iconWidth={iconWidth}
                                                xAxis={xAxis}
                                                yAxis={yAxis} />
                                            )}
                                        </React.Fragment>
                                        )}
                                        </>
                                      ))}
                                    </svg>
                                  </TransformComponent>
                                </>
                              )}
                            </TransformWrapper>
                          </Col>
                        </>
                      )}
                    </>
                  )}
                </Row>
              </Card>
            </>
          )}
        </Col>
        <Col lg={expand ? 12 : 6} sm="12" md="12">
          {/* {floorObject && floorObject.length > 0 ? (
            <Col lg="12" sm="12" md="12" className="selectedSpace bg-buffer pl-0 pr-0">
              <SelectedSpaceView
                workSpace={floorObject}
                removeNodeWithEmployee={removeNodeWithEmployee}
                updateWorkSpace={updateWorkSpace}
                colSize
                expand={expand}
              />
            </Col>
          ) : null} */}
        </Col>
      </Row>
      {capsLimitInfo && capsLimitInfo.err && capsLimitInfo.err.error && (
        <Row className="text-danger ml-5">
          <div className="ml-5">
            <FontAwesomeIcon className="mr-2 font-size-20px mb-n2px" size="sm" icon={faExclamationCircle} />
            {capsLimitInfo.err.error.message}
          </div>
        </Row>
      )}
      {
        loading && (
          <div className="text-center" data-testid="loader">
            <Loader />
          </div>
        )
      }
      {capLimitModal && (
        <div>
          <CapLimitModalWindow setSpacesTrue={setSpacesTrue} setSelectedFloor={setSelectedFloor} capLimitModal={capLimitModal} setEmployeesForWorkStation={setEmployeesForWorkStation} setCapLimitModal={setCapLimitModal} capsLimitInfo={capsLimitInfo} />
        </div>
      )}
    </div>
  );
};

FloorViewLayout.propTypes = {
  workSpaceSelect: PropTypes.func.isRequired,
  floorId: PropTypes.number,
  setExpantion: PropTypes.func.isRequired,
  getGroupWorkStations: PropTypes.func,
  BookingData: PropTypes.shape({
    site: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      planned_in: PropTypes.string,
      planned_out: PropTypes.string,
      custom_planned_in: PropTypes.string,
      custom_planned_out: PropTypes.string,
    }),
    workStationType: PropTypes.shape({
      enableBookingCap: PropTypes.bool,
      id: PropTypes.number,
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
  treeBookingType: PropTypes.string,
  setEmployees: PropTypes.func,
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ]),
};

FloorViewLayout.defaultProps = {
  getGroupWorkStations: undefined,
  floorId: undefined,
  treeBookingType: '',
  category: undefined,
  setEmployees: () => { },
};

export default FloorViewLayout;
