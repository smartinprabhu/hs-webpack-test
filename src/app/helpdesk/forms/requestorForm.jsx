/* eslint-disable prefer-destructuring */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
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
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getPartners,
} from '../../assets/equipmentService';
import { resetSpace, getMaintenanceConfig } from '../ticketService';
import { getCompanyDetail } from '../../adminSetup/setupService';
import theme from '../../util/materialTheme';
import {
  usMobile, generateErrorMessage, generateArrayFromValue,
  getAllCompanies,
} from '../../util/appUtils';
import SearchModal from './searchModal';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';

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

const RequestorForm = (props) => {
  const {
    reloadData,
    setFieldValue,
    editId,
    isFITTracker,
    isIncident,
    formField: {
      company,
      personName,
      tenantName,
      Mobile,
      Email,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    company_id, requestee_id,
  } = formValues;
  const dispatch = useDispatch();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const columns = ['id', 'name', 'email', 'mobile'];

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  function getCompanyId(cId) {
    let res = '';
    if (cId) {
      if (cId.id) {
        res = cId.id;
      } else if (cId.length) {
        res = cId[0];
      }
    }
    return res;
  }

  const companies = getAllCompanies(userInfo, userRoles);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    createTenantinfo, allowedCompanies,
  } = useSelector((state) => state.setup);

  const { maintenanceConfigurationData } = useSelector((state) => state.ticket);

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;
  let customerOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }
  if (requestee_id && requestee_id.length && requestee_id.length > 0) {
    const oldHour = [{ id: requestee_id[0], name: requestee_id[1] }];
    const newArr = [...customerOptions, ...oldHour];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  let companyId = '';

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    if (getCompanyId(company_id) && isAll) {
      dispatch(getMaintenanceConfig([getCompanyId(company_id)], appModels.MAINTENANCECONFIG));
      dispatch(getCompanyDetail(getCompanyId(company_id), appModels.COMPANY));
    }
  }, [company_id]);

  useEffect(() => {
    if (company_id && company_id.id && refresh === '1' && !editId) {
      setFieldValue('asset_id', '');
      setFieldValue('vendor_id', '');
      // setFieldValue('equipment_id', '');
    }
  }, [refresh, company_id]);

  // eslint-disable-next-line no-nested-ternary
  const userCompaniesList = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const userCompanies = isAll && userInfo && userInfo.data && userInfo.data.is_parent ? userCompaniesList.filter((item) => item.id !== userInfo.data.company.id) : userCompaniesList;

  function getCompanySetId() {
    let res = '';
    if (isAll && userInfo && userInfo.data && userInfo.data.is_parent) {
      res = ''; // userCompanies && userCompanies.length ? userCompanies[0] : {};
    } else {
      res = userInfo.data.company ? userInfo.data.company : '';
    }
    return res;
  }

  useEffect(() => {
    if (userInfo && userInfo.data && !requestee_id) {
      // eslint-disable-next-line no-nested-ternary
      companyId = userInfo.data.company ? userInfo.data.company : '';
      const partnerId = userInfo.data.partner_id && userInfo.data.partner_id !== '' ? { id: userInfo.data.partner_id, name: userInfo.data.name } : '';
      const mobileNo = userInfo.data.mobile ? userInfo.data.mobile : '';
      const emailId = userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
      setFieldValue('company_id', getCompanySetId());
      setFieldValue('requestee_id', partnerId);
      setFieldValue('email', emailId);
      setFieldValue('mobile', mobileNo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && partnersInfo && partnersInfo.data && requestee_id && requestee_id.id && !extraModal && refresh === '1') {
      const partnerData = generateArrayFromValue(partnersInfo.data, 'id', requestee_id.id);
      if (partnerData && partnerData.length > 0) {
        setFieldValue('email', partnerData[0].email ? partnerData[0].email : '');
        setFieldValue('mobile', partnerData[0].mobile ? partnerData[0].mobile : '');
      }
    }
  }, [userInfo, requestee_id, refresh]);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (noData && (noData.status_code && noData.status_code === 404)) && (customerKeyword && customerKeyword.length > 3) && !extraModal)) {
      customerOptions = [{ id: -77, name: customerKeyword }];
      setCustomerOpen(false);
      setFieldValue('requestee_id', { id: -77, name: customerKeyword });
    }
  }, [userInfo, customerKeyword, partnersInfo]);

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('requestee_id');
    setModalName('Requestor');
    setOtherFieldName('customer');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('requestee_id', '');
    setCustomerOpen(false);
    setFieldValue('email', '');
    setFieldValue('mobile', '');
  };

  const cancelSpace = () => {
    dispatch(resetSpace());
  };

  const oldCompId = company_id && company_id.length && company_id.length > 0 ? company_id[1] : '';
  const oldReqId = requestee_id && requestee_id.length && requestee_id.length > 0 ? requestee_id[1] : '';

  useEffect(() => {
    if (!editId) {
      setFieldValue('equipment_id', '');
      setFieldValue('asset_id', '');
      setFieldValue('category_id', '');
      setFieldValue('sub_category_id', '');
      setFieldValue('maintenance_team_id', '');
    }
  }, [company_id]);

  const isTenantShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_tenant;

  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Requestor Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 requestorForm-input">
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={company.name}
              label={company.label}
              isRequired
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={companyOpen}
              size="small"
              disabled={!isAll}
              oldValue={oldCompId}
              value={company_id && company_id.name ? company_id.name : oldCompId}
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
                  className="input-small-custom without-padding"
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
            {isAll && !editId && !company_id && (
            <FormHelperText className="display-block invalid-feedback">Please select the site</FormHelperText>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={personName.name}
              label={personName.label}
              isRequired
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              oldValue={oldReqId}
              value={requestee_id && requestee_id.name ? requestee_id.name : oldReqId}
              open={customerOpen}
              size="small"
              onOpen={() => {
                setCustomerOpen(true);
              }}
              onClose={() => {
                setCustomerOpen(false);
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
                        <span className={isMobNotShow ? 'hide-phone-number' : ''}>{option.mobile}</span>
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
                  className={((oldReqId) || (requestee_id && requestee_id.id) || (customerKeyword && customerKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((oldReqId) || (requestee_id && requestee_id.id) || (customerKeyword && customerKeyword.length > 0)) && (
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
                      </>
                    ),
                  }}
                />
              )}
            />
            {((partnersInfo && partnersInfo.err && customerOpen) && !(noData.status_code && noData.status_code === 404)) && (
              <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
            )}
            {((createTenantinfo && createTenantinfo.err) && !(requestee_id)) && (
              <FormHelperText><span className="text-danger">{generateErrorMessage(createTenantinfo)}</span></FormHelperText>
            )}
            {(noData && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length > 3)
              && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                <FormHelperText>
                  <span>{`New Requestor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => setAddCustomerModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={Email.name}
              type="email"
              label={Email.label}
              isRequired
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              placeholder="Enter email"
              maxLength="35"
            />
          </Col>
          {!isFITTracker && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={Mobile.name}
              type={isMobNotShow ? 'password' : 'text'}
              label={Mobile.label}
              // isRequired
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              onKeyPress={usMobile}
              placeholder="Enter mobile"
              maxLength="15"
            />
          </Col>
          )}
          {!isFITTracker && !isIncident && isTenantShow && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={tenantName.name}
              type="text"
              label={tenantName.label}
              // isRequired
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              maxLength="50"
            />
          </Col>
          )}
        </Row>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow " isOpen={extraModal}>
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
              modalName={modalName}
              setFieldValue={setFieldValue}
            />
          </ModalBody>
        </Modal>
        <Modal size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={addCustomerModal}>
          <ModalHeaderComponent title="Add Customer" imagePath={false} closeModalWindow={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
          <ModalBody className="pt-0 mt-0">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
            />
          </ModalBody>
        </Modal>

      </ThemeProvider>
    </>
  );
};

RequestorForm.defaultProps = {
  editId: false,
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
};

export default RequestorForm;
