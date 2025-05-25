/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
  Alert,
} from 'reactstrap';
import Button from '@mui/material/Button';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Markup } from 'interweave';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle, faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'antd';

import DetailViewFormat from '@shared/detailViewFormat';

import checklistSurvey from '@images/icons/checklistSurvey.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import Survey from './survey';
import AuthService from '../util/authService';
import {
  detectMob, getAccountIdFromUrl, truncateFrontSlashs, truncateStars, getLocalDateCustom, getLocalDateDBFormat,
} from '../util/appUtils';
import AuditBasicDetails from './auditBasicDetails/auditBasicDetails';
import { getStateText } from '../auditSystem/utils/utils';
import ImproveOpportunities from './improveOpportunities';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';

const appConfig = require('../config/appConfig').default;
const appModels = require('../util/appModels').default;

const { Panel } = Collapse;

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);

  const [isSurvey, setSurvey] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [surveyConfig, setSurveyConfig] = useState({ loading: false, data: null, err: null });
  const [showOppor, setShowOppor] = useState(true);
  const [answersList, setAnswers] = useState([]);

  const Opportunities = window.localStorage.getItem('opportunities') ? JSON.parse(window.localStorage.getItem('opportunities')) : [];

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const isMobileView = detectMob();

  const detailData = surveyConfig && surveyConfig.data && surveyConfig.data.length ? surveyConfig.data[0] : '';

  const auditData = detailData && detailData.audit_system_id ? detailData.audit_system_id : false;

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
      setSurveyConfig({
        loading: true, data: null, count: 0, err: null,
      });
      // eslint-disable-next-line max-len
      const fields = '["id","name","date","uuid","reference","state","auditor_designation","auditor_contact","auditor_email","facility_manager_contact","facility_manager_email",("sys_auditor_id", ["id", "name"]),("facility_manager_id", ["id", "name"]),("space_id", ["id", "name", "path_name"]),("audit_system_id", ["id", "description","requires_verification_by_otp","has_reviwer_email","has_reviwer_name","has_reviwer_mobile","feedback_text","survey_time","uuid",("company_id", ["id", "name"]),["page_ids", ["id", "title", ["question_ids", ["id","sequence","question","type","max_score","constr_mandatory","comments_allowed","comments_message","has_attachment","constr_error_msg","validation_required","validation_length_min","validation_min_date","validation_max_date","validation_min_float_value","validation_max_float_value","validation_length_max","validation_error_msg",["labels_ids", ["id","is_ncr","value","favicon","color","emoji","quizz_mark"]]]]]]])]';
      const payload = `domain=[["uuid","=","${uuid}"]]&model=${appModels.SYSTEMAUDIT}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
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

  const getAnswers = () => {
    if (detailData && detailData.id) {
      setAnswers([]);
      const fields = '["id"]';
      const payload = `domain=[["audit_id","=",${detailData.id}],["state","=","done"]]&model=audit_survey.user_input&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => {
          if (response.data.data) {
            setAnswers(response.data.data);
          }
        })
        .catch((error) => {
          setAnswers([]);
        });
    }
  };

  useEffect(() => {
    if (surveyConfig && surveyConfig.data && surveyConfig.count > 0 && auditData) {
      getAnswers();
    }
  }, [surveyConfig]);

  const startAudit = () => {
    if (detailData.uuid) {
      setSurvey(true);
      const payload = { uuid: detailData.uuid };

      const postData = new FormData();
      postData.append('uuid', payload.uuid);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Audit/Status`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            console.log(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const genExtra = () => (
    <FontAwesomeIcon className="mr-1 ml-1" size="sm" icon={showBulkAdd ? faMinusCircle : faPlusCircle} />
  );

  const targeDate = detailData && detailData.date ? getLocalDateCustom(detailData.date, 'YYYY-MM-DD') : false;

  const isNotExpired = targeDate && getLocalDateDBFormat(new Date()) === targeDate;

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
      {surveyConfig && surveyConfig.data && surveyConfig.count > 0 && detailData && detailData.state
        && (detailData.state === 'new' || (detailData.state === 'open' && !answersList.length)) && (
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
              {isSurvey && showOppor && (
              <div className="mt-3 mb-2">
                <Collapse activeKey={showBulkAdd ? ['1'] : '2'} onChange={() => setShowBulkAdd(!showBulkAdd)}>
                  <Panel showArrow={false} header={`Opportunities - (${Opportunities && Opportunities.length ? Opportunities.length : 0})`} key="1" extra={genExtra()}>
                    {showBulkAdd && (
                      <ImproveOpportunities onHide={() => setShowBulkAdd(false)} />
                    )}
                  </Panel>
                </Collapse>
              </div>
              )}
              {!isSurvey && (
                <>
                  <div className="mt-2">
                    <AuditBasicDetails detailData={detailData} />
                  </div>
                  <hr className="mt-0" />
                  <Row>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <h6>Instructions</h6>
                      <Alert color="info">
                        <Markup content={truncateFrontSlashs(truncateStars(auditData.description))} />
                      </Alert>
                    </Col>
                  </Row>
                  <hr className="mt-0" />
                  <div className="text-center">
                    {!isNotExpired && (
                    <p className="text-danger m-0">
                      You can perform the audit only on
                      {' '}
                      {moment.utc(detailData.date).local().format('MM/DD/YYYY hh:mm A')}
                      . Please contact Facility Manager for more information.
                    </p>
                    )}
                    <Button
                      type="button"
                      size="md"
                      className="rounded-pill"
                      disabled={!isNotExpired}
                      onClick={() => startAudit()}
                       variant="contained"
                    >
                      <span>Perform Audit</span>
                    </Button>
                  </div>
                </>
              )}
              {isSurvey && (
                <Survey accid={accid} onNext={() => setShowOppor(false)} detailData={auditData} auditData={detailData} ruuid={false} type={false} />
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
      {detailData && detailData.state && detailData.state !== 'new' && answersList.length > 0 && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">
              Oops! Your request is
              {'  '}
              {getStateText(detailData.state)}
            </h4>
          </div>
        </Col>
      )}
      <DetailViewFormat detailResponse={surveyConfig} />
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
