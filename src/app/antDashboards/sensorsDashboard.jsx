/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, {
  Suspense, lazy, useState, useEffect,
} from 'react';
import {
  Col,
  Row,
  Card,
  Modal, ModalBody,
} from 'reactstrap';
import { Button } from 'antd';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt, faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ModalNoPadHead from '@shared/modalNoPadHead';
import ErrorContent from '@shared/errorContent';

import {
  initiateSensorInfo,
  getSensorInfoSuccess,
  getSensorInfoFailure,
} from '../assets/equipmentService';
import {
  extractNameObject,
  getColumnArrayById,
  getDatePickerFormat,
  detectMob,
} from '../util/appUtils';

const Readings = lazy(() => import('./readingsDashboard'));

const appConfig = require('../config/appConfig').default;

const SensorsDashboard = React.memo((props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const isMob = detectMob();

  const [floorId, setFloorId] = useState(false);

  const [isButtonHover, setButtonHover] = useState(false);
  const [isSpaceFilters, setSpaceFilters] = useState(false);

  const [outdoorData, setOutdoorData] = useState([]);
  const [todayTime, setTodayTime] = useState('');

  const [isTimer, setTimer] = useState(false);

  const [eqData, setEqData] = useState(false);

  const {
    equipmentSensorsInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (detailData && detailData.id) {
      setFloorId('');
      setOutdoorData([]);
      const dt = new Date();
      const todayTimeTrim = moment(dt.setMinutes(dt.getMinutes() - 2)).format(getDatePickerFormat('DD/MM/YYYY hh:mm A'));
      setTodayTime(todayTimeTrim);
    }
  }, [detailData]);

  useEffect(() => {
    setFloorId('');
    setOutdoorData([]);
    const dt = new Date();
    const todayTimeTrim = moment(dt.setMinutes(dt.getMinutes() - 2)).format('DD/MM/YYYY hh:mm A');
    setTodayTime(todayTimeTrim);
  }, []);

  function conArray(arr) {
    return arr;
  }

  function uniArray(arr) {
    let res = [];
    if (arr && arr.length) {
      res = [...new Map(arr.map((item) => [item.location_id.id, item])).values()];
    }
    return res;
  }
  useEffect(() => {
    if (detailData.space_reading && conArray(detailData.space_reading).length > 0) {
      const floorData = conArray(detailData.space_reading).filter((data) => data.asset_category_id && data.asset_category_id.name && data.asset_category_id.name === 'Floor');
      const newArrData = floorData.map((cl) => ({
        ...cl,
        value: cl.id,
        label: cl.space_name,
      }));
      setFloorId(newArrData && newArrData.length ? newArrData[0].value : '');
    } else {
      setFloorId('');
    }
  }, [detailData]);

  const spaceEquipments = detailData && detailData.equipment && detailData.equipment.length ? detailData.equipment : [];

  const loadThresholds = (noload) => {
    if (detailData && floorId && spaceEquipments && spaceEquipments.length) {
      if (!noload) {
        dispatch(initiateSensorInfo());
      }
      const data = {
        query: {
          bool: {
            must: [
              { terms: { 'equipment.id': getColumnArrayById(spaceEquipments, 'id') } },
            ],
          },
        },
        size: 0,
        aggs: {
          unique_id: {
            terms: {
              field: 'equipment.id',
              size: 20,
            },
            aggs: {
              top_result: {
                top_hits: {
                  size: 1,
                  _source: ['iaq', 'temperature_F', 'voc', 'pressure', 'humidity', 'dew', 'Winsen_O3', 'Winsen_CO', 'Winsen_CO2', 'Winsen_pm_1', 'Winsen_pm_2_5', 'Winsen_pm_10', 'co2Value', 'Winsen_CH2O', 'Winsen_NO2', 'timestamp'],
                  sort: {
                    timestamp: 'desc',
                  },
                },
              },
            },
          },
        },
      };

      const config = {
        method: 'post',
        url: `${window.location.origin}/public/hsense_airquality/search`,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      axios(config)
        .then((response) => {
          console.log(response);
          dispatch(getSensorInfoSuccess(response));
        })
        .catch((error) => {
          console.log(error);
          dispatch(getSensorInfoFailure(error));
        });
    }
  };

  useEffect(() => {
    const dashboardInterval = 50000;
    // setLoadable(false);
    const interval = setInterval(() => {
      setTimer(Math.random());
    }, dashboardInterval);
      // clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isTimer) {
      loadThresholds(true);
    }
  }, [isTimer]);

  useEffect(() => {
    if (detailData && floorId && spaceEquipments && spaceEquipments.length) {
      loadThresholds(false);
    }
  }, [floorId, spaceEquipments]);

  const sensorData = equipmentSensorsInfo && equipmentSensorsInfo.data && equipmentSensorsInfo.data.aggregations && equipmentSensorsInfo.data.aggregations.unique_id
    && equipmentSensorsInfo.data.aggregations.unique_id.buckets ? equipmentSensorsInfo.data.aggregations.unique_id.buckets : [];

  const outdoorSpaceId = 69039;

  useEffect(() => {
    if (sensorData && floorId === 2068) {
      const outData = sensorData.filter((data) => data.key === outdoorSpaceId);
      setOutdoorData(outData);
    }
  }, [equipmentSensorsInfo]);

  const handleEqChange = (data) => {
    setEqData(data);
    setSpaceFilters(false);
  };

  const spaceSensors = detailData && detailData.space_reading && conArray(detailData.space_reading).length ? conArray(detailData.space_reading) : [];
  const currentSpaceData = eqData ? spaceSensors.filter((li) => li.id === eqData.location_id.id) : spaceSensors.filter((li) => li.id === floorId);

  const currentThresholds = currentSpaceData && currentSpaceData.length && currentSpaceData[0].reading_lines ? currentSpaceData[0].reading_lines.filter((li) => li.is_active) : [];

  const outerSpaceData = spaceSensors.filter((li) => li.id === 2069);

  const outerThreshold = outerSpaceData && outerSpaceData.length ? outerSpaceData[0].reading_lines : [];

  const outerThresholdsData = outerThreshold && outerThreshold.length ? outerThreshold.filter((li) => li.is_active) : [];

  const outerThresholdLines = outerThreshold && outerThreshold.length ? outerThreshold.filter((li) => li.reading_id.name === 'AQI') : [];
  const outerThresholds = outerThresholdLines && outerThresholdLines.length ? outerThresholdLines[0].threshold_line : [];

  const floorDetail = detailData && detailData.space_reading ? conArray(detailData.space_reading).filter((data) => data.asset_category_id && data.asset_category_id.name && data.asset_category_id.name === 'Floor') : [];

  const floorName = floorDetail && floorDetail.length ? floorDetail[0].space_name : '';

  const sensorLoading = (equipmentSensorsInfo && equipmentSensorsInfo.loading);

  return (
    <Suspense fallback={<Loader color="white" />}>
      {(sensorLoading) && (
      <div className="mb-3 mt-3">
        <Loader color="white" />
      </div>
      )}
      {!(sensorLoading) && (
      <>
        <Row className={isMob ? '' : 'pl-1 pr-1'}>
          <Col sm="12" md="12" xs="12" lg="12" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
            <p>
              <span>
                {detailData && detailData.company_id && detailData.company_id.theme_icon && (
                <img
                  src={`data:image/png;base64,${detailData.company_id.theme_icon}`}
                  height="20"
                  width="80"
                  className="responsive mr-2"
                  alt={detailData.company_id.name}
                />
                )}
              </span>
              <span className="float-right">
                <span className="mr-2 text-white">{todayTime}</span>
              </span>
            </p>
            <hr className="custom-air-quality-hr" />
          </Col>
        </Row>
        <Row className={isMob ? '' : 'pl-1 pr-1'}>
          <Col sm="12" md="4" xs="12" lg="4" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
            <Card className="h-100 border-0 custom-theme-color-bg">
              <h5 className="text-white">
                {detailData && detailData.company_id && detailData.company_id.theme_logo && (
                <img
                  src={`data:image/png;base64,${detailData.company_id.theme_logo}`}
                  height="15"
                  width="75"
                  className="responsive mr-2"
                  alt={detailData.company_id.name}
                />
                )}
                {detailData && detailData.company_id ? detailData.company_id.name : 'Site'}
              </h5>
              {floorDetail && floorDetail.length > 0 && floorDetail[0].image_medium && (
              <img
                src={`data:image/png;base64,${floorDetail[0].image_medium}`}
                height="100%"
                width="100%"
                className="responsive"
                alt={floorDetail[0].space_name}
              />
              )}
              {(floorDetail && floorDetail.length === 0) && (
              <div className="mb-3 mt-3">
                <ErrorContent errorTxt="No data Found." />
              </div>
              )}
            </Card>
          </Col>
          <Col sm="12" md="8" xs="12" lg="8" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
            <div className="h-100 border-0">
              <h5
                className={`text-center text-white ${isMob ? 'mt-2' : ''}`}
                onMouseLeave={() => setButtonHover(false)}
                onMouseEnter={() => setButtonHover(true)}
              >
                {eqData ? extractNameObject(eqData.location_id, 'space_name') : floorName }
                {isButtonHover && (
                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setSpaceFilters(true)} size="sm" icon={faPencilAlt} />
                )}
              </h5>
              <div className="p-0">
                {!sensorLoading && spaceEquipments && spaceEquipments.length > 0 && (
                <Readings currentThresholds={currentThresholds} outerThresholdsData={outerThresholdsData} outerThresholds={outerThresholds} eqData={eqData} sensorData={sensorData} outdoorData={outdoorData} isDrawer />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </>
      )}
      <Modal size="md" className="modal-dialog-centered" isOpen={isSpaceFilters}>
        <h5 className="font-weight-800 mb-0">
          <ModalNoPadHead title="Space Filters" fontAwesomeIcon={faBuilding} closeModalWindow={() => setSpaceFilters(false)} />
        </h5>
        <ModalBody className="p-3">
          <Row>
            {spaceEquipments && spaceEquipments.length > 0 && uniArray(spaceEquipments).map((seq) => (
              <Col md="4" sm="12" xs="12" lg="4">
                <p key={seq.id}>
                  <Button onClick={() => handleEqChange(seq)} type={eqData && eqData.location_id && seq.location_id.id === eqData.location_id.id ? 'primary' : 'default'}>{extractNameObject(seq.location_id, 'space_name')}</Button>
                </p>
              </Col>
            ))}
          </Row>
        </ModalBody>
      </Modal>
    </Suspense>
  );
});

SensorsDashboard.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};

export default SensorsDashboard;
