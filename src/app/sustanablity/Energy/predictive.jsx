import React, {
  useEffect, useState, useRef, useCallback, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import Plot from 'react-plotly.js';
import { getSequencedMenuItems } from '../../util/appUtils';
import Card from './CardRes';
import PlotTypeSelector from './PlotSelector';
import { useTheme } from '../../ThemeContext';
import './EnergyAnalytics.css';
import performance from './image/Performance.svg';
import target from './image/TargetGoal.svg';
import totalcost from './image/totalcost.svg';

// Function to parse API plot data
const parseApiData = (apiData) => {
  if (!apiData) {
    console.warn('No valid plot data found in API response');
    return { traces: [], layout: {}, Root_Cause_Analysis: [] };
  }

  let plotData = apiData;
  let layoutVh = {};
  let rootCauseAnalysis = [];

  if (Array.isArray(apiData) && apiData.length > 0 && Array.isArray(apiData[0]) && apiData[0][0] === 'Data') {
    plotData = apiData[0][1]?.plot || {};
    layoutVh = apiData[0][1]?.layout || {};
    rootCauseAnalysis = apiData[0][1]?.Root_Cause_Analysis || [];
  } else if (apiData.data && Array.isArray(apiData.data)) {
    plotData = apiData;
    layoutVh = apiData.layout || {};
    rootCauseAnalysis = apiData.Root_Cause_Analysis || [];
  } else {
    console.warn('Unexpected API response structure:', apiData);
  }

  const traces = plotData.data || [];
  if (!Array.isArray(traces)) {
    console.warn('Plot data is not an array:', traces);
    return { traces: [], layout: layoutVh, Root_Cause_Analysis: rootCauseAnalysis };
  }

  return { traces, layout: layoutVh, Root_Cause_Analysis: rootCauseAnalysis };
};

// Aggregation logic
const aggregateData = (trace, plotType, currentTime, selectedDate) => {
  if (!trace || !trace.x || !trace.y || !Array.isArray(trace.x) || !Array.isArray(trace.y)) {
    console.warn(`Invalid trace data for ${trace?.name || 'unknown'}:`, trace);
    return {
      ...trace,
      x: [],
      y: [],
      aggregatedSum: 0,
      previousSum: 0,
      lastValue: 0,
    };
  }

  const now = new Date(currentTime);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);
  const selected = selectedDate ? new Date(selectedDate) : localNow;

  const filterDataByRange = (x, y, days) => {
    const filteredX = [];
    const filteredY = [];
    let sum = 0;
    let lastValue = 0;
    let latestTimestamp = null;
    const startDate = new Date(selected);
    startDate.setDate(selected.getDate() - Math.floor(days / 2));
    const endDate = new Date(selected);
    endDate.setDate(selected.getDate() + Math.ceil(days / 2));

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startDate && date <= endDate) {
          filteredX.push(timestamp);
          filteredY.push(y[index] || 0);
          sum += y[index] || 0;
          if (!latestTimestamp || date > latestTimestamp) {
            latestTimestamp = date;
            lastValue = y[index] || 0;
          }
        }
      } catch (error) {
        console.error(`Error parsing timestamp at index ${index} for ${trace.name}: ${timestamp}`, error);
      }
    });

    return {
      x: filteredX, y: filteredY, sum, lastValue,
    };
  };

  const filterLast24Hours = (x, y) => {
    const filteredX = [];
    const filteredY = [];
    const previousX = [];
    const previousY = [];
    let sum = 0;
    let previousSum = 0;
    let lastValue = 0;
    let latestTimestamp = null;
    const startCurrent = new Date(selected.getTime() - 24 * 60 * 60 * 1000);
    const endCurrent = selected;
    const startPrevious = new Date(selected.getTime() - 48 * 60 * 60 * 1000);
    const endPrevious = startCurrent;

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startCurrent && date <= endCurrent) {
          filteredX.push(timestamp);
          filteredY.push(y[index] || 0);
          sum += y[index] || 0;
          if (!latestTimestamp || date > latestTimestamp) {
            latestTimestamp = date;
            lastValue = y[index] || 0;
          }
        } else if (date >= startPrevious && date < endPrevious) {
          previousX.push(timestamp);
          previousY.push(y[index] || 0);
          previousSum += y[index] || 0;
        }
      } catch (error) {
        console.error(`Error parsing timestamp at index ${index} for ${trace.name}: ${timestamp}`, error);
      }
    });

    return {
      x: filteredX, y: filteredY, sum, previousSum, lastValue,
    };
  };

  const aggregateByDay = (x, y, days) => {
    const dailyData = {};
    const previousDailyData = {};
    let sum = 0;
    let previousSum = 0;
    let lastValue = 0;
    let latestTimestamp = null;

    const startDate = new Date(selected);
    startDate.setDate(selected.getDate() - Math.floor(days / 2));
    const endDate = new Date(selected);
    endDate.setDate(selected.getDate() + Math.ceil(days / 2));
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - days);

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp in aggregateByDay at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        const dateKey = date.toISOString().split('T')[0];
        if (date >= startDate && date <= endDate) {
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
              sum: 0, count: 0, latest: null, latestValue: 0,
            };
          }
          dailyData[dateKey].sum += y[index] || 0;
          dailyData[dateKey].count += 1;
          sum += y[index] || 0;
          if (!dailyData[dateKey].latest || date > dailyData[dateKey].latest) {
            dailyData[dateKey].latest = date;
            dailyData[dateKey].latestValue = y[index] || 0;
            if (!latestTimestamp || date > latestTimestamp) {
              latestTimestamp = date;
              lastValue = y[index] || 0;
            }
          }
        } else if (date >= prevStartDate && date < startDate) {
          if (!previousDailyData[dateKey]) {
            previousDailyData[dateKey] = { sum: 0, count: 0 };
          }
          previousDailyData[dateKey].sum += y[index] || 0;
          previousDailyData[dateKey].count += 1;
          previousSum += y[index] || 0;
        }
      } catch (error) {
        console.error(`Error in aggregateByDay for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    const aggregatedX = [];
    const aggregatedY = [];
    Object.keys(dailyData)
      .sort()
      .forEach((date) => {
        aggregatedX.push(`${date}T00:00:00+05:30`);
        aggregatedY.push(
          trace.name === 'Actual_Temp' || trace.name === 'Forecast_temp'
            ? dailyData[date].sum / dailyData[date].count
            : dailyData[date].sum,
        );
      });

    return {
      x: aggregatedX, y: aggregatedY, sum, previousSum, lastValue,
    };
  };

  const aggregateByYear = (x, y) => {
    const yearlyData = {};
    const sum = 0;
    let previousSum = 0;
    let lastValue = 0;
    let latestTimestamp = null;
    const selectedYear = selected.getFullYear();
    const currentYearStart = new Date(selectedYear, 0, 1);
    const currentYearEnd = new Date(selectedYear, 11, 31, 23, 59, 59);
    const previousYearStart = new Date(selectedYear - 1, 0, 1);
    const previousYearEnd = new Date(selectedYear - 1, 11, 31, 23, 59, 59);

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp in aggregateByYear at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        const year = date.getFullYear();
        const monthYear = date.toISOString().slice(0, 7);
        if (!yearlyData[year]) {
          yearlyData[year] = { months: {}, sum: 0, count: 0 };
        }
        if (!yearlyData[year].months[monthYear]) {
          yearlyData[year].months[monthYear] = {
            sum: 0, count: 0, latest: null, latestValue: 0,
          };
        }
        yearlyData[year].months[monthYear].sum += y[index] || 0;
        yearlyData[year].months[monthYear].count += 1;
        yearlyData[year].sum += y[index] || 0;
        yearlyData[year].count += 1;
        if (year === selectedYear && (!yearlyData[year].months[monthYear].latest || date > yearlyData[year].months[monthYear].latest)) {
          yearlyData[year].months[monthYear].latest = date;
          yearlyData[year].months[monthYear].latestValue = y[index] || 0;
          if (!latestTimestamp || date > latestTimestamp) {
            latestTimestamp = date;
            lastValue = y[index] || 0;
          }
        }
        if (date >= previousYearStart && date <= previousYearEnd) {
          previousSum += y[index] || 0;
        }
      } catch (error) {
        console.error(`Error in aggregateByYear for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    const aggregatedX = [];
    const aggregatedY = [];
    if (yearlyData[selectedYear]) {
      Object.keys(yearlyData[selectedYear].months)
        .sort()
        .forEach((monthYear) => {
          aggregatedX.push(`${monthYear}-01T00:00:00+05:30`);
          aggregatedY.push(
            trace.name === 'Actual_Temp' || trace.name === 'Forecast_temp'
              ? yearlyData[selectedYear].months[monthYear].sum / yearlyData[selectedYear].months[monthYear].count
              : yearlyData[selectedYear].months[monthYear].sum,
          );
        });
    }

    return {
      x: aggregatedX, y: aggregatedY, sum: yearlyData[selectedYear]?.sum || 0, previousSum, lastValue,
    };
  };

  let filteredTrace = { ...trace };
  let aggregatedSum = 0;
  let previousSum = 0;
  let lastValue = 0;

  if (plotType === 'Day') {
    const result = filterLast24Hours(trace.x, trace.y);
    filteredTrace = { x: result.x, y: result.y };
    aggregatedSum = result.sum;
    previousSum = result.previousSum;
    lastValue = result.lastValue;
  } else if (plotType === 'Week') {
    const filtered = filterDataByRange(trace.x, trace.y, 14);
    const aggregated = aggregateByDay(filtered.x, filtered.y, 14);
    filteredTrace = { x: aggregated.x, y: aggregated.y };
    aggregatedSum = aggregated.sum;
    previousSum = aggregated.previousSum;
    lastValue = aggregated.lastValue;
  } else if (plotType === 'Month') {
    const filtered = filterDataByRange(trace.x, trace.y, 60);
    const aggregated = aggregateByDay(filtered.x, filtered.y, 60);
    filteredTrace = { x: aggregated.x, y: aggregated.y };
    aggregatedSum = aggregated.sum;
    previousSum = aggregated.previousSum;
    lastValue = aggregated.lastValue;
  } else if (plotType === 'Year') {
    const filtered = filterDataByRange(trace.x, trace.y, 730);
    const aggregated = aggregateByYear(filtered.x, filtered.y);
    filteredTrace = { x: aggregated.x, y: aggregated.y };
    aggregatedSum = aggregated.sum;
    previousSum = aggregated.previousSum;
    lastValue = aggregated.lastValue;
  }

  return {
    ...trace,
    ...filteredTrace,
    type: trace.name === 'Actual_Consumption' ? 'bar' : 'scatter',
    aggregatedSum,
    previousSum,
    lastValue,
  };
};

