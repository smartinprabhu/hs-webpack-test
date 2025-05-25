/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef } from 'react';
import {
  Col,
  Row,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField,
  CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Autocomplete } from '@material-ui/lab';
import JoditEditor from 'jodit-react';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import Drawer from "@mui/material/Drawer";
import {
  Box, Dialog, DialogContent, DialogContentText,
} from '@mui/material';

import TrackerCheck from '@images/icons/incidentManagement.svg';

import DrawerHeader from "../../commonComponents/drawerHeader";
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  updateIncident, resetUpdateIncidentInfo,
  getHxTaskTypes,
} from '../ctService';
import {
  getTeamMember,
} from '../../auditSystem/auditService';
import {
  extractValueObjects, extractOptionsObject, getDateTimeSeconds,
  getDateTimeUtc, getAllowedCompanies,
} from '../../util/appUtils';
import AdvancedSearchModal from '../forms/advancedSearchModal';

const appModels = require('../../util/appModels').default;

const UpdateTask = (props) => {
  const {
    detailData, inspDeata, actionModal, atCancel, displayName, dataId, type,
  } = props;
  const dispatch = useDispatch();
  const editor = useRef(null);
  const editor1 = useRef(null);
  const [modal, setModal] = useState(actionModal);

  const [statusOpen, setStatusOpen] = useState(false);

  const [statusLabel, setStatusLabel] = useState(detailData.state);

  const [desc, setDesc] = useState(detailData.description ? detailData.description : '');
  const [descSum, setSumDesc] = useState(detailData.summary_incident ? detailData.summary_incident : '');

  const [assignMember, setAssignMember] = useState(detailData.assigned_id);

  const [targetDate, setTargetDate] = useState(detailData.target_date);

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

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const onChange = (data) => {
    setDesc(data);
  };

  const onSumChange = (data) => {
    setSumDesc(data);
  };

  const { updateIncidentInfo, hxTaskTypes } = useSelector((state) => state.hazards);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  const editorConfig = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    updateOnBlur: true,
    spellcheck: true,
    height: 250,
    minHeight: 100,
    allowResizeY: false,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,table,image,spellcheck,cut,copy,paste,undo,redo,fullsize,preview,print',
  };

  const editorReadConfig = {
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    height: 250,
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
      dispatch(getHxTaskTypes(domain, appModels.EHSTASKTYPES));
    }
  }, [typeKeyword, typeOpen]);

  useEffect(() => {
    let domain = `["company_id","=",${userCompanyId}]`;
    if (teamMemberKeyword) {
      domain = `${domain},["name","ilike","${teamMemberKeyword}"]`;
    }
    dispatch(getHxTaskTypes(domain, appModels.EHSTASKTYPES));
  }, [type]);

  useEffect(() => {
    if ((!assignType || (assignType && !assignType.id)) && hxTaskTypes && hxTaskTypes.data && hxTaskTypes.data.length) {
      setAssignType(hxTaskTypes.data[0]);
    }
  }, [hxTaskTypes]);

  const handleStateChange = (id) => {
    let postData = {
      analysis_ids: [[1, id, {
        name: title, target_date: targetDate || false, task_type_id: extractValueObjects(assignType), assigned_id: extractValueObjects(assignMember), state: statusLabel, summary_incident: descSum, description: desc,
      }]],
    };
    if (type === 'add') {
      postData = {
        analysis_ids: [[0, 0, {
          name: title, target_date: targetDate ? getDateTimeUtc(targetDate) : false, task_type_id: extractValueObjects(assignType), assigned_id: extractValueObjects(assignMember), state: statusLabel, description: desc, summary_incident: descSum,
        }]],
      };
    }
    dispatch(updateIncident(dataId, appModels.EHSHAZARD, postData));
  };

  const onDataEditStatusChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
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
    setDesc(editor.current.value);
  };

  const onDataEditTypeChange = (e) => {
    console.log(e);
    setAssignType(e);
    setDesc(editor.current.value);
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
    setModelValue(appModels.EHSTASKTYPES);
    setColumns(['id', 'name']);
    setFieldName('task_type_id');
    setModalName('Types List');
    setCompanyValue('');
    setExtraModal(true);
    // setExtraMultipleModal(true);
  };

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
      setTargetDate('');
    }
  }

  return (
    <Drawer
      PaperProps={{
        sx: { width: '50%' },
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
          marginTop: '20px',
          width: '100%',
        }}
      >

        {detailData && (
        <Row className="mr-3 ml-4">
          <Col md="12" xs="12" sm="12" lg="12">
            <FormGroup className="mb-1">
              <Label>
                Title
                <span className="text-danger ml-1">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                value={title}
                onChange={(e) => onDataEditTitleChange(e)}
              />
            </FormGroup>
          </Col>
          <Col md="12" xs="12" sm="12" lg="12">
            <FormGroup className="mb-1">
              <Label>Description</Label>
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
          <Col md="6" xs="12" sm="12" lg="6">
            <FormGroup className="mb-1">
              <Label>
                Type
                <span className="text-danger ml-1">*</span>
              </Label>
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
                    variant="outlined"
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
                                <BackspaceIcon fontSize="small" />
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
            </FormGroup>
          </Col>
          <Col md="6" xs="12" sm="12" lg="6">
            <Label className="ml-1 mb-0 mt-0">
              Status
              <span className="text-danger ml-1">*</span>
            </Label>
            <FormGroup className="m-1">
              <Radio.Group disabled={type !== 'edit'} value={statusLabel} className="mt-2 ml-1 custom-radio-group" onChange={onDataEditStatusChange}>
                <Radio.Button value="Open">Open</Radio.Button>
                <Radio.Button value="Inprogress">Inprogress</Radio.Button>
                <Radio.Button value="Completed">Completed</Radio.Button>
              </Radio.Group>
            </FormGroup>
          </Col>
          <Col md="6" xs="12" sm="12" lg="6">
            <FormGroup className="mb-1">
              <Label>
                Assigned To
                <span className="text-danger ml-1">*</span>
              </Label>
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
                    variant="outlined"
                    value={teamMemberKeyword}
                    className={((getOldDataId(assignMember)) || (assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
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
                                <BackspaceIcon fontSize="small" />
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
            </FormGroup>
          </Col>
          <Col md="6" xs="12" sm="12" lg="6">
            <FormGroup className="mb-1">
              <Label>Target Date</Label>
              <br />
              <DatePicker
                format="DD/MM/YYYY"
                value={targetDate ? moment(new Date(getDateTimeSeconds(targetDate)), 'DD/MM/YYYY') : ''}
                className="w-100"
                onChange={onDateChange}
                disabledDate={disableDateday}
                disabledTime={disabledTime}
                showToday={false}
                showNow={false}
                showTime={false}
              />
            </FormGroup>
          </Col>
          {type === 'edit' && (
          <Col md="12" xs="12" sm="12" lg="12">
            <FormGroup className="mb-1">
              <Label>Completion Summary</Label>
              <div className="editor-form-content hidden-scrollbar">
                <JoditEditor
                  ref={editor1}
                  value={descSum}
                  config={editorConfig}
                  // onChange={onChange}
                  onBlur={onSumChange}
                />
              </div>
            </FormGroup>
          </Col>
          )}
        </Row>
        )}
        <hr />
        <div className={`bg-lightblue ${actionModal ? 'sticky-button-50drawer' : ''}`}>
          <Button
            type="button"
             variant="contained"
            size="sm"
            disabled={loading || !(title && assignType && targetDate)}
            className="mr-1"
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Drawer>
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
