/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  CircularProgress,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog, DialogContent, DialogContentText, Grid,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';

import { getEmployeeDataList } from '../../assets/equipmentService';

import {
  extractOptionsObject,
  extractOptionsObjectWithName,
  extractTextObject,
  generateErrorMessage,
  getAllowedCompanies,
} from '../../util/appUtils';

import { getSpaceAllSearchList } from '../../helpdesk/ticketService';

import { getPantrySearchList } from '../pantryService';

import SearchModal from './searchModal';

const appModels = require('../../util/appModels').default;

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

const BasicForm = React.memo((props) => {
  const {
    setFieldValue,
    editId,
    formField: {
      employeeId,
      pantryId,
      spaceId,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    employee_id,
    space_id,
    pantry_id,
  } = formValues;

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantryKeyword, setPantryKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'work_phone', 'work_email']);

  const { userInfo } = useSelector((state) => state.user);
  const { employeeListInfo } = useSelector((state) => state.equipment);
  const { spaceInfoList } = useSelector((state) => state.ticket);
  const { pantrySearchInfo } = useSelector((state) => state.pantry);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && employeeOpen) {
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, employeeKeyword));
    }
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && pantryOpen) {
      dispatch(getPantrySearchList(companies, appModels.PANTRY, pantryKeyword));
    }
  }, [userInfo, pantryKeyword, pantryOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  const onEmployeeKeyWordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onPantryKeyWordChange = (event) => {
    setPantryKeyword(event.target.value);
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name', 'work_phone', 'work_email']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setPlaceholder('Employees');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setEmployeeOpen(false);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setColumns(['id', 'name', 'path_name', 'space_name', 'asset_category_id']);
    setFieldName('space_id');
    setModalName('Space List');
    setPlaceholder('Spaces');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onPantryClear = () => {
    setPantryKeyword(null);
    setFieldValue('pantry_id', '');
    setPantryOpen(false);
  };

  const showPantryModal = () => {
    setModelValue(appModels.PANTRY);
    setColumns(['id', 'name', 'pantry_sequence', 'maintenance_team_id']);
    setFieldName('pantry_id');
    setModalName('Pantry List');
    setPlaceholder('Pantries');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const locationOptions = extractOptionsObject(employeeListInfo, employee_id);
  const pantryOptions = extractOptionsObject(pantrySearchInfo, pantry_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={employeeId.name}
            label={employeeId.label}
            isRequired
            formGroupClassName="m-1"
            oldValue={getOldData(employee_id)}
            value={employee_id && employee_id.name ? employee_id.name : getOldData(employee_id)}
            apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
            open={employeeOpen}
            size="small"
            onOpen={() => {
              setEmployeeOpen(true);
              setEmployeeKeyword('');
            }}
            onClose={() => {
              setEmployeeOpen(false);
              setEmployeeKeyword('');
            }}
            loading={employeeListInfo && employeeListInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={locationOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onEmployeeKeyWordChange}
                variant="standard"
                label={employeeId.label}
                required
                value={employeeKeyword}
                className={((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onEmployeeClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showEmployeeModal}
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
            sx={{
              marginBottom: '20px',
            }}
            name={pantryId.name}
            label={pantryId.label}
            isRequired
            formGroupClassName="m-1"
            oldValue={getOldData(pantry_id)}
            value={pantry_id && pantry_id.name ? pantry_id.name : getOldData(pantry_id)}
            apiError={(pantrySearchInfo && pantrySearchInfo.err) ? generateErrorMessage(pantrySearchInfo) : false}
            open={pantryOpen}
            size="small"
            onOpen={() => {
              setPantryOpen(true);
              setPantryKeyword('');
            }}
            onClose={() => {
              setPantryOpen(false);
              setPantryKeyword('');
            }}
            loading={pantrySearchInfo && pantrySearchInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={pantryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onPantryKeyWordChange}
                variant="standard"
                label={pantryId.label}
                required
                value={pantryKeyword}
                className={((getOldData(pantry_id)) || (pantry_id && pantry_id.id) || (pantryKeyword && pantryKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {pantrySearchInfo && pantrySearchInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(pantry_id)) || (pantry_id && pantry_id.id) || (pantryKeyword && pantryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onPantryClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showPantryModal}
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
            sx={{
              marginBottom: '20px',
            }}
            name={spaceId.name}
            label={spaceId.label}
            isRequired
            formGroupClassName="m-1"
            oldValue={getOldData(space_id)}
            value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
            apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
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
            classes={{
              option: classes.option,
            }}
            loading={spaceInfoList && spaceInfoList.loading}
            getOptionSelected={(option, value) => option.path_name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            renderOption={(props, option) => (
              <ListItemText
                {...props}
                primary={(
                  <>
                    <Box>
                      <Typography
                        sx={{
                          font: 'Suisse Intl',
                          fontWeight: 800,
                          fontSize: '15px',
                        }}
                      >
                        {option.name || option.space_name}
                      </Typography>
                    </Box>
                    {option?.path_name && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          {option?.path_name}
                        </Typography>
                      </Box>
                    )}
                    {option?.asset_category_id && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <span>
                            {' '}
                            {option.asset_category_id && (
                            <>
                              {extractTextObject(option.asset_category_id)}
                            </>
                            )}
                          </span>
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              />
            )}
            options={spaceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onSpaceKeyWordChange}
                label={spaceId.label}
                required
                variant="standard"
                value={spaceKeyword}
                className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSpaceClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
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
        </Grid>
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
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
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
