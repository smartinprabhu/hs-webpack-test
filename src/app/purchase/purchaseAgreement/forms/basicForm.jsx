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
  getEmployeeList,
} from '../../../assets/equipmentService';
import { getAgreementType } from '../../purchaseService';

import {
  generateErrorMessage,
  getAllowedCompanies, getDateTimeSeconds, lettersNumbersOnly,
} from '../../../util/appUtils';
import SearchModal from '../../rfq/forms/searchModal';
import SearchModalMultiple from './searchModalMultiple';

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
      purchaseRepresentative,
      agreementType,
      vendor,
      agreementDeadline,
      orderingDate,
      scheduledDate,
      sourceDocument,
      companyId,
    },
  } = props;
  const dispatch = useDispatch();
  const representativeReadonly = ['draft', 'in_progress', 'open'];
  const vendorReadonly = ['ongoing', 'done'];
  const adReadonly = ['draft', 'in_progress', 'open', 'ongoing'];
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    user_id,
    type_id,
    vendor_id,
    date_end,
    ordering_date,
    schedule_date,
    company_id,
  } = formValues;
  const [companyOpen, setCompanyOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { employeesInfo } = useSelector((state) => state.equipment);
  const { allowedCompanies } = useSelector((state) => state.setup);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    purchaseAgreementDetails, agreementTypeInfo,
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
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      dispatch(getAgreementType(companies, appModels.PURCHASEAGREEMENTTYPE, typeKeyword));
    }
  }, [userInfo, typeKeyword, typeOpen]);

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendors');
    setOtherFieldName('supplier');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('vendor_id', '');
    setCustomerOpen(false);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onEmpKeywordClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('user_id', '');
    setEmployeeOpen(false);
  };

  const onAtKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };

  const showReceivableModal = () => {
    setModelValue(appModels.USER);
    setFieldName('user_id');
    setModalName('Purchase Representative');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  let customerOptions = [];
  let employeeOptions = [];
  let typeOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (purchaseAgreementDetails && purchaseAgreementDetails.data && purchaseAgreementDetails.data[0].vendor_id) {
    const oldPartId = [{ id: purchaseAgreementDetails.data[0].vendor_id[0], name: purchaseAgreementDetails.data[0].vendor_id[1] }];
    const newArr = [...customerOptions, ...oldPartId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }

  if (purchaseAgreementDetails && purchaseAgreementDetails.data && purchaseAgreementDetails.data[0].user_id) {
    const oldId = [{ id: purchaseAgreementDetails.data[0].user_id[0], name: purchaseAgreementDetails.data[0].user_id[1] }];
    const newArr = [...employeeOptions, ...oldId];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (agreementTypeInfo && agreementTypeInfo.loading) {
    typeOptions = [{ name: 'Loading..' }];
  }

  if (agreementTypeInfo && agreementTypeInfo.data) {
    typeOptions = agreementTypeInfo.data;
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const currentState = purchaseAgreementDetails && purchaseAgreementDetails.data
    && purchaseAgreementDetails.data.length > 0 && purchaseAgreementDetails.data[0].state
    ? purchaseAgreementDetails.data[0].state : '';

  return (
    <>
      <Row className="mb-1 create-purchase-agreement-form">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={purchaseRepresentative.name}
              label={purchaseRepresentative.label}
              isRequired
              formGroupClassName="m-1"
              oldValue={getOldData(user_id)}
              disabled={editId && !representativeReadonly.includes(currentState)}
              value={user_id && user_id.name ? user_id.name : getOldData(user_id)}
              open={employeeShow}
              size="small"
              onOpen={() => {
                setEmployeeOpen(true);
                setEmployeeKeyword('');
              }}
              onClose={() => {
                setEmployeeOpen(false);
                setEmployeeKeyword('');
              }}
              loading={employeesInfo && employeesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={employeeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onEmployeeKeywordChange}
                  variant="outlined"
                  value={employeeKeyword}
                  className={((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0) || (user_id && user_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeesInfo && employeesInfo.loading && employeeShow ? <CircularProgress color="inherit" size={20} /> : null}
                        {editId && !representativeReadonly.includes(currentState) ? '' : (
                          <InputAdornment position="end">
                            {((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0) || (user_id && user_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onEmpKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showReceivableModal}
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
            {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) }
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={agreementType.name}
              label={agreementType.label}
              formGroupClassName="m-1"
              open={typeOpen}
              isRequired
              size="small"
              disabled={editId && currentState !== 'draft'}
              value={type_id && type_id.length ? type_id[1] : type_id && type_id.name ? type_id.name : ''}
              onOpen={() => {
                setTypeOpen(true);
                setTypeKeyword('');
              }}
              onClose={() => {
                setTypeOpen(false);
                setTypeKeyword('');
              }}
              loading={agreementTypeInfo && agreementTypeInfo.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onAtKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {agreementTypeInfo && agreementTypeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(agreementTypeInfo && agreementTypeInfo.err && typeOpen)
                && (<FormHelperText><span className="text-danger">{generateErrorMessage(agreementTypeInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={vendor.name}
              label={vendor.label}
              formGroupClassName="m-1"
              disabled={editId && vendorReadonly.includes(currentState)}
              oldValue={getOldData(vendor_id)}
              value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
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
                  className={((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {editId && vendorReadonly.includes(currentState) ? '' : (
                          <InputAdornment position="end">
                            {((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length)) && (
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
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={agreementDeadline.name}
              label={agreementDeadline.label}
              isRequired={agreementDeadline.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={agreementDeadline.label}
              disablePastDate={!editId}
              readOnly={editId && !adReadonly.includes(currentState)}
              defaultValue={date_end ? new Date(getDateTimeSeconds(date_end)) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={orderingDate.name}
              label={orderingDate.label}
              isRequired={orderingDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={orderingDate.label}
              disablePastDate={!editId}
              readOnly={editId && !adReadonly.includes(currentState)}
              defaultValue={ordering_date ? new Date(getDateTimeSeconds(ordering_date)) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={scheduledDate.name}
              label={scheduledDate.label}
              isRequired={scheduledDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={scheduledDate.label}
              disablePastDate={!editId}
              readOnly={editId && !adReadonly.includes(currentState)}
              defaultValue={schedule_date ? new Date(getDateTimeSeconds(schedule_date)) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={sourceDocument.name}
              label={sourceDocument.label}
              placeholder="e.g PO0025"
              onKeyPress={lettersNumbersOnly}
              disabled={editId && currentState !== 'draft'}
              formGroupClassName="m-1"
              type="text"
              maxLength="30"
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
