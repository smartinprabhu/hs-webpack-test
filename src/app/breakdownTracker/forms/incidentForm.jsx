/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Modal, ModalBody, Label, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress, FormControl,
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  CheckboxField, DateTimeField, FormikAutocomplete,
} from '@shared/formFields';
import { Autocomplete } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import {
  getDateTimeSeconds, generateErrorMessage, extractOptionsObject, getAllCompanies, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../util/appUtils';
import {
  getServiceCategory, setServiceImpactedId, getServiceImpacted,
} from '../breakdownService';
import customData from '../data/customData.json';
import theme from '../../util/materialTheme';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const IncidentForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    editId,
    formField: {
      incidentDate,
      ciriticalitys,
      isServiceImpacted,
      incidentAge,
      serviceImpactedIds,
      resultsInStatutoryNonCompliance,
      breakdownDueToAgeing,
      serviceCategoryId,
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
    ciriticality, incident_date, is_service_impacted, service_category_id, services_impacted_ids, company_id,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [criticalOpen, setCriticalOpen] = useState(false);

  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceKeyword, setServiceKeyword] = useState('');
  const [checkedRows, setCheckRows] = useState([]);
  const [serviceImpactOptions, setServiceImpactOptions] = useState([]);

  const [serviceCategoryOpen, setServiceCategoryOpen] = useState(false);
  const [serviceCategoryKeyword, setServiceCategoryKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const {
    serviceImpactId, servicecatInfoList, serviceImpactInfo,
    btConfigInfo,
  } = useSelector((state) => state.breakdowntracker);

  const companies = getAllCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;

  function getDifferece(date2) {
    const date1 = new Date();
    const d = date2; // today!
    const x = 1; // go back 5 days!
    d.setDate(d.getDate() - x);
    const Difference_In_Time = d.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  useEffect(() => {
    if (serviceImpactId) {
      setFieldValue('services_impacted_ids', serviceImpactId);
    }
  }, [serviceImpactId]);

  useEffect(() => {
    if (!is_service_impacted) {
      dispatch(setServiceImpactedId([]));
      setFieldValue('services_impacted_ids', '');
    }
  }, [is_service_impacted]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && serviceCategoryOpen) {
        const tempLevel = configData.service_category_access ? configData.service_category_access : '';
        let domain = '';
        if (tempLevel === 'Site') {
          domain = `["company_id","=",${userCompanyId}]`;
        } else if (tempLevel === 'Company') {
          domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
        } else if (tempLevel === 'Instance') {
          domain = '"|",["company_id","=",1],["company_id","=",false]';
        }

        if (tempLevel && serviceCategoryKeyword) {
          domain = `${domain},["name","ilike","${serviceCategoryKeyword}"]`;
        }

        if (!tempLevel && serviceCategoryKeyword) {
          domain = `["name","ilike","${serviceCategoryKeyword}"]`;
        }
        await dispatch(getServiceCategory(domain, appModels.BREAKDOWNTRACKERSERVICECATEGORY));
      }
    })();
  }, [serviceCategoryOpen, serviceCategoryKeyword, btConfigInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && serviceOpen) {
      const companyIds = company_id && company_id.id ? company_id.id : companies;
      dispatch(getServiceImpacted(companyIds, appModels.BREAKDOWNTRACKERSERVICE, serviceKeyword));
    }
  }, [userInfo, serviceOpen, serviceKeyword]);

  const onServiceImpactKeywordClear = () => {
    setServiceKeyword(null);
    dispatch(setServiceImpactedId([]));
    setCheckRows([]);
    setServiceOpen(false);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showServiceImpactModal = () => {
    setModelValue(appModels.BREAKDOWNTRACKERSERVICE);
    setFieldName('services_impacted_ids');
    setModalName('Service Impact List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(company_id && company_id.id ? company_id.id : companies);
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (serviceImpactInfo && serviceImpactInfo.data && serviceImpactInfo.data.length && serviceOpen) {
      setServiceImpactOptions(getArrayFromValuesById(serviceImpactInfo.data, isAssociativeArray(serviceImpactId || []), 'id'));
    } else if (serviceImpactInfo && serviceImpactInfo.loading) {
      setServiceImpactOptions([{ name: 'Loading...' }]);
    } else {
      setServiceImpactOptions([]);
    }
  }, [serviceImpactInfo, serviceOpen]);

  const handleServiceImpacted = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setServiceImpactedId(options));
    setCheckRows(options);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : [];
  }

  const onServiceCategoryChange = (event) => {
    setServiceCategoryKeyword(event.target.value);
  };

  const showServiceCatModal = () => {
    setModelValue(appModels.BREAKDOWNTRACKERSERVICECATEGORY);
    setFieldName('service_category_id');
    setModalName('Service Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    const tempLevel = configData.service_category_access ? configData.service_category_access : '';
    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }
    setCompanyValue(domain);
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const onServiceCategoryClear = () => {
    setServiceCategoryKeyword(null);
    setFieldValue('service_category_id', '');
    setServiceCategoryOpen(false);
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(setServiceImpactedId(services_impacted_ids));
    }
  }, [userInfo]);

  // useEffect(() => {
  //   dispatch(setServiceImpactedId(serviceImpactId));
  // }, [serviceImpactId]);

  // useEffect(() => {
  //   if (services_impacted_ids) {
  //     dispatch(setServiceImpactedId(services_impacted_ids));
  //   }
  // }, [services_impacted_ids]);

  // useEffect(() => {
  //   if (editId) {
  //     setServiceImpactedId(services_impacted_ids);
  //   }
  // }, [editId]);

  const setLocationIds = (data) => {
    const Location = ([...serviceImpactId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setServiceImpactedId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  const onServiceImpactKeyWordChange = (event) => {
    setServiceKeyword(event.target.value);
  };

  function getCriticalLabel(data) {
    if (customData && customData.criticalTextForm[data]) {
      const s = customData.criticalTextForm[data].label;
      return s;
    }
    return '';
  }

  const serviceCategoryOptions = extractOptionsObject(servicecatInfoList, service_category_id);
  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Incident Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 requestorForm-input">
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={incidentDate.name}
              label={incidentDate.label}
              isRequired={incidentDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={incidentDate.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              disablePastDate
              disableFuture
              disabledDateTime
              defaultValue={incident_date ? new Date(getDateTimeSeconds(incident_date)) : ''}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={serviceCategoryId.name}
              label={serviceCategoryId.label}
              labelClassName="mb-1"
              isRequired
              formGroupClassName="mb-1 w-100"
              oldValue={getOldData(service_category_id)}
              value={service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id)}
              apiError={(servicecatInfoList && servicecatInfoList.err && serviceCategoryOpen) ? generateErrorMessage(servicecatInfoList) : false}
              open={serviceCategoryOpen}
              size="small"
              onOpen={() => {
                setServiceCategoryOpen(true);
                setServiceCategoryKeyword('');
              }}
              onClose={() => {
                setServiceCategoryOpen(false);
                setServiceCategoryKeyword('');
              }}
              loading={servicecatInfoList && servicecatInfoList.loading && serviceCategoryOpen}
              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={serviceCategoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => { onServiceCategoryChange(e.target.value); }}
                  variant="outlined"
                  value={serviceCategoryKeyword}
                  className={((service_category_id && service_category_id.id) || (serviceCategoryKeyword && serviceCategoryKeyword.length > 0) || (service_category_id && service_category_id.length))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {servicecatInfoList && servicecatInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((service_category_id && service_category_id.id) || (serviceCategoryKeyword && serviceCategoryKeyword.length > 0) || (service_category_id && service_category_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onServiceCategoryClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showServiceCatModal}
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
            <FormikAutocomplete
              name={ciriticalitys.name}
              label={ciriticalitys.label}
              labelClassName="mb-1"
              isRequired
              formGroupClassName="mb-1 w-100"
              open={criticalOpen}
              disableClearable
              oldValue={getCriticalLabel(ciriticality)}
              value={ciriticality && ciriticality.label ? ciriticality.label : getCriticalLabel(ciriticality)}
              size="small"
              onOpen={() => {
                setCriticalOpen(true);
              }}
              onClose={() => {
                setCriticalOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.critical}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="input-small-custom without-padding"
                  placeholder="Select"
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
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <CheckboxField
              name={resultsInStatutoryNonCompliance.name}
              label={resultsInStatutoryNonCompliance.label}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <CheckboxField
              name={breakdownDueToAgeing.name}
              label={breakdownDueToAgeing.label}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <CheckboxField
              name={isServiceImpacted.name}
              label={isServiceImpacted.label}
            />
          </Col>
          {is_service_impacted
            ? (
              <Col xs={12} sm={12} md={12} lg={12}>
                <div>
                  <FormControl className={classes.margin}>
                    <Label for={serviceImpactedIds.name}>
                      {serviceImpactedIds.label}
                      {' '}
                      <span className="text-danger">*</span>
                    </Label>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      name="categoryuser"
                      open={serviceOpen}
                      size="small"
                      className="bg-white serviceImpact"
                      onOpen={() => {
                        setServiceOpen(true);
                        setServiceKeyword('');
                      }}
                      onClose={() => {
                        setServiceOpen(false);
                        setServiceKeyword('');
                      }}
                      value={services_impacted_ids && services_impacted_ids.length > 0 ? services_impacted_ids : []}
                      defaultValue={serviceImpactId}
                      onChange={(e, options) => handleServiceImpacted(options)}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={serviceImpactOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className={((getOldData(serviceImpactId)) || (serviceKeyword && serviceKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          onChange={(e) => onServiceImpactKeyWordChange(e.target.value)}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(serviceImpactInfo && serviceImpactInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((serviceKeyword && serviceKeyword.length > 0) || (services_impacted_ids && services_impacted_ids.length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onServiceImpactKeywordClear}
                                    >
                                      <BackspaceIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showServiceImpactModal}
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
              </Col>
            )
            : ''}
          { /* <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={incidentAge.name}
              label={incidentAge.label}
              type="text"
              readOnly
              disabled
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              maxLength="13"
            />
          </Col> */ }
        </Row>
      </ThemeProvider>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
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
            setCheckedRows={setCheckRows}
            olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldServiceData={serviceImpactId && serviceImpactId.length ? serviceImpactId : []}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => { if (fieldName === 'services_impacted_ids') { setLocationIds(checkedRows); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal>
    </>
  );
};

IncidentForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default IncidentForm;
