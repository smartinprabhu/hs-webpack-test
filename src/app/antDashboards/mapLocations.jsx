/* eslint-disable camelcase */
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
  CardBody,
  Modal,
  ModalBody,
  Input,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  Select, Radio, Tooltip, Skeleton,
} from 'antd';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWater, faSearch, faTimesCircle, faChartBar, faRefresh,
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from 'moment-timezone';

import totalArea from '@images/icons/totalArea.svg';
import allBuildings from '@images/icons/allBuildings.svg';
import resetIcon from '@images/icons/reset.png';

import ModalNoPadHead from '@shared/modalNoPadHead';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import AuthService from '../util/authService';
import {
  newBulkDraggableSpaceData,
} from '../spaceManagement/spaceService';
import {
  getSpaceData,
  getFloorsList,
  getPublicDashboardUuid,
  getSpaceEquipments,
  resetSpaceData, resetSpaceEquipments,
  resetAssetDetails,
  initiateSensorInfo,
  getSensorInfoSuccess,
  getSensorInfoFailure,
  initiateSensorTrendInfo,
  getSensorTrendInfoSuccess,
  getSensorTrendInfoFailure,
  setCurrentThreshold,
  getThresholdData,
  storeAssetDate,
} from '../assets/equipmentService';
import customData from '../dashboard/data/customData.json';
import customData1 from './data/customData.json';
import {
  generateErrorMessage,
  numberWithCommas,
  extractNameObject,
  getCompanyTimezoneDate,
  getArrayFromValues,
  getColumnArrayById,
  ctofconvertion,
  getDatePickerFormat,
  detectMob,
  translateText,
} from '../util/appUtils';
import LineChart from './arrayDataComponents/lineChart';
import GroupedBarChart from './arrayDataComponents/groupedBarChart';
import AlarmTrendChart from './alarmTrendChart';

const MapControl = lazy(() => import('../assets/mapView/mapControl'));
const Readings = lazy(() => import('./readings'));
const FloorAssets = lazy(() => import('./floorAssets'));

const appModels = require('../util/appModels').default;
const appConfig = require('../config/appConfig').default;

