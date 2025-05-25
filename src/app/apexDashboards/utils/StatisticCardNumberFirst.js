import React from 'react';

const StatisticCardNumberFirst = ({ title, value }) => (
  <div className="text-center">
    <div className="font-size-24">{value}</div>
    <div className="font-size-12 font-weight-normal">{title}</div>
  </div>
);

export default StatisticCardNumberFirst;
