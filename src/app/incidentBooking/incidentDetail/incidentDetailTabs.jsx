/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';

import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import tabs from './tabs.json';
import { generateErrorMessage, getListOfModuleOperations } from '../../util/appUtils';
import AuditLog from '../../assets/assetDetails/auditLog';
import LogNotes from './logNotes';
import AuditBasicDetails from './additionalDetails/auditBasicDetails';
import Summary from './basicDetails/summary';
import Tasks from './tasks';
import Documents from '../../helpdesk/viewTicket/documents';
import Injuries from './injuries';
import Checklists from './checklists';
import actionCodes from '../data/actionCodes.json';
import CorrectiveAction from './correctiveAction';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const IncidentDetailTabs = (props) => {
  const { detailData } = props;
  const [currentTab, setActive] = useState('Summary');

  const [tabsList, setTabsList] = useState(tabs.tabsList);

  const {
    hxIncidentConfig,
  } = useSelector((state) => state.hxIncident);

  const { userRoles } = useSelector((state) => state.user);

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';

  const changeTab = (key) => {
    setActive(key);
  };

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HX Incident Report', 'code');

  const isOtherInfo = allowedOperations.includes(actionCodes['Other Info']);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  useEffect(() => {
    if (detail) {
      if (detail.state === 'Reported' || detail.state === 'Acknowledged' || detail.state === 'Work in Progress') {
        setTabsList(tabs.tabsList.filter((item) => item.name !== 'Recommendations' && item.name !== 'Validation'));
        if (detail.state === 'Reported' && configData.is_acknowledge_required) {
          setTabsList(tabs.tabsList.filter((item) => item.name !== 'RCFA' && item.name !== 'Recommendations' && item.name !== 'Validation'));
        }
      } else if (detail.state === 'Analyzed' || detail.state === 'Remediated') {
        setTabsList(tabs.tabsList.filter((item) => item.name !== 'Validation'));
        if (!detail.probability_id.is_analysis_required) {
          setTabsList(tabs.tabsList.filter((item) => item.name !== 'Recommendations' && item.name !== 'Validation'));
        }
      } else if (detail.state === 'Resolved' && (!configData.is_validation_required || !(detail.validate_checklist_ids && detail.validate_checklist_ids.length))) {
        setTabsList(tabs.tabsList.filter((item) => item.name !== 'Validation'));
        if (!detail.probability_id.is_analysis_required) {
          setTabsList(tabs.tabsList.filter((item) => item.name !== 'Recommendations' && item.name !== 'Validation'));
        }
      } else if ((detail.state === 'Validated' || detail.state === 'Signed off' || detail.state === 'Paused' || detail.state === 'Cancelled') && !detail.probability_id.is_analysis_required) {
        setTabsList(tabs.tabsList.filter((item) => item.name !== 'Recommendations'));
        if (!configData.is_validation_required || !(detail.validate_checklist_ids && detail.validate_checklist_ids.length)) {
          setTabsList(tabs.tabsList.filter((item) => item.name !== 'Recommendations' && item.name !== 'Validation'));
        }
      } else {
        setTabsList(tabs.tabsList);
      }
    }
  }, [detailData, hxIncidentConfig]);

  useEffect(() => {
    if (!isOtherInfo) {
      setTabsList(tabsList.filter((item) => item.name !== 'Other Info'));
    } else {
      setTabsList(tabsList);
    }
  }, [userRoles]);

  useEffect(() => {
    if (detail) {
      if ((detail.state === 'Reported' && !configData.is_acknowledge_required) || detail.state === 'Acknowledged') {
        setActive('RCFA');
      } else if ((detail.state === 'Analyzed' || detail.state === 'Remediated') && detail.probability_id.is_analysis_required) {
        setActive('Recommendations');
      } else if (detail.state === 'Resolved' && configData.is_validation_required && detail.validate_checklist_ids && detail.validate_checklist_ids.length) {
        setActive('Validation');
      } else {
        setActive('Summary');
      }
    }
  }, [detailData, hxIncidentConfig]);

  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0 pt-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs activeKey={currentTab} onChange={changeTab}>
              {tabsList && tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Summary'
                ? (
                  <Summary detailData={detail} />
                )
                : ''}
              {currentTab === 'RCFA'
                ? (
                  <>
                    <CorrectiveAction detailData={detail} />
                    {detail && detail.probability_id.is_analysis_required && (
                    <>
                      <Checklists orderCheckLists={detail.analysis_checklist_ids} type="initial" />
                      <br />
                      <Injuries />
                    </>
                    )}
                  </>
                )
                : ''}
              {currentTab === 'Validation'
                ? (
                  <Checklists orderCheckLists={detail.validate_checklist_ids} type="validate" />
                )
                : ''}
              {currentTab === 'Recommendations'
                ? (
                  <Tasks />
                )
                : ''}
              {currentTab === 'Attachments'
                ? (
                  <Documents
                    viewId={detail.id}
                    ticketNumber={detail.name}
                    resModel={appModels.HXINCIDENT}
                    model={appModels.DOCUMENT}
                  />
                )
                : ''}
              {currentTab === 'Other Info'
                ? (
                  <>
                    <AuditBasicDetails detailData={detail} />
                    <Card className="h-100">
                      <p className="ml-3 mb-0 mt-2 font-weight-600 text-pale-sky font-size-13">STATUS LOGS</p>
                      <CardBody className="p-0">
                        <LogNotes />
                        <div className="mt-3 mb-3" />
                        <AuditLog ids={detail.message_ids} />
                      </CardBody>
                    </Card>
                  </>
                )
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
      {detailData && detailData.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(detailData && detailData.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(detailData)} />
      </CardBody>
      )}
    </Card>
  );
};

IncidentDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default IncidentDetailTabs;
