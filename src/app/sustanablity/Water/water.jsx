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
import totalcost from '../Energy/image/DOLLAR.svg';
import Drop from './drop.svg';
import { useTheme } from '../../ThemeContext';
import Meter from './Meter.svg';

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
        Water Consumption Analysis
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

const Water = ({
  defaultDate = 'Day',
  headerText = 'Water',
  showBackButton = false,
  onBackButtonClick,
  fontSize,
  setActiveDate,
  uuid,
  code,
  equipmentId,
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
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/meterWater`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }

  useEffect(() => {
    if (!code) {
      const getmenus = getSequencedMenuItems(userRoles?.data?.allowed_modules || [], 'ESG Tracker', 'name');
      const waterMenu = getmenus.find((menu) => menu.name.toLowerCase() === 'water');
      setMenu(waterMenu || '');
    }
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo?.data && !code) {
      if (
        userInfo.data.main_company?.category?.name?.toLowerCase() === 'company'
        && menu.company_dashboard_code
      ) {
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
        equipment_id: id,
        web_url: warehouseUrl,
        cost_per_unit: costPerUnit,
        analysis_mode: analysisMode,
        analysis_value: analysisValue,
        static_value: analysisMode === 'STATIC' ? analysisValue : staticValue,
        dynamic_value: analysisMode === 'DYNAMIC' ? analysisValue : dynamicValue,
        // Removed group_filter to fetch all time periods in one call
      };

      console.log('Fetching dashboard data with payload:', body);

      const response = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing access token');
        }
        throw new Error(errorData.error || `Error fetching dashboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Transform array of key-value pairs to object, as expected by UI
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
  }, [menu, dashboardCode, costPerUnit, analysisMode, staticValue, dynamicValue, warehouseUrl, analysisValue]);

  const fetchDashboardDataExt = useCallback(async () => {
    if (!code || !uuid) return;

    setIsLoading(true);
    setDashboardData({});
    try {
      const body = {
        uuid,
        code,
        equipment_id: equipmentId,
        web_url: warehouseUrl,
        cost_per_unit: costPerUnit,
        analysis_mode: analysisMode,
        analysis_value: analysisValue,
        static_value: analysisMode === 'STATIC' ? analysisValue : staticValue,
        dynamic_value: analysisMode === 'DYNAMIC' ? analysisValue : dynamicValue,
        // Removed group_filter to fetch all time periods in one call
      };

      console.log('Fetching dashboard data with payload:', body);

      const response = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing access token');
        }
        throw new Error(errorData.error || `Error fetching dashboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Transform array of key-value pairs to object, as expected by UI
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
  }, [uuid, code, costPerUnit, analysisMode, staticValue, dynamicValue, warehouseUrl, analysisValue]);

  useEffect(() => {
    if (menu && dashboardCode && !code) {
      fetchDashboardData();
    }
  }, [menu, dashboardCode, fetchDashboardData, code]);

  useEffect(() => {
    if (uuid && code) {
      fetchDashboardDataExt();
    }
  }, [uuid, fetchDashboardDataExt, code]);

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
      Day: 'consumption_daily',
      Week: 'consumption_weekly',
      Month: 'consumption_monthly',
      Workweek: 'consumption_weekdays',
      Weekends: 'consumption_weekends',
    }[activeGroupFilter]),
    [activeGroupFilter],
  );

  const costSummaryKey = useMemo(
    () => ({
      Day: 'cost_daily',
      Week: 'cost_weekly',
      Month: 'cost_monthly',
      Workweek: 'cost_weekdays',
      Weekends: 'cost_weekends',
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
    return (
      <span style={{ color: val.includes('-') ? '#59bd59' : '#9c2525' }}>
        {val}
        {' '}
        {val.includes('-') ? '▼' : '▲'}
      </span>
    );
  };

  const renderPlot = useCallback(() => {
    if (!currentData[trendAndCostPlotKey]) {
      return (
        <Typography className="warning-message">
          No plot data available
        </Typography>
      );
    }

    const plotObj = currentData[trendAndCostPlotKey];
    const fullX = plotObj.data[0]?.x || [];
    const consumptionTrace = plotObj.data.find((d) => d.name === 'Consumption');
    const lastActualIndex = consumptionTrace?.y?.findLastIndex((y) => y > 0) || fullX.length - 1;
    const actualData = plotObj.data.map((trace) => ({
      ...trace,
      x: fullX.slice(0, lastActualIndex + 1) || [],
      y: trace.y?.slice(0, lastActualIndex + 1) || [],
      customdata: trace.customdata?.slice(0, lastActualIndex + 1) || [],
    })).filter((t) => ['Consumption', 'Above_Target_Invisible'].includes(t.name));
    const forecastData = plotObj.data.map((trace) => ({
      ...trace,
      x: fullX.slice(lastActualIndex + 1) || [],
      y: trace.y?.slice(lastActualIndex + 1) || [],
      customdata: trace.customdata?.slice(lastActualIndex + 1) || [],
    })).filter((t) => ['Invisible_Below_Forecast', 'Above Target'].includes(t.name));
    const targetData = plotObj.data.filter((t) => t.name === 'Target');

    return (
      <Plot
        ref={plotContainerRef}
        key={`trend-and-cost-${themes}`}
        data={[...actualData, ...forecastData, ...targetData]}
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
          paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
          plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
          showlegend: true,
          legend: {
            orientation: 'h',
            x: 0.4,
            xanchor: 'center',
            y: -0.01,
            yanchor: 'top',
            font: { color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
          },
          annotations: plotObj.layout?.annotations?.map((annotation) => ({
            ...annotation,
            font: { ...annotation.font, color: themes === 'light' ? '#FFFFFF' : '#000000', family: 'Mulish, sans-serif' },
          })) || [],
          hoverlabel: {
            bgcolor: '#000000',
            font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
          },
        })}
        config={{ responsive: true, displayModeBar: false }}
        useResizeHandler
        style={{ width: '100%', height: '540px' }}
      />
    );
  }, [currentData, trendAndCostPlotKey, themes, commonLayoutAdjustments]);

  const isLoad = !code ? (isLoading || !menu) : isLoading;

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
            headerText={headerText || 'Water Management'}
            showBackButton={showBackButton}
            onBackButtonClick={onBackButtonClick}
            fontSize={fontSize}
          />
          <div className="main-content-1">
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'row',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
                padding: 1,
                gridTemplateRows: 'repeat(1, auto)',
              }}
            >
              {currentData[consumptionSummaryKey] && (
                <Item>
                  <Typography className="diagnostic-tit" component="p">
                    Total Consumption
                  </Typography>
                  <div className="diagnostic-valueimag">
                    <img src={Drop} alt="Consumption" className="data-im" />
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
              <Item>
                <Typography className="diagnostic-tit" component="p">
                  Total Cost
                </Typography>
                <div className="diagnostic-valueimag">
                  <img src={totalcost} alt="Consumption" className="data-im" />
                  <Typography className="diagnostic-subtit" component="p">
                    {currentData[costSummaryKey]?.so_far_today
                     || currentData[costSummaryKey]?.predicted_this_week_full
                     || currentData[costSummaryKey]?.predicted_this_month_full
                     || currentData[costSummaryKey]?.predicted_this_weekday_full
                     || currentData[costSummaryKey]?.predicted_this_weekend_full
                     || '₹0.00'}
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
                        {currentData[costSummaryKey]?.yesterday
                         || currentData[costSummaryKey]?.last_week
                         || currentData[costSummaryKey]?.last_month
                         || currentData[costSummaryKey]?.last_weekday
                         || currentData[costSummaryKey]?.last_weekend
                         || '₹0.00'}
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
                        {currentData[costSummaryKey]?.predicted_today
                         || currentData[costSummaryKey]?.predicted_this_week
                         || currentData[costSummaryKey]?.predicted_this_month
                         || currentData[costSummaryKey]?.predicted_this_weekday
                         || currentData[costSummaryKey]?.predicted_this_weekend
                         || '₹0.00'}
                      </Typography>
                    </div>
                  </div>
                  <div className="target">
                    <div className="target_name">
                      <Typography className="ft-15">Percent Change</Typography>
                    </div>
                    <div className="target_value">
                      <Typography className="ft-15" component="p">
                        {getPercentageDisplay(currentData[costSummaryKey]?.percent_change?.value || '0.00 %')}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Item>
              <Item>
                <Typography className="diagnostic-tit" component="p">
                  Meter Details
                </Typography>
                <div className="diagnostic-valueimag">
                  <img src={Meter} alt="Consumption" className="data-im" />
                </div>
                <div className="diagnostic-anomila-target">
                  {currentData.meter_info?.fields ? (
                    Object.entries(currentData.meter_info.fields).map(([key, value]) => (
                      <div className="target" key={key}>
                        <div className="target_name">
                          <Typography className="ft-15">{key}</Typography>
                        </div>
                        <div className="target_value">
                          <Typography className="ft-15" component="p">
                            {value || 'N/A'}
                          </Typography>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="target">
                      <div className="target_value">
                        <Typography className="ft-15" component="p">
                          No meter information available
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </Item>
              <Item sx={{ gridColumn: '4', gridRow: '1 / 3' }}>
                <div className="insights-2">
                  <Typography variant="h6" className="insights-head">
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
              <Item className="water" sx={{ gridColumn: '1/4' }}>
                <div style={{ width: '100%' }}>
                  <div>
                    <PlotTypeSelector
                      plotType={activeGroupFilter}
                      handlePlotTypeChange={handleFilter}
                      isDropdown={false}
                    />
                  </div>
                  {renderPlot()}
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

Water.propTypes = {
  defaultDate: PropTypes.string,
  headerText: PropTypes.string,
  showBackButton: PropTypes.bool,
  onBackButtonClick: PropTypes.func,
  fontSize: PropTypes.number,
  setActiveDate: PropTypes.func,
};

export default Water;
