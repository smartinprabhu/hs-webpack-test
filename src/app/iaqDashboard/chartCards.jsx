/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  initiateSensorInfo,
  getSensorInfoSuccess,
  getSensorInfoFailure,
} from '../assets/equipmentService';
import '../nocDashboards/dashboard.scss';
import customData from '../antDashboards/data/customData.json';
import AuthService from '../util/authService';
import {
  getColumnArrayById,
  getNewArrayFromValues,
  getColumnArrayByIdMulti,
} from '../util/appUtils';

import Readings from './readings';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const appConfig = require('../config/appConfig').default;

const ChartCards = React.memo(({
  editMode, setCustomLayouts, dashboardLayouts,
  customLayouts,
}) => {
  const {
    spaceEquipments, equipmentSensorsInfo, spaceThresholds,
  } = useSelector((state) => state.equipment);

  const dispatch = useDispatch();
  const authService = AuthService();

  const [layouts, setLayouts] = useState({});
  const [layouts1, setLayouts1] = useState(customLayouts);

  const loadThresholds = (noload) => {
    if (spaceEquipments && spaceEquipments.data) {
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

  useEffect(() => {
    if (spaceEquipments && spaceEquipments.data && !spaceEquipments.loading) {
      loadThresholds(false);
    }
  }, [spaceEquipments]);

  useEffect(() => {
    if (customLayouts) {
      setLayouts1(customLayouts);
    }
  }, [customLayouts]);

  const onLayoutChange = (layout, layoutss) => {
    setLayouts1(layout);
    setCustomLayouts(layout);
    setLayouts(layouts);
  };

  function defaultLayout(id, seq) {
    let res = {
      x: 0,
      y: 0,
      w: 3,
      h: 3,
      minW: 2,
      minH: 1,
    };
    const dataLayout = dashboardLayouts && dashboardLayouts.length ? dashboardLayouts.filter((item) => parseInt(item.i) === parseInt(id)) : false;
    const dataLayout1 = dashboardLayouts && dashboardLayouts.length ? dashboardLayouts.filter((item) => parseInt(`${item.w}${item.x}${item.y}`) === parseInt(seq)) : false;
    if (dataLayout && dataLayout.length) {
      res = {
        x: dataLayout[0].x,
        y: dataLayout[0].y,
        w: dataLayout[0].w,
        h: dataLayout[0].h,
        minW: 1,
        minH: 1,
      };
    } else if (dataLayout1 && dataLayout1.length) {
      res = {
        x: dataLayout1[0].x,
        y: dataLayout1[0].y,
        w: dataLayout1[0].w,
        h: dataLayout1[0].h,
        minW: 1,
        minH: 1,
      };
    }
    return res;
  }

  function getDimension(ids) {
    let res = {
      w: 400,
      h: 400,
    };
    const id = `id${ids}`;
    const targetDiv = document.getElementById(id);
    if (targetDiv && targetDiv.clientHeight && targetDiv.clientWidth) {
      res = {
        w: targetDiv.clientWidth,
        h: targetDiv.clientHeight,
      };
    }
    return res;
  }

  const spaceSensors = spaceThresholds && spaceThresholds.data && spaceThresholds.data.length ? spaceThresholds.data : [];

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

  const currentThresholds1 = getNewArrayFromValues(spaceSensors, getColumnArrayByIdMulti(spaceEquipments && spaceEquipments.data ? spaceEquipments.data : [], 'location_id', 'id'), 'id', 'reading_lines_ids');

  const currentThresholds = currentThresholds1 && currentThresholds1.length ? currentThresholds1[0] : [];

  const currentThresholdsv2 = currentThresholds1 && currentThresholds1.length > 0 ? currentThresholds1[1] : [];

  const currentThresholdsv3 = currentThresholds1 && currentThresholds1.length > 1 ? currentThresholds1[2] : [];

  function getThresholdData(data, i) {
    let cdata = [];
    if (data && data.length) {
      const sEqips = spaceEquipments && spaceEquipments.data;
      const lName = sEqips && sEqips.length && sEqips[i] ? sEqips[i].location_id.space_name : '';
      cdata = data.map((cl) => ({
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
        dataId: cl.id,
        locationName: lName,
      }));
    }
    cdata = cdata.length ? cdata.sort((a, b) => a.sequence - b.sequence) : [];
    return cdata;
  }

  const sensorData = equipmentSensorsInfo && equipmentSensorsInfo.data && equipmentSensorsInfo.data.aggregations && equipmentSensorsInfo.data.aggregations.unique_id
  && equipmentSensorsInfo.data.aggregations.unique_id.buckets ? equipmentSensorsInfo.data.aggregations.unique_id.buckets : [];

  return (
    <ResponsiveReactGridLayout
      className="row row-cols-sm-12"
      cols={{
        lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
      }}
      breakpoints={{
        lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0,
      }}
      rowHeight={30}
      layouts={layouts1}
      isDraggable={editMode}
      isResizable={editMode}
      isBounded
      onLayoutChange={(layout, layoutss) => {
        onLayoutChange(layout, layoutss);
      }}
    >
      {spaceEquipments && spaceEquipments.data && spaceEquipments.data.map((reads) => (
        <div
          key={reads.id}
          data-grid={defaultLayout(reads.id, '')}
          id={`id${reads.id}`}
          className=""
        >
          <div className="text-center p-0 bg-med-blue-dashboard">
            <h3 className="background-lightgray">{reads.location_id.space_name}</h3>
          </div>
        </div>
      ))}
      {currentThresholds && currentThresholds.length > 0 && getThresholdData(currentThresholds, 0).map((ct) => (
        (ct.dataname === 'temperature_F' || ct.dataname === 'humidity' || ct.dataname === 'voc' || ct.dataname === 'Winsen_CO' || ct.dataname === 'co2Value') && (
        <div
          key={ct.dataId}
          data-grid={defaultLayout(ct.dataId, '')}
          id={`id${ct.dataId}`}
          className="shadow-card-dashboard bg-white"
        >
          <Readings sensorData={sensorData} reads={ct} height={getDimension(ct.dataId).h} width={getDimension(ct.dataId).w} />
        </div>
        )
      ))}
      {currentThresholdsv2 && currentThresholdsv2.length > 0 && getThresholdData(currentThresholdsv2, 1).map((ct) => (
        (ct.dataname === 'temperature_F' || ct.dataname === 'humidity' || ct.dataname === 'voc' || ct.dataname === 'Winsen_CO' || ct.dataname === 'co2Value') && (
        <div
          key={ct.dataId}
          data-grid={defaultLayout(ct.dataId, '')}
          id={`id${ct.dataId}`}
          className="shadow-card-dashboard bg-white"
        >
          <Readings sensorData={sensorData} reads={ct} height={getDimension(ct.dataId).h} width={getDimension(ct.dataId).w} />
        </div>
        )
      ))}
      {currentThresholdsv3 && currentThresholdsv3.length > 0 && getThresholdData(currentThresholdsv3, 2).map((ct) => (
        (ct.dataname === 'temperature_F' || ct.dataname === 'humidity' || ct.dataname === 'voc' || ct.dataname === 'Winsen_CO' || ct.dataname === 'co2Value') && (
        <div
          key={ct.dataId}
          data-grid={defaultLayout(ct.dataId, '')}
          id={`id${ct.dataId}`}
          className="shadow-card-dashboard bg-white"
        >
          <Readings sensorData={sensorData} reads={ct} height={getDimension(ct.dataId).h} width={getDimension(ct.dataId).w} />
        </div>
        )
      ))}
    </ResponsiveReactGridLayout>
  );
});

export default ChartCards;
