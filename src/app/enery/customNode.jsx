/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Handle } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './style.css';

const CustomNode = ({ data }) => {
  const path = window.location.pathname.split('?')[1];
  const curModule = window.location.hash.split('#')[1];

  // Combined styles with display: flex
  const combinedStyles = {
    display: 'flex',
    flexDirection: 'column', // Corrected property name
    alignItems: 'center',
    ...data.style, // Assuming data.style is an object
  };

  const { energyMetersInfo } = useSelector((state) => state.ticket);

  // Memoized function to find the status
  const findStatus = useMemo(() => {
    if (!energyMetersInfo?.data) return () => '';
    return (id) => {
      const foundItem = energyMetersInfo.data.find((item) => item.device_id === id);
      return foundItem ? foundItem.active_status : '';
    };
  }, [energyMetersInfo]);

  // Helper function for status-based classes
  const getStatusClass = (status) => (status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'gray');

  return (
    <div style={combinedStyles}>
      {/* Render the main energy meter if available */}
      {data.mainEnergyMeter && (
      <div
        className={`blinking-dot ${getStatusClass(findStatus(data.mainEnergyMeter.id))}`}
      />
      )}
      {data.energyMeter && (
        <div
          className={`blinking-dot ${getStatusClass(findStatus(data.energyMeter.id))}`}
        />
      )}
      {data.mainEnergyMeter && (
        <div className="flow-in-box1">
          <p>{data.text}</p>
          <Link to={`/energy-meter?sid=${data.mainEnergyMeter.id}&text=${encodeURIComponent(data.mainEnergyMeter.text)}#${curModule}`}>
            <div className="in-flow-box">
              <p className="react-flow-description">{data.mainEnergyMeter.text}</p>
              <img
                className="flow-in-img"
                src={data.mainEnergyMeter.imageUrl}
                alt={data.mainEnergyMeter.text}
              />
            </div>
          </Link>
        </div>
      )}
      {!data.mainEnergyMeter && data.description && (
        <div className="flow-in-box2">
          <p className="font-weight-800">{data.text}</p>
        </div>
      )}

      {/* Render the energy meters if available */}
      {data.energyMeters && data.energyMeters.length > 0 ? (
        <div className="flow-in-box-group">
          {data.energyMeters.map((item) => (
            <div
              key={item.id}
              style={data.energyMeters.length > 1 ? {
                width: 'calc(22% - 5px)',
                margin: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #707070',
                borderRadius: '6px',
                padding: '6px',
                wordBreak: 'break-word',
              } : {}}
            >
              <Link to={`/energy-meter?sid=${item.id}&text=${encodeURIComponent(item.text)}#${curModule}`}>
                {item.id && (
                <div
                  className={`blinking-dot-single ${getStatusClass(findStatus(item.id))}`}
                />
                )}
                <img
                  src={item.imageUrl}
                  alt={`${item.text} node`}
                  style={{ width: '35px', height: '35px' }}
                />
                <div style={{ color: 'black' }}>{item.text}</div>
              </Link>
            </div>
          ))}
        </div>
      ) : data.imageUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {data.energyMeter && data.energyMeter.id ? (
            <Link to={`/energy-meter?sid=${data.energyMeter.id}&text=${encodeURIComponent(data.text)}#${curModule}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={{ color: 'black' }}>{data.text}</div>
            </Link>
          ) : (
            <>
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={{ color: 'black' }}>{data.text}</div>
            </>
          )}
        </div>
      ) : null}

      {/* Render handles */}
      {data.handlers
        && data.handlers.map((handler) => (
          <Handle
            key={handler.handle.handleId}
            type={handler.handle.type}
            position={handler.handle.position}
            id={handler.handle.handleId}
            className={handler.handle.className}
          />
        ))}
    </div>
  );
};

export default CustomNode;
