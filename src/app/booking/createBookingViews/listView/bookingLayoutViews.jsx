/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Input, Button,
} from 'reactstrap';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FontAwesomeIconComponent from '@shared/fontAwesomeIconComponent';
import { Tooltip } from 'antd';
import Switch from '@material-ui/core/Switch';
import { faPlusCircle } from '@images/icons/fontAwesomeIcons';
import pull from 'lodash/pull';
import filter from 'lodash/filter';
import CustomRadio from '@shared/customRadioButton';
import BookingModalWindow from '../../createBooking/bookingModalWindow';
import {
  TextField, Paper, Divider,
} from '@material-ui/core';
import { matchSorter } from 'match-sorter';
import Autocomplete from '@material-ui/lab/Autocomplete';
import  editDate from '@images/editDate.svg';
import SaveGuestModal from '../../createBooking/saveGuestModal';
import DisplayTimezone from '../../../shared/timezoneDisplay';
import '../../booking.scss';
import {
  setParticipantslist, setGuestlist, addGuestData, setErrorMessage, setSelectedHost,
  clearCapLimitData, setDisableFields,
} from '../../bookingService';
import { getGuestList } from '../../../userProfile/userProfileService';

import getAllEmployees from '../treeView/layoutTreeViewService';
import { noSpecialChars, StringsMeta, getMomentFormat, getHoursMins } from '../../../util/appUtils';

