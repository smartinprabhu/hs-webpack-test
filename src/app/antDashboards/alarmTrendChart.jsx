/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, {
  Suspense, useEffect, useState,
} from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  Skeleton,
} from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import AuthService from '../util/authService';
import {
  initiateSensorTrendInfo,
  getSensorTrendInfoSuccess,
  getSensorTrendInfoFailure,
} from '../assets/equipmentService';
import customData1 from './data/customData.json';
import {
  getCompanyTimezoneDate,
  getArrayFromValues,
  getColumnArrayById,
  ctofconvertion,
  detectMob,
} from '../util/appUtils';
import LineChart from './arrayDataComponents/lineChart';

const appConfig = require('../config/appConfig').default;

const AlarmTrendChart = React.memo((props) => {
  const {
    currentAssetDate,
  } = props;
  const dispatch = useDispatch();
  const authService = AuthService();
  const isMob = detectMob();

  const {
    equipmentTrendSensorsInfo,
    currentThreshold, spaceThresholds,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);

  const [sensorTrendLoading, setSensorTrendLoading] = useState(false);

  const loadThresholdsTrendEq = (id, date, noload) => {
    if (id) {
      setSensorTrendLoading(true);
      const startDay = moment(date).format('YYYY-MM-DD');
      const endDate = moment(date).format('YYYY-MM-DD');
      if (!noload) {
        dispatch(initiateSensorTrendInfo());
      }
      const data = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                match: {
                  'equipment.id': id,
                },
              },
            ],
            filter: [
              {
                range: {
                  timestamp: {
                    gte: `${startDay}T00:00:00.108280`,
                    lte: `${endDate}T23:28:13.108280`,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          sales_over_time: {
            date_histogram: {
              field: 'timestamp',
              fixed_interval: '3m',
            },
            aggs: {
              iaq: {
                stats: {
                  field: 'iaq',
                },
              },
              temperature_F: {
                stats: {
                  field: 'temperature_F',
                },
              },
              voc: {
                stats: {
                  field: 'voc',
                },
              },
              pressure: {
                stats: {
                  field: 'pressure',
                },
              },
              humidity: {
                stats: {
                  field: 'humidity',
                },
              },
              dew: {
                stats: {
                  field: 'dew',
                },
              },
              Winsen_O3: {
                stats: {
                  field: 'Winsen_O3',
                },
              },
              Winsen_CO: {
                stats: {
                  field: 'Winsen_CO',
                },
              },
              Winsen_CO2: {
                stats: {
                  field: 'Winsen_CO2',
                },
              },
              Winsen_pm_1: {
                stats: {
                  field: 'Winsen_pm_1',
                },
              },
              Winsen_pm_2_5: {
                stats: {
                  field: 'Winsen_pm_2_5',
                },
              },
              Winsen_pm_10: {
                stats: {
                  field: 'Winsen_pm_10',
                },
              },
              Winsen_CH2O: {
                stats: {
                  field: 'Winsen_CH2O',
                },
              },
              Winsen_NO2: {
                stats: {
                  field: 'Winsen_NO2',
                },
              },
              co2Value: {
                stats: {
                  field: 'co2Value',
                },
              },
              timestamp: {
                stats: {
                  field: 'timestamp',
                },
              },
              occupancyCount: {
                stats: {
                  field: 'occupancyCount',
                },
              },
            },
          },
        },
      };

      const config = {
        method: 'post',
        url: `${window.location.origin}/hsense_airquality/search`,
        data,
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      axios(config)
        .then((response) => {
          console.log(response);
          dispatch(getSensorTrendInfoSuccess(response));
          setSensorTrendLoading(false);
        })
        .catch((error) => {
          console.log(error);
          dispatch(getSensorTrendInfoFailure(error));
          setSensorTrendLoading(false);
        });
    }
  };

  useEffect(() => {
    if (currentAssetDate && currentAssetDate.id && currentAssetDate.date) {
      loadThresholdsTrendEq(currentAssetDate.id, currentAssetDate.date, true);
    }
  }, [currentAssetDate]);

  /* const spaceSensors = spaceThresholds && spaceThresholds.data && spaceThresholds.data.length ? spaceThresholds.data : [];
  const currentSpaceData = eqData ? spaceSensors.filter((li) => li.id === eqData.location_id.id) : spaceSensors.filter((li) => li.id === floorId);

  const currentThresholds = currentSpaceData && currentSpaceData.length && currentSpaceData[0].reading_lines_ids ? currentSpaceData[0].reading_lines_ids.filter((li) => li.is_active) : [];

  function getDataName(name) {
    let res = '';
    if (customData1 && customData1.thresholdsNames && customData1.thresholdsNames[name]) {
      res = customData1.thresholdsNames[name].dataname;
    }
    return res;
  } */

  function isSensorExists(dataname) {
    const res = true;
    /* const data1 = currentThresholds.filter((li) => getDataName(li.reading_id.name) === dataname);
    if ((data1 && data1.length)) {
      res = true;
    } */
    return res;
  }

  function getValuesOfSensor(data) {
    let finalValue = [];
    if (data && data.length) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].dew && data[i].dew.avg && isSensorExists('dew')) {
          finalValue.push({
            threshold: 'Dew Point Temperature', count: data[i].dew.avg ? parseInt(ctofconvertion(data[i].dew.avg)) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_CO && data[i].Winsen_CO.avg && isSensorExists('Winsen_CO')) {
          finalValue.push({
            threshold: 'Carbon Monoxide (CO)', count: data[i].Winsen_CO.avg ? parseInt(data[i].Winsen_CO.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_CO2 && data[i].Winsen_CO2.avg && isSensorExists('Winsen_CO2')) {
          finalValue.push({
            threshold: 'NDIR (CO2)', count: data[i].Winsen_CO2.avg ? parseInt(data[i].Winsen_CO2.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].co2Value && data[i].co2Value.avg && isSensorExists('co2Value')) {
          finalValue.push({
            threshold: 'Carbon Dioxide (CO2)', count: data[i].co2Value.avg ? parseInt(data[i].co2Value.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_O3 && data[i].Winsen_O3.avg && isSensorExists('Winsen_O3')) {
          finalValue.push({
            threshold: 'Ozone (O)', count: data[i].Winsen_O3.avg ? parseInt(data[i].Winsen_O3.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_pm_1 && data[i].Winsen_pm_1.avg && isSensorExists('Winsen_pm_1')) {
          finalValue.push({
            threshold: 'Particulate Matter 1.0', count: data[i].Winsen_pm_1.avg ? parseInt(data[i].Winsen_pm_1.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_pm_2_5 && data[i].Winsen_pm_2_5.avg && isSensorExists('Winsen_pm_2_5')) {
          finalValue.push({
            threshold: 'Particulate Matter 2.5', count: data[i].Winsen_pm_2_5.avg ? parseInt(data[i].Winsen_pm_2_5.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_pm_10 && data[i].Winsen_pm_10.avg && isSensorExists('Winsen_pm_10')) {
          finalValue.push({
            threshold: 'Particulate Matter 10', count: data[i].Winsen_pm_10.avg ? parseInt(data[i].Winsen_pm_10.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].humidity && data[i].humidity.avg && isSensorExists('humidity')) {
          finalValue.push({
            threshold: 'Humidity', count: data[i].humidity.avg ? parseInt(data[i].humidity.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].iaq && data[i].iaq.avg && isSensorExists('iaq')) {
          finalValue.push({
            threshold: 'IAQ', count: data[i].iaq.avg ? parseInt(data[i].iaq.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].pressure && data[i].pressure.avg && isSensorExists('pressure')) {
          finalValue.push({
            threshold: 'ATM Pressure', count: data[i].pressure.avg ? parseInt(data[i].pressure.avg / 100) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].temperature_F && data[i].temperature_F.avg && isSensorExists('temperature_F')) {
          finalValue.push({
            threshold: 'Temperature', count: data[i].temperature_F.avg ? parseInt(data[i].temperature_F.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].voc && data[i].Winsen_CH2O.avg && data[i].Winsen_CH2O && isSensorExists('voc')) {
          finalValue.push({
            threshold: 'Total Volatile Organic Compound (TVOC)', count: data[i].Winsen_CH2O.avg ? parseInt(data[i].Winsen_CH2O.avg * 1000) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_CH2O && data[i].Winsen_CH2O.avg && isSensorExists('Winsen_CH2O')) {
          finalValue.push({
            threshold: 'Formaldehyde (CH2O)', count: data[i].Winsen_CH2O.avg ? parseInt(data[i].Winsen_CH2O.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
        if (data[i].Winsen_NO2 && data[i].Winsen_NO2.avg && isSensorExists('Winsen_NO2')) {
          finalValue.push({
            threshold: 'Nitrogen Dioxide (NO2)', count: data[i].Winsen_NO2.avg ? parseInt(data[i].Winsen_NO2.avg) : 0, date: getCompanyTimezoneDate(data[i].key_as_string, userInfo, 'datetime'),
          });
        }
      }
    }
    if (currentThreshold && currentThreshold.length) {
      const names = getColumnArrayById(currentThreshold, 'name');
      finalValue = getArrayFromValues(finalValue, names, 'threshold');
    }
    return finalValue; // return column data..
  }

  const sensorTrendData = equipmentTrendSensorsInfo && equipmentTrendSensorsInfo.data && equipmentTrendSensorsInfo.data.aggregations && equipmentTrendSensorsInfo.data.aggregations.sales_over_time
  && equipmentTrendSensorsInfo.data.aggregations.sales_over_time.buckets ? getValuesOfSensor(equipmentTrendSensorsInfo.data.aggregations.sales_over_time.buckets) : [];

  // const sensorTrendLoading = (equipmentTrendSensorsInfo && equipmentTrendSensorsInfo.loading);

  return (
    <Suspense fallback={(
      <Skeleton
        active
        size="large"
        paragraph={{
          rows: 4,
        }}
      />
)}
    >
      <Row className={isMob ? '' : 'pl-1 pr-1'}>
        <Col sm="12" md="12" xs="12" lg="12" className={isMob ? 'mb-2' : 'pl-1 pr-1 mt-2 mb-2'}>
          <div className="h-100 bg-white box-shadow-grey">
            <div className="p-2">
              {!sensorTrendLoading && sensorTrendData && sensorTrendData.length > 0 && (
              <LineChart lineData={sensorTrendData} xField="date" yField="count" seriesField="threshold" />
              )}
              {sensorTrendLoading && (
              <div className="mb-3 mt-3 p-2">
                <Skeleton
                  active
                  size="large"
                  paragraph={{
                    rows: 4,
                  }}
                />
              </div>
              )}
              {(!sensorTrendLoading && sensorTrendData && sensorTrendData.length === 0) && (
              <div className="mb-3 mt-3">
                <ErrorContent errorTxt="No Data Found" />
              </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Suspense>
  );
});

AlarmTrendChart.propTypes = {
  currentAssetDate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default AlarmTrendChart;
