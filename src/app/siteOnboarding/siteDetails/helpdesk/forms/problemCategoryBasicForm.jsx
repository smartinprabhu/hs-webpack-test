/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  Grid,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';

import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import {
  generateErrorMessage, extractOptionsObject, getAllCompanies, getArrayFromValuesById,
  isArrayColumnExists, getColumnArrayById,
} from '../../../../util/appUtils';
import {
  getTCList, getAccessGroup,
} from '../../../siteService';
import {
  getIncidentTypes,
} from '../../../../helpdesk/ticketService';
import {
  getEmployeeList,
} from '../../../../assets/equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      teamCategoryId,
      categoryUserId,
      incidentType,
      incidentCategory,
      accessGroupIds,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    team_category_id, cat_user_ids, incident_type_id, access_group_ids,
  } = formValues;
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incidentKeyword, setIncidentKeyword] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [userLocationId, setUserLocationId] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [userKeyword, setUserKeyword] = useState('');
  const [userOpen, setUserOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [accessLocationId, setAccessLocationId] = useState([]);
  const [accessOptions, setAccessOptions] = useState([]);
  const [accessKeyword, setAccessKeyword] = useState('');
  const [accessOpen, setAccessOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, accessGroupInfo,
  } = useSelector((state) => state.site);
  const {
    incidentTypes,
  } = useSelector((state) => state.ticket);
  const {
    employeesInfo,
  } = useSelector((state) => state.equipment);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (editId) {
      setUserLocationId(cat_user_ids);
      setAccessLocationId(access_group_ids);
    }
  }, [editId]);

  useEffect(() => {
    if (userLocationId) {
      setFieldValue('cat_user_ids', userLocationId);
    }
  }, [userLocationId]);

  useEffect(() => {
    if (accessLocationId) {
      setFieldValue('access_group_ids', accessLocationId);
    }
  }, [accessLocationId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && userOpen) {
        await dispatch(getEmployeeList(companies, appModels.USER, userKeyword));
      }
    })();
  }, [userInfo, userKeyword, userOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && accessOpen) {
        await dispatch(getAccessGroup(companies, appModels.ACCESSGROUPS, accessKeyword));
      }
    })();
  }, [userInfo, accessKeyword, accessOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.CATEGORY, categoryKeyword));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && incidentOpen) {
        await dispatch(getIncidentTypes(companies, appModels.INCIDENTTYPE, incidentKeyword, 20));
      }
    })();
  }, [userInfo, incidentKeyword, incidentOpen]);

  const onUserKeywordClear = () => {
    setUserKeyword(null);
    setUserLocationId([]);
    setCheckRows([]);
    setUserOpen(false);
  };
  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showUserModal = () => {
    setModelValue(appModels.USER);
    setFieldName('cat_user_ids');
    setModalName('Category User List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (employeesInfo && employeesInfo.data && employeesInfo.data.length && userOpen) {
      setUserOptions(getArrayFromValuesById(employeesInfo.data, isAssociativeArray(userLocationId || []), 'id'));
    } else if (employeesInfo && employeesInfo.loading) {
      setUserOptions([{ name: 'Loading...' }]);
    } else {
      setUserOptions([]);
    }
  }, [employeesInfo, userOpen]);

  const handleParticipants = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setUserLocationId(options);
    setCheckRows(options);
  };

  const onAccessKeywordClear = () => {
    setAccessKeyword(null);
    setAccessLocationId([]);
    setCheckRows([]);
    setAccessOpen(false);
  };

  const showAccessModal = () => {
    setModelValue(appModels.ACCESSGROUPS);
    setFieldName('access_group_ids');
    setModalName('Access Group List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (accessGroupInfo && accessGroupInfo.data && accessGroupInfo.data.length && accessOpen) {
      setAccessOptions(getArrayFromValuesById(accessGroupInfo.data, isAssociativeArray(accessLocationId || []), 'id'));
    } else if (accessGroupInfo && accessGroupInfo.loading) {
      setAccessOptions([{ name: 'Loading...' }]);
    } else {
      setAccessOptions([]);
    }
  }, [accessGroupInfo, accessOpen]);

  const handleParticipantsAccess = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setAccessLocationId(options);
    setCheckRows(options);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.CATEGORY);
    setFieldName('team_category_id');
    setModalName('Team Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('team_category_id', '');
    setCategoryOpen(false);
  };

  const showSearchModalIncident = () => {
    setModelValue(appModels.INCIDENTTYPE);
    setFieldName('incident_type_id');
    setModalName('Incident Type');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onIncidentKeywordChange = (event) => {
    setIncidentKeyword(event.target.value);
  };

  const onIncidentKeywordClear = () => {
    setIncidentKeyword(null);
    setFieldValue('incident_type_id', '');
    setIncidentOpen(false);
  };

  const setSelectedRows = () => {
    setExtraMultipleModal(false);
    if (fieldName === 'cat_user_ids') {
      setUserLocationId(checkedRows.filter((item) => item.fieldName === fieldName));
    }
    if (fieldName === 'access_group_ids') {
      setAccessLocationId(checkedRows.filter((item) => item.fieldName === fieldName));
    }
  };

  const categoryOptions = extractOptionsObject(tcInfo, team_category_id);
  const incidentOptions = extractOptionsObject(incidentTypes, incident_type_id);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            type="text"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            multiple
            filterSelectedOptions
            name="categoryuser"
            open={userOpen}
            size="small"
            className="bg-white"
            onOpen={() => {
              setUserOpen(true);
              setUserKeyword('');
            }}
            onClose={() => {
              setUserOpen(false);
              setUserKeyword('');
            }}
            value={cat_user_ids && cat_user_ids.length > 0 ? cat_user_ids : []}
            defaultValue={userLocationId}
            onChange={(e, options) => handleParticipants(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={userOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={categoryUserId.label}
                className={((getOldData(userLocationId)) || (userKeyword && userKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setUserKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(employeesInfo && employeesInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((userKeyword && userKeyword.length > 0) || (cat_user_ids && cat_user_ids.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onUserKeywordClear}
                        >
                           <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showUserModal}
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
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            name={teamCategoryId.name}
            label={teamCategoryId.label}
            labelClassName="mb-2"
            formGroupClassName="mb-1 m-1 w-100"
            open={categoryOpen}
            oldValue={getOldData(team_category_id)}
            value={team_category_id && team_category_id.name ? team_category_id.name : getOldData(team_category_id)}
            size="small"
            onOpen={() => {
              setCategoryOpen(true);
              setCategoryKeyword('');
            }}
            onClose={() => {
              setCategoryOpen(false);
              setCategoryKeyword('');
            }}
            loading={tcInfo && tcInfo.loading && categoryOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(tcInfo && tcInfo.err) ? generateErrorMessage(tcInfo) : false}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCategoryKeywordChange}
                variant="standard"
                label={teamCategoryId.label}
                value={categoryKeyword}
                className={((getOldData(team_category_id)) || (team_category_id && team_category_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {tcInfo && tcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(team_category_id)) || (team_category_id && team_category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCategoryKeywordClear}
                        >
                           <IoCloseOutline size={22} fontSize="small" />
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            name={incidentType.name}
            label={incidentType.label}
            labelClassName="mb-2"
            formGroupClassName="mb-1 m-1 w-100"
            open={incidentOpen}
            oldValue={getOldData(incident_type_id)}
            value={incident_type_id && incident_type_id.name ? incident_type_id.name : getOldData(incident_type_id)}
            size="small"
            onOpen={() => {
              setIncidentOpen(true);
              setIncidentKeyword('');
            }}
            onClose={() => {
              setIncidentOpen(false);
              setIncidentKeyword('');
            }}
            loading={incidentTypes && incidentTypes.loading && incidentOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(incidentTypes && incidentTypes.err) ? generateErrorMessage(incidentTypes) : false}
            options={incidentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onIncidentKeywordChange}
                variant="standard"
                label={incidentType.label}
                value={incidentKeyword}
                className={((getOldData(incident_type_id)) || (incident_type_id && incident_type_id.id) || (incidentKeyword && incidentKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {incidentTypes && incidentTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(incident_type_id)) || (incident_type_id && incident_type_id.id) || (incidentKeyword && incidentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onIncidentKeywordClear}
                        >
                           <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSearchModalIncident}
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
        <Grid item xs={12} sm={6} md={6}>
          <h6 className="mt-4 pt-2" />
          <MuiCheckboxField
            name={incidentCategory.name}
            label={incidentCategory.label}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            multiple
            filterSelectedOptions
            name="categoryaccess"
            open={accessOpen}
            size="small"
            className="bg-white"
            onOpen={() => {
              setAccessOpen(true);
              setAccessKeyword('');
            }}
            onClose={() => {
              setAccessOpen(false);
              setAccessKeyword('');
            }}
            value={access_group_ids && access_group_ids.length > 0 ? access_group_ids : []}
            defaultValue={accessLocationId}
            onChange={(e, options) => handleParticipantsAccess(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={accessOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={accessGroupIds.label}
                className={((getOldData(accessLocationId)) || (accessKeyword && accessKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setAccessKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(accessGroupInfo && accessGroupInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((accessKeyword && accessKeyword.length > 0) || (access_group_ids && access_group_ids.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onAccessKeywordClear}
                        >
                           <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showAccessModal}
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
              oldSpaceIdData={userLocationId && userLocationId.length ? userLocationId : []}
              oldAccessData={accessLocationId && accessLocationId.length ? accessLocationId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setSelectedRows()}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
