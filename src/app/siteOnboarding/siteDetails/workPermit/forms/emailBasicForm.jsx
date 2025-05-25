/* eslint-disable no-unneeded-ternary */
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
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@mui/material/Button';
import {
  Row, Col,
} from 'reactstrap';
import {
  Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import DialogHeader from '../../../../commonComponents/dialogHeader';

import {
  getAllCompanies, getArrayFromValuesById,
  isArrayColumnExists, getColumnArrayById,
} from '../../../../util/appUtils';
import {
  getRecipientList, setRecipientsLocationId,
} from '../../../siteService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from '../../inspectionSchedule/forms/searchModalMultiple';
import customData from '../data/customData.json';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const InventoryEmailBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    editPageIndex,
    selectedData,
    formField: {
      requestState,
      messageType,
      isAuthorizer,
      isEhs,
      isVendor,
      isRequestor,
      isSecurity,
      isRecipients,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    recipients_ids, is_authorizer, state, message_type,
  } = formValues;

  const [requestOpen, setRequestOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo);
  const {
    recipientsInfo, recipientsLocationId,
  } = useSelector((state) => state.site);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  function getRequestLabel(value) {
    let res = '';
    if (customData && customData.stateWPText[value]) {
      res = customData.stateWPText[value].label;
    }

    return res;
  }

  function getTypeLabel(value) {
    let res = '';
    if (customData && customData.typeWPText[value]) {
      res = customData.typeWPText[value].label;
    }

    return res;
  }

  useEffect(() => {
    if (editId || editPageIndex) {
      dispatch(setRecipientsLocationId(recipients_ids));
    }
  }, [editId]);

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length && recipientsOpen) {
      setRecipientsOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(recipientsLocationId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setRecipientsOptions([{ name: 'Loading...' }]);
    } else {
      setRecipientsOptions([]);
    }
  }, [recipientsInfo, recipientsOpen]);

  useEffect(() => {
    if (recipientsLocationId) {
      setFieldValue('recipients_ids', recipientsLocationId);
    }
  }, [recipientsLocationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && recipientsOpen) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsOpen, recipientsKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const handleRecipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setRecipientsLocationId(options));
    setCheckRows(options);
  };

  const onRecipientsKeywordClear = () => {
    setRecipientsKeyword(null);
    dispatch(setRecipientsLocationId([]));
    setCheckRows([]);
    setRecipientsOpen(false);
  };

  const onRecipientKeyWordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };

  const showRecipientsModal = () => {
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('recipients_ids');
    setModalName('Recipient List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const setLocationIds = (data) => {
    const Location = ([...recipientsLocationId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setRecipientsLocationId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  const getType = () => {
    const array = customData.typeStatus;
    const existingRequests = selectedData.filter((item) => item.state === (state && state.value ? state.value : state));
    const typelist = getColumnArrayById(existingRequests, 'message_type');
    const filteredLIst = array.filter((item) => !typelist.includes(item.value));
    return filteredLIst;
  };

  const getRequest = () => {
    const array = customData.requestStatus;
    const existingRequests = selectedData.filter((item) => item.message_type === (message_type && message_type.value ? message_type.value : message_type));
    const reqlist = getColumnArrayById(existingRequests, 'state');
    const filteredLIst = array.filter((item) => !reqlist.includes(item.value));
    return filteredLIst;
  };

  
  const notRemovedData = selectedData.filter((item) => item && !item.isRemove);

  const types = (!editId || !editPageIndex) ? getColumnArrayById(notRemovedData, 'state') : '';

  const getRequests = (types) => {
    const array = customData.requestStatus;
    const newArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (!types.includes(array[i].value)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  const request = (!editId || !editPageIndex) ? getColumnArrayById(selectedData, 'state') : '';
  const requestOption = (!editId || !editPageIndex) ? getRequests(types) : customData.requestStatus;
  const type = (!editId || !editPageIndex) ? getColumnArrayById(selectedData, 'message_type') : '';
  //const typeOptions = (!editId || !editPageIndex) ? getType() : customData.typeStatus;
  const typeOptions = customData.typeStatus;

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={requestState.name}
              label={requestState.label}
              open={requestOpen}
              isRequired
              size="small"
              onOpen={() => {
                setRequestOpen(true);
              }}
              onClose={() => {
                setRequestOpen(false);
              }}
              disabled={editId || editPageIndex}
              oldvalue={getRequestLabel(state)}
              value={state && state.label ? state.label : getRequestLabel(state)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={requestOption}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  className="without-padding"
                  label={requestState.label}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      params.InputProps.endAdornment
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={messageType.name}
              label={messageType.label}
              open={typeOpen}
              isRequired
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              oldvalue={getTypeLabel(message_type)}
              value={message_type && message_type.label ? message_type.label : getTypeLabel(message_type)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={messageType.label}
                  className="without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      params.InputProps.endAdornment
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={isAuthorizer.name}
              label={isAuthorizer.label}
            />
          </Col>
          {is_authorizer === true ? (
            <Col xs={12} sm={12} md={12} lg={12}>
              {/* <Label for={isRecipients.name}>
                    {isRecipients.label}
                  </Label> */}
              <Autocomplete
                sx={{
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                isRequired
                name="Recipients"
                open={recipientsOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setRecipientsOpen(true);
                  setRecipientsKeyword('');
                }}
                onClose={() => {
                  setRecipientsOpen(false);
                  setRecipientsKeyword('');
                }}
                value={recipients_ids && recipients_ids.length > 0 ? recipients_ids : []}
                defaultValue={recipientsLocationId}
                onChange={(e, options) => handleRecipients(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={recipientsOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={isRecipients.label}
                    className={((getOldData(recipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => onRecipientKeyWordChange(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(recipientsInfo && recipientsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((recipientsKeyword && recipientsKeyword.length > 0) || (recipients_ids && recipients_ids.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onRecipientsKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showRecipientsModal}
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
          ) : ''}
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={isEhs.name}
              label={isEhs.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={isVendor.name}
              label={isVendor.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={isRequestor.name}
              label={isRequestor.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={isSecurity.name}
              label={isSecurity.label}
            />
          </Col>
        </Col>
      </Row>
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
      <Dialog size="xl" fullWidth open={extraModal}>
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
              oldRecipientsData={recipientsLocationId && recipientsLocationId.length ? recipientsLocationId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { if (fieldName === 'recipients_ids') { setLocationIds(checkedRows); } }}
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

InventoryEmailBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  editPageIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

export default InventoryEmailBasicForm;
