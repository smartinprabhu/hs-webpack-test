/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  CardBody,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment-timezone';
import { useHistory } from 'react-router';

import DetailViewFormat from '@shared/detailViewFormat';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import Loader from '@shared/loading';

import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { detectMob, getAccountIdFromUrl } from '../util/appUtils';

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const accid = getAccountIdFromUrl(props);

  const history = useHistory();

  const [memberConfig, setMemberConfig] = useState({ loading: false, data: null, err: null });
  const [updateInfo, setUpdateInfo] = useState({
    loading: false, status: false, error: false, triggered: false,
  });

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const isMobileView = detectMob();

  const detailData = memberConfig && memberConfig.data && memberConfig.data.length ? memberConfig.data[0] : '';

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setMemberConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getTeammemberinfo?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setMemberConfig({
          loading: false, data: response.data.data, count: response.data && response.data.data && response.data.data.length ? 1 : 0, err: null,
        }))
        .catch((error) => {
          setMemberConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  function handleSubmit(values) {
    const postData = new FormData();
    postData.append('password', values.password);
    postData.append('uuid', uuid);
    setUpdateInfo({
      loading: true, status: false, error: false, triggered: false,
    });
    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/getTeammeberUpdate `,
      headers: {
        'Content-Type': 'multipart/form-data',
        portalDomain: window.location.origin,
        accountId: accid,
      },
      data: postData,
    };

    axios(config)
      .then((response) => setUpdateInfo({
        loading: false, status: !!(response.data.status && response.data.data), error: response.data.error, triggered: true,
      }))
      .catch((error) => {
        setUpdateInfo({
          loading: false, status: false, error, triggered: true,
        });
      });
  }

  const handleReset = (resetForm) => {
    resetForm();
  };

  const targeDate = detailData && detailData.invitation_expiry_date ? moment.utc(detailData.invitation_expiry_date).local().format('YYYY-MM-DD HH:mm:ss') : false;
  // const targeDate = detailData && detailData.invitation_expiry_date ? detailData.invitation_expiry_date : false;

  const isNotExpired = targeDate && new Date(targeDate) >= new Date();

  const redirectToLogin = () => {
    history.push({ pathname: '/' });
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 external-link-tickets">
      {updateInfo && !updateInfo.status && !updateInfo.error && !updateInfo.loading && memberConfig && memberConfig.data && memberConfig.count > 0 && isNotExpired && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
          <Row>
            <Col md="9" sm="8" lg="9" xs="8">
              {isMobileView
                ? (
                  <h6 className="mb-0 mt-1 text-break">
                    {detailData.name}
                  </h6>
                )
                : (
                  <h4 className="mb-0">
                    {detailData.name}
                  </h4>
                )}
            </Col>
            <Col md="3" sm="4" lg="3" xs="4">
              <img
                src={getExportLogo()}
                width="130"
                height="auto"
                className="d-inline-block align-top"
                alt="Helixsense Portal"
              />
            </Col>
          </Row>
        </CardBody>
        <hr className="mt-0" />
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <BasicForm setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
              </ThemeProvider>
              <hr />
              <div className="float-right mt-1">
                <Button
                  type="button"
                  size="md"
                  className="mr-2 btn-cancel"
                  onClick={handleReset.bind(null, resetForm)}
                   variant="contained"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  disabled={!(isValid && dirty)}
                  type="submit"
                  size="md"
                   variant="contained"
                >
                  <span className="mr-2 ml-2">Update</span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
      )}
      {memberConfig && memberConfig.data && !memberConfig.count && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">Oops! Your request is invalid</h4>
          </div>
        </Col>
      )}
      {detailData && !isNotExpired && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">
              Oops! Your request is
              {'  '}
              Expired
            </h4>
          </div>
        </Col>
      )}
      {detailData && updateInfo && !updateInfo.status && updateInfo.triggered && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">
              {updateInfo && updateInfo.error && updateInfo.error.message ? updateInfo.error.message : 'Something went wrong..'}
            </h4>
          </div>
        </Col>
      )}
      {detailData && updateInfo && updateInfo.loading && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <Loader />
          </div>
        </Col>
      )}
      {detailData && updateInfo && updateInfo.status && updateInfo.triggered && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={checkGreen} className="mr-2" alt="Approved" width="40" height="40" />
          <h4 className="text-success">
            Your Password is updated successfully, please login
          </h4>
          <Button
            type="button"
            size="md"
             variant="contained"
            onClick={() => redirectToLogin()}
          >
            <span className="mr-2 ml-2">Login</span>
          </Button>
        </div>
      </Col>
      )}
      <DetailViewFormat detailResponse={memberConfig} />
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
