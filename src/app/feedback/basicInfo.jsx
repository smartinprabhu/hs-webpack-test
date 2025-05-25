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
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl, Box, Button, Divider,
} from '@mui/material';

import DetailViewFormat from '@shared/detailViewFormat';
import checklistSurvey from '@images/icons/checklistSurvey.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';

import SSOValidation from '@shared/ssoValidation';

import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import Survey from './survey';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import {
  detectMob, getAccountIdFromUrl, detectMimeType, getLocalDateCustom, getLocalDateDBFormat,
} from '../util/appUtils';
import { storeSurveyToken } from '../helpdesk/ticketService';
import { last } from '../util/staticFunctions';

const queryString = require('query-string');

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const propValues = props;
  const values1 = queryString.parse(propValues.location.search);
  const { lid, auid } = values1;
  const accid = getAccountIdFromUrl(props);
  // const isMail = !!localStorage.getItem('commentor_mail');
  const [isNext, setNext] = useState(false);
  const [emailId, setEmailId] = useState(false);
  const [isSSOVerified, setSSOVerified] = useState(false);
  const [surveyConfig, setSurveyConfig] = useState({ loading: false, data: null, err: null });
  const [surveyAnswer, setSurveyAnswer] = useState({ loading: false, data: null, err: null });
  const [reviewerStore, setReviewerStore] = useState({ loading: false, data: null, err: null });

  const [reviewConfig, setReviewConfig] = useState({ loading: false, data: null, err: null });
  const [postedValues, setPostedValues] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const { surveyToken } = useSelector((state) => state.ticket);

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const dispatch = useDispatch();
  const isMobileView = detectMob();

  // const { vpConfig } = useSelector((state) => state.setup);

  const detailData = surveyConfig && surveyConfig.data ? surveyConfig.data : '';
  const lastAnswer = surveyAnswer && surveyAnswer.data ? surveyAnswer.data : '';

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
    if (emailId && emailId !== '') {
      setSurveyAnswer({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getSurveyAnsweredon?uuid=${uuid}&reviwer_email=${emailId}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => {
          setSurveyAnswer({
            loading: false, data: response.data.data, count: response.data.length, err: null,
          });
        })
        .catch((error) => {
          setSurveyAnswer({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [emailId]);

  useEffect(() => {
    if (surveyConfig && surveyConfig.data && surveyConfig.count > 0) {
      const { data } = surveyConfig;
      const spaceExists = !auid && !data.is_show_all_spaces && data.category_type && data.category_type === 'ah' && data.location_ids && data.location_ids.length > 0;
      if (!data.requires_verification_by_otp && (data.has_reviwer_email === 'None' && data.has_reviwer_name === 'None' && data.has_reviwer_mobile === 'None' && data.has_employee_code === 'None' && data.has_tenant === 'None') && !spaceExists) {
        setNext(true);
      }
    }
  }, [surveyConfig]);

  useEffect(() => {
    if (uuid && auid && surveyConfig && surveyConfig.data && surveyConfig.count > 0) {
      setReviewConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","token","state","deadline"]';
      const payload = `domain=[["token","=","${auid}"],["survey_id.uuid","=","${uuid}"]]&model=survey.user_input&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setReviewConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setReviewConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [surveyConfig]);

  const reviewData = auid && reviewConfig && reviewConfig.data && reviewConfig.data.length ? reviewConfig.data[0] : false;

  const deadLine = auid && reviewData && reviewData.deadline ? getLocalDateCustom(reviewData.deadline, 'YYYY-MM-DD') : false;

  const isNotExpired = deadLine && new Date(deadLine) >= new Date(getLocalDateDBFormat(new Date()));

  const isCompleted = !!(auid && reviewData && reviewData.state && reviewData.state === 'done');

  useEffect(() => {
    if (auid && !isCompleted && isNotExpired) {
      setNext(true);
    }
  }, [auid, reviewData]);

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'string') {
      return arr[0];
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }

  function handleSubmit(values) {
    setReviewerStore({
      loading: true, data: null, status: null, err: null,
    });
    let lValue = false;
    if (detailData && detailData.category_type && detailData.category_type === 'ah' && detailData.is_show_all_spaces) {
      lValue = values.location_id && values.location_id.length > 0 ? checkDataType(values.location_id) : false;
    } else {
      lValue = values.location_id && values.location_id.id ? values.location_id.id : false;
    }
    const postValues = {
      reviwer_name: values.name,
      reviwer_mobile: values.mobile,
      email: values.email,
      employee_code: values.employeeCode,
      location_id: lValue,
      partner_id: values.partner_id && values.partner_id.id ? values.partner_id.id : false,
      equipment_id: detailData && detailData.category_type && detailData.category_type === 'e' && detailData.equipment_id && detailData.equipment_id.id ? detailData.equipment_id.id : false,
    };

    const sData = { ...values };
    if (sData.disclaimer_text) delete sData.disclaimer_text;
    setPostedValues(sData);

    const payload = { uuid: detailData.uuid, token: detailData.token || surveyToken, values: postValues };

    const postData = new FormData();

    postData.append('values', JSON.stringify(payload.values));
    /* if (typeof payload === 'object') {
      Object.keys(payload).map((payloadObj) => {
        if (payloadObj !== 'uuid') {
          postData.append(payloadObj, payload[payloadObj]);
        }
        if (payloadObj !== 'token') {
          postData.append(payloadObj, payload[payloadObj]);
        }
        return postData;
      });
    } */
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
      .then((response) => {
        setNext(true);
        setReviewerStore({
          loading: false, data: response.data.data, status: response.data.status, err: null,
        });
      })
      .catch((error) => {
        console.log(error);
        setReviewerStore({
          loading: false, data: null, status: false, err: error,
        });
      });
    // setNext(true);
  }

  function storeLocation(locId) {
    setReviewerStore({
      loading: true, data: null, status: null, err: null,
    });

    const postValues = {
      location_id: locId,
    };

    const payload = { uuid: detailData.uuid, token: detailData.token || surveyToken, values: postValues };

    const postData = new FormData();

    postData.append('values', JSON.stringify(payload.values));
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
      .then((response) => {
        setNext(true);
        setReviewerStore({
          loading: false, data: response.data.data, status: response.data.status, err: null,
        });
      })
      .catch((error) => {
        console.log(error);
        setReviewerStore({
          loading: false, data: null, status: false, err: error,
        });
      });
    // setNext(true);
  }

  useEffect(() => {
    if (surveyConfig && surveyConfig.data && surveyConfig.count > 0 && !auid) {
      const { data } = surveyConfig;
      const spaceExists = !auid && !data.is_show_all_spaces && data.category_type && data.category_type === 'ah' && data.location_ids && data.location_ids.length === 1;
      if (!data.requires_verification_by_otp && (data.has_reviwer_email === 'None' && data.has_reviwer_name === 'None' && data.has_reviwer_mobile === 'None' && data.has_employee_code === 'None' && data.has_tenant === 'None') && spaceExists) {
        storeLocation(data.location_ids[0].id);
      }
    }
  }, [surveyConfig, auid]);

  const handleReset = (setFieldValue) => {
    dispatch(storeSurveyToken(false));
    setPostedValues(false);
    setFieldValue('name', '');
    setFieldValue('mobile', '');
    setFieldValue('email', '');
    setFieldValue('employeeCode', '');
    setFieldValue('otp_code', '');
    setFieldValue('is_otp_verified', '');
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

  const isNormalSurvey = surveyConfig && surveyConfig.data && surveyConfig.count > 0 && detailData && detailData.stage_id && detailData.stage_id.name && (detailData.stage_id.name === 'Published');
  const isSSORequired = surveyConfig && surveyConfig.data && surveyConfig.count > 0 && detailData && detailData.is_sso_required;

  return (
    <Row className={`${isMobileView ? '' : 'mt-2'} ml-1 mr-1 mb-2 p-3 external-link-tickets`}>
      {accid && isSSORequired && !isSSOVerified && ((auid && !isCompleted && isNotExpired && isNormalSurvey && (reviewConfig && !reviewConfig.loading)) || (!auid && isNormalSurvey)) && (
      <SSOValidation
        accid={accid}
        setApprove={setSSOVerified}
        opLogo={checklistSurvey}
        companyName={detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
        companyLogo={detailData.company && detailData.company.logo ? detailData.company.logo : false}
        title={detailData.title}
        description={detailData.description}
      />
      )}
      {((accid && isSSORequired && isSSOVerified) || (!isSSORequired) || !accid) && ((auid && !isCompleted && isNotExpired && isNormalSurvey && (reviewConfig && !reviewConfig.loading)) || (!auid && isNormalSurvey)) && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <>
          <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="7" lg="8" xs="7">
                <h4 className="mb-1 mt-0 font-family-tab">
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="3" lg="2" xs="3">
                {detailData.company && detailData.company.logo && (
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="70"
                  height="auto"
                  className="d-inline-block align-top pr-2 imaget-custom-responsive"
                  alt="Helixsense Portal"
                />
                )}
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
                    <h6 className="mb-0 mt-1 text-break font-family-tab">
                      {detailData.title}
                    </h6>
                  )
                  : (
                    <h5 className="mb-0 font-family-tab">
                      {detailData.title}
                    </h5>
                  )}
                <p className="text-muted mt-0 mb-0 font-weight-400 font-family-tab">
                  {detailData.description}
                </p>
              </Col>
            </Row>
          </CardBody>
          {!reviewerStore.loading && !isNext && (
          <Formik
            initialValues={postedValues || formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, dirty, setFieldValue, resetForm,
            }) => (
              <Form id={formId}>
                <FormControl className="mb-5 w-100">
                  <ThemeProvider theme={theme}>
                    <BasicForm lid={lid || false} accid={accid} uuid={uuid} setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
                  </ThemeProvider>
                </FormControl>
                <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
                <Box sx={{ float: 'right' }}>
                  <Button
                    type="button"
                    onClick={() => handleReset(setFieldValue)}
                    variant="contained btn-cancel"
                    className="mr-2"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    disabled={!(isValid && dirty) || (reviewerStore.loading)}
                    type="submit"
                    variant="contained"
                  >
                    <span className="mr-2 ml-2">Start</span>
                  </Button>
                </Box>
                {(isValid && dirty) && reviewerStore && reviewerStore.err && (
                <p className="text-danger font-family-tab">Oops! Something went wrong..</p>
                )}
              </Form>
            )}
          </Formik>
          )}
          {reviewerStore && reviewerStore.loading && (
          <DetailViewFormat detailResponse={reviewerStore} />
          )}
          {isNext && (
          <Survey
            onNext={() => {
              setNext(false); setSurveyAnswer({
                loading: false, data: null, err: null,
              });
            }}
            accid={accid}
            clearForm={() => setPostedValues(false)}
            detailData={detailData}
            auid={auid}
            ruuid={false}
            type={false}
            lastAnswer={lastAnswer}
          />
          )}
        </>
      </Col>
      )}
      {surveyConfig && surveyConfig.data && !surveyConfig.count && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger font-family-tab">Oops! Your request is invalid</h4>
          </div>
        </Col>
      )}
      {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && auid && !isNotExpired && !isCompleted && (reviewConfig && !reviewConfig.loading) && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger font-family-tab">{detailData && detailData.deadline_elapsed ? detailData.deadline_elapsed : 'Oops! This survey has expired.'}</h4>
        </div>
      </Col>
      )}
      {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && auid && isCompleted && (reviewConfig && !reviewConfig.loading) && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger font-family-tab">{detailData && detailData.answered_already ? detailData.answered_already : 'Thank you. You have responded already.'}</h4>
          </div>
        </Col>
      )}
      {detailData && detailData.stage_id && detailData.stage_id.name && (detailData.stage_id.name !== 'Published') && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger font-family-tab">
              Oops! Your request is
              {'  '}
              {detailData.stage_id.name}
            </h4>
          </div>
        </Col>
      )}
      {((surveyConfig && surveyConfig.loading) || (surveyConfig && surveyConfig.err)) && (
      <DetailViewFormat detailResponse={surveyConfig} />
      )}
      {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && ((reviewConfig && reviewConfig.loading) || (reviewConfig && reviewConfig.err)) && (
      <DetailViewFormat detailResponse={reviewConfig} />
      )}
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