const MapLocations = () => {
  const dispatch = useDispatch();
  const authService = AuthService();
  const isMob = detectMob();

  const [assetData, setAssetData] = useState([]);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(false);

  const [isEquipmentsView, setEquipmentsView] = useState(false);
  const [spaceId, setSpaceId] = useState(false);
  const [category, setCategory] = useState(false);

  const [collapse, setCollapse] = useState(false);

  const [isSearch, setIsSearch] = useState(false);

  const [spaceDraggable, setSpaceDraggable] = useState(false);
  const [isBulkFilteredData, setIsBulkFilteredData] = useState(false);
  const [indexInfo, setIndexInfo] = useState(false);
  const [reload, setReload] = useState(false);
  const [remove, setRemove] = useState(false);

  const [isAddData, setIsAddData] = useState(false);

  const [isRemoveData, setIsRemoveData] = useState(false);

  const [groupData, setGroupData] = useState(false);

  const [floorId, setFloorId] = useState(false);

  const [isAssetLoaded, setAssetLoaded] = useState(false);

  const [viewField, setViewField] = useState('Map');
  const [dateField, setDateField] = useState('');
  const [outdoorData, setOutdoorData] = useState([]);
  const [todayTime, setTodayTime] = useState('');

  const [isYaxis1, setYaxis] = useState(false);
  const [ymin1, setYmin] = useState(null);

  const [ymax1, setYmax] = useState(null);
  const [yName, setYName] = useState(false);

  const [tLines, setTlines] = useState([]);

  const {
    getFloorsInfo, spaceEquipments, getSpaceInfo,
    equipmentsDetails, equipmentSensorsInfo, equipmentTrendSensorsInfo,
    currentThreshold, spaceThresholds, currentAssetDate, aqDashboardConfig,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);

  const floorUUID = aqDashboardConfig && aqDashboardConfig.data && aqDashboardConfig.data.length ? aqDashboardConfig.data[0].uuid : '';

  const companyDetailData = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : false;

  useEffect(() => {
    if (companyDetailData && companyDetailData.id && !userInfo.loading) {
      let isMounted = true;
      if (isMounted) {
        dispatch(getFloorsList(companyDetailData.id, appModels.SPACE));
        dispatch(getThresholdData());
        dispatch(resetSpaceData());
        dispatch(resetSpaceEquipments());
        dispatch(resetAssetDetails());
        setSpaceId(false);
        setEquipmentsView(false);
        setFloorId('');
        setGroupData([]);
        setAssetData([]);
        dispatch(setCurrentThreshold([]));
        setOutdoorData([]);
        const dt = new Date();
        const todayTimeTrim = moment(dt.setMinutes(dt.getMinutes() - 2)).format(getDatePickerFormat(userInfo, 'datetime'));
        setTodayTime(todayTimeTrim);
      }
      return () => { isMounted = false; };
    }
  }, []);

  useEffect(() => {
    dispatch(resetSpaceData());
    dispatch(resetSpaceEquipments());
    dispatch(resetAssetDetails());
    setSpaceId(false);
    setEquipmentsView(false);
    setFloorId('');
    setGroupData([]);
    setAssetData([]);
    dispatch(setCurrentThreshold([]));
    setOutdoorData([]);
    const dt = new Date();
    const todayTimeTrim = moment(dt.setMinutes(dt.getMinutes() - 2)).format(getDatePickerFormat(userInfo, 'datetime'));
    setTodayTime(todayTimeTrim);
  }, []);

  useEffect(() => {
    if (getSpaceInfo && getSpaceInfo.data && !getSpaceInfo.loading && !isEquipmentsView) {
      setSpaceId(getSpaceInfo.data[0].id);
      const sortBy = 'DESC';
      const sortField = 'create_date';
      setEquipmentsView(true);
      dispatch(getSpaceEquipments(companyDetailData.id, getSpaceInfo.data[0].id, category, appModels.EQUIPMENT, sortBy, sortField, true));
    } else if (getSpaceInfo && getSpaceInfo.err) {
      setSpaceId(false);
      setEquipmentsView(false);
      dispatch(resetSpaceEquipments());
    }
  }, [getSpaceInfo, isEquipmentsView]);

  useEffect(() => {
    if (getFloorsInfo && getFloorsInfo.data && !getFloorsInfo.loading && !floorId) {
      const newArrData = getFloorsInfo.data.map((cl) => ({
        ...cl,
        value: cl.id,
        label: cl.space_name,
      }));
      setGroupData(newArrData);
      setFloorId(newArrData[0].value);
      dispatch(getSpaceData(appModels.SPACE, newArrData[0].value, 'fields'));
      dispatch(getPublicDashboardUuid(companyDetailData.id, newArrData[0].value, appModels.AIRQUALITYCONFIG));
    } else if (getFloorsInfo && getFloorsInfo.err) {
      setGroupData([]);
      dispatch(resetSpaceData());
      dispatch(resetSpaceEquipments());
      dispatch(resetAssetDetails());
      setFloorId('');
    }
  }, [getFloorsInfo, floorId]);

  useEffect(() => {
    if ((spaceEquipments && spaceEquipments.data && !spaceEquipments.loading)) {
      dispatch(newBulkDraggableSpaceData([]));
      const arr = spaceEquipments.data;
      setAssetData(arr);
      setAssetLoaded(true);
    } else if (spaceEquipments && spaceEquipments.err) {
      setAssetData([]);
    }
  }, [spaceEquipments]);

  const loadThresholds = (noload) => {
    if (companyDetailData && floorId && spaceEquipments && spaceEquipments.data && !spaceEquipments.loading) {
      if (!noload) {
        dispatch(initiateSensorInfo());
      }
      const data = {
        query: {
          bool: {
            must: [
              { terms: { 'equipment.id': getColumnArrayById(spaceEquipments.data, 'id') } },
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
          dispatch(getSensorInfoSuccess(response));
        })
        .catch((error) => {
          console.log(error);
          dispatch(getSensorInfoFailure(error));
        });
    }
  };

  const loadThresholdsTrend = (day, noload) => {
    if (companyDetailData && floorId && spaceEquipments && spaceEquipments.data) {
      if (!noload) {
        dispatch(initiateSensorTrendInfo());
      }
      const data = {
        size: 0,
        query: {
          bool: {
            must: [
              { terms: { 'equipment.id': getColumnArrayById(spaceEquipments.data, 'id') } },
            ],
            filter: [
              {
                range: {
                  timestamp: {
                    gte: `now-${day || '1h'}`,
                    lte: 'now',
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
              fixed_interval: day === '1h' || day === '1d' || !day ? '3m' : '1h',
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
        })
        .catch((error) => {
          console.log(error);
          dispatch(getSensorTrendInfoFailure(error));
        });
    }
  };

  const eqData = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length ? equipmentsDetails.data[0] : false;

  const loadThresholdsTrendEq = (day, noload) => {
    if (eqData) {
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
                  'equipment.id': eqData.id,
                },
              },
            ],
            filter: [
              {
                range: {
                  timestamp: {
                    gte: `now-${day || '1h'}`,
                    lte: 'now',
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
              fixed_interval: day === '1h' || day === '1d' || !day ? '3m' : '1h',
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
        })
        .catch((error) => {
          console.log(error);
          dispatch(getSensorTrendInfoFailure(error));
        });
    }
  };

  function getDays(day) {
    let res = '1h';
    if (day === '30D') {
      res = '30d';
    } else if (day === '7D') {
      res = '7d';
    } else if (day === '1D') {
      res = '1d';
    }
    return res;
  }

  useEffect(() => {
    if (companyDetailData && floorId && spaceEquipments && spaceEquipments.data && !spaceEquipments.loading) {
      loadThresholds(false);
      loadThresholdsTrend(getDays(dateField), false);
    }
  }, [spaceEquipments]);

  useEffect(() => {
    if (eqData) {
      loadThresholdsTrendEq(getDays(dateField), false);
    }
  }, [equipmentsDetails]);

  useEffect(() => {
    if (dateField) {
      if (eqData) {
        loadThresholdsTrendEq(getDays(dateField), false);
      } else {
        loadThresholdsTrend(getDays(dateField), false);
      }
    }
  }, [dateField]);

  /* useEffect(() => {
    const interval = setInterval(() => {
      if (eqData) {
        loadThresholdsTrendEq(getDays(dateField));
      } else {
        loadThresholdsTrend(getDays(dateField));
        loadThresholds();
      }
    }, 180000);
  }, []); */

  const onSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = assetData.filter((item) => {
        const searchValue = item.location_id && item.location_id.space_name ? item.location_id.space_name.toString().toUpperCase() : '';
        const searchValue1 = item.name.toString().toUpperCase();
        const searchValue2 = item.category_id && item.category_id.name ? item.category_id.name.toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1 || searchValue1.search(s) !== -1 || searchValue2.search(s) !== -1);
      });
      setAssetData(ndata);
    } else {
      setAssetData(spaceEquipments && spaceEquipments.data ? spaceEquipments.data : []);
    }
  };

  const onSearchCancel = () => {
    setAssetData(spaceEquipments && spaceEquipments.data ? spaceEquipments.data : []);
    setIsSearch(false);
  };

  const onRefresh = () => {
    loadThresholds(true);
    if (eqData) {
      loadThresholdsTrendEq(getDays(dateField), true);
    } else {
      loadThresholdsTrend(getDays(dateField), true);
    }
    const dt = new Date();
    const todayTimeTrim = moment(dt.setMinutes(dt.getMinutes() - 2)).format(getDatePickerFormat(userInfo, 'datetime'));
    setTodayTime(todayTimeTrim);
  };

  const onTrendRefresh = () => {
    dispatch(storeAssetDate(false));
  };

  const onFilterSelect = (value) => {
    setFloorId(value);
    dispatch(resetSpaceData());
    dispatch(resetSpaceEquipments());
    dispatch(resetAssetDetails());
    dispatch(setCurrentThreshold([]));
    dispatch(getSpaceData(appModels.SPACE, value, 'fields'));
    dispatch(getPublicDashboardUuid(companyDetailData.id, value, appModels.AIRQUALITYCONFIG));
  };

  const handleTypeChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setViewField(value);
    }
  };

  const loading = (getSpaceInfo && getSpaceInfo.loading) || (getFloorsInfo && getFloorsInfo.loading) || (spaceEquipments && spaceEquipments.loading);
  const sensorData = equipmentSensorsInfo && equipmentSensorsInfo.data && equipmentSensorsInfo.data.aggregations && equipmentSensorsInfo.data.aggregations.unique_id
  && equipmentSensorsInfo.data.aggregations.unique_id.buckets ? equipmentSensorsInfo.data.aggregations.unique_id.buckets : [];

  const outdoorSpaceId = 69039;

  useEffect(() => {
    if (sensorData && floorId === 2068) {
      const outData = sensorData.filter((data) => data.key === outdoorSpaceId);
      setOutdoorData(outData);
    }
  }, [equipmentSensorsInfo]);

  function getRegions(tData, name) {
    let cdata = [];
    if (tData && tData.length) {
      const taData = tData.filter((li) => li.is_trendline);
      if (taData && taData.length) {
        const cdata1 = taData.map((cl) => ({
          type: 'text',
          position: [0, parseInt(cl.max)],
          content: `${name} - ${cl.name}`,
          offsetY: -4,
          style: {
            textBaseline: 'bottom',
          },
        }));
        const cdata2 = taData.map((cl) => ({
          type: 'line',
          start: [0, parseInt(cl.max)],
          end: [parseInt(cl.max), parseInt(cl.max)],
          style: {
            stroke: cl.color_code,
            lineDash: [2, 2],
          },
        }));
        cdata = [...cdata1, ...cdata2];
      }
    }
    /* for (let i = 0; i < tData.length; i + 1) {
        const textSeperator = {
          type: 'text',
          position: [parseInt(tData[i].min), parseInt(tData[i].max)],
          content: tData[i].name,
          offsetY: -4,
          style: {
            textBaseline: 'bottom',
          },
        };
        const lineSeperator = {
          type: 'line',
          start: [parseInt(tData[i].min), parseInt(tData[i].max)],
          end: [parseInt(tData[i].max), parseInt(tData[i].max)],
          style: {
            stroke: tData[i].color_code,
            lineDash: [2, 2],
          },
        };
        cdata.push(textSeperator);
        cdata.push(lineSeperator);
      }
    } */
    return cdata;
  }

  const handleTimeChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setDateField(value);
    }
  };

  const onThresholdItemChange = (name, min, max, threshold_line) => {
    setYaxis(!!name);
    setYName(name);
    setYmin(min);
    setYmax(max);
    setTlines(threshold_line);
  };

  function getLegendData(field) {
    let res = field === 'regions' ? [] : 0;
    if (isYaxis1) {
      if (field === 'min') {
        res = ymin1;
      } else if (field === 'max') {
        res = ymax1;
      } else if (field === 'regions') {
        res = getRegions(tLines, yName);
      }
    }
    return res;
  }

  const isYaxis = currentThreshold && currentThreshold.length && currentThreshold.length === 1;
  const ymin = isYaxis ? currentThreshold[0].min : getLegendData('min');
  const ymax = isYaxis ? currentThreshold[0].max : getLegendData('max');
  const regions = isYaxis ? getRegions(currentThreshold[0].threshold_line, currentThreshold[0].name) : getLegendData('regions');

  const spaceSensors = spaceThresholds && spaceThresholds.data && spaceThresholds.data.length ? spaceThresholds.data : [];
  const currentSpaceData = eqData ? spaceSensors.filter((li) => li.id === eqData.location_id.id) : spaceSensors.filter((li) => li.id === floorId);

  const currentThresholds = currentSpaceData && currentSpaceData.length && currentSpaceData[0].reading_lines_ids ? currentSpaceData[0].reading_lines_ids.filter((li) => li.is_active) : [];

  const outerSpaceData = spaceSensors.filter((li) => li.id === 2069);

  const outerThreshold = outerSpaceData && outerSpaceData.length ? outerSpaceData[0].reading_lines_ids : [];

  const outerThresholdsData = outerThreshold && outerThreshold.length ? outerThreshold.filter((li) => li.is_active) : [];

  const outerThresholdLines = outerThreshold && outerThreshold.length ? outerThreshold.filter((li) => li.reading_id.name === 'AQI') : [];
  const outerThresholds = outerThresholdLines && outerThresholdLines.length ? outerThresholdLines[0].threshold_line : [];

  const floorName = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length ? getSpaceInfo.data[0].space_name : '';

  function getDataName(name) {
    let res = '';
    if (customData1 && customData1.thresholdsNames && customData1.thresholdsNames[name]) {
      res = customData1.thresholdsNames[name].dataname;
    }
    return res;
  }

  function isSensorExists(dataname) {
    let res = false;
    const data = outerThresholdsData.filter((li) => getDataName(li.reading_id.name) === dataname);
    const data1 = currentThresholds.filter((li) => getDataName(li.reading_id.name) === dataname);
    if ((data && data.length) || (data1 && data1.length)) {
      res = true;
    }
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

  // const sensorTrendFilterData = currentAssetDate ? sensorTrendData.filter((li) => li.date && li.date.toString().includes(currentAssetDate)) : [];

  const sensorLoading = (spaceEquipments && spaceEquipments.loading) || (equipmentSensorsInfo && equipmentSensorsInfo.loading) || (equipmentsDetails && equipmentsDetails.loading) || (spaceThresholds && spaceThresholds.loading);

  const sensorSpaceLoading = (equipmentsDetails && equipmentsDetails.loading) || (spaceThresholds && spaceThresholds.loading);

  const sensorTrendLoading = (equipmentsDetails && equipmentsDetails.loading) || (dateField && equipmentTrendSensorsInfo && equipmentTrendSensorsInfo.loading);// (spaceEquipments && spaceEquipments.loading) || (equipmentTrendSensorsInfo && equipmentTrendSensorsInfo.loading) || (equipmentsDetails && equipmentsDetails.loading);

  return (
    <Suspense fallback={(
      <Skeleton
        active
        size="large"
        paragraph={{
          rows: 12,
        }}
      />
)}
    >
      {loading && !isAssetLoaded && (
      <div className="mb-3 mt-3 p-3">
        <Skeleton
          active
          size="large"
          paragraph={{
            rows: 12,
          }}
        />
      </div>
      )}
      {isAssetLoaded && (
        <>
          <Row className={isMob ? '' : 'pl-1 pr-1'}>
            <Col sm="12" md="6" xs="12" lg="6" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
              <Card className="h-100 box-shadow-grey">
                <Row className="pt-3 pl-4 pr-4">
                  <Col sm="1" md="1" lg="1" xs="1" className="p-0">
                    <img src={allBuildings} alt="actions" className={isMob ? 'mr-1' : 'mr-1 ml-2 circle-icon'} height={isMob ? 'auto' : '10'} width={isMob ? '20' : '10'} />
                  </Col>
                  <Col sm="11" md="11" lg="11" xs="11" className="p-0">
                    {!isSearch && (
                    <Row className="page-actions-header content-center">
                      <Col sm="12" md="4" lg="4" xs="12">
                        <h5 className="text-grey ml-1 mb-0">{companyDetailData ? companyDetailData.name : 'Site'}</h5>
                        {companyDetailData.area_sqft > 0 && (
                        <>
                          <img src={totalArea} alt="actions" className="mr-1 ml-2" height="10" width="10" />
                          <small>
                            {translateText('Total Area', userInfo)}
                            {' '}
                            :
                          </small>
                          {numberWithCommas(companyDetailData.area_sqft)}
                          {' '}
                          {translateText('sqft', userInfo)}
                        </>
                        )}
                        {floorUUID && (
                        <>
                          <FontAwesomeIcon className="ml-2" size="sm" icon={faChartBar} />
                          <a
                            className="ml-1 text-info"
                            href={`/airquality-dashboard/${floorUUID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="cursor-pointer font-tiny">{translateText('Public Dashboard', userInfo)}</span>
                          </a>
                        </>
                        )}
                      </Col>
                      <Col sm="12" md="8" lg="8" xs="12">
                        <div className="float-right  page-actions-header content-center">
                          <Radio.Group defaultValue={viewField} size="small" onChange={(e) => handleTypeChange(e)}>
                            <Radio.Button value="Table">{translateText('List', userInfo)}</Radio.Button>
                            <Radio.Button value="Map">{translateText('Map', userInfo)}</Radio.Button>
                          </Radio.Group>
                          <Select
                            options={groupData}
                            showSearch
                            value={floorId}
                            loading={getFloorsInfo && getFloorsInfo.loading}
                            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            filterSort={(optionA, optionB) => optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())}
                            placeholder={`${translateText('Select', userInfo)} ${translateText('floor', userInfo)}`}
                            className="ml-2 mb-0 min-width-100per mr-2"
                            onSelect={(value) => onFilterSelect(value)}
                          />
                          <FontAwesomeIcon className="cursor-pointer" size="sm" icon={faSearch} onClick={() => setIsSearch(true)} />
                        </div>
                      </Col>
                    </Row>
                    )}
                    {isSearch && (
                    <Row className="page-actions-header content-center ml-2">
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Input className="" id="company-search-text" placeholder={translateText('Search', userInfo)} onChange={onSearchChange} />
                        <FontAwesomeIcon
                          className="float-right custom-close-button"
                          size="sm"
                          type="reset"
                          onClick={() => onSearchCancel()}
                          icon={faTimesCircle}
                        />
                      </Col>
                    </Row>
                    )}
                    { /* <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <div className="arrow_box">
                      <Card className="rounded-0">
                        <CardBody className="p-2">
                          <Row className="m-0 pb-0">
                            <Col sm="12" md="9" lg="9" xs="12" className="p-0 mt-1">
                              <FontAwesomeIcon className="mr-1 ml-1" size="sm" icon={faMapMarkerAlt} />
                              <small>
                                {translateText('Floors', userInfo)}
                                :
                                {' '}
                              </small>
                              <small className="sitescount">{groupData ? groupData.length : 0}</small>
                              <img src={totalArea} alt="actions" className="mr-1 ml-2" height="10" width="10" />
                              <small>
                                {translateText('Total Area', userInfo)}
                                {' '}
                                :
                              </small>
                              {numberWithCommas(companyDetailData.area_sqft)}
                              {' '}
                              {translateText('sqft', userInfo)}

                              {companyDetailData.public_dashboard_url && (
                                <>
                                  <FontAwesomeIcon className="ml-2" size="sm" icon={faChartBar} />
                                  <a
                                    className="ml-1 text-info"
                                    href={companyDetailData.public_dashboard_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="cursor-pointer">{translateText('Public Dashboard', userInfo)}</span>
                                  </a>
                                </>
                              )}

                            </Col>
                            <Col sm="3" md="3" lg="3" xs="12" className="p-0">
                              <Input className="rounded-pill" id="company-search-text" bsSize="sm" placeholder={translateText('Search', userInfo)} onChange={onSearchChange} />
                              <span>
                                <FontAwesomeIcon color="lightgrey" className="search-icon bg-white" icon={faSearch} />
                              </span>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </div>
                  </Col>
                              </Row> */ }
                  </Col>
                </Row>
                <CardBody className="p-1">
                  {viewField === 'Map' && isAssetLoaded && !getSpaceInfo.err && (
                  <MapControl
                    collapse={collapse}
                    isEquipmentsView={isEquipmentsView}
                    category={category}
                    spaceId={spaceId}
                    assetData={assetData}
                    setAssetData={setAssetData}
                    currentEquipmentId={currentEquipmentId}
                    spaceDraggable={spaceDraggable}
                    setSpaceDraggable={setSpaceDraggable}
                    indexInfo={indexInfo}
                    setIndexInfo={setIndexInfo}
                    remove={remove}
                    setRemove={setRemove}
                    reload={reload}
                    setReload={setReload}
                    isAddData={isAddData}
                    setIsAddData={setIsAddData}
                    isBulkFilteredData={isBulkFilteredData}
                    setIsBulkFilteredData={setIsBulkFilteredData}
                    setIsRemoveData={setIsRemoveData}
                    isRemoveData={isRemoveData}
                    isSchool
                    eqData={eqData}
                  />
                  )}
                  {viewField === 'Table' && isAssetLoaded && (
                  <Card className={collapse ? 'filter-margin-right h-100 border-0' : 'h-100 border-0'}>
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12" className="pl-3 pb-3 pr-3">
                        <FloorAssets eqId={eqData ? eqData.id : ''} assetsList={assetData} />
                      </Col>
                    </Row>
                  </Card>
                  )}
                  {(getSpaceInfo && getSpaceInfo.err) && (
                  <div className="mb-3 mt-3">
                    <ErrorContent errorTxt={generateErrorMessage(getSpaceInfo)} />
                  </div>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
              <div className="h-100 bg-white box-shadow-grey">
                <h6 className={`pl-3 pr-3 pt-3 ${isMob ? '' : 'page-actions-header content-center'}`}>
                  <FontAwesomeIcon className="mr-2" size="lg" icon={faWater} />
                  {eqData ? `${translateText('Air Quality', userInfo)} - ${extractNameObject(eqData.location_id, 'space_name')}` : `${translateText('Air Quality', userInfo)} - ${floorName} (${translateText('Average', userInfo)})`}
                  {!isMob && (
                  <span className="float-right margin-left-auto">
                    <span className="mr-2">{todayTime}</span>
                    <Tooltip title={translateText('Refresh', userInfo)} placement="top">
                      <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => onRefresh()} size="sm" icon={faRefresh} />
                    </Tooltip>
                    {currentThreshold && currentThreshold.length > 0 && (
                    <Tooltip title="Reset Selected Parameters" placement="top">
                      <img
                        src={resetIcon}
                        className="mr-1 cursor-pointer"
                        id="reset"
                        width="15"
                        height="15"
                        onClick={() => {
                          dispatch(setCurrentThreshold([]));
                        }}
                        alt="reset"
                        aria-hidden="true"
                      />
                    </Tooltip>
                    )}
                  </span>
                  )}
                  {isMob && (
                  <p className="text-center mt-3 mb-0">
                    <span className="mr-2">{todayTime}</span>
                    <Tooltip title={translateText('Refresh', userInfo)} placement="top">
                      <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => onRefresh()} size="sm" icon={faRefresh} />
                    </Tooltip>
                    {currentThreshold && currentThreshold.length > 0 && (
                    <Tooltip title="Reset Selected Parameters" placement="top">
                      <img
                        src={resetIcon}
                        className="mr-1"
                        id="reset"
                        width="10"
                        height="10"
                        onClick={() => {
                          dispatch(setCurrentThreshold([]));
                        }}
                        alt="reset"
                        aria-hidden="true"
                      />
                    </Tooltip>
                    )}
                  </p>
                  )}
                </h6>
                <div className="p-0">
                  {!sensorSpaceLoading && isAssetLoaded && !equipmentsDetails.err && (
                  <Readings currentThresholds={currentThresholds} outerThresholdsData={outerThresholdsData} outerThresholds={outerThresholds} eqData={eqData} sensorData={sensorData} outdoorData={outdoorData} isDrawer />
                  )}
                  {sensorSpaceLoading && (
                  <div className="mb-3 mt-3 p-2">
                    <Skeleton
                      active
                      size="large"
                      paragraph={{
                        rows: 12,
                      }}
                    />
                  </div>
                  )}
                  {(equipmentsDetails && equipmentsDetails.err) && (
                  <div className="mb-3 mt-3">
                    <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
                  </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row className={isMob ? '' : 'pl-1 pr-1'}>
            { /* <Col sm="12" md="5" xs="12" lg="5" className={isMob ? 'mb-2' : 'pl-1 pr-1 mt-2'}>
          <div className="h-100 bg-white box-shadow-grey">
            <h6 className="pl-3 pr-3 pt-3 page-actions-header content-center">
              <FontAwesomeIcon className="mr-2" size="lg" icon={faWater} />
              {eqData ? `${translateText('Indoor vs Outdoor', userInfo)} - ${extractNameObject(eqData.location_id, 'space_name')}` : `${translateText('Indoor vs Outdoor', userInfo)} - ${floorName} (${translateText('Average', userInfo)})`}
            </h6>
            <div className="p-0">
              {!sensorLoading && spaceEquipments && spaceEquipments.data && !equipmentsDetails.err && (
              <GroupedBarChart barData={sensorData} outdoorData={outdoorData} eqData={eqData} xField="threshold" yField="value" seriesField="type" />
              )}
              {sensorLoading && (
              <div className="mb-3 mt-3">
                <Loader />
              </div>
              )}
              {(equipmentsDetails && equipmentsDetails.err) && (
              <div className="mb-3 mt-3">
                <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
              </div>
              )}
            </div>
          </div>
              </Col> */ }
            <Col sm="12" md="12" xs="12" lg="12" className={isMob ? 'mb-2' : 'pl-1 pr-1 mt-2 mb-2'}>
              <div className="h-100 bg-white box-shadow-grey">
                <h6 className="pl-3 pr-3 pt-3">
                  <FontAwesomeIcon className="mr-2" size="lg" icon={faWater} />
                  {eqData ? `${translateText('Air Quality Trend', userInfo)} - ${extractNameObject(eqData.location_id, 'space_name')}` : `${translateText('Air Quality Trend', userInfo)} - ${floorName} (${translateText('Average', userInfo)})`}
                  {!isMob && (
                  <span className="float-right">
                    <Radio.Group defaultValue="1H" size="small" onChange={(e) => handleTimeChange(e)}>
                      {customData.dateFiltersTrend.map((cl) => (
                        <Tooltip title={translateText(cl.label, userInfo)} placement="top">
                          <Radio.Button value={cl.value}>{cl.value}</Radio.Button>
                        </Tooltip>
                      ))}
                    </Radio.Group>
                  </span>
                  )}
                  {isMob && (
                  <p className="text-center mt-3 mb-0">
                    <Radio.Group defaultValue="1H" size="small" onChange={(e) => handleTimeChange(e)}>
                      {customData.dateFiltersTrend.map((cl) => (
                        <Tooltip title={translateText(cl.label, userInfo)} placement="top">
                          <Radio.Button value={cl.value}>{cl.value}</Radio.Button>
                        </Tooltip>
                      ))}
                    </Radio.Group>
                  </p>
                  )}
                </h6>
                <div className="p-2">
                  {!sensorTrendLoading && isAssetLoaded && !equipmentsDetails.err && (
                  <LineChart lineData={sensorTrendData} isYaxis={isYaxis || isYaxis1} regions={regions} ymin={ymin} ymax={ymax} xField="date" yField="count" seriesField="threshold" currentThresholds={currentThresholds} onThresholdItemChange={onThresholdItemChange} yName={yName} />
                  )}
                  {sensorTrendLoading && (
                  <div className="mb-3 mt-3 p-2">
                    <Skeleton
                      active
                      size="large"
                      paragraph={{
                        rows: 8,
                      }}
                    />
                  </div>
                  )}
                  {(equipmentsDetails && equipmentsDetails.err) && (
                  <div className="mb-3 mt-3">
                    <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
                  </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
      <Modal size="xl" className="modal-xxl" isOpen={!!currentAssetDate}>
        <ModalNoPadHead title={currentAssetDate && currentAssetDate.name ? `Alarm - ${currentAssetDate.fullname} on ${currentAssetDate.name}` : ''} fontAwesomeIcon={faChartSimple} closeModalWindow={onTrendRefresh} />
        <ModalBody className="">
          <AlarmTrendChart currentAssetDate={currentAssetDate} />
        </ModalBody>
      </Modal>
    </Suspense>
  );
};

export default MapLocations;
