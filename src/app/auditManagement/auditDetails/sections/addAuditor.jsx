/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  FormGroup,
  Label,
  Col,
  Row,
} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
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
import {
  Typography, ListItemText,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';

import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getHxAuditNames, updateHxAudit,
  getHxAuditRoles,
} from '../../auditService';
import {
  getDateTimeUtcMuI,
  extractOptionsObject,
  detectMob,
  getAllowedCompanies,
  getCompanyAccessLevel,
  getCompanyTimezoneDate,
  extractValueObjects,
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

const AddAuditor = React.memo(({
  auditId, deleteId, lineId, editData, onClose,
}) => {
  const [auditorOpen, setAuditorOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');
  const [assignMember, setAssignMember] = useState('');

  const [roleKeyword, setRoleKeyword] = useState('');
  const [roleOpen, setRoleOpen] = useState(false);

  const [extraModal1, setExtraModal1] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [oldValues, setOldValues] = useState([]);
  const [columns, setColumns] = useState(['id', 'name']);
  const [headers, setHeaders] = useState([]);

  const [formValues, setFormValues] = useState({
    auditor_id: '',
    role_id: '',
    is_spoc: false,
  });

  const classes = useStyles();

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const dispatch = useDispatch();

  const { hxAuditors, hxRoleIds, hxAuditUpdate, hxAuditConfig } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);

  const configData = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const accessLevel = getCompanyAccessLevel(configData && configData.auditors_access ? configData.auditors_access : '', userInfo);
      dispatch(getHxAuditNames(accessLevel, appModels.HXAUDITORS, teamMemberKeyword));
    }
  }, [userInfo, teamMemberKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && roleOpen) {
      dispatch(getHxAuditRoles(companies, appModels.HXAUDITROLES, roleKeyword));
    }
  }, [userInfo, roleKeyword, roleOpen]);

  useEffect(() => {
    if (lineId && editData.id) {
      setFormValues(editData);
    }
  }, [lineId, editData]);

  const onDataChange = (e, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const showAdvancedModal = () => {
    setFieldName('auditor_id');
    setExtraModal1(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Auditors');
    setOldValues(formValues.auditor_id && formValues.auditor_id.id ? formValues.auditor_id.id : '');
  };

  const onAuditorChangeModal = (field, data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      auditor_id: data,
    }));
  };

  const onAuditorChange = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      auditor_id: data,
    }));
  };

  const handleSpocChange = (event) => {
    const { checked } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      is_spoc: !!checked,
    }));
  };

  const onAuditorClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      auditor_id: '',
    }));
    setTeamMemberKeyword('');
    setAuditorOpen(false);
  };

  const onRoleChange = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      role_id: data,
      is_spoc: !!(data && data.is_spoc),
    }));
  };

  const onRoleClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      role_id: '',
      is_spoc: false,
    }));
    setRoleKeyword('');
    setRoleOpen(false);
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
      postData.auditor_id = formValues.auditor_id ? extractValueObjects(formValues.auditor_id) : false;
      postData.role_id = formValues.role_id ? extractValueObjects(formValues.role_id) : false;
      let postDataValues = {
        auditors_ids: [[lineId ? 1 : 0, lineId || 0, postData]],
      };
      if (deleteId) {
        postDataValues = {
          auditors_ids: [[2, lineId, false]],
        };
      }
      dispatch(updateHxAudit(auditId, appModels.HXAUDIT, postDataValues));
    }
  };

  const isMobileView = detectMob();

  const isDisable = !((formValues.auditor_id && formValues.auditor_id.id) && (formValues.role_id && formValues.role_id.id));

  const teamMembersOptions = extractOptionsObject(hxAuditors, formValues.auditor_id);
  const roleOptions = extractOptionsObject(hxRoleIds, formValues.role_id);

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
              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>
                    Auditor
                    {' '}
                    <span className="text-danger">*</span>
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={auditorOpen}
                    size="small"
                    value={formValues.auditor_id && formValues.auditor_id.name ? formValues.auditor_id.name : ''}
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
                    options={teamMembersOptions}
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
                        className={((formValues.auditor_id && formValues.auditor_id.id))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {hxAuditors && hxAuditors.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((formValues.auditor_id && formValues.auditor_id.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAuditorClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                                <IconButton onClick={showAdvancedModal}>
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

              <Col md="12" xs="12" sm="12" lg="12">
                <FormGroup className="mb-1">
                  <Label>
                    Function
                    {' '}
                    <span className="text-danger">*</span>
                  </Label>
                  <Autocomplete
                    name="assigned_to"
                    className="bg-white min-width-200"
                    isRequired
                    open={roleOpen}
                    size="small"
                    value={formValues.role_id && formValues.role_id.name ? formValues.role_id.name : ''}
                    onOpen={() => {
                      setRoleOpen(true);
                      setRoleKeyword('');
                    }}
                    onClose={() => {
                      setRoleOpen(false);
                      setRoleKeyword('');
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={roleOptions}
                    onChange={(e, data) => onRoleChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setRoleKeyword(e.target.value)}
                        variant="outlined"
                        value={roleKeyword}
                        className={((formValues.role_id && formValues.role_id.id) || (roleKeyword && roleKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {hxRoleIds && hxRoleIds.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((formValues.role_id && formValues.role_id.id) || (roleKeyword && roleKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onRoleClear}
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
              <Col xs={12} sm={12} md={12} lg={12}>
                <FormGroup className="mb-1 mt-2">
                  <Label className="mt-0 mr-2">
                    SPOC
                  </Label>
                  <Checkbox
                    checked={formValues.is_spoc}
                    onChange={handleSpocChange}
                    size="small"
                    className="p-0"
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </FormGroup>
              </Col>

            </Row>
            )}
            {deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <p className="font-family-tab text-center">
                  Are you sure, you want to delete
                  {' '}
                  {editData.auditor_id && editData.auditor_id.name ? editData.auditor_id.name : ''}
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
            <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={`The Auditor ${lineId ? `${deleteId ? 'deleted' : 'updated'}` : 'added'} successfully.`} />
            )}
            <hr className="mb-0" />
          </Box>
          <Dialog size="xl" fullWidth open={extraModal1}>
            <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <SearchModalSingleStatic
                  afterReset={() => { setExtraModal1(false); }}
                  fieldName={fieldName}
                  fields={columns}
                  headers={headers}
                  data={teamMembersOptions}
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

export default AddAuditor;
