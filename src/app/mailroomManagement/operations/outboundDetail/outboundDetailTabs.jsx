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

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import AuditLog from '../../../assets/assetDetails/auditLog';

import OutboundBasicDetails from './outboundBasicDetails/SchedulerBasicDetails';

import tabs from './tabs.json';
import { generateErrorMessage } from '../../../util/appUtils';

const { TabPane } = Tabs;
const OutboundDetailTabs = (props) => {
  const { detailData } = props;
  const [currentTab, setActive] = useState('Outbound Mail Overview');

  useEffect(() => {
    setActive('Outbound Mail Overview');
  }, [detailData]);

  const changeTab = (key) => {
    setActive(key);
  };

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  
  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Outbound Mail Overview'
                ? <OutboundBasicDetails detailData={detailData} />
                : ''}
              {currentTab === 'History'
                ? <AuditLog ids={detail.message_ids} />
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

OutboundDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default OutboundDetailTabs;
