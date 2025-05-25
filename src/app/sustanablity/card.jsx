import React from 'react';
import './card.css';

const Card = ({ children, doubleSize, className }) => (
  <div
    className={`card-responsive ${doubleSize ? 'card-extend-responsive' : ''} ${className}`}
  >
    {children}
  </div>
);

export default Card;
