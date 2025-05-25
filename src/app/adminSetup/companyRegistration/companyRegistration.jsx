/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Card,
  Row,
  Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { Rate } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import actionsBlueIcon from '@images/icons/actionsBlue.svg';
import envelopeBlueIcon from '@images/icons/envelopeBlue.svg';
import helpdeskIcon from '@images/icons/helpdesk.svg';
import assetIcon from '@images/icons/asset.svg';
import workOrdersIcon from '@images/icons/workOrders.svg';
import preventiveMaintenanceIcon from '@images/icons/preventiveMaintenance.svg';
import purchaseIcon from '@images/icons/purchase.svg';
import iotSystemIcon from '@images/icons/iotSystem.svg';
import ErrorContent from '@shared/errorContent';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/companyFormModel';
import formInitialValues from './formModel/formInitialValues';
import { InputField, FormikAutocomplete } from '../../shared/formFields';
import {
  noSpecialChars,
  integerKeyPress,
  generateErrorMessage,
} from '../../util/appUtils';
import { getTabName } from '../../util/getDynamicClientData';
import {
  getAllCountries,
  resetSaveCompany,
  saveCompany,
} from '../setupService';
import theme from '../../util/materialTheme';
import packagesData from './data/packages.json';

const { formId, formField } = tenantFormModel;

const faIcons = {
  Helpdesk: helpdeskIcon,
  'Assets Registery': assetIcon,
  Workorders: workOrdersIcon,
  'Preventive Maintenance': preventiveMaintenanceIcon,
  Purchase: purchaseIcon,
  'IOT System': iotSystemIcon,
  Analytics: iotSystemIcon,
  'Advanced Analytics': iotSystemIcon,
};