const BookingLayoutViews = ({
  BookingData, workSpaceSelect, viewType, setBookingType, floorId, expantion,
}) => {
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const AvailableSpaces = useSelector((state) => state.bookingInfo.workStations);
  const {
    multidaysAvailabilityInfo, mapExpansionInfo, disableFields, guestSaveInfo,
  } = useSelector((state) => state.bookingInfo);
  // const { userRoles } = useSelector((state) => state.config);
  const addGuestInfo = useSelector((state) => state.bookingInfo.addGuestInfo);
  const [selectedValue, setSelectedValue] = useState('individual');
  const [disableAddGuest, setDisableAddGuest] = useState(false);
  const dispatch = useDispatch();
  // For building selected workstations with employees
  const [spacesTrue, setSpacesTrue] = useState(false);
  const {
    employees, capsLimitInfo, guestListInfo, refreshInfo,
  } = useSelector((state) => state.bookingInfo);
  // For building selected workstations with employees
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [buildTreeData, setTreeData] = useState([]);
  const [selecteEmployeeIds, setSelectedEmp] = useState([]);
  const [guestKeyword, setGuestKeyword] = useState('');
  const [guestOptions, setGuestOptions] = useState([]);
  const [guestData, setGuestData] = useState([]);
  const [hostData, setHostData] = useState('');
  const [participantsData, setParticipantsData] = useState([]);
  const [participantOptions, setParticipantOptions] = useState([]);
  const [hostopen, setHostOpen] = useState(false);
  const [partcipantsOpen, setParticipantsOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [empKeyword, setEmpKeyword] = useState('');
  const [addGuest, setAddGuest] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [individualGuest, setIndividualGuest] = useState('');
  const [isOpen, openCloseModal] = useState(false);
  const {
    floorView,
  } = useSelector((state) => state.bookingInfo);
  

  const filterOptions = (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['employee_ref', 'work_email', 'name', 'email'] });

  useEffect(() => {
    if (guestSaveInfo && guestSaveInfo.data && hostData) {
      dispatch(getGuestList(hostData.id, guestKeyword));
    }
  }, [guestSaveInfo, hostData]);

  useEffect(() => {
    if (hostopen && userInfo &&userInfo.data && userInfo.data.company) {
      dispatch(getAllEmployees(empKeyword));
    }
  }, [hostopen, empKeyword]);

  useEffect(() => {
    if (selectedValue) {
      dispatch(addGuestData(false));
    }
  }, [selectedValue]);

  useEffect(() => {
    if (hostData) {
      dispatch(setSelectedHost(hostData));
    } else {
      dispatch(setSelectedHost(null));
    }
  }, [hostData, userInfo]);

  useEffect(() => {
    if (addGuestInfo && addGuestInfo.data && hostData) {
      dispatch(clearCapLimitData());
      dispatch(getGuestList(hostData.id, guestKeyword));
    }
  }, [addGuestInfo, hostData, guestKeyword]);

  useEffect(() => {
    if (partcipantsOpen && userInfo &&userInfo.data && userInfo.data.company && hostData) {
      dispatch(getAllEmployees(empKeyword));
    }
  }, [empKeyword, partcipantsOpen, hostData]);

  useEffect(() => {
    if (guestData && guestData.length > 0) {
      dispatch(setGuestlist(guestData));
    } else if (individualGuest) {
      dispatch(setGuestlist(individualGuest));
    } else if (individualGuest === '' || (guestData && guestData.length === 0)) {
      dispatch(setGuestlist([]));
    }
  }, [guestData, individualGuest, addGuestInfo, selectedValue]);

  useEffect(() => {
    if (participantsData && participantsData.length >= 0) {
      dispatch(setParticipantslist(participantsData));
    } else {
      dispatch(setParticipantslist([]));
    }
  }, [participantsData, individualGuest]);

  useEffect(() => {
    if (selectedValue || addGuestInfo || viewType) {
      dispatch(setDisableFields(false));
    }
  }, [selectedValue, addGuestInfo, viewType]);

  useEffect(() => {
    if (addGuestInfo) {
      setAddGuest(false);
      setGuestKeyword('');
      setIndividualGuest('');
      const guestList = [];
      dispatch(setGuestlist(guestList));
      setGuestData([]);
      setTreeData([]);
      setSelectedEmp([]);
      setSelectedNodes([]);
    }
  }, [addGuestInfo, selectedValue]);

  useEffect(() => {
    const List = [];
    dispatch(setParticipantslist(List));
    setParticipantsData([]);
    dispatch(setGuestlist(List));
    dispatch(setDisableFields(false));
    setGuestData([]);
    setIndividualGuest('');
    setTreeData([]);
    setSelectedEmp([]);
    setSelectedNodes([]);
  }, [refreshInfo]);

  useEffect(() => {
    if (guestListInfo && guestListInfo.err && guestListInfo.err.data && guestListInfo.err.data.length === 0) {
      setAddGuest(true);
    }
  }, [guestListInfo]);

  useEffect(() => {
    if (capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length === 0) {
      setSpacesTrue(true);
    }
  }, [capsLimitInfo]);

  useEffect(() => {
    if (selectedValue) {
      setHostData({
        ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, value_email: userInfo.data.email, type: 'host', is_host: true, id: userInfo.data.employee.id, name: userInfo.data.employee.name,
      });
      setParticipantsData([]);
      setGuestData([]);
      setIndividualGuest('');
      dispatch(clearCapLimitData());
    }
  }, [selectedValue]);

  useEffect(() => {
    if (participantsData && !participantsData.length && selectedValue === 'group') {
      const message = StringsMeta.PARTICIPANTS_NOT_SELECTED_MESSAGE;
      dispatch(setErrorMessage(message));
    } else {
      dispatch(setErrorMessage(false));
    }
  }, [selectedValue, participantsData]);

  // useEffect(() => {
  //   if (partcipantsOpen && userInfo && userInfo.data.company && hostData) {
  //     dispatch(getAllEmployees(userInfo.data.company.id, empKeyword, hostData.id));
  //   }
  // }, [empKeyword, partcipantsOpen, hostData]);

  useEffect(() => {
    if (employees && employees.length && partcipantsOpen) {
      setParticipantOptions(employees);
    } else if (employees && employees.loading) {
      setParticipantOptions([{ name: 'Loading...', work_email: '' }]);
    } else {
      setParticipantOptions([]);
    }
  }, [employees, partcipantsOpen]);

  useEffect(() => {
    if (employees && employees.length && hostopen) {
      setEmployeeOptions(employees);
    } else if (employees && employees.loading) {
      setEmployeeOptions([{ name: 'Loading...', work_email: '' }]);
    } else {
      setEmployeeOptions([]);
    }
  }, [employees, hostopen]);

  useEffect(() => {
    if (userInfo) {
      const selectedHost = [{
        ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, type: 'host', is_host: true, id: userInfo.data.employee.id, name: userInfo.data.employee.name,
      }];
      dispatch(clearCapLimitData());
      setHostData(selectedHost);
    }
  }, [userInfo]);

  useEffect(() => {
    if (viewType) {
      setHostData({
        ...userInfo.data.employee, value: userInfo.data.employee.name, label: userInfo.data.employee.name, value_email: userInfo.data.email, label1: userInfo.data.email, type: 'host', is_host: true, name: userInfo.data.employee.name,
      });
      dispatch(clearCapLimitData());
    }
  }, []);

  useEffect(() => {
    if (guestListInfo.data && guestListInfo.data.length) {
      setGuestOptions(guestListInfo.data);
    } else if (guestListInfo && guestListInfo.loading) {
      setGuestOptions([{ name: 'Loading...', email: '' }]);
    } else {
      setGuestOptions([]);
    }
  }, [guestListInfo]);

  const openBookingModalWindow = () => {
    openCloseModal(!isOpen);
  };

  const handleHost = (options, action, dataType) => {
    if (options && options.name && options.name === 'Loading...') {
      setHostData({});
    } else {
      if (options && options.id) {
        options.type = dataType.type;
        options.is_host = true;
      }
      setParticipantsData([]);
      setGuestData([]);
      setGuestKeyword('');
      setIndividualGuest('');
      setHostData(options);
      setTreeData([]);
      setSelectedNodes([]);
      setSelectedEmp([]);
    }
  };

  const selectWorkSpace = (index) => {
    workSpaceSelect(AvailableSpaces[index]);
  };

  const handleParticipants = (options, action, value, dataType) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    if (options && options.length) {
      options.map((guest) => {
        guest.type = dataType.type;
      });
    }
    setParticipantsData(options);
    if (action === 'remove-option') {
      const removeEmployeeFromTreeData = filter(
        buildTreeData,
        (workspace) => workspace.employee.id !== value.option.id,
      );
      setTreeData(removeEmployeeFromTreeData);
      let selectNode = [...selectedNodes];
      const removeNode = filter(buildTreeData, (node) => node.employee.id === value.option.id);
      selectNode = pull(selectNode, removeNode[0] && removeNode[0].id);
      setSelectedNodes(selectNode);
      let selectEmployeeIds = [...selecteEmployeeIds];
      selectEmployeeIds = pull(selectEmployeeIds, value.option.id);
      setSelectedEmp(selectEmployeeIds);
    } else if (action === 'clear') {
      const removeEmployeeFromTreeData = filter(
        buildTreeData,
        (workspace) => workspace.employee.type !== dataType.type,
      );
      setTreeData(removeEmployeeFromTreeData);
      let selectNode = [...selectedNodes];
      const removeNode = filter(buildTreeData, (node) => node.employee.type === dataType.type);
      const empIds = [];
      if (removeNode && removeNode.length) {
        removeNode.map((emp) => {
          empIds.push(emp.id);
        });
        selectNode = selectNode.filter((el) => !empIds.includes(el));
        setSelectedNodes(selectNode);
        let selectEmployeeIds = [...selecteEmployeeIds];
        selectEmployeeIds = selectEmployeeIds.filter((el) => !empIds.includes(el));
        setSelectedEmp(selectEmployeeIds);
      }
    }
  };

  const addGuestModal = ({ children }) => (
    <Paper className="guest-paper">
      {children}
      <Divider variant="middle" />
      <div className="d-flex justify-content-center p-2">
        <Button
          className="roundCorners btn-secondary add-guest-btn text-white  btn btn-outline-secondary btn-sm"
          onMouseDown={(event) => { event.preventDefault(); }}
          onClick={() => setGuestModalOpen(!guestModalOpen)}
        >
          <FontAwesomeIconComponent faIcon={faPlusCircle} iconStyles="mr-1" />
          Add Guest
        </Button>
      </div>
    </Paper>
  );

  useEffect(() => {
    if (multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading) {
      setDisableAddGuest(true);
    } else {
      setDisableAddGuest(false);
    }
  }, [multidaysAvailabilityInfo]);

  const setTypeOfBooking = (event) => {
    setSelectedValue(event.target.value);
    setBookingType(event.target.value);
  };

  let availSpace;
  let spaceAvail;
  if (viewType === 'list' && AvailableSpaces) {
    availSpace = AvailableSpaces.slice(0, 20).map((space, index) => {
      if (space.availability_status) {
        return (
          <Row className="my-2" key={space.id}>
            <Col sm="12">
              <h4>
                {space.space_name}
                <span className="float-right">
                  <Input type="radio" name="radio2" onClick={() => selectWorkSpace(index)} />
                </span>
              </h4>
              <div className={`${space.availability_status ? 'text-success' : ''}`}>
                Ready to occupy
              </div>
            </Col>
          </Row>
        );
      }
      return undefined;
    });
    spaceAvail = (
      <h4>
        Available spaces :
      </h4>
    );
  }
  const getShiftTime = (shiftTime) => getHoursMins(shiftTime);
  const plannedInData = BookingData && BookingData.site && BookingData.site.planned_in;
  const plannedOutData = BookingData && BookingData.site && BookingData.site.planned_out;
  const handleGuest = (options, action, value, dataType) => {
    if (selectedValue === 'individual') {
      if (options && options.name && options.name === 'Loading...') {
        setIndividualGuest({});
      } else if (options) {
        const individualGuestData = options;
        individualGuestData.type = dataType.type;
        individualGuestData.is_host = true;
        individualGuestData.is_guest = true;
        individualGuestData.visitor_ids = [individualGuestData.id];
        setIndividualGuest(individualGuestData);

        const removeEmployeeFromTreeData = filter(
          buildTreeData,
          (workspace) => workspace.employee.type !== dataType.type,
        );
        setTreeData(removeEmployeeFromTreeData);
        let selectNode = [...selectedNodes];
        const removeNode = filter(buildTreeData, (node) => node.employee.type === dataType.type);
        const empIds = [];
        if (removeNode && removeNode.length) {
          removeNode.map((emp) => {
            empIds.push(emp.id);
          });
          selectNode = selectNode.filter((el) => !empIds.includes(el));
          setSelectedNodes(selectNode);
          let selectEmployeeIds = [...selecteEmployeeIds];
          selectEmployeeIds = selectEmployeeIds.filter((el) => !empIds.includes(el));
          setSelectedEmp(selectEmployeeIds);
        }
      } else {
        setIndividualGuest('');
      }
    } else {
      if (options && options.length && options.find((option) => option.name === 'Loading...')) {
        return false;
      }
      if (options && options.length) {
        options.map((guest) => {
          guest.type = dataType.type;
          guest.is_guest = true;
          guest.visitor_ids = [guest.id];
        });
      }
      setGuestData(options);
    }
    if (action === 'remove-option') {
      const removeEmployeeFromTreeData = filter(
        buildTreeData,
        (workspace) => workspace.employee.id !== value.option.id,
      );
      setTreeData(removeEmployeeFromTreeData);

      let selectNode = [...selectedNodes];
      const removeNode = filter(buildTreeData, (node) => node.employee.id === value.option.id);
      selectNode = pull(selectNode, removeNode[0] && removeNode[0].id);
      setSelectedNodes(selectNode);
      let selectEmployeeIds = [...selecteEmployeeIds];
      selectEmployeeIds = pull(selectEmployeeIds, value.option.id);
      setSelectedEmp(selectEmployeeIds);
    } else if (action === 'clear') {
      const removeEmployeeFromTreeData = filter(
        buildTreeData,
        (workspace) => workspace.employee.type !== dataType.type,
      );
      setTreeData(removeEmployeeFromTreeData);
      let selectNode = [...selectedNodes];
      const removeNode = filter(buildTreeData, (node) => node.employee.type === dataType.type);
      const empIds = [];
      if (removeNode && removeNode.length) {
        removeNode.map((emp) => {
          empIds.push(emp.id);
        });
        selectNode = selectNode.filter((el) => !empIds.includes(el));
        setSelectedNodes(selectNode);
        let selectEmployeeIds = [...selecteEmployeeIds];
        selectEmployeeIds = selectEmployeeIds.filter((el) => !empIds.includes(el));
        setSelectedEmp(selectEmployeeIds);
      }
    }
  };

  let myBookingModal;
  if (isOpen) {
    myBookingModal = (
      <BookingModalWindow
        shiftModalWindowOpen={isOpen}
        openModalWindow={openBookingModalWindow}
        bookingData={BookingData}
        viewType={viewType}
        filter
      />
    );
  }

  const setKeywordForEmployee = (e) => {
    if (e && e.target && e.target.value && e.target.value.length > 2) {
      setEmpKeyword(e.target.value);
    } else {
      setEmpKeyword('');
    }
  };

  const setKeywordForGuest = (e) => {
    if (e && e.target && e.target.value && e.target.value.length > 2) {
      setGuestKeyword(e.target.value);
    } else {
      setGuestKeyword('');
    }
  };

  return (
    <>
      {!mapExpansionInfo && (
        <div lg="12" sm="12">
          <Row>
            <Col sm="12">
              <Row className="ml-0 date-text-color">
                <h4 className="date-text-color text-capitalize font-weight-800">
                  {getMomentFormat(plannedInData, 'dddd D  MMMM YYYY')}
                </h4>
                &nbsp;
                -
                &nbsp;
                <h4 className="date-text-color text-capitalize font-weight-800">
                  {getMomentFormat(plannedOutData, 'dddd D  MMMM YYYY')}
                </h4>
                <Tooltip title="Date/Time" placement="top">
                  <img
                    src={editDate}
                    className="calendarIcon ml-1"
                    alt="images"
                    width="10"
                    height="10"
                    onClick={openBookingModalWindow}
                  />
                </Tooltip>
              </Row>
              {BookingData && BookingData.site && (
                <div className="font-weight-500 time-texts-color">
                  {BookingData.site && BookingData.site.customShift ? '' : (
                    <>
                      Shift
                      {' '}
                      {BookingData.site.name}
                      ,
                    </>
                  )}
                  <span className={BookingData.site && BookingData.site.customShift ? '' : 'ml-2'}>
                    {getShiftTime(BookingData.site.planned_in.split(' ')[1])}
                    {' '}
                    <DisplayTimezone />
                    {' '}
                    -
                    {' '}
                    {getShiftTime(BookingData.site.planned_out.split(' ')[1])}
                    {' '}
                    <DisplayTimezone />
                  </span>
                  {' '}
                  ,
                  {' '}
                  {BookingData && BookingData.workStationType && BookingData.workStationType.name}
                </div>
              )}
            </Col>
            <Col sm="7">
              {spaceAvail}
              {availSpace}
            </Col>
          </Row>
          <Row sm="12" md="12" lg="12">
            <Col sm="8" md="4" lg="4" className="pl-1 pr-0 individual-text-color">
              <CustomRadio
                checked={selectedValue === 'individual'}
                onChange={setTypeOfBooking}
                disabled={disableAddGuest}
                value="individual"
                data-testid="individual"
                color="default"
              />
              Individual
            </Col>
            {userRoles && userRoles.data && userRoles.data.group_booking && userRoles.data.group_booking.enable_group_booking ? (
              <Col sm="8" md="4" lg="4" className="pl-0 pr-0 group-text-color">
                <CustomRadio
                  checked={selectedValue === 'group'}
                  onChange={setTypeOfBooking}
                  value="group"
                  data-testid="group"
                  color="default"
                  disabled={disableAddGuest}
                />
                Group
              </Col>
            )
              : <Col sm="8" md="4" lg="4" className="pl-0 pr-0" />}
            {userRoles && userRoles.data && userRoles.data.enable_guest_booking
              ? (
                <Col sm="8" md="4" lg="4" className="pl-0 pr-0">
                  <Typography component="div" className="float-md-right mt-2 mb-3 ml-2 ml-md-0">
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>
                        <Switch
                          color="primary"
                          disabled={disableAddGuest}
                          checked={!!(addGuestInfo && addGuestInfo.data)}
                          onClick={() => dispatch(addGuestData(!addGuestInfo.data))}
                          name="checked"
                        />
                        <span className="add-guest-text">Add a Guest</span>
                      </Grid>
                    </Grid>
                  </Typography>
                </Col>
              )
              : ''}
          </Row>
        </div>
      )}
      { !expantion && (
        <Row className="mb-2">
          <Col sm="12" md="12" lg="12" className="d-block pr-0">
            <div>
              <Autocomplete
                name="host"
                label="hostField"
                open={hostopen}
                size="small"
                onOpen={() => {
                  setHostOpen(true);
                  setEmpKeyword('');
                }}
                disableClearable={!hostData}
                value={hostData && hostData.name ? `${hostData.name}` : hostData}
                onClose={() => {
                  setHostOpen(false);
                  setEmpKeyword('');
                }}
                disabled={disableFields === true}
                filterOptions={filterOptions}
                onChange={(e, dataItem, action) => handleHost(dataItem, action, { type: 'host' })}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                renderOption={(option) => (
                  <>
                    <p className="font-weight-600 mb-0">
                      {option && option.name}
                    </p>
                    <p className="float-left light-text">
                      {option && option.work_email && (
                        ` ${option && option.work_email}`
                      )}
                    </p>
                    <p className="float-right light-text">
                      {option && option.employee_ref}
                    </p>
                  </>
                )}
                options={employeeOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Host"
                    variant="outlined"
                    placeholder="Select Host"
                    className="without-padding custom-icons"
                    onChange={setKeywordForEmployee}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {selectedValue !== 'individual' && (
                <div className="mt-2">
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    name="participants"
                    label="participantsField"
                    open={partcipantsOpen}
                    size="small"
                    onOpen={() => {
                      setParticipantsOpen(true);
                      setEmpKeyword('');
                    }}
                    onClose={() => {
                      setParticipantsOpen(false);
                      setEmpKeyword('');
                    }}
                    value={participantsData}
                    disabled={!hostData || disableFields}
                    filterOptions={filterOptions}
                    getOptionDisabled={(option) => option.id === hostData.id}
                    onChange={(e, options, action, value) => handleParticipants(options, action, value, { type: 'participant' })}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    renderOption={(option) => (
                      <>
                        <p className="font-weight-600 mb-0">
                          {option && option.name}
                        </p>
                        <p className="float-left light-text">
                          {option && option.work_email && (
                            ` ${option && option.work_email}`
                          )}
                        </p>
                        <p className="float-right light-text">
                          {option && option.employee_ref}
                        </p>
                      </>
                    )}
                    options={participantOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Participants"
                        className="without-padding custom-icons"
                        placeholder="Search & Select Participants"
                        onChange={setKeywordForEmployee}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              )}
              {addGuestInfo && addGuestInfo.data && (
                <div className="mt-2">
                  <Autocomplete
                    PaperComponent={addGuestModal}
                    multiple={selectedValue !== 'individual'}
                    filterSelectedOptions={selectedValue !== 'individual'}
                    name="guest"
                    disableClearable={!((individualGuest || (guestData && guestData.length && guestData.length >= 1)))}
                    noOptionsText="No Guests found"
                    label="guestField"
                    open={guestsOpen}
                    size="small"
                    onOpen={() => {
                      setGuestsOpen(true);
                      setGuestKeyword('');
                      setAddGuest(false);
                    }}
                    onClose={() => {
                      setGuestsOpen(false);
                      setGuestKeyword('');
                    }}
                    disabled={!hostData || disableFields === true}
                    filterOptions={filterOptions}
                    value={selectedValue !== 'individual' ? guestData : individualGuest}
                    onChange={(e, options, action, value) => handleGuest(options, action, value, { type: 'guest' })}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    renderOption={(option) => (
                      <>
                        <p className="font-weight-600 mb-0">
                          {option && option.name}
                        </p>
                        <p className="float-left light-text">
                          {option && option.email && (
                            `${option && option.email}`
                          )}
                        </p>
                      </>
                    )}
                    options={guestOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Guests"
                        className="without-padding custom-icons"
                        placeholder="Search or Add Guest"
                        onChange={setKeywordForGuest}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </Col>
          {/* {selectedValue !== 'individual' && BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
          <span className="light-text ml-3 mt-1">
            Select the
            <span className="ml-2 font-weight-700 text-lowercase mr-2">
              {BookingData && BookingData.workStationType && BookingData.workStationType.name}
            </span>
            {' '}
            for  minimum
            <span className="ml-2 font-weight-700 text-lowercase mr-2">
              {multiSelectedEmployees && multiSelectedEmployees.length}
            </span>
            or more than
            <span className="ml-2 font-weight-700 text-lowercase mr-2">
              {multiSelectedEmployees && multiSelectedEmployees.length}
            </span>
            occupants
          </span>
        )} */}
          {guestModalOpen && (
            <SaveGuestModal
              guestModalOpen={guestModalOpen}
              setGuestModalOpen={setGuestModalOpen}
            />
          )}
          {myBookingModal}
        </Row>
      )}
    </>
  );
};

BookingLayoutViews.propTypes = {
  floorId: PropTypes.number,
  expantion: PropTypes.bool,
  BookingData: PropTypes.shape({
    site: PropTypes.shape({
      id: PropTypes.number,
      customShift: PropTypes.bool,
      planned_in: PropTypes.string,
      planned_out: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    workStationType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.array,
  }).isRequired,
  workSpaceSelect: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  setBookingType: PropTypes.func,
};

BookingLayoutViews.defaultProps = {
  floorId: undefined,
  expantion: null,
  setBookingType: () => { },
};

export default BookingLayoutViews;
