import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext, // Add useContext
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
  Button,
  Popover,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { SketchPicker } from 'react-color';
import Plot from 'react-plotly.js';
import { getSequencedMenuItems } from '../../util/appUtils';
import CardHeader from './CardHeaderRes';
import Card from './CardRes';
import PlotTypeSelector from './PlotSelector';
import { useTheme } from '../../ThemeContext';
import { ApiDataContext } from './ApiDataContext'; // Import the context
import './EnergyAnalytics.css';
import co2 from './image/emmision.svg';
import totalcost from './image/totalcost.svg';
import energy from './image/energy.svg';
import total from './image/total.svg';
import temp from './image/m.svg';
import Diagnostic from './diagnostic';
import Predictive from './predictive';
import Prescriptive from './Prescriptive';

// Function to parse API plot data
const parseApiData = (apiData) => {
  console.log('Raw API Data:', apiData);
  if (!apiData || !apiData.data) {
    console.warn('No data found in API response');
    return { traces: [] };
  }

  const plotData = apiData.data || [];
  if (!Array.isArray(plotData)) {
    console.warn('Plot data is not an array:', plotData);
    return { traces: [] };
  }

  console.log('Parsed Traces:', plotData);
  return { traces: plotData };
};

const aggregateData = (trace, plotType, currentTime) => {
  if (!trace || !trace.x || !trace.y || !Array.isArray(trace.x) || !Array.isArray(trace.y)) {
    console.warn(`Invalid trace data for ${trace?.name || 'unknown'}:`, trace);
    return {
      ...trace, x: [], y: [], previousY: [], previousYearData: [], previousYearAvgTemp: 0,
    };
  }

  const now = new Date(currentTime);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);
  console.log(`Aggregating for ${plotType} at ${localNow.toISOString()} with timezone offset: ${timeZoneOffset / 60000} minutes`);

  const filterDataByRange = (x, y, days) => {
    const filteredX = [];
    const filteredY = [];
    const startDate = new Date(localNow);
    startDate.setDate(localNow.getDate() - days + 1);
    console.log(`Filtering range: ${startDate.toISOString()} to ${localNow.toISOString()} (${days} days)`);

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startDate && date <= localNow) {
          filteredX.push(timestamp);
          filteredY.push(y[index] || 0);
          console.log(`Added data point at ${date.toISOString()}: ${y[index] || 0}`);
        }
      } catch (error) {
        console.error(`Error parsing timestamp at index ${index} for ${trace.name}: ${timestamp}`, error);
      }
    });

    console.log(`Filtered ${filteredX.length} points for ${trace.name} in ${days} days`);
    return { x: filteredX, y: filteredY };
  };

  const filterLast24Hours = (x, y) => {
    const filteredX = [];
    const filteredY = [];
    const previousX = [];
    const previousY = [];
    const startCurrent = new Date(localNow.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    const startPrevious = new Date(localNow.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago
    console.log(`Filtering current: ${startCurrent.toISOString()} to ${localNow.toISOString()}`);
    console.log(`Filtering previous: ${startPrevious.toISOString()} to ${startCurrent.toISOString()}`);

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startCurrent && date <= localNow) {
          filteredX.push(timestamp);
          filteredY.push(y[index] || 0);
          console.log(`Added current data point at ${date.toISOString()}: ${y[index] || 0}`);
        } else if (date >= startPrevious && date < startCurrent) {
          previousX.push(timestamp);
          previousY.push(y[index] || 0);
          console.log(`Added previous data point at ${date.toISOString()}: ${y[index] || 0}`);
        }
      } catch (error) {
        console.error(`Error parsing timestamp at index ${index} for ${trace.name}: ${timestamp}`, error);
      }
    });

    console.log(`Filtered ${filteredX.length} current points and ${previousX.length} previous points for ${trace.name}`);
    return {
      x: filteredX, y: filteredY, previousY, previousYearData: [], previousYearAvgTemp: 0,
    };
  };

  const aggregateByDay = (x, y, days) => {
    const dailyData = {};
    const previousDailyData = {};
    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp in aggregateByDay at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        const dateKey = date.toISOString().split('T')[0];
        const daysDiff = Math.floor((localNow - date) / (1000 * 60 * 60 * 24));
        if (daysDiff < days / 2) {
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { sum: 0, count: 0 };
          }
          dailyData[dateKey].sum += y[index] || 0;
          dailyData[dateKey].count += 1;
        } else if (daysDiff < days) {
          if (!previousDailyData[dateKey]) {
            previousDailyData[dateKey] = { sum: 0, count: 0 };
          }
          previousDailyData[dateKey].sum += y[index] || 0;
          previousDailyData[dateKey].count += 1;
        }
      } catch (error) {
        console.error(`Error in aggregateByDay for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    const aggregatedX = [];
    const aggregatedY = [];
    const previousY = [];
    Object.keys(dailyData)
      .sort()
      .forEach((date) => {
        aggregatedX.push(`${date}T00:00:00+05:30`);
        aggregatedY.push(dailyData[date].sum / (trace.name === 'Actual_Temp' ? dailyData[date].count : 1));
      });
    Object.keys(previousDailyData)
      .sort()
      .forEach((date) => {
        previousY.push(previousDailyData[date].sum / (trace.name === 'Actual_Temp' ? previousDailyData[date].count : 1));
      });
    console.log(`Aggregated ${aggregatedX.length} days and ${previousY.length} previous days for ${trace.name}`);
    return {
      x: aggregatedX, y: aggregatedY, previousY, previousYearData: [], previousYearAvgTemp: 0,
    };
  };

  const aggregateByYear = (x, y) => {
    const yearlyData = {};
    const currentYearStart = new Date(localNow.getFullYear(), 0, 1); // Jan 1, 2025
    const previousYearStart = new Date(localNow.getFullYear() - 1, 0, 1); // Jan 1, 2024
    const previousYearEnd = new Date(localNow.getFullYear() - 1, 11, 31, 23, 59, 59); // Dec 31, 2024
    let previousYearTempSum = 0;
    let previousYearTempCount = 0;

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
          yearlyData[year].months[monthYear] = { sum: 0, count: 0 };
        }
        yearlyData[year].months[monthYear].sum += y[index] || 0;
        yearlyData[year].months[monthYear].count += 1;
        yearlyData[year].sum += y[index] || 0;
        yearlyData[year].count += 1;

        // Calculate previous year average temperature
        if (trace.name === 'Actual_Temp' && date >= previousYearStart && date <= previousYearEnd) {
          previousYearTempSum += y[index] || 0;
          previousYearTempCount += 1;
        }
      } catch (error) {
        console.error(`Error in aggregateByYear for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    const aggregatedX = [];
    const aggregatedY = [];
    const previousYearData = [];
    const previousYearAvgTemp = previousYearTempCount > 0 ? previousYearTempSum / previousYearTempCount : 0;

    if (yearlyData[localNow.getFullYear()]) {
      Object.keys(yearlyData[localNow.getFullYear()].months)
        .sort()
        .forEach((monthYear) => {
          aggregatedX.push(`${monthYear}-01T00:00:00+05:30`);
          aggregatedY.push(
            yearlyData[localNow.getFullYear()].months[monthYear].sum
            / (trace.name === 'Actual_Temp' ? yearlyData[localNow.getFullYear()].months[monthYear].count : 1),
          );
        });
    }
    if (yearlyData[localNow.getFullYear() - 1]) {
      Object.keys(yearlyData[localNow.getFullYear() - 1].months)
        .sort()
        .forEach((monthYear) => {
          previousYearData.push(
            yearlyData[localNow.getFullYear() - 1].months[monthYear].sum
            / (trace.name === 'Actual_Temp' ? yearlyData[localNow.getFullYear() - 1].months[monthYear].count : 1),
          );
        });
    }

    console.log(`Aggregated ${aggregatedX.length} months for ${trace.name}, previous year data: ${previousYearData.length} months, previous year avg temp: ${previousYearAvgTemp}`);
    return {
      x: aggregatedX, y: aggregatedY, previousY: [], previousYearData, previousYearAvgTemp,
    };
  };

  let filteredTrace = { ...trace };
  if (plotType === 'Day') {
    filteredTrace = filterLast24Hours(trace.x, trace.y);
    return {
      ...trace,
      ...filteredTrace,
      type: trace.name === 'Actual_Consumption' ? 'bar' : 'scatter',
    };
  } if (plotType === 'Week') {
    filteredTrace = filterDataByRange(trace.x, trace.y, 14);
    const aggregated = aggregateByDay(filteredTrace.x, filteredTrace.y, 14);
    return { ...trace, ...aggregated };
  } if (plotType === 'Month') {
    filteredTrace = filterDataByRange(trace.x, trace.y, 60);
    const aggregated = aggregateByDay(filteredTrace.x, filteredTrace.y, 60);
    return { ...trace, ...aggregated };
  } if (plotType === 'Year') {
    filteredTrace = filterDataByRange(trace.x, trace.y, 730);
    const aggregated = aggregateByYear(filteredTrace.x, filteredTrace.y);
    return { ...trace, ...aggregated, type: trace.name === 'Actual_Consumption' ? 'bar' : 'scatter' };
  }
  return {
    ...trace, previousY: [], previousYearData: [], previousYearAvgTemp: 0,
  };
};

