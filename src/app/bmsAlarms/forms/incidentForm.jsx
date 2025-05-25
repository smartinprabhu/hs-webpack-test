/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';
import { useFormikContext } from 'formik';
import {
  Dialog, DialogContent, DialogContentText, DialogActions, Typography,
} from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import {
  generateErrorMessage, extractOptionsObject, getAllCompanies,
} from '../../util/appUtils';
import {
  getServiceCategory, setServiceImpactedId,
} from '../breakdownService';
import { AddThemeColor } from '../../themes/theme';
import {
  getTeamList,
} from '../../assets/equipmentService';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
import SearchModalTeam from '../../assets/forms/advancedSearchModal';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';

const appModels = require('../../util/appModels').default;

const IncidentForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    editId,
    formField: {
      incidentDate,
      remark,
      Severity,
      categoryId,
      maintenanceTeamId,
      subCategoryId,
    },
  } = props;

  const useStyles = makeStyles((themeStyle) => ({
    margin: {
      marginBottom: themeStyle.spacing(1.25),
      width: '100%',
    },
  }));
  const { values: formValues } = useFormikContext();
  const {
    severity, resolution, planned_sla_end_date, category_id, sub_category_id, maintenance_team_id,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const [criticalOpen, setCriticalOpen] = useState(false);
  const [subCatOpen, setSubCatOpen] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);

  const [serviceCategoryOpen, setServiceCategoryOpen] = useState(false);
  const [serviceCategoryKeyword, setServiceCategoryKeyword] = useState('');

  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [extraModalTeam, setExtraModalTeam] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    serviceImpactId, servicecatInfoList,
    btConfigInfo, trackerDetails,
  } = useSelector((state) => state.bmsAlarms);

  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);

  const companies = getAllCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && serviceCategoryOpen) {
        const tempLevel = configData.category_type ? configData.category_type : '';
        let domain = '';
        if (tempLevel === 'Site') {
          domain = `["company_id","=",${userCompanyId}]`;
        } else if (tempLevel === 'Company') {
          domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
        } else if (tempLevel === 'Instance') {
          domain = '"|",["company_id","=",1],["company_id","=",false]';
        }

        if (tempLevel && serviceCategoryKeyword) {
          domain = `${domain},["name","ilike","${serviceCategoryKeyword}"]`;
        }

        if (!tempLevel && serviceCategoryKeyword) {
          domain = `["name","ilike","${serviceCategoryKeyword}"]`;
        }
        await dispatch(getServiceCategory(domain, appModels.BMSCATEGORY));
      }
    })();
  }, [serviceCategoryOpen, serviceCategoryKeyword, btConfigInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    (async () => {
      if (category_id && category_id.sub_category_ids) {
        setSubCategoryOptions(category_id.sub_category_ids);
        if (!editId) {
          setFieldValue('sub_category_id', '');
        }
        if (editId && trackerDetails && trackerDetails.data && trackerDetails.data.length && trackerDetails.data[0].category_id && !(trackerDetails.data[0].category_id.id === (category_id && category_id.id))) {
          setFieldValue('sub_category_id', '');
        }
      } else {
        setSubCategoryOptions([]);
        setFieldValue('sub_category_id', '');
      }
    })();
  }, [category_id]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onServiceCategoryChange = (event) => {
    setServiceCategoryKeyword(event.target.value);
  };

  const showServiceCatModal = () => {
    setModelValue(appModels.BMSCATEGORY);
    setFieldName('category_id');
    setModalName('Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    const tempLevel = configData.category_type ? configData.category_type : '';
    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }
    setCompanyValue(domain);
    setColumns(['id', 'name','sub_category_ids']);
    setExtraModal(true);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModalTeam(true);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const onServiceCategoryClear = () => {
    setServiceCategoryKeyword(null);
    setFieldValue('category_id', '');
    setSubCategoryOptions([]);
    setFieldValue('sub_category_id', '');
    setServiceCategoryOpen(false);
  };

  const setLocationIds = (data) => {
    const Location = ([...serviceImpactId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setServiceImpactedId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  const onChange = (data) => {
    setFieldValue('resolution', data.target.value);
  };

  function getCriticalLabel(data) {
    if (customData && customData.criticalTextForm[data]) {
      const s = customData.criticalTextForm[data].label;
      return s;
    }
    return '';
  }

  const teamOptions = extractOptionsObject(teamsInfo, maintenance_team_id);

  const serviceCategoryOptions = extractOptionsObject(servicecatInfoList, category_id);
  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Incident Information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MuiAutoComplete
            name={categoryId.name}
            label={categoryId.label}
            labelClassName="mb-1"
            isRequired
            formGroupClassName="mb-1 w-100"
            oldValue={getOldData(category_id)}
            value={category_id && category_id.name ? category_id.name : getOldData(category_id)}
            apiError={(servicecatInfoList && servicecatInfoList.err && serviceCategoryOpen) ? generateErrorMessage(servicecatInfoList) : false}
            open={serviceCategoryOpen}
            size="small"
            onOpen={() => {
              setServiceCategoryOpen(true);
              setServiceCategoryKeyword('');
            }}
            onClose={() => {
              setServiceCategoryOpen(false);
              setServiceCategoryKeyword('');
            }}
            loading={servicecatInfoList && servicecatInfoList.loading && serviceCategoryOpen}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={serviceCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={categoryId.label}
                required
                onChange={(e) => { onServiceCategoryChange(e.target.value); }}
                variant="standard"
                value={serviceCategoryKeyword}
                // className={((category_id && category_id.id) || (serviceCategoryKeyword && serviceCategoryKeyword.length > 0) || (category_id && category_id.length))
                //   ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {servicecatInfoList && servicecatInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((category_id && category_id.id) || (serviceCategoryKeyword && serviceCategoryKeyword.length > 0) || (category_id && category_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onServiceCategoryClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showServiceCatModal}
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
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MuiAutoComplete
            name={subCategoryId.name}
            label={subCategoryId.label}
            labelClassName="mb-1"
            isRequired
            formGroupClassName="mb-1 w-100"
            disabled={!(category_id && category_id.id)}
            open={subCatOpen}
            disableClearable
            oldValue={getOldData(sub_category_id)}
            value={sub_category_id && sub_category_id.name ? sub_category_id.name : getOldData(sub_category_id)}
            size="small"
            onOpen={() => {
              setSubCatOpen(true);
            }}
            onClose={() => {
              setSubCatOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={subCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={subCategoryId.label}
                variant="standard"
                required
               // className="input-small-custom without-padding"
                placeholder="Select"
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
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MuiAutoComplete
            name={Severity.name}
            label={Severity.label}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            open={criticalOpen}
            disableClearable
            oldValue={getCriticalLabel(severity)}
            value={severity && severity.label ? severity.label : getCriticalLabel(severity)}
            size="small"
            onOpen={() => {
              setCriticalOpen(true);
            }}
            onClose={() => {
              setCriticalOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.critical}
            renderInput={(params) => (
              <TextField
                {...params}
                label={Severity.label}
                variant="standard"
                // className="input-small-custom without-padding"
                placeholder="Select"
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
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MuiAutoComplete
            name={maintenanceTeamId.name}
            label={maintenanceTeamId.label}
            className="bg-white"
            formGroupClassName="m-1"
            oldValue={getOldData(maintenance_team_id)}
            value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : getOldData(maintenance_team_id)}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            open={teamOpen}
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
            options={teamOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setTeamKeyword(e.target.value)}
                variant="standard"
                label={maintenanceTeamId.label}
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
                          onClick={onTeamClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showTeamModal}
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
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MuiDateTimeField
            sx={{
              marginBottom: '20px',
            }}
            name={incidentDate.name}
            localeText={{ todayButtonLabel: 'Now' }}
            slotProps={{  actionBar: {
              actions: ['today', 'clear','accept'],
            }, textField: { variant: 'standard', error:false } }}
            label={incidentDate.label}
            isRequired={incidentDate.required}
            value={planned_sla_end_date ? dayjs(editId ? moment.utc(planned_sla_end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : planned_sla_end_date) : null}
            ampm={false}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            isErrorHandle
            disablePast
          />
        </Grid>
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
              oldServiceData={serviceImpactId && serviceImpactId.length ? serviceImpactId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => { if (fieldName === 'services_impacted_ids') { setLocationIds(checkedRows); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModalTeam}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalTeam(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalTeam
              modelName={modelValue}
              afterReset={() => { setExtraModalTeam(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

IncidentForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default IncidentForm;
