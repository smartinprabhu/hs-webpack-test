/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

import { InputField, FormikAutocomplete, DateTimeField } from '@shared/formFields';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getPartners,
} from '../../../assets/equipmentService';
import { getStockPickingTypes, getPurchaseAgreements, getPurchaseRequests } from '../../purchaseService';
import {
  generateErrorMessage,
  getAllowedCompanies, getDateTimeSeconds, lettersNumbersOnly,
} from '../../../util/appUtils';
import SearchModal from '../../rfq/forms/searchModal';
import SearchModalMultiple from '../../rfq/forms/searchModalMultiple';

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

const BasicForm = (props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      partnerId,
      partnerRef,
      dateOrder,
      companyId,
      pickingTypeId,
      requisitionId,
      requestId,
    },
  } = props;
  const dispatch = useDispatch();
  const orderDateNotVisibleState = ['purchase', 'done', 'cancel'];
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    partner_id,
    company_id,
    requisition_id,
    request_id,
    picking_type_id,
    date_order,
  } = formValues;
  const [companyOpen, setCompanyOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestKeyword, setRequestKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');
  const [agreementKeyword, setAgreementKeyword] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { allowedCompanies } = useSelector((state) => state.setup);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    quotationDetails, pickingTypes, purchaseRequestInfo, purchaseAgreementInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data && agreementOpen) && ((partner_id && partner_id.id) || (quotationDetails && quotationDetails.data && quotationDetails.data[0].partner_id))) {
      const vid = partner_id && partner_id.id ? partner_id.id : quotationDetails.data[0].partner_id[0];
      dispatch(getPurchaseAgreements(companies, appModels.PURCHASEAGREEMENT, vid));
    }
  }, [userInfo, partner_id, agreementOpen, quotationDetails]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      dispatch(getStockPickingTypes(companies, appModels.STOCKPICKINGTYPES, typeKeyword));
    }
  }, [userInfo, typeKeyword, typeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && requestOpen) {
      dispatch(getPurchaseRequests(companies, appModels.PURCHASEREQUEST, requestKeyword));
    }
  }, [userInfo, requestKeyword, requestOpen]);

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Vendors');
    setOtherFieldName('supplier');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const showAgreementModal = () => {
    setModelValue(appModels.PURCHASEAGREEMENT);
    setFieldName('requisition_id');
    setModalName('Purchase Agreement');
    setOtherFieldName('vendor_id');
    setOtherFieldValue(partner_id);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraMultipleModal(true);
  };

  const showRequestModal = () => {
    setModelValue(appModels.PURCHASEREQUEST);
    setFieldName('request_id');
    setModalName('Purchase Request');
    setOtherFieldName('');
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'requisition_name', 'requestor_id', 'site_spoc', 'site_contact_details', 'requestor_email', 'bill_to_address', 'requestor_full_name']);
    setExtraMultipleModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onRequestKeywordChange = (event) => {
    setRequestKeyword(event.target.value);
  };

  const onAgreementKeywordChange = (event) => {
    setAgreementKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('partner_id', '');
    setCustomerOpen(false);
  };

  const onAgreementKeywordClear = () => {
    setAgreementKeyword(null);
    setFieldValue('requisition_id', '');
    setAgreementOpen(false);
  };

  const onRequestKeywordClear = () => {
    setRequestKeyword(null);
    setFieldValue('request_id', '');
    setRequestOpen(false);
  };

  const showTypeModal = () => {
    setModelValue(appModels.STOCKPICKINGTYPES);
    setFieldName('picking_type_id');
    setModalName('Operation Types');
    setOtherFieldName('code');
    setOtherFieldValue('incoming');
    setCompanyValue(false);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'warehouse_id']);
  };

  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };

  const onTypeKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('picking_type_id', '');
    setCustomerOpen(false);
  };

  let customerOptions = [];
  let agreementOptions = [];
  let requestOptions = [];
  let typeOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (purchaseAgreementInfo && purchaseAgreementInfo.loading) {
    agreementOptions = [{ name: 'Loading..' }];
  }

  if (purchaseRequestInfo && purchaseRequestInfo.loading) {
    requestOptions = [{ display_name: 'Loading..' }];
  }

  if (quotationDetails && quotationDetails.data && quotationDetails.data[0].partner_id) {
    const oldPartId = [{ id: quotationDetails.data[0].partner_id[0], name: quotationDetails.data[0].partner_id[1] }];
    const newArr = [...customerOptions, ...oldPartId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (purchaseAgreementInfo && purchaseAgreementInfo.data) {
    agreementOptions = purchaseAgreementInfo.data;
  }

  if (purchaseRequestInfo && purchaseRequestInfo.data) {
    requestOptions = purchaseRequestInfo.data;
  }

  if (pickingTypes && pickingTypes.loading) {
    typeOptions = [{ name: 'Loading..' }];
  }

  if (picking_type_id && picking_type_id.length && picking_type_id.length > 0) {
    const oldPartId = [{ id: picking_type_id[0], name: picking_type_id[1] }];
    const newArr = [...typeOptions, ...oldPartId];
    typeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.data) {
    const arr = [...typeOptions, ...pickingTypes.data];
    typeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.err) {
    typeOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const currentState = quotationDetails && quotationDetails.data && quotationDetails.data.length > 0 && quotationDetails.data[0].state ? quotationDetails.data[0].state : '';
  const fieldDisable = !!(currentState && (currentState === 'done' || currentState === 'cancel'));

  return (
    <>
      <Row className="mb-1 add-purchase-order-form">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={partnerId.name}
              label={partnerId.label}
              isRequired
              formGroupClassName="m-1"
              disabled={fieldDisable}
              oldValue={getOldData(partner_id)}
              value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id)}
              open={customerOpen}
              size="small"
              onOpen={() => {
                setCustomerOpen(true);
                setCustomerKeyword('');
              }}
              onClose={() => {
                setCustomerOpen(false);
                setCustomerKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={partnersInfo && partnersInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6>{option.name}</h6>
                  <p className="float-left">
                    {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                    )}
                  </p>
                  <p className="float-right">
                    {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                    )}
                  </p>
                </>
              )}
              options={customerOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCustomerKeywordChange}
                  variant="outlined"
                  value={customerKeyword}
                  className={((partner_id && partner_id.id) || (customerKeyword && customerKeyword.length > 0) || (partner_id && partner_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {!fieldDisable && (
                          <InputAdornment position="end">
                            {((partner_id && partner_id.id) || (customerKeyword && customerKeyword.length > 0) || (partner_id && partner_id.length)) && (
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
                        )}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(partnersInfo && partnersInfo.err) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
            )}
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={partnerRef.name}
              label={partnerRef.label}
              isRequired
              onKeyPress={lettersNumbersOnly}
              disabled={fieldDisable}
              formGroupClassName="m-1"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={requisitionId.name}
              label={requisitionId.label}
              formGroupClassName="m-1"
              disabled={fieldDisable}
              open={agreementOpen}
              size="small"
              value={requisition_id && requisition_id.length ? requisition_id[1] : requisition_id.name ? requisition_id.name : ''}
              onOpen={() => {
                setAgreementOpen(true);
              }}
              onClose={() => {
                setAgreementOpen(false);
              }}
              loading={purchaseAgreementInfo && purchaseAgreementInfo.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={agreementOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onAgreementKeywordChange}
                  variant="outlined"
                  value={agreementKeyword}
                  className={((requisition_id && requisition_id.id) || (agreementKeyword && agreementKeyword.length > 0) || (requisition_id && requisition_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {purchaseAgreementInfo && purchaseAgreementInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {!fieldDisable && (
                          <InputAdornment position="end">
                            {((requisition_id && requisition_id.id) || (agreementKeyword && agreementKeyword.length > 0) || (requisition_id && requisition_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onAgreementKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showAgreementModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(purchaseAgreementInfo && purchaseAgreementInfo.err && agreementOpen)
                && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseAgreementInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={pickingTypeId.name}
              label={pickingTypeId.label}
              isRequired
              disabled={fieldDisable}
              formGroupClassName="m-1"
              oldValue={getOldData(picking_type_id)}
              value={picking_type_id && picking_type_id.name ? picking_type_id.name : getOldData(picking_type_id)}
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
                setTypeKeyword('');
              }}
              onClose={() => {
                setTypeOpen(false);
                setTypeKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={pickingTypes && pickingTypes.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6>{option.name}</h6>
                  <p className="float-left">
                    {option.warehouse_id && (
                    <>
                      {option.warehouse_id[1]}
                    </>
                    )}
                  </p>
                </>
              )}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTypeKeywordChange}
                  variant="outlined"
                  value={typeKeyword}
                  className={((picking_type_id && picking_type_id.id) || (typeKeyword && typeKeyword.length > 0) || (picking_type_id && picking_type_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {pickingTypes && pickingTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {!fieldDisable && (
                          <InputAdornment position="end">
                            {((picking_type_id && picking_type_id.id) || (typeKeyword && typeKeyword.length > 0) || (picking_type_id && picking_type_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTypeKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTypeModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(pickingTypes && pickingTypes.err) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(pickingTypes)}</span></FormHelperText>
            )}
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={dateOrder.name}
              label={dateOrder.label}
              isRequired={dateOrder.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={dateOrder.label}
              disablePastDate={!editId}
              readOnly={!!orderDateNotVisibleState.includes(currentState)}
              defaultValue={date_order ? new Date(getDateTimeSeconds(date_order)) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={companyId.name}
              label={companyId.label}
              formGroupClassName="m-1"
              isRequired
              oldValue={getOldData(company_id)}
              disabled
              value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
              open={companyOpen}
              size="small"
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
                  placeholder="Search & Select"
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
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={requestId.name}
              label={requestId.label}
              formGroupClassName="m-1"
              open={requestOpen}
              size="small"
              disabled={fieldDisable}
              value={request_id && request_id.length ? request_id[1] : request_id && request_id.display_name ? request_id.display_name : ''}
              onOpen={() => {
                setRequestOpen(true);
                setRequestKeyword('');
              }}
              onClose={() => {
                setRequestOpen(false);
                setRequestKeyword('');
              }}
              loading={purchaseRequestInfo && purchaseRequestInfo.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.display_name === value.display_name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
              options={requestOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onRequestKeywordChange}
                  variant="outlined"
                  className={((request_id && request_id.id) || (agreementKeyword && agreementKeyword.length > 0) || (request_id && request_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  value={requestKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {purchaseRequestInfo && purchaseRequestInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {!fieldDisable && (
                          <InputAdornment position="end">
                            {((request_id && request_id.id) || (requestKeyword && requestKeyword.length > 0) || (request_id && request_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onRequestKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showRequestModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(purchaseRequestInfo && purchaseRequestInfo.err && requestOpen)
                && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseRequestInfo)}</span></FormHelperText>)}
          </Col>
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
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
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
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
};

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
