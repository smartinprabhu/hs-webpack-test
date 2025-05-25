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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Plot from 'react-plotly.js';
import { getSequencedMenuItems } from '../../util/appUtils';
import CardHeader from './CardHeaderRes';
import Card from './CardRes';
import PlotTypeSelector from '../PlottypeSelector';
import './EnergyAnalytics.css';

import performance from './image/Performance.svg';
import target from './image/TargetGoal.svg';
import totalcost from './image/totalcost.svg';

// Helper functions (unchanged)
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
};

const formatMonth = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Month';
  }
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

const getDayName = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Day';
  }
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const parseApiData = (apiData) => {
  console.log('Raw API Data:', apiData);
  if (!apiData) {
    console.warn('No valid plot data found in API response');
    return { traces: [], rootCauseAnalysis: [] };
  }

  let plotData = apiData;
  if (Array.isArray(apiData) && apiData.length > 0 && Array.isArray(apiData[0]) && apiData[0][0] === 'Data') {
    plotData = apiData[0][1]?.plot || {};
  }

  const traces = plotData.data || [];
  const rootCauseAnalysis = plotData.Root_Cause_Analysis || [];
  if (!Array.isArray(traces)) {
    console.warn('Plot data is not an array:', traces);
    return { traces: [], rootCauseAnalysis };
  }

  console.log('Parsed Traces:', traces);
  return { traces, rootCauseAnalysis };
};

