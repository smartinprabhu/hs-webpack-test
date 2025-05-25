import React from 'react';
import './style.css';

const GroupNodes = ({ node, nodes }) => {
  const childNodes = nodes.filter((n) => n.data.parent === node.id);

  console.log(childNodes);
  console.log(nodes);

  return (
    <div key={node.id} style={{ position: 'absolute', top: node.position.y, left: node.position.x }}>
      <div style={{ padding: '10px', border: '1px solid black', borderRadius: '4px' }}>
        {node.data.text}
      </div>
      {childNodes.map((child) => (
        <div key={child.id} style={{ position: 'absolute', top: 20, left: 20 }}>
          <div style={{ padding: '5px', border: '1px solid gray', borderRadius: '4px' }}>
            {child.data.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupNodes;
