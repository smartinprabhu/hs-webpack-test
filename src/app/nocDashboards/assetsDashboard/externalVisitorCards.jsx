/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'antd';
import StatisticCardNumberFirst from '../utils/StatisticCardNumberFirst';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const ExternalVisitorCards = ({ dateRange, data }) => {
  const scheduled = data.filter((item) => item.status === 'Scheduled')
    .length;
  const currentInside = data.filter(
    (item) => item.status === 'Currently Inside',
  ).length;
  const avgExtendedHours = data.reduce((a, b) => a + b.extended_hrs, 0) / data.length;

  return (
    <Row>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="Scheduled" value={scheduled} />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst
          title="Currently Inside"
          value={currentInside}
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst
          title="Extended Hrs"
          value={(Math.round(avgExtendedHours * 100) / 100).toFixed(2)}
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst
          title="Approved By"
          value={0}
        />
      </Col>
    </Row>
  );
};

export default ExternalVisitorCards;
