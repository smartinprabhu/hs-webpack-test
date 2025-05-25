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

import DetailViewFormat from '@shared/detailViewFormat';
import tabs from './tabs.json';
import Products from './products';

const { TabPane } = Tabs;
const ScrapDetailTabs = () => {
  const [currentTab, setActive] = useState('Product Moves');

  const changeTab = (key) => {
    setActive(key);
  };
  const { scrapDetail } = useSelector((state) => state.inventory);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {tabs && tabs.tabsList.map((tabData) => (
                      <TabPane tab={tabData.name} key={tabData.name} />
                    ))}
                  </Tabs>
                  {currentTab === 'Product Moves'
                    ? <Products />
                    : ''}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
          <DetailViewFormat detailResponse={scrapDetail} />
        </Card>
      </Col>
    </Row>
  );
};

export default ScrapDetailTabs;
