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
import AuditLog from '../../../../assets/assetDetails/auditLog';
import Comments from './comments';
import Products from './products';
import LogNotes from '../../../../assets/assetDetails/logNotes';
import ScheduleActivities from '../../../../assets/assetDetails/scheduleActivities';

import tabs from './tabs.json';
import { generateErrorMessage } from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const { TabPane } = Tabs;
const ReceivedProductsTabs = () => {
  const [currentTab, setActive] = useState('Products');

  const changeTab = (key) => {
    setActive(key);
  };
  const { transferDetails } = useSelector((state) => state.purchase);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
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
                    ? <AuditLog ids={transferDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Comments'
                    ? <Comments />
                    : ''}
                  {currentTab === 'Log Note'
                    ? <LogNotes ids={transferDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Schedule Activity'
                    ? <ScheduleActivities resModalName={appModels.STOCK} resId={transferDetails.data[0].id} />
                    : ''}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
          {transferDetails && transferDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {(transferDetails && transferDetails.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(transferDetails)} />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ReceivedProductsTabs;