const calculateKPI = (traces, plotType, lastUpdated, staticInputValue, staticEmmision) => {
  const now = new Date(lastUpdated);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);
  console.log(`vk: Calculating KPI for ${plotType} at ${localNow.toISOString()}`);

  const consumptionTrace = traces.find((t) => t.name === 'Actual_Consumption');
  const tempTrace = traces.find((t) => t.name === 'Actual_Temp');
  console.log('vk: Consumption Trace:', consumptionTrace);
  console.log('vk: Temperature Trace:', tempTrace);

  let totalConsumption = 0;
  let previousYearConsumption = 0;
  let changeConsumption = 0;
  let energyIntensitySQFT = 0;
  let energyIntensityCapita = 0;
  let totalCost = 0;
  let co2eEmissions = 0;
  let avgTemperature = 0;
  let tempChange = 0;

  if (consumptionTrace && consumptionTrace.y && consumptionTrace.y.length > 0) {
    if (plotType === 'Year') {
      totalConsumption = consumptionTrace.y.reduce((sum, val) => sum + (val || 0), 0);
      if (consumptionTrace.previousYearData && consumptionTrace.previousYearData.length > 0) {
        previousYearConsumption = consumptionTrace.previousYearData.reduce((sum, val) => sum + (val || 0), 0);
      }
      changeConsumption = previousYearConsumption !== 0
        ? ((totalConsumption - previousYearConsumption) / previousYearConsumption) * 100
        : 0;
    } else if (plotType === 'Week') {
      totalConsumption = consumptionTrace.y.reduce((sum, val) => sum + (val || 0), 0);
      if (consumptionTrace.previousY && consumptionTrace.previousY.length > 0) {
        previousYearConsumption = consumptionTrace.previousY.reduce((sum, val) => sum + (val || 0), 0);
      }
      changeConsumption = previousYearConsumption !== 0
        ? ((totalConsumption - previousYearConsumption) / previousYearConsumption) * 100
        : 0;
    } else if (plotType === 'Month') {
      totalConsumption = consumptionTrace.y.reduce((sum, val) => sum + (val || 0), 0);
      if (consumptionTrace.previousY && consumptionTrace.previousY.length > 0) {
        previousYearConsumption = consumptionTrace.previousY.reduce((sum, val) => sum + (val || 0), 0);
      }
      changeConsumption = previousYearConsumption !== 0
        ? ((totalConsumption - previousYearConsumption) / previousYearConsumption) * 100
        : 0;
    } else if (plotType === 'Day') {
      totalConsumption = consumptionTrace.y.reduce((sum, val) => sum + (val || 0), 0);
      if (consumptionTrace.previousY && consumptionTrace.previousY.length > 0) {
        previousYearConsumption = consumptionTrace.previousY.reduce((sum, val) => sum + (val || 0), 0);
      }
      changeConsumption = totalConsumption - previousYearConsumption;
    }

    console.log(`vk: Total Consumption for ${plotType}: ${totalConsumption}`);
    console.log(`vk: Previous Year Consumption for ${plotType}: ${previousYearConsumption}`);
    console.log(`vk: Change Consumption for ${plotType}: ${changeConsumption}`);

    energyIntensitySQFT = totalConsumption / 100000;
    energyIntensityCapita = totalConsumption / 5000;
    totalCost = totalConsumption * parseFloat(staticInputValue);
    co2eEmissions = totalConsumption * parseFloat(staticEmmision);
    console.log(`vk: Energy Intensity SQFT for ${plotType}: ${energyIntensitySQFT}`);
    console.log(`vk: Energy Intensity Capita for ${plotType}: ${energyIntensityCapita}`);
    console.log(`vk: Total Cost for ${plotType}: ${totalCost}`);
    console.log(`vk: CO2e Emissions for ${plotType}: ${co2eEmissions}`);
  }

  if (tempTrace && tempTrace.y && tempTrace.y.length > 0) {
    avgTemperature = tempTrace.y[tempTrace.y.length - 1];
    console.log(`vk: Average Temperature for ${plotType}: ${avgTemperature}`);

    if (plotType === 'Year') {
      const previousTempIndex = tempTrace.x.findIndex((timestamp) => {
        const date = new Date(timestamp);
        return date < new Date(localNow.getFullYear() - 1, 0, 1); // Start of previous year
      });
      tempChange = previousTempIndex >= 0 && previousTempIndex < tempTrace.y.length - 1
        ? tempTrace.y[tempTrace.y.length - 1] - tempTrace.y[previousTempIndex]
        : 0;
    } else if (plotType === 'Week') {
      tempChange = tempTrace.y.length > 7 ? (tempTrace.y[tempTrace.y.length - 1] - tempTrace.y[tempTrace.y.length - 8]) : 0;
    } else if (plotType === 'Month') {
      tempChange = tempTrace.y.length > 30 ? (tempTrace.y[tempTrace.y.length - 1] - tempTrace.y[tempTrace.y.length - 31]) : 0;
    } else if (plotType === 'Day') {
      tempChange = tempTrace.y.length > 1 ? (tempTrace.y[tempTrace.y.length - 1] - tempTrace.y[tempTrace.y.length - 2]) : 0;
    }
    console.log(`vk: Temperature Change for ${plotType}: ${tempChange}`);
  }

  return {
    totalConsumption,
    previousYearConsumption,
    changeConsumption,
    energyIntensitySQFT,
    energyIntensityCapita,
    totalCost,
    co2eEmissions,
    avgTemperature,
    tempChange,
  };
};

