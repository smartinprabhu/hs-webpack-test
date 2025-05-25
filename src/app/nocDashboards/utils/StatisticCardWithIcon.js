import React from 'react';

const StatisticCardWithIcon = ({ icon, title, value }) => (
  <div className="text-center d-flex flex-column justify-content-center">
    <div className="align-self-start">{icon}</div>
    <div className="font-size-30">{value}</div>
    <div className="font-weight-normal">{title}</div>
  </div>
);

export default StatisticCardWithIcon;
