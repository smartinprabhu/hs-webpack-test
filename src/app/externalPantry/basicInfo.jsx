/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';

import checkGreen from '@images/icons/checkGreen.svg';
import idcardIcon from '@images/icons/pantry/pantryBlue.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import { detectMob, getAccountIdFromUrl, detectMimeType, getArrayNewFormat } from '../util/appUtils';
import { makeStyles } from '@material-ui/core/styles';
import { AddThemeColor } from '../themes/theme';

const queryString = require('query-string');

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
  root: {
    // input label when focused
    '& label.Mui-focused': {
      color: AddThemeColor({}).color,
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: AddThemeColor({}).color,
      },
    },
  },
});

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const propValues = props;
  const classes = useStyles();
  const values1 = queryString.parse(propValues.location.search);
  const { sid } = values1;
  const accid = getAccountIdFromUrl(props);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [visitorDetails, setVisitorDetails] = useState(false);
  const [domainValidation, setDomainValidation] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [orderInfo, setOrderInfo] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const isMobileView = detectMob();

  // const { vpConfig } = useSelector((state) => state.setup);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');
  const stickyFooter = document.getElementById('sticky_footer');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      // dispatch(getVpConfig(uuid));
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getPantryConfig?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  function getNewProducts(data) {
    const newArrData = data.map((cl) => ({
      product_id: cl.product_id && cl.product_id.id,
      ordered_qty: parseFloat(cl.ordered_qty),
    }));
    return newArrData;
  }

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';

  function handleSubmit(values) {
    setOrderInfo({
      loading: true, data: null, count: 0, err: null,
    });
    const spaceId = values.space_id && values.space_id.id ? values.space_id.id : false;
    const postDataValues = [
      {
        company_id: detailData.company.id,
        pantry_id: values.pantry_id && values.pantry_id.id ? values.pantry_id.id : false,
        space_id: spaceId || (sid ? parseInt(sid) : false),
        employee_name: values.employee_name ? values.employee_name : '',
        employee_email: values.employee_email ? values.employee_email : '',
        order_create_type: 'External',
        order_lines: getArrayNewFormat(getNewProducts(partsData)),
      },
    ];
    const data = {
      values: postDataValues,
    };

    const postData = new FormData();

    postData.append('values', JSON.stringify(data.values));

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/pantry/order`,
      headers: {
        'Content-Type': 'multipart/form-data',
        portalDomain: window.location.origin,
        accountId: accid,
      },
      data: postData,
    };

    axios(config)
      .then((response) => setOrderInfo({
        loading: false, data: response.data.data, count: response.data.data.length, err: null,
      }))
      .catch((error) => {
        setOrderInfo({
          loading: false, data: null, count: 0, err: error,
        });
      });
    setVisitorDetails(values);
  }

  const handleReset = (resetForm) => {
    setVisitorDetails(false);
    resetForm();
  };

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/pantry/orders',
        state: { referrer: 'add-request' },
      }}
      />
    );
  }

  return (
    <Row className={`${isMobileView ? '' : 'mt-2'} ml-1 mr-1 mb-2 p-3 external-link-tickets`}>
      {vpConfig && vpConfig.data && vpConfig.count > 0 && orderInfo && !orderInfo.count && !(orderInfo && orderInfo.loading) && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <>
          <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
            {isMobileView ? (
              <Row className="text-center">
                <Col md="12" sm="12" lg="12" xs="12">
                  <img
                    src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                    width="100"
                    height="auto"
                    className="d-inline-block align-top pr-2 imaget-custom-responsive"
                    alt="Helixsense Portal"
                  />
                </Col>
                <Col md="12" sm="12" lg="12" xs="12">
                  <h6 className="mb-1 mt-0">
                    Welcome to
                    {' '}
                    {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                  </h6>
                </Col>

              </Row>
            ) : (
              <Row className="content-center">
                <Col md="1" sm="2" lg="1" xs="2">
                  <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
                </Col>
                <Col md="8" sm="8" lg="8" xs="8">
                  <h4 className="mb-1 mt-0">
                    Welcome to
                    {' '}
                    {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                  </h4>
                </Col>
                <Col md="2" sm="2" lg="2" xs="2">
                  <img
                    src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                    width="140"
                    height="auto"
                    className="d-inline-block align-top pr-2 imaget-custom-responsive"
                    alt="Helixsense Portal"
                  />
                </Col>
              </Row>
            )}
          </CardBody>
          {isMobileView ? (
            <h6 className="mb-0">
              <img src={idcardIcon} alt="actions" className="mr-2 mb-2 width-30 imaget-custom-responsive" width="30" height="30" />
              {detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Pantry Order'}
            </h6>
          ) : (
            <h4 className="mb-0">
              <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
              {detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Pantry Order'}
            </h4>
          )}
          <hr className="mt-0" />

          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, values, setFieldValue, resetForm, errors,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <BasicForm
                    domainValidation={domainValidation}
                    setDomainValidation={setDomainValidation}
                    visitorDetails={visitorDetails}
                    setFieldValue={setFieldValue}
                    formField={formField}
                    detailData={detailData}
                    partsData={partsData}
                    setPartsData={setPartsData}
                    sid={sid}
                    accid={accid}
                  />
                </ThemeProvider>
                <hr />
                <div className="float-right mt-1">
                  <Button
                    type="button"
                    size="md"
                    disabled={!(values.employee_email || values.employee_name || (detailData && detailData.pantry && detailData.pantry.length > 1 && values.pantry_id))}
                    className="mr-2 submit-btn"
                    onClick={handleReset.bind(null, resetForm)}
                    variant="contained"
                  >
                    <span>CANCEL</span>
                  </Button>
                  <Button
                    disabled={!isValid || domainValidation}
                    type="submit"
                      size="md"
                    className="submit-btn"
                    variant="contained"
                  >
                    <span>SUBMIT</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      </Col>
      )}
      {vpConfig && vpConfig.data && !vpConfig.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      {orderInfo && orderInfo.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
          {isMobileView ? (
            <Row className="text-center">
              <Col md="12" sm="12" lg="12" xs="12">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="100"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
              </Col>
              <Col md="12" sm="12" lg="12" xs="12">
                <h6 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h6>
              </Col>

            </Row>
          ) : (
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="8" lg="8" xs="8">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="2" lg="2" xs="2">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="140"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          )}
        </CardBody>
        <h4 className="mb-0">
          <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
          {detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Pantry Order'}
        </h4>
        <hr className="mt-0" />
        <div className="text-center mt-3 mb-3">
          <img src={checkGreen} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-success">The pantry order has been created successfully.</h4>
        </div>
      </Col>
      )}
      {orderInfo && orderInfo.loading && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
          {isMobileView ? (
            <Row className="text-center">
              <Col md="12" sm="12" lg="12" xs="12">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="100"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
              </Col>
              <Col md="12" sm="12" lg="12" xs="12">
                <h6 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h6>
              </Col>

            </Row>
          ) : (
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="8" lg="8" xs="8">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="2" lg="2" xs="2">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="140"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          )}
        </CardBody>
        <h4 className="mb-0">
          <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
          {detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Pantry Order'}
        </h4>
        <hr className="mt-0" />
        <div className="text-center mt-3 mb-3">
          <Loader />
        </div>
      </Col>
      )}
      <DetailViewFormat detailResponse={vpConfig} />
    </Row>
  );
};

BasicInfo.defaultProps = {
  match: false,
};

BasicInfo.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default BasicInfo;
