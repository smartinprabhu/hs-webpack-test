/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import {
  FormControl, Box, Button, Divider,
} from '@mui/material';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import buildingBlack from '@images/icons/buildingBlack.svg';

import DetailViewFormat from '@shared/detailViewFormat';
import checklistSurvey from '@images/icons/checklistSurvey.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import Survey from './survey';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { detectMob, getAccountIdFromUrl, detectMimeType } from '../util/appUtils';
import { storeSurveyToken } from '../helpdesk/ticketService';

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const BasicFeedbackInfo = (props) => {
  const { uuid, type, ruuid } = props;
  // const isMail = !!localStorage.getItem('commentor_mail');
  const accid = getAccountIdFromUrl(props);
  const [isNext, setNext] = useState(false);
  const [surveyConfig, setSurveyConfig] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
  const [loginClass, setLoginClass] = useState('');

  const { surveyToken } = useSelector((state) => state.ticket);

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const dispatch = useDispatch();
  const isMobileView = detectMob();

  // const { vpConfig } = useSelector((state) => state.setup);

  const detailData = surveyConfig && surveyConfig.data ? surveyConfig.data : '';

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setSurveyConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getSurveyConfig?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setSurveyConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setSurveyConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (surveyConfig && surveyConfig.data && surveyConfig.count > 0) {
      const { data } = surveyConfig;
      if (!data.requires_verification_by_otp && data.has_reviwer_email !== 'Required' && data.has_reviwer_name !== 'Required' && data.has_reviwer_mobile !== 'Required') {
        setNext(true);
      }
    }
  }, [surveyConfig]);

  function handleSubmit(values) {
    const postValues = {
      reviwer_name: values.name, reviwer_mobile: values.mobile, email: values.email, disclaimer_text: values.disclaimerValue,
    };

    const payload = { uuid: detailData.uuid, token: detailData.token || surveyToken, values: postValues };

    const postData = new FormData();
    if (payload && payload.values) {
      postData.append('values', JSON.stringify(payload.values));
    } else if (typeof payload === 'object') {
      Object.keys(payload).map((payloadObj) => {
        if ((payloadObj !== 'uuid')
          || (payloadObj !== 'token')) {
          postData.append(payloadObj, payload[payloadObj]);
        }
        return postData;
      });
    }

    postData.append('uuid', payload.uuid);
    postData.append('token', payload.token);

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/survey/createInput`,
      headers: {
        'Content-Type': 'multipart/form-data',
        portalDomain: window.location.origin,
        accountId: accid,
      },
      data: postData,
    };

    axios(config)
      .then((response) => { console.log(response); })
      .catch((error) => {
        console.log(error);
      });
    setNext(true);
  }

  const handleReset = (resetForm) => {
    dispatch(storeSurveyToken(false));
    resetForm();
  };

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/survey',
        state: { referrer: 'add-request' },
      }}
      />
    );
  }

  /* const theme = useState(localStorage.getItem('theme'));

  useEffect(() => {
    if (appConfig.CLIENTNAME === 'sfx') {
      if (theme[0] === 'dark-style.css') {
        setLoginClass('login dark-bg');
      } else {
        setLoginClass('login bg-white');
      }
    } else {
      setLoginClass('login');
    }
  }, [theme, appConfig]); */

  return (
    <div className={loginClass}>
      <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
        {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && detailData && detailData.stage_id && detailData.stage_id.name
      && (detailData.stage_id.name === 'Published') && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <>
          <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="7" lg="8" xs="7">
                <h4 className="mb-1 mt-0">
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="3" lg="2" xs="3">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="70"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
            <hr />
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={checklistSurvey} alt="checklistSurvey" className="mr-2" width={isMobileView ? '35' : '40'} height="auto" />
              </Col>
              <Col md="11" sm="10" lg="11" xs="10">
                {isMobileView
                  ? (
                    <h6 className="mb-0 mt-1 text-break">
                      {detailData.title}
                    </h6>
                  )
                  : (
                    <h4 className="mb-0">
                      {detailData.title}
                    </h4>
                  )}
                <p className="text-muted mt-0 mb-0 font-weight-400">
                  {detailData.description}
                </p>
              </Col>
            </Row>
          </CardBody>
          {!isNext && (
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
                  <BasicForm accid={accid} setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
                </ThemeProvider>
                <hr />
                <div className="float-right mt-1">
                  <Button
                    type="button"
                    size="md"
                    className="mr-2"
                    onClick={handleReset.bind(null, resetForm)}
                    variant="contained btn-cancel"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    disabled={!(isValid && dirty)}
                    type="submit"
                    size="md"
                    variant="contained"
                  >
                    <span className="mr-2 ml-2">Start</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          )}
          {isNext && (
            <Survey onNext={() => setNext(false)} detailData={detailData} ruuid={ruuid}  clearForm={() => setNext(false)} type={type} />
          )}
        </>
      </Col>
        )}
        {surveyConfig && surveyConfig.data && !surveyConfig.count && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">Oops! Your request is invalid</h4>
          </div>
        </Col>
        )}
        {detailData && detailData.stage_id && detailData.stage_id.name && (detailData.stage_id.name !== 'Published') && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">
              Oops! Your request is
              {'  '}
              {detailData.stage_id.name}
            </h4>
          </div>
        </Col>
        )}
        <DetailViewFormat detailResponse={surveyConfig} />
      </Row>
    </div>
  );
};

BasicFeedbackInfo.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  uuid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  ruuid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default BasicFeedbackInfo;
