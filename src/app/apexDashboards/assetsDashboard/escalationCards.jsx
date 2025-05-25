/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col } from 'antd';
import StatisticCard from '../utils/StatisticCardNumberFirst';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const EscalationCards = ({ dateRange, data }) => {
  const e1Items = data.filter((item) => item.code && item.code === 'EL1');

  const escalatedL1 = e1Items && e1Items.length ? e1Items[0].datasets[0] : 0;

  const e2Items = data.filter((item) => item.code && item.code === 'EL2');

  const escalatedL2 = e2Items && e2Items.length ? e2Items[0].datasets[0] : 0;

  const e3Items = data.filter((item) => item.code && item.code === 'EL3');

  const escalatedL3 = e3Items && e3Items.length ? e3Items[0].datasets[0] : 0;

  return (
    <Row>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCard title="Escalated L1" value={escalatedL1} />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCard title="Escalated L2" value={escalatedL2} />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCard title="Escalated L3" value={escalatedL3} />
      </Col>
    </Row>
  );
};

export default EscalationCards;
