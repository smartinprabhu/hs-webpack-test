/* eslint-disable import/no-unresolved */
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { Tabs } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Card, CardBody, Col,
  Row,
} from 'reactstrap';
import tabs from '../tabs.json';
import BasicDetails from './productBasicDetails/productBasicDetailsView';
import ProductReorderingRules from './productBasicDetails/productReorderingRules';
import { generateErrorMessage } from '../../../util/appUtils';

const { TabPane } = Tabs;

const detailTabsView = (props) => {
  const {
    detail,
  } = props;
  const [currentTab, setActive] = useState('Product Overview');

  const changeTab = (key) => {
    setActive(key);
  };

  useEffect(() => {
    setActive('Product Overview');
  }, [detail]);

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {detail && (detail.data && detail.data.length > 0) && (
        <CardBody className="pl-0 pr-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.detailstabs.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="thin-scrollbar">
                {currentTab === 'Product Overview'
                  ? <BasicDetails detailData={detail} />
                  : ''}
                {currentTab === 'Reordering Rules'
                  ? <ProductReorderingRules detailData={detail.data[0]} />
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
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

detailTabsView.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default detailTabsView;
