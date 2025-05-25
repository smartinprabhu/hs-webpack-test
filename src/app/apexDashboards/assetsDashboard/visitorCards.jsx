/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'antd';
import StatisticCardNumberFirst from '../utils/StatisticCardNumberFirst';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const VisitorCards = ({ dateRange, data }) => {
  const scheduled = data.filter((item) => item.status === 'Scheduled')
    .length;
  const currentInside = data.filter(
    (item) => item.status === 'Currently Inside',
  ).length;
  const canceled = data.filter((item) => item.status === 'Cancelled')
    .length;

  return (
    <Row>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="Scheduled" value={scheduled} />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst
          title="Currently Inside"
          value={currentInside}
        />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="Cancelled" value={canceled} />
      </Col>
    </Row>
  );
};

export default VisitorCards;
