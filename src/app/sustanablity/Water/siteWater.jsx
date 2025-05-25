import React, {
  useEffect, useState, useCallback, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
  Button,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import CardHeader from '../Energy/CardHeaderRes';
import Card from '../Energy/CardRes';
import { getSequencedMenuItems } from '../../util/appUtils';
import './water.css';
import Pointer from './Meter.svg';
import Recycle from './recycle.svg';
import Drop from './drop.svg';
import Effic from './effic1.svg';
import { useTheme } from '../../ThemeContext';

// Styled Item component for KPI cards
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
        ...(theme.applyStyles && theme.applyStyles('dark', {
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

// PlotTypeSelector component
const PlotTypeSelector = ({ plotType, handlePlotTypeChange, isDropdown }) => {
  const plotTypes = ['Day', 'Week', 'Month', 'Workweek', 'Weekends'];

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }} padding="5px">
      <Typography variant="h6" className="diagnostic-tit">
        Raw Water & STP Consumption Trend
      </Typography>
      {isDropdown ? (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'black', borderRadius: 1 }}>
          <Select
            value={plotType}
            onChange={handlePlotTypeChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Plot Type' }}
            sx={{
              color: 'white',
              backgroundColor: 'black',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976D2' },
            }}
          >
            {plotTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': { backgroundColor: '#1976D2' },
                  '&.Mui-selected': { backgroundColor: '#1976D2', color: 'white' },
                }}
              >
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Box display="flex" gap={1} flexWrap="wrap">
          {plotTypes.map((type) => (
            <Button
              key={type}
              onClick={() => handlePlotTypeChange({ target: { value: type } })}
              variant={plotType === type ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                fontWeight: 'bold',
                backgroundColor: plotType === type ? '#0B694C' : 'black',
                color: plotType === type ? '#fff' : '#bbb',
                borderColor: plotType === type ? '#1976D2' : '#bbb',
                '&:hover': {
                  backgroundColor: plotType === type ? '#0B694C' : '#444',
                  borderColor: plotType === type ? '#0B694C' : '#888',
                },
              }}
            >
              {type}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

PlotTypeSelector.propTypes = {
  plotType: PropTypes.string.isRequired,
  handlePlotTypeChange: PropTypes.func.isRequired,
  isDropdown: PropTypes.bool.isRequired,
};

const SiteWater = ({
  defaultDate = 'Day',
  headerText = 'Water',
  showBackButton = false,
  onBackButtonClick,
  fontSize,
  setActiveDate,
  uuid,
  code,
}) => {
  const [menu, setMenu] = useState('');
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(defaultDate);
  const [dashboardData, setDashboardData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [costPerUnit, setCostPerUnit] = useState(5);
  const [analysisMode, setAnalysisMode] = useState('DYNAMIC');
  const [staticValue, setStaticValue] = useState(5);
  const [dynamicValue, setDynamicValue] = useState(0);
  const [tempStaticValue, setTempStaticValue] = useState('5');
  const [tempDynamicValue, setTempDynamicValue] = useState('0');
  const [tempCostPerUnit, setTempCostPerUnit] = useState('5');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const plotContainerRef = useRef(null);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('sid');

  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7,
  });

  const { themes } = useTheme();

  const analysisValue = analysisMode === 'STATIC' ? staticValue : dynamicValue;
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/siteWater`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }

  useEffect(() => {
    const getmenus = getSequencedMenuItems(userRoles?.data?.allowed_modules || [], 'ESG Tracker', 'name');
    const waterMenu = getmenus.find((menu) => menu.name.toLowerCase() === 'water');
    setMenu(waterMenu || '');
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo?.data) {
      if (userInfo.data.main_company?.category?.name?.toLowerCase() === 'company' && menu.company_dashboard_code) {
        setDashboardCode(menu.company_dashboard_code);
      } else {
        setDashboardCode(menu.dashboard_code || 'WATERV3');
      }
    }
  }, [menu, userInfo]);

  useEffect(() => {
    setActiveGroupFilter(defaultDate);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultDate]);

  const handleResize = useCallback(() => {
    setPlotDimensions({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  }, []);

  const handleFilter = (event) => {
    const newFilter = {
      Day: 'Day',
      Week: 'Week',
      Month: 'Month',
      Workweek: 'Workweek',
      Weekends: 'Weekends',
    }[event.target.value] || 'Day';
    setActiveGroupFilter(newFilter);
    if (setActiveDate) setActiveDate(newFilter);
    // Removed fetchDashboardData() to prevent API call on filter change
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleApplyChanges = () => {
    const newStaticValue = parseFloat(tempStaticValue);
    const newDynamicValue = parseFloat(tempDynamicValue);
    const newCostPerUnit = parseFloat(tempCostPerUnit);

    if (isNaN(newStaticValue) || newStaticValue <= 0) {
      showAlert('Please enter a positive value for Static value');
      return;
    }
    if (isNaN(newDynamicValue) || newDynamicValue < 0) {
      showAlert('Please enter a non-negative value for Dynamic value');
      return;
    }
    if (isNaN(newCostPerUnit) || newCostPerUnit <= 0) {
      showAlert('Please enter a positive value for Cost Per KL');
      return;
    }

    setStaticValue(newStaticValue);
    setDynamicValue(newDynamicValue);
    setCostPerUnit(newCostPerUnit);
    if (code) {
      fetchDashboardDataExt();
    } else {
      fetchDashboardData();
    }
  };

  const fetchDashboardData = useCallback(async () => {
    if (!menu || !dashboardCode) return;

    setIsLoading(true);
    setDashboardData({});
    try {
      const body = {
        uuid: menu.uuid,
        code: dashboardCode,
        web_url: warehouseUrl,
        cost_per_unit: costPerUnit,
        analysis_mode: analysisMode,
        analysis_value: analysisValue,
        static_value: analysisMode === 'STATIC' ? analysisValue : staticValue,
        dynamic_value: analysisMode === 'DYNAMIC' ? analysisValue : dynamicValue,
        // Removed group_filter to fetch all time periods in one call
      };

      console.log('Fetching dashboard data from:', WEBAPPAPIURL);
      console.log('Payload:', body);

      const response = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        let errorMessage = `Error fetching dashboard data: ${response.status} ${response.statusText}`;
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 200));
        if (text.startsWith('<!doctype') || text.includes('<html')) {
          errorMessage = `Server returned HTML instead of JSON. Check if /siteWater route is correctly configured on the proxy server. Raw response: ${text.substring(0, 200)}`;
        } else {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Failed to parse response: ${text.substring(0, 200)}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Parsed API Response:', data);

      const dataObject = Array.isArray(data)
        ? data.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
        : data;

      setDashboardData(dataObject || {});
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching the dashboard data.');
      setDashboardData({});
    } finally {
      setIsLoading(false);
    }
  }, [menu, dashboardCode, costPerUnit, analysisMode, staticValue, dynamicValue, analysisValue]);

  const fetchDashboardDataExt = useCallback(async () => {
    if (!code || !uuid) return;

    setIsLoading(true);
    setDashboardData({});
    try {
      const body = {
        uuid,
        code,
        web_url: warehouseUrl,
        cost_per_unit: costPerUnit,
        analysis_mode: analysisMode,
        analysis_value: analysisValue,
        static_value: analysisMode === 'STATIC' ? analysisValue : staticValue,
        dynamic_value: analysisMode === 'DYNAMIC' ? analysisValue : dynamicValue,
        // Removed group_filter to fetch all time periods in one call
      };

      console.log('Fetching dashboard data from:', WEBAPPAPIURL);
      console.log('Payload:', body);

      const response = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        let errorMessage = `Error fetching dashboard data: ${response.status} ${response.statusText}`;
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 200));
        if (text.startsWith('<!doctype') || text.includes('<html')) {
          errorMessage = `Server returned HTML instead of JSON. Check if /siteWater route is correctly configured on the proxy server. Raw response: ${text.substring(0, 200)}`;
        } else {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Failed to parse response: ${text.substring(0, 200)}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Parsed API Response:', data);

      const dataObject = Array.isArray(data)
        ? data.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
        : data;

      setDashboardData(dataObject || {});
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching the dashboard data.');
      setDashboardData({});
    } finally {
      setIsLoading(false);
    }
  }, [code, uuid, costPerUnit, analysisMode, staticValue, dynamicValue, analysisValue]);

  useEffect(() => {
    if (menu && dashboardCode && !code) {
      fetchDashboardData();
    }
  }, [menu, dashboardCode, code, fetchDashboardData]);

  useEffect(() => {
    if (uuid && code) {
      fetchDashboardDataExt();
    }
  }, [uuid, code, fetchDashboardDataExt]);

  const handleAnalysisModeChange = (mode) => {
    if (mode === analysisMode) return;
    setAnalysisMode(mode);
  };

  const handleStaticValueChange = (event) => {
    setTempStaticValue(event.target.value);
  };

  const handleDynamicValueChange = (event) => {
    setTempDynamicValue(event.target.value);
  };

  const handleCostChange = (event) => {
    setTempCostPerUnit(event.target.value);
  };

  const currentData = useMemo(() => dashboardData[activeGroupFilter] || {}, [dashboardData, activeGroupFilter]);

  const theme = useMemo(() => createTheme({
    components: {
      MuiRadio: { styleOverrides: { root: { color: '#ffffff' } } },
    },
  }), []);

  const commonLayoutAdjustments = {
    autosize: true,
    margin: {
      l: 40,
      r: 40,
      t: 80,
      b: 60,
    },
    title: {
      font: {
        size: 15,
        color: '#534d4d',
        family: 'Mulish, sans-serif',
        weight: 'bold',
      },
    },
    paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
    plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
  };

  const mergeAxisSettings = (backendAxis, adjustments) => ({
    ...backendAxis,
    ...adjustments,
    tickfont: {
      ...backendAxis?.tickfont,
      ...adjustments?.tickfont,
      color: themes === 'light' ? '#FFFFFF' : '#000000',
      family: 'Mulish, sans-serif',
    },
    titlefont: {
      ...backendAxis?.titlefont,
      ...adjustments?.titlefont,
      color: themes === 'light' ? '#FFFFFF' : '#000000',
      family: 'Mulish, sans-serif',
    },
  });

  const mergeLayout = (backendLayout, adjustments) => {
    const mergedLayout = {
      ...backendLayout,
      ...adjustments,
      title: '',
      xaxis: mergeAxisSettings(backendLayout?.xaxis || {}, adjustments?.xaxis || {}),
      yaxis: mergeAxisSettings(backendLayout?.yaxis || {}, adjustments?.yaxis || {}),
      yaxis2: mergeAxisSettings(backendLayout?.yaxis2 || {}, adjustments?.yaxis2 || {}),
      hoverlabel: {
        bgcolor: '#000000',
        font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
      },
    };

    return mergedLayout;
  };

  const defaultAxisAdjustments = {
    xaxis: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
    },
    yaxis: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
    },
    yaxis2: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish' },
    },
  };

  const consumptionSummaryKey = useMemo(
    () => ({
      Day: 'stp_consumption',
      Week: 'stp_consumption',
      Month: 'stp_consumption',
      Workweek: 'stp_consumption',
      Weekends: 'stp_consumption',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const intensitySummaryKey = useMemo(
    () => ({
      Day: 'intensity',
      Week: 'intensity',
      Month: 'intensity',
      Workweek: 'intensity',
      Weekends: 'intensity',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const stpPercentageKey = useMemo(
    () => ({
      Day: 'stp_percentage',
      Week: 'stp_percentage',
      Month: 'stp_percentage',
      Workweek: 'stp_percentage',
      Weekends: 'stp_percentage',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const freshUtilityKey = useMemo(
    () => ({
      Day: 'raw_utility',
      Week: 'raw_utility',
      Month: 'raw_utility',
      Workweek: 'raw_utility',
      Weekends: 'raw_utility',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const stpUtilityKey = useMemo(
    () => ({
      Day: 'stp_utility',
      Week: 'stp_utility',
      Month: 'stp_utility',
      Workweek: 'stp_utility',
      Weekends: 'stp_utility',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const perTowerKey = useMemo(
    () => ({
      Day: 'tower',
      Week: 'tower',
      Month: 'tower',
      Workweek: 'tower',
      Weekends: 'tower',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const trendAndCostPlotKey = useMemo(
    () => ({
      Day: 'trend_and_cost_plot',
      Week: 'trend_and_cost_plot_weekly',
      Month: 'trend_and_cost_plot_monthly',
      Workweek: 'trend_and_cost_plot_weekdays',
      Weekends: 'trend_and_cost_plot_weekends',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const getPercentageDisplay = (val) => {
    if (!val || val === 'NaN' || val === 'NaN%') return '0.00 %';
    const value = parseFloat(val.replace('%', '')) || 0;
    return (
      <span style={{ color: value > 0 ? '#9c2525' : '#59bd59' }}>
        {val}
        {' '}
        {value > 0 ? '▲' : '▼'}
      </span>
    );
  };

  const renderTrendPlot = useCallback(() => {
    if (!currentData[trendAndCostPlotKey]) {
      return (
        <Typography className="warning-message">
          No plot data available
        </Typography>
      );
    }

    const plotObj = currentData[trendAndCostPlotKey];
    const fullX = plotObj.data[0]?.x || [];
    const lastActualIndex = plotObj.data.find((d) => d.name === 'FG Consumption')?.y?.findLastIndex((y) => y > 0) || Math.floor(fullX.length / 2);

    const fgConsumption = plotObj.data.find((d) => d.name === 'FG Consumption') || {};
    const fgForecastConsumption = plotObj.data.find((d) => d.name === 'FG Forecast Consumption') || {};
    const fgAboveTarget = plotObj.data.find((d) => d.name === 'FG Above Target') || {};
    const fgAboveTargetForecast = plotObj.data.find((d) => d.name === 'FG Above Target Forecast') || {};
    const stpConsumption = plotObj.data.find((d) => d.name === 'STP Consumption') || {};
    const stpForecastConsumption = plotObj.data.find((d) => d.name === 'STP Forecast Consumption') || {};
    const stpAboveTarget = plotObj.data.find((d) => d.name === 'STP Above Target') || {};
    const stpAboveTargetForecast = plotObj.data.find((d) => d.name === 'STP Above Target Forecast') || {};
    const targetTrace = plotObj.data.find((d) => d.name === 'Target') || {};
    const fgTargetTrace = plotObj.data.find((d) => d.name === 'FG Target') || {};
    const stpTargetTrace = plotObj.data.find((d) => d.name === 'STP Target') || {};

    const fgTargetValues = fgTargetTrace.y || Array(fullX.length).fill(0);
    const stpTargetValues = stpTargetTrace.y || Array(fullX.length).fill(0);

    const rawWaterActualTrace = {
      ...fgConsumption,
      name: 'Raw Water',
      x: fullX.slice(0, lastActualIndex + 1),
      y: fgConsumption.y?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill(0),
      customdata: fgConsumption.customdata?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill([]),
      type: 'bar',
      opacity: 1,
      showlegend: true,
    };

    const rawWaterForecastTrace = {
      ...fgForecastConsumption,
      name: 'Raw Water Forecast',
      x: fullX.slice(lastActualIndex + 1),
      y: fgForecastConsumption.y?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill(0),
      customdata: fgForecastConsumption.customdata?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill([]),
      type: 'bar',
      opacity: 0.4,
      showlegend: false,
    };

    const rawWaterAboveTargetForecastTrace = {
      ...fgAboveTargetForecast,
      name: 'Raw Water Above Target',
      x: fullX.slice(lastActualIndex + 1),
      y: fgAboveTargetForecast.y?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill(0),
      customdata: fgAboveTargetForecast.customdata?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill([]),
      type: 'bar',
      opacity: 0.4,
      showlegend: true,
    };

    const rawWaterAboveTargetActualTrace = {
      ...fgAboveTarget,
      name: 'Raw Water Above Target Actual',
      x: fullX.slice(0, lastActualIndex + 1),
      y: fgAboveTarget.y?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill(0),
      customdata: fgAboveTarget.customdata?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill([]),
      type: 'bar',
      opacity: 1,
      showlegend: false,
    };

    const stpActualTrace = {
      ...stpConsumption,
      name: 'STP',
      x: fullX.slice(0, lastActualIndex + 1),
      y: stpConsumption.y?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill(0),
      customdata: stpConsumption.customdata?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill([]),
      type: 'bar',
      opacity: 1,
      showlegend: true,
    };

    const stpForecastTrace = {
      ...stpForecastConsumption,
      name: 'STP Forecast',
      x: fullX.slice(lastActualIndex + 1),
      y: stpForecastConsumption.y?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill(0),
      customdata: stpForecastConsumption.customdata?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill([]),
      type: 'bar',
      opacity: 0.4,
      showlegend: false,
    };

    const stpAboveTargetForecastTrace = {
      ...stpAboveTargetForecast,
      name: 'STP Above Target',
      x: fullX.slice(lastActualIndex + 1),
      y: stpAboveTargetForecast.y?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill(0),
      customdata: stpAboveTargetForecast.customdata?.slice(lastActualIndex + 1) || Array(fullX.length - lastActualIndex - 1).fill([]),
      type: 'bar',
      opacity: 0.4,
      showlegend: true,
    };

    const stpAboveTargetActualTrace = {
      ...stpAboveTarget,
      name: 'STP Above Target Actual',
      x: fullX.slice(0, lastActualIndex + 1),
      y: stpAboveTarget.y?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill(0),
      customdata: stpAboveTarget.customdata?.slice(0, lastActualIndex + 1) || Array(lastActualIndex + 1).fill([]),
      type: 'bar',
      opacity: 1,
      showlegend: false,
    };

    const targetLineTrace = {
      ...targetTrace,
      name: 'Target',
      x: fullX,
      y: targetTrace.y || Array(fullX.length).fill(0),
      customdata: targetTrace.customdata || Array(fullX.length).fill([]),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dash', color: '#00FF00' },
      showlegend: true,
    };

    const rawWaterTargetLineTrace = {
      ...fgTargetTrace,
      name: 'Raw Water Target',
      x: fullX,
      y: fgTargetValues,
      customdata: fgTargetTrace.customdata || Array(fullX.length).fill([]),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dot', color: 'green', width: 2 },
      hovertemplate: "<span style='text-align:left;font-family:Mulish;'></span><b>Raw Water Target:</b>%{y:.2f} KL<extra></extra>",
      showlegend: true,
    };

    const stpTargetLineTrace = {
      ...stpTargetTrace,
      name: 'STP Target',
      x: fullX,
      y: stpTargetValues,
      customdata: stpTargetTrace.customdata || Array(fullX.length).fill([]),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dot', color: 'orange', width: 2 },
      hovertemplate: "<span style='text-align:left;font-family:Mulish;'></span><b>STP Target:</b>%{y:.2f} KL<extra></extra>",
      showlegend: true,
    };

    return (
      <Plot
        ref={plotContainerRef}
        key={`trend-and-cost-${themes}`}
        data={[
          rawWaterActualTrace,
          rawWaterForecastTrace,
          rawWaterAboveTargetActualTrace,
          rawWaterAboveTargetForecastTrace,
          stpActualTrace,
          stpForecastTrace,
          stpAboveTargetActualTrace,
          stpAboveTargetForecastTrace,
          targetLineTrace,
          rawWaterTargetLineTrace,
          stpTargetLineTrace,
        ]}
        layout={mergeLayout(plotObj.layout || {}, {
          ...commonLayoutAdjustments,
          yaxis: {
            ...defaultAxisAdjustments.yaxis,
            title: {
              text: 'Consumption (KL)',
              font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
            },
          },
          xaxis: {
            ...defaultAxisAdjustments.xaxis,
            title: {
              text: '',
              font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
            },
          },
          yaxis2: {
            ...defaultAxisAdjustments.yaxis2,
            title: {
              text: 'Cost (₹)',
              font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
            },
          },
          barmode: 'stack',
          showlegend: true,
          legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: -0.2,
            font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
          },
          annotations: plotObj.layout?.annotations?.map((annotation) => ({
            ...annotation,
            font: { ...annotation.font, color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
          })) || [],
        })}
        config={{ responsive: true, displayModeBar: false }}
        useResizeHandler
        style={{ width: '100%', height: '400px' }}
      />
    );
  }, [currentData, trendAndCostPlotKey, themes, commonLayoutAdjustments]);

  const isLoad = !code ? (isLoading || !menu) : isLoading

  return (
    <ThemeProvider theme={theme}>
      {isLoad ? (
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
          <CardHeader
            headerText={headerText || 'Water Dashboard'}
            showBackButton={showBackButton}
            onBackButtonClick={onBackButtonClick}
            fontSize={fontSize}
          />
          <div className="main-content-1">
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'row',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 1,
                padding: 1,
                gridTemplateRows: 'auto auto auto',
              }}
            >
              {currentData.fresh_consumption && (
                <Item sx={{ gridColumn: '1 / span 3', gridRow: '1' }}>
                  <Typography className="diagnostic-tit" component="p">
                    Raw Water Consumption
                  </Typography>
                  <div className="diagnostic-valueimag">
                    <img src={Drop} alt="Consumption" className="data-im" />
                    <Typography className="diagnostic-subtit" component="p">
                      {currentData.fresh_consumption.so_far_today
                        || currentData.fresh_consumption.predicted_this_week_full
                        || currentData.fresh_consumption.predicted_this_month_full
                        || currentData.fresh_consumption.predicted_this_weekday_full
                        || currentData.fresh_consumption.predicted_this_weekend_full
                        || '0.00 KL'}
                    </Typography>
                  </div>
                  <div className="diagnostic-anomila-target">
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Yesterday'
                            : activeGroupFilter === 'Week' ? 'Last Week'
                              : activeGroupFilter === 'Month' ? 'Last Month'
                                : activeGroupFilter === 'Workweek' ? 'Last Weekday' : 'Last Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData.fresh_consumption.yesterday
                           || currentData.fresh_consumption.last_week
                           || currentData.fresh_consumption.last_month
                           || currentData.fresh_consumption.last_weekday
                           || currentData.fresh_consumption.last_weekend
                           || '0.00 KL'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Predicted Today'
                            : activeGroupFilter === 'Week' ? 'Predicted This Week'
                              : activeGroupFilter === 'Month' ? 'Predicted This Month'
                                : activeGroupFilter === 'Workweek' ? 'Predicted This Weekday' : 'Predicted This Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData.fresh_consumption.predicted_today
                           || currentData.fresh_consumption.predicted_this_week
                           || currentData.fresh_consumption.predicted_this_month
                           || currentData.fresh_consumption.predicted_this_weekday
                           || currentData.fresh_consumption.predicted_this_weekend
                           || '0.00 KL'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">Percent Change</Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {getPercentageDisplay(currentData.fresh_consumption.percent_change?.value || '0.00 %')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Item>
              )}
              {currentData[consumptionSummaryKey] && (
                <Item sx={{ gridColumn: '4 / span 3', gridRow: '1' }}>
                  <Typography className="diagnostic-tit" component="p">
                    STP Consumption
                  </Typography>
                  <div className="diagnostic-valueimag">
                    <img src={Recycle} alt="Consumption" className="data-im" />
                    <Typography className="diagnostic-subtit" component="p">
                      {currentData[consumptionSummaryKey].so_far_today
                        || currentData[consumptionSummaryKey].predicted_this_week_full
                        || currentData[consumptionSummaryKey].predicted_this_month_full
                        || currentData[consumptionSummaryKey].predicted_this_weekday_full
                        || currentData[consumptionSummaryKey].predicted_this_weekend_full
                        || '0.00 KL'}
                    </Typography>
                  </div>
                  <div className="diagnostic-anomila-target">
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Yesterday'
                            : activeGroupFilter === 'Week' ? 'Last Week'
                              : activeGroupFilter === 'Month' ? 'Last Month'
                                : activeGroupFilter === 'Workweek' ? 'Last Weekday' : 'Last Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[consumptionSummaryKey].yesterday
                           || currentData[consumptionSummaryKey].last_week
                           || currentData[consumptionSummaryKey].last_month
                           || currentData[consumptionSummaryKey].last_weekday
                           || currentData[consumptionSummaryKey].last_weekend
                           || '0.00 KL'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Predicted Today'
                            : activeGroupFilter === 'Week' ? 'Predicted This Week'
                              : activeGroupFilter === 'Month' ? 'Predicted This Month'
                                : activeGroupFilter === 'Workweek' ? 'Predicted This Weekday' : 'Predicted This Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[consumptionSummaryKey].predicted_today
                           || currentData[consumptionSummaryKey].predicted_this_week
                           || currentData[consumptionSummaryKey].predicted_this_month
                           || currentData[consumptionSummaryKey].predicted_this_weekday
                           || currentData[consumptionSummaryKey].predicted_this_weekend
                           || '0.00 KL'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">Percent Change</Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {getPercentageDisplay(currentData[consumptionSummaryKey].percent_change?.value || '0.00 %')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Item>
              )}
              {currentData[intensitySummaryKey] && (
                <Item sx={{ gridColumn: '7 / span 3', gridRow: '1' }}>
                  <Typography className="diagnostic-tit" component="p">
                    Intensity
                  </Typography>
                  <div className="diagnostic-valueimag">
                    <img src={Pointer} alt="Intensity" className="data-im" />
                    <Typography className="diagnostic-subtit" component="p">
                      {currentData[intensitySummaryKey].so_far_today
                        || currentData[intensitySummaryKey].predicted_this_week_full
                        || currentData[intensitySummaryKey].predicted_this_weekday_full
                        || currentData[intensitySummaryKey].predicted_this_weekend_full
                        || '0.00 L/person/day'}
                    </Typography>
                  </div>
                  <div className="diagnostic-anomila-target">
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Yesterday'
                            : activeGroupFilter === 'Week' ? 'Last Week'
                              : activeGroupFilter === 'Month' ? 'Last Month'
                                : activeGroupFilter === 'Workweek' ? 'Last Weekday' : 'Last Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[intensitySummaryKey].yesterday
                           || currentData[intensitySummaryKey].last_week
                           || currentData[intensitySummaryKey].last_month
                           || currentData[intensitySummaryKey].last_weekday
                           || currentData[intensitySummaryKey].last_weekend
                           || '0.00 L/person/day'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Predicted Today'
                            : activeGroupFilter === 'Week' ? 'Predicted This Week'
                              : activeGroupFilter === 'Month' ? 'Predicted This Month'
                                : activeGroupFilter === 'Workweek' ? 'Predicted This Weekday' : 'Predicted This Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[intensitySummaryKey].predicted_today
                           || currentData[intensitySummaryKey].predicted_this_week
                           || currentData[intensitySummaryKey].predicted_this_month
                           || currentData[intensitySummaryKey].predicted_this_weekday
                           || currentData[intensitySummaryKey].predicted_this_weekend
                           || '0.00 L/person/day'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">Percent Change</Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {getPercentageDisplay(currentData[intensitySummaryKey].percent_change?.value || '0.00 %')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Item>
              )}
              {currentData[stpPercentageKey] && (
                <Item sx={{ gridColumn: '10 / span 3', gridRow: '1' }}>
                  <Typography className="diagnostic-tit" component="p">
                    STP Efficiency
                  </Typography>
                  <div className="diagnostic-valueimag">
                    <img src={Effic} alt="Consumption" className="data-im" />
                    <Typography className="diagnostic-subtit" component="p">
                      {currentData[stpPercentageKey].so_far_today
                        || currentData[stpPercentageKey].predicted_this_week_full
                        || currentData[stpPercentageKey].predicted_this_weekday_full
                        || currentData[stpPercentageKey].predicted_this_weekend_full
                        || '0.00 %'}
                    </Typography>
                  </div>
                  <div className="diagnostic-anomila-target">
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Yesterday'
                            : activeGroupFilter === 'Week' ? 'Last Week'
                              : activeGroupFilter === 'Month' ? 'Last Month'
                                : activeGroupFilter === 'Workweek' ? 'Last Weekday' : 'Last Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[stpPercentageKey].yesterday
                           || currentData[stpPercentageKey].last_week
                           || currentData[stpPercentageKey].last_month
                           || currentData[stpPercentageKey].last_weekday
                           || currentData[stpPercentageKey].last_weekend
                           || '0.00 %'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">
                          {activeGroupFilter === 'Day' ? 'Predicted Today'
                            : activeGroupFilter === 'Week' ? 'Predicted This Week'
                              : activeGroupFilter === 'Month' ? 'Predicted This Month'
                                : activeGroupFilter === 'Workweek' ? 'Predicted This Weekday' : 'Predicted This Weekend'}
                        </Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {currentData[stpPercentageKey].predicted_today
                           || currentData[stpPercentageKey].predicted_this_week
                           || currentData[stpPercentageKey].predicted_this_month
                           || currentData[stpPercentageKey].predicted_this_weekday
                           || currentData[stpPercentageKey].predicted_this_weekend
                           || '0.00 %'}
                        </Typography>
                      </div>
                    </div>
                    <div className="target">
                      <div className="target_name">
                        <Typography className="ft-15">Percent Change</Typography>
                      </div>
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          {getPercentageDisplay(currentData[stpPercentageKey].percent_change?.value || '0.00 %')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Item>
              )}
              {currentData[freshUtilityKey] && (
                <Item sx={{ gridColumn: '1 / span 3', gridRow: '2' }}>
                  <Typography className="diagnostic-tit" component="p">
                    Raw Water by Utility
                  </Typography>
                  <Plot
                    key={`fresh-utility-${themes}`}
                    data={currentData[freshUtilityKey].data || []}
                    layout={mergeLayout(currentData[freshUtilityKey].layout || {}, {
                      ...commonLayoutAdjustments,
                      height: 350,
                      margin: {
                        t: 20, b: 20, l: 20, r: 20,
                      },
                      showlegend: true,
                      legend: {
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.2,
                        font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
                      },
                    })}
                    config={{ responsive: true, displayModeBar: false }}
                    style={{ width: '100%' }}
                  />
                </Item>
              )}
              {currentData[stpUtilityKey] && (
                <Item sx={{ gridColumn: '4 / span 3', gridRow: '2' }}>
                  <Typography className="diagnostic-tit" component="p">
                    STP by Utility
                  </Typography>
                  <Plot
                    key={`stp-utility-${themes}`}
                    data={currentData[stpUtilityKey].data || []}
                    layout={mergeLayout(currentData[stpUtilityKey].layout || {}, {
                      ...commonLayoutAdjustments,
                      height: 350,
                      margin: {
                        t: 20, b: 20, l: 20, r: 20,
                      },
                      showlegend: true,
                      legend: {
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.2,
                        font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
                      },
                    })}
                    config={{ responsive: true, displayModeBar: false }}
                    style={{ width: '100%' }}
                  />
                </Item>
              )}
              {currentData[perTowerKey] && (
                <Item sx={{ gridColumn: '7 / span 6', gridRow: '2' }}>
                  <Typography className="diagnostic-tit" component="p">
                    Raw Water & STP Consumption per Tower
                  </Typography>
                  <Plot
                    key={`per-tower-${themes}`}
                    data={currentData[perTowerKey].data || []}
                    layout={mergeLayout(currentData[perTowerKey].layout || {}, {
                      ...commonLayoutAdjustments,
                      height: 350,
                      barmode: 'group',
                      yaxis: {
                        ...defaultAxisAdjustments.yaxis,
                        showgrid: false,
                        title: {
                          text: 'Consumption (KL)',
                          font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
                        },
                      },
                      xaxis: {
                        ...defaultAxisAdjustments.xaxis,
                        showgrid: false,
                      },
                      showlegend: true,
                      legend: {
                        orientation: 'h',
                        x: 0.5,
                        xanchor: 'center',
                        y: -0.2,
                        font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
                      },
                    })}
                    config={{ responsive: true, displayModeBar: false }}
                    style={{ width: '100%' }}
                  />
                </Item>
              )}
              <Item sx={{ gridColumn: '1 / span 9', gridRow: '3' }}>
                <div style={{ width: '100%' }}>
                  <div>
                    <PlotTypeSelector
                      plotType={activeGroupFilter}
                      handlePlotTypeChange={handleFilter}
                      isDropdown={false}
                    />
                  </div>
                  {renderTrendPlot()}
                </div>
              </Item>
              <Item sx={{ gridColumn: '10 / span 3', gridRow: '3' }}>
                <div className="insights-2">
                  <Typography variant="h6" className="diagnostic-tit">
                    Analysis Controls
                  </Typography>
                  <Typography variant="h6" className="insights-head">
                    Target Settings
                  </Typography>
                  <div className="insights-box-energy-1">
                    <Button
                      variant={analysisMode === 'STATIC' ? 'contained' : 'outlined'}
                      onClick={() => handleAnalysisModeChange('STATIC')}
                      sx={{
                        color: analysisMode === 'STATIC' ? '#fff' : (themes === 'light' ? '#FFFFFF' : '#000000'),
                        backgroundColor: analysisMode === 'STATIC' ? '#0B694C' : 'transparent',
                        borderColor: themes === 'light' ? '#FFFFFF' : '#184d3d',
                        borderRadius: '20px',
                        fontWeight: '700',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: analysisMode === 'STATIC' ? '#0B694C' : '#f0f0f0',
                        },
                      }}
                    >
                      Static
                    </Button>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
                      <input
                        type="text"
                        className="insights-input"
                        value={tempStaticValue}
                        onChange={handleStaticValueChange}
                        disabled={analysisMode !== 'STATIC'}
                      />
                      <Typography>KL</Typography>
                    </div>
                  </div>
                  <div className="insights-box-energy-1">
                    <Button
                      variant={analysisMode === 'DYNAMIC' ? 'contained' : 'outlined'}
                      onClick={() => handleAnalysisModeChange('DYNAMIC')}
                      sx={{
                        color: analysisMode === 'DYNAMIC' ? '#fff' : (themes === 'light' ? '#FFFFFF' : '#000000'),
                        backgroundColor: analysisMode === 'DYNAMIC' ? '#0B694C' : 'transparent',
                        borderColor: themes === 'light' ? '#FFFFFF' : '#184d3d',
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: '700',
                        '&:hover': {
                          backgroundColor: analysisMode === 'DYNAMIC' ? '#0B694C' : '#f0f0f0',
                        },
                      }}
                    >
                      Dynamic
                    </Button>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                      <input
                        type="text"
                        className="insights-input"
                        value={tempDynamicValue}
                        onChange={handleDynamicValueChange}
                        disabled={analysisMode !== 'DYNAMIC'}
                      />
                      <Typography>%</Typography>
                    </div>
                  </div>
                  <div className="insights-box-energy">
                    <Typography className="insights-key">Cost Per KL</Typography>
                    <input
                      type="text"
                      className="insights-input-1"
                      value={tempCostPerUnit}
                      onChange={handleCostChange}
                    />
                  </div>
                  <Button
                    onClick={handleApplyChanges}
                    sx={{
                      width: '100%',
                      backgroundColor: '#0B694C',
                      color: 'white',
                      borderRadius: '20px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#084d3a',
                      },
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </Item>
            </Box>
          </div>
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </Card>
      )}
    </ThemeProvider>
  );
};

SiteWater.propTypes = {
  defaultDate: PropTypes.string,
  headerText: PropTypes.string,
  showBackButton: PropTypes.bool,
  onBackButtonClick: PropTypes.func,
  fontSize: PropTypes.number,
  setActiveDate: PropTypes.func,
};

export default SiteWater;
