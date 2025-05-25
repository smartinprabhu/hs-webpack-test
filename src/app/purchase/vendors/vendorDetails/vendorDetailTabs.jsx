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
import Misc from './misc';
import Invoicing from './invoicing';
import SupportTicket from './supportTicket';
import InternalNotes from './internalNotes';
import Contacts from './contacts';
import AuditLog from '../../../assets/assetDetails/auditLog';
import LogNotes from '../../../assets/assetDetails/logNotes';
import ScheduleActivities from '../../../assets/assetDetails/scheduleActivities';
import SalesAndPurchase from './salesAndPurchases';

const appModels = require('../../../util/appModels').default;

const { TabPane } = Tabs;
const VendorDetailTabs = () => {
  const [currentTab, setActive] = useState('Sales & Purchases');

  const changeTab = (key) => {
    setActive(key);
  };
  const { vendorDetails } = useSelector((state) => state.purchase);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {tabs && tabs.tabsList.map((tabData) => (
                      <TabPane tab={tabData.name} key={tabData.name} />
                    ))}
                  </Tabs>
                  {currentTab === 'Misc'
                    ? <Misc />
                    : ''}
                  {currentTab === 'Invoicing'
                    ? <Invoicing ids={vendorDetails.data[0].bank_ids} />
                    : ''}
                  {currentTab === 'Support Ticket'
                    ? <SupportTicket />
                    : ''}
                  {currentTab === 'Audit Logs'
                    ? <AuditLog ids={vendorDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Log Note'
                    ? <LogNotes ids={vendorDetails.data[0].message_ids} />
                    : ''}
                  {currentTab === 'Schedule Activity'
                    ? <ScheduleActivities resModalName={appModels.PARTNER} resId={vendorDetails.data[0].id} />
                    : ''}
                  {currentTab === 'Internal Notes'
                    ? <InternalNotes />
                    : ''}
                  {currentTab === 'Contact & Addresses'
                    ? <Contacts ids={vendorDetails.data[0].child_ids} />
                    : ''}
                  {currentTab === 'Sales & Purchases'
                    ? <SalesAndPurchase />
                    : ''}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
          {vendorDetails && vendorDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {(vendorDetails && vendorDetails.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(vendorDetails)} />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default VendorDetailTabs;
