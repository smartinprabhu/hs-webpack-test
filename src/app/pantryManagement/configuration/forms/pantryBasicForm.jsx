/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col, Modal, ModalBody, Label, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  InputField, FormikAutocomplete,
} from '@shared/formFields';
import { getSpaceAllSearchList } from '../../../helpdesk/ticketService';
import {
  generateErrorMessage,
  getAllowedCompanies, avoidSpaceOnFirstCharacter,
  extractOptionsObject, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../util/appUtils';
import {
  getTeamList, getSpaceName,
} from '../../../assets/equipmentService';
import {
  getWorkingTime,
} from '../../../adminSetup/setupService';
import { setLocationId } from '../../pantryService';
import SearchModalMultiple from './searchModalMultiple';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const PantryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    formField: {
      name,
      maintenanceTeam,
      spaces,
      workingTime,
      companyId,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const classes = useStyles();
  const {
    company_id,
    resource_calendar_id,
    maintenance_team_id,
    spaces_ids,
  } = formValues;
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [workingTimeOpen, setWorkingTimeOpen] = useState(false);
  const [workingTimeKeyword, setWorkingTimeKeyword] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [extraModal, setExtraModal] = useState(false);

  // const [locationId, setLocationId] = useState([]);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies, workingTimeInfo } = useSelector((state) => state.setup);
  const { spaceInfoList } = useSelector((state) => state.ticket);
  const {
    teamsInfo, spaceName,
  } = useSelector((state) => state.equipment);
  const { locationId } = useSelector((state) => state.pantry);
  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }
  
  useEffect(() => {
    dispatch(setLocationId([]));
  }, []);

  
  useEffect(() => {
    if (spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(spaceInfoList.data, isAssociativeArray(locationId || []), 'id'));
    } else if (spaceInfoList && spaceInfoList.loading) {
      setSpaceOptions([{ path_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [spaceInfoList, spaceOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && teamOpen) {
      dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
    }
  }, [userInfo, teamOpen, teamKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    if (spaces_ids && editId) {
      const locationIds = spaces_ids && spaces_ids.length > 0 ? spaces_ids : false;
      if (locationIds && !locationIds[0].id) {
        dispatch(getSpaceName(appModels.SPACE, locationIds));
      }
    }
  }, [spaces_ids]);

  useEffect(() => {
    if (spaceName && spaceName.data && spaceName.data.length > 0 && editId) {
      setFieldValue('spaces_ids', spaceName.data);
      dispatch(setLocationId(spaceName.data));
    }
  }, [spaceName]);

  useEffect(() => {
    if (locationId) {
      setFieldValue('spaces_ids', locationId);
    }
  }, [locationId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getWorkingTime(companies, appModels.RESOURCECALENDAR, workingTimeKeyword));
      }
    })();
  }, [workingTimeOpen, workingTimeKeyword]);

  const onLocationKeyWordChange = (event) => {
    setWorkingTimeKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setWorkingTimeKeyword(null);
    setFieldValue('resource_calendar_id', '');
    setWorkingTimeOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.RESOURCECALENDAR);
    setFieldName('resource_calendar_id');
    setModalName('Working Time');
    setTeamOpen(false);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const WorkingOptions = extractOptionsObject(workingTimeInfo, resource_calendar_id);
  const teamOptions = extractOptionsObject(teamsInfo, maintenance_team_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('spaces_ids');
    setModalName('Space List');
    setColumns(['id', 'space_name', 'path_name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showSearchModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Teams');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const handleParticipants = (options) => {
    if (options && options.length && options.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    dispatch(setLocationId(options));
    setCheckRows(options);
  };

  const onSpaceKeywordClear = () => {
    setSpaceKeyword(null);
    dispatch(setLocationId([]));
    setCheckRows([]);
    setSpaceOpen(false);
  };

  const onTeamKeywordClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const setLocationIds = (data) => {
    const Location = ([...locationId, ...checkedRows]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setLocationId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>

      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={name.name}
              label={name.label}
              autoComplete="off"
              isRequired
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
              onKeyPress={formValues && formValues.name === '' ? avoidSpaceOnFirstCharacter : true}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={maintenanceTeam.name}
              label={maintenanceTeam.label}
              labelClassName="mb-1"
              formGroupClassName="m-1 pr-2 w-100"
              isRequired={maintenanceTeam.required}
              open={teamOpen}
              oldValue={getOldData(maintenance_team_id)}
              value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : getOldData(maintenance_team_id)}
              size="small"
              onOpen={() => {
                setTeamOpen(true);
                setTeamKeyword('');
              }}
              onClose={() => {
                setTeamOpen(false);
                setTeamKeyword('');
              }}
              loading={teamsInfo && teamsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              apiError={(teamsInfo && teamsInfo.err && workingTimeOpen) ? generateErrorMessage(teamsInfo) : false}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTeamKeywordChange}
                  variant="outlined"
                  value={teamKeyword}
                  className={((getOldData(maintenance_team_id)) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(maintenance_team_id)) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTeamKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSearchModal}
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
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <div className="m-1">
              <FormControl className={classes.margin}>
                <Label for={spaces.name}>
                  {spaces.label}
                </Label>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  name="space"
                  open={spaceOpen}
                  size="small"
                  onOpen={() => {
                    setSpaceOpen(true);
                    setSpaceKeyword('');
                  }}
                  onClose={() => {
                    setSpaceOpen(false);
                    setSpaceKeyword('');
                  }}
                  value={locationId}
                  onChange={(e, options) => handleParticipants(options)}
                  getOptionSelected={(option, value) => option.name === value.path_name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                  options={spaceOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className={((getOldData(locationId)) || (spaceKeyword && spaceKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      onChange={(e) => setSpaceKeyword(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(spaceInfoList && spaceInfoList.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((spaceKeyword && spaceKeyword.length > 0) || (locationId && locationId.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onSpaceKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showSpaceModal}
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
            </div>
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={companyId.name}
              label={companyId.label}
              formGroupClassName="m-1"
              open={companyOpen}
              size="small"
              disabled
              oldValue={getOldData(company_id)}
              value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
              onOpen={() => {
                setCompanyOpen(true);
              }}
              onClose={() => {
                setCompanyOpen(false);
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={userCompanies}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search and Select"
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
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={workingTime.name}
              label={workingTime.label}
              formGroupClassName="m-1"
              oldValue={getOldData(resource_calendar_id)}
              value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : getOldData(resource_calendar_id)}
              apiError={(workingTimeInfo && workingTimeInfo.err && workingTimeOpen) ? generateErrorMessage(workingTimeInfo) : false}
              open={workingTimeOpen}
              size="small"
              onOpen={() => {
                setWorkingTimeOpen(true);
                setWorkingTimeKeyword('');
              }}
              onClose={() => {
                setWorkingTimeOpen(false);
                setWorkingTimeKeyword('');
              }}
              loading={workingTimeInfo && workingTimeInfo.loading && workingTimeOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={WorkingOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onLocationKeyWordChange}
                  variant="outlined"
                  value={workingTimeKeyword}
                  className={((resource_calendar_id && resource_calendar_id.id) || (workingTimeKeyword && workingTimeKeyword.length > 0) || (resource_calendar_id && resource_calendar_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {workingTimeInfo && workingTimeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((resource_calendar_id && resource_calendar_id.id) || (workingTimeKeyword && workingTimeKeyword.length > 0) || (resource_calendar_id && resource_calendar_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showRequestorModal}
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
          </Col>
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); setCheckRows([]); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setCheckedRows={setCheckRows}
            olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldLocationData={locationId && locationId.length ? locationId : []}
          />
        </ModalBody>
        <ModalFooter>
          <Button  variant="contained" onClick={() => { setExtraMultipleModal(false); setCheckRows([]); }} size="sm" className="bg-mediumgrey text-lato-black border-0 mr-2">
            CANCEL
          </Button>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { if (fieldName === 'spaces_ids') { setLocationIds(checkedRows); } }}
                 variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setFieldValue={setFieldValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
});

PantryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default PantryBasicForm;
