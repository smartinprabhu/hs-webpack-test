/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Input,
  FormGroup,
  Label,
  Col,
  Row,
} from 'reactstrap';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import moment from 'moment';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';

import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  updateHxAudit,
} from '../../auditService';
import AdvancedSearchModal from '../../forms/advancedSearchModal';
import {
  getDateTimeUtcMuI,
  convertTimeToDecimal,
  detectMob,
  getAllowedCompanies,
  convertDecimalToTime,
  getCompanyTimezoneDate,
  extractNameObject,
} from '../../../util/appUtils';

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const appModels = require('../../../util/appModels').default;

const AddTimeLog = React.memo(({
  auditId, deleteId, auditData, lineId, editData, onClose,
}) => {
  const [formValues, setFormValues] = useState({
    name: '',
    hours_spent: 0,
    comments: '',
    description: '',
  });

  const [auditorOpen, setAuditorOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');
  const [auditorId, setAuditorId] = useState('');
  const [resourceType, setResourceType] = useState('auditor');

  const [auditeeOpen, setAuditeeOpen] = useState(false);
  const [auditeeKeyword, setAuditeeKeyword] = useState('');
  const [auditeeId, setAuditeeId] = useState('');

  const [spocOpen, setSpocOpen] = useState(false);
  const [spocKeyword, setSpocKeyword] = useState('');
  const [spocId, setSpocId] = useState('');

  const [extraModal1, setExtraModal1] = useState(false);
  const [extraModal2, setExtraModal2] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [oldValues, setOldValues] = useState([]);
  const [headers, setHeaders] = useState([]);

  const [auditors, setAuditors] = useState([]);
  const [auditees, setAuditees] = useState([]);
  const [spocs, setSpocs] = useState([]);

  const dispatch = useDispatch();

  const { hxAuditors, hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const { userInfo } = useSelector((state) => state.user);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  const companies = getAllowedCompanies(userInfo);

  const classes = useStyles();

  useEffect(() => {
    if (resourceType === 'auditor') {
      setFormValues((prevValues) => ({
        ...prevValues,
        name: '',
      }));
      setAuditorId('');
      setTeamMemberKeyword('');
      setAuditorOpen(false);
      setAuditeeId('');
      setAuditeeKeyword('');
      setAuditeeOpen(false);
      setSpocOpen(false);
      setSpocId('');
      setSpocKeyword('');
      const data = auditData && auditData.auditors_ids ? auditData.auditors_ids.map((cl) => ({
        id: extractNameObject(cl.auditor_id, 'id'),
        name: extractNameObject(cl.auditor_id, 'name'),
        certification_status: extractNameObject(cl.auditor_id, 'certification_status'),
        certificate_expires_on: extractNameObject(cl.auditor_id, 'certificate_expires_on'),
        role: extractNameObject(cl.role_id, 'name'),
      })) : [];
      setAuditors(data);
      if (data && data.length === 1) {
        setAuditorId(data[0]);
        setFormValues((prevValues) => ({
          ...prevValues,
          name: data[0].name,
        }));
      }
    } else if (resourceType === 'auditee') {
      setFormValues((prevValues) => ({
        ...prevValues,
        name: '',
      }));
      setAuditorId('');
      setTeamMemberKeyword('');
      setAuditorOpen(false);
      setAuditeeId('');
      setAuditeeKeyword('');
      setAuditeeOpen(false);
      setSpocOpen(false);
      setSpocId('');
      setSpocKeyword('');
      const data = auditData && auditData.auditees_ids ? auditData.auditees_ids.map((cl) => ({
        id: extractNameObject(cl.team_members_id, 'id'),
        name: extractNameObject(cl.team_members_id, 'name'),
        role: extractNameObject(cl.role_id, 'name'),
      })) : [];
      setAuditees(data);
      if (data && data.length === 1) {
        setAuditeeId(data[0]);
        setFormValues((prevValues) => ({
          ...prevValues,
          name: data[0].name,
        }));
      }
    } else if (resourceType === 'spoc') {
      setFormValues((prevValues) => ({
        ...prevValues,
        name: '',
      }));
      setAuditorId('');
      setTeamMemberKeyword('');
      setAuditorOpen(false);
      setAuditeeId('');
      setAuditeeKeyword('');
      setAuditeeOpen(false);
      setSpocOpen(false);
      setSpocId('');
      setSpocKeyword('');
      setSpocs(auditData && auditData.audit_spoc_id ? [auditData.audit_spoc_id] : []);
      setSpocId(auditData && auditData.audit_spoc_id ? auditData.audit_spoc_id : '');
      setFormValues((prevValues) => ({
        ...prevValues,
        name: auditData && auditData.audit_spoc_id && auditData.audit_spoc_id.name ? auditData.audit_spoc_id.name : '',
      }));
    }
  }, [userInfo, resourceType, auditData]);


  useEffect(() => {
    if (lineId && editData.id) {
      const editValues = { ...editData };
      const durationString = convertDecimalToTime(editValues.hours_spent);
      editValues.hours_spent = durationString;
      setFormValues(editValues);
    }
  }, [lineId, editData]);

  const onDataChange = (e, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const onAuditorChange = (data) => {
    setAuditorId(data);
    setFormValues((prevValues) => ({
      ...prevValues,
      name: data && data.name ? data.name : '',
    }));
  };

  const onAuditorClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      name: '',
    }));
    setAuditorId('');
    setTeamMemberKeyword('');
    setAuditorOpen(false);
  };

  const onAuditeeChange = (data) => {
    setAuditeeId(data);
    setFormValues((prevValues) => ({
      ...prevValues,
      name: data && data.name ? data.name : '',
    }));
  };

  const showAuditeeAdvancedModal = () => {
    setFieldName('auditee_id');
    setExtraModal2(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Auditees');
    setOldValues(auditeeId && auditeeId.id ? auditeeId.id : '');
  };

  const showAuditorAdvancedModal = () => {
    setFieldName('auditor_id');
    setExtraModal2(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Auditors');
    setOldValues(auditorId && auditorId.id ? auditorId.id : '');
  };

  const onAuditorChangeModal = (field, data) => {
    if (field === 'auditee_id') {
      setAuditeeId(data);
      setFormValues((prevValues) => ({
        ...prevValues,
        name: data && data.name ? data.name : '',
      }));
    } else if (field === 'auditor_id') {
      setAuditorId(data);
      setFormValues((prevValues) => ({
        ...prevValues,
        name: data && data.name ? data.name : '',
      }));
    }
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('audit_spoc_id');
    setModalName('Audit SPOC List');
    setCompanyValue(`["company_id","=",${userCompanyId}]`);
    setExtraModal1(true);
  // setExtraMultipleModal(true);
  };

  const onAuditeeClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      name: '',
    }));
    setAuditeeId('');
    setAuditeeKeyword('');
    setAuditeeOpen(false);
  };

  const onSpocChange = (data) => {
    setSpocId(data);
    setFormValues((prevValues) => ({
      ...prevValues,
      name: data && data.name ? data.name : '',
    }));
  };

  const onSpocChangeModal = (field, data) => {
    setSpocId(data);
    setFormValues((prevValues) => ({
      ...prevValues,
      name: data && data.name ? data.name : '',
    }));
  };

  const onSpocClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      name: '',
    }));
    setSpocId('');
    setSpocKeyword('');
    setSpocOpen(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;

    // Only allow numbers and one colon separator
    const validValue = value.replace(/[^0-9:]/g, '');

    // If there is a colon, ensure there's no more than one and it's in the correct place
    const [hours, minutes] = validValue.split(':');
    if (hours && (hours.length > 2 || +hours > 23)) return; // Hours should be 00-23
    if (minutes && (minutes.length > 2 || +minutes > 59)) return; // Minutes should be 00-59

    setFormValues((prevValues) => ({
      ...prevValues,
      hours_spent: validValue,
    }));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

    // Allow Numpad keys, Backspace, Delete, Tab, and arrow keys
    if (
      (e.code && e.code.startsWith('Numpad'))
      || allowedKeys.includes(e.key)
      || e.key === ':'
    ) {
      return;
    }

    // Prevent any non-numeric or non-colon input
    if (e.key < '0' || e.key > '9') {
      e.preventDefault();
    }
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  const createNC = () => {
    if (auditId) {
      const postData = { ...formValues };
      postData.hours_spent = formValues.hours_spent ? convertTimeToDecimal(formValues.hours_spent) : 0.00;
      let postDataValues = {
        time_log_ids: [[lineId ? 1 : 0, lineId || 0, postData]],
      };
      if (deleteId) {
        postDataValues = {
          time_log_ids: [[2, lineId, false]],
        };
      }
      dispatch(updateHxAudit(auditId, appModels.HXAUDIT, postDataValues));
    }
  };

  const isMobileView = detectMob();

  const isDisable = !(formValues.name && formValues.hours_spent);

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
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
            {!deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              {!lineId && (
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <p className="mb-1">
                  <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Type</FormLabel>
                </p>
                <ButtonGroup
                  variant="contained"
                  size="small"
                  aria-label="Basic button group"
                >
                  <Button
                    onClick={() => setResourceType('auditor')}
                    variant={resourceType === 'auditor' ? 'contained' : 'outlined'}
                    color={resourceType === 'auditor' ? 'primary' : 'inherit'}
                  >
                    Auditor
                  </Button>
                  <Button
                    onClick={() => setResourceType('auditee')}
                    variant={resourceType === 'auditee' ? 'contained' : 'outlined'}
                    color={resourceType === 'auditee' ? 'primary' : 'inherit'}
                  >
                    Auditee
                  </Button>
                  <Button
                    onClick={() => setResourceType('spoc')}
                    variant={resourceType === 'spoc' ? 'contained' : 'outlined'}
                    color={resourceType === 'spoc' ? 'primary' : 'inherit'}
                  >
                    Audit SPOC
                  </Button>
                </ButtonGroup>
              </Col>
              )}
              {!lineId && resourceType === 'auditor' && (
              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>
                    Auditor
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={auditorOpen}
                    size="small"
                    value={auditorId && auditorId.name ? auditorId.name : ''}
                    classes={{
                      option: classes.option,
                    }}
                    onOpen={() => {
                      setAuditorOpen(true);
                      setTeamMemberKeyword('');
                    }}
                    onClose={() => {
                      setAuditorOpen(false);
                      setTeamMemberKeyword('');
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={auditors}
                    renderOption={(option) => (
                      <ListItemText
                        primary={(
                          <>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                }}
                              >
                                {option.name}
                                {' '}
                                -
                                {' '}
                                {option.certification_status}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                {option.type}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                Role:
                                {' '}
                                {option.role}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                Expires on:
                                {' '}
                                {getCompanyTimezoneDate(option.certificate_expires_on, userInfo, 'datetime')}
                              </Typography>
                            </Box>
                          </>
                                          )}
                      />
                    )}
                    onChange={(e, data) => onAuditorChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setTeamMemberKeyword(e.target.value)}
                        variant="outlined"
                        value={teamMemberKeyword}
                        className={((auditorId && auditorId.id))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {((auditorId && auditorId.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAuditorClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={showAuditorAdvancedModal}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              )}
              {!lineId && resourceType === 'auditee' && (
              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>
                    Auditee
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={auditeeOpen}
                    size="small"
                    value={auditeeId && auditeeId.name ? auditeeId.name : ''}
                    classes={{
                      option: classes.option,
                    }}
                    onOpen={() => {
                      setAuditeeOpen(true);
                      setAuditeeKeyword('');
                    }}
                    onClose={() => {
                      setAuditeeOpen(false);
                      setAuditeeKeyword('');
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={auditees}
                    renderOption={(option) => (
                      <ListItemText
                        primary={(
                          <>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                }}
                              >
                                {option.name}

                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                Role:
                                {' '}
                                {option.role}
                              </Typography>
                            </Box>
                          </>
                                          )}
                      />
                    )}
                    onChange={(e, data) => onAuditeeChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setAuditeeKeyword(e.target.value)}
                        variant="outlined"
                        value={auditeeKeyword}
                        className={((auditeeId && auditeeId.id))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {((auditeeId && auditeeId.id) || (auditeeKeyword && auditeeKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAuditeeClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={showAuditeeAdvancedModal}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              )}
              {!lineId && resourceType === 'spoc' && (
              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>
                    Audit SPOC
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={spocOpen}
                    size="small"
                    value={spocId && spocId.name ? spocId.name : ''}
                    classes={{
                      option: classes.option,
                    }}
                    onOpen={() => {
                      setSpocOpen(true);
                      setSpocKeyword('');
                    }}
                    onClose={() => {
                      setSpocOpen(false);
                      setSpocKeyword('');
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={spocs}
                    renderOption={(option) => (
                      <ListItemText
                        primary={(
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontWeight: 500,
                                fontSize: '14px',
                              }}
                            >
                              {option.name}

                            </Typography>
                          </Box>
                                          )}
                      />
                    )}
                    onChange={(e, data) => onSpocChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setSpocKeyword(e.target.value)}
                        variant="outlined"
                        value={spocKeyword}
                        className={((spocId && spocId.id))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {((spocId && spocId.id) || (spocKeyword && spocKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onSpocClear}
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
              )}
              {lineId && (
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Resource Name
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  label="Action Taken"
                  placeholder="Name"
                  value={formValues.name}
                  onChange={(e) => onDataChange(e, 'name')}
                  className="bg-whitered"
                />
              </Col>
              )}

              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Hours Spent (HH:MM)
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="Duration"
                  label="Hours Spent"
                  value={formValues.hours_spent}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  placeholder="HH:MM"
                  maxLength="10"
                  className="bg-whitered"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Description
                </Label>
                <Input
                  type="textarea"
                  name="Description"
                  label="Description"
                  placeholder="Description"
                  value={formValues.description}
                  onChange={(e) => onDataChange(e, 'description')}
                  className="bg-whitered"
                  rows="4"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Comments
                </Label>
                <Input
                  type="textarea"
                  name="Comments"
                  label="Comments"
                  placeholder="Comments"
                  value={formValues.comments}
                  onChange={(e) => onDataChange(e, 'comments')}
                  className="bg-whitered"
                  rows="4"
                />
              </Col>

            </Row>
            )}
            {deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <p className="font-family-tab text-center">
                  Are you sure, you want to delete
                  {' '}
                  {editData.name}
                </p>
              </Col>
            </Row>
            )}
            {hxAuditUpdate && hxAuditUpdate.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(hxAuditUpdate && hxAuditUpdate.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {hxAuditUpdate && hxAuditUpdate.data && !hxAuditUpdate.loading && (
            <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={`The Time Log ${lineId ? `${deleteId ? 'deleted' : 'updated'}` : 'added'} successfully.`} />
            )}
            <hr className="mb-0" />
          </Box>
          <Dialog size="lg" fullWidth open={extraModal1}>
            <DialogHeader title={modalName} onClose={() => { setExtraModal1(false); }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <AdvancedSearchModal
                  modelName={modelValue}
                  afterReset={() => { setExtraModal1(false); }}
                  fieldName={fieldName}
                  setFieldValue={onSpocChangeModal}
                  fields={columns}
                  company={companyValue}
                  placeholderName="Search"
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Dialog size="xl" fullWidth open={extraModal2}>
            <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal2(false); }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <SearchModalSingleStatic
                  afterReset={() => { setExtraModal2(false); }}
                  fieldName={fieldName}
                  fields={columns}
                  headers={headers}
                  data={fieldName && fieldName === 'auditor_id' ? auditors : auditees}
                  setFieldValue={onAuditorChangeModal}
                  modalName={modalName}
                  oldValues={oldValues}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(hxAuditUpdate && hxAuditUpdate.data) && (
        <>
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={isDisable || (hxAuditUpdate && hxAuditUpdate.data) || hxAuditUpdate.loading}
            onClick={() => createNC()}
          >
            {lineId ? `${deleteId ? 'Yes' : 'Update'}` : 'Add'}

          </Button>
          {deleteId && (
          <Button
            type="button"
            variant="contained"
            className="reset-btn"
            onClick={() => onClose()}
          >
            No

          </Button>
          )}
        </>
        )}
        {(hxAuditUpdate && hxAuditUpdate.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onClose()}
          disabled={hxAuditUpdate.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>

    </>
  );
});

export default AddTimeLog;
