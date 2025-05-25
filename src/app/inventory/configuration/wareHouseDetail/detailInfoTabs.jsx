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

import WarehouseBasicDetails from './warehouseBasicDetails';

import tabs from './tabs.json';
import { generateErrorMessage } from '../../../util/appUtils';

const { TabPane } = Tabs;
const WareHouseDetailTabs = (props) => {
  const { detail } = props;
  const [currentTab, setActive] = useState('WareHouse Overview');

  useEffect(() => {
    setActive('WareHouse Overview');
  }, [detail]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {detail && (detail.data && detail.data.length > 0) && (
      <CardBody className="pr-0 pl-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pr-1 pl-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'WareHouse Overview'
                ? <WarehouseBasicDetails detailData={detail} />
                : ''}
            </div>
          </Col>
        </Row>
      </CardBody>
      )}
      {detail && detail.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(detail && detail.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(detail)} />
      </CardBody>
      )}
    </Card>
  );
};

WareHouseDetailTabs.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default WareHouseDetailTabs;