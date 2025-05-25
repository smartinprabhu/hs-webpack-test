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
import ProductsAdjustments from './productsAdjustments';

const { TabPane } = Tabs;
const AdjustmentDetailTabs = () => {
  const [currentTab, setActive] = useState('Inventory Details');

  const changeTab = (key) => {
    setActive(key);
  };
  const { adjustmentDetail } = useSelector((state) => state.inventory);

  function checkAllowed(name, state) {
    let result = true;
    if (name === 'Inventory Adjustments' && state !== 'done') {
      result = false;
    }
    return result;
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {tabs && tabs.tabsList.map((tabData) => (
                      checkAllowed(tabData.name, adjustmentDetail.data[0].state ? adjustmentDetail.data[0].state : '')
                        && (
                          <TabPane tab={tabData.name} key={tabData.name} />
                        )
                    ))}
                  </Tabs>
                  {currentTab === 'Inventory Details'
                    ? <Products />
                    : ''}
                  {currentTab === 'Inventory Adjustments'
                    ? <ProductsAdjustments />
                    : ''}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
          <DetailViewFormat detailResponse={adjustmentDetail} />
        </Card>
      </Col>
    </Row>
  );
};

export default AdjustmentDetailTabs;
