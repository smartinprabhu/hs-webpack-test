/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import tabs from './tabs.json';
import Documents from '../../helpdesk/viewTicket/documents';
import Comments from './comments';
import AuditLog from '../../assets/assetDetails/auditLog';
import { generateErrorMessage } from '../../util/appUtils';
import BreakdownBasicInfo from './breakdownBasicInfo';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const ComplianceDetailTabs = () => {
  const [currentTab, setActive] = useState('Breakdown Overview');

  const { trackerDetails } = useSelector((state) => state.breakdowntracker);

  useEffect(() => {
    setActive('Breakdown Overview');
  }, [trackerDetails]);
  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) && (
        <CardBody className="pl-0 pr-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'Breakdown Overview'
                  ? <BreakdownBasicInfo detailData={trackerDetails} />
                  : ''}
                {currentTab === 'Attachments'
                  ? (
                    <Documents
                      viewId={trackerDetails.data[0].id}
                      ticketNumber={trackerDetails.data[0].name ? trackerDetails.data[0].name : ''}
                      resModel={appModels.BREAKDOWNTRACKER}
                      model={appModels.DOCUMENT}
                    />
                  )
                  : ''}
                {currentTab === 'Notes'
                  ? (
                    <>
                      <Comments />
                      <AuditLog ids={trackerDetails.data[0].message_ids} />
                    </>
                  )
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
      )}
      {trackerDetails && trackerDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(trackerDetails && trackerDetails.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(trackerDetails)} />
        </CardBody>
      )}
    </Card>
  );
};

export default ComplianceDetailTabs;
