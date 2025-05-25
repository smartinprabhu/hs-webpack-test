import React from 'react';
import './Card.css';

const Card = ({ children, doubleSize, className }) => (
  <div className={doubleSize ? `card-responsive card-extand-responsive ${className}` : `card-responsive ${className}`}>
    {children}
  </div>
);

export default Card;
