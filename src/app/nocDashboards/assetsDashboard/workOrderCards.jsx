/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, {  } from 'react';
import { Row, Col } from 'antd';
import StatisticCard from '../utils/StatisticCard';
import '../dashboard.scss';


const WorkOrderCards = ({ data }) => {
  const scheduledItems = data.filter((item) => item.code && item.code === 'SCH');

  const scheduled = scheduledItems && scheduledItems.length ? scheduledItems[0].datasets[0] : 0;

  const notAssignedItems = data.filter((item) => item.code && item.code === 'NA');

  const not_assigned = notAssignedItems && notAssignedItems.length ? notAssignedItems[0].datasets[0] : 0;

  const expired = 3;
  const soon_to_expire = 8;

  return (
    <Row>
      <Col sm={4} xs={24} className="text-center">
        <StatisticCard title="Scheduled" value={scheduled} />
      </Col>
      <Col sm={4} xs={24} className="text-center">
        <StatisticCard title="Not Assigned" value={not_assigned} />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCard title="SLA About To Expire" value={soon_to_expire} />
      </Col>
      <Col sm={8} xs={24} className="text-center px-3">
        <StatisticCard title="SLA Expired" value={expired} />
      </Col>
    </Row>
  );
};

export default WorkOrderCards;
