/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";


import { setCurrentThreshold } from "../assets/equipmentService";

import {
  ctofconvertion,
  detectMob,
  translateText,
} from "../util/appUtils";

import customData from "../antDashboards/data/customData.json";

// import GaugeChart from "../antDashboards/singleDataComponents/gaugePlotly";

const Readings = (props) => {
  const { reads, sensorData, width, height } = props;
  const sectionData =
    customData && customData.readings ? customData.readings : []; // groupByMultiple(customData.readings, (obj) => (obj.section)) : [];

  const isMob = detectMob();

  const mobCol = isMob ? 6 : 12;
  const widthColumn = 3;
  const fontSize = 14;

  const isShowIndoor = true;

  const [currentType, setType] = useState("");

  const outdoorSpaceId = 69039;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const { currentThreshold } = useSelector((state) => state.equipment);

  function getCurrentThresholdValues(value, lineObj) {
    let res = {
      color_code: "Green",
      impact: "None",
      suggestion: "None",
      scale: "Good",
      source: "",
      definition: "None",
    };
    if (lineObj && lineObj.length) {
      const fdata = lineObj.filter(
        (li) =>
          parseInt(value) >= parseInt(li.min) &&
          parseInt(value) <= parseInt(li.max)
      );
      if (fdata && fdata.length) {
        res = {
          color_code: fdata[0].color_code,
          impact: fdata[0].impact,
          scale: fdata[0].name,
          suggestion: fdata[0].suggestion,
          source: fdata[0].source,
          definition: fdata[0].definition,
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
        name,
        min,
        max,
        threshold_line,
      });
      dispatch(
        setCurrentThreshold([
          ...new Map(data.map((item) => [item.name, item])).values(),
        ])
      );
    }
    setType(type);
  };

  function getValueOfSensor(key) {
    let count = 0;
    let finalValue = 0;
    if (sensorData && sensorData.length) {
      const inData = sensorData.filter((data) => data.key !== outdoorSpaceId);
      if (inData && inData.length) {
        for (let i = 0; i < inData.length; i += 1) {
          if (
            inData[i].top_result &&
            inData[i].top_result.hits &&
            inData[i].top_result.hits.hits &&
            inData[i].top_result.hits.hits.length
          ) {
            const singleData = inData[i].top_result.hits.hits;
            let threshold = singleData[0]._source[key]
              ? singleData[0]._source[key]
              : 0;
            if (key === "pressure") {
              threshold = parseInt(threshold / 100);
            }
            if (key === "dew") {
              threshold = ctofconvertion(threshold);
            }
            if (key === "voc") {
              threshold = singleData[0]._source.Winsen_CH2O * 1000;
            }
            count += threshold;
          }
        }
        finalValue =
          count > 0 ? parseFloat(count / inData.length).toFixed(2) : 0;
        if (key === "pressure") {
          finalValue = parseInt(finalValue);
        }
      }
    }
    // console.log(key);
    // console.log(finalValue);
    return finalValue; // return column data..
  }

  const content = (name, type, dataname, tLines) => (
    <>
      {type === "indoor" && (
        <div className="bg-white p-1">
          <h5 className="text-info mb-0">{name}</h5>
          <hr className="m-0 border-info" />
          <div className="p-2 text-center">
            <h6 className="text-info">
              {translateText("Definition", userInfo)}
            </h6>
            <p className="text-black font-tiny">
              {
                getCurrentThresholdValues(getValueOfSensor(dataname), tLines)
                  .definition
              }
            </p>
            <h6 className="text-info">{translateText("Impact", userInfo)}</h6>
            <p className="text-black font-tiny">
              {
                getCurrentThresholdValues(getValueOfSensor(dataname), tLines)
                  .impact
              }
            </p>
            <h6 className="text-info">
              {translateText("Suggestions", userInfo)}
            </h6>
            <p className="text-black font-tiny">
              {
                getCurrentThresholdValues(getValueOfSensor(dataname), tLines)
                  .suggestion
              }
            </p>
          </div>
          {getCurrentThresholdValues(getValueOfSensor(dataname), tLines)
            .source && (
            <>
              <hr className="m-0 border-info" />
              <p className="text-black mt-0 mb-0 font-tiny-xs">
                {translateText("Source", userInfo)}:{" "}
                {
                  getCurrentThresholdValues(getValueOfSensor(dataname), tLines)
                    .source
                }
              </p>
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <div
      className="pr-3"
      key={reads.name}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <Tooltip
        title={`${reads.name} (${reads.locationName})`}
        placement="top"
        color={
          getCurrentThresholdValues(
            getValueOfSensor(reads.dataname),
            reads.threshold_line
          ).color_code
        }
      >
        { /* <GaugeChart
          color={
            getCurrentThreshold(reads.name, "indoor")
              ? "white"
              : getCurrentThresholdValues(
                  getValueOfSensor(reads.dataname),
                  reads.threshold_line
                ).color_code
          }
          uom={reads.uom}
          rangeColor={
            getCurrentThreshold(reads.name, "indoor")
              ? "#686666"
              : getCurrentThresholdValues(
                  getValueOfSensor(reads.dataname),
                  reads.threshold_line
                ).color_code
          }
          value={getValueOfSensor(reads.dataname)}
          maxValue={reads.max}
          minValue={reads.min}
          fontSize={fontSize}
          height={height - 5}
          width={width - 5}
          reads={reads}
        /> */}
        <p className="m-0" />
      </Tooltip>
    </div>
  );
};

Readings.propTypes = {
  reads: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]).isRequired,
  sensorData: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]).isRequired,
  width: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
};

export default Readings;
