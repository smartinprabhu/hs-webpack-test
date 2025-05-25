import React from 'react';
import Card from '@mui/material/Card';

const ESGCard = () => (
  <Card className="ticket-card">
    <div
      style={{
        padding: `${width * 5}px`,
      }}
      className="ticket-info-outer-no-kpi"
      aria-hidden
    >
      <img
        src={co2Icon}
        alt="card-img"
        height={width * 30}
        width={width * 30}
      />
      <h1
        style={{
          fontSize: `${width * 8}px`,
        }}
        className="ticket-text"
      >
        Greenhouse Gas Emission
      </h1>
      <p
        style={{
          fontSize: `${width * 10}px`,
        }}
        className="ticket-count"
      >
        100
      </p>
    </div>
  </Card>
);

export default ESGCard;
