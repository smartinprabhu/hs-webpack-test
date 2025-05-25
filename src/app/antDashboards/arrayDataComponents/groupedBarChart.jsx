/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Column } from '@ant-design/plots';
import * as PropTypes from 'prop-types';

import { extractNameObject, getAQIValue } from '../../util/appUtils';

const GroupedBarChart = (props) => {
  const {
    barData,
    xField,
    yField,
    seriesField,
    eqData,
    outdoorData,
  } = props;

  const outdoorSpaceId = 69039;

  const isShowIndoor = (eqData && extractNameObject(eqData.location_id, 'space_name') !== 'Outdoor Area') || (!eqData);

  function getBarValues() {
    // let inCoTotalCount = 0;
    let inCo2TotalCount = 0;
    let inNo2TotalCount = 0;
    let inIaqTotalCount = 0;
    let inPm10TotalCount = 0;
    let outCo2TotalCount = 0;
    let outNo2TotalCount = 0;
    let outPm2TotalCount = 0;
    let outPm10TotalCount = 0;
    const finalValues = [];

    if (barData && barData.length) {
      if (!eqData) {
        const inData = barData.filter((data) => data.key !== outdoorSpaceId);
        // const outData = outdoorData; // barData.filter((data) => data.key === outdoorSpaceId);
        if (inData && inData.length && isShowIndoor) {
          for (let i = 0; i < inData.length; i += 1) {
            if (inData[i].top_result && inData[i].top_result.hits && inData[i].top_result.hits.hits && inData[i].top_result.hits.hits.length) {
              const singleData = inData[i].top_result.hits.hits;
              if (singleData[0]._source.Winsen_CO2) {
                inCo2TotalCount += singleData[0]._source.Winsen_CO2;
              }
              if (singleData[0]._source.voc) {
                inNo2TotalCount += parseInt(singleData[0]._source.Winsen_CH2O * 1000);
              }
              if (singleData[0]._source.iaq) {
                inIaqTotalCount += singleData[0]._source.Winsen_pm_2_5;
              }
              if (singleData[0]._source.Winsen_pm_10) {
                inPm10TotalCount += singleData[0]._source.Winsen_pm_10;
              }
            }
          }
          finalValues.push(
            // { type: 'Indoor', threshold: 'Carbon Monoxide(CO)', value: inCoTotalCount > 0 ? parseInt(inCoTotalCount / inData.length) : 0 },
            { type: 'Indoor', threshold: 'NDIR CO2', value: inCo2TotalCount > 0 ? parseInt(inCo2TotalCount / inData.length) : 0 },
            { type: 'Indoor', threshold: 'TVOC', value: inNo2TotalCount > 0 ? parseInt(inNo2TotalCount / inData.length) : 0 },
            { type: 'Indoor', threshold: 'AQI', value: inIaqTotalCount > 0 ? getAQIValue(parseInt(inPm10TotalCount / inData.length), parseInt(inIaqTotalCount / inData.length)) : 0 },
          );
        }
      } else {
        const eqValue = barData.filter((data) => data.key === eqData.id);
        // barData.filter((data) => data.key === outdoorSpaceId);
        if (eqValue && eqValue.length && isShowIndoor) {
          const singleData = eqValue[0].top_result.hits.hits;
          if (singleData[0]._source.Winsen_CO2) {
            finalValues.push(
              { type: 'Indoor', threshold: 'NDIR CO2', value: singleData[0]._source.Winsen_CO2 > 0 ? parseInt(singleData[0]._source.Winsen_CO2) : 0 },
            );
          }
          if (singleData[0]._source.voc) {
            finalValues.push(
              { type: 'Indoor', threshold: 'TVOC', value: singleData[0]._source.voc > 0 ? parseInt(singleData[0]._source.Winsen_CH2O * 1000) : 0 },
            );
          }
          /* if (singleData[0]._source.Winsen_NO2) {
            finalValues.push(
              { type: 'Indoor', threshold: 'Nitrogen Dioxide (NO2)', value: singleData[0]._source.Winsen_NO2 > 0 ? parseInt(singleData[0]._source.Winsen_NO2) : 0 },
            );
          } */
          if (singleData[0]._source.iaq) {
            finalValues.push(
              { type: 'Indoor', threshold: 'AQI', value: singleData[0]._source.iaq > 0 ? getAQIValue(singleData[0]._source.Winsen_pm_10, singleData[0]._source.Winsen_pm_2_5) : 0 },
            );
          }
        }
      }
    }
    if (outdoorData && outdoorData.length) {
      const outData = outdoorData;
      if (!eqData) {
        for (let i = 0; i < outData.length; i += 1) {
          if (outData[i].top_result && outData[i].top_result.hits && outData[i].top_result.hits.hits && outData[i].top_result.hits.hits.length) {
            const singleData = outData[i].top_result.hits.hits;
            if (singleData[0]._source.Winsen_CO2) {
              outCo2TotalCount += singleData[0]._source.Winsen_CO2;
            }
            if (singleData[0]._source.voc) {
              outNo2TotalCount += parseInt(singleData[0]._source.Winsen_CH2O * 1000);
            }
            if (singleData[0]._source.Winsen_pm_2_5) {
              outPm2TotalCount += singleData[0]._source.Winsen_pm_2_5;
            }
            if (singleData[0]._source.Winsen_pm_10) {
              outPm10TotalCount += singleData[0]._source.Winsen_pm_10;
            }
          }
        }
        finalValues.push(
          // { type: 'Outdoor', threshold: 'Carbon Monoxide(CO)', value: outCoTotalCount > 0 ? parseInt(outCoTotalCount / outData.length) : 0 },
          { type: 'Outdoor', threshold: 'NDIR CO2', value: outCo2TotalCount > 0 ? parseInt(outCo2TotalCount / outData.length) : 0 },
          { type: 'Outdoor', threshold: 'TVOC', value: outNo2TotalCount > 0 ? parseInt(outNo2TotalCount / outData.length) : 0 },
          { type: 'Outdoor', threshold: 'AQI', value: outPm2TotalCount > 0 ? getAQIValue(outPm10TotalCount, outPm2TotalCount) : 0 },
        );
      } else {
        const singleData = outData[0].top_result.hits.hits;
        if (singleData[0]._source.Winsen_CO2) {
          finalValues.push(
            { type: 'Outdoor', threshold: 'NDIR CO2', value: singleData[0]._source.Winsen_CO2 > 0 ? parseInt(singleData[0]._source.Winsen_CO2) : 0 },
          );
        }
        if (singleData[0]._source.voc) {
          finalValues.push(
            { type: 'Outdoor', threshold: 'TVOC', value: singleData[0]._source.Winsen_CH2O > 0 ? parseInt(singleData[0]._source.Winsen_CH2O * 1000) : 0 },
          );
        }
        if (singleData[0]._source.iaq) {
          finalValues.push(
            { type: 'Outdoor', threshold: 'AQI', value: singleData[0]._source.Winsen_pm_2_5 > 0 ? getAQIValue(singleData[0]._source.Winsen_pm_10, singleData[0]._source.Winsen_pm_2_5) : 0 },
          );
        }
      }
    }
    return finalValues; // return column data..
  }

  const config = {
    data: getBarValues(barData),
    isGroup: true,
    xField,
    yField,
    height: 350,
    width: 350,
    seriesField,
    colorField: seriesField, // or seriesField in some cases
    color: ({ type }) => {
      let res = '#6395f9';
      if (type === 'Outdoor') {
        res = '#6395f9';
      } else if (type === 'Indoor') {
        res = '#62daab';
      }
      return res;
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };

  return (
    <div className="position-relative p-2">
      <Column {...config} />
    </div>
  );
};

GroupedBarChart.propTypes = {
  barData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  xField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  yField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  seriesField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  eqData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  outdoorData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};

export default GroupedBarChart;
