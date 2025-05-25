/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Handle } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';

import './style.css';

const CustomNode = ({ data }) => {
  const path = window.location.pathname.split('?')[1];
  const curModule = window.location.hash.split('#')[1];
  const { themes } = useTheme();

  // Combined styles with display: flex
  const combinedStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...data.style,
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
          <p style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{data.text}</p>
          <Link to={`/water-sld?sid=${data.mainEnergyMeter.id}&text=${encodeURIComponent(data.mainEnergyMeter.text)}#${curModule}`}>
            <div className="in-flow-box">
              <p className="react-flow-description" style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                {data.mainEnergyMeter.text}
              </p>
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
          <p className="font-weight-800" style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
            {data.text}
          </p>
        </div>
      )}

      {/* Render the energy meters if available */}
      {data.energyMeters && data.energyMeters.length > 0 ? (
        <div className="flow-in-box-group">
          {data.energyMeters.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                margin: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '6px',
                padding: '6px',
                wordBreak: 'break-word',
              }}
            >
              <Link to={`/water-sld?sid=${item.id}&text=${encodeURIComponent(item.text)}#${curModule}`}>
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
                <div style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{item.text}</div>
              </Link>
            </div>
          ))}
        </div>
      ) : data.imageUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {data.energyMeter && data.energyMeter.id ? (
            <Link to={`/water-sld?sid=${data.energyMeter.id}&text=${encodeURIComponent(data.text)}#${curModule}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{data.text}</div>
            </Link>
          ) : (
            <>
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{data.text}</div>
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