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
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import checklistSurvey from '@images/icons/checklistSurvey.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import Survey from './survey';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { detectMob, getAccountIdFromUrl } from '../util/appUtils';
import { storeSurveyToken } from '../helpdesk/ticketService';

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const BasicFeedbackInfo = (props) => {
  const { uuid, type, ruuid } = props;
  // const isMail = !!localStorage.getItem('commentor_mail');
  const [isNext, setNext] = useState(false);
  const accid = getAccountIdFromUrl(props);
  const [surveyConfig, setSurveyConfig] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin}/`;

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
    const postValues = { reviwer_name: values.name, reviwer_mobile: values.mobile, email: values.email };

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

  return (
    <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
      {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && detailData && detailData.stage_id && detailData.stage_id.name
      && (detailData.stage_id.name === 'In progress' || detailData.stage_id.name === 'Permanent') && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <>
          <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
            <Row>
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={checklistSurvey} alt="checklistSurvey" className="mr-2" width={isMobileView ? '35' : '40'} height="auto" />
              </Col>
              <Col md="8" sm="6" lg="8" xs="6">
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
                    <span className="mr-2 ml-2">Start</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          )}
          {isNext && (
            <Survey onNext={() => setNext(false)} detailData={detailData} ruuid={ruuid} type={type} />
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
      {detailData && detailData.stage_id && detailData.stage_id.name && (detailData.stage_id.name !== 'In progress' && detailData.stage_id.name !== 'Permanent') && (
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