// Calculate KPI
const calculateKPI = (traces, plotType, lastUpdated, costPerKWh, apiData) => {
  const now = new Date(lastUpdated);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);

  const consumptionTrace = traces.find((t) => t.name?.trim() === 'Actual_Consumption');
  const forecastTrace = traces.find((t) => t.name?.trim() === 'Forecasted_Consumption');
  const targetTrace = traces.find((t) => t.name?.trim() === 'Actual_Target');

  let forecastMetrics = { Target_goal: 'N/A', Cost: 'N/A', Emission: 'N/A' };
  let performanceMetrics = { Performance_Metrics: 'N/A', Energy_Savings: 'N/A', Cost_Reduction: 'N/A' };
  let actualVsForecast = {
    Actual_Forecast: 'N/A', Actual: 'N/A', Forecast: 'N/A', Difference: 'N/A',
  };
  const modelEvaluationMetrics = {
    Evaluation_Metrics: 'N/A', Mae: 'N/A', Rmse: 'N/A', R2: 'N/A',
  };

  const aggregateActualVsForecast = (actualTrace, forecastTrace, plotType) => {
    if (!actualTrace || !forecastTrace || !actualTrace.x || !forecastTrace.x) {
      return { actualSum: 0, forecastSum: 0 };
    }

    const selected = new Date(lastUpdated);
    let actualSum = 0;
    let forecastSum = 0;

    if (plotType === 'Day') {
      const startCurrent = new Date(selected.getTime() - 24 * 60 * 60 * 1000);
      const endCurrent = selected;

      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startCurrent && date <= endCurrent) {
          actualSum += actualTrace.y[index] || 0;
        }
      });

      forecastTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startCurrent && date <= endCurrent) {
          forecastSum += forecastTrace.y[index] || 0;
        }
      });
    } else if (plotType === 'Week') {
      const selectedDay = selected.getDay();
      const startOfWeek = new Date(selected);
      startOfWeek.setDate(selected.getDate() - (selectedDay === 0 ? 6 : selectedDay - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfWeek && date <= selected) {
          actualSum += actualTrace.y[index] || 0;
        }
      });

      forecastTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date > selected && date <= endOfWeek) {
          forecastSum += forecastTrace.y[index] || 0;
        }
      });

      forecastSum += actualSum;
    } else if (plotType === 'Month') {
      const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      const endOfMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 23, 59, 59, 999);

      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfMonth && date <= selected) {
          actualSum += actualTrace.y[index] || 0;
        }
      });

      forecastTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date > selected && date <= endOfMonth) {
          forecastSum += forecastTrace.y[index] || 0;
        }
      });

      forecastSum += actualSum;
    } else if (plotType === 'Year') {
      const startOfYear = new Date(selected.getFullYear(), 0, 1);
      const endOfYear = new Date(selected.getFullYear(), 11, 31, 23, 59, 59, 999);

      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfYear && date <= selected) {
          actualSum += actualTrace.y[index] || 0;
        }
      });

      forecastTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date > selected && date <= endOfYear) {
          forecastSum += forecastTrace.y[index] || 0;
        }
      });

      forecastSum += actualSum;
    }

    return { actualSum, forecastSum };
  };

  const calculateMeanConsumption = (actualTrace, plotType) => {
    if (!actualTrace || !actualTrace.x) {
      return { mean: 0, count: 0 };
    }

    const selected = new Date(lastUpdated);
    let sum = 0;
    let count = 0;

    if (plotType === 'Day') {
      const startCurrent = new Date(selected.getTime() - 24 * 60 * 60 * 1000);
      const endCurrent = selected;

      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startCurrent && date <= endCurrent) {
          sum += actualTrace.y[index] || 0;
          count += 1;
        }
      });
    } else if (plotType === 'Week') {
      const startOfPeriod = new Date(selected);
      startOfPeriod.setDate(selected.getDate() - 7);

      const dailySums = {};
      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfPeriod && date <= selected) {
          const dateKey = date.toISOString().split('T')[0];
          if (!dailySums[dateKey]) {
            dailySums[dateKey] = 0;
          }
          dailySums[dateKey] += actualTrace.y[index] || 0;
        }
      });

      Object.values(dailySums).forEach((dailySum) => {
        sum += dailySum;
        count += 1;
      });
    } else if (plotType === 'Month') {
      const startOfPeriod = new Date(selected);
      startOfPeriod.setDate(selected.getDate() - 30);

      const dailySums = {};
      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfPeriod && date <= selected) {
          const dateKey = date.toISOString().split('T')[0];
          if (!dailySums[dateKey]) {
            dailySums[dateKey] = 0;
          }
          dailySums[dateKey] += actualTrace.y[index] || 0;
        }
      });

      Object.values(dailySums).forEach((dailySum) => {
        sum += dailySum;
        count += 1;
      });
    } else if (plotType === 'Year') {
      const startOfPeriod = new Date(selected);
      startOfPeriod.setFullYear(selected.getFullYear() - 1);

      const monthlySums = {};
      actualTrace.x.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        if (date >= startOfPeriod && date <= selected) {
          const monthKey = date.toISOString().slice(0, 7);
          if (!monthlySums[monthKey]) {
            monthlySums[monthKey] = 0;
          }
          monthlySums[monthKey] += actualTrace.y[index] || 0;
        }
      });

      Object.values(monthlySums).forEach((monthlySum) => {
        sum += monthlySum;
        count += 1;
      });
    }

    return { mean: count > 0 ? sum / count : 0, count };
  };

  if (consumptionTrace && consumptionTrace.aggregatedSum !== undefined) {
    const forecastConsumption = consumptionTrace.aggregatedSum || 0;
    const emissionFactor = 0.71;

    if (forecastConsumption === 0) {
      console.warn(`No data for Forecast in ${plotType} period`);
    } else {
      const cost = forecastConsumption * costPerKWh;
      const emission = forecastConsumption * emissionFactor;

      forecastMetrics = {
        Target_goal: `${forecastConsumption.toFixed(2)} kWh`,
        Cost: `$${cost.toFixed(2)}`,
        Emission: `${emission.toFixed(2)} tCO2e`,
      };
    }
  }

  if (consumptionTrace && targetTrace && consumptionTrace.aggregatedSum !== undefined && targetTrace.aggregatedSum !== undefined) {
    const totalConsumption = consumptionTrace.aggregatedSum || 0;
    const targetConsumption = targetTrace.aggregatedSum || 0;

    if (totalConsumption === 0 || targetConsumption === 0) {
      console.warn(`No data for Actual_Consumption or Actual_Target in ${plotType} period`);
    } else {
      const energySavings = ((targetConsumption - totalConsumption) / targetConsumption) * 100;
      const totalCost = totalConsumption * costPerKWh;
      const targetCost = targetConsumption * costPerKWh;
      const costReduction = ((targetCost - totalCost) / targetCost) * 100;

      performanceMetrics = {
        Performance_Metrics: `${totalConsumption.toFixed(2)} kWh`,
        Energy_Savings: `${energySavings.toFixed(2)}%`,
        Cost_Reduction: `${costReduction.toFixed(2)}%`,
      };
    }
  }

  if (consumptionTrace && forecastTrace) {
    const { actualSum, forecastSum } = aggregateActualVsForecast(consumptionTrace, forecastTrace, plotType);
    const difference = actualSum - forecastSum;

    actualVsForecast = {
      Actual_Forecast: `${(actualSum + forecastSum).toFixed(2)} kWh`,
      Actual: `${actualSum.toFixed(2)} kWh`,
      Forecast: `${forecastSum.toFixed(2)} kWh`,
      Difference: `${difference.toFixed(2)} kWh`,
    };
  }

  if (consumptionTrace) {
    const { mean } = calculateMeanConsumption(consumptionTrace, plotType);
    modelEvaluationMetrics.Evaluation_Metrics = `${mean.toFixed(2)} kWh`;

    if (apiData && Array.isArray(apiData) && apiData.length > 0 && apiData[0][0] === 'Data' && apiData[0][1]?.metrics) {
      const { metrics } = apiData[0][1];
      modelEvaluationMetrics.Mae = metrics.MAE !== undefined ? metrics.MAE.toFixed(3) : 'N/A';
      modelEvaluationMetrics.Rmse = metrics.RMSE !== undefined ? metrics.RMSE.toFixed(3) : 'N/A';
      modelEvaluationMetrics.R2 = metrics.R2 !== undefined ? metrics.R2.toFixed(3) : 'N/A';
    }
  }

  return {
    forecastMetrics, performanceMetrics, actualVsForecast, modelEvaluationMetrics,
  };
};

