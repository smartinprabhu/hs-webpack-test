/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Col, Modal,
  ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { FormikAutocomplete } from '@shared/formFields';
import {
  getPurchaseProject, getPurchaseAccount, getPurchaseLocation, getPurchaseBudget, getPurchaseSubCategory,
} from '../../purchaseService';
import { getPartners } from '../../../assets/equipmentService';
import { generateErrorMessage, getAllowedCompanies } from '../../../util/appUtils';
import SearchModalMultiple from './searchModalMultiple';
import SearchModal from './searchModal';

const appModels = require('../../../util/appModels').default;

const MasterForm = (props) => {
  const {
    editId,
    setFieldValue,
    formField: {
      projects,
      accounts,
      location,
      budget,
      subCategory,
      vendor,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    project_id, account_id, location_id,
    budget_id, sub_category_id, partner_id,
  } = formValues;
  const [prOpen, setPrOpen] = useState(false);
  const [prKeyword, setPrKeyword] = useState('');
  const [acOpen, setAcOpen] = useState(false);
  const [acKeyword, setAcKeyword] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationKeyword, setLocationKeyword] = useState('');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetKeyword, setBudgetKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);

  const {
    purchaseProjectInfo, purchaseAccountInfo, purchaseLocationInfo, purchaseBudgetInfo,
    purchaseSubCategoryInfo,
  } = useSelector((state) => state.purchase);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && prOpen) {
        await dispatch(getPurchaseProject(companies, appModels.PURCHASEPROJECT, prKeyword));
      }
    })();
  }, [userInfo, prKeyword, prOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && acOpen) {
        await dispatch(getPurchaseAccount(companies, appModels.PURCHASEACCOUNT, acKeyword));
      }
    })();
  }, [userInfo, acKeyword, acOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && locationOpen) {
        await dispatch(getPurchaseLocation(companies, appModels.PURCHASELOCATION, locationKeyword));
      }
    })();
  }, [userInfo, locationKeyword, locationOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && budgetOpen) {
        await dispatch(getPurchaseBudget(companies, appModels.PURCHASEBUDGET, budgetKeyword));
      }
    })();
  }, [userInfo, budgetKeyword, budgetOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subCategoryOpen) {
        await dispatch(getPurchaseSubCategory(companies, appModels.PURCHASESUBCATEGORY, subCategoryKeyword));
      }
    })();
  }, [userInfo, subCategoryKeyword, subCategoryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  const showProjectModal = () => {
    setModelValue(appModels.PURCHASEPROJECT);
    setFieldName('project_id');
    setModalName('Project');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showAccountModal = () => {
    setModelValue(appModels.PURCHASEACCOUNT);
    setFieldName('account_id');
    setModalName('Accounts');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showLocationModal = () => {
    setModelValue(appModels.PURCHASELOCATION);
    setFieldName('location_id');
    setModalName('Location');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showBudgetModal = () => {
    setModelValue(appModels.PURCHASEBUDGET);
    setFieldName('budget_id');
    setModalName('Budget');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showSubCategoryModal = () => {
    setModelValue(appModels.PURCHASESUBCATEGORY);
    setFieldName('sub_category_id');
    setModalName('Sub Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Vendors');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const onProjectKeywordChange = (event) => {
    setPrKeyword(event.target.value);
  };

  const onAccountKeywordChange = (event) => {
    setAcKeyword(event.target.value);
  };

  const onLocationKeywordChange = (event) => {
    setLocationKeyword(event.target.value);
  };

  const onBudgetKeywordChange = (event) => {
    setBudgetKeyword(event.target.value);
  };

  const onSubCategoryKeywordChange = (event) => {
    setSubCategoryKeyword(event.target.value);
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onProjectKeywordClear = () => {
    setPrKeyword(null);
    setFieldValue('project_id', '');
    setPrOpen(false);
  };

  const onAccountKeywordClear = () => {
    setAcKeyword(null);
    setFieldValue('account_id', '');
    setAcOpen(false);
  };

  const onLocationKeywordClear = () => {
    setLocationKeyword(null);
    setFieldValue('location_id', '');
    setLocationOpen(false);
  };

  const onBudgetKeywordClear = () => {
    setBudgetKeyword(null);
    setFieldValue('budget_id', '');
    setBudgetOpen(false);
  };

  const onSubCategoryKeywordClear = () => {
    setSubCategoryKeyword(null);
    setFieldValue('sub_category_id', '');
    setSubCategoryOpen(false);
  };

  const onVendorKeywordClear = () => {
    setVendorKeyword(null);
    setFieldValue('partner_id', '');
    setVendorOpen(false);
  };

  let projectOptions = [];
  let accountOptions = [];
  let locationOptions = [];
  let budgetOptions = [];
  let subCategoryOptions = [];
  let vendorOptions = [];

  if (purchaseProjectInfo && purchaseProjectInfo.loading) {
    projectOptions = [{ name: 'Loading..' }];
  }
  if (project_id && project_id.length && project_id.length > 0) {
    const oldId = [{ id: project_id[0], name: project_id[1] }];
    const newArr = [...projectOptions, ...oldId];
    projectOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (purchaseProjectInfo && purchaseProjectInfo.data) {
    const arr = [...projectOptions, ...purchaseProjectInfo.data];
    projectOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (purchaseProjectInfo && purchaseProjectInfo.err) {
    projectOptions = [];
  }

  if (purchaseAccountInfo && purchaseAccountInfo.loading) {
    accountOptions = [{ name: 'Loading..' }];
  }
  if (account_id && account_id.length && account_id.length > 0) {
    const oldId = [{ id: account_id[0], name: account_id[1] }];
    const newArr = [...accountOptions, ...oldId];
    accountOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (purchaseAccountInfo && purchaseAccountInfo.data) {
    const arr = [...accountOptions, ...purchaseAccountInfo.data];
    accountOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (purchaseAccountInfo && purchaseAccountInfo.err) {
    accountOptions = [];
  }

  if (purchaseLocationInfo && purchaseLocationInfo.loading) {
    locationOptions = [{ name: 'Loading..' }];
  }
  if (location_id && location_id.length && location_id.length > 0) {
    const oldId = [{ id: location_id[0], name: location_id[1] }];
    const newArr = [...locationOptions, ...oldId];
    locationOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (purchaseLocationInfo && purchaseLocationInfo.data) {
    const arr = [...locationOptions, ...purchaseLocationInfo.data];
    locationOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (purchaseLocationInfo && purchaseLocationInfo.err) {
    locationOptions = [];
  }

  if (purchaseBudgetInfo && purchaseBudgetInfo.loading) {
    budgetOptions = [{ name: 'Loading..' }];
  }
  if (budget_id && budget_id.length && budget_id.length > 0) {
    const oldId = [{ id: budget_id[0], name: budget_id[1] }];
    const newArr = [...budgetOptions, ...oldId];
    budgetOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (purchaseBudgetInfo && purchaseBudgetInfo.data) {
    const arr = [...budgetOptions, ...purchaseBudgetInfo.data];
    budgetOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (purchaseBudgetInfo && purchaseBudgetInfo.err) {
    budgetOptions = [];
  }

  if (purchaseSubCategoryInfo && purchaseSubCategoryInfo.loading) {
    subCategoryOptions = [{ name: 'Loading..' }];
  }
  if (sub_category_id && sub_category_id.length && sub_category_id.length > 0) {
    const oldId = [{ id: sub_category_id[0], name: sub_category_id[1] }];
    const newArr = [...subCategoryOptions, ...oldId];
    subCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (purchaseSubCategoryInfo && purchaseSubCategoryInfo.data) {
    const arr = [...subCategoryOptions, ...purchaseSubCategoryInfo.data];
    subCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (purchaseSubCategoryInfo && purchaseSubCategoryInfo.err) {
    subCategoryOptions = [];
  }

  if (partnersInfo && partnersInfo.loading) {
    vendorOptions = [{ name: 'Loading..' }];
  }
  if (partner_id && partner_id.length && partner_id.length > 0) {
    const oldId = [{ id: partner_id[0], name: partner_id[1] }];
    const newArr = [...vendorOptions, ...oldId];
    vendorOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.data) {
    const arr = [...vendorOptions, ...partnersInfo.data];
    vendorOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.err) {
    vendorOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-3 ml-1">
        <h6>Master Info</h6>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={projects.name}
          label={projects.label}
          formGroupClassName="m-1"
          open={prOpen}
          size="small"
          oldValue={getOldData(project_id)}
          value={project_id && project_id.name ? project_id.name : getOldData(project_id)}
          onOpen={() => {
            setPrOpen(true);
          }}
          onClose={() => {
            setPrOpen(false);
          }}
          loading={purchaseProjectInfo && purchaseProjectInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={projectOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onProjectKeywordChange}
              variant="outlined"
              value={prKeyword}
              className={((getOldData(project_id)) || (project_id && project_id.id) || (prKeyword && prKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {purchaseProjectInfo && purchaseProjectInfo.loading && prOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(project_id)) || (project_id && project_id.id) || (prKeyword && prKeyword.length > 0)) && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onProjectKeywordClear}
                      >
                        <BackspaceIcon fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showProjectModal}
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
        {(purchaseProjectInfo && purchaseProjectInfo.err && prOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseProjectInfo)}</span></FormHelperText>) }
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={accounts.name}
          label={accounts.label}
          formGroupClassName="m-1"
          open={acOpen}
          size="small"
          oldValue={getOldData(account_id)}
          value={account_id && account_id.name ? account_id.name : getOldData(account_id)}
          onOpen={() => {
            setAcOpen(true);
          }}
          onClose={() => {
            setAcOpen(false);
          }}
          loading={purchaseAccountInfo && purchaseAccountInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={accountOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onAccountKeywordChange}
              variant="outlined"
              value={acKeyword}
              className={((getOldData(account_id)) || (account_id && account_id.id) || (acKeyword && acKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {purchaseAccountInfo && purchaseAccountInfo.loading && acOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(account_id)) || (account_id && account_id.id) || (acKeyword && acKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onAccountKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showAccountModal}
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
        {(purchaseAccountInfo && purchaseAccountInfo.err && acOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseAccountInfo)}</span></FormHelperText>) }
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={location.name}
          label={location.label}
          formGroupClassName="m-1"
          open={locationOpen}
          size="small"
          oldValue={getOldData(location_id)}
          value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
          onOpen={() => {
            setLocationOpen(true);
          }}
          onClose={() => {
            setLocationOpen(false);
          }}
          loading={purchaseLocationInfo && purchaseLocationInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={locationOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onLocationKeywordChange}
              variant="outlined"
              value={locationKeyword}
              className={((getOldData(location_id)) || (location_id && location_id.id) || (locationKeyword && locationKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {purchaseLocationInfo && purchaseLocationInfo.loading && locationOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(location_id)) || (location_id && location_id.id) || (locationKeyword && locationKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onLocationKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showLocationModal}
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
        {(purchaseLocationInfo && purchaseLocationInfo.err && locationOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseLocationInfo)}</span></FormHelperText>) }
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={budget.name}
          label={budget.label}
          formGroupClassName="m-1"
          open={budgetOpen}
          size="small"
          oldValue={getOldData(budget_id)}
          value={budget_id && budget_id.name ? budget_id.name : getOldData(budget_id)}
          onOpen={() => {
            setBudgetOpen(true);
          }}
          onClose={() => {
            setBudgetOpen(false);
          }}
          loading={purchaseBudgetInfo && purchaseBudgetInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={budgetOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onBudgetKeywordChange}
              variant="outlined"
              value={budgetKeyword}
              className={((getOldData(budget_id)) || (budget_id && budget_id.id) || (budgetKeyword && budgetKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {purchaseBudgetInfo && purchaseBudgetInfo.loading && budgetOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(budget_id)) || (budget_id && budget_id.id) || (budgetKeyword && budgetKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onBudgetKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showBudgetModal}
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
        {(purchaseBudgetInfo && purchaseBudgetInfo.err && budgetOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseBudgetInfo)}</span></FormHelperText>) }
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={subCategory.name}
          label={subCategory.label}
          formGroupClassName="m-1"
          open={subCategoryOpen}
          size="small"
          oldValue={getOldData(sub_category_id)}
          value={sub_category_id && sub_category_id.name ? sub_category_id.name : getOldData(sub_category_id)}
          onOpen={() => {
            setSubCategoryOpen(true);
          }}
          onClose={() => {
            setSubCategoryOpen(false);
          }}
          loading={purchaseSubCategoryInfo && purchaseSubCategoryInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={subCategoryOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onSubCategoryKeywordChange}
              variant="outlined"
              value={subCategoryKeyword}
              className={((getOldData(sub_category_id)) || (sub_category_id && sub_category_id.id) || (subCategoryKeyword && subCategoryKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {purchaseSubCategoryInfo && purchaseSubCategoryInfo.loading && subCategoryOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(sub_category_id)) || (sub_category_id && sub_category_id.id) || (subCategoryKeyword && subCategoryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSubCategoryKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showSubCategoryModal}
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
        {(purchaseSubCategoryInfo && purchaseSubCategoryInfo.err && subCategoryOpen)
            && (<FormHelperText><span className="text-danger">{generateErrorMessage(purchaseSubCategoryInfo)}</span></FormHelperText>)}
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <FormikAutocomplete
          name={vendor.name}
          label={vendor.label}
          formGroupClassName="m-1"
          open={vendorOpen}
          size="small"
          disabled={editId}
          oldValue={getOldData(partner_id)}
          value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id)}
          onOpen={() => {
            setVendorOpen(true);
          }}
          onClose={() => {
            setVendorOpen(false);
          }}
          loading={partnersInfo && partnersInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={vendorOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onVendorKeywordChange}
              variant="outlined"
              value={vendorKeyword}
              className={((getOldData(partner_id)) || (partner_id && partner_id.id) || (vendorKeyword && vendorKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {(((!editId) && (getOldData(partner_id))) || (partner_id && partner_id.id) || (vendorKeyword && vendorKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onVendorKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      {!editId && (
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showVendorModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
        {(partnersInfo && partnersInfo.err && vendorOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>) }
      </Col>
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

MasterForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default MasterForm;
