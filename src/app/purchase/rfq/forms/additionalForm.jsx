/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Card, CardBody, Row, Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { FormikAutocomplete, DateTimeField } from '@shared/formFields';
import { getEmployeeList } from '../../../assets/equipmentService';
import {
  getIncoterms,
} from '../../../adminSetup/setupService';
import {
  getPaymentTerms,
  getFiscalPositions,
} from '../../purchaseService';
import {
  generateErrorMessage,
  getAllowedCompanies, getDateTimeSeconds,
} from '../../../util/appUtils';
import SearchModal from './searchModal';
import customData from '../data/customData.json';
import { getInvoiceStatusLabel } from '../utils/utils';

const appModels = require('../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      datePlanned,
      incotermId,
      userId,
      invoiceStatus,
      paymentTermId,
      fiscalPositionId,
    },
  } = props;

  const dispatch = useDispatch();
  const scheduleDateNotVisibleState = ['purchase', 'done', 'cancel', 'to approve'];
  const { values: formValues } = useFormikContext();
  const {
    user_id,
    incoterm_id,
    invoice_status,
    payment_term_id,
    fiscal_position_id,
    date_planned,
  } = formValues;
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [itOpen, setItOpen] = useState(false);
  const [itKeyword, setItKeyword] = useState('');
  const [pptOpen, setPptOpen] = useState(false);
  const [pptKeyword, setPptKeyword] = useState('');
  const [fpOpen, setFpOpen] = useState(false);
  const [fpKeyword, setFpKeyword] = useState('');
  const [invoiceStatusOpen, setInvoiceStatusOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const columns = ['id', 'name'];

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { employeesInfo } = useSelector((state) => state.equipment);
  const { paymentTerms, fiscalPositions, quotationDetails } = useSelector((state) => state.purchase);
  const {
    incotermInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && itOpen) {
        await dispatch(getIncoterms(companies, appModels.INCOTERM, itKeyword));
      }
    })();
  }, [userInfo, itKeyword, itOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && fpOpen) {
        await dispatch(getFiscalPositions(companies, appModels.FISCALPOSITION, fpKeyword));
      }
    })();
  }, [userInfo, fpKeyword, fpOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && pptOpen) {
        await dispatch(getPaymentTerms(companies, appModels.PAYMENTTERM, pptKeyword));
      }
    })();
  }, [userInfo, pptKeyword, pptOpen]);

  const showReceivableModal = () => {
    setModelValue(appModels.USER);
    setFieldName('user_id');
    setModalName('Users');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onItKeywordChange = (event) => {
    setItKeyword(event.target.value);
  };

  const onPptKeywordChange = (event) => {
    setPptKeyword(event.target.value);
  };

  const onFpKeywordChange = (event) => {
    setFpKeyword(event.target.value);
  };

  const onArKeywordClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('user_id', '');
    setEmployeeOpen(false);
  };

  let employeeOptions = [];
  let itOptions = [];
  let pptOptions = [];
  let fiscalOptions = [];

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }

  if (quotationDetails && quotationDetails.data && quotationDetails.data[0].user_id) {
    const oldId = [{ id: quotationDetails.data[0].user_id[0], name: quotationDetails.data[0].user_id[1] }];
    const newArr = [...employeeOptions, ...oldId];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (incotermInfo && incotermInfo.loading) {
    itOptions = [{ name: 'Loading..' }];
  }

  if (quotationDetails && quotationDetails.data && quotationDetails.data[0].incoterm_id) {
    const oldId = [{ id: quotationDetails.data[0].incoterm_id[0], name: quotationDetails.data[0].incoterm_id[1] }];
    const newArr = [...itOptions, ...oldId];
    itOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (incotermInfo && incotermInfo.data) {
    const arr = [...itOptions, ...incotermInfo.data];
    itOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (fiscalPositions && fiscalPositions.loading) {
    fiscalOptions = [{ name: 'Loading..' }];
  }

  if (quotationDetails && quotationDetails.data && quotationDetails.data[0].fiscal_position_id) {
    const oldId = [{ id: quotationDetails.data[0].fiscal_position_id[0], name: quotationDetails.data[0].fiscal_position_id[1] }];
    const newArr = [...fiscalOptions, ...oldId];
    fiscalOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (fiscalPositions && fiscalPositions.data) {
    const arr = [...fiscalOptions, ...fiscalPositions.data];
    fiscalOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (paymentTerms && paymentTerms.loading) {
    pptOptions = [{ name: 'Loading..' }];
  }

  if (quotationDetails && quotationDetails.data && quotationDetails.data[0].payment_term_id) {
    const oldId = [{ id: quotationDetails.data[0].payment_term_id[0], name: quotationDetails.data[0].payment_term_id[1] }];
    const newArr = [...pptOptions, ...oldId];
    pptOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (paymentTerms && paymentTerms.data) {
    const arr = [...pptOptions, ...paymentTerms.data];
    pptOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const currentState = quotationDetails && quotationDetails.data && quotationDetails.data.length > 0 && quotationDetails.data[0].state ? quotationDetails.data[0].state : '';
  const fieldDisable = !!(currentState && (currentState === 'done' || currentState === 'cancel'));

  return (
    <>
      <Card className="no-border-radius mb-2 mt-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Other Information</p>
        </CardBody>
      </Card>
      <Row>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2">
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={datePlanned.name}
              label={datePlanned.label}
              isRequired={datePlanned.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={datePlanned.label}
              disablePastDate={!editId}
              readOnly={!!scheduleDateNotVisibleState.includes(currentState)}
              defaultValue={date_planned ? new Date(getDateTimeSeconds(date_planned)) : ''}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={incotermId.name}
              label={incotermId.label}
              formGroupClassName="m-1"
              disabled={fieldDisable}
              oldValue={getOldData(incoterm_id)}
              value={incoterm_id && incoterm_id.name ? incoterm_id.name : getOldData(incoterm_id)}
              open={itOpen}
              size="small"
              onOpen={() => {
                setItOpen(true);
                setItKeyword('');
              }}
              onClose={() => {
                setItOpen(false);
                setItKeyword('');
              }}
              loading={incotermInfo && incotermInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={itOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onItKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search and Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {incotermInfo && incotermInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(incotermInfo && incotermInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(incotermInfo)}</span></FormHelperText>) }
          </Col>
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2">
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={userId.name}
              label={userId.label}
              formGroupClassName="m-1"
              oldValue={getOldData(user_id)}
              disabled={fieldDisable}
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
                        {!fieldDisable && (
                          <InputAdornment position="end">
                            {((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0) || (user_id && user_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onArKeywordClear}
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
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={invoiceStatus.name}
              label={invoiceStatus.label}
              formGroupClassName="m-1"
              disabled={fieldDisable}
              oldValue={invoice_status && invoice_status.label ? invoice_status.label : getInvoiceStatusLabel(invoice_status)}
              value={invoice_status && invoice_status.label ? invoice_status.label : getInvoiceStatusLabel(invoice_status)}
              open={invoiceStatusOpen}
              size="small"
              onOpen={() => {
                setInvoiceStatusOpen(true);
              }}
              onClose={() => {
                setInvoiceStatusOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData && customData.invoiceStatusus ? customData.invoiceStatusus : []}
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
              name={paymentTermId.name}
              label={paymentTermId.label}
              formGroupClassName="m-1"
              oldValue={getOldData(payment_term_id)}
              disabled={fieldDisable}
              value={payment_term_id && payment_term_id.name ? payment_term_id.name : getOldData(payment_term_id)}
              open={pptOpen}
              size="small"
              onOpen={() => {
                setPptOpen(true);
                setPptKeyword('');
              }}
              onClose={() => {
                setPptOpen(false);
                setPptKeyword('');
              }}
              loading={paymentTerms && paymentTerms.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={pptOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onPptKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {paymentTerms && paymentTerms.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(paymentTerms && paymentTerms.err && pptOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(paymentTerms)}</span></FormHelperText>) }
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={fiscalPositionId.name}
              label={fiscalPositionId.label}
              disabled={fieldDisable}
              formGroupClassName="m-1"
              oldValue={getOldData(fiscal_position_id)}
              value={fiscal_position_id && fiscal_position_id.name ? fiscal_position_id.name : getOldData(fiscal_position_id)}
              open={fpOpen}
              size="small"
              onOpen={() => {
                setFpOpen(true);
                setFpKeyword('');
              }}
              onClose={() => {
                setFpOpen(false);
                setFpKeyword('');
              }}
              loading={fiscalPositions && fiscalPositions.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={fiscalOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onFpKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {fiscalPositions && fiscalPositions.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(fiscalPositions && fiscalPositions.err && pptOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(fiscalPositions)}</span></FormHelperText>) }
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

    </>
  );
};

AdditionalForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalForm;