const aggregateData = (trace, plotType, currentTime, selectedDate) => {
  if (!trace || !trace.x || !trace.y || !Array.isArray(trace.x) || !Array.isArray(trace.y)) {
    console.warn(`Invalid trace data for ${trace?.name || 'unknown'}:`, trace);
    const defaultTrace = {
      ...trace,
      x: [],
      y: [],
      aggregatedSum: 0,
      previousSum: 0,
      lastValue: 0,
      changes: [],
      metadata: {},
    };
    if (plotType === 'MOM') {
      defaultTrace.selectedPeriodData = [];
      defaultTrace.priorPeriodData = [];
      defaultTrace.selectedPeriodDates = [];
      defaultTrace.priorPeriodDates = [];
    } else if (plotType === 'DOD') {
      defaultTrace.selectedData = [];
      defaultTrace.priorData = [];
      defaultTrace.selectedDates = [];
      defaultTrace.priorDates = [];
    } else if (plotType === 'WOW') {
      defaultTrace.selectedWeekData = [];
      defaultTrace.priorWeekData = [];
      defaultTrace.selectedWeekDates = [];
      defaultTrace.priorWeekDates = [];
      defaultTrace.selectedWeekDays = [];
      defaultTrace.priorWeekDays = [];
    } else if (plotType === 'YOY') {
      defaultTrace.selectedYearData = [];
      defaultTrace.priorYearData = [];
      defaultTrace.selectedYearDates = [];
      defaultTrace.priorYearDates = [];
    }
    return defaultTrace;
  }

  const now = new Date(currentTime);
  const timeZoneOffset = now.getTimezoneOffset() * 60000;
  const localNow = new Date(now.getTime() - timeZoneOffset);
  const selected = selectedDate ? new Date(selectedDate) : localNow;

  if (isNaN(selected.getTime())) {
    console.warn('Invalid selected date:', selectedDate);
    const defaultTrace = {
      ...trace,
      x: [],
      y: [],
      aggregatedSum: 0,
      previousSum: 0,
      lastValue: 0,
      changes: [],
      metadata: {},
    };
    if (plotType === 'MOM') {
      defaultTrace.selectedPeriodData = [];
      defaultTrace.priorPeriodData = [];
      defaultTrace.selectedPeriodDates = [];
      defaultTrace.priorPeriodDates = [];
    } else if (plotType === 'DOD') {
      defaultTrace.selectedData = [];
      defaultTrace.priorData = [];
      defaultTrace.selectedDates = [];
      defaultTrace.priorDates = [];
    } else if (plotType === 'WOW') {
      defaultTrace.selectedWeekData = [];
      defaultTrace.priorWeekData = [];
      defaultTrace.selectedWeekDates = [];
      defaultTrace.priorWeekDates = [];
      defaultTrace.selectedWeekDays = [];
      defaultTrace.priorWeekDays = [];
    } else if (plotType === 'YOY') {
      defaultTrace.selectedYearData = [];
      defaultTrace.priorYearData = [];
      defaultTrace.selectedYearDates = [];
      defaultTrace.priorYearDates = [];
    }
    return defaultTrace;
  }

  console.log(`Aggregating for ${plotType} at ${localNow.toISOString()} for ${trace.name}, selected date: ${selected.toISOString()}`);

  const aggregateDOD = (x, y) => {
    const selectedDay = new Date(selected);
    selectedDay.setHours(0, 0, 0, 0);
    const priorDay = new Date(selectedDay);
    priorDay.setDate(selectedDay.getDate() - 1);
  
    const selectedData = Array(24).fill(0);
    const priorData = Array(24).fill(0);
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';
      return `${hour} ${period}`;
    });
    const selectedDates = Array(24).fill(formatDate(selectedDay));
    const priorDates = Array(24).fill(formatDate(priorDay));
    const changes = [];
  
    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
  
        const hour = date.getHours();
        if (
          date.getFullYear() === selectedDay.getFullYear() &&
          date.getMonth() === selectedDay.getMonth() &&
          date.getDate() === selectedDay.getDate()
        ) {
          selectedData[hour] += y[index] || 0;
        } else if (
          date.getFullYear() === priorDay.getFullYear() &&
          date.getMonth() === priorDay.getMonth() &&
          date.getDate() === priorDay.getDate()
        ) {
          priorData[hour] += y[index] || 0;
        }
      } catch (error) {
        console.error(`Error parsing timestamp at index ${index} for ${trace.name}: ${timestamp}`, error);
      }
    });
  
    const latestHour = Math.min(localNow.getHours(), 23);
    for (let i = 0; i <= latestHour; i++) {
      if (priorData[i] !== 0) {
        const change = ((selectedData[i] - priorData[i]) / priorData[i]) * 100;
        changes.push(change);
      }
    }
  
    const selectedSum = selectedData.reduce((sum, val) => sum + val, 0);
    const priorSum = priorData.reduce((sum, val) => sum + val, 0);
    const lastValue = selectedData[latestHour] || 0;
  
    return {
      x: hours,
      selectedData,
      priorData,
      selectedDates,
      priorDates,
      sum: selectedSum,
      previousSum: priorSum,
      lastValue,
      changes,
      selectedDay,
      priorDay,
    };
  };

  const aggregateWOW = (x, y) => {
    const endDate = new Date(selected);
    endDate.setHours(23, 59, 59, 999);
    const startSelectedWeek = new Date(endDate);
    startSelectedWeek.setDate(endDate.getDate() - 6);
    startSelectedWeek.setHours(0, 0, 0, 0);
    const startPriorWeek = new Date(startSelectedWeek);
    startPriorWeek.setDate(startSelectedWeek.getDate() - 7);
    const endPriorWeek = new Date(startPriorWeek);
    endPriorWeek.setDate(startPriorWeek.getDate() + 6);

    const selectedWeekData = Array(7).fill(0);
    const priorWeekData = Array(7).fill(0);
    const selectedWeekDates = [];
    const priorWeekDates = [];
    const selectedWeekDays = [];
    const priorWeekDays = [];
    const changes = [];
    let sum = 0;
    let previousSum = 0;
    let lastValue = 0;

    for (let i = 0; i < 7; i++) {
      const selectedDate = new Date(startSelectedWeek);
      selectedDate.setDate(startSelectedWeek.getDate() + i);
      const priorDate = new Date(startPriorWeek);
      priorDate.setDate(startPriorWeek.getDate() + i);
      selectedWeekDates.push(formatDate(selectedDate));
      priorWeekDates.push(formatDate(priorDate));
      selectedWeekDays.push(getDayName(selectedDate));
      priorWeekDays.push(getDayName(priorDate));
    }

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startSelectedWeek && date <= endDate) {
          const dayIndex = Math.floor((date - startSelectedWeek) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            selectedWeekData[dayIndex] += y[index] || 0;
            sum += y[index] || 0;
            if (dayIndex === 6) lastValue = y[index] || 0;
          }
        } else if (date >= startPriorWeek && date <= endPriorWeek) {
          const dayIndex = Math.floor((date - startPriorWeek) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            priorWeekData[dayIndex] += y[index] || 0;
            previousSum += y[index] || 0;
          }
        }
      } catch (error) {
        console.error(`Error in aggregateWOW for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    selectedWeekData.forEach((selectedVal, i) => {
      const priorVal = priorWeekData[i];
      if (priorVal !== 0) {
        changes.push(((selectedVal - priorVal) / priorVal) * 100);
      }
    });

    const dayLabels = selectedWeekDays;

    return {
      x: dayLabels,
      selectedWeekData,
      priorWeekData,
      selectedWeekDates,
      priorWeekDates,
      selectedWeekDays,
      priorWeekDays,
      sum,
      previousSum,
      lastValue,
      changes,
      selectedWeekStart: startSelectedWeek,
      priorWeekStart: startPriorWeek,
    };
  };

  const aggregateMOM = (x, y) => {
    const selectedDate = new Date(selected);
    selectedDate.setHours(23, 59, 59, 999);

    const endSelectedPeriod = new Date(selectedDate);
    const startSelectedPeriod = new Date(selectedDate);
    startSelectedPeriod.setDate(selectedDate.getDate() - 29);
    startSelectedPeriod.setHours(0, 0, 0, 0);

    const endPriorPeriod = new Date(startSelectedPeriod);
    endPriorPeriod.setDate(startSelectedPeriod.getDate() - 1);
    endPriorPeriod.setHours(23, 59, 59, 999);
    const startPriorPeriod = new Date(endPriorPeriod);
    startPriorPeriod.setDate(endPriorPeriod.getDate() - 29);
    startPriorPeriod.setHours(0, 0, 0, 0);

    const daysToCompare = 30;
    const selectedPeriodData = Array(daysToCompare).fill(0);
    const priorPeriodData = Array(daysToCompare).fill(0);
    const selectedPeriodDates = [];
    const priorPeriodDates = [];
    const changes = [];
    let sum = 0;
    let previousSum = 0;
    let lastValue = 0;

    for (let i = 0; i < daysToCompare; i++) {
      const selectedDate = new Date(startSelectedPeriod);
      selectedDate.setDate(startSelectedPeriod.getDate() + i);
      const priorDate = new Date(startPriorPeriod);
      priorDate.setDate(startPriorPeriod.getDate() + i);
      selectedPeriodDates.push(selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      }).replace(/ /g, ' '));
      priorPeriodDates.push(priorDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/ /g, ' '));
    }

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startSelectedPeriod && date <= endSelectedPeriod) {
          const dayIndex = Math.floor((date - startSelectedPeriod) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < daysToCompare) {
            selectedPeriodData[dayIndex] += y[index] || 0;
            sum += y[index] || 0;
            if (dayIndex === daysToCompare - 1) lastValue = y[index] || 0;
          }
        } else if (date >= startPriorPeriod && date <= endPriorPeriod) {
          const dayIndex = Math.floor((date - startPriorPeriod) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < daysToCompare) {
            priorPeriodData[dayIndex] += y[index] || 0;
            previousSum += y[index] || 0;
          }
        }
      } catch (error) {
        console.error(`Error in aggregateMOM for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    selectedPeriodData.forEach((selectedVal, i) => {
      const priorVal = priorPeriodData[i];
      if (priorVal !== 0) {
        changes.push(((selectedVal - priorVal) / priorVal) * 100);
      }
    });

    const dayLabels = selectedPeriodDates;

    return {
      x: dayLabels,
      selectedPeriodData,
      priorPeriodData,
      selectedPeriodDates,
      priorPeriodDates,
      sum,
      previousSum,
      lastValue,
      changes,
      selectedPeriodStart: startSelectedPeriod,
      priorPeriodStart: startPriorPeriod,
      daysToCompare,
    };
  };

  const aggregateYOY = (x, y) => {
    const selectedYear = new Date(selected).getFullYear();
    const priorYear = selectedYear - 1;

    const startSelectedYear = new Date(selectedYear, 0, 1);
    startSelectedYear.setHours(0, 0, 0, 0);
    const endSelectedYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
    const startPriorYear = new Date(priorYear, 0, 1);
    startPriorYear.setHours(0, 0, 0, 0);
    const endPriorYear = new Date(priorYear, 11, 31, 23, 59, 59, 999);

    const selectedYearData = Array(12).fill(0);
    const priorYearData = Array(12).fill(0);
    const selectedYearDates = [];
    const priorYearDates = [];
    const changes = [];
    let sum = 0;
    let previousSum = 0;
    let lastValue = 0;

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      const selectedDate = new Date(selectedYear, i, 1);
      const priorDate = new Date(priorYear, i, 1);
      selectedYearDates.push(formatMonth(selectedDate));
      priorYearDates.push(formatMonth(priorDate));
    }

    x.forEach((timestamp, index) => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid timestamp at index ${index} for ${trace.name}: ${timestamp}`);
          return;
        }
        if (date >= startSelectedYear && date <= endSelectedYear) {
          const monthIndex = date.getMonth();
          selectedYearData[monthIndex] += y[index] || 0;
          sum += y[index] || 0;
          if (monthIndex === selected.getMonth()) lastValue = y[index] || 0;
        } else if (date >= startPriorYear && date <= endPriorYear) {
          const monthIndex = date.getMonth();
          priorYearData[monthIndex] += y[index] || 0;
          previousSum += y[index] || 0;
        }
      } catch (error) {
        console.error(`Error in aggregateYOY for ${trace.name} at index ${index}: ${timestamp}`, error);
      }
    });

    selectedYearData.forEach((selectedVal, i) => {
      const priorVal = priorYearData[i];
      if (priorVal !== 0) {
        changes.push(((selectedVal - priorVal) / priorVal) * 100);
      }
    });

    return {
      x: monthLabels,
      selectedYearData,
      priorYearData,
      selectedYearDates,
      priorYearDates,
      sum,
      previousSum,
      lastValue,
      changes,
      selectedYearStart: startSelectedYear,
      priorYearStart: startPriorYear,
    };
  };

  let filteredTrace = { ...trace };
  let aggregatedSum = 0;
  let previousSum = 0;
  let lastValue = 0;
  let changes = [];
  let metadata = {};

  if (plotType === 'DOD') {
    const result = aggregateDOD(trace.x, trace.y);
    filteredTrace = {
      x: result.x,
      selectedData: result.selectedData,
      priorData: result.priorData,
      selectedDates: result.selectedDates,
      priorDates: result.priorDates,
    };
    aggregatedSum = result.sum;
    previousSum = result.previousSum;
    lastValue = result.lastValue;
    changes = result.changes;
    metadata = {
      selectedDay: result.selectedDay,
      priorDay: result.priorDay,
    };
  } else if (plotType === 'WOW') {
    const result = aggregateWOW(trace.x, trace.y);
    filteredTrace = {
      x: result.x,
      selectedWeekData: result.selectedWeekData,
      priorWeekData: result.priorWeekData,
      selectedWeekDates: result.selectedWeekDates,
      priorWeekDates: result.priorWeekDates,
      selectedWeekDays: result.selectedWeekDays,
      priorWeekDays: result.priorWeekDays,
    };
    aggregatedSum = result.sum;
    previousSum = result.previousSum;
    lastValue = result.lastValue;
    changes = result.changes;
    metadata = {
      selectedWeekStart: result.selectedWeekStart,
      priorWeekStart: result.priorWeekStart,
    };
  } else if (plotType === 'MOM') {
    const result = aggregateMOM(trace.x, trace.y);
    filteredTrace = {
      x: result.x,
      selectedPeriodData: result.selectedPeriodData,
      priorPeriodData: result.priorPeriodData,
      selectedPeriodDates: result.selectedPeriodDates || [],
      priorPeriodDates: result.priorPeriodDates || [],
    };
    aggregatedSum = result.sum;
    previousSum = result.previousSum;
    lastValue = result.lastValue;
    changes = result.changes;
    metadata = {
      selectedPeriodStart: result.selectedPeriodStart,
      priorPeriodStart: result.priorPeriodStart,
      daysToCompare: result.daysToCompare,
    };
  } else if (plotType === 'YOY') {
    const result = aggregateYOY(trace.x, trace.y);
    filteredTrace = {
      x: result.x,
      selectedYearData: result.selectedYearData,
      priorYearData: result.priorYearData,
      selectedYearDates: result.selectedYearDates,
      priorYearDates: result.priorYearDates,
    };
    aggregatedSum = result.sum;
    previousSum = result.previousSum;
    lastValue = result.lastValue;
    changes = result.changes;
    metadata = {
      selectedYearStart: result.selectedYearStart,
      priorYearStart: result.priorYearStart,
    };
  }

  console.log(`Final aggregation for ${trace.name} (${plotType}): sum=${aggregatedSum.toFixed(2)}, previousSum=${previousSum.toFixed(2)}, lastValue=${lastValue.toFixed(2)}`);
  return {
    ...trace,
    ...filteredTrace,
    type: trace.name === 'Actual_Consumption' ? 'bar' : 'scatter',
    aggregatedSum,
    previousSum,
    lastValue,
    changes,
    metadata,
  };
};

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

  if (consumptionTrace && targetTrace && consumptionTrace.aggregatedSum !== undefined && targetTrace.aggregatedSum !== undefined) {
    const totalConsumption = consumptionTrace.aggregatedSum || 0;
    const targetConsumption = targetTrace.aggregatedSum || 0;

    if (totalConsumption === 0 || targetConsumption === 0) {
      console.warn(`No data for Actual_Consumption or Actual_Target in ${plotType} period`);
    } else {
      const energySavings = ((targetConsumption - totalConsumption) / targetConsumption) * 100;
      const totalCost = totalConsumption * costPerKWh;
      const targetCost = targetConsumption * costPerKWh;
      const costReduction = targetCost - totalCost;

      performanceMetrics = {
        Performance_Metrics: `${totalConsumption.toFixed(2)} kWh`,
        Energy_Savings: `${energySavings.toFixed(2)}%`,
        Cost_Reduction: `${costReduction.toFixed(2)}$`,
      };

      console.log(
        `Performance Metrics for ${plotType}: Performance_Metrics=${totalConsumption.toFixed(2)} kWh, Energy_Savings=${energySavings.toFixed(2)}%, Cost_Reduction=${costReduction.toFixed(2)}$`
      );
    }
  } else {
    console.warn('Missing valid Actual_Consumption or Actual_Target trace for performance metrics');
  }

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

  if (targetTrace && targetTrace.aggregatedSum !== undefined && targetTrace.previousSum !== undefined) {
    const selectedTarget = targetTrace.aggregatedSum || 0;
    const priorTarget = targetTrace.previousSum || 0;

    const costAnalysisValue = selectedTarget * costPerKWh;
    const priorPeriodValue = priorTarget * costPerKWh;
    const costSaved = priorTarget - selectedTarget;
    const savings = priorTarget !== 0 ? ((costSaved / (priorTarget * costPerKWh)) * 100) : 0;

    costAnalysis = {
      Cost_Analysis: `$${costAnalysisValue.toFixed(2)}`,
      Previous_Period: `$${priorPeriodValue.toFixed(2)}`,
      Cost_Saved: `${costSaved.toFixed(2)}$`,
      Savings: `${savings.toFixed(2)}%`,
    };

    console.log(
      `Cost Analysis for ${plotType}: Cost_Analysis=${costAnalysisValue.toFixed(2)}, Previous_Period=${priorPeriodValue.toFixed(2)}, Cost_Saved=${costSaved.toFixed(2)} kWh, Savings=${savings.toFixed(2)}%`
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
}) => {
  const getInitialDate = () => {
    if (defaultDate && !isNaN(new Date(defaultDate).getTime())) {
      return new Date(defaultDate).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const [menu, setMenu] = useState('');
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(getInitialDate());
  const [plotData, setPlotData] = useState({});
  const [traceVisibility, setTraceVisibility] = useState({});
  const [error, setError] = useState('');
  const [plotType, setPlotType] = useState('DOD');
  const [isLoading, setIsLoading] = useState(false);
  const plotContainerRef = useRef(null);
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

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const userCompanyId = userInfo?.data?.company?.id ? userInfo.data.company.id[1] : '';
  const userTimeZone = userInfo?.data?.company?.timezone || '';

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('sid');
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/forecastData`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }


  useEffect(() => {
    const getmenus = getSequencedMenuItems(userRoles?.data?.allowed_modules || [], 'ESG Tracker', 'name');
    const energyMenu = getmenus.find((menu) => menu.name.toLowerCase() === 'energy');
    setMenu(energyMenu || '');
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo?.data) {
      if (userInfo.data.main_company?.category?.name?.toLowerCase() === 'company' && menu.company_dashboard_code) {
        setDashboardCode(menu.company_dashboard_code);
      } else {
        setDashboardCode(menu.dashboard_code);
      }
    }
  }, [menu, userInfo]);

  useEffect(() => {
    setActiveGroupFilter(getInitialDate());
    fetchPlotData();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultDate]);

  const handleResize = useCallback(() => {
    setPlotDimensions({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  }, []);

  const handlePlotTypeChange = useCallback((event, newType) => {
    if (newType !== null) {
      setPlotType(newType);
    }
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (newDate && !isNaN(new Date(newDate).getTime())) {
      setActiveGroupFilter(newDate);
    } else {
      console.warn('Invalid date selected:', newDate);
      setActiveGroupFilter(getInitialDate());
    }
  };

  const fetchPlotData = useCallback(async () => {
    setIsLoading(true);
    setPlotData({});
    try {
      const bodyParams = {
        warehouse_url: 'https://hs-dev-warehouse.helixsense.com',
        uuid: '6fdc74e4-7338-41fe-b28d-ce0ada9701b5',
        user_id: '0',
        company: '1',
        code: 'ENERGYV3',
        equipment_id: 'CG1-E-05144',
        company_timezone: 'Asia/Kolkata',
      };
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
    }
  }, []);

  const theme = useMemo(() => createTheme({
    components: {
      MuiRadio: { styleOverrides: { root: { color: '#ffffff' } } },
    },
  }), []);

  const currentData = useMemo(() => {
    const data = plotData || {};
    console.log('Current Data:', data);
    return data;
  }, [plotData]);

  const { performanceMetrics, targetMetrics, costAnalysis } = useMemo(() => {
    const { traces } = parseApiData(currentData);
    const processedTraces = traces.map((trace) => aggregateData(trace, plotType, lastUpdated, activeGroupFilter));
    return calculateKPI(processedTraces, plotType, lastUpdated, costPerKWh);
  }, [currentData, plotType, lastUpdated, activeGroupFilter, costPerKWh]);

  const getGroupedPlotData = useCallback((type) => {
    const { traces } = parseApiData(currentData);
    const allowedTraces = ['Actual_Consumption'];
    const uniqueTraces = [];
  
    traces.forEach((trace) => {
      const traceName = trace.name?.trim();
      if (!traceName || !allowedTraces.includes(traceName)) {
        return;
      }
  
      const updatedTrace = aggregateData(trace, type, lastUpdated, activeGroupFilter);
  
      if (type === 'DOD') {
        const selectedDayStr = formatDate(updatedTrace.metadata.selectedDay);
        const priorDayStr = formatDate(updatedTrace.metadata.priorDay);
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.selectedData,
          name: `${selectedDayStr}`,
          type: 'bar',
          marker: { color: '#2275e0' },
          customdata: (updatedTrace.selectedDates || []).map((date, i) => ({
            date: date,
            hour: updatedTrace.x[i],
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Hour</b>: %{x}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 0,
          visible: true,
          showlegend: true,
        });
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.priorData,
          name: `${priorDayStr}`,
          type: 'bar',
          marker: { color: '#6B7280' },
          customdata: (updatedTrace.priorDates || []).map((date, i) => ({
            date: date,
            hour: updatedTrace.x[i],
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Hour</b>: %{x}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 1,
          visible: true,
          showlegend: true,
        });
      } else if (type === 'WOW') {
        const selectedWeekStartStr = formatDate(updatedTrace.metadata.selectedWeekStart);
        const selectedWeekEnd = new Date(updatedTrace.metadata.selectedWeekStart);
        selectedWeekEnd.setDate(selectedWeekEnd.getDate() + 6);
        const selectedWeekEndStr = formatDate(selectedWeekEnd);
        const priorWeekStartStr = formatDate(updatedTrace.metadata.priorWeekStart);
        const priorWeekEnd = new Date(updatedTrace.metadata.priorWeekStart);
        priorWeekEnd.setDate(priorWeekEnd.getDate() + 6);
        const priorWeekEndStr = formatDate(priorWeekEnd);
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.selectedWeekData,
          name: `${selectedWeekStartStr} to ${selectedWeekEndStr}`,
          type: 'bar',
          marker: { color: '#2275e0' },
          customdata: (updatedTrace.selectedWeekDates || []).map((date, i) => ({
            date: date,
            day: updatedTrace.x[i],
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Day</b>: %{x}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 0,
          visible: true,
          showlegend: true,
        });
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.priorWeekData,
          name: `${priorWeekStartStr} to ${priorWeekEndStr}`,
          type: 'bar',
          marker: { color: '#6B7280' },
          customdata: (updatedTrace.priorWeekDates || []).map((date, i) => ({
            date: date,
            day: updatedTrace.x[i],
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Day</b>: %{x}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 1,
          visible: true,
          showlegend: true,
        });
      } else if (type === 'MOM') {
        const selectedPeriodStartStr = formatDate(updatedTrace.metadata.selectedPeriodStart);
        const selectedPeriodEndStr = formatDate(new Date(updatedTrace.metadata.selectedPeriodStart.getTime() + (updatedTrace.metadata.daysToCompare - 1) * 24 * 60 * 60 * 1000));
        const priorPeriodStartStr = formatDate(updatedTrace.metadata.priorPeriodStart);
        const priorPeriodEndStr = formatDate(new Date(updatedTrace.metadata.priorPeriodStart.getTime() + (updatedTrace.metadata.daysToCompare - 1) * 24 * 60 * 60 * 1000));
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.selectedPeriodData,
          name: `${selectedPeriodStartStr} to ${selectedPeriodEndStr}`,
          type: 'bar',
          marker: { color: '#2275e0' },
          customdata: (updatedTrace.selectedPeriodDates || []).map((date, i) => ({
            date: new Date(updatedTrace.metadata.selectedPeriodStart.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).replace(/ /g, ' '),
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 0,
          visible: true,
          showlegend: true,
        });
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.priorPeriodData,
          name: `${priorPeriodStartStr} to ${priorPeriodEndStr}`,
          type: 'bar',
          marker: { color: '#6B7280' },
          customdata: (updatedTrace.priorPeriodDates || []).map((date, i) => ({
            date: date,
          })),
          hovertemplate: `<b>Date</b>: %{customdata.date}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 1,
          visible: true,
          showlegend: true,
        });
      } else if (type === 'YOY') {
        const selectedYear = updatedTrace.metadata.selectedYearStart.getFullYear();
        const priorYear = updatedTrace.metadata.priorYearStart.getFullYear();
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.selectedYearData,
          name: `${selectedYear}`,
          type: 'bar',
          marker: { color: '#2275e0' },
          customdata: (updatedTrace.selectedYearDates || []).map((date) => ({ date })),
          hovertemplate: `<b>Month</b>: %{customdata.date}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 0,
          visible: true,
          showlegend: true,
        });
  
        uniqueTraces.push({
          x: updatedTrace.x,
          y: updatedTrace.priorYearData,
          name: `${priorYear}`,
          type: 'bar',
          marker: { color: '#6B7280' },
          customdata: (updatedTrace.priorYearDates || []).map((date) => ({ date })),
          hovertemplate: `<b>Month</b>: %{customdata.date}<br><b>Consumption</b>: %{y:.2f} kWh<extra></extra>`,
          offsetgroup: 1,
          visible: true,
          showlegend: true,
        });
      }
    });
  
    console.log('Final Grouped Plot Data:', uniqueTraces);
    return uniqueTraces;
  }, [currentData, plotType, lastUpdated, activeGroupFilter]);

  const customLayout = useMemo(() => {
    const selected = new Date(activeGroupFilter);
    if (isNaN(selected.getTime())) {
      console.warn('Invalid selected date in customLayout:', activeGroupFilter);
      return {
        title: { text: 'Invalid Date Selected' },
        paper_bgcolor: '#FEFDFE',
        plot_bgcolor: '#FEFDFE',
      };
    }
  
    const consumptionTrace = parseApiData(currentData).traces.find(t => t.name === 'Actual_Consumption');
    const processedTrace = consumptionTrace ? aggregateData(consumptionTrace, plotType, lastUpdated, activeGroupFilter) : { changes: [] };
    const avgChange = processedTrace.changes.length > 0 ? processedTrace.changes.reduce((sum, val) => sum + val, 0) / processedTrace.changes.length : 0;
  
    const baseLayout = {
      paper_bgcolor: '#FEFDFE',
      plot_bgcolor: '#FEFDFE',
      font: { color: 'black' },
      xaxis: {
        title: '',
        showgrid: false,
        type: 'category',
        tickangle: 0,
        tickfont: { size: plotType === 'MOM' ? 9 : 12 },
        tickmode: plotType === 'MOM' ? 'auto' : 'array',
        nticks: plotType === 'MOM' ? 10 : undefined,
        automargin: true,
        rangeslider: {
          visible: true,
          thickness: 0.1,
          bgcolor: '#E4E4ED',
          borderwidth: 0,
        },
      },
      yaxis: {
        title: { text: 'Consumption (kWh)' },
        side: 'left',
        position: -0.05,
        showgrid: false,
        ticklabelposition: 'inside',
      },
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.7,
        yanchor: 'top',
        tracegroupgap: 10,
        traceorder: 'normal',
        font: { color: 'black', size: 12 },
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        groupclick: 'toggleitem',
        grouptitlefont: {
          size: 15,
          color: '#534d4d',
          family: 'Arial, sans-serif',
          weight: 'bold',
        },
      },
      margin: { b: 250, t: 80, l: 60, r: 30 },
      showlegend: true,
      hovermode: 'x unified',
      barmode: 'group',
      bargap: 0.15,
      bargroupgap: 0.1,
    };
  
    if (plotType === 'DOD') {
      const selectedDay = new Date(activeGroupFilter);
      const priorDay = new Date(selectedDay);
      priorDay.setDate(selectedDay.getDate() - 1);
      const selectedDayStr = formatDate(selectedDay);
      const priorDayStr = formatDate(priorDay);
  
      return {
        ...baseLayout,
        title: {
          text: `Hourly Consumption: ${selectedDayStr} vs ${priorDayStr}`,
          font: { family: 'Mulish', size: 17, color: 'black' },
          y: 0.95,
          x: 0.02,
          align: 'left',
        },
        annotations: [{
          text: `Avg DoD Change: ${avgChange.toFixed(2)}%`,
          xref: 'paper',
          yref: 'paper',
          x: 1,
          y: 1,
          showarrow: false,
          font: { size: 12 },
          bgcolor: 'white',
          bordercolor: '#2275e0',
          borderwidth: 1,
          borderpad: 4,
        }],
      };
    } else if (plotType === 'WOW') {
      const endDate = new Date(selected);
      const startSelectedWeek = new Date(endDate);
      startSelectedWeek.setDate(endDate.getDate() - 6);
      const startPriorWeek = new Date(startSelectedWeek);
      startPriorWeek.setDate(startSelectedWeek.getDate() - 7);
      const priorWeekEnd = new Date(startPriorWeek);
      priorWeekEnd.setDate(priorWeekEnd.getDate() + 6);
  
      return {
        ...baseLayout,
        title: {
          text: `Daily Consumption: ${formatDate(startSelectedWeek)} to ${formatDate(endDate)} vs ${formatDate(startPriorWeek)} to ${formatDate(priorWeekEnd)}`,
          font: { family: 'Mulish', size: 17, color: 'black' },
          y: 0.95,
          x: 0.02,
          align: 'left',
        },
        annotations: [{
          text: `Avg WoW Change: ${avgChange.toFixed(2)}%`,
          xref: 'paper',
          yref: 'paper',
          x: 1,
          y: 1,
          showarrow: false,
          font: { size: 12 },
          bgcolor: 'white',
          bordercolor: '#2275e0',
          borderwidth: 1,
          borderpad: 4,
        }],
      };
    } else if (plotType === 'MOM') {
      const endDate = new Date(selected);
      const startSelectedMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const startPriorMonth = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
      const daysInPriorMonth = new Date(startPriorMonth.getFullYear(), startPriorMonth.getMonth() + 1, 0).getDate();
      const daysToCompare = Math.min(endDate.getDate(), daysInPriorMonth);
      const selectedMonthEnd = new Date(startSelectedMonth);
      selectedMonthEnd.setDate(startSelectedMonth.getDate() + daysToCompare - 1);
      const priorMonthEnd = new Date(startPriorMonth);
      priorMonthEnd.setDate(startPriorMonth.getDate() + daysToCompare - 1);
  
      return {
        ...baseLayout,
        title: {
          text: `Daily Consumption: ${formatDate(startSelectedMonth)} to ${formatDate(selectedMonthEnd)} vs ${formatDate(startPriorMonth)} to ${formatDate(priorMonthEnd)}`,
          font: { family: 'Mulish', size: 17, color: 'black' },
          y: 0.95,
          x: 0.02,
          align: 'left',
        },
        annotations: [{
          text: `Avg MoM Change: ${avgChange.toFixed(2)}%`,
          xref: 'paper',
          yref: 'paper',
          x: 1,
          y: 1,
          showarrow: false,
          font: { size: 12 },
          bgcolor: 'white',
          bordercolor: '#2275e0',
          borderwidth: 1,
          borderpad: 4,
        }],
      };
    } else if (plotType === 'YOY') {
      const selectedYear = selected.getFullYear();
      const priorYear = selectedYear - 1;
  
      return {
        ...baseLayout,
        title: {
          text: `Monthly Consumption: ${selectedYear} vs ${priorYear}`,
          font: { family: 'Mulish', size: 17, color: 'black' },
          y: 0.95,
          x: 0.02,
          align: 'left',
        },
        annotations: [{
          text: `Avg YoY Change: ${avgChange.toFixed(2)}%`,
          xref: 'paper',
          yref: 'paper',
          x: 1,
          y: 1,
          showarrow: false,
          font: { size: 12 },
          bgcolor: 'white',
          bordercolor: '#2275e0',
          borderwidth: 1,
          borderpad: 4,
        }],
      };
    }
  
    return baseLayout;
  }, [plotType, currentData, lastUpdated, activeGroupFilter]);

  const getUpdatedPlotData = useCallback(() => {
    return getGroupedPlotData(plotType);
  }, [getGroupedPlotData, plotType]);

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
    const { rootCauseAnalysis } = parseApiData(currentData);
    if (!rootCauseAnalysis || !Array.isArray(rootCauseAnalysis)) {
      return [];
    }
    const selectedSeverities = Object.keys(severityFilters).filter(
      (severity) => severityFilters[severity]
    );
    if (selectedSeverities.length === 0) {
      return [];
    }
    return rootCauseAnalysis.filter((anomaly) =>
      selectedSeverities.includes(anomaly.Severity)
    );
  }, [currentData, severityFilters]);

  const Item = ({ sx, ...other }) => (
    <Box
      sx={[
        (theme) => ({
          bgcolor: '#fff',
          color: 'grey.800',
          border: '1px solid',
          borderColor: 'grey.300',
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
        <Box sx={{ color: 'white' }}>
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
                    <Typography className="diagnostic-tit" component="p">Target Goal</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={target} alt="Consumption" className="data-image" />
                      <Typography className="diagnostic-subtit" component="p">{renderValue(targetMetrics.Target_goal)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Cost:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 green" component="p">{renderValue(targetMetrics.Cost)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Emission:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p">{renderValue(targetMetrics.Emission)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Deviation:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 red" component="p">{renderValue(targetMetrics.Deviation)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography>No target data available</Typography>
                )}
              </Item>
              <Item>
                {performanceMetrics.Performance_Metrics !== 'N/A' ? (
                  <div>
                    <Typography className="diagnostic-tit" component="p">Performance Metrics</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={performance} alt="Consumption" className="data-image" />
                      <Typography className="diagnostic-subtit" component="p">{renderValue(performanceMetrics.Performance_Metrics)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Energy Savings:</Typography></div>
                        <div className="target_value"><Typography className="ft-15 green" component="p">{renderValue(performanceMetrics.Energy_Savings)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Cost Reduction:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p">{renderValue(performanceMetrics.Cost_Reduction)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography>No consumption data available</Typography>
                )}
              </Item>
              <Item>
                {costAnalysis.Cost_Analysis !== 'N/A' ? (
                  <div>
                    <Typography className="diagnostic-tit" component="p">Cost Analysis</Typography>
                    <div className="diagnostic-valueimag">
                      <img src={totalcost} alt="Consumption" className="data-im" />
                      <Typography className="diagnostic-subtit" component="p">{renderValue(costAnalysis.Cost_Analysis)}</Typography>
                    </div>
                    <div className="diagnostic-anomila-target">
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Previous Period:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p">{renderValue(costAnalysis.Previous_Period)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Cost Saved:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15 green" component="p">{renderValue(costAnalysis.Cost_Saved)}</Typography></div>
                      </div>
                      <div className="target">
                        <div className="target_name"><Typography className="ft-15">Savings:</Typography></div>
                        <div className="target_value"><Typography className="diagnostic-left ft-15" component="p">{renderValue(costAnalysis.Savings)}</Typography></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography>No cost data available</Typography>
                )}
              </Item>
              <Item sx={{ gridColumn: '4', gridRow: '1 / 3' }}>
                <div sx={{
                  flex: 1, padding: 2, borderRadius: 1, boxShadow: 1,
                }}
                >
                  <div className="insights-1">
                    <Typography variant="h6" className="insights-head">Analysis Controls</Typography>
                    <div className="insights-box-energy-1">
                      <Button
                        variant={selectedOption === 'Static' ? 'contained' : 'outlined'}
                        onClick={() => handleTargetTypeChange('Static')}
                        sx={{
                          color: selectedOption === 'Static' ? '#fff' : 'black',
                          backgroundColor: selectedOption === 'Static' ? '#0B694C' : 'transparent',
                          borderColor: '#184d3d',
                          borderRadius: '20px',
                          '&:hover': {
                            backgroundColor: selectedOption === 'Static' ? '#0B694C' : '#f0f0f0',
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
                      />
                    </div>
                    <div className="insights-box-energy-1">
                      <Button
                        variant={selectedOption === 'Dynamic' ? 'contained' : 'outlined'}
                        onClick={() => handleTargetTypeChange('Dynamic')}
                        sx={{
                          color: selectedOption === 'Dynamic' ? '#fff' : 'black',
                          backgroundColor: selectedOption === 'Dynamic' ? '#0B694C' : 'transparent',
                          borderColor: '#184d3d',
                          borderRadius: '20px',
                          '&:hover': {
                            backgroundColor: selectedOption === 'Dynamic' ? '#0B694C' : '#f0f0f0',
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
                      />
                    </div>
                    <div className="insights-box-energy">
                      <Typography className="insights-key">Cost Per kWh ($)</Typography>
                      <input
                        type="text"
                        className="insights-input-1"
                        value={costPerKWh}
                        onChange={(e) => setCostPerKWh(parseFloat(e.target.value) || 6.09)}
                      />
                    </div>
                  </div>

                  <div className="insights">
                    <Typography variant="h6" className="insights-head">Time Period</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <ToggleButtonGroup
                        value={plotType}
                        exclusive
                        onChange={handlePlotTypeChange}
                        aria-label="comparison type"
                        sx={{
                          '& .MuiToggleButton-root': {
                            color: 'black',
                            borderColor: '#184d3d',
                            '&.Mui-selected': {
                              backgroundColor: '#0B694C',
                              color: '#fff',
                            },
                            '&:hover': {
                              backgroundColor: '#f0f0f0',
                            },
                          },
                        }}
                      >
                        <ToggleButton value="DOD">DOD</ToggleButton>
                        <ToggleButton value="WOW">WOW</ToggleButton>
                        <ToggleButton value="MOM">MOM</ToggleButton>
                        <ToggleButton value="YOY">YOY</ToggleButton>
                      </ToggleButtonGroup>
                      <TextField
                        type="date"
                        value={activeGroupFilter}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputBase-root': { color: 'black', backgroundColor: '#E4E4ED' },
                          '& .MuiInputLabel-root': { color: 'black' },
                        }}
                      />
                    </Box>
                  </div>

                  <div className="insights">
                    <Typography variant="h6" className="insights-head">Anomaly Severity</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Critical}
                            onChange={() => handleSeverityChange('Critical')}
                            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                          />
                        }
                        label={<Typography sx={{ color: 'black' }}>Critical</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.High}
                            onChange={() => handleSeverityChange('High')}
                            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                          />
                        }
                        label={<Typography sx={{ color: 'black' }}>High</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Medium}
                            onChange={() => handleSeverityChange('Medium')}
                            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                          />
                        }
                        label={<Typography sx={{ color: 'black' }}>Medium</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={severityFilters.Low}
                            onChange={() => handleSeverityChange('Low')}
                            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                          />
                        }
                        label={<Typography sx={{ color: 'black' }}>Low</Typography>}
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
                      data={getUpdatedPlotData()}
                      layout={{
                        ...customLayout,
                        title: {
                          font: { family: 'Mulish', size: 17, color: 'black' },
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
                  <TableContainer component={Paper} sx={{ backgroundColor: '#FDFCFE', marginTop: '10px' }}>
                    <Table sx={{ minWidth: 300 }} aria-label="root cause analysis table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Timestamp</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Severity</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Root Cause</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Impact</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAnomalies.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: 'black' }}>{row.Timestamp || 'N/A'}</TableCell>
                            <TableCell sx={{ color: 'black' }}>{row.Type || 'N/A'}</TableCell>
                            <TableCell sx={{ color: 'black' }}>{row.Severity || 'N/A'}</TableCell>
                            <TableCell sx={{ color: 'black' }}>{row.Root_Cause || 'N/A'}</TableCell>
                            <TableCell sx={{ color: 'black' }}>{row.Impact || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ color: 'black', marginTop: '10px' }}>
                    {filteredAnomalies && filteredAnomalies.length > 0
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