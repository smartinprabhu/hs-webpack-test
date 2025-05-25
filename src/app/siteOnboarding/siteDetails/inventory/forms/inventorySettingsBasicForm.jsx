/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText, DialogActions,
  Typography,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import {
  getRecipientList, getProductCompany, setInvRecipientsLocationId,
} from '../../../siteService';
import { AddThemeColor } from '../../../../themes/theme';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import customData from '../data/customData.json';
import {
  getAllCompanies, generateErrorMessage, extractOptionsObject,
  getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

const InventorySettingsBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      productBatch,
      productAccess,
      accessCompany,
      reorderLevel,
      remainderAlert,
      recipients,
      requestState,
      typeOfOperation,
      requester,
      recipientsAdvance,
      isSendEmail,
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
    include_reminder_alert_items, recipients_ids, products_list_access, product_list_company_id,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [productOpen, setProductOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    recipientsInfo, productCompanyInfo, invRecipientsLocationId,
  } = useSelector((state) => state.site);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  // const [invRecipientsLocationId, setInvRecipientsLocationId] = useState(recipients_ids);
  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyKeyword, setCompanyKeyword] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catKeyword, setCatKeyword] = useState('');

  const companies = getAllCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (editId) {
      setInvRecipientsLocationId(recipients_ids);
    }
  }, [editId]);

  useEffect(() => {
    if (userInfo) {
      dispatch(setInvRecipientsLocationId(recipients_ids));
    }
  }, [userInfo]);

  useEffect(() => {
    if (recipients_ids) {
      dispatch(setInvRecipientsLocationId(recipients_ids));
    }
  }, [recipients_ids]);

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length && recipientsOpen) {
      setRecipientsOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(invRecipientsLocationId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setRecipientsOptions([{ name: 'Loading...' }]);
    } else {
      setRecipientsOptions([]);
    }
  }, [recipientsInfo, recipientsOpen]);

  useEffect(() => {
    if (invRecipientsLocationId) {
      setFieldValue('recipients_ids', invRecipientsLocationId);
    }
  }, [invRecipientsLocationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && recipientsOpen) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsOpen, recipientsKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companyOpen) {
        await dispatch(getProductCompany(companies, appModels.COMPANY, companyKeyword));
      }
    })();
  }, [userInfo, companyKeyword, companyOpen]);

  const handleRecipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setInvRecipientsLocationId(options));
    setCheckRows(options);
  };

  const onRecipientsKeywordClear = () => {
    setRecipientsKeyword(null);
    dispatch(setInvRecipientsLocationId([]));
    setCheckRows([]);
    setRecipientsOpen(false);
  };

  const onAccessProductKeywordClear = () => {
    setCompanyKeyword(null);
    setFieldValue('product_list_company_id', '');
    setCompanyOpen(false);
  };

  const onRecipientKeyWordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };

  const onCompanyKeyWordChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

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

  const showAccessCompanyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('product_list_company_id');
    setModalName('Company');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const setLocationIds = (data) => {
    const Location = ([...invRecipientsLocationId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setInvRecipientsLocationId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };
  const parentOptions = extractOptionsObject(productCompanyInfo, product_list_company_id);

  return (
    <>
      <Row className="mb-1 requestorForm-input">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            General Settings
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={productBatch.name}
              label={productBatch.label}
              autoComplete="off"
              type="text"
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={productAccess.name}
              label={productAccess.label}
              open={productOpen}
              size="small"
              onOpen={() => {
                setProductOpen(true);
              }}
              onClose={() => {
                setProductOpen(false);
              }}
              disableClearable
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.productListAccess}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={productAccess.label}
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
          {products_list_access && products_list_access.value === 'Company Level' ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={accessCompany.name}
                label={accessCompany.label}
                isRequired
                oldValue={getOldData(product_list_company_id)}
                value={product_list_company_id && product_list_company_id.name ? product_list_company_id.name : getOldData(product_list_company_id)}
                apiError={(productCompanyInfo && productCompanyInfo.err) ? generateErrorMessage(productCompanyInfo) : false}
                open={companyOpen}
                size="small"
                onOpen={() => {
                  setCompanyOpen(true);
                  setCompanyKeyword('');
                }}
                onClose={() => {
                  setCompanyOpen(false);
                  setCompanyKeyword('');
                }}
                loading={companyOpen && productCompanyInfo && productCompanyInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={parentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCompanyKeyWordChange}
                    variant="standard"
                    label={accessCompany.label}
                    className={((getOldData(product_list_company_id)) || (product_list_company_id && product_list_company_id.id) || (companyKeyword && companyKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {productCompanyInfo && productCompanyInfo.loading && companyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(product_list_company_id)) || (product_list_company_id && product_list_company_id.id) || (companyKeyword && companyKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onAccessProductKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showAccessCompanyModal}
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
          )
            : ''}

        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Email Communications
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3 mt-4">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={reorderLevel.name}
              label={reorderLevel.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <MuiCheckboxField
              sx={{
                marginBottom: '20px',
              }}
              name={remainderAlert.name}
              label={remainderAlert.label}
            />
          </Col>
          {include_reminder_alert_items === true ? (
            <>
              {/* <Col xs={12} sm={12} md={12} lg={12}>
                <div>
                  <FormControl className={classes.margin}>
                    <Label for={recipients.name}>
                      {recipients.label}
                    </Label>
                    <Autocomplete
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
                      defaultValue={invRecipientsLocationId}
                      onChange={(e, options) => handleRecipients(options)}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={recipientsOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          className={((getOldData(invRecipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
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
                  </FormControl>
                </div>
              </Col> */}
              <Col xs={12} sm={12} lg={12} md={12}>
                {/* <Label for={recipients.name}>
                      {recipients.label}
                      {' '}
                      <span className="text-danger">*</span>
                    </Label> */}
                <Autocomplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  multiple
                  filterSelectedOptions
                  name="categoryuser"
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
                  defaultValue={invRecipientsLocationId}
                  onChange={(e, options) => handleRecipients(options)}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={recipientsOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={recipients.label}
                      className={((getOldData(invRecipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
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
                                <IoCloseOutline size={22} fontSize="small" />
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
            </>
          ) : ''}
        </Col>
      </Row>
      <Row>
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
                oldRecipientsData={invRecipientsLocationId && invRecipientsLocationId.length ? invRecipientsLocationId : []}
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
                  onClick={() => { if (fieldName === 'recipients_ids') { setLocationIds(checkedRows); } }}
                >
                  {' '}
                  Add
                </Button>
              ) : ''}
          </DialogActions>
        </Dialog>
      </Row>
    </>
  );
});

InventorySettingsBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default InventorySettingsBasicForm;
