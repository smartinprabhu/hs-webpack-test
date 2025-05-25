/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  FormControl, FormHelperText,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import DialogHeader from '../../commonComponents/dialogHeader';
import customData from '../../adminSetup/data/customData.json';
import {
  getCompanyCategories,
  getCompanyRegions,
  getCountries,
  getCurrency,
  getStates,
  getSubCompanyCategories,
} from '../../adminSetup/setupService';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import {
  extractOptionsObject, generateErrorMessage, getAllowedCompanies,
  getArrayFromValuesById,
  getColumnArrayById, isArrayColumnExists,
} from '../../util/appUtils';
import {
  getNumberToCommas,
} from '../../util/staticFunctions';
import { getAllowedModule, getParentCompany } from '../siteService';
import { getNewOnBoardArray } from '../utils/utils';
import SearchModal from './searchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const BasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    formField: {
      nameValue,
      shortCode,
      parentSite,
      siteCategory,
      subCategory,
      area,
      addressLineOne,
      cityValue,
      countryId,
      regionId,
      stateId,
      pincode,
      currency,
      timeZone,
      copyConfiguration,
      allowedModule,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    name,
    parent_id,
    res_company_categ_id,
    company_subcateg_id,
    region_id,
    copy_from_company_id,
    allowed_module_ids,
    country_id,
    company_tz,
    state_id,
    currency_id,
    code,
    area_sqft,
  } = formValues;
  const classes = useStyles();
  const [caOpen, setCaOpen] = useState(false);
  const [caKeyword, setCaKeyword] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catKeyword, setCatKeyword] = useState('');
  const [subCatOpen, setSubCatOpen] = useState(false);
  const [subCatKeyword, setSubCatKeyword] = useState('');
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyKeyword, setCopyKeyword] = useState('');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyKeyword, setCurrencyKeyword] = useState('');
  const [tzOpen, setTzOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [validateShortCode, setValidateShortCode] = useState(false);

  const [moduleOpen, setModuleOpen] = useState(false);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [moduleKeyword, setModuleKeyword] = useState('');
  const [moduleLocationId, setModuleLocationId] = useState([]);
  const [moduleValues, setModuleValues] = useState([]);

  const [countryIdValue, setCountryIdValue] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [moduleField, showModuleField] = useState(false);

  const [regionOpen, setRegionOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState('');

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [columns, setColumns] = useState(['id', 'name']);
  const { userInfo } = useSelector((state) => state.user);
  const {
    parentCompanyInfo, allowedModulesInfo, codeGroupInfo, onBoardCopyInfo,
  } = useSelector((state) => state.site);
  const {
    companyCategoriesInfo, countriesInfo, statesInfo, currencyInfo, regionsInfo, companySubCategoriesInfo,
  } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);

  const onBoardData = onBoardCopyInfo && onBoardCopyInfo.data && onBoardCopyInfo.data.length ? onBoardCopyInfo.data : [];

  const defaultModuleWithoutId = [
    { code: 'asset', name: 'Asset' },
    { code: 'helpdesk', name: 'Helpdesk' },
    { code: 'workorder', name: 'Workorder' },
  ];

  const allModulesList = allowedModulesInfo && allowedModulesInfo.data && allowedModulesInfo.data.length ? allowedModulesInfo.data : false;
  const defaultModule = allModulesList && allModulesList.length ? (allModulesList.filter((a) => defaultModuleWithoutId.some((b) => a.code === b.code))) : [];

  useEffect(() => {
    showModuleField(false);
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && !editId) {
      const companyId = userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('parent_id', companyId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editId && codeGroupInfo && codeGroupInfo.data && codeGroupInfo.data.length) {
      const companyCodes = codeGroupInfo.data;
      const arrayNew = companyCodes.filter((item) => item.code === code);
      if (arrayNew && arrayNew.length && arrayNew.length > 0) {
        setValidateShortCode(true);
        setFieldValue('code', '');
      } else if (code && code !== '') {
        setValidateShortCode(false);
      }
    }
  }, [code]);

  const getExceptSelectedModule = (array) => {
    let allow = [];
    if (array && array.length) {
      allow = array.filter((obj) => !onBoardData.some((obj2) => parseInt(obj.id) === parseInt(obj2.hx_onboard_module_id.id)));
    }
    return allow;
  };

  useEffect(() => {
    showModuleField(false);
    if (editId) {
      setModuleValues(allowed_module_ids);
    } else {
      setModuleValues([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if (stateOpen && ((country_id && country_id.id))) {
        const oldId = country_id && country_id.id ? country_id.id : false;
        const cid = oldId;
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [stateOpen, stateKeyword, country_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && currencyOpen) {
        await dispatch(getCurrency(companies, appModels.CURRENCY, currencyKeyword));
      }
    })();
  }, [userInfo, currencyKeyword, currencyOpen]);

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  const onCurrencyKeywordChange = (event) => {
    setCurrencyKeyword(event.target.value);
  };

  const capitalizeFirstLetter = (string) => {
    let firstFour = '';
    firstFour = string.substring(0, 4).toUpperCase();
    return firstFour;
  };

  useEffect(() => {
    if (userInfo && userInfo.data && !editId) {
      setValidateShortCode(false);
      setFieldValue('code', '');
      if (name) {
        setFieldValue('code', capitalizeFirstLetter(name));
      }
    }
  }, [name]);

  useEffect(() => {
    if (userInfo && userInfo.data && copy_from_company_id) {
      dispatch(getAllowedModule(appModels.ONBOARDMODULE));
      if (copy_from_company_id.allowed_module_ids && copy_from_company_id.allowed_module_ids.length) {
        const tempModule = ([...defaultModule, ...copy_from_company_id.allowed_module_ids]);
        const uniqueObjArray = [...new Map(tempModule.map((item) => [item.id, item])).values()];
        setModuleLocationId(uniqueObjArray);
        setFieldValue('allowed_module_ids', uniqueObjArray);
      } else {
        const tempModule = ([...defaultModule]);
        const uniqueObjArray = [...new Map(tempModule.map((item) => [item.id, item])).values()];
        setModuleLocationId(uniqueObjArray);
        setFieldValue('allowed_module_ids', uniqueObjArray);
      }
      showModuleField(true);
    }
  }, [copy_from_company_id]);

  useEffect(() => {
    if (editId) {
      setModuleLocationId(allowed_module_ids);
    }
  }, [editId]);

  useEffect(() => {
    if (moduleLocationId) {
      setFieldValue('allowed_module_ids', moduleLocationId);
    }
  }, [moduleLocationId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && caOpen) {
        await dispatch(getCompanyCategories(companies, appModels.COMPANYCATEGORY, caKeyword));
      }
    })();
  }, [userInfo, caKeyword, caOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subCatOpen) {
        await dispatch(getSubCompanyCategories(companies, appModels.COMPANYSUBCATEGORY, subCatKeyword));
      }
    })();
  }, [userInfo, subCatKeyword, subCatOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && regionOpen) {
        await dispatch(getCompanyRegions(companies, appModels.COMPANYREGION, regionKeyword));
      }
    })();
  }, [userInfo, regionKeyword, regionOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && catOpen) {
        await dispatch(getParentCompany(companies, appModels.COMPANY, catKeyword));
      }
    })();
  }, [userInfo, catKeyword, catOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && copyOpen) {
        await dispatch(getParentCompany(companies, appModels.COMPANY, copyKeyword));
      }
    })();
  }, [userInfo, copyKeyword, copyOpen]);

  const onModuleKeywordClear = () => {
    setModuleKeyword(null);
    setModuleLocationId(defaultModule);
    setCheckRows([]);
    setModuleOpen(false);
  };

  const onModuleKeywordChange = (event) => {
    setModuleKeyword(event.target.value);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showModuleModal = () => {
    setModelValue(appModels.ONBOARDMODULE);
    setFieldName('allowed_module_ids');
    setModalName('Module List');
    setColumns(['id', 'name', 'code']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (allowedModulesInfo && allowedModulesInfo.data && allowedModulesInfo.data.length && moduleOpen) {
      const allModules = moduleLocationId.concat(getNewOnBoardArray(onBoardData));
      setModuleOptions(getArrayFromValuesById(allowedModulesInfo.data, isAssociativeArray(allModules || []), 'id'));
    } else if (allowedModulesInfo && allowedModulesInfo.loading) {
      setModuleOptions([{ name: 'Loading...' }]);
    } else {
      setModuleOptions([]);
    }
  }, [allowedModulesInfo, moduleOpen]);

  // eslint-disable-next-line consistent-return
  const handleParticipants = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setModuleLocationId(options);
    setCheckRows(options);
  };

  const disableDefaultModule = (option) => {
    let state = false;
    const array = getColumnArrayById(defaultModule, 'name');
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === option.name) {
        state = true;
        return state;
      }
    }
  };

  const onComplianceActKeyWordChange = (event) => {
    setCaKeyword(event.target.value);
  };

  const onSubCatKeyWordChange = (event) => {
    setSubCatKeyword(event.target.value);
  };

  const onComplianceCatKeyWordChange = (event) => {
    setCatKeyword(event.target.value);
  };

  const onCopyKeyWordChange = (event) => {
    setCopyKeyword(event.target.value);
  };

  const onRegionKeyWordChange = (event) => {
    setRegionKeyword(event.target.value);
  };

  const onCaKeywordClear = () => {
    setCaKeyword(null);
    setFieldValue('res_company_categ_id', '');
    setCaOpen(false);
  };

  const onSubCatKeywordClear = () => {
    setSubCatKeyword(null);
    setFieldValue('company_subcateg_id', '');
    setSubCatOpen(false);
  };

  const onRegKeywordClear = () => {
    setRegionKeyword(null);
    setFieldValue('region_id', '');
    setRegionOpen(false);
  };

  const onCatKeywordClear = () => {
    setCatKeyword(null);
    setFieldValue('parent_id', '');
    setCatOpen(false);
  };

  const onCopyKeywordClear = () => {
    setCatKeyword(null);
    setFieldValue('copy_from_company_id', '');
    setFieldValue('allowed_module_ids', '');
    setCatOpen(false);
  };

  const showCaModal = () => {
    setModelValue(appModels.COMPANYCATEGORY);
    setFieldName('res_company_categ_id');
    setModalName('Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const showSubCatModal = () => {
    setModelValue(appModels.COMPANYSUBCATEGORY);
    setFieldName('company_subcateg_id');
    setModalName('Sub Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const showRegionModal = () => {
    setModelValue(appModels.COMPANYREGION);
    setFieldName('region_id');
    setModalName('Region');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(false);
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('parent_id');
    setModalName('Parent Site');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showCopyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('copy_from_company_id');
    setModalName('Company');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const setLocationIds = (data) => {
    const Location = ([...moduleLocationId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    setModuleLocationId(uniqueObjArray);
    setFieldValue('allowed_module_ids', uniqueObjArray);
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  const listSelectedValues = (dataValue, col) => {
    const newArray = [];
    if (dataValue && dataValue.length && dataValue.length > 0) {
      for (let i = 0; i < dataValue.length; i += 1) {
        const newValue = dataValue[i][col].name;
        newArray.push(newValue);
      }
    }
    const value = newArray.join(',');
    return value;
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const categoryOptions = extractOptionsObject(companyCategoriesInfo, res_company_categ_id);
  const subCategoryOptions = extractOptionsObject(companySubCategoriesInfo, company_subcateg_id);
  const parentOptions = extractOptionsObject(parentCompanyInfo, parent_id);
  const countryOptions = extractOptionsObject(countriesInfo, country_id);
  const stateOptions = extractOptionsObject(statesInfo, state_id);
  const currencyOptions = extractOptionsObject(currencyInfo, currency_id);
  const regionOptions = extractOptionsObject(regionsInfo, region_id);

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={nameValue.name}
              label={nameValue.label}
              type="text"
              isRequired
              inputProps={{
                maxLength: 40,
              }}
              formGroupClassName="m-1"
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={parentSite.name}
              label={parentSite.label}
              formGroupClassName="m-1"
              isRequired
              disabled={editId}
              autoComplete="off"
              oldValue={getOldData(parent_id)}
              value={parent_id && parent_id.name ? parent_id.name : getOldData(parent_id)}
              apiError={(parentCompanyInfo && parentCompanyInfo.err && catOpen) ? generateErrorMessage(parentCompanyInfo) : false}
              open={catOpen}
              size="small"
              onOpen={() => {
                setCatOpen(true);
                setCatKeyword('');
              }}
              onClose={() => {
                setCatOpen(false);
                setCatKeyword('');
              }}
              loading={catOpen && parentCompanyInfo && parentCompanyInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={parentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onComplianceCatKeyWordChange}
                  variant="standard"
                  label={parentSite.label}
                  className={((getOldData(parent_id)) || (parent_id && parent_id.id) || (catKeyword && catKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {parentCompanyInfo && parentCompanyInfo.loading && catOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {!editId
                          ? (
                            <InputAdornment position="end">
                              {((getOldData(parent_id)) || (parent_id && parent_id.id) || (catKeyword && catKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onCatKeywordClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showCategoryModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          )
                          : ''}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={area.name}
              label={area.label}
              type="text"
              value={getNumberToCommas(area_sqft)}
              formGroupClassName="m-1"
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={shortCode.name}
              label={shortCode.label}
              type="text"
              disabled={editId}
              formGroupClassName="m-1"
            />
            {validateShortCode ? (
              <span className="ml-2 text-danger">
                Code already exists.
              </span>
            ) : ''}
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={siteCategory.name}
              label={siteCategory.label}
              formGroupClassName="m-1"
              isRequired
              oldValue={getOldData(res_company_categ_id)}
              value={res_company_categ_id && res_company_categ_id.name ? res_company_categ_id.name : getOldData(res_company_categ_id)}
              apiError={(companyCategoriesInfo && companyCategoriesInfo.err) ? generateErrorMessage(companyCategoriesInfo) : false}
              open={caOpen}
              size="small"
              onOpen={() => {
                setCaOpen(true);
                setCaKeyword('');
              }}
              onClose={() => {
                setCaOpen(false);
                setCaKeyword('');
              }}
              loading={companyCategoriesInfo && companyCategoriesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onComplianceActKeyWordChange}
                  variant="standard"
                  required
                  label={siteCategory.label}
                  className={((getOldData(res_company_categ_id)) || (res_company_categ_id && res_company_categ_id.id) || (caKeyword && caKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {companyCategoriesInfo && companyCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(res_company_categ_id)) || (res_company_categ_id && res_company_categ_id.id) || (caKeyword && caKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCaKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showCaModal}
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
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={subCategory.name}
              label={subCategory.label}
              formGroupClassName="m-1"
              oldValue={getOldData(company_subcateg_id)}
              value={company_subcateg_id && company_subcateg_id.name ? company_subcateg_id.name : getOldData(company_subcateg_id)}
              apiError={(companySubCategoriesInfo && companySubCategoriesInfo.err) ? generateErrorMessage(companySubCategoriesInfo) : false}
              open={subCatOpen}
              size="small"
              onOpen={() => {
                setSubCatOpen(true);
                setSubCatKeyword('');
              }}
              onClose={() => {
                setSubCatOpen(false);
                setSubCatKeyword('');
              }}
              loading={companySubCategoriesInfo && companySubCategoriesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={subCategoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSubCatKeyWordChange}
                  variant="standard"
                  label={subCategory.label}
                  className={((getOldData(company_subcateg_id)) || (company_subcateg_id && company_subcateg_id.id) || (caKeyword && caKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {companySubCategoriesInfo && companySubCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(company_subcateg_id)) || (company_subcateg_id && company_subcateg_id.id) || (caKeyword && caKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSubCatKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSubCatModal}
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
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} lg={6} md={12}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={addressLineOne.name}
              label={addressLineOne.label}
              type="text"
              formGroupClassName="m-1"
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <Autocomplete
              sx={{
                marginBottom: '20px',
              }}
              name={countryId.name}
              className="bg-white"
              open={countryOpen}
              oldValue={getOldData(country_id)}
              value={country_id && country_id.name ? country_id.name : getOldData(country_id)}
              size="small"
              formGroupClassName="m-1"
              onOpen={() => {
                setCountryOpen(true);
                setCountryKeyword('');
              }}
              onClose={() => {
                setCountryOpen(false);
                setCountryKeyword('');
              }}
                // defaultValue={country_id ? country_id.name : ''}
              loading={countriesInfo && countriesInfo.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={countryOptions}
              onChange={(e, data) => { setFieldValue(countryId.name, data); setFieldValue(stateId.name, ''); setCountryIdValue(data); }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCountryKeywordChange}
                  variant="standard"
                  label={`${countryId.label}`}
                  required
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {countriesInfo && countriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(countriesInfo && countriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(countriesInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={pincode.name}
              label={pincode.label}
              type="text"
              formGroupClassName="m-1"
            />
          </Col>
          <Col sm="12" md="12" xs="12" lg="12">
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={currency.name}
              label={currency.label}
              formGroupClassName="m-1"
              isRequired
              oldValue={getOldData(currency_id)}
              value={currency_id && currency_id.name ? currency_id.name : getOldData(currency_id)}
              open={currencyOpen}
              size="small"
              onOpen={() => {
                setCurrencyOpen(true);
                setCurrencyKeyword('');
              }}
              onClose={() => {
                setCurrencyOpen(false);
                setCurrencyKeyword('');
              }}
              loading={currencyInfo && currencyInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={currencyOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCurrencyKeywordChange}
                  label={currency.label}
                  required
                  variant="standard"
                  className="without-padding"
                  placeholder="Search and Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {currencyInfo && currencyInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(currencyInfo && currencyInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(currencyInfo)}</span></FormHelperText>)}
          </Col>
        </Col>
        <Col xs={12} sm={12} lg={6} md={12}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={cityValue.name}
              label={cityValue.label}
              type="text"
              formGroupClassName="m-1"
            />
          </Col>

          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={stateId.name}
              label={stateId.label}
              isRequired={stateId.required}
              formGroupClassName="m-1"
              oldValue={getOldData(state_id)}
              value={state_id && state_id.name ? state_id.name : getOldData(state_id)}
              className="bg-white"
              open={stateOpen}
              size="small"
              onOpen={() => {
                setStateOpen(true);
                setStateKeyword('');
              }}
              onClose={() => {
                setStateOpen(false);
                setStateKeyword('');
              }}
              loading={statesInfo && statesInfo.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={stateOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onStateKeywordChange}
                  variant="standard"
                  label={stateId.label}
                  required
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {statesInfo && statesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(statesInfo && statesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(statesInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={timeZone.name}
              label={timeZone.label}
              isRequired={timeZone.required}
              formGroupClassName="m-1"
              oldValue={company_tz}
              value={company_tz}
              open={tzOpen}
              size="small"
              onOpen={() => {
                setTzOpen(true);
              }}
              onClose={() => {
                setTzOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.timeZones}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  required
                  label={timeZone.label}
                  className="without-padding"
                  placeholder="Search and Select"
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
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={regionId.name}
              label={regionId.label}
              formGroupClassName="m-1"
              oldValue={getOldData(region_id)}
              value={region_id && region_id.name ? region_id.name : getOldData(region_id)}
              apiError={(regionsInfo && regionsInfo.err) ? generateErrorMessage(regionsInfo) : false}
              open={regionOpen}
              size="small"
              onOpen={() => {
                setRegionOpen(true);
                setRegionKeyword('');
              }}
              onClose={() => {
                setRegionOpen(false);
                setRegionKeyword('');
              }}
              loading={regionsInfo && regionsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={regionOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onRegionKeyWordChange}
                  variant="standard"
                  label={regionId.label}
                  className={((getOldData(region_id)) || (region_id && region_id.id) || (regionKeyword && regionKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {regionsInfo && regionsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(region_id)) || (region_id && region_id.id) || (regionKeyword && regionKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onRegKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showRegionModal}
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
        </Col>
      </Row>
      <Row>
        {!editId && (
          <Col xs={12} sm={12} lg={6} md={12}>
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={copyConfiguration.name}
                label={copyConfiguration.label}
                formGroupClassName="m-1"
                isRequired
                oldValue={getOldData(copy_from_company_id)}
                value={copy_from_company_id && copy_from_company_id.name ? copy_from_company_id.name : getOldData(copy_from_company_id)}
                apiError={(parentCompanyInfo && parentCompanyInfo.err) ? generateErrorMessage(parentCompanyInfo) : false}
                open={copyOpen}
                size="small"
                onOpen={() => {
                  setCopyOpen(true);
                  setCopyKeyword('');
                }}
                onClose={() => {
                  setCopyOpen(false);
                  setCopyKeyword('');
                }}
                loading={copyOpen && parentCompanyInfo && parentCompanyInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={parentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCopyKeyWordChange}
                    variant="standard"
                    required
                    label={copyConfiguration.label}
                    className={((getOldData(copy_from_company_id)) || (copy_from_company_id && copy_from_company_id.id) || (copyKeyword && copyKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {parentCompanyInfo && parentCompanyInfo.loading && copyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(copy_from_company_id)) || (copy_from_company_id && copy_from_company_id.id) || (copyKeyword && copyKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCopyKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCopyModal}
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
          </Col>
        )}
        {copy_from_company_id || editId
          ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <Col xs={12} sm={12} lg={12} md={12}>
                <div className="m-1">
                  <FormControl className={classes.margin}>
                    {/* <Label for={allowedModule.name}>
                      {allowedModule.label}
                    </Label> */}
                    <Autocomplete
                      sx={{
                        marginBottom: '20px',
                      }}
                      multiple
                      filterSelectedOptions
                      name="module"
                      open={moduleOpen}
                      size="small"
                      className="bg-white"
                      onOpen={() => {
                        setModuleOpen(true);
                        setModuleKeyword('');
                      }}
                      onClose={() => {
                        setModuleOpen(false);
                        setModuleKeyword('');
                      }}
                      value={allowed_module_ids && allowed_module_ids.length > 0 ? getExceptSelectedModule(allowed_module_ids) : []}
                      defaultValue={moduleLocationId}
                      onChange={(e, options) => handleParticipants(options)}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={moduleOptions}
                      renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
                        <Chip
                          label={option.name}
                          {...getTagProps({ index })}
                          className="m-1"
                          disabled={disableDefaultModule(option)}
                        />
                      ))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={allowedModule.label}
                          className={((getOldData(moduleLocationId)) || (moduleKeyword && moduleKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          onChange={(e) => onModuleKeywordChange(e.target.value)}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(allowedModulesInfo && allowedModulesInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((moduleKeyword && moduleKeyword.length > 0) || (getExceptSelectedModule(allowed_module_ids).length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onModuleKeywordClear}
                                    >
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showModuleModal}
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
                {editId && (
                  <div className="ml-1">
                    Selected Modules :
                    {' '}
                    <span className="text-info">{listSelectedValues(onBoardData, 'hx_onboard_module_id')}</span>
                  </div>
                )}
              </Col>
            </Col>
          )
          : ''}
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
              oldLocationData={moduleLocationId && moduleLocationId.length ? moduleLocationId : []}
              defaultModule={defaultModule}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'allowed_module_ids') { setLocationIds(checkedRows); } }}
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

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  initialAllowed: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
