/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import {
  setCurrentThreshold,
} from '../assets/equipmentService';

import {
  ctofconvertion, detectMob, extractNameObject, getAQIValue,
  translateText,
} from '../util/appUtils';

import customData from './data/customData.json';

import GaugeChart from './singleDataComponents/gaugeChart';

const Readings = (props) => {
  const {
    isDrawer,
    sensorData,
    currentThresholds,
    eqData,
    outdoorData,
    outerThresholds,
    outerThresholdsData,
  } = props;
  const sectionData = customData && customData.readings ? customData.readings : [];// groupByMultiple(customData.readings, (obj) => (obj.section)) : [];

  const isMob = detectMob();

  const mobCol = isMob ? 6 : 12;
  const widthColumn = isDrawer ? 3 : 3;
  const fontSize = isDrawer ? 20 : 16;

  const isShowIndoor = (eqData && extractNameObject(eqData.location_id, 'space_name') !== 'Outdoor Area') || (!eqData);

  const [currentType, setType] = useState('');

  const outdoorSpaceId = 69039;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const { currentThreshold } = useSelector((state) => state.equipment);

  function getName(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].name;
    }
    return res;
  }

  function getShortCode(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].shortCode;
    }
    return res;
  }

  function getDataName(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].dataname;
    }
    return res;
  }

  function getThresholdData(type) {
    let cdata = [];
    if (currentThresholds && currentThresholds.length && type === 'indoor') {
      cdata = currentThresholds.map((cl) => ({
        name: cl.reading_id && cl.reading_id.name ? getName(cl.reading_id.name) : '',
        shortCode: cl.reading_id && cl.reading_id.name ? getShortCode(cl.reading_id.name) : '',
        dataname: cl.reading_id && cl.reading_id.name ? getDataName(cl.reading_id.name) : '',
        uom: cl.uom_id && cl.uom_id.name ? cl.uom_id.name : '',
        min: cl.value_min,
        max: cl.value_max,
        threshold_line: cl.threshold_line,
        scale: '',
        color: '',
        sequence: cl.sequence,
      }));
    }
    if (outerThresholdsData && outerThresholdsData.length && type === 'outdoor') {
      cdata = outerThresholdsData.map((cl) => ({
        name: cl.reading_id && cl.reading_id.name ? getName(cl.reading_id.name) : '',
        shortCode: cl.reading_id && cl.reading_id.name ? getShortCode(cl.reading_id.name) : '',
        dataname: cl.reading_id && cl.reading_id.name ? getDataName(cl.reading_id.name) : '',
        uom: cl.uom_id && cl.uom_id.name ? cl.uom_id.name : '',
        min: cl.value_min,
        max: cl.value_max,
        threshold_line: cl.threshold_line,
        scale: '',
        color: '',
        sequence: cl.sequence,
      }));
    }
    /* if (isShowIndoor && type === 'outdoor') {
      cdata.push({
        name: 'AQI',
        shortCode: 'AQI',
        dataname: 'aqi',
        uom: 'Index',
        min: 0,
        max: 100,
        threshold_line: outerThresholds,
        scale: '',
        color: '',
        sequence: 100,
      });
    } */
    /* if (type === 'indoor') {
      cdata = cdata.filter((cd) => (cd.dataname !== 'co2Value' && cd.dataname !== 'Winsen_NO2' && cd.dataname !== 'Winsen_CH2O' && cd.dataname !== 'aqi'));
    } else {
      cdata = cdata.filter((cd) => (cd.dataname === 'temperature_F' || cd.dataname === 'Winsen_CO2' || cd.dataname === 'Winsen_NO2' || cd.dataname === 'aqi'));
    } */

    /* if (type === 'outdoor' && isShowIndoor) {
      cdata = cdata.filter((cd) => (cd.dataname === 'temperature_F' || cd.dataname === 'Winsen_CO2' || cd.dataname === 'Winsen_NO2' || cd.dataname === 'aqi'));
    } */

    cdata = cdata.length ? cdata.sort((a, b) => a.sequence - b.sequence) : [];
    return cdata;
  }

  function getCurrentThresholdValues(value, lineObj) {
    let res = {
      color_code: 'Green', impact: 'None', suggestion: 'None', scale: 'Good', source: '', definition: 'None',
    };
    if (lineObj && lineObj.length) {
      const fdata = lineObj.filter((li) => (parseInt(value) >= parseInt(li.min) && parseInt(value) <= parseInt(li.max)));
      if (fdata && fdata.length) {
        res = {
          color_code: fdata[0].color_code, impact: fdata[0].impact, scale: fdata[0].name, suggestion: fdata[0].suggestion, source: fdata[0].source, definition: fdata[0].definition,
        };
      }
    }

    return res;
  }

  function getCurrentThreshold(name, type) {
    let res = false;
    if (currentThreshold && currentThreshold.length) {
      const data = currentThreshold || [];
      const fdata = data.filter((li) => li.name === name);
      if (fdata && fdata.length && type === currentType) {
        res = true;
      }
    }
    return res;
  }

  function getCurrentThresholdName(name) {
    let res = false;
    if (currentThreshold && currentThreshold.length) {
      const data = currentThreshold || [];
      const fdata = data.filter((li) => li.name === name);
      if (fdata && fdata.length) {
        res = true;
      }
    }
    return res;
  }

  const onThresholdChange = (name, min, max, threshold_line, type) => {
    if (getCurrentThresholdName(name)) {
      const tData = currentThreshold.filter((li) => li.name !== name);
      dispatch(setCurrentThreshold(tData));
    } else {
      const data = currentThreshold || [];
      data.push({
        name, min, max, threshold_line,
      });
      dispatch(setCurrentThreshold([...new Map(data.map((item) => [item.name, item])).values()]));
    }
    setType(type);
  };

  function getValueOfSensor(key) {
    let count = 0;
    let finalValue = 0;
    if (sensorData && sensorData.length) {
      if (!eqData) {
        const inData = sensorData.filter((data) => data.key !== outdoorSpaceId);
        if (inData && inData.length) {
          for (let i = 0; i < inData.length; i += 1) {
            if (inData[i].top_result && inData[i].top_result.hits && inData[i].top_result.hits.hits && inData[i].top_result.hits.hits.length) {
              const singleData = inData[i].top_result.hits.hits;
              let threshold = singleData[0]._source[key] ? singleData[0]._source[key] : 0;
              if (key === 'pressure') {
                threshold = parseInt(threshold / 100);
              }
              if (key === 'dew') {
                threshold = ctofconvertion(threshold);
              }
              if (key === 'voc') {
                threshold = singleData[0]._source.Winsen_CH2O * 1000;
              }
              count += threshold;
            }
          }
          finalValue = count > 0 ? parseFloat(count / inData.length).toFixed(2) : 0;
          if (key === 'pressure') {
            finalValue = parseInt(finalValue);
          }
        }
      } else {
        const eqValue = sensorData.filter((data) => data.key === eqData.id);
        if (eqValue && eqValue.length) {
          const singleData = eqValue[0].top_result.hits.hits;
          finalValue = singleData[0]._source[key] ? singleData[0]._source[key] : 0;
          if (key === 'pressure') {
            finalValue = parseInt(finalValue / 100);
          }
          if (key === 'dew') {
            finalValue = parseFloat(ctofconvertion(finalValue)).toFixed(2);
          }
          if (key === 'voc') {
            finalValue = parseFloat(singleData[0]._source.Winsen_CH2O * 1000).toFixed(2);
          }
        }
      }
    }
    // console.log(key);
    // console.log(finalValue);
    return finalValue; // return column data..
  }

  function getValueOfOutSensor(key) {
    let finalValue = 0;
    if (outdoorData && outdoorData.length) {
      const singleData = outdoorData[0].top_result.hits.hits;
      finalValue = singleData[0]._source[key] ? singleData[0]._source[key] : 0;
      if (key === 'pressure') {
        finalValue = parseInt(finalValue / 100);
      }
      if (key === 'voc') {
        finalValue = parseFloat(singleData[0]._source.Winsen_CH2O * 1000).toFixed(2);
      }
      if (key === 'aqi') {
        finalValue = getAQIValue(singleData[0]._source.Winsen_pm_10, singleData[0]._source.Winsen_pm_2_5);
      }
    }
    // console.log(key);
    // console.log(finalValue);
    return finalValue; // return column data..
  }

  const content = (name, type, dataname, tLines) => (
    <>
      {type === 'outdoor' && (
      <div className="bg-white p-1">
        <h5 className="text-info mb-0">{name}</h5>
        <hr className="m-0 border-info" />
        <div className="p-2 text-center">
          <h6 className="text-info">{translateText('Definition', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).definition}</p>
          <h6 className="text-info">{translateText('Impact', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).impact}</p>
          <h6 className="text-info">{translateText('Suggestions', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).suggestion}</p>
        </div>
        {getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).source && (
        <>
          <hr className="m-0 border-info" />
          <p className="text-black mt-0 mb-0 font-tiny-xs">
            {translateText('Source', userInfo)}
            :
            {' '}
            {getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).source}
          </p>
        </>
        )}
      </div>
      )}
      {type === 'indoor' && (
      <div className="bg-white p-1">
        <h5 className="text-info mb-0">{name}</h5>
        <hr className="m-0 border-info" />
        <div className="p-2 text-center">
          <h6 className="text-info">{translateText('Definition', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).definition}</p>
          <h6 className="text-info">{translateText('Impact', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfSensor(dataname), tLines).impact}</p>
          <h6 className="text-info">{translateText('Suggestions', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfSensor(dataname), tLines).suggestion}</p>
        </div>
        {getCurrentThresholdValues(getValueOfSensor(dataname), tLines).source && (
        <>
          <hr className="m-0 border-info" />
          <p className="text-black mt-0 mb-0 font-tiny-xs">
            {translateText('Source', userInfo)}
            :
            {' '}
            {getCurrentThresholdValues(getValueOfSensor(dataname), tLines).source}
          </p>
        </>
        )}
      </div>
      )}
    </>
  );

  /* function getMinMaxWithMath(arr) {
    // Math.max(10,3,8,1,33)
    const maximum = Math.max(...arr);
    // Math.min(10,3,8,1,33)
    const minimum = Math.min(...arr);
    const result = ([maximum, minimum]);
    return result;
  }

  function getMinValueOfSensor(key) {
    let minValue = 0;
    const tData = [];
    if (sensorData && sensorData.length) {
      for (let i = 0; i < sensorData.length; i += 1) {
        if (sensorData[i].top_result && sensorData[i].top_result.hits && sensorData[i].top_result.hits.hits && sensorData[i].top_result.hits.hits.length) {
          const singleData = sensorData[i].top_result.hits.hits;
          let threshold = singleData[0]._source[key];
          if (key === 'pressure') {
            threshold = parseInt(threshold / 100);
          } else if (key === 'temperature') {
            threshold = threshold ? parseFloat(((parseInt(threshold) * 1.8) + 32) * 0.95).toFixed(2) : 0;
          }
          tData.push(threshold);
        }
      }
      const mv = getMinMaxWithMath(tData);
      minValue = mv && mv.length ? mv[1] : 0;
    }
    // console.log(key);
    // console.log(minValue);
    return minValue; // return column data..
  }

  function getMaxValueOfSensor(key) {
    let minValue = 0;
    const tData = [];
    if (sensorData && sensorData.length) {
      for (let i = 0; i < sensorData.length; i += 1) {
        if (sensorData[i].top_result && sensorData[i].top_result.hits && sensorData[i].top_result.hits.hits && sensorData[i].top_result.hits.hits.length) {
          const singleData = sensorData[i].top_result.hits.hits;
          let threshold = singleData[0]._source[key];
          if (key === 'pressure') {
            threshold = parseInt(threshold / 100);
          } else if (key === 'temperature') {
            threshold = threshold ? parseFloat(((parseInt(threshold) * 1.8) + 32) * 0.95).toFixed(2) : 0;
          }
          tData.push(threshold);
        }
      }
      const mv = getMinMaxWithMath(tData);
      minValue = mv && mv.length ? mv[0] : 0;
    }
    // console.log(key);
    // console.log(minValue);
    return minValue; // return column data..
  } */

  return (
    <>

      <div className="mt-2 pl-3 pr-3">
        {isShowIndoor && (
          <>
            { /* <h6>{translateText('Indoor', userInfo)}</h6> */ }
            <Row className="pl-2 pr-2">
              {currentThresholds && currentThresholds.length > 0 && getThresholdData('indoor').map((reads) => (
                <Col sm={mobCol} md={widthColumn} xs={mobCol} lg={widthColumn} className="pl-1 pr-1 mb-2 cursor-pointer text-center" key={reads.name}>
                  <Tooltip
                    title={reads.name}
                    placement="top"
                    color={getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                  >
                    <Card
                      className="h-100"
                      style={{ backgroundColor: getCurrentThreshold(reads.name, 'indoor') ? getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code : '#fff' }}
                      onClick={() => onThresholdChange(reads.name, reads.min, reads.max, reads.threshold_line, 'indoor')}
                    >
                      <CardBody className="p-0">
                        <GaugeChart
                          color={getCurrentThreshold(reads.name, 'indoor') ? 'white' : getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                          uom={reads.uom}
                          rangeColor={getCurrentThreshold(reads.name, 'indoor') ? '#686666' : getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                          value={getValueOfSensor(reads.dataname)}
                          maxValue={reads.max}
                          minValue={reads.min}
                          fontSize={fontSize}
                        />
                        <p
                          className="font-tiny mb-0"
                          style={{ color: getCurrentThreshold(reads.name, 'indoor') ? 'white' : getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code }}
                        >
                          (
                          {getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).scale}
                          )
                          <Tooltip
                            title={content(reads.name, 'indoor', reads.dataname, reads.threshold_line)}
                            placement="bottom"
                            color="#e7f2fa"
                            overlayClassName="width-300px"
                            trigger={isMob ? 'click' : 'hover'}
                          >
                            <span className="text-info cursor-pointer"><FontAwesomeIcon className="ml-1" size={isMob ? 'lg' : 'sm'} icon={faInfoCircle} /></span>
                          </Tooltip>
                        </p>
                        <p className="font-tiny mb-0" style={{ color: getCurrentThreshold(reads.name, 'indoor') ? '#fff' : 'unset' }}>
                          {reads.shortCode}
                        </p>
                      </CardBody>
                    </Card>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </>
        )}
        { /* <h6>{translateText('Outdoor', userInfo)}</h6>
        <Row className="pl-2 pr-2">
          {currentThresholds && currentThresholds.length > 0 && getThresholdData('outdoor').map((reads) => (
            <Col sm={mobCol} md={widthColumn} xs={mobCol} lg={widthColumn} className="pl-1 pr-1 mb-2 cursor-pointer text-center" key={reads.name}>
              <Tooltip
                title={reads.name}
                placement="top"
                color={getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).color_code}
              >
                <Card
                  className="h-100"
                  style={{ backgroundColor: getCurrentThreshold(reads.name, 'outdoor') ? getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).color_code : '#fff' }}
                  onClick={() => onThresholdChange(reads.name, reads.min, reads.max, reads.threshold_line, 'outdoor')}
                >
                  <CardBody className="p-0">
                    <GaugeChart
                      color={getCurrentThreshold(reads.name, 'outdoor') ? 'white' : getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).color_code}
                      uom={reads.uom}
                      rangeColor={getCurrentThreshold(reads.name, 'outdoor') ? '#686666' : getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).color_code}
                      value={getValueOfOutSensor(reads.dataname)}
                      maxValue={reads.max}
                      minValue={reads.min}
                      fontSize={fontSize}
                    />
                    <p
                      className="font-tiny mb-0"
                      style={{ color: getCurrentThreshold(reads.name, 'outdoor') ? 'white' : getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).color_code }}
                    >
                      (
                      {getCurrentThresholdValues(getValueOfOutSensor(reads.dataname), reads.name === 'AQI' ? outerThresholds : reads.threshold_line).scale}
                      )
                      <Tooltip
                        title={content(reads.name, 'outdoor', reads.dataname, reads.name === 'AQI' ? outerThresholds : reads.threshold_line)}
                        placement="bottom"
                        color="#e7f2fa"
                        overlayClassName="width-300px"
                        trigger={isMob ? 'click' : 'hover'}
                      >
                        <span className="text-info cursor-pointer"><FontAwesomeIcon className="ml-1" size={isMob ? 'lg' : 'sm'} icon={faInfoCircle} /></span>
                      </Tooltip>
                    </p>
                    <p className="font-tiny mb-0" style={{ color: getCurrentThreshold(reads.name, 'outdoor') ? '#fff' : 'unset' }}>
                      {reads.shortCode}
                    </p>
                  </CardBody>
                </Card>
              </Tooltip>
            </Col>
          ))}
                      </Row> */ }
      </div>

      { /* sectionTrendData.length > 0 && (
      <Card>
        <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">Readings Trend Chart</p>
        <hr className="mb-0 mt-0" />
        <CardBody className="mt-2">
          <Line {...config} />
        </CardBody>
      </Card>
      ) */ }

      {!sectionData && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(sectionData && !sectionData.length) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt="No Data" />
          </CardBody>
        </Card>
      )}
    </>
  );
};

Readings.propTypes = {
  isDrawer: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  sensorData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  eqData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  currentThresholds: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  outdoorData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  outerThresholds: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  outerThresholdsData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};

export default Readings;
