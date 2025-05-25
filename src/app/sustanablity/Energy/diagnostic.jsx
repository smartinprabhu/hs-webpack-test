import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import CardHeader from './CardHeaderRes';
import Card from './CardRes';
import PlotTypeSelector from './PlotSelector';
import { useTheme } from '../../ThemeContext';
import './EnergyAnalytics.css';

import performance from './image/Performance.svg';
import target from './image/TargetGoal.svg';
import totalcost from './image/totalcost.svg';

// Function to parse API plot data
const parseApiData = (apiData) => {
  console.log('Raw API Data:', apiData);
  if (!apiData) {
    console.warn('No valid plot data found in API response');
    return { traces: [] };
  }

  let plotData = apiData;
  if (Array.isArray(apiData) && apiData.length > 0 && Array.isArray(apiData[0]) && apiData[0][0] === 'Data') {
    plotData = apiData[0][1]?.plot || {};
  }

  const traces = plotData.data || [];
  if (!Array.isArray(traces)) {
    console.warn('Plot data is not an array:', traces);
    return { traces: [] };
  }

  console.log('Parsed Traces:', traces);
  return { traces };
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

  console.log(`Aggregating for ${plotType} at ${localNow.toISOString()} for ${trace.name}, selected date: ${selected.toISOString()}`);

  const filterDataByRange = (x, y, days) => {
    const filteredX = [];
    const filteredY = [];
    let sum = 0;
    let lastValue = 0;
    let latestTimestamp = null;
    const startDate = new Date(selected);
    startDate.setDate(selected.getDate() - Math.floor(days / 2)); // Center the range
    const endDate = new Date(selected);
    endDate.setDate(selected.getDate() + Math.ceil(days / 2));

    console.log(`Filtering range: ${startDate.toISOString()} to ${endDate.toISOString()} (${days} days)`);

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

    console.log(`Filtered ${filteredX.length} points for ${trace.name}, sum: ${sum.toFixed(2)}, lastValue: ${lastValue.toFixed(2)}`);
    return { x: filteredX, y: filteredY, sum, lastValue };
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
    const startCurrent = new Date(selected.getTime() - 24 * 60 * 60 * 1000); // 24 hours before selected date
    const endCurrent = selected;
    const startPrevious = new Date(selected.getTime() - 48 * 60 * 60 * 1000); // 48 to 24 hours before
    const endPrevious = startCurrent;

    console.log(`Filtering current: ${startCurrent.toISOString()} to ${endCurrent.toISOString()}`);
    console.log(`Filtering previous: ${startPrevious.toISOString()} to ${endPrevious.toISOString()}`);

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

    console.log(`Filtered ${filteredX.length} current points (sum: ${sum.toFixed(2)}, lastValue: ${lastValue.toFixed(2)}) and ${previousX.length} previous points (sum: ${previousSum.toFixed(2)})`);
    return { x: filteredX, y: filteredY, sum, previousSum, lastValue };
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
            dailyData[dateKey] = { sum: 0, count: 0, latest: null, latestValue: 0 };
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
          trace.name === 'Actual_Temp' ? dailyData[date].sum / dailyData[date].count : dailyData[date].sum
        );
      });

    console.log(`Aggregated ${aggregatedX.length} days for ${trace.name}, sum: ${sum.toFixed(2)}, lastValue: ${lastValue.toFixed(2)}`);
    return { x: aggregatedX, y: aggregatedY, sum, previousSum, lastValue };
  };

  const aggregateByYear = (x, y) => {
    const yearlyData = {};
    let sum = 0;
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
          yearlyData[year].months[monthYear] = { sum: 0, count: 0, latest: null, latestValue: 0 };
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
            trace.name === 'Actual_Temp'
              ? yearlyData[selectedYear].months[monthYear].sum / yearlyData[selectedYear].months[monthYear].count
              : yearlyData[selectedYear].months[monthYear].sum
          );
        });
    }

    console.log(`Aggregated ${aggregatedX.length} months for ${trace.name}, sum: ${sum.toFixed(2)}, previousSum: ${previousSum.toFixed(2)}, lastValue: ${lastValue.toFixed(2)}`);
    return { x: aggregatedX, y: aggregatedY, sum: yearlyData[selectedYear]?.sum || 0, previousSum, lastValue };
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

  console.log(`Final aggregation for ${trace.name} (${plotType}): sum=${aggregatedSum.toFixed(2)}, previousSum=${previousSum.toFixed(2)}, lastValue=${lastValue.toFixed(2)}`);
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
const calculateKPI = (traces, plotType, lastUpdated, costPerKWh) => {
  const now = new Date(lastUpdated);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);
  console.log(`Calculating KPI for ${plotType} at ${localNow.toISOString()}`);

  const consumptionTrace = traces.find((t) => t.name?.trim() === 'Actual_Consumption');
  const targetTrace = traces.find((t) => t.name?.trim() === 'Actual_Target');

  let performanceMetrics = {
    Performance_Metrics: 'N/A',
    Energy_Savings: 'N/A',
    Cost_Reduction: 'N/A',
  };

  let targetMetrics = {
    Target_goal: 'N/A',
    Cost: 'N/A',
    Emission: 'N/A',
    Deviation: 'N/A',
  };

  let costAnalysis = {
    Cost_Analysis: 'N/A',
    Previous_Period: 'N/A',
    Cost_Saved: 'N/A',
    Savings: 'N/A',
  };

  // Performance Metrics
  if (consumptionTrace && targetTrace && consumptionTrace.aggregatedSum !== undefined && targetTrace.aggregatedSum !== undefined) {
    const totalConsumption = consumptionTrace.aggregatedSum || 0;
    const targetConsumption = targetTrace.aggregatedSum || 0;

    if (totalConsumption === 0 || targetConsumption === 0) {
      console.warn(`No data for Actual_Consumption or Actual_Target in ${plotType} period`);
    } else {
      const energySavings = ((targetConsumption - totalConsumption) / targetConsumption) * 100;
      const totalCost = totalConsumption * costPerKWh;
      const targetCost = targetConsumption * costPerKWh;
      const costReduction = (targetCost - totalCost);

      performanceMetrics = {
        Performance_Metrics: `${totalConsumption.toFixed(2)} kWh`,
        Energy_Savings: `${energySavings.toFixed(2)}%`,
        Cost_Reduction: `${costReduction.toFixed(2)}$`,
      };

      console.log(
        `Performance Metrics for ${plotType}: Performance_Metrics=${totalConsumption.toFixed(2)} kWh, Energy_Savings=${energySavings.toFixed(2)}%, Cost_Reduction=${costReduction.toFixed(2)}%`
      );
    }
  } else {
    console.warn('Missing valid Actual_Consumption or Actual_Target trace for performance metrics');
  }

  // Target Metrics
  if (targetTrace && targetTrace.aggregatedSum !== undefined) {
    const targetGoal = targetTrace.aggregatedSum || 0;
    const previousSum = targetTrace.previousSum || 0;
    const emissionFactor = 0.71;

    if (targetGoal === 0) {
      console.warn(`No data for Actual_Target in ${plotType} period`);
    } else {
      const cost = targetGoal * costPerKWh;
      const emission = targetGoal * emissionFactor;
      const deviation = previousSum !== 0 ? ((targetGoal - previousSum) / previousSum) * 100 : 0;

      targetMetrics = {
        Target_goal: `${targetGoal.toFixed(2)} kWh`,
        Cost: `${cost.toFixed(2)}$`,
        Emission: `${emission.toFixed(2)}tCO2e`,
        Deviation: `${deviation.toFixed(2)}%`,
      };

      console.log(
        `Target Metrics for ${plotType}: Target_goal=${targetGoal.toFixed(2)} kWh, Cost=${cost.toFixed(2)}, Emission=${emission.toFixed(2)} tCO2e, Deviation=${deviation.toFixed(2)}%`
      );
    }
  } else {
    console.warn('Missing valid Actual_Target trace for target metrics');
  }

  // Cost Analysis Metrics
  if (targetTrace && targetTrace.aggregatedSum !== undefined && targetTrace.previousSum !== undefined) {
    const currentTarget = targetTrace.aggregatedSum || 0;
    const previousTarget = targetTrace.previousSum || 0;

    const costAnalysisValue = currentTarget * costPerKWh;
    const previousPeriodValue = previousTarget * costPerKWh;
    const costSaved = previousTarget - currentTarget;
    const savings = previousTarget !== 0 ? ((costSaved / (previousTarget * costPerKWh)) * 100) : 0;

    costAnalysis = {
      Cost_Analysis: `$${costAnalysisValue.toFixed(2)}`,
      Previous_Period: `$${previousPeriodValue.toFixed(2)}`,
      Cost_Saved: `${costSaved.toFixed(2)}$`,
      Savings: `${savings.toFixed(2)}%`,
    };

    console.log(
      `Cost Analysis for ${plotType}: Cost_Analysis=${costAnalysisValue.toFixed(2)}, Previous_Period=${previousPeriodValue.toFixed(2)}, Cost_Saved=${costSaved.toFixed(2)} kWh, Savings=${savings.toFixed(2)}%`
    );
  } else {
    console.warn('Missing valid Actual_Target trace for cost analysis metrics');
  }

  return { performanceMetrics, targetMetrics, costAnalysis };
};

