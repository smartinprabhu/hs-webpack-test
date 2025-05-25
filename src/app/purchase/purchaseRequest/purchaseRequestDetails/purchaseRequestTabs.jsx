/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
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
import { generateErrorMessage } from '../../../util/appUtils';
import Products from './products';
import AuditLog from '../../../assets/assetDetails/auditLog';
import LogNotes from '../../../assets/assetDetails/logNotes';
import ScheduleActivities from '../../../assets/assetDetails/scheduleActivities';

const appModels = require('../../../util/appModels').default;

const { TabPane } = Tabs;
const PurchaseRequestTabs = () => {
  const [currentTab, setActive] = useState('Products');

  const changeTab = (key) => {
    setActive(key);
  };
  const { requestDetails } = useSelector((state) => state.purchase);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {requestDetails && (requestDetails.data && requestDetails.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {tabs && tabs.tabsList.map((tabData) => (
                      <TabPane tab={tabData.name} key={tabData.name} />
                    ))}
                  </Tabs>
                  {currentTab === 'Products'
                    ? <Products />
                    : ''}
                  {currentTab === 'Audit Logs'
                    ? <AuditLog ids={requestDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Log Note'
                    ? <LogNotes ids={requestDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Schedule Activity'
                    ? <ScheduleActivities resModalName={appModels.PARTNER} resId={requestDetails.data[0].id} />
                    : ''}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
          {requestDetails && requestDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {(requestDetails && requestDetails.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(requestDetails)} />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default PurchaseRequestTabs;
