/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import Plotly from 'react-plotly.js';
import PlotlyCert from 'plotly.js/dist/plotly-cartesian';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import ModalNoPadHead from '@shared/modalNoPadHead';

import {
  ctofconvertion,
  translateText,
} from '../../util/appUtils';

const GaugeChart = (props) => {
  const {
    color,
    rangeColor,
    value,
    uom,
    maxValue,
    minValue,
    fontSize,
    width,
    height,
    reads,
    sensorData,
  } = props;

  const [isViewTitle, setViewTitle] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const data = [
    {
      type: 'indicator',
      mode: 'gauge+number',
      value,
      title: { text: `${reads.shortCode}(${uom})`, color, font: { size: fontSize, color } },
      gauge: {
        axis: {
          range: [minValue, maxValue], tickwidth: 1, tickcolor: rangeColor, automargin: true,
        },
        bar: { color: rangeColor },
        bgcolor: 'white',
        borderwidth: 2,
        steps: [
          { range: [minValue, value], color },
          { range: [value, maxValue], color: 'white' },
        ],
      },
    },
  ];

  const outdoorSpaceId = 69039;

  const layout = {
    width,
    height,
    margin: {
      t: 40, r: 40, l: 40, b: 10, pad: 0,
    },
  };

  const config = {
    showLink: false,
    displaylogo: false,
    responsive: true,
    reads: false,
  };

  function getValueOfSensor(key) {
    let count = 0;
    let finalValue = 0;
    if (sensorData && sensorData.length) {
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
    }
    // console.log(key);
    // console.log(finalValue);
    return finalValue; // return column data..
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

  const content = (name, type, dataname, tLines) => (
    <>
      {type === 'indoor' && (
      <div className="bg-white p-1">
        <div className="p-2 text-center">
          <h6 className="text-info">Scale</h6>
          <p
            className="font-tiny"
            style={{ color: getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).color_code }}
          >
            {getCurrentThresholdValues(getValueOfSensor(reads.dataname), reads.threshold_line).scale}
          </p>
          <h6 className="text-info">{translateText('Definition', userInfo)}</h6>
          <p className="text-black font-tiny">{getCurrentThresholdValues(getValueOfSensor(dataname), tLines).definition}</p>
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

  const onViewTitle = () => {
    setViewTitle(true);
  };

  const modeBarButtonsToAdd = [
    {
      name: 'Info',
      width: 15,
      height: 15,
      icon: PlotlyCert.Icons.question,
      direction: 'up',
      click: (gd) => {
        onViewTitle();
      },
    }];

  return (
    <>
      <Plotly
        layout={layout}
        data={data}
        config={{
          ...config,
          modeBarButtonsToAdd,
        }}
        style={{ width: '100%', height: '100%' }}
      />
      <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={isViewTitle}>
        <ModalNoPadHead title={reads.name} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setViewTitle(false)} />
        <ModalBody className="pl-3 pt-0 pr-3 pb-3">
          {content(reads.name, 'indoor', reads.dataname, reads.threshold_line)}
        </ModalBody>
      </Modal>
    </>
  );
};

GaugeChart.defaultProps = {
  width: false,
  height: false,
  reads: false,
};

GaugeChart.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  uom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fontSize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  maxValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  minValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  rangeColor: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  sensorData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  reads: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};

export default GaugeChart;