const CompanyRegistration = () => {
  const dispatch = useDispatch();
  const [countryOpen, setCountryOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(2);
  const [selectedPackage, setSelectedPackage] = useState(false);
 document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const {
    allCountriesInfo,
    companyRegisterInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(resetSaveCompany());
  }, []);

  function handleSubmit(values) {
    const countryId = values.country_id && values.country_id.id
      ? values.country_id.id : false;
    const redirectUri = window.location.href.replace('/company-registration', '/reset-password');
    const postData = { ...values };
    postData.country_id = countryId;
    postData.redirect_url = redirectUri;
    const payload = { values: postData };
    dispatch(saveCompany(payload));
  }

  const onHoverPackage = (id) => {
    if (!selectedPackage) {
      setCurrentPackage(id);
    }
  };

  let countryOptions = [];

  if (allCountriesInfo && allCountriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (allCountriesInfo && allCountriesInfo.data) {
    countryOptions = allCountriesInfo.data;
  }

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border register-area2">
      <Col md="8" sm="8" lg="8" xs="12">
        <h4 className="mb-0">
          <img src={actionsBlueIcon} alt="Actions" height="28" width="28" className="mr-2" />
          Hello!
          <span className="text-lightblue">Choose your Plan!</span>
        </h4>
        <p className="mb-0 mt-0 ml-4 font-weight-300">
            &nbsp;&nbsp;&nbsp;
          Click on plan below what fits best your needs.
        </p>
        <Row className="p-5">
          {packagesData && packagesData.data && packagesData.data.map((pack) => (
            <Col md="4" sm="4" lg="4" xs="12" key={pack.id}>
              <Card
                className={pack.id === currentPackage ? 'pb-2 pt-2 pl-0 pr-0 h-110 border-color-sea-buckthorn-2px border-radius-5px' : 'pb-2 pt-2 pl-0 pr-0 h-100 border-radius-5px'}
                onMouseOver={() => onHoverPackage(pack.id)}
                onFocus={() => onHoverPackage(pack.id)}
              >
                <Rate disabled defaultValue={pack.rate} className="text-center" />
                <h5 className="text-center">{pack.name}</h5>
                {/* <div className="p-2 bg-med-blue page-actions-header content-center">
                  <span className="font-weight-700 text-lightblue">Only</span>
                  <span className="text-lightblue font-weight-800 ml-2 mr-2 font-35">{pack.cost}</span>
                  <span className="font-weight-400 text-lightblue">$ per user / per year</span>
          </div> */}
                <div className="p-3 mb-5">
                  <p className="font-weight-600 mb-1">What is Included :</p>
                  {pack.modules && pack.modules.map((mod) => (
                    !mod.icon
                      ? <p className="font-weight-400 mb-1">{mod.name}</p>
                      : (
                        <p className="font-weight-400 mb-1">
                          <img src={faIcons[mod.name]} alt={mod.name} className="mr-2" height="15" width="15" />
                          {mod.name}
                        </p>
                      )
                  ))}
                </div>
                <div className="p-2 text-center bottom-div">
                  <Button
                  variant="contained"
                    type="button"
                    block
                    size="md"
                    onClick={() => setSelectedPackage(pack.id)}
                    className="btn-sky-blue"
                    color="primary"
                  >
                    {pack.id === selectedPackage ? 'Selected!' : 'I Want this!'}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
      <Col md="4" sm="4" lg="4" xs="12">
        {companyRegisterInfo && (!companyRegisterInfo.data) && (
        <>
          <h4 className="text-lightblue mb-0">Please register your site.</h4>
          <p className="m-0 font-weight-300">Please fill out these information</p>
          <br />
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, dirty,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <Row>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <p className="font-weight-800 m-0">Your Info</p>
                      <InputField
                        name={formField.nameValue.name}
                        label=""
                        isRequired={formField.nameValue.required}
                        type="text"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        placeholder={formField.nameValue.label}
                        onKeyPress={noSpecialChars}
                        maxLength="50"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.email.name}
                        label=""
                        isRequired={formField.email.required}
                        type="email"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        placeholder={formField.email.label}
                        maxLength="50"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.mobile.name}
                        label=""
                        isRequired={formField.mobile.required}
                        type="text"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        onKeyPress={integerKeyPress}
                        placeholder={formField.mobile.label}
                        maxLength="15"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.jobPosition.name}
                        label=""
                        isRequired={formField.jobPosition.required}
                        type="text"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        onKeyPress={noSpecialChars}
                        placeholder={formField.jobPosition.label}
                        maxLength="50"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <p className="font-weight-800 mb-0 mt-3">Company Info</p>
                      <InputField
                        name={formField.companyName.name}
                        label=""
                        isRequired={formField.companyName.required}
                        type="text"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        placeholder={formField.companyName.label}
                        onKeyPress={noSpecialChars}
                        maxLength="50"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.address.name}
                        label=""
                        isRequired={formField.address.required}
                        type="text"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        placeholder={formField.address.label}
                        maxLength="100"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <FormikAutocomplete
                        name={formField.countryId.name}
                        label=""
                        isRequired={formField.countryId.required}
                        labelClassName="m-0"
                        formGroupClassName="mt-2 mb-0 w-100 line-height-small"
                        open={countryOpen}
                        size="small"
                        onOpen={() => {
                          setCountryOpen(true);
                        }}
                        onClose={() => {
                          setCountryOpen(false);
                        }}
                        loading={allCountriesInfo && allCountriesInfo.loading}
                        getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={countryOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="bg-white with-padding-left"
                            placeholder="Country"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {allCountriesInfo && allCountriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(allCountriesInfo && allCountriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(allCountriesInfo)}</span></FormHelperText>)}
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.website.name}
                        label=""
                        isRequired={formField.website.required}
                        type="url"
                        labelClassName="m-0"
                        formGroupClassName="m-0 line-height-small"
                        placeholder={formField.website.label}
                        maxLength="50"
                      />
                    </Col>
                  </Row>
                </ThemeProvider>
                <div className="float-right mt-3">
                  <Button
                    disabled={(!(isValid && dirty)) || (companyRegisterInfo && companyRegisterInfo.loading)}
                    type="submit"
                    size="md"
                     variant="contained"
                  >
                    {companyRegisterInfo && companyRegisterInfo.loading ? (
                      <>
                        <span className="mr-2">Registering..</span>
                        <Spinner size="sm" />
                      </>
                    )
                      : (
                        <>
                          <span>Register Now</span>
                          <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowCircleRight} />
                        </>
                      )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
        )}
        {companyRegisterInfo && companyRegisterInfo.data && (
          <div className="text-center mt-5 p-5">
            <br />
            {' '}
            <br />
            <br />
            <img src={envelopeBlueIcon} alt="mail" />
            <h4 className="text-lightblue mb-0">Check your E-mail!</h4>
            <p className="m-0 font-weight-300">We&apos;ve sent you a link to connect to your dashboard.</p>
            <br />
            <Link to="/">
              <Button
                 variant="contained"
                size="sm"
              >
                <span>Click here to login</span>
              </Button>
            </Link>
          </div>
        )}
        {companyRegisterInfo && companyRegisterInfo.err && (
        <div className="text-center mt-4">
          <br />
          <ErrorContent errorTxt={generateErrorMessage(companyRegisterInfo)} />
        </div>
        )}
      </Col>
    </Row>
  );
};

export default CompanyRegistration;
