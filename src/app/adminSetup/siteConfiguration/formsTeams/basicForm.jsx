/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col
  ,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, RadioGroup, Typography,
} from '@mui/material';
import {
  generateErrorMessage, avoidSpaceOnFirstCharacter, getAllowedCompanies,
  getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../util/appUtils';
import { getBuildings, getSpaceName } from '../../../assets/equipmentService';
import {
  getMaintenanceCostAnalysis,
  getTeamCategory,
  getWorkingTime,
} from '../../setupService';

import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiFormLabel from '../../../commonComponents/formFields/muiFormLabel';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const BasicForm = (props) => {
  const {
    setFieldValue,
    formField,
  } = props;
  const { values } = useFormikContext();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [teamCategoryOpen, setTeamCategoryOpen] = useState(false);
  const [teamCategoryKeyword, setTeamCategoryKeyword] = useState('');
  const [workingTimeOpen, setWorkingTimeOpen] = useState(false);
  const [workingTimeKeyword, setWorkingTimeKeyword] = useState('');
  const [maintenanceCostOpen, setMaintenanceCostOpen] = useState(false);
  const [maintenanceCostKeyword, setMaintenanceCostKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [modalName, setModalName] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [columns, setColumns] = useState([]);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [oldValues, setOldValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    maintenanceCostInfo, teamCategoryInfo, workingTimeInfo,
  } = useSelector((state) => state.setup);
  const { buildingsInfo, spaceName } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (values) {
      const locationId = values.location_ids && values.location_ids.length > 0 ? values.location_ids : false;
      if (locationId) {
        dispatch(getSpaceName(appModels.SPACE, locationId));
      }
    }
  }, [values]);

  useEffect(() => {
    if (spaceName && spaceName.data && spaceName.data.length > 0 && values.location_ids && values.location_ids.length > 0) {
      setFieldValue('location_ids', spaceName.data);
    }
  }, [spaceName]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE));
      }
    })();
  }, [userInfo, spaceOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamCategoryOpen) {
        await dispatch(getTeamCategory(companies, appModels.CATEGORY, teamCategoryKeyword));
      }
    })();
  }, [teamCategoryOpen, teamCategoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getWorkingTime(companies, appModels.RESOURCECALENDAR, workingTimeKeyword));
      }
    })();
  }, [workingTimeOpen, workingTimeKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getMaintenanceCostAnalysis(companies, appModels.ACCOUNT, maintenanceCostKeyword));
      }
    })();
  }, [maintenanceCostOpen, maintenanceCostKeyword]);

  useEffect(() => {
    if (workingTimeInfo && workingTimeInfo.data && workingTimeInfo.data.length) {
      const defaultData = workingTimeInfo.data;
      if (defaultData && defaultData.length && !values.resource_calendar_id) {
        setFieldValue('resource_calendar_id', defaultData[0]);
      }
    }
  }, [workingTimeInfo]);

  useEffect(() => {
    if (maintenanceCostInfo && maintenanceCostInfo.data && maintenanceCostInfo.data.length) {
      const defaultData = maintenanceCostInfo.data;
      if (defaultData && defaultData.length && !values.maintenance_cost_analytic_account_id) {
        setFieldValue('maintenance_cost_analytic_account_id', defaultData[0]);
      }
    }
  }, [maintenanceCostInfo]);

  const onTeamCategoryKeywordChange = (event) => {
    setTeamCategoryKeyword(event.target.value);
  };

  const onWorkingTimeKeywordChange = (event) => {
    setWorkingTimeKeyword(event.target.value);
  };

  const onMaintenanceCostKeywordChange = (event) => {
    setMaintenanceCostKeyword(event.target.value);
  };

  let teamCategoryOptions = [];
  let workingTimeOptions = [];
  let maintenanceCostOptions = [];
  let spaceOptions = [];

  if (teamCategoryInfo && teamCategoryInfo.loading) {
    teamCategoryOptions = [{ name: 'Loading..' }];
  }
  if (teamCategoryInfo && teamCategoryInfo.data) {
    teamCategoryOptions = teamCategoryInfo.data;
  }

  if (workingTimeInfo && workingTimeInfo.loading) {
    workingTimeOptions = [{ name: 'Loading..' }];
  }
  if (workingTimeInfo && workingTimeInfo.data) {
    workingTimeOptions = workingTimeInfo.data;
  }

  if (maintenanceCostInfo && maintenanceCostInfo.loading) {
    maintenanceCostOptions = [{ name: 'Loading..' }];
  }
  if (maintenanceCostInfo && maintenanceCostInfo.data) {
    maintenanceCostOptions = maintenanceCostInfo.data;
  }

  if (buildingsInfo && buildingsInfo.loading) {
    spaceOptions = [{ space_name: 'Loading..' }];
  }
  if (buildingsInfo && buildingsInfo.data) {
    spaceOptions = buildingsInfo.data;
  }

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const spaceNameModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Locations');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['space_name', 'path_name', 'id']);
    setHeaders(['Path Name', 'Space Name']);
    setOldValues(values.location_ids);
  };

  const spaceNameClear = () => {
    setFieldValue('location_ids', '');
  };

  console.log(values.location_ids);

  return (
    <>
      <Row>
        <Col md="6" sm="6" lg="6" xs="12">
          <MuiTextField
            name={formField.maintenanceTeam.name}
            label={formField.maintenanceTeam.label}
            isRequired={formField.maintenanceTeam.required}
            type="text"
            onKeyPress={values && values.name ? '' : avoidSpaceOnFirstCharacter}
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiAutoComplete
            name={formField.maitenanceCostsAnalyticAccount.name}
            label={formField.maitenanceCostsAnalyticAccount.label}
            className="bg-white"
            open={maintenanceCostOpen}
            size="small"
            onOpen={() => {
              setMaintenanceCostOpen(true);
              setMaintenanceCostKeyword('');
            }}
            onClose={() => {
              setMaintenanceCostOpen(false);
              setMaintenanceCostKeyword('');
            }}
            value={values.maintenance_cost_analytic_account_id && values.maintenance_cost_analytic_account_id.length
              ? values.maintenance_cost_analytic_account_id[1] : values.maintenance_cost_analytic_account_id && values.maintenance_cost_analytic_account_id.name ? values.maintenance_cost_analytic_account_id.name : ''}
            loading={maintenanceCostInfo && maintenanceCostInfo.loading}
            s
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={maintenanceCostOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onMaintenanceCostKeywordChange}
                label={formField.maitenanceCostsAnalyticAccount.label}
                variant="standard"
                required={formField.maitenanceCostsAnalyticAccount.required}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {maintenanceCostInfo && maintenanceCostInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(maintenanceCostInfo && maintenanceCostInfo.err && maintenanceCostOpen)
            && (<FormHelperText><span className="text-danger">{generateErrorMessage(maintenanceCostInfo)}</span></FormHelperText>)}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} lg={6} md={6} className="mt-2">
          <Typography
            sx={{
              font: 'normal normal normal 16px Suisse Intl',
              letterSpacing: '0.63px',
              color: '#000000',
            }}
          >
            Type
          </Typography>
          <RadioGroup
            row
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            defaultValue="top"
          >
            <MuiFormLabel
              name={formField.type.name}
              checkedvalue="FM Team"
              id="FM Team"
              label={formField.type.label}
            />
            <br />
            <MuiFormLabel
              name={formField.type.name}
              checkedvalue="Vendor Team"
              id="Vendor Team"
              label={formField.type.label1}
            />
            <br />
            <MuiFormLabel
              name={formField.type.name}
              checkedvalue="Monitoring Team"
              id="Monitoring Team"
              label={formField.type.label2}
            />
          </RadioGroup>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiAutoComplete
            name={formField.workingTime.name}
            label={formField.workingTime.label}
            className="bg-white"
            open={workingTimeOpen}
            value={values.resource_calendar_id && values.resource_calendar_id.length
              ? values.resource_calendar_id[1] : values.resource_calendar_id && values.resource_calendar_id.name ? values.resource_calendar_id.name : ''}
            size="small"
            onOpen={() => {
              setWorkingTimeOpen(true);
              setWorkingTimeKeyword('');
            }}
            onClose={() => {
              setWorkingTimeOpen(false);
              setWorkingTimeKeyword('');
            }}
            loading={workingTimeInfo && workingTimeInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={workingTimeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formField.workingTime.label}
                onChange={onWorkingTimeKeywordChange}
                variant="standard"
                required={formField.workingTime.required}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {workingTimeInfo && workingTimeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(workingTimeInfo && workingTimeInfo.err && workingTimeOpen)
            && (<FormHelperText><span className="text-danger">{generateErrorMessage(workingTimeInfo)}</span></FormHelperText>)}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiAutoComplete
            name={formField.teamCategory.name}
            label={formField.teamCategory.label}
            className="bg-white"
            open={teamCategoryOpen}
            size="small"
            value={values.team_category_id && values.team_category_id.length ? values.team_category_id[1] : values.team_category_id && values.team_category_id.name ? values.team_category_id.name : ''}
            onOpen={() => {
              setTeamCategoryOpen(true);
              setTeamCategoryKeyword('');
            }}
            onClose={() => {
              setTeamCategoryOpen(false);
              setTeamCategoryKeyword('');
            }}
            loading={teamCategoryInfo && teamCategoryInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTeamCategoryKeywordChange}
                label={formField.teamCategory.label}
                variant="standard"
                className="without-padding"
                placeholder="Search & Select"
                required={formField.teamCategory.required}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamCategoryInfo && teamCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(teamCategoryInfo && teamCategoryInfo.err && teamCategoryOpen)
            && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamCategoryInfo)}</span></FormHelperText>)}
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormControl className={classes.margin}>
            <MuiAutoComplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filled"
              name={formField.space.name}
              label={formField.space.label}
              open={spaceOpen}
              value={values.location_ids && values.location_ids.length > 0 ? values.location_ids : []}
              defaultValue={((buildingsInfo && !buildingsInfo.loading) || (spaceName && !spaceName.loading)) && values.location_ids && values.location_ids.length > 0  && spaceName && spaceName.data ? spaceName.data : []}
              size="small"
              onOpen={() => {
                setSpaceOpen(true);
              }}
              onClose={() => {
                setSpaceOpen(false);
              }}
              loading={(buildingsInfo && buildingsInfo.loading) || (spaceName && spaceName.loading)}
              options={spaceOptions ? getArrayFromValuesById(spaceOptions, isAssociativeArray(values.location_ids || []), 'id') : []}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name)}
              onChange={(e, data) => { setFieldValue('location_ids', data); }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={formField.space.label}
                  className={((getOldData(values.location_ids)) || (values.location_ids && values.location_ids > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {(buildingsInfo && buildingsInfo.loading) || (spaceName && spaceName.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {values.location_ids && values.location_ids.length ? (
                            <IconButton
                              onClick={spaceNameClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          ) : ''}
                          <IconButton
                            onClick={spaceNameModal}
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
          {(buildingsInfo && buildingsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(buildingsInfo)}</span></FormHelperText>)}
        </Col>
      </Row>
      <Dialog size="lg" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <MultipleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraSearchModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              headers={headers}
              oldValues={oldValues || []}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default BasicForm;
