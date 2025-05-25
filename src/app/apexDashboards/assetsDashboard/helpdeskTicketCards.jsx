/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, {  } from 'react';
import { Row, Col } from 'antd';

import StatisticCard from '../utils/StatisticCard';
import StatisticCardNumberFirst from '../utils/StatisticCardNumberFirst';
import '../dashboard.scss';
import { getTotal } from '../../assets/utils/utils';

const dateFormat = 'MM/DD/YYYY';

const HelpdeskTicketCards = ({ dateRange, data }) => {
  const newTicketsItems = data.filter((item) => item.code && item.code === 'OT');

  const new_tickets = newTicketsItems && newTicketsItems.length ? newTicketsItems[0].datasets[0] : 0;

  const in_progress_tickets_items = data.filter((item) => item.code && item.code === 'IPT');

  const in_progress_tickets = in_progress_tickets_items && in_progress_tickets_items.length ? in_progress_tickets_items[0].datasets[0] : 0;

  const closed_tickets_items = data.filter((item) => item.code && item.code === 'CT');

  const closed_tickets = closed_tickets_items && closed_tickets_items.length ? closed_tickets_items[0].datasets[0] : 0;

  const withinSLA = 6;
  const elapsedSLA = 8;

  const total = getTotal(data || []);

  return (
    <Row gutter={8}>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="New"
          value={new_tickets}
          total={total}
          showPercentage
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="In Progress"
          value={in_progress_tickets}
          total={total}
          showPercentage
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="Closed"
          value={closed_tickets}
          total={total}
          showPercentage
        />
      </Col>
      <Col sm={3} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="within SLA" value={withinSLA} />
      </Col>
      <Col sm={3} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="SLA Elapsed" value={elapsedSLA} />
      </Col>
    </Row>
  );
};

export default HelpdeskTicketCards;