const Energy = ({
  defaultDate,
  headerText,
  showBackButton,
  onBackButtonClick,
  fontSize,
  uuid,
  code,
  equipmentId,
}) => {
  const { apiData, isLoading: contextIsLoading, error: contextError, fetchData, setApiData: setContextApiData } = useContext(ApiDataContext);
  const [menu, setMenu] = useState({});
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(defaultDate);
  // const [plotData, setPlotData] = useState({}); // Remove
  const [traceVisibility, setTraceVisibility] = useState({});
  // const [error, setError] = useState(''); // Remove
  const [plotType, setPlotType] = useState('Day');
  // const [isLoading, setIsLoading] = useState(false); // Remove
  const plotContainerRef = useRef(null);
  // const isFetchingRef = useRef(false); // Remove
  const isDropdown = useMediaQuery('(max-width: 576px)');
  const isDropdown932 = useMediaQuery('(max-width: 932px) and (max-height: 430px)');
  const isDropdown820 = useMediaQuery('(max-width: 820px) and (max-height: 1180px)');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [staticInputValue, setStaticInputValue] = useState('0.12');
  const [staticEmmision, setStaticEmmision] = useState('0.63');
  const [anchorEl, setAnchorEl] = useState(null);
  const [traceColors, setTraceColors] = useState({});
  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7,
  });
  const [intensityMode, setIntensityMode] = useState('intensity_sqft');
  const [dialogOpen, setDialogOpen] = useState(null);
  const [activeView, setActiveView] = useState('descriptive');
  const { themes } = useTheme();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const userCompanyId = userInfo?.data?.company?.id ? userInfo.data.company.id[1] : '';
  const userTimeZone = userInfo?.data?.company?.timezone || 'Asia/Kolkata';
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/forecastData`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }

  useEffect(() => {
    if (!code) {
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
    }
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo && userInfo.data && !code) {
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
  const sid = params.get('sid');

  // fetchPlotData and fetchPlotDataExt removed

  const handleResize = useCallback(() => {
    setPlotDimensions({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  }, []);

  useEffect(() => {
    if (menu.uuid && dashboardCode && !code) {
      const bodyParams = {
        warehouse_url: warehouseUrl,
        uuid: menu.uuid,
        code: dashboardCode,
        equipment_id: equipmentId || sid,
        company_timezone: userTimeZone,
      };
      fetchData(bodyParams).then(() => {
        // Assuming fetchData is successful, update lastUpdated
        // If fetchData itself updated a timestamp in context, that could be used too.
        setLastUpdated(new Date());
      });
    }
  }, [fetchData, menu.uuid, dashboardCode, code, warehouseUrl, equipmentId, sid, userTimeZone]);

  useEffect(() => {
    if (uuid && code) {
      const bodyParams = {
        warehouse_url: warehouseUrl,
        uuid,
        code,
        equipment_id: equipmentId || sid,
        company_timezone: userTimeZone,
      };
      fetchData(bodyParams).then(() => {
        setLastUpdated(new Date());
      });
    }
  }, [fetchData, uuid, code, warehouseUrl, equipmentId, sid, userTimeZone]);

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
      MuiRadio: { styleOverrides: { root: { color: '#ffffff' } } },
    },
  }), []);

  const currentData = useMemo(() => {
    const data = apiData || {}; // Use apiData from context
    console.log('Current Data from context:', data);
    return data;
  }, [apiData]);

  const customLayout = useMemo(() => ({
    paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    xaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      rangeslider: { visible: true },
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      title: { font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      title: { font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
    },
    yaxis2: {
      showgrid: false,
      zeroline: false,
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
      title: { font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' } },
    },
    showlegend: true,
    legend: {
      font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
    },
    hoverlabel: {
      bgcolor: '#000000',
      font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
    },
  }), [themes]);

  const getUpdatedPlotData = useCallback(() => {
    const { traces } = parseApiData(currentData);
    console.log('Parsed Traces before processing:', traces);
    const allowedTraces = [
      'Actual_Consumption',
      'Actual_Temp',
    ];
    const uniqueTraces = [];
    const seenNames = new Set();

    traces.forEach((trace) => {
      if (allowedTraces.includes(trace.name) && !seenNames.has(trace.name)) {
        seenNames.add(trace.name);
        let updatedTrace = { ...trace };

        if (trace.name === 'Actual_Consumption' || trace.name === 'Actual_Temp') {
          console.log(`Processing ${trace.name} for ${plotType}`);
          updatedTrace = aggregateData(trace, plotType, lastUpdated);
          console.log(`Processed ${trace.name} data for ${plotType}:`, updatedTrace);
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
          ...(trace.name === 'Actual_Temp' && { yaxis: 'y2' }),
        });
      }
    });

    console.log('Final Updated Plot Data:', uniqueTraces);
    return uniqueTraces;
  }, [currentData, plotType, traceVisibility, traceColors, lastUpdated]);

  const getControlTraces = useCallback(() => {
    const allTraces = getUpdatedPlotData();
    return allTraces.filter((trace) => trace.name !== 'Energy Consumption');
  }, [getUpdatedPlotData]);

  const handleTraceVisibilityChange = (traceName) => {
    setTraceVisibility((prev) => ({ ...prev, [traceName]: !prev[traceName] }));
  };

  const handleTraceColorChange = (color) => {
    setTraceColors((prev) => ({ ...prev, [selectedTrace]: color.hex }));
    closeColorPicker();
  };

  const openColorPicker = (event, traceName) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrace(traceName);
  };

  const closeColorPicker = () => {
    setAnchorEl(null);
    setSelectedTrace(null);
  };

  const formatTitle = (key) => key.trim().replace(/_/g, ' ');

  const kpiData = useMemo(() => {
    const traces = getUpdatedPlotData();
    return calculateKPI(traces, plotType, lastUpdated, staticInputValue, staticEmmision);
  }, [getUpdatedPlotData, plotType, lastUpdated, staticInputValue, staticEmmision]);

  const handleIntensityChange = (mode) => {
    setIntensityMode(mode);
  };

  const handleOpenDialog = (metric) => setDialogOpen(metric);
  const handleCloseDialog = () => setDialogOpen(null);

  const metricDescriptions = {
    Mean: 'The average energy consumption over the observed period, measured in kWh.',
    'Mean Variability': 'The average fluctuation in energy consumption, indicating stability or variability.',
    Median: 'The middle value of energy consumption when ordered, providing a robust central tendency measure.',
    'Standard Deaviation': 'A measure of the dispersion of energy consumption values around the mean.',
    Range: 'The difference between the maximum and minimum energy consumption values, showing the spread.',
    Skewness: 'Indicates the asymmetry of the energy consumption distribution. Positive skewness means a right-skewed distribution.',
    Kurtosis: 'Measures the "tailedness" of the distribution. A value of 2.8 indicates a Platykurtic distribution with thinner tails.',
  };

  const handleDescriptiveClick = () => setActiveView('descriptive');
  const handleDiagnosticClick = () => setActiveView('diagnostic');
  const handlePredictiveClick = () => setActiveView('predictive');
  const handlePrescriptiveClick = () => setActiveView('prescriptive');
  const intensityType = intensityMode;

  return (
    <ThemeProvider theme={theme}>
      {contextIsLoading || !menu ? ( // Use contextIsLoading
        <Box sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
        >
          <CircularProgress />
        </Box>
      ) : contextError ? ( // Use contextError
        <Box sx={{ color: 'white' }}>
          <Typography>{contextError}</Typography>
        </Box>
      ) : (
        <Card>
          {(menu && dashboardCode) || (code && uuid) && (
            <CardHeader
              headerText={headerText || 'Energy'}
              showBackButton={showBackButton}
              onBackButtonClick={onBackButtonClick}
              fontSize={fontSize}
            >
              <div style={{ marginBottom: '9px', display: 'flex', gap: '10px' }}>
                <Button
                  onClick={handleDescriptiveClick}
                  sx={{
                    textTransform: 'none',
                    color: themes === 'light' ? '#FFFFFF' : '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '17px',
                    fontWeight: 'bold',
                    padding: '6px 16px',
                    fontSize: '17px',
                    textDecoration: activeView === 'descriptive' ? 'underline' : 'none',
                    textUnderlineOffset: '14px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Descriptive
                </Button>
                <Button
                  onClick={handleDiagnosticClick}
                  sx={{
                    textTransform: 'none',
                    color: themes === 'light' ? '#FFFFFF' : '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '17px',
                    fontWeight: 'bold',
                    fontSize: '17px',
                    padding: '6px 16px',
                    textDecoration: activeView === 'diagnostic' ? 'underline' : 'none',
                    textUnderlineOffset: '14px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Diagnostic
                </Button>
                <Button
                  onClick={handlePredictiveClick}
                  sx={{
                    textTransform: 'none',
                    color: themes === 'light' ? '#FFFFFF' : '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '17px',
                    fontWeight: 'bold',
                    fontSize: '17px',
                    padding: '6px 16px',
                    textDecoration: activeView === 'predictive' ? 'underline' : 'none',
                    textUnderlineOffset: '14px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Predictive
                </Button>
                <Button
                  onClick={handlePrescriptiveClick}
                  sx={{
                    textTransform: 'none',
                    color: themes === 'light' ? '#FFFFFF' : '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '17px',
                    fontWeight: 'bold',
                    fontSize: '17px',
                    padding: '6px 16px',
                    textDecoration: activeView === 'prescriptive' ? 'underline' : 'none',
                    textUnderlineOffset: '14px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Prescriptive
                </Button>
              </div>
            </CardHeader>
          )}

          {activeView === 'descriptive' ? (
            <>
              <Grid
                container
                spacing={{
                  xs: 2, sm: 2, md: 0, lg: 0,
                }}
                columns={{
                  xs: 4, sm: 8, md: 12, lg: 12,
                }}
                className="main-content-1"
              >
                <Grid item xs={12} sm={12} md={8} lg={8} className="padding-15px display">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div className="responsive-1">
                      <div className="energybox">
                        <div>
                          <Typography className="tit" component="p">Total Consumption</Typography>
                          <div className="valueimag">
                            <img src={total} alt="Consumption" className="data-image-energy" />
                            <Typography className="subtit" component="p">
                              {isNaN(kpiData.totalConsumption) ? 'N/A' : kpiData.totalConsumption.toFixed(1)}
                              {' '}
                              kWh
                            </Typography>
                          </div>
                          {plotType === 'Year' ? (
                            <Typography className="chart-title-responsive" component="p" style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}>
                              {isNaN(kpiData.changeConsumption) ? 'N/A' : kpiData.changeConsumption.toFixed(1)}
                              %
                              {kpiData.changeConsumption !== 0 && (kpiData.changeConsumption < 0 ? '▼' : '▲')}
                              {' '}
                              predicted change
                            </Typography>
                          ) : (
                            <Typography
                              className="chart-title-responsive"
                              component="p"
                              style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}
                            >
                              {isNaN(kpiData.changeConsumption) ? 'N/A' : `${kpiData.changeConsumption.toFixed(1)} ${plotType === 'Day' ? 'kWh' : '%'} ${kpiData.changeConsumption !== 0 ? (kpiData.changeConsumption < 0 ? '▼' : '▲') : ''} predicted change`}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="energybox">
                        <div>
                          <Typography className="tit" component="p">Energy Intensity</Typography>
                          <div className="valueimag">
                            <img src={energy} alt="Energy Intensity" className="data-image-energy" />
                            <Typography className="subtit" component="p">
                              {isNaN(kpiData.energyIntensitySQFT) ? 'N/A' : (intensityMode === 'intensity_sqft' ? kpiData.energyIntensitySQFT.toFixed(4) : kpiData.energyIntensityCapita.toFixed(4))}
                              {' '}
                              {intensityMode === 'intensity_sqft' ? 'kWh/sqft' : 'kWh/capita'}
                            </Typography>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <Button
                              variant="contained"
                              onClick={() => handleIntensityChange('intensity_sqft')}
                              sx={{
                                textTransform: 'none',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                backgroundColor: intensityType === 'intensity_sqft' ? '#09684C' : (themes === 'light' ? '#2D2E2D' : '#000000'),
                                color: themes === 'light' ? '#FFFFFF' : (intensityType === 'intensity_sqft' ? '#FFFFFF' : '#BBBBBB'),
                                borderColor: intensityType === 'intensity_sqft' ? '#09684C' : (themes === 'light' ? '#FFFFFF' : '#BBBBBB'),
                                '&:hover': {
                                  backgroundColor: intensityType === 'intensity_sqft' ? '#09684C' : (themes === 'light' ? '#4A4B4A' : '#444444'),
                                  borderColor: intensityType === 'intensity_sqft' ? '#09684C' : (themes === 'light' ? '#FFFFFF' : '#888888'),
                                },
                              }}
                            >
                              SQFT
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleIntensityChange('intensity_capita')}
                              sx={{
                                textTransform: 'none',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                backgroundColor: intensityType === 'intensity_capita' ? '#09684C' : (themes === 'light' ? '#2D2E2D' : '#000000'),
                                color: themes === 'light' ? '#FFFFFF' : (intensityType === 'intensity_capita' ? '#FFFFFF' : '#BBBBBB'),
                                borderColor: intensityType === 'intensity_capita' ? '#09684C' : (themes === 'light' ? '#FFFFFF' : '#BBBBBB'),
                                '&:hover': {
                                  backgroundColor: intensityType === 'intensity_capita' ? '#09684C' : (themes === 'light' ? '#4A4B4A' : '#444444'),
                                  borderColor: intensityType === 'intensity_capita' ? '#09684C' : (themes === 'light' ? '#FFFFFF' : '#888888'),
                                },
                              }}
                            >
                              Capita
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="energybox">
                        <div>
                          <Typography className="tit" component="p">Total Cost</Typography>
                          <div className="valueimag">
                            <img src={totalcost} alt="Cost" className="data-image-energy" />
                            <Typography className="subtit" component="p">{isNaN(kpiData.totalCost) ? 'N/A' : `$${kpiData.totalCost.toFixed(2)}`}</Typography>
                          </div>
                          {plotType === 'Year' ? (
                            <Typography className="chart-title-responsive" component="p" style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}>
                              {isNaN(kpiData.changeConsumption * parseFloat(staticInputValue)) ? 'N/A' : (kpiData.changeConsumption * parseFloat(staticInputValue) / 100).toFixed(2)}
                              {' '}
                              $
                              {kpiData.changeConsumption !== 0 && (kpiData.changeConsumption < 0 ? '▼' : '▲')}
                              {' '}
                              predicted change
                            </Typography>
                          ) : (
                            <Typography
                              className="chart-title-responsive"
                              component="p"
                              style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}
                            >
                              {isNaN(kpiData.changeConsumption) ? 'N/A' : `${kpiData.changeConsumption.toFixed(1)} ${plotType === 'Day' ? 'kWh' : '%'} ${kpiData.changeConsumption !== 0 ? (kpiData.changeConsumption < 0 ? '▼' : '▲') : ''} predicted change`}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="energybox">
                        <div>
                          <Typography className="tit" component="p">CO2e Emissions</Typography>
                          <div className="valueimag">
                            <img src={co2} alt="Emissions" className="data-image-energy" />
                            <Typography className="subtit" component="p">
                              {isNaN(kpiData.co2eEmissions) ? 'N/A' : kpiData.co2eEmissions.toFixed(2)}
                              {' '}
                              tCO2e
                            </Typography>
                          </div>
                          {plotType === 'Year' ? (
                            <Typography className="chart-title-responsive" component="p" style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}>
                              {isNaN(kpiData.changeConsumption * parseFloat(staticEmmision)) ? 'N/A' : (kpiData.changeConsumption * parseFloat(staticEmmision) / 100).toFixed(2)}
                              {' '}
                              tCO2e
                              {kpiData.changeConsumption !== 0 && (kpiData.changeConsumption < 0 ? '▼' : '▲')}
                              {' '}
                              predicted change
                            </Typography>
                          ) : (
                            <Typography
                              className="chart-title-responsive"
                              component="p"
                              style={{ color: kpiData.changeConsumption < 0 ? 'green' : 'red' }}
                            >
                              {isNaN(kpiData.changeConsumption) ? 'N/A' : `${kpiData.changeConsumption.toFixed(1)} ${plotType === 'Day' ? 'kWh' : '%'} ${kpiData.changeConsumption !== 0 ? (kpiData.changeConsumption < 0 ? '▼' : '▲') : ''} predicted change`}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="energybox">
                        <div>
                          <Typography className="tit" component="p">Average Temperature</Typography>
                          <div className="valueimag">
                            <img src={temp} alt="Temperature" className="data-image-energy" />
                            <Typography className="subtit" component="p">
                              {isNaN(kpiData.avgTemperature) ? 'N/A' : kpiData.avgTemperature.toFixed(2)}
                              {' '}
                              °C
                            </Typography>
                          </div>
                          <Typography className="chart-title-responsive" component="p" style={{ color: kpiData.tempChange < 0 ? 'green' : 'red' }}>
                            {kpiData.tempChange === 0 || isNaN(kpiData.tempChange)
                              ? 'N/A'
                              : `${kpiData.tempChange < 0 ? '▼' : '▲'} (+${Math.abs(kpiData.tempChange).toFixed(2)}${plotType === 'Year' ? '%' : '°C'})`}
                          </Typography>
                          {' '}
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="main-content-2" sx={{ paddingTop: 0 }}>
                <Grid item xs={12} md={8}>
                  {getUpdatedPlotData().length > 0 ? (
                    <Box sx={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                      <Box ref={plotContainerRef} className="plot-container1">
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
                                ? `%{y:.2f} kWh<br>Cost: $${(trace.y * parseFloat(staticInputValue)).toFixed(2)}<br>%{x}`
                                : trace.hovertemplate || '%{y:.2f} °C<br>%{x}',
                            }))}
                            layout={{
                              ...customLayout,
                              ...(currentData.layout || {}),
                              title: {
                                font: { family: 'Mulish', size: 17, color: themes === 'light' ? '#FFFFFF' : '#000000' },
                                y: 0.95,
                                x: 0.02,
                                align: 'left',
                              },
                              font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
                              paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
                              plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
                              xaxis: {
                                title: '',
                                tickformat: plotType === 'Day' ? '%H:%p' : plotType === 'Week' ? '%d %b %Y' : plotType === 'Month' ? '%d %b %Y' : '%b %Y',
                                tickangle: 0,
                                showgrid: false,
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
                                font: {
                                  color: themes === 'light' ? '#FFFFFF' : '#000000',
                                  family: 'Mulish, sans-serif',
                                },
                                orientation: 'h',
                                x: 0.5,
                                xanchor: 'center',
                                y: -0.2,
                                yanchor: 'top',
                              },
                              hoverlabel: {
                                bgcolor: '#000000',
                                font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
                              },
                              // annotations: [
                              //   {
                              //     x: 0.5, // Adjust horizontal position (0 to 1)
                              //     y: 0.8, // Adjust vertical position (0 to 1)
                              //     xref: 'paper',
                              //     yref: 'paper',
                              //     xanchor:"right",
                              //     yanchor:"top",
                              //     showarrow: false,
                              //     arrowhead: 2,
                              //     ax: 20, // Arrow x offset
                              //     ay: -30, // Arrow y offset
                              //     font: {
                              //       family: 'Mulish, sans-serif',
                              //       size: 15,
                              //       color: themes === 'light' ? '#FFFFFF' : '#000000',
                              //     },
                              //     bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
                              //     bordercolor: themes === 'light' ? 'gray' : '#000000',
                              //     borderwidth: 1,
                              //     borderpad: 4,

                              //   },
                              //   // Add more annotations as needed
                              // ],
                            }}

                            style={{ width: plotDimensions.width, height: 588 }}
                            config={{ displaylogo: false }}
                            useResizeHandler
                          />
                        </div>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ padding: 2 }}>
                      <Typography>
                        No plot data available for the selected time range. Please check the API response or try a different range.
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    className="keybox"
                    sx={{
                      flex: 1, padding: 2, borderRadius: 1, boxShadow: 1, backgroundColor: '#FFFEFE',
                    }}
                  >
                    <div className="insights">
                      <Typography variant="h6" className="insights-head">Key Metrics & Insights</Typography>
                      {[
                        { key: 'Mean', value: '82.3 kWh' },
                        { key: 'Mean Variability', value: '+3.2 kWh' },
                        { key: 'Median', value: '80.1 kWh' },
                        { key: 'Standard Deaviation', value: '12.6 kWh' },
                        { key: 'Range', value: '51 kWh(35-86 kWh)' },
                        { key: 'Skewness', value: '0.42(Right-skewed)' },
                        { key: 'Kurtosis', value: '2.8(Platykurtic)' },
                      ].map((metric) => (
                        <div key={metric.key} className="insights-box-energy" style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography className="insights-key">{metric.key}</Typography>
                          <div className="insight-dialog">
                            <Typography className="insights-value">{metric.value}</Typography>
                            <IconButton onClick={() => handleOpenDialog(metric.key)} aria-label="info">
                              <InfoIcon />
                            </IconButton>
                          </div>
                          <Dialog open={dialogOpen === metric.key} onClose={handleCloseDialog}>
                            <DialogTitle>
                              {metric.key}
                              {' '}
                              Information
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>{metricDescriptions[metric.key]}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseDialog}>Close</Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                    <div className="insights">
                      <Typography variant="h6" className="insights-head">Rate Configuration</Typography>
                      <div className="insights-box-energy">
                        <Typography className="insights-key">Cost /kW(Rs.)</Typography>
                        <input type="text" className="insights-input" value={staticInputValue} onChange={(e) => setStaticInputValue(e.target.value)} />
                      </div>
                      <div className="insights-box-energy">
                        <Typography className="insights-key">Carbon emission /kW</Typography>
                        <input type="text" className="insights-input" value={staticEmmision} onChange={(e) => setStaticEmmision(e.target.value)} />
                      </div>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : activeView === 'diagnostic' ? (
            <Diagnostic equipmentId={equipmentId} />
          ) : activeView === 'predictive' ? (
            <Predictive equipmentId={equipmentId} />
          ) : activeView === 'prescriptive' ? (
            <Prescriptive equipmentId={equipmentId} />
          ) : null}

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closeColorPicker}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <SketchPicker color={traceColors[selectedTrace] || '#FFFFFF'} onChangeComplete={handleTraceColorChange} />
          </Popover>
        </Card>
      )}
    </ThemeProvider>
  );
};

export default Energy;
