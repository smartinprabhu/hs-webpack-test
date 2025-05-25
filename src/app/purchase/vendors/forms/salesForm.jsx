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
} from 'reactstrap';
import { useFormikContext } from 'formik';

import { InputField, FormikAutocomplete, CheckboxField } from '@shared/formFields';
import { getEmployeeList } from '../../../assets/equipmentService';
import {
  getPaymentTerms, getWebsites,
  getFiscalPositions, getIndustries,
} from '../../purchaseService';
import {
  generateErrorMessage,
  getAllowedCompanies,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const SalesForm = (props) => {
  const {
    setFieldValue,
    formField: {
      customer,
      supplier,
      isVisitor,
      isTenant,
      isFmServices,
      isCommandCentre,
      filePath,
      isManPowerAgency,
      internalReference,
      barcode,
      companyId,
      userId,
      propertyPaymentTermId,
      propertySupplierPaymentTermId,
      websiteId,
      propertyAccountPositionId,
      industry,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    user_id,
    website_id,
    property_payment_term_id,
    property_supplier_payment_term_id,
    property_account_position_id,
    company_id, industry_id,
  } = formValues;

  const dispatch = useDispatch();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [userKeyword, setUserKeyword] = useState('');
  const [sptOpen, setSptOpen] = useState(false);
  const [sptKeyword, setSptKeyword] = useState('');
  const [pptOpen, setPptOpen] = useState(false);
  const [pptKeyword, setPptKeyword] = useState('');
  const [webOpen, setWebOpen] = useState(false);
  const [webKeyword, setWebKeyword] = useState('');
  const [fpOpen, setFpOpen] = useState(false);
  const [fpKeyword, setFpKeyword] = useState('');
  const [industryOpen, setIndustryOpen] = useState(false);
  const [industryKeyword, setIndustryKeyword] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { employeesInfo } = useSelector((state) => state.equipment);
  const {
    paymentTerms, websitesInfo, fiscalPositions, industriesInfo,
  } = useSelector((state) => state.purchase);
  const { allowedCompanies } = useSelector((state) => state.setup);

  useEffect(() => {
    if (userInfo && userInfo.data && industryOpen) {
      dispatch(getIndustries(appModels.INDUSTRY, industryKeyword));
    }
  }, [userInfo, industryKeyword, industryOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && userOpen) {
        await dispatch(getEmployeeList(companies, appModels.USER, userKeyword));
      }
    })();
  }, [userInfo, userKeyword, userOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && webOpen) {
        await dispatch(getWebsites(companies, appModels.WEBSITE, webKeyword));
      }
    })();
  }, [userInfo, webKeyword, webOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && fpOpen) {
        await dispatch(getFiscalPositions(companies, appModels.FISCALPOSITION, fpKeyword));
      }
    })();
  }, [userInfo, fpKeyword, fpOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && sptOpen) {
        await dispatch(getPaymentTerms(companies, appModels.PAYMENTTERM, sptKeyword));
      }
    })();
  }, [userInfo, sptKeyword, sptOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && pptOpen) {
        await dispatch(getPaymentTerms(companies, appModels.PAYMENTTERM, pptKeyword));
      }
    })();
  }, [userInfo, pptKeyword, pptOpen]);

  const onUserKeywordChange = (event) => {
    setUserKeyword(event.target.value);
  };

  const onSptKeywordChange = (event) => {
    setSptKeyword(event.target.value);
  };

  const onPptKeywordChange = (event) => {
    setPptKeyword(event.target.value);
  };

  const onWebKeywordChange = (event) => {
    setWebKeyword(event.target.value);
  };

  const onFpKeywordChange = (event) => {
    setFpKeyword(event.target.value);
  };

  const onIndustryKeywordChange = (event) => {
    setIndustryKeyword(event.target.value);
  };

  let userOptions = [];
  let sptOptions = [];
  let pptOptions = [];
  let webOptions = [];
  let fiscalOptions = [];
  let industryOptions = [];

  if (industriesInfo && industriesInfo.loading) {
    industryOptions = [{ name: 'Loading' }];
  }
  if (industriesInfo && industriesInfo.data) {
    industryOptions = industriesInfo.data;
  }
  if (industriesInfo && industriesInfo.err) {
    industryOptions = [];
  }
  if (employeesInfo && employeesInfo.loading) {
    userOptions = [{ name: 'Loading..' }];
  }

  if (user_id && user_id.length && user_id.length > 0) {
    const oldId = [{ id: user_id[0], name: user_id[1] }];
    const newArr = [...userOptions, ...oldId];
    userOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.data) {
    const arr = [...userOptions, ...employeesInfo.data];
    userOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.err) {
    userOptions = [];
  }

  if (websitesInfo && websitesInfo.loading) {
    webOptions = [{ name: 'Loading..' }];
  }

  if (website_id && website_id.length && website_id.length > 0) {
    const oldId = [{ id: website_id[0], name: website_id[1] }];
    const newArr = [...webOptions, ...oldId];
    webOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (websitesInfo && websitesInfo.data) {
    const arr = [...webOptions, ...websitesInfo.data];
    webOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (websitesInfo && websitesInfo.err) {
    webOptions = [];
  }

  if (fiscalPositions && fiscalPositions.loading) {
    fiscalOptions = [{ name: 'Loading..' }];
  }

  if (property_account_position_id && property_account_position_id.length && property_account_position_id.length > 0) {
    const oldId = [{ id: property_account_position_id[0], name: property_account_position_id[1] }];
    const newArr = [...fiscalOptions, ...oldId];
    fiscalOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (fiscalPositions && fiscalPositions.data) {
    const arr = [...fiscalOptions, ...fiscalPositions.data];
    fiscalOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (fiscalPositions && fiscalPositions.err) {
    fiscalOptions = [];
  }

  if (paymentTerms && paymentTerms.loading) {
    if (sptOpen) {
      sptOptions = [{ name: 'Loading..' }];
    }
    if (pptOpen) {
      pptOptions = [{ name: 'Loading..' }];
    }
  }

  if (property_payment_term_id && property_payment_term_id.length && property_payment_term_id.length > 0) {
    const oldId = [{ id: property_payment_term_id[0], name: property_payment_term_id[1] }];
    const newArr = [...sptOptions, ...oldId];
    sptOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (property_supplier_payment_term_id && property_supplier_payment_term_id.length && property_supplier_payment_term_id.length > 0) {
    const oldId = [{ id: property_supplier_payment_term_id[0], name: property_supplier_payment_term_id[1] }];
    const newArr = [...pptOptions, ...oldId];
    pptOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (paymentTerms && paymentTerms.data) {
    if (sptOpen) {
      const arr = [...sptOptions, ...paymentTerms.data];
      sptOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (pptOpen) {
      const arr = [...pptOptions, ...paymentTerms.data];
      pptOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (paymentTerms && paymentTerms.err) {
    if (pptOpen) {
      pptOptions = [];
    }
    if (sptOpen) {
      sptOptions = [];
    }
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Sales & Purchases</p>
        </CardBody>
      </Card>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pr-4">
          <h6>Sales</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px">
            <CheckboxField
              name={customer.name}
              label={customer.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={userId.name}
              label={userId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={userOpen}
              size="small"
              oldValue={getOldData(user_id)}
              value={user_id && user_id.name ? user_id.name : getOldData(user_id)}
              onOpen={() => {
                setUserOpen(true);
              }}
              onClose={() => {
                setUserOpen(false);
              }}
              loading={employeesInfo && employeesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={userOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onUserKeywordChange}
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
            {(employeesInfo && employeesInfo.err && userOpen) && (<FormHelperText><span className="text-danger ml-1">{generateErrorMessage(employeesInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={propertyPaymentTermId.name}
              label={propertyPaymentTermId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={sptOpen}
              size="small"
              oldValue={getOldData(property_payment_term_id)}
              value={property_payment_term_id && property_payment_term_id.name ? property_payment_term_id.name : getOldData(property_payment_term_id)}
              onOpen={() => {
                setSptOpen(true);
              }}
              onClose={() => {
                setSptOpen(false);
              }}
              loading={paymentTerms && paymentTerms.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={sptOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSptKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {paymentTerms && paymentTerms.loading && sptOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(paymentTerms && paymentTerms.err && sptOpen) && (<FormHelperText><span className="text-danger ml-1">{generateErrorMessage(paymentTerms)}</span></FormHelperText>)}
          </Col>
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pl-4">
          <h6>Purchase</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px">
            <CheckboxField
              name={supplier.name}
              label={supplier.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={propertySupplierPaymentTermId.name}
              label={propertySupplierPaymentTermId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={pptOpen}
              size="small"
              oldValue={getOldData(property_supplier_payment_term_id)}
              value={property_supplier_payment_term_id && property_supplier_payment_term_id.name ? property_supplier_payment_term_id.name : getOldData(property_supplier_payment_term_id)}
              onOpen={() => {
                setPptOpen(true);
              }}
              onClose={() => {
                setPptOpen(false);
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
                        {paymentTerms && paymentTerms.loading && pptOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(paymentTerms && paymentTerms.err && pptOpen) && (<FormHelperText><span className="text-danger ml-1">{generateErrorMessage(paymentTerms)}</span></FormHelperText>)}
          </Col>
        </Col>
      </Row>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={3} lg={3} sm={3} className="mb-2">
          <h6>Visitor</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
            <CheckboxField
              name={isVisitor.name}
              label={isVisitor.label}
            />
          </Col>
        </Col>
        <Col xs={12} md={3} lg={3} sm={3} className="mb-2 pr-4">
          <h6>Tenant</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
            <CheckboxField
              name={isTenant.name}
              label={isTenant.label}
            />
          </Col>
        </Col>
        <Col xs={12} md={3} lg={3} sm={3} className="mb-2 pl-4">
          <h6>FM Services</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
            <CheckboxField
              name={isFmServices.name}
              label={isFmServices.label}
            />
          </Col>
        </Col>
        <Col xs={12} md={3} lg={3} sm={3} className="mb-2">
          <h6>Command Centre</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
            <CheckboxField
              name={isCommandCentre.name}
              label={isCommandCentre.label}
            />
          </Col>
        </Col>
      </Row>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pr-4">
          <h6 className="mb-n2">File Path</h6>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={filePath.name}
              label={filePath.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              type="text"
              maxLength="50"
            />
          </Col>
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pl-4">
          <h6>Man Power Agency</h6>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
            <CheckboxField
              name={isManPowerAgency.name}
              label={isManPowerAgency.label}
            />
          </Col>
        </Col>
      </Row>
      <Row className="ml-2px mb-2">
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pr-4">
          <h6>Misc</h6>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={internalReference.name}
              label={internalReference.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              type="text"
              maxLength="50"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={barcode.name}
              label={barcode.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              type="text"
              maxLength="50"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={companyId.name}
              label={companyId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={companyOpen}
              size="small"
              disabled
              oldValue={getOldData(company_id)}
              value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
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
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={websiteId.name}
              label={websiteId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={webOpen}
              size="small"
              oldValue={getOldData(website_id)}
              value={website_id && website_id.name ? website_id.name : getOldData(website_id)}
              onOpen={() => {
                setWebOpen(true);
              }}
              onClose={() => {
                setWebOpen(false);
              }}
              loading={websitesInfo && websitesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={webOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onWebKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {websitesInfo && websitesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(websitesInfo && websitesInfo.err && webOpen) && (<FormHelperText><span className="text-danger ml-1 ml-1">{generateErrorMessage(websitesInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={industry.name}
              label={industry.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={industryOpen}
              size="small"
              oldValue={getOldData(industry_id)}
              value={industry_id && industry_id.name ? industry_id.name : getOldData(industry_id)}
              onOpen={() => {
                setIndustryOpen(true);
                setIndustryKeyword('');
              }}
              onClose={() => {
                setIndustryOpen(false);
                setIndustryKeyword('');
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={industryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onIndustryKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {industriesInfo && industriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(industriesInfo && industriesInfo.err && industryOpen) && (<FormHelperText><span className="text-danger ml-1">{generateErrorMessage(industriesInfo)}</span></FormHelperText>)}
          </Col>
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mb-2 pl-4">
          <h6>Fiscal Information</h6>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={propertyAccountPositionId.name}
              label={propertyAccountPositionId.label}
              formGroupClassName="m-1"
              labelClassName="font-weight-500"
              open={fpOpen}
              size="small"
              oldValue={getOldData(property_account_position_id)}
              value={property_account_position_id && property_account_position_id.name ? property_account_position_id.name : getOldData(property_account_position_id)}
              onOpen={() => {
                setFpOpen(true);
              }}
              onClose={() => {
                setFpOpen(false);
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
            {(fiscalPositions && fiscalPositions.err && fpOpen) && (<FormHelperText><span className="text-danger ml-1">{generateErrorMessage(fiscalPositions)}</span></FormHelperText>)}
          </Col>
        </Col>
      </Row>
    </>
  );
};

SalesForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SalesForm;
