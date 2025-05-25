import React from 'react';
import './style.css';

const GroupNode = ({ data }) => {
  const { children = [] } = data || {};

  console.log(data);

  return (
    <div style={{ border: '1px solid black', padding: '10px' }}>
      <div>
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.id}>
              {child.data?.text || 'No text available'}
            </div>
          ))
        ) : (
          <p>No child nodes available.</p>
        )}
      </div>
    </div>
  );
};

export default GroupNode;
