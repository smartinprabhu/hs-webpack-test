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
import tabs from './tabs.json';
import Members from './members';
import Spaces from './spaces';
import TeamDetailInfo from './detailInfo';

// const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;

const TeamDetailTabs = (props) => {
  const {} = props;
  const [currentTab, setActive] = useState('General');

  const changeTab = (key) => {
    setActive(key);
  };
  const { teamDetail } = useSelector((state) => state.setup);

  return (

    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {teamDetail && (teamDetail.data && teamDetail.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-2 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'General'
                ? <TeamDetailInfo detail={teamDetail} />
                : ''}
              {currentTab === 'Team Members'
                ? <Members />
                : ''}
              {currentTab === 'Spaces'
                ? <Spaces />
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
      {teamDetail && teamDetail.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
    </Card>
  );
};
TeamDetailTabs.propTypes = {
};

TeamDetailTabs.defaultProps = {
  isITAsset: false,
};
export default TeamDetailTabs;