const Predictive = ({
  defaultDate, headerText, showBackButton, onBackButtonClick, fontSize, equipmentId, uuid,
  code,
}) => {
  const [menu, setMenu] = useState({});
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(defaultDate);
  const [plotData, setPlotData] = useState({});
  const [traceVisibility, setTraceVisibility] = useState({});
  const [error, setError] = useState('');
  const [plotType, setPlotType] = useState('Day');
  const [isLoading, setIsLoading] = useState(false);
  const plotContainerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const isDropdown = useMediaQuery('(max-width: 576px)');
  const isDropdown932 = useMediaQuery('(max-width: 932px) and (max-height: 430px)');
  const isDropdown820 = useMediaQuery('(max-width: 820px) and (max-height: 1180px)');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedModel, setSelectedModel] = useState('ARIMA');
  const [modelVersion] = useState('v2.1.4');
  const [lastUpdatedDate] = useState('2024-02-15');
  const [forecastNumber, setForecastNumber] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState('Days');
  const [seasonality, setSeasonality] = useState('Auto');
  const [showHistoricalData, setShowHistoricalData] = useState(true);
  const [showForecastedData, setShowForecastedData] = useState(true);
  const [costPerKWh, setCostPerKWh] = useState(6.09);
  const [traceColors, setTraceColors] = useState({});
  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7,
  });
  const [severityFilters, setSeverityFilters] = useState({
    Critical: true,
    High: true,
    Medium: true,
    Low: true,
  });
  const { themes } = useTheme();
  const globalUUID = uuid || (menu && menu.uuid);
  const globalCode = code || dashboardCode || 'ENERGYV3';

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const userTimeZone = userInfo?.data?.company?.timezone || 'Asia/Kolkata';
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/forecastData`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'ESG Tracker',
      'name',
    );
    const sld = getmenus.find((menu) => menu.name.toLowerCase() === 'energy') || {};
    setMenu((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(sld)) {
        return sld;
      }
      return prev;
    });
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo && userInfo.data) {
      let code = menu.dashboard_code || 'ENERGYV3';
      if (
        userInfo.data.main_company
        && userInfo.data.main_company.category
        && userInfo.data.main_company.category.name
        && userInfo.data.main_company.category.name.toLowerCase() === 'company'
        && menu.company_dashboard_code
      ) {
        code = menu.company_dashboard_code;
      }
      setDashboardCode((prev) => (prev !== code ? code : prev));
    }
  }, [menu, userInfo]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sid = equipmentId || params.get('sid');

  const fetchPlotData = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log('Fetch already in progress, skipping...');
      return;
    }
    isFetchingRef.current = true;
    setIsLoading(true);
    setPlotData({});
    try {
      const bodyParams = {
        warehouse_url: warehouseUrl,
        uuid: globalUUID,
        code: globalCode,
        equipment_id: sid,
        company_timezone: userTimeZone,
        model: selectedModel,
        forecast_period: `${forecastNumber} ${forecastPeriod}`,
        seasonality,
      };
      console.log('Fetching with payload:', bodyParams);
      const forecastResponse = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParams),
        credentials: 'include',
      });
      if (!forecastResponse.ok) {
        throw new Error(`Error fetching forecast data: ${forecastResponse.status}`);
      }
      const data = await forecastResponse.json();
      console.log('Full API Response:', data);
      let plotData = {};
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0][0] === 'Data') {
        plotData = data[0][1]?.plot || {};
      } else if (data.data && Array.isArray(data.data)) {
        plotData = data;
      } else {
        console.warn('Unexpected API response structure:', data);
        plotData = { data: [] };
      }
      console.log('Processed Plot Data:', plotData);
      setPlotData(plotData);
      setLastUpdated(new Date());
      setError('');
    } catch (error) {
      setError(error.message || 'An error occurred while fetching the plot data.');
      setPlotData({});
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [globalUUID, globalCode, warehouseUrl, userTimeZone, selectedModel, forecastNumber, forecastPeriod, seasonality]);

  const handleResize = useCallback(() => {
    setPlotDimensions({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  }, []);

  useEffect(() => {
    if (globalUUID && globalCode) {
      fetchPlotData();
    }
  }, [fetchPlotData, globalUUID, globalCode]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    setActiveGroupFilter(defaultDate);
  }, [defaultDate]);

  const handleUpdateModel = () => {
    fetchPlotData();
  };

  const handlePlotTypeChange = useCallback((event) => {
    setPlotType(event.target.value);
  }, []);

  const handleLegendClick = useCallback((event) => {
    const traceName = event.data[event.curveNumber]?.name?.trim();
    if (traceName) {
      setTraceVisibility((prev) => ({
        ...prev,
        [traceName]: prev[traceName] === true ? 'legendonly' : true,
      }));
    }
  }, []);

  const theme = useMemo(() => createTheme({
    components: {
      MuiRadio: { styleOverrides: { root: { color: themes === 'light' ? '#FFFFFF' : '#000000' } } },
    },
  }), [themes]);

  const currentData = useMemo(() => {
    const parsedData = parseApiData(plotData);
    const aggregatedTraces = parsedData.traces.map((trace) => aggregateData(trace, plotType, lastUpdated, activeGroupFilter));
    const kpiData = calculateKPI(aggregatedTraces, plotType, lastUpdated, costPerKWh, plotData);
    return {
      traces: aggregatedTraces,
      layout: parsedData.layout,
      Root_Cause_Analysis: parsedData.Root_Cause_Analysis,
      ...kpiData,
    };
  }, [plotData, plotType, lastUpdated, activeGroupFilter, costPerKWh]);

  const customLayout = useMemo(() => ({
    paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    xaxis: {
      title: '',
      tickformat: plotType === 'Day' ? '%d %b %H %I %p ' : plotType === 'Week' ? '%d %b %Y' : plotType === 'Month' ? '%d %b %Y' : '%b %Y',
      tickangle: plotType === 'Day' ? 0 : 0,
      showgrid: false,
      type: 'date',
      tickmode: 'auto',
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      title: { font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
    },
    yaxis: {
      title: { text: 'Consumption (kWh)', font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
      side: 'left',
      position: -0.05,
      showgrid: false,
      ticklabelposition: 'inside',
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    },
    yaxis2: {
      title: { text: 'Temperature (°C)', font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
      side: 'right',
      overlaying: 'y',
      position: 0.99,
      showgrid: false,
      ticklabelposition: 'inside',
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    },
    legend: {
      orientation: 'h',
      x: 0.3,
      xanchor: 'left',
      y: -0.4,
      yanchor: 'top',
      tracegroupgap: 50,
      font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      bgcolor: themes === 'light' ? 'rgba(45, 46, 45, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      groupclick: 'toggleitem',
      grouptitlefont: {
        size: 15,
        color: themes === 'light' ? '#FFFFFF' : '#534d4d',
        family: 'Mulish, sans-serif',
        weight: 'bold',
      },
      traceorder: 'grouped',
    },
    margin: { b: 100 },
    hoverlabel: {
      bgcolor: '#000000',
      font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
    },
  }), [plotType, themes]);

  const mergedLayout = useMemo(() => ({
    ...customLayout,
    ...currentData.layout,
    title: {
      ...customLayout.title,
      ...currentData.layout.title,
      font: { family: 'Mulish', size: 17, color: themes === 'light' ? '#FFFFFF' : '#000000' },
      y: 0.95,
      x: 0.02,
      align: 'left',
    },
    showlegend: true,
  }), [customLayout, currentData.layout, themes]);

  const getUpdatedPlotData = useCallback(() => {
    const plotDataArray = Array.isArray(currentData.traces) ? currentData.traces : [];
    if (!plotDataArray.length) {
      console.warn('No plot data available in traces');
      return [];
    }

    const allowedTraces = [
      'Actual_Consumption',
      'Actual_Temp',
      'Sudden Spikes',
      'Pattern Breaks',
      'Sustained Deviations',
      'Forecasted_Consumption',
      'Forecast_temp',
      'Forecast Sudden Spikes',
      'Forecast Pattern Breaks',
      'Forecast Sustained Deviations',
    ];
    const excludedTraces = [
      'Max Consumption',
      'Min Consumption',
      'Avg Consumption',
    ];

    const uniqueTraces = [];
    const seenNames = new Set();

    plotDataArray.forEach((trace) => {
      const traceName = trace.name?.trim();
      if (!traceName || !allowedTraces.includes(traceName) || excludedTraces.includes(traceName) || seenNames.has(traceName)) {
        return;
      }
      seenNames.add(traceName);

      const isAnomalyTrace = ['Sudden Spikes', 'Pattern Breaks', 'Sustained Deviations', 'Forecast Sudden Spikes', 'Forecast Pattern Breaks', 'Forecast Sustained Deviations'].includes(traceName);
      const isForecastTrace = traceName.startsWith('Forecast') || ['Forecast Sudden Spikes', 'Forecast Pattern Breaks', 'Forecast Sustained Deviations'].includes(traceName);
      const updatedTrace = aggregateData(trace, plotType, lastUpdated, activeGroupFilter);
      const traceConfig = {
        ...updatedTrace,
        type: isAnomalyTrace ? 'scatter' : (traceName === 'Actual_Consumption' || traceName === 'Forecasted_Consumption') ? 'bar' : 'scatter',
        mode: isAnomalyTrace ? 'markers' : (traceName === 'Actual_Temp' || traceName === 'Forecast_temp') ? 'lines+markers' : undefined,
        visible: traceVisibility[traceName] ?? (isAnomalyTrace ? 'legendonly' : true),
        showlegend: !excludedTraces.includes(traceName),
        legendgroup: isAnomalyTrace ? 'Anomalies' : 'Main',
        legendgrouptitle: isAnomalyTrace ? { text: 'Anomalies' } : { text: 'Legends' },
        line: {
          ...updatedTrace.line,
          color: traceColors[traceName] || updatedTrace.line?.color || (
            traceName === 'Actual_Consumption' ? '#1f77b4'
              : traceName === 'Actual_Temp' ? '#ff7f0e'
                : traceName === 'Forecasted_Consumption' ? '#d62728'
                  : traceName === 'Forecast_temp' ? '#9467bd'
                    : '#e377c2'
          ),
        },
        marker: {
          ...updatedTrace.marker,
          color: traceColors[traceName] || updatedTrace.marker?.color || (
            isAnomalyTrace ? updatedTrace.marker?.color
              : traceName === 'Actual_Consumption' ? '#1f77b4'
                : traceName === 'Actual_Temp' ? '#ff7f0e'
                  : traceName === 'Forecasted_Consumption' ? '#d62728'
                    : traceName === 'Forecast_temp' ? '#9467bd'
                      : '#e377c2'
          ),
          size: isAnomalyTrace ? 10 : updatedTrace.marker?.size || 8,
        },
        yaxis: traceName === 'Actual_Temp' || traceName === 'Forecast_temp' ? 'y2' : 'y',
        name: traceName,
        hovertemplate: traceName === 'Actual_Consumption'
          ? `%{y:.2f} kWh<br>Cost: $${(updatedTrace.y * costPerKWh).toFixed(2)}<br>%{x}`
          : traceName === 'Actual_Temp'
            ? '%{y:.2f} °C<br>%{x}'
            : traceName === 'Forecast_temp'
              ? '%{y:.2f} °C (Forecast)<br>%{x}'
              : traceName === 'Forecasted_Consumption'
                ? '%{y:.2f} kWh (Forecast)<br>%{x}'
                : isAnomalyTrace
                  ? `%{y:.2f} kWh<br>Anomaly: ${traceName}<br>%{x}`
                  : updatedTrace.hovertemplate || '%{y:.2f}<br>%{x}',
      };

      if (!showHistoricalData && ['Actual_Consumption', 'Actual_Temp'].includes(traceName)) {
        traceConfig.visible = false;
      }

      if (!showForecastedData && isForecastTrace) {
        traceConfig.visible = false;
      }

      uniqueTraces.push(traceConfig);
    });

    return uniqueTraces;
  }, [currentData.traces, plotType, lastUpdated, activeGroupFilter, traceVisibility, traceColors, showHistoricalData, showForecastedData, costPerKWh]);

  const renderValue = (value) => {
    if (value === 'N/A' || value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'string' && value.endsWith(' kWh')) {
      return value;
    }
    if (typeof value === 'string' && value.endsWith('%')) {
      return value;
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value).toFixed(2);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  const handleSeverityChange = (severity) => {
    setSeverityFilters((prev) => ({
      ...prev,
      [severity]: !prev[severity],
    }));
  };

  const filteredAnomalies = useMemo(() => {
    if (!currentData.Root_Cause_Analysis || !Array.isArray(currentData.Root_Cause_Analysis)) {
      return [];
    }
    const selectedSeverities = Object.keys(severityFilters).filter(
      (severity) => severityFilters[severity],
    );
    if (selectedSeverities.length === 0) {
      return [];
    }
    return currentData.Root_Cause_Analysis.filter((anomaly) => selectedSeverities.includes(anomaly.Severity));
  }, [currentData.Root_Cause_Analysis, severityFilters]);

  const Item = ({ sx, ...other }) => (
    <Box
      sx={[
        (theme) => ({
          bgcolor: themes === 'light' ? '#2D2E2D' : '#fff',
          color: themes === 'light' ? '#FFFFFF' : 'grey.800',
          border: '1px solid',
          borderColor: themes === 'light' ? '#4A4B4A' : 'grey.300',
          p: 1,
          borderRadius: 2,
          textAlign: 'left',
          fontSize: '0.875rem',
          fontWeight: '700',
          ...(theme.applyStyles
            && theme.applyStyles('dark', {
              bgcolor: '#101010',
              color: 'grey.300',
              borderColor: 'grey.800',
            })),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
      className="out-box"
    />
  );

  return (
    <ThemeProvider theme={theme}>
      {isLoading || !globalUUID ? (
        <Box sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <Card>
          <div className="main-content-1">
            <Box sx={{
              display: 'grid',
              gridAutoFlow: 'row',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,
              padding: 1,
              gridTemplateRows: 'repeat(1, 150px)',
            }}
            >
              <Item>
                <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Model Evaluation Metrics</Typography>
                <div className="diagnostic-valueimag">
                  <img src={target} alt="Consumption" className="data-image" />
                  <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(currentData.modelEvaluationMetrics?.Evaluation_Metrics)}</Typography>
                </div>
                <div className="diagnostic-anomila-target">
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>MAE:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.modelEvaluationMetrics?.Mae)}</Typography></div>
                  </div>
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>RMSE:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.modelEvaluationMetrics?.Rmse)}</Typography></div>
                  </div>
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>R²:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 red" component="p" sx={{ color: themes === 'light' ? '#FF0000' : '#FF0000' }}>{renderValue(currentData.modelEvaluationMetrics?.R2)}</Typography></div>
                  </div>
                </div>
              </Item>
              <Item>
                <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Actual vs Forecast</Typography>
                <div className="diagnostic-valueimag">
                  <img src={totalcost} alt="Cost" className="data-im" />
                  <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(currentData.actualVsForecast?.Actual_Forecast)}</Typography>
                </div>
                <div className="diagnostic-anomila-target">
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Actual:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.actualVsForecast?.Actual)}</Typography></div>
                  </div>
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Forecast:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.actualVsForecast?.Forecast)}</Typography></div>
                  </div>
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Difference:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 red" component="p" sx={{ color: themes === 'light' ? '#FF0000' : '#FF0000' }}>{renderValue(currentData.actualVsForecast?.Difference)}</Typography></div>
                  </div>
                </div>
              </Item>
              <Item>
                <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Model Performance</Typography>
                <div className="diagnostic-valueimag">
                  <img src={performance} alt="Performance" className="data-image" />
                  <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(currentData.performanceMetrics?.Performance_Metrics)}</Typography>
                </div>
                <div className="diagnostic-anomila-target">
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Energy Savings:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.performanceMetrics?.Energy_Savings)}</Typography></div>
                  </div>
                  <div className="target">
                    <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost Reduction:</Typography></div>
                    <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(currentData.performanceMetrics?.Cost_Reduction)}</Typography></div>
                  </div>
                </div>
              </Item>
              <Item sx={{ gridColumn: '4', gridRow: '1 / 3' }}>
                <div className="insights-1">
                  <Typography variant="h6" className="insights-head" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Model Configuration</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', fontWeight: 'bold' }}>Model Selection</Typography>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        sx={{
                          color: themes === 'light' ? '#FFFFFF' : '#000000',
                          backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED',
                          '& .MuiSvgIcon-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: themes === 'light' ? '#FFFFFF' : '#000000' },
                        }}
                      >
                        <MenuItem value="PROPHET">PROPHET</MenuItem>
                        <MenuItem value="SARIMA">SARIMA</MenuItem>
                        <MenuItem value="LSTM">LSTM</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>Model Version:</Typography>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>{modelVersion}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>Last Updated:</Typography>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>{lastUpdatedDate}</Typography>
                    </Box>
                    <Typography sx={{
                      color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', mt: 1, fontWeight: 'bold',
                    }}
                    >
                      Forecast Period
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        placeholder="Enter number"
                        value={forecastNumber}
                        onChange={(e) => setForecastNumber(e.target.value)}
                        sx={{
                          '& .MuiInputBase-root': { color: themes === 'light' ? '#FFFFFF' : '#000000', backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED' },
                          '& .MuiInputLabel-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: themes === 'light' ? '#FFFFFF' : '#000000' },
                          flex: 1,
                        }}
                      />
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          value={forecastPeriod}
                          onChange={(e) => setForecastPeriod(e.target.value)}
                          sx={{
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                            backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED',
                            '& .MuiSvgIcon-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: themes === 'light' ? '#FFFFFF' : '#000000' },
                          }}
                        >
                          <MenuItem value="Days">Days</MenuItem>
                          <MenuItem value="Weeks">Weeks</MenuItem>
                          <MenuItem value="Months">Months</MenuItem>
                          <MenuItem value="Years">Years</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Typography sx={{
                      color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', mt: 1, fontWeight: 'bold',
                    }}
                    >
                      Analysis Parameters
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', fontWeight: 'bold' }}>Seasonality</Typography>
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          value={seasonality}
                          onChange={(e) => setSeasonality(e.target.value)}
                          sx={{
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                            backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED',
                            '& .MuiSvgIcon-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: themes === 'light' ? '#FFFFFF' : '#000000' },
                          }}
                        >
                          <MenuItem value="Auto">Auto</MenuItem>
                          <MenuItem value="Daily">Daily</MenuItem>
                          <MenuItem value="Weekly">Weekly</MenuItem>
                          <MenuItem value="Monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Typography sx={{
                      color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', mt: 1, fontWeight: 'bold',
                    }}
                    >
                      Visual Options
                    </Typography>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={showHistoricalData}
                          onChange={(e) => setShowHistoricalData(e.target.checked)}
                          sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                        />
                      )}
                      label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>Show Historical Data</Typography>}
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={showForecastedData}
                          onChange={(e) => setShowForecastedData(e.target.checked)}
                          sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                        />
                      )}
                      label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', fontSize: '0.875rem' }}>Show Forecasted Data</Typography>}
                    />
                    <Button
                      variant="contained"
                      onClick={handleUpdateModel}
                      sx={{
                        mt: 2,
                        backgroundColor: themes === 'light' ? '#09684C' : '#0B694C',
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: themes === 'light' ? '#09684C' : '#0B694C' },
                      }}
                    >
                      Update Model & Forecast
                    </Button>
                    <Typography sx={{
                      color: themes === 'light' ? '#FFFFFF' : '#534d4d', fontSize: '15px', mt: 1, fontWeight: 'bold',
                    }}
                    >
                      Anomaly Severity
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={severityFilters.Critical}
                            onChange={() => handleSeverityChange('Critical')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                          />
                        )}
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Critical</Typography>}
                      />
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={severityFilters.High}
                            onChange={() => handleSeverityChange('High')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                          />
                        )}
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>High</Typography>}
                      />
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={severityFilters.Medium}
                            onChange={() => handleSeverityChange('Medium')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                          />
                        )}
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Medium</Typography>}
                      />
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={severityFilters.Low}
                            onChange={() => handleSeverityChange('Low')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#09684C' } }}
                          />
                        )}
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Low</Typography>}
                      />
                    </Box>
                  </Box>
                </div>
              </Item>
              <Item sx={{ gridColumn: '1/4' }}>
                <div ref={plotContainerRef}>
                  <PlotTypeSelector
                    plotType={plotType}
                    handlePlotTypeChange={handlePlotTypeChange}
                    isDropdown={isDropdown || isDropdown932 || isDropdown820}
                  />
                  <div className="plot-box">
                    <Plot
                      data={getUpdatedPlotData()}
                      layout={mergedLayout}
                      style={{ width: plotDimensions.width, height: 620 }}
                      config={{ displaylogo: false }}
                      useResizeHandler
                      onLegendClick={handleLegendClick}
                    />
                  </div>
                </div>
              </Item>
              <Item sx={{ gridColumn: '1/5' }}>
                {filteredAnomalies.length > 0 ? (
                  <TableContainer component={Paper} sx={{ backgroundColor: themes === 'light' ? '#2D2E2D' : '#FDFCFE', marginTop: '10px' }}>
                    <Table sx={{ minWidth: 300 }} aria-label="root cause analysis table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Timestamp</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Severity</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Root Cause</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Impact</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAnomalies.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{row.Timestamp || 'N/A'}</TableCell>
                            <TableCell sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{row.Type || 'N/A'}</TableCell>
                            <TableCell sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{row.Severity || 'N/A'}</TableCell>
                            <TableCell sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{row.Root_Cause || 'N/A'}</TableCell>
                            <TableCell sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{row.Impact || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', marginTop: '10px' }}>
                    {currentData.Root_Cause_Analysis && currentData.Root_Cause_Analysis.length > 0
                      ? 'No anomalies match the selected severity levels'
                      : 'No Root Cause Analysis data available'}
                  </Typography>
                )}
              </Item>
            </Box>
          </div>
        </Card>
      )}
    </ThemeProvider>
  );
};

export default Predictive;
