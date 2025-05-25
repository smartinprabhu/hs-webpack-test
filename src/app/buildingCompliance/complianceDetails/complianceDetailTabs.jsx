/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import tabs from './tabs.json';
import Documents from '../../helpdesk/viewTicket/documents';
import { generateErrorMessage, getArrayToCommaValues, getListOfModuleOperations } from '../../util/appUtils';
import Logs from './logs';
import actionCodes from '../data/complianceActionCodes.json';
import ComplianceEvidences from './complianceEvidences';
import ComplianceBasicDetails from './complianceBasicDetails';
import { getComplianceEvidence } from '../complianceService';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const ComplianceDetailTabs = () => {
  const dispatch = useDispatch();

  const [currentTab, setActive] = useState('Compliance Overview');
  const { complianceDetails } = useSelector((state) => state.compliance);
  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isCreateAllowed = allowedOperations.includes(actionCodes['Add Document']);
  const isDownloadAllowed = allowedOperations.includes(actionCodes['Download Document']);
  const isDeleteAllowed = allowedOperations.includes(actionCodes['Delete Document']);

  const ids = getArrayToCommaValues(complianceDetails && complianceDetails.data && complianceDetails.data[0].compliance_evidences_ids, 'id');

  useEffect(() => {
    if (ids) {
      dispatch(getComplianceEvidence(ids, appModels.COMPLIANCEEVIDENCES));
    }
  }, [ids, complianceDetails]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) && (
        <CardBody className="pl-0 pr-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'Compliance Overview'
                  ? <ComplianceBasicDetails detailData={complianceDetails} />
                  : ''}
                {currentTab === 'Compliance Evidences'
                  ? <ComplianceEvidences ids={getArrayToCommaValues(complianceDetails.data[0].compliance_evidences_ids, 'id')} />
                  : ''}
                {currentTab === 'Logs'
                  ? <Logs ids={getArrayToCommaValues(complianceDetails.data[0].compliance_log_ids, 'id')} />
                  : ''}
                {currentTab === 'Document References'
                  ? (
                    <Documents
                      viewId={complianceDetails.data[0].id}
                      ticketNumber={complianceDetails.data[0].name}
                      resModel={appModels.BULIDINGCOMPLIANCE}
                      model={appModels.DOCUMENT}
                      isModule
                      isCreateAllowed={isCreateAllowed}
                      isDownloadAllowed={isDownloadAllowed}
                      isDeleteAllowed={isDeleteAllowed}
                      complianceFormat
                    />
                  )
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
      )}
      {complianceDetails && complianceDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(complianceDetails && complianceDetails.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(complianceDetails)} />
        </CardBody>
      )}
    </Card>
  );
};

export default ComplianceDetailTabs;
