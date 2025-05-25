/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Input,
  FormGroup,
  Label,
  Col,
  Row,
} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import AdvancedSearchModal from '../../hazards/forms/advancedSearchModal';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getHxActionDays, createHxAction,
  getAuditQuestionRepeated,
} from '../auditService';
import {
  getDateUtcMuI,
  extractOptionsObject,
  detectMob,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  getTeamMember,
} from '../../auditSystem/auditService';

const appModels = require('../../util/appModels').default;

const CreateNonConformity = React.memo(({
  auditId, qtnId, qtnDataId, editData, onClose, type, onRemarksSaveClose, onMessageChange, currentAnswer, qtnName, currentRemarks,
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dayOpen, setDayOpen] = useState(false);
  const [dayData, setDayField] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const [teamMemberOpen, setTeamMemberOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');
  const [assignMember, setAssignMember] = useState('');

  const [severityOpen, setSeverityOpen] = useState('');
  const [severity, setSeverity] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [assignType, setAssignType] = useState('');
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const dispatch = useDispatch();

  const { hxActionCreate, hxAuditDays, hxNcrRepeatInfo } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(getHxActionDays());
  }, []);

  useMemo(() => {
    if (type === 'Non-conformity' && qtnDataId) {
      dispatch(getAuditQuestionRepeated(qtnDataId));
    }
  }, [type]);

  useEffect(() => {
    if (editData) {
      setSeverity({ label: editData.severity, value: editData.severity });
      setDesc(editData.description);
      setDeadline(dayjs(moment(editData.deadline).local().format('YYYY-MM-DD HH:mm:ss')));
      setAssignMember(editData.responsible_id);
      setDayField(editData.resolution_window_id);
    }
  }, [editData]);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if (teamMemberOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamMemberKeyword));
    }
  }, [teamMemberKeyword, teamMemberOpen]);

  useEffect(() => {
    if (currentAnswer && qtnName) {
      setTitle(`${qtnName}-${currentAnswer}`);
    }
  }, [currentAnswer, qtnName]);

  const onDataDescChange = (e) => {
    setDesc(e.target.value);
  };

  const onDataMemberChange = (e) => {
    console.log(e);
    setAssignMember(e);
  };

  const addDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      const dateValue = getDateUtcMuI(data);
      result = `${dateValue} 05:59:59`;
    } else {
      const dateValue = moment(data).utc().format('YYYY-MM-DD');
      result = `${dateValue} 05:59:59`;
    }
    return result;
  }

  const onDataEditMemberChange = (e) => {
    console.log(e);
    setDayField(e);
    setDeadline(dayjs(addDays(e.days)));
  };

  const onSeverityChange = (e) => {
    console.log(e);
    setSeverity(e);
  };

  const onFacilityClear = () => {
    setDayField('');
    setDayOpen(false);
  };

  const onSeverityClear = () => {
    setSeverity('');
    setSeverityOpen(false);
  };

  const onMemberClear = () => {
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

  const createNC = () => {
    if (!editData && auditId) {
      const postData = {
        audit_id: auditId,
        question_id: qtnDataId,
        type,
        description: desc,
        severity: severity && severity.value ? severity.value : false,
        resolution_window_id: dayData && dayData.id ? dayData.id : false,
        responsible_id: assignMember && assignMember.id ? assignMember.id : false,
        name: title,
        deadline: deadline ? checkExDatehasObject(deadline) : false,
      };
      if (type === 'Non-conformity') {
        onRemarksSaveClose(currentRemarks);
        postData.repeated_count_company = hxNcrRepeatInfo && hxNcrRepeatInfo.data && hxNcrRepeatInfo.data.company_audit_action_count ? parseInt(hxNcrRepeatInfo.data.company_audit_action_count) + 1 : 1;
        postData.repeated_count_site = hxNcrRepeatInfo && hxNcrRepeatInfo.data && hxNcrRepeatInfo.data.site_audit_action_count ? parseInt(hxNcrRepeatInfo.data.site_audit_action_count) + 1 : 1;
      }
      const payload = { model: appModels.HXAUDITACTION, values: postData };
      dispatch(createHxAction(appModels.HXAUDITACTION, payload));
    } else if (editData && auditId) {
      const postData = {
        description: desc,
        severity: severity && severity.value ? severity.value : false,
        resolution_window_id: dayData && dayData.id ? dayData.id : false,
        responsible_id: assignMember && assignMember.id ? assignMember.id : false,
        deadline: deadline ? checkExDatehasObject(deadline) : false,
      };

      dispatch(createHxAction(appModels.HXAUDITACTION, postData, qtnDataId));
    }
  };

  const isMobileView = detectMob();

  const dayOptions = extractOptionsObject(hxAuditDays, dayData);
  const teamMembersOptions = extractOptionsObject(teamMembers, assignMember);

  const severtyOptions = [{ value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }];

  const isDisable = type === 'Non-conformity' && !editData ? !((severity && severity.label) && desc && currentRemarks && dayData && dayData.id) : !((severity && severity.label) && desc && dayData && dayData.id);

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {!editData && hxNcrRepeatInfo && hxNcrRepeatInfo.data && type && type === 'Non-conformity' && (
          <Stack sx={{ padding: '10px' }}>
            <Alert severity={!hxNcrRepeatInfo.data.site_audit_action_count && !hxNcrRepeatInfo.data.company_audit_action_count ? 'info' : 'warning'}>

              {hxNcrRepeatInfo.data.site_audit_action_count > 0 && hxNcrRepeatInfo.data.company_audit_action_count > 0 && (
              <p className="font-family-tab mb-0">
                Warning: This non-compliance has been reported
                {' '}
                {hxNcrRepeatInfo.data.site_audit_action_count > 1 ? hxNcrRepeatInfo.data.site_audit_action_count : 'once'}
                {' '}
                {hxNcrRepeatInfo.data.site_audit_action_count > 1 ? 'times' : ''}
                {' '}
                at this location and
                {' '}
                {hxNcrRepeatInfo.data.company_audit_action_count > 1 ? hxNcrRepeatInfo.data.company_audit_action_count : 'once'}
                {' '}
                {hxNcrRepeatInfo.data.company_audit_action_count > 1 ? 'times' : ''}
                {' '}
                across all locations!
              </p>
              )}
              {!hxNcrRepeatInfo.data.site_audit_action_count && hxNcrRepeatInfo.data.company_audit_action_count > 0 && (
              <p className="font-family-tab mb-0">
                Warning: This non-compliance has been reported
                {' '}
                {hxNcrRepeatInfo.data.company_audit_action_count > 1 ? hxNcrRepeatInfo.data.company_audit_action_count : 'once'}
                {' '}
                {hxNcrRepeatInfo.data.company_audit_action_count > 1 ? 'times' : ''}
                {' '}
                across all locations!
              </p>
              )}
              {!hxNcrRepeatInfo.data.site_audit_action_count && !hxNcrRepeatInfo.data.company_audit_action_count && (
              <p className="font-family-tab mb-0">
                Info: This non-compliance is being reported for the first time across all locations!
              </p>
              )}
            </Alert>
          </Stack>
          )}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: isMobileView ? '5px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >

            {!(hxActionCreate && hxActionCreate.data) && !hxActionCreate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Description
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input type="text" name="body" label="Action Taken" placeholder="Enter here" value={desc} onChange={onDataDescChange} className="bg-whitered" />
              </Col>
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <FormGroup className="mb-0">
                  <Label className="m-0">
                    Severity
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={severityOpen}
                    size="small"
                    value={severity && severity.label ? severity.label : ''}
                    onOpen={() => {
                      setSeverityOpen(true);
                    }}
                    onClose={() => {
                      setSeverityOpen(false);
                    }}
                    disableClearable
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={severtyOptions}
                    onChange={(e, data) => onSeverityChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className={(severity && severity.value)
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {((severity && severity.value)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onSeverityClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <FormGroup className="mb-0">
                  <Label className="m-0">
                    Days
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={dayOpen}
                    size="small"
                    value={dayData && dayData.name ? dayData.name : ''}
                    onOpen={() => {
                      setDayOpen(true);
                    }}
                    onClose={() => {
                      setDayOpen(false);
                    }}
                    disableClearable
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={dayOptions}
                    onChange={(e, data) => onDataEditMemberChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className={(dayData && dayData.id)
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {hxAuditDays && hxAuditDays.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((dayData && dayData.id)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onFacilityClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              {dayData && dayData.id && (
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <FormGroup className="mb-0">
                  <Label className="m-0">
                    Deadline
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DatePicker
                        minDate={dayjs(new Date())}
                        sx={{ width: '100%', backgroundColor: 'white' }}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                        }}
                        disablePast
                        name="closed_on"
                        label=""
                        value={deadline}
                        onChange={setDeadline}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormGroup>
              </Col>
              )}
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <FormGroup className="mb-0">
                  <Label className="m-0">
                    Responsible To
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={teamMemberOpen}
                    size="small"
                    value={assignMember && assignMember.name ? assignMember.name : ''}
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
                    onChange={(e, data) => onDataMemberChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setTeamMemberKeyword(e.target.value)}
                        variant="outlined"
                        value={teamMemberKeyword}
                        className={((assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onMemberClear}
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
              {!editData && type === 'Non-conformity' && (
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Remarks
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={currentRemarks || ''} onChange={onMessageChange} className="bg-whitered" rows="4" />
                {!currentRemarks && (<p className="text-danger">Comment Required</p>)}
              </Col>
              )}
            </Row>
            )}
            {hxActionCreate && hxActionCreate.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(hxActionCreate && hxActionCreate.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {hxActionCreate && hxActionCreate.data && !hxActionCreate.loading && (
            <SuccessAndErrorFormat response={hxActionCreate} successMessage={editData ? `The ${type} has been updated.` : `The ${type} has been added.`} />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(hxActionCreate && hxActionCreate.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          disabled={isDisable || (hxActionCreate && hxActionCreate.data) || hxActionCreate.loading}
          onClick={() => createNC()}
        >
          {editData ? 'Update' : 'Submit'}

        </Button>
        )}
        {(hxActionCreate && hxActionCreate.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onClose()}
          disabled={hxActionCreate.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>
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
    </>
  );
});

export default CreateNonConformity;
