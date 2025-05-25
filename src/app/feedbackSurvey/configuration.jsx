/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';

import DetailViewFormat from '@shared/detailViewFormat';

import closeCircleRed from '@images/icons/closeCircleRed.svg';
import infoBlueIcon from '@images/icons/infoBlue.svg';
import { getTabName } from '../util/getDynamicClientData';
import {
  getLocalDateCustom,
  getAccountIdFromUrl,
} from '../util/appUtils';
import AuthService from '../util/authService';
import BasicFeedbackInfo from '../feedback/basicFeedbackInfo';

const appConfig = require('../config/appConfig').default;

const Configuration = (props) => {
  const { match } = props;
  const { params } = match;
  const {
    uuid, ruuid, type,
  } = params;

  const accid = getAccountIdFromUrl(props);

  const [feedbackConfig, setFeedbackConfig] = useState({ loading: false, data: null, err: null });

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const detailData = feedbackConfig && feedbackConfig.data ? feedbackConfig.data : '';

  const targeDate = detailData && detailData.survey && detailData.survey.feedback_expiry_date ? getLocalDateCustom(detailData.survey.feedback_expiry_date, 'YYYY-MM-DD HH:mm:ss') : false;

  const isNotExpired = targeDate ? new Date(targeDate) >= new Date() : false;

 document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setFeedbackConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const postValues = {
        c_uuid: uuid, ruuid, type,
      };

      const postData = new FormData();
      Object.keys(postValues).map((payloadObj) => {
        postData.append(payloadObj, postValues[payloadObj]);
        return postData;
      });

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/feedback`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setFeedbackConfig({
          loading: false, data: response.data.data, count: response.data.status, err: response.data.error,
        }))
        .catch((error) => {
          setFeedbackConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  return (
    <>
      {feedbackConfig && feedbackConfig.data && feedbackConfig.count > 0 && !detailData.feedback_status && isNotExpired && (
        <BasicFeedbackInfo uuid={detailData.survey.uuid} type={type} ruuid={ruuid} />
      )}

      <Row className="ml-1 mr-1 mt-2 mb-2 p-3">
        {feedbackConfig && feedbackConfig.data && !feedbackConfig.count && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">Oops! Your request is invalid</h4>
            </div>
          </Col>
        )}
        {detailData && !detailData.feedback_status && !isNotExpired && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">Oops! Your request was expired</h4>
          </div>
        </Col>
        )}
        {detailData && detailData.feedback_status && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={infoBlueIcon} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-info">
                Thank you. You have already completed the
                {'  '}
                {type}
                {'  '}
                questionnaire.
              </h4>
            </div>
          </Col>
        )}
        {feedbackConfig && feedbackConfig.loading && (
          <DetailViewFormat detailResponse={feedbackConfig} />
        )}
      </Row>
    </>
  );
};

Configuration.defaultProps = {
  match: false,
};

Configuration.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

export default Configuration;
