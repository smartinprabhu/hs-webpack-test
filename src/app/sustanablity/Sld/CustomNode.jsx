/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { Handle } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '../../ThemeContext';
import { storeSldData } from '../../analytics/analytics.service';

import './style.css';

const CustomNode = ({ data }) => {
  const path = window.location.pathname.split('?')[1];
  const curModule = window.location.hash.split('#')[1];
  const { themes } = useTheme();
  const [selectedId, setSelectedId] = useState(null);

  const dispatch = useDispatch();

  const handleClick = (id, name) => {
    if (id && name) {
      setSelectedId(id);
      console.log('Clicked ID:', id);
      dispatch(storeSldData({ id, name }));
    }
  };

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

  const textColor = { color: themes === 'light' ? '#FFFFFF' : '#000000' };

  // Helper function for status-based classes
  const getStatusClass = (status) => (status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'gray');


  return (
    <div style={combinedStyles}>
      {/* Blinking dots for main and secondary meter */}
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

      {/* Main energy meter card */}
      {data.mainEnergyMeter && (
        <div className="flow-in-box1">
          <p style={textColor}>{data.text}</p>
          {data.buttonMode ? (
            <button
              onClick={() => handleClick(data.mainEnergyMeter.id, data.mainEnergyMeter.text)}
              className="in-flow-box"
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              }}
            >
              <p className="react-flow-description" style={textColor}>
                {data.mainEnergyMeter.text}
              </p>
              <img
                className="flow-in-img"
                src={data.mainEnergyMeter.imageUrl}
                alt={data.mainEnergyMeter.text}
              />
            </button>
          ) : (
            <Link
              to={`/energy-sld?sid=${data.mainEnergyMeter.id}&text=${encodeURIComponent(data.mainEnergyMeter.text)}#${curModule}`}
            >
              <div className="in-flow-box">
                <p className="react-flow-description" style={textColor}>
                  {data.mainEnergyMeter.text}
                </p>
                <img
                  className="flow-in-img"
                  src={data.mainEnergyMeter.imageUrl}
                  alt={data.mainEnergyMeter.text}
                />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* If no mainEnergyMeter, but description exists */}
      {!data.mainEnergyMeter && data.description && (
        <div className="flow-in-box2">
          <p className="font-weight-800" style={textColor}>
            {data.text}
          </p>
        </div>
      )}

      {/* Group of energy meters */}
      {data.energyMeters && data.energyMeters.length > 0 ? (
        <div className="flow-in-box-group">
          {data.energyMeters.map((item, index) => (
            <div
              key={item.id || index}
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
              {data.buttonMode ? (
                <button
                  onClick={() => handleClick(item.id, item.text)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {item.id && (
                    <div className={`blinking-dot-single ${getStatusClass(findStatus(item.id))}`} />
                  )}
                  <img
                    src={item.imageUrl}
                    alt={`${item.text} node`}
                    style={{ width: '35px', height: '35px' }}
                  />
                  <div style={textColor}>{item.text}</div>
                </button>
              ) : (
                <Link to={`/energy-sld?sid=${item.id}&text=${encodeURIComponent(item.text)}#${curModule}`}>
                  {item.id && (
                    <div className={`blinking-dot-single ${getStatusClass(findStatus(item.id))}`} />
                  )}
                  <img
                    src={item.imageUrl}
                    alt={`${item.text} node`}
                    style={{ width: '35px', height: '35px' }}
                  />
                  <div style={textColor}>{item.text}</div>
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : data.imageUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {data.buttonMode ? (
            <button
              onClick={() => handleClick(data?.energyMeter?.id, data.text)}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={textColor}>{data.text}</div>
            </button>
          ) : (
            <Link to={`/energy-sld?sid=${data.energyMeter?.id}&text=${encodeURIComponent(data.text)}#${curModule}`}>
              <img
                src={data.imageUrl}
                alt={data.text}
                style={{ width: '40px', height: '40px' }}
              />
              <div style={textColor}>{data.text}</div>
            </Link>
          )}
        </div>
      ) : null}

      {/* Render handlers */}
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
