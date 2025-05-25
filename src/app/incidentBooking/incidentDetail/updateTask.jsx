/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import JoditEditor from 'jodit-react';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  FormGroup,
  Label,
  Row
} from 'reactstrap';

import TrackerCheck from '@images/icons/incidentManagement.svg';
import DialogHeader from '../../commonComponents/dialogHeader';
import DrawerHeader from "../../commonComponents/drawerHeader";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import {
  getTeamMember,
} from '../../auditSystem/auditService';
import {
  extractOptionsObject,
  extractValueObjects,
  getAllowedCompanies,
  getDateTimeUtc
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import {
  getHxTaskTypes,
  resetUpdateIncidentInfo,
  updateIncident,
} from '../ctService';
import AdvancedSearchModal from '../forms/advancedSearchModal';


import { FormControl, TextField } from "@mui/material";
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import checkoutFormModel from '../formModel/checkoutFormModel';
const { formField } = checkoutFormModel;

const appModels = require('../../util/appModels').default;

const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: selectedColor,
    textTransform: 'capitalize',
  }
}));

const UpdateTask = (props) => {
  const {
    detailData, actionModal, atCancel, displayName, dataId, type, inspDeata
  } = props;
  const dispatch = useDispatch();
  let editor = useRef(null);
  const [modal, setModal] = useState(actionModal);

  const [statusOpen, setStatusOpen] = useState(false);

  const [statusLabel, setStatusLabel] = useState(detailData.state);

  const [desc, setDesc] = useState(detailData.description ? detailData.description : '');

  const [assignMember, setAssignMember] = useState(detailData.assigned_id);


  const [assignType, setAssignType] = useState(detailData.task_type_id);

  const [title, setTitle] = useState(detailData.name);

  const [teamMemberOpen, setTeamMemberOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);


  const { userInfo } = useSelector((state) => state.user);

  const defaulttargetDate = detailData.target_date ? dayjs(moment.utc(detailData.target_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;

  const [targetDate, setTargetDate] = useState(defaulttargetDate);

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const onChange = (data) => {
    setDesc(data);
  };

  const { updateIncidentInfo, hxTaskTypes } = useSelector((state) => state.hxIncident);

  const companies = getAllowedCompanies(userInfo);

  const editorConfig = useMemo(() => ({
    uploader: {
      insertImageAsBase64URI: true, // Insert images as base64 URIs
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image extensions
      imageMaxSize: 1024 * 1024, // Maximum image size in bytes (1 MB)
    },
    spellcheck: true,
    height: 200,
    minHeight: 200,
    autofocus: true,
    allowResizeY: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,add-new-line',
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: 'eraser,ul,ol,image,table,link,undo,redo,fullsize',
    events:
           {
             afterInit: (instance) => { editor = instance; },
           },
  }), []);

  const editorReadConfig = {
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,inline-popup,add-new-line',
    height: 200,
    minHeight: 100,
  };

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if (teamMemberOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamMemberKeyword));
    }
  }, [teamMemberKeyword, teamMemberOpen]);

  useEffect(() => {
    if (typeOpen) {
      let domain = `["company_id","=",${userCompanyId}]`;
      if (teamMemberKeyword) {
        domain = `${domain},["name","ilike","${teamMemberKeyword}"]`;
      }
      dispatch(getHxTaskTypes(domain, appModels.HXTASKTYPE));
    }
  }, [typeKeyword, typeOpen]);

  useEffect(() => {
    let domain = `["company_id","=",${userCompanyId}]`;
    if (teamMemberKeyword) {
      domain = `${domain},["name","ilike","${teamMemberKeyword}"]`;
    }
    dispatch(getHxTaskTypes(domain, appModels.HXTASKTYPE));
  }, [type]);

  useEffect(() => {
    if ((!assignType || (assignType && !assignType.id)) && hxTaskTypes && hxTaskTypes.data && hxTaskTypes.data.length) {
      setAssignType(hxTaskTypes.data[0]);
    }
  }, [hxTaskTypes]);

  const handleStateChange = (id) => {
    let postData = {
      analysis_ids: [[1, id, {
        name: title, target_date: targetDate || false, task_type_id: extractValueObjects(assignType), assigned_id: extractValueObjects(assignMember), state: statusLabel, description: desc,
      }]],
    };
    if (type === 'add') {
      postData = {
        analysis_ids: [[0, 0, {
          name: title, target_date: targetDate ? getDateTimeUtc(targetDate) : false, task_type_id: extractValueObjects(assignType), assigned_id: extractValueObjects(assignMember), state: statusLabel, description: desc,
        }]],
      };
    }
    dispatch(updateIncident(dataId, appModels.HXINCIDENT, postData));
  };

  const onDataEditStatusChange = (event) => {
    const { checked, value } = event.target;
    if (value) {
      setStatusLabel(value);
    }
  };

  const onDataEditTitleChange = (e) => {
    console.log(e);
    setTitle(e.target.value);
  };

  const onDataEditMemberChange = (e) => {
    console.log(e);
    setAssignMember(e);
  };

  const onDataEditTypeChange = (e) => {
    console.log(e);
    setAssignType(e);
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetUpdateIncidentInfo());
    atCancel();
  };

  const onFacilityClear = () => {
    setTeamMemberKeyword(null);
    setAssignMember('');
    setTeamMemberOpen(false);
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('assigned_id');
    setModalName('Team Members List');
    setCompanyValue(`["company_id","=",${userCompanyId}]`);
    setExtraModal(true);
    // setExtraMultipleModal(true);
  };

  const onTypeClear = () => {
    setTypeKeyword(null);
    setAssignType('');
    setTypeOpen(false);
  };

  const showTypeModal = () => {
    setModelValue(appModels.HXTASKTYPE);
    setColumns(['id', 'name']);
    setFieldName('task_type_id');
    setModalName('Types List');
    setCompanyValue('');
    setExtraModal(true);
    // setExtraMultipleModal(true);
  };

  function disabledTime(current) {
    const defaultTz = 'Asia/Kolkata';
    const tZone = userInfo.timezone ? userInfo.timezone : defaultTz;
    const startDate = moment.utc(inspDeata.incident_on).local().tz(tZone);
    if (startDate && moment(startDate).isSame(current, 'day')) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(startDate).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(startDate).hour()) {
            return minutes.filter((minute) => minute < moment(startDate).minute());
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const seconds = [];
          for (let i = 0; i < 60; i++) {
            seconds.push(i);
          }
          if (selectedHour === moment(startDate).hour() && selectedMinute === moment(startDate).minute()) {
            return seconds.filter((second) => second < moment(startDate).second());
          }
          return [];
        },
      };
    }
  }

  const options = [{ value: 'Open', label: 'Open' }, { value: 'Inprogress', label: 'Inprogress' }, { value: 'Completed', label: 'Completed' }];

  const loading = (updateIncidentInfo && updateIncidentInfo.loading);

  const teamMembersOptions = extractOptionsObject(teamMembers, assignMember);
  const typeOptions = extractOptionsObject(hxTaskTypes, assignType);

  function getOldDataId(oldData) {
    return oldData && oldData.name ? oldData.name : '';
  }

  function disableDateday(current) {
    let disable = false;
    const startDate = inspDeata.incident_on;
    if (startDate) {
      disable = current && (current < moment(startDate).subtract(1, 'day').endOf('day'));
    }
    return disable;
  }

  function disabledTime(current) {
    const defaultTz = 'Asia/Kolkata';
    const tZone = userInfo.timezone ? userInfo.timezone : defaultTz;
    const startDate = moment.utc(inspDeata.incident_on).local().tz(tZone);
    if (startDate && moment(startDate).isSame(current, 'day')) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(startDate).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(startDate).hour()) {
            return minutes.filter((minute) => minute < moment(startDate).minute());
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const seconds = [];
          for (let i = 0; i < 60; i++) {
            seconds.push(i);
          }
          if (selectedHour === moment(startDate).hour() && selectedMinute === moment(startDate).minute()) {
            return seconds.filter((second) => second < moment(startDate).second());
          }
          return [];
        },
      };
    }
  }

  function onDateChange(date) {
    if (date) {
      setTargetDate(date);
    } else {
      setTargetDate(null);
    }
  }

  return (
    <>
      {/*  <Box
      sx={{
      width: "100%",
      marginTop: "20px",
      }}
    >
      <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "3%",
                flexWrap: "wrap",
            }}
        > 

        
           <MuiTextField
        sx={{
            width: "45%",
            marginBottom: "20px",
        }}
        name={'name'}
        label={'Title'}          
        type="text"
        value={title}
        required={'Required'}        
        />
        </Box>
        </Box> */}

      <Drawer
        PaperProps={{
          sx: { width: "50%" },
        }}
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={actionModal}
      >

        <DrawerHeader
          headerName={displayName}
          imagePath={TrackerCheck}
          onClose={toggleCancel}
        />
        <Box
          sx={{
            marginTop: "20px",
            width: "100%",
          }}
        >
          {detailData && (
            <Row className="mr-3 ml-4">
              <Col md="6" xs="12" sm="12" lg="6">
                <FormControl
                  sx={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "20px",
                  }}
                  variant="standard"
                >
                  <TextField
                    type="text"
                    name="name"
                    value={title}
                    inputProps={{ maxLength: 100 }}
                    variant='standard'
                    label="Title*"
                    className='w-100'
                    onChange={(e) => onDataEditTitleChange(e)}
                  />
                </FormControl>
              </Col>
              <Col md="6" xs="12" sm="12" lg="6">
                <FormControl
                  sx={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "20px",
                  }}
                  variant="standard"
                >
                  <Autocomplete
                    name="task_type_id"
                    className="bg-white min-width-200"
                    isRequired
                    open={typeOpen}
                    size="small"
                    value={assignType && assignType.name ? assignType.name : getOldDataId(assignType)}
                    onOpen={() => {
                      setTypeOpen(true);
                      setTypeKeyword('');
                    }}
                    onClose={() => {
                      setTypeOpen(false);
                      setTypeKeyword('');
                    }}
                    disableClearable
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={typeOptions}
                    onChange={(e, data) => onDataEditTypeChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setTypeKeyword(e.target.value)}
                        variant="standard"
                        label="Type*"
                        value={typeKeyword}
                        className={((getOldDataId(assignType)) || (assignType && assignMember.id) || (typeKeyword && typeKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {hxTaskTypes && hxTaskTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((getOldDataId(assignType)) || (assignType && assignType.id) || (typeKeyword && typeKeyword.length > 0)) && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onTypeClear}
                                  >
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showTypeModal}
                                >
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Col>
              <Col md="6" xs="12" sm="12" lg="6">
                <FormControl
                  sx={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "20px",
                  }}
                  variant="standard"
                >
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={teamMemberOpen}
                    size="small"
                    value={assignMember && assignMember.name ? assignMember.name : getOldDataId(assignMember)}
                    onOpen={() => {
                      setTeamMemberOpen(true);
                      setTeamMemberKeyword('');
                    }}
                    onClose={() => {
                      setTeamMemberOpen(false);
                      setTeamMemberKeyword('');
                    }}
                    disableClearable
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={teamMembersOptions}
                    onChange={(e, data) => onDataEditMemberChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setTeamMemberKeyword(e.target.value)}
                        variant="standard"
                        value={teamMemberKeyword}
                        className={((getOldDataId(assignMember)) || (assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        label="Assigned To*"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((getOldDataId(assignMember)) || (assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onFacilityClear}
                                  >
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showFacilityModal}
                                >
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Col>
              <Col md="6" xs="12" sm="12" lg="6">
                <FormControl
                  sx={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "20px",
                  }}
                  variant="standard"
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        sx={{ width: '100%' }}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['today', 'clear'],
                          },
                          textField: { variant: 'standard' }
                        }}
                        name="targetDate"
                        label="Target Date*"
                        value={targetDate}
                        onChange={onDateChange}
                        shouldDisableDate={disableDateday}
                        shouldDisableTime={disabledTime}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
                {/*<DatePicker
                    format="DD/MM/YYYY HH:mm:ss"
                    value={targetDate ? moment(new Date(getDateTimeSeconds(targetDate)), 'DD/MM/YYYY HH:mm:ss') : ''}
                    className="w-100"
                    onChange={onDateChange}
                    disabledDate={disableDateday}
                    disabledTime={disabledTime}
                    showNow
                    showTime={{ format: 'HH:mm' }}
                />*/}
              </Col>
              <Col md="6" xs="12" sm="12" lg="6">
                <Label className="ml-1 mb-0 mt-0">
                  Status
                  <span className="text-danger ml-1">*</span>
                </Label>
                <FormGroup className="m-1 mb-4">
                  {/*<Radio.Group value={statusLabel} className="mt-2 ml-1 custom-radio-group" onChange={onDataEditStatusChange}>
                    <Radio.Button value="Open">Open</Radio.Button>
                    <Radio.Button value="Inprogress">Inprogress</Radio.Button>
                    <Radio.Button value="Completed">Completed</Radio.Button>
              </Radio.Group>*/}
                  <ToggleButtonGroup sx={{ maxHeight: '28px' }}
                    exclusive size="small" onChange={onDataEditStatusChange} value={statusLabel} buttonStyle="solid">
                    <ToggleButton value="Open" sx={{ textTransform: 'capitalize' }} selectedColor={AddThemeColor({}).color}>Open</ToggleButton>
                    <ToggleButton value="Inprogress" sx={{ textTransform: 'capitalize' }} selectedColor={AddThemeColor({}).color}>Inprogress</ToggleButton>
                    <ToggleButton value="Completed" sx={{ textTransform: 'capitalize' }} selectedColor={AddThemeColor({}).color}>Completed</ToggleButton>
                  </ToggleButtonGroup>
                </FormGroup>
              </Col>
              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>Summary</Label>
                  <div className="editor-form-content hidden-scrollbar">
                    <JoditEditor
                      ref={editor}
                      value={desc}
                      config={editorConfig}
                      // onChange={onChange}
                      onBlur={onChange}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          )}
          <hr />
          <div className={`bg-lightblue ${actionModal ? 'sticky-button-50drawer' : ''}`}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !(title && assignType && targetDate)}
              className="submit-btn"
              onClick={() => handleStateChange(detailData.id)}
            >
              {type === 'edit' ? 'Update' : 'Add'}
            </Button>
          </div>
        </Box>
        <Dialog size="lg" fullWidth open={extraModal}>
          <DialogHeader title={modalName} onClose={() => { setExtraModal(false); }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {/* <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            > */}
              <AdvancedSearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                placeholderName="Search"
                setAssignMember={setAssignMember}
                setAssignType={setAssignType}
              />
              {/* </Box> */}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Drawer >
    </>
  );
};

UpdateTask.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  displayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default UpdateTask;
