/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import { Tabs } from 'antd';

import tabs from './tabs.json';
import BasicDetail from './basicDetail';
import Checklists from './checklists';

const { TabPane } = Tabs;

const ViewTabs = (props) => {
  const {
    openWorkOrder,
  } = props;

  const [currentTab, setActive] = useState('Schedule Overview');

  const changeTab = (key) => {
    setActive(key);
  };
  const { ppmWeekInfo } = useSelector((state) => state.inspection);

  const inspDeata = ppmWeekInfo && ppmWeekInfo.data && ppmWeekInfo.data.data
  && ppmWeekInfo.data.data.length ? ppmWeekInfo.data.data[0] : false;

  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {inspDeata && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Schedule Overview'
                ? <BasicDetail detailData={inspDeata} openWorkOrder={openWorkOrder} />
                : ''}
              {currentTab === 'Checklists'
                ? <Checklists />
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
    </Card>
  );
};

ViewTabs.propTypes = {
  openWorkOrder: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};

export default ViewTabs;
