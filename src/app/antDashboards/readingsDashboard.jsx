/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import CoIcon from '@images/airquality/CO.svg';
import VocIcon from '@images/airquality/VOC.svg';
import Co2Icon from '@images/airquality/CO2.svg';

import {
  ctofconvertion, detectMob, extractNameObject, getAQIValue,
  translateTextNo,
} from '../util/appUtils';

import customData from './data/customData.json';

import GaugeChart from './singleDataComponents/gaugeChartDash';

const ReadingsDashboard = (props) => {
  const {
    isDrawer,
    sensorData,
    currentThresholds,
    eqData,
    outdoorData,
    outerThresholdsData,
  } = props;
  const sectionData = customData && customData.readings ? customData.readings : [];// groupByMultiple(customData.readings, (obj) => (obj.section)) : [];

  const isMob = detectMob();

  const faIcons = {
    Winsen_CO: CoIcon,
    voc: VocIcon,
    Winsen_CO2: Co2Icon,
  };

  const mobCol = isMob ? 6 : 12;
  const widthColumn = isDrawer ? 6 : 6;
  const widthColumn1 = isDrawer ? 4 : 4;
  const fontSize = isDrawer ? 26 : 16;

  const isShowIndoor = (eqData && extractNameObject(eqData.location_id, 'space_name') !== 'Outdoor Area') || (!eqData);

  const outdoorSpaceId = 69039;

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
          <h6 className="text-info">{translateTextNo('Definition', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).definition}</p>
          <h6 className="text-info">{translateTextNo('Impact', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).impact}</p>
          <h6 className="text-info">{translateTextNo('Suggestions', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).suggestion}</p>
        </div>
        {getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).source && (
        <>
          <hr className="m-0 border-info" />
          <p className="text-black mt-0 mb-0 font-tiny-xs">
            {translateTextNo('Source', '')}
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
          <h6 className="text-info">{translateTextNo('Definition', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfOutSensor(dataname), tLines).definition}</p>
          <h6 className="text-info">{translateTextNo('Impact', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfSensor(dataname), tLines).impact}</p>
          <h6 className="text-info">{translateTextNo('Suggestions', '')}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfSensor(dataname), tLines).suggestion}</p>
        </div>
        {getCurrentThresholdValues(getValueOfSensor(dataname), tLines).source && (
        <>
          <hr className="m-0 border-info" />
          <p className="text-black mt-0 mb-0 font-tiny-xs">
            {translateTextNo('Source', '')}
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

  return (
    <>

      <div className="mt-2 pl-3 pr-3">
        {isShowIndoor && (
          <>
            { /* <h6>{translateText('Indoor', userInfo)}</h6> */ }
            <Row className="pl-2 pr-2">
              {currentThresholds && currentThresholds.length > 0 && getThresholdData('indoor').map((reads) => (
                <>
                  {(reads.dataname === 'temperature_F' || reads.dataname === 'humidity') && (
                  <Col sm={mobCol} md={widthColumn} xs={mobCol} lg={widthColumn} className="pl-1 pr-1 mb-2 cursor-pointer text-center" key={reads.name}>
                    <Tooltip
                      title={reads.name}
                      placement="top"
                      color={getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                    >
                      <Card
                        className="h-100"
                      >
                        <CardBody className="p-0">
                          <GaugeChart
                            color={getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                            uom={reads.uom}
                            rangeColor={getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                            value={getValueOfSensor(reads.dataname)}
                            maxValue={reads.max}
                            minValue={reads.min}
                            fontSize={fontSize}
                            width={130}
                            height={130}
                          />
                          <p
                            className="font-tiny mb-0"
                            style={{ color: getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code }}
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
                          <p className="font-tiny mb-0">
                            {reads.name}
                          </p>
                        </CardBody>
                      </Card>
                    </Tooltip>
                  </Col>
                  )}

                  {(reads.dataname === 'voc' || reads.dataname === 'Winsen_CO' || reads.dataname === 'Winsen_CO2') && (
                  <Col sm={mobCol} md={widthColumn1} xs={mobCol} lg={widthColumn1} className="pl-1 pr-1 cursor-pointer text-center" key={reads.name}>
                    <Tooltip
                      title={reads.name}
                      placement="top"
                      color={getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code}
                    >
                      <Card
                        className="h-100"
                      >
                        <CardBody className="p-0 text-center">
                          <img
                            src={faIcons[reads.dataname]}
                            height="70"
                            width="140"
                            className="responsive"
                            alt={reads.name}
                          />
                          <h3 className="mt-0">{getValueOfSensor(reads.dataname)}</h3>
                          <p
                            className="font-tiny mb-0"
                            style={{ color: getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code }}
                          >
                            {reads.uom}
                          </p>
                          <p
                            className="font-tiny mb-0"
                            style={{ color: getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code }}
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
                          <p className="font-tiny">
                            {reads.name}
                          </p>
                        </CardBody>
                      </Card>
                    </Tooltip>
                  </Col>
                  )}
                </>
              ))}
            </Row>
          </>
        )}
      </div>

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

ReadingsDashboard.propTypes = {
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
  outerThresholdsData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};

export default ReadingsDashboard;