const Diagnostic = ({
  defaultDate,
  headerText,
  showBackButton,
  onBackButtonClick,
  fontSize,
  equipmentId,
  uuid,
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
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [increaseValue, setIncreaseValue] = useState('0');
  const [selectedOption, setSelectedOption] = useState('Dynamic');
  const [staticResults, setStaticResults] = useState(null);
  const [dynamicResults, setDynamicResults] = useState(null);
  const [staticInputValue, setStaticInputValue] = useState('0.12');
  const [staticEmission, setStaticEmission] = useState('0.63');
  const [costPerKWh, setCostPerKWh] = useState(6.09);
  const [traceColors, setTraceColors] = useState({});
  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7,
  });
  const [intensityMode, setIntensityMode] = useState('intensity_sqft');
  const [severityFilters, setSeverityFilters] = useState({
    Critical: true,
    High: true,
    Medium: true,
    Low: true,
  });
  const { themes } = useTheme();
  const globalUUID = uuid || (menu && menu.uuid) ;
  const globalCode = code || dashboardCode || 'ENERGYV3';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const userCompanyId = userInfo?.data?.company?.id ? userInfo.data.company.id[1] : '';
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
        userInfo.data.main_company &&
        userInfo.data.main_company.category &&
        userInfo.data.main_company.category.name &&
        userInfo.data.main_company.category.name.toLowerCase() === 'company' &&
        menu.company_dashboard_code
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
  }, [globalUUID, globalCode, warehouseUrl, userTimeZone]);

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

  const handlePlotTypeChange = useCallback((event) => {
    setPlotType(event.target.value);
  }, []);

  const theme = useMemo(() => createTheme({
    components: {
      MuiRadio: { styleOverrides: { root: { color: themes === 'light' ? '#FFFFFF' : '#000000' } } },
    },
  }), [themes]);

  const currentData = useMemo(() => {
    const data = plotData || {};
    console.log('Current Data:', data);
    return data;
  }, [plotData]);

  // Compute Metrics
  const { performanceMetrics, targetMetrics, costAnalysis } = useMemo(() => {
    const { traces } = parseApiData(currentData);
    const processedTraces = traces.map((trace) => aggregateData(trace, plotType, lastUpdated, activeGroupFilter));
    return calculateKPI(processedTraces, plotType, lastUpdated, costPerKWh);
  }, [currentData, plotType, lastUpdated, activeGroupFilter, costPerKWh]);

  const getGroupedPlotData = useCallback((type) => {
    const { traces } = parseApiData(currentData);
    const allowedTraces = [
      'Actual_Consumption',
      'Actual_Target',
    ];

    const uniqueTraces = [];
    const seenNames = new Set();

    traces.forEach((trace) => {
      if (allowedTraces.includes(trace.name) && !seenNames.has(trace.name)) {
        seenNames.add(trace.name);
        let updatedTrace = { ...trace };

        if (type === 'MOM') {
          // Month-over-Month comparison
          const currentMonth = activeGroupFilter.slice(0, 7); // Get current month and year
          const previousMonth = `${currentMonth.slice(0, 4) - 1}-${currentMonth.slice(5, 7)}`; // Get previous year's month
          // Fetch data for current month and previous year's month
          updatedTrace.x = [currentMonth, previousMonth];
          updatedTrace.y = [trace.y[currentMonth] || 0, trace.y[previousMonth] || 0];
        }

        uniqueTraces.push({
          ...updatedTrace,
          visible: traceVisibility[trace.name] ?? true,
          line: {
            ...updatedTrace.line,
            color: traceColors[trace.name] || updatedTrace.line?.color || '#2275e0',
          },
          marker: {
            ...updatedTrace.marker,
            color: traceColors[trace.name] || updatedTrace.marker?.color || '#2275e0',
          },
        });
      }
    });

    return uniqueTraces;
  }, [currentData, activeGroupFilter, traceVisibility, traceColors]);

  const customLayout = useMemo(() => ({
    paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    xaxis: {
      title: '',
      tickformat: plotType === 'Day' ? '%d %b %H %p' : plotType === 'Week' || plotType === 'Month' || plotType === 'Year' ? '%d %b %Y' : '%b %Y',
      tickangle: plotType === 'Day' ? 0 : 0,
      showgrid: false,
      type: 'date',
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      title: { font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
      rangeslider: {
        visible: true,
        y: -0.2,
        range: plotType === 'Day' ? [new Date().getTime() - 42 * 60 * 60 * 1000, new Date().getTime()] : plotType === 'Week' ? [new Date().getTime() - 14 * 24 * 60 * 60 * 1000, new Date().getTime()] : plotType === 'Month' ? [new Date().getTime() - 60 * 24 * 60 * 60 * 1000, new Date().getTime()] : [new Date().getTime() - 365 * 24 * 60 * 60 * 1000, new Date().getTime()],
      },
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

  const getUpdatedPlotData = useCallback(() => {
    const { traces } = parseApiData(currentData);
    console.log('Parsed Traces before processing:', traces);

    const allowedTraces = [
      'Actual_Consumption',
      'Actual_Temp',
      'Sudden Spikes',
      'Pattern Breaks',
      'Sustained Deviations',
      'Actual_Target',
      'Actual_breach',
    ];
    const excludedTraces = [
      'Max Consumption',
      'Min Consumption',
      'Avg Consumption',
    ];

    const uniqueTraces = [];
    const seenNames = new Set();

    traces.forEach((trace) => {
      const traceName = trace.name?.trim();
      if (!traceName || !allowedTraces.includes(traceName) || excludedTraces.includes(traceName) || seenNames.has(traceName)) {
        return;
      }
      seenNames.add(traceName);

      const isAnomalyTrace = [
        'Sudden Spikes',
        'Pattern Breaks',
        'Sustained Deviations',
      ].includes(traceName);

      const updatedTrace = aggregateData(trace, plotType, lastUpdated, activeGroupFilter);

      uniqueTraces.push({
        ...updatedTrace,
        type: isAnomalyTrace ? 'scatter' : (traceName === 'Actual_Consumption' || traceName === 'Actual_breach') ? 'bar' : 'scatter',
        mode: isAnomalyTrace ? 'markers' : (traceName === 'Actual_Temp' || traceName === 'Actual_Target') ? 'lines+markers' : undefined,
        visible: traceVisibility[traceName] ?? (isAnomalyTrace ? 'legendonly' : true),
        showlegend: !excludedTraces.includes(traceName),
        legendgroup: isAnomalyTrace ? 'Anomalies' : 'Main',
        legendgrouptitle: isAnomalyTrace ? { text: 'Anomalies' } : { text: 'Legends' },
        line: {
          ...updatedTrace.line,
          color: traceColors[traceName] || updatedTrace.line?.color || (
            traceName === 'Actual_Consumption' ? '#1f77b4' :
            traceName === 'Actual_Target' ? '#00cc00' :
            '#ff7f0e'
          ),
        },
        marker: {
          ...updatedTrace.marker,
          color: traceColors[traceName] || updatedTrace.marker?.color || (
            isAnomalyTrace ? updatedTrace.marker?.color :
            traceName === 'Actual_Consumption' ? '#1f77b4' :
            traceName === 'Actual_Target' ? '#00cc00' :
            '#ff7f0e'
          ),
          size: isAnomalyTrace ? 10 : updatedTrace.marker?.size || 8,
        },
        yaxis: traceName === 'Actual_Temp' ? 'y2' : 'y',
        name: traceName,
      });
    });

    console.log('Final Updated Plot Data:', uniqueTraces);
    return uniqueTraces;
  }, [currentData, plotType, traceVisibility, traceColors, lastUpdated, activeGroupFilter]);

  const handleLegendClick = useCallback((event) => {
    const traceName = event.data[event.curveNumber]?.name?.trim();
    if (traceName) {
      setTraceVisibility((prev) => ({
        ...prev,
        [traceName]: prev[traceName] === true ? 'legendonly' : true,
      }));
    }
  }, []);

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

  const handleTargetTypeChange = (type) => {
    setSelectedOption(type);
  };

  const filteredAnomalies = useMemo(() => {
    if (!currentData.Root_Cause_Analysis || !Array.isArray(currentData.Root_Cause_Analysis)) {
      return [];
    }
    const selectedSeverities = Object.keys(severityFilters).filter(
      (severity) => severityFilters[severity]
    );
    if (selectedSeverities.length === 0) {
      return [];
    }
    return currentData.Root_Cause_Analysis.filter((anomaly) =>
      selectedSeverities.includes(anomaly.Severity)
    );
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
      {isLoading || !menu ? (
        <Box sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ color: themes === 'light' ? '#FFFFFF' : '#FFFFFF' }}>
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
            }}
            >
              <Item>
                {targetMetrics.Target_goal !== 'N/A' ? (
                  <div>
                    <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Target Goal</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={target} alt="Consumption" className="data-image" />
                      <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(targetMetrics.Target_goal)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(targetMetrics.Cost)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Emission:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(targetMetrics.Emission)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Deviation:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 red" component="p" sx={{ color: themes === 'light' ? '#FF0000' : '#FF0000' }}>{renderValue(targetMetrics.Deviation)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>No target data available</Typography>
                )}
              </Item>
              <Item>
                {performanceMetrics.Performance_Metrics !== 'N/A' ? (
                  <div>
                    <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Performance Metrics</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={performance} alt="Consumption" className="data-image" />
                      <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(performanceMetrics.Performance_Metrics)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Energy Savings:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(performanceMetrics.Energy_Savings)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost Reduction:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(performanceMetrics.Cost_Reduction)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>No consumption data available</Typography>
                )}
              </Item>
              <Item>
                {costAnalysis.Cost_Analysis !== 'N/A' ? (
                  <div>
                    <Typography className="diagnostic-tit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost Analysis</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={totalcost} alt="Consumption" className="data-im" />
                      <Typography className="diagnostic-subtit" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(costAnalysis.Cost_Analysis)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Previous Period:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(costAnalysis.Previous_Period)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost Saved:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p" sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}>{renderValue(costAnalysis.Cost_Saved)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Savings:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15" component="p" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>{renderValue(costAnalysis.Savings)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>No cost data available</Typography>
                )}
              </Item>
              <Item sx={{ gridColumn: '4', gridRow: '1 / 3' }}>
                <div sx={{
                  flex: 1, padding: 2, borderRadius: 1, boxShadow: 1,
                }}
                >
                  <div className="insights-1">
                    <Typography variant="h6" className="insights-head" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Analysis Controls</Typography>
                    <div className="insights-box-energy-1">
                      <Button
                        variant={selectedOption === 'Static' ? 'contained' : 'outlined'}
                        onClick={() => handleTargetTypeChange('Static')}
                        sx={{
                          color: themes === 'light' ? '#FFFFFF' : (selectedOption === 'Static' ? '#fff' : '#000000'),
                          backgroundColor: themes === 'light' ? (selectedOption === 'Static' ? '#09684C' : '#2D2E2D') : (selectedOption === 'Static' ? '#0B694C' : 'transparent'),
                          borderColor: themes === 'light' ? (selectedOption === 'Static' ? '#09684C' : '#FFFFFF') : '#184d3d',
                          borderRadius: '20px',
                          '&:hover': {
                            backgroundColor: themes === 'light' ? (selectedOption === 'Static' ? '#09684C' : '#4A4B4A') : (selectedOption === 'Static' ? '#0B694C' : '#f0f0f0'),
                            borderColor: themes === 'light' ? (selectedOption === 'Static' ? '#09684C' : '#FFFFFF') : '#184d3d',
                          },
                          width: '80px',
                          height: '30px',
                        }}
                      >
                        Static
                      </Button>
                      <input
                        type="text"
                        className="insights-input"
                        value={staticInputValue}
                        onChange={(e) => setStaticInputValue(e.target.value)}
                        disabled={selectedOption !== 'Static'}
                        style={{ color: themes === 'light' ? '#FFFFFF' : '#000000', backgroundColor: themes === 'light' ? '#4A4B4A' : '#E4E4ED' }}
                      />
                    </div>
                    <div className="insights-box-energy-1">
                      <Button
                        variant={selectedOption === 'Dynamic' ? 'contained' : 'outlined'}
                        onClick={() => handleTargetTypeChange('Dynamic')}
                        sx={{
                          color: themes === 'light' ? '#FFFFFF' : (selectedOption === 'Dynamic' ? '#fff' : '#000000'),
                          backgroundColor: themes === 'light' ? (selectedOption === 'Dynamic' ? '#09684C' : '#2D2E2D') : (selectedOption === 'Dynamic' ? '#0B694C' : 'transparent'),
                          borderColor: themes === 'light' ? (selectedOption === 'Dynamic' ? '#09684C' : '#FFFFFF') : '#184d3d',
                          borderRadius: '20px',
                          '&:hover': {
                            backgroundColor: themes === 'light' ? (selectedOption === 'Dynamic' ? '#09684C' : '#4A4B4A') : (selectedOption === 'Dynamic' ? '#0B694C' : '#f0f0f0'),
                            borderColor: themes === 'light' ? (selectedOption === 'Dynamic' ? '#09684C' : '#FFFFFF') : '#184d3d',
                          },
                          width: '80px',
                          height: '30px',
                        }}
                      >
                        Dynamic
                      </Button>
                      <input
                        type="text"
                        className="insights-input"
                        value={staticEmission}
                        onChange={(e) => setStaticEmission(e.target.value)}
                        disabled={selectedOption !== 'Dynamic'}
                        style={{ color: themes === 'light' ? '#FFFFFF' : '#000000', backgroundColor: themes === 'light' ? '#4A4B4A' : '#E4E4ED' }}
                      />
                    </div>
                    <div className="insights-box-energy">
                      <Typography className="insights-key" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Cost Per kWh ($)</Typography>
                      <input
                        type="text"
                        className="insights-input-1"
                        value={costPerKWh}
                        onChange={(e) => setCostPerKWh(parseFloat(e.target.value) || 6.09)}
                        style={{ color: themes === 'light' ? '#FFFFFF' : '#000000', backgroundColor: themes === 'light' ? '#4A4B4A' : '#E4E4ED' }}
                      />
                    </div>
                  </div>
                  {/* Uncomment and update Time Period section if needed */}
                  {/*
                  <div className="insights">
                    <Typography variant="h6" className="insights-head" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Time Period</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          labelId="comparison-type-label"
                          value={plotType}
                          label="Comparison Type"
                          onChange={handlePlotTypeChange}
                          sx={{
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                            backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED',
                            '& .MuiSvgIcon-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' }
                          }}
                        >
                          <MenuItem value="Day">Day</MenuItem>
                          <MenuItem value="Week">Week</MenuItem>
                          <MenuItem value="Month">Month</MenuItem>
                          <MenuItem value="Year">Year</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        type="date"
                        value={activeGroupFilter}
                        onChange={(e) => setActiveGroupFilter(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputBase-root': { color: themes === 'light' ? '#FFFFFF' : '#000000', backgroundColor: themes === 'light' ? '#2D2E2D' : '#E4E4ED' },
                          '& .MuiInputLabel-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
                        }}
                      />
                    </Box>
                  </div>
                  */}
                  <div className="insights">
                    <Typography variant="h6" className="insights-head" sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Anomaly Severity</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Critical}
                            onChange={() => handleSeverityChange('Critical')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#000000' } }}
                          />
                        }
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Critical</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.High}
                            onChange={() => handleSeverityChange('High')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#000000' } }}
                          />
                        }
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>High</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Medium}
                            onChange={() => handleSeverityChange('Medium')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#000000' } }}
                          />
                        }
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Medium</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Low}
                            onChange={() => handleSeverityChange('Low')}
                            sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', '&.Mui-checked': { color: themes === 'light' ? '#FFFFFF' : '#000000' } }}
                          />
                        }
                        label={<Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>Low</Typography>}
                      />
                    </Box>
                  </div>
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
                      data={getUpdatedPlotData().map((trace) => ({
                        ...trace,
                        hovertemplate: trace.name === 'Actual_Consumption'
                          ? `%{y:.2f} kWh<br>Cost: $${(trace.y * costPerKWh).toFixed(2)}<br>%{x}`
                          : trace.name === 'Actual_Temp'
                          ? `%{y:.2f} °C<br>%{x}`
                          : trace.name === 'Actual_Target'
                          ? `%{y:.2f} kWh<br>%{x}`
                          : trace.name.includes('Spikes') || trace.name.includes('Breaks') || trace.name.includes('Deviations')
                          ? `%{y:.2f} kWh<br>Anomaly: ${trace.name}<br>%{x}`
                          : trace.hovertemplate || '%{y:.2f}<br>%{x}',
                      }))}
                      layout={{
                        ...customLayout,
                        title: {
                          font: { family: 'Mulish', size: 17, color: themes === 'light' ? '#FFFFFF' : '#000000' },
                          y: 0.95,
                          x: 0.02,
                          align: 'left',
                        },
                        showlegend: true,
                      }}
                      style={{ width: plotDimensions.width, height: 620 }}
                      config={{ displaylogo: false }}
                      useResizeHandler
                      onLegendClick={handleLegendClick}
                    />
                  </div>
                </div>
              </Item>
              <Item sx={{ gridColumn: '1/5' }}>
                {filteredAnomalies && Array.isArray(filteredAnomalies) && filteredAnomalies.length > 0 ? (
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

export default Diagnostic;
