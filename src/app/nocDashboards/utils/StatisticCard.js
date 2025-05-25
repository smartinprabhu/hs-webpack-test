import React from 'react';

const StatisticCard = ({
  title, value, total, showPercentage = false,
}) => (
  <div className="text-center">
    <div>{title}</div>
    <div className="font-size-24">{value}</div>
    {showPercentage && (
      <div>
        {Math.round((value * 10000) / total) / 100.0}
        %
      </div>
    )}
  </div>
);

export default StatisticCard;
