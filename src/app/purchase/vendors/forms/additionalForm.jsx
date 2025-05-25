/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Card, CardBody, Row, Col,
  Input,
  Label,
} from 'reactstrap';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import Select from 'react-select';

import addIcon from '@images/icons/plusCircleBlue.svg';
import closeIcon from '@images/icons/circleClose.svg';
import Loader from '@shared/loading';
import addCircleIcon from '@images/icons/addCircle.svg';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  generateErrorMessage,
  getDefaultNoValue,
  generateTag, integerKeyPress,
  getAllowedCompanies,
} from '../../../util/appUtils';
import { getEmployeeList } from '../../../assets/equipmentService';
import { getChecklistData } from '../../../preventiveMaintenance/ppmService';
import { getDefaultState } from '../../../preventiveMaintenance/utils/utils';
import { getNewVendorBankArray } from '../../utils/utils';
import {
  getSupportSlas, getAccounts,
  storeContacts, getVendorContacts, getBankList, getVendorBanks,
} from '../../purchaseService';
import SearchModal from './searchModal';
import AddContact from '../vendorDetails/addContact/addContact';
import '../../../helpdesk/viewTicket/style.scss';
import AddBank from '../bank/addBank';

const appModels = require('../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    editId,
    formField: {
      dedicatedSupportUserId,
      slaId,
      propertyAccountReceivableId,
      propertyAccountPayableId,
      comment,
    },
  } = props;

  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    property_account_receivable_id, property_account_payable_id,
    sla_id, dedicated_support_user_id, bank_ids,
  } = formValues;
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [slaOpen, setSlaOpen] = useState(false);
  const [slaKeyword, setSlaKeyword] = useState('');
  const [arOpen, setArOpen] = useState(false);
  const [arKeyword, setArKeyword] = useState('');
  const [apOpen, setApOpen] = useState(false);
  const [apKeyword, setApKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [addContactModal, setContactModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [checkListData, setCheckListData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [checkListOptions, setCheckListOptions] = useState([]);
  const [bankReload, setBankReload] = useState('0');
  const [addbankModal, setAddBankModal] = useState(false);
  const columns = ['id', 'name'];

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { checklistSelected } = useSelector((state) => state.ppm);
  const { employeesInfo } = useSelector((state) => state.equipment);
  const {
    accountInvoiceInfo, slaInfo, contactsInfo, vendorDetails,
    vendorContacts, bankList, vendorBanks, addBankInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (vendorDetails && vendorDetails.data && editId) {
      dispatch(getVendorContacts(vendorDetails.data[0].child_ids, appModels.PARTNER));
    }
  }, [editId, vendorDetails]);

  useEffect(() => {
    if (editId) {
      const check = bank_ids.some((obj) => obj.hasOwnProperty('bank_id'));
      if (!check) {
        setBankReload('1');
        dispatch(getVendorBanks(vendorDetails.data[0].bank_ids, appModels.BANKS));
      } else {
        setBankReload('0');
      }
    }
  }, [editId]);

  useEffect(() => {
    if (bank_ids && bank_ids.length > 0) {
      setCheckListData(bank_ids);
      setCheckListAdd(Math.random());
    } else {
      setCheckListData([]);
      setCheckListAdd(Math.random());
    }
  }, [bank_ids]);

  useEffect(() => {
    if (bankList && bankList.data && bankList.data.length > 0) {
      const { data } = bankList;
      if (data && data.length > 0) {
        setCheckListOptions(data.map((cl) => ({
          ...cl, value: cl.id, label: cl.name,
        })));
      }
    }
  }, [bankList, checkListAdd]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && slaOpen) {
        await dispatch(getSupportSlas(companies, appModels.SLA, slaKeyword));
      }
    })();
  }, [userInfo, slaKeyword, slaOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && arOpen) {
        await dispatch(getAccounts(companies, appModels.ACCOUNTINVOICE, 'receivable', arKeyword));
      }
    })();
  }, [userInfo, arKeyword, arOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && apOpen) {
        await dispatch(getAccounts(companies, appModels.ACCOUNTINVOICE, 'payable', apKeyword));
      }
    })();
  }, [userInfo, apKeyword, apOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBankList(companies, appModels.BANKLIST));
    }
  }, [userInfo, addBankInfo]);

  useEffect(() => {
    if (vendorContacts && vendorContacts.data && vendorContacts.data.length > 0) {
      setContactList(vendorContacts.data);
    }
  }, [vendorContacts]);

  useEffect(() => {
    dispatch(storeContacts([]));
  }, []);

  useEffect(() => {
    if (contactsInfo && contactsInfo.data && contactsInfo.data.length > 0) {
      setContacts(contacts);
      const arr = [...contacts, ...contactsInfo.data];
      const arr1 = [...new Map(arr.map((item) => [item.name, item])).values()];
      setContacts(arr1);
      setFieldValue('child_ids', arr);
    } else {
      setContacts([]);
      setFieldValue('child_ids', []);
    }
  }, [contactsInfo]);

  useEffect(() => {
    if (contactList && contactList.length > 0) {
      // const arr = [...contacts, ...contactsInfo.data];
      setFieldValue('child_ids', contactList);
    }
  }, [contactList]);

  useEffect(() => {
    if (checkListAdd) {
      setCheckListData(checkListData);
      dispatch(getChecklistData(checkListData));
    }
  }, [checkListAdd]);

  useEffect(() => {
    if (vendorBanks && vendorBanks.data && vendorBanks.data.length > 0 && bankReload === '1') {
      const newData = getNewVendorBankArray(vendorBanks.data);
      setCheckListData(newData);
      dispatch(getChecklistData(newData));
    }
  }, [vendorBanks]);

  useEffect(() => {
    if (checklistSelected && checklistSelected.length > 0) {
      setFieldValue('bank_ids', checklistSelected);
    } else {
      setCheckListData([]);
    }
  }, [checklistSelected]);

  const showReceivableModal = () => {
    setModelValue(appModels.ACCOUNTINVOICE);
    setFieldName('property_account_receivable_id');
    setModalName('Account Receivable');
    setOtherFieldName('internal_type');
    setOtherFieldValue('receivable');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const showPayableModal = () => {
    setModelValue(appModels.ACCOUNTINVOICE);
    setFieldName('property_account_payable_id');
    setModalName('Account Payable');
    setOtherFieldName('internal_type');
    setOtherFieldValue('payable');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onSlaKeywordChange = (event) => {
    setSlaKeyword(event.target.value);
  };

  const onArKeywordChange = (event) => {
    setArKeyword(event.target.value);
  };

  const onApKeywordChange = (event) => {
    setApKeyword(event.target.value);
  };

  const onArKeywordClear = () => {
    setArKeyword(null);
    setFieldValue('property_account_receivable_id', '');
    setArOpen(false);
  };

  const onApKeywordClear = () => {
    setApKeyword(null);
    setFieldValue('property_account_payable_id', '');
    setApOpen(false);
  };

  let employeeOptions = [];
  let slaOptions = [];
  let apOptions = [];
  let arOptions = [];

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (dedicated_support_user_id && dedicated_support_user_id.length && dedicated_support_user_id.length > 0) {
    const oldId = [{ id: dedicated_support_user_id[0], name: dedicated_support_user_id[1] }];
    const newArr = [...employeeOptions, ...oldId];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.err) {
    employeeOptions = [];
  }

  if (slaInfo && slaInfo.loading) {
    slaOptions = [{ name: 'Loading..' }];
  }
  if (sla_id && sla_id.length && sla_id.length > 0) {
    const oldId = [{ id: sla_id[0], name: sla_id[1] }];
    const newArr = [...slaOptions, ...oldId];
    slaOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (slaInfo && slaInfo.data) {
    const arr = [...slaOptions, ...slaInfo.data];
    slaOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (slaInfo && slaInfo.err) {
    slaOptions = [];
  }

  if (accountInvoiceInfo && accountInvoiceInfo.loading) {
    if (arOpen) {
      arOptions = [{ name: 'Loading..' }];
    }
    if (apOpen) {
      apOptions = [{ name: 'Loading..' }];
    }
  }

  if (property_account_receivable_id && property_account_receivable_id.length && property_account_receivable_id.length > 0) {
    const oldId = [{ id: property_account_receivable_id[0], name: property_account_receivable_id[1] }];
    const newArr = [...arOptions, ...oldId];
    arOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (property_account_payable_id && property_account_payable_id.length && property_account_payable_id.length > 0) {
    const oldId = [{ id: property_account_payable_id[0], name: property_account_payable_id[1] }];
    const newArr = [...apOptions, ...oldId];
    apOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (accountInvoiceInfo && accountInvoiceInfo.data) {
    if (arOpen) {
      const arr = [...arOptions, ...accountInvoiceInfo.data];
      arOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (apOpen) {
      const arr = [...apOptions, ...accountInvoiceInfo.data];
      apOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (accountInvoiceInfo && accountInvoiceInfo.err) {
    if (arOpen) {
      arOptions = [];
    }
    if (apOpen) {
      apOptions = [];
    }
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const loadEmptyTd = () => {
    const newData = checkListData;
    if (editId) {
      newData.push({
        id: 0, bank_id: '', acc_number: '',
      });
    } else {
      newData.push({
        bank_id: '', acc_number: '',
      });
    }
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onNameChange = (e, index) => {
    const newData = checkListData;
    newData[index].acc_number = e.target.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onChangeCheckList = (e, index) => {
    const newData = checkListData;
    newData[index].bank_id = e.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = checkListData;
    checkData.splice(index, 1);
    setCheckListData(checkData);
    setCheckListAdd(Math.random());
  };

  const removeDataEdit = (e, index, id) => {
    const checkData = checkListData;
    if (editId && id !== 0) {
      const removeArray = checkListData.filter((x) => x.id === id);
      const newArr = removeArray.map((v) => ({ ...v, isRemove: true }));
      checkData.splice(index, 1);
      const newData = checkData.concat(newArr);
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    } else {
      checkData.splice(index, 1);
      setCheckListData(checkData);
      setCheckListAdd(Math.random());
    }
  };

  const removeContactsEdit = (e, index, id) => {
    const contactArray = contactList;
    if (editId && id !== 0) {
      const removeArray = contactArray.filter((x) => x.id === id);
      const newArr = removeArray.map((v) => ({ ...v, isRemove: true }));
      contactArray.splice(index, 1);
      const newData = contactArray.concat(newArr);
      setContactList(newData);
    } else {
      contactArray.splice(index, 1);
      setContactList(contactArray);
    }
  };

  const bankForm = (cl, index, disabled) => (
    <>
      <Row className="ml-2" key={index}>
        <Col xs={12} sm={5} md={5} lg={5}>
          <Select
            isDisabled={disabled}
            name="checkList"
            placeholder="Select Bank"
            value={getDefaultState(checkListOptions, cl.bank_id)}
            classNamePrefix="react-selects"
            className="react-select-boxcheck"
            onChange={(e) => onChangeCheckList(e, index)}
            options={checkListOptions}
            isClearable={false}
          />
        </Col>
        <Col xs={12} sm={5} md={5} lg={5}>
          <Input
            disabled={disabled}
            type="input"
            placeholder="Enter Account No"
            name="name"
            autoComplete="off"
            onKeyPress={integerKeyPress}
            maxLength="25"
            value={cl.name || cl.acc_number}
            onChange={(e) => onNameChange(e, index)}
          />
        </Col>
        <Col xs={12} sm={1} md={1} lg={1} className="mt-1">
          <img src={closeIcon} className="mr-2 cursor-pointer" alt="remove" height="15" aria-hidden="true" onClick={(e) => { removeData(e, index); }} width="15" />
        </Col>
      </Row>
      <br />
    </>
  );

  const bankFormEdit = (cl, index) => (
    !cl.isRemove
      ? (
        <>
          <Row className="ml-2" key={index}>
            <Col xs={12} sm={5} md={5} lg={5}>
              <Select
                name="checkList"
                placeholder="Select Bank"
                value={getDefaultState(checkListOptions, cl.bank_id)}
                classNamePrefix="react-selects"
                className="react-select-boxcheck"
                onChange={(e) => onChangeCheckList(e, index)}
                options={checkListOptions}
                isClearable={false}
              />
            </Col>
            <Col xs={12} sm={5} md={5} lg={5}>
              <Input
                type="input"
                placeholder="Enter Account No"
                name="name"
                autoComplete="off"
                onKeyPress={integerKeyPress}
                maxLength="25"
                value={cl.acc_number}
                onChange={(e) => onNameChange(e, index)}
              />
            </Col>
            <Col xs={12} sm={1} md={1} lg={1} className="mt-1">
              <img src={closeIcon} className="mr-2 cursor-pointer" alt="remove" height="15" aria-hidden="true" onClick={(e) => { removeDataEdit(e, index, cl.id); }} width="15" />
            </Col>
          </Row>
          <br />
        </>
      )
      : ''
  );

  const removeContacts = (e, index) => {
    const contactArray = contacts;
    contactArray.splice(index, 1);
    dispatch(storeContacts(contactArray));
  };

  return (
    <>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Invoicing</p>
        </CardBody>
      </Card>
      <Row className="p-1 mb-2 ml-2px">
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pr-4">
          <h6>Bank Accounts</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="d-flex">
            <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer" onClick={loadEmptyTd}>
              <img src={addIcon} className="mr-2 mb-1" alt="add" height="15" width="15" />
              <span className="text-lightblue mr-5">Add a Line</span>
            </div>
            {((checkListData && checkListData.length > 0) || (editId && vendorBanks && vendorBanks.data && vendorBanks.data.length > 0)) && (
            <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer" onClick={() => setAddBankModal(true)}>
              <img src={addIcon} className="mr-2 mb-1" alt="add" height="15" width="15" />
              <span className="text-lightblue mr-5">Add Bank</span>
            </div>
            )}
          </Col>
          <br />
          {((checkListData && checkListData.length > 0) || (editId && vendorBanks && vendorBanks.data && vendorBanks.data.length > 0)) && (
            <Row className="ml-1">
              <Col xs={12} sm={5} md={5} lg={5}>
                <Label for="checkList">
                  Bank
                </Label>
              </Col>
              <Col xs={12} sm={5} md={5} lg={5}>
                <Label for="tool_cost_unit">
                  Account Number
                </Label>
              </Col>
              <Col xs={12} sm={1} md={1} lg={1} />
            </Row>
          )}
          {(!editId && checkListData.map((cl, index) => (
            bankForm(cl, index)
          )))}
          {editId && (vendorBanks && !vendorBanks.loading) && checkListData.map(
            (cl, index) => (
              bankFormEdit(cl, index)
            ),
          )}
          {vendorBanks && vendorBanks.loading && (
          <Loader />
          )}
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pl-4">
          <h6>Accounting Entries</h6>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={propertyAccountReceivableId.name}
              label={propertyAccountReceivableId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={arOpen}
              size="small"
              oldValue={getOldData(property_account_receivable_id)}
              value={property_account_receivable_id && property_account_receivable_id.name ? property_account_receivable_id.name : getOldData(property_account_receivable_id)}
              onOpen={() => {
                setArOpen(true);
              }}
              onClose={() => {
                setArOpen(false);
              }}
              loading={arOpen && accountInvoiceInfo && accountInvoiceInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={arOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onArKeywordChange}
                  variant="outlined"
                  value={arKeyword}
                  className={((getOldData(property_account_receivable_id)) || (property_account_receivable_id && property_account_receivable_id.id) || (arKeyword && arKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {accountInvoiceInfo && accountInvoiceInfo.loading && arOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(property_account_receivable_id)) || (property_account_receivable_id && property_account_receivable_id.id) || (arKeyword && arKeyword.length > 0)) && (
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
                      </>
                    ),
                  }}
                />
              )}
            />
            {(accountInvoiceInfo && accountInvoiceInfo.err && arOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(accountInvoiceInfo)}</span></FormHelperText>) }
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={propertyAccountPayableId.name}
              label={propertyAccountPayableId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={apOpen}
              size="small"
              oldValue={getOldData(property_account_payable_id)}
              value={property_account_payable_id && property_account_payable_id.name ? property_account_payable_id.name : getOldData(property_account_payable_id)}
              onOpen={() => {
                setApOpen(true);
              }}
              onClose={() => {
                setApOpen(false);
              }}
              loading={apOpen && accountInvoiceInfo && accountInvoiceInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={apOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onApKeywordChange}
                  variant="outlined"
                  value={apKeyword}
                  className={((getOldData(property_account_payable_id)) || (property_account_payable_id && property_account_payable_id.id) || (apKeyword && apKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {accountInvoiceInfo && accountInvoiceInfo.loading && arOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(property_account_payable_id)) || (property_account_payable_id && property_account_payable_id.id) || (apKeyword && apKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onApKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showPayableModal}
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
            {(accountInvoiceInfo && accountInvoiceInfo.err && apOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(accountInvoiceInfo)}</span></FormHelperText>) }
          </Col>
        </Col>
      </Row>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Support Ticket</p>
        </CardBody>
      </Card>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pl-0">
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={dedicatedSupportUserId.name}
              label={dedicatedSupportUserId.label}
              formGroupClassName="ml-0 mr-1 mb-1 mt-1"
              labelClassName="font-weight-500"
              open={employeeShow}
              size="small"
              oldValue={getOldData(dedicated_support_user_id)}
              value={dedicated_support_user_id && dedicated_support_user_id.name ? dedicated_support_user_id.name : getOldData(dedicated_support_user_id)}
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
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(employeesInfo && employeesInfo.err && employeeShow) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) }
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={slaId.name}
              label={slaId.label}
              formGroupClassName="ml-0 mr-1 mb-1 mt-1"
              labelClassName="font-weight-500"
              open={slaOpen}
              size="small"
              oldValue={getOldData(sla_id)}
              value={sla_id && sla_id.name ? sla_id.name : getOldData(sla_id)}
              onOpen={() => {
                setSlaOpen(true);
              }}
              onClose={() => {
                setSlaOpen(false);
              }}
              loading={slaInfo && slaInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={slaOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSlaKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {slaInfo && slaInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(slaInfo && slaInfo.err && slaOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(slaInfo)}</span></FormHelperText>) }
          </Col>
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2">
          <Col xs={12} sm={12} md={12} lg={12} />
        </Col>
      </Row>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Contact & Addresses</p>
        </CardBody>
      </Card>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={12} lg={12} sm={12} className="mb-2">
          <div aria-hidden="true" className="mb-2 cursor-pointer" onClick={() => { setContactModal(true); }}>
            <img src={addCircleIcon} className="mr-1" alt="issuecategory" height="16" width="16" />
            <span className="text-lightblue cursor-pointer">Add</span>
          </div>
          <Col sm="12" md="12" lg="12" xs="12" className="mt-3 comments-list thin-scrollbar">
            {(editId && contactList && contactList.length > 0) && contactList.map((cont, index) => (
              !cont.isRemove
                ? (
                  <Row>
                    <div key={cont.id} className="mb-1 mt-0 user-info-div">
                      <div className="user-info-circle">
                        <span className="font-weight-800 user-info-label">{generateTag(cont.name, 2)}</span>
                      </div>
                      <div className="user-info-text">
                        <h5>{cont.name}</h5>
                        <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(cont.phone)}</p>
                        <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(cont.email)}</p>
                      </div>
                    </div>
                    <div>
                      <img src={closeIcon} className="ml-4 mt-4 cursor-pointer" alt="remove" height="15" aria-hidden="true" onClick={(e) => { removeContactsEdit(e, index, cont.id); }} width="15" />
                    </div>
                  </Row>
                )
                : ''
            ))}
            {vendorContacts && vendorContacts.loading && (
            <Loader />
            )}
            {(contacts && contacts.length && contacts.length > 0) ? (
              contacts.map((log, index) => (
                !log.isRemove
                  ? (
                    <Row>
                      <div key={index} className="mb-1 mt-0 user-info-div">
                        <div className="user-info-circle">
                          <span className="font-weight-800 user-info-label">{generateTag(log.name, 2)}</span>
                        </div>
                        <div className="user-info-text">
                          <h5>{log.name}</h5>
                          <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(log.phone)}</p>
                          <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(log.email)}</p>
                        </div>
                      </div>
                      <div>
                        <img src={closeIcon} className="ml-4 mt-4 cursor-pointer" alt="remove" height="15" aria-hidden="true" onClick={(e) => { removeContacts(e, index); }} width="15" />
                      </div>
                    </Row>
                  )
                  : ''
              )))
              : (<span />)}
          </Col>
        </Col>
      </Row>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Internal Notes</p>
        </CardBody>
      </Card>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={12} lg={12} sm={12} className="mb-2">
          <InputField
            name={comment.name}
            label={comment.label}
            labelClassName="font-weight-500"
            formGroupClassName="ml-0 mr-1 mb-1 mt-1"
            type="textarea"
            rows="3"
            maxLength="750"
          />
        </Col>
      </Row>
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
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={addContactModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setContactModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddContact
              afterReset={() => { setContactModal(false); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={addbankModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setAddBankModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddBank
              afterReset={() => { setAddBankModal(false); }}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
};

export default AdditionalForm;
