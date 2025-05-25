/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import StatisticCard from '../utils/StatisticCard';
import StatisticCardNumberFirst from '../utils/StatisticCardNumberFirst';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const PreventiveMaintenanceCards = ({ dateRange, data }) => {
  const dailyItems = data.filter((item) => item.frequency === 'Daily')
    .length;
  const weeklyItems = data.filter((item) => item.frequency === 'Weekly')
    .length;
  const monthlyItems = data.filter(
    (item) => item.frequency === 'Monthly',
  ).length;
  const delayedItems = data.filter((item) => item.status === 'Delayed')
    .length;
  return (
    <Row gutter={8}>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="Daily"
          value={dailyItems}
          total={data.length}
          showPercentage
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="Weekly"
          value={weeklyItems}
          total={data.length}
          showPercentage
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCard
          title="Monthly"
          value={monthlyItems}
          total={data.length}
          showPercentage
        />
      </Col>
      <Col sm={6} xs={24} className="text-center px-3">
        <StatisticCardNumberFirst title="Delayed" value={delayedItems} />
      </Col>
    </Row>
  );
};

export default PreventiveMaintenanceCards;
