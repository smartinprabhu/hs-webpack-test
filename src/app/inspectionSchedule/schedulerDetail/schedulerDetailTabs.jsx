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

import SchedulerBasicDetails from './schedulerBasicDetails/schedulerBasicDetails';
import ScheduleOptions from './schedulerBasicDetails/scheduleOptions';

import tabs from './tabs.json';
import { generateErrorMessage } from '../../util/appUtils';

const { TabPane } = Tabs;
const SchedulerDetailTabs = (props) => {
  const { detailData } = props;
  const [currentTab, setActive] = useState('Inspection Overview');

  useEffect(() => {
    setActive('Inspection Overview');
  }, [detailData]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pr-0 pl-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pr-1 pl-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Inspection Overview'
                ? <SchedulerBasicDetails detailData={detailData} />
                : ''}
              {currentTab === 'Options'
                ? <ScheduleOptions detailData={detailData} />
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

SchedulerDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default SchedulerDetailTabs;
