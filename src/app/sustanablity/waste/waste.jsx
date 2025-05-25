import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Plot from 'react-plotly.js';
import { getSequencedMenuItems } from '../../util/appUtils';
import CardHeader from '../Energy/CardHeaderRes';
import Card from '../Energy/CardRes';
import PlotTypeSelector from './plot';
import '../Water/water.css';
import co2 from './co2emission_final.svg';
import disposal_img from './disposal1.svg';
import collection_img from './collection1.svg';
import { useTheme } from '../../ThemeContext';

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

const Waste = ({
  defaultDate = 'Day',
  headerText,
  showBackButton,
  onBackButtonClick,
  fontSize,
}) => {
  const [menu, setMenu] = useState('');
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(defaultDate);
  const [dashboardData, setDashboardData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const plotContainerRef = useRef(null);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/dashboard`;
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }
  const { themes } = useTheme();

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'ESG Tracker',
      'name',
    );
    let sld = '';
    if (getmenus && getmenus.length) {
      sld = getmenus.find((menu) => menu.name.toLowerCase() === 'waste');
    }
    setMenu(sld || '');
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo && userInfo.data) {
      if (
        userInfo.data.main_company &&
        userInfo.data.main_company.category &&
        userInfo.data.main_company.category.name &&
        userInfo.data.main_company.category.name.toLowerCase() === 'company' &&
        menu.company_dashboard_code
      ) {
        setDashboardCode(menu.company_dashboard_code);
      } else {
        setDashboardCode(menu.dashboard_code || 'WASTEV3');
      }
    }
  }, [menu, userInfo]);

  const fetchDashboardData = useCallback(async () => {
    if (!menu || !dashboardCode) return;

    setIsLoading(true);
    setDashboardData({});
    try {
      const body = {
        web_url: warehouseUrl,
        uuid: menu.uuid,
        code: dashboardCode,
        // Removed time_period to fetch all periods in one call
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
      setDashboardData(data || {});
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred while fetching the dashboard data.');
      setDashboardData({});
    } finally {
      setIsLoading(false);
    }
  }, [menu, dashboardCode, warehouseUrl]);

  useEffect(() => {
    if (menu && dashboardCode) {
      fetchDashboardData();
    }
  }, [menu, dashboardCode, fetchDashboardData]);

  const handleFilter = (value) => {
    setActiveGroupFilter(value);
    // Removed fetchDashboardData to prevent API call on filter change
  };

  const currentData = useMemo(() => {
    const data = dashboardData[activeGroupFilter] || {};
    console.log(`Current Data for Filter (${activeGroupFilter}):`, data);
    return data;
  }, [dashboardData, activeGroupFilter]);

  const theme = useMemo(
    () => createTheme({
      components: {
        MuiRadio: { styleOverrides: { root: { color: '#ffffff' } } },
      },
    }),
    [],
  );

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
        color: themes === 'light' ? 'white' : '#534d4d',
        family: 'Mulish, sans-serif',
        weight: 'bold',
      },
    },
    legend: {
      font: {
        family: 'Mulish, sans-serif',
        size: 12,
        color: themes === 'light' ? 'white' : '#000000',
      },
    },
    hoverlabel: {
      bgcolor: '#000000',
      font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
    },
  };

  const mergeAxisSettings = (backendAxis, adjustments) => ({
    ...backendAxis,
    ...adjustments,
    tickfont: {
      ...backendAxis?.tickfont,
      ...adjustments?.tickfont,
      color: themes === 'light' ? 'white' : '#000000',
      family: 'Mulish, sans-serif',
    },
    titlefont: {
      ...backendAxis?.titlefont,
      ...adjustments?.titlefont,
      color: themes === 'light' ? 'white' : '#000000',
      family: 'Mulish, sans-serif',
    },
  });

  const mergeLayout = (backendLayout, adjustments, isPieChart) => {
    const mergedLayout = {
      ...backendLayout,
      ...adjustments,
      title: {
        ...backendLayout?.title,
        font: {
          ...backendLayout?.title?.font,
          size: adjustments?.title?.font?.size || backendLayout?.title?.font?.size || 15,
          color: themes === 'light' ? 'white' : '#534d4d',
          family: adjustments?.title?.font?.family || backendLayout?.title?.font?.family || 'Mulish, sans-serif',
          weight: adjustments?.title?.font?.weight || backendLayout?.title?.font?.weight || 'bold',
        },
      },
      legend: {
        ...backendLayout?.legend,
        font: {
          ...backendLayout?.legend?.font,
          family: 'Mulish, sans-serif',
          size: 12,
          color: themes === 'light' ? 'white' : '#000000',
        },
      },
      hoverlabel: {
        bgcolor: '#000000',
        font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
      },
      ...(isPieChart
        ? {}
        : {
            xaxis: mergeAxisSettings(backendLayout?.xaxis || {}, adjustments?.xaxis || {}),
            yaxis: mergeAxisSettings(backendLayout?.yaxis || {}, adjustments?.yaxis || {}),
            yaxis2: mergeAxisSettings(backendLayout?.yaxis2 || {}, adjustments?.yaxis2 || {}),
          }),
    };
    if (mergedLayout.font && !mergedLayout.font.color) {
      delete mergedLayout.font.color;
    }
    return mergedLayout;
  };

  const defaultAxisAdjustments = {
    xaxis: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      showgrid: false,
      zeroline: false,
    },
    yaxis2: {
      automargin: true,
      tickfont: { size: 10, color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      titlefont: { color: themes === 'light' ? 'white' : '#000000', family: 'Mulish' },
      showgrid: false,
      zeroline: false,
    },
  };

  const renderPlot = useCallback(
    (plotKey, plotData, isWasteBySources = false) => {
      let parsedData;

      try {
        console.log(`Rendering plot ${plotKey} for ${activeGroupFilter} with data:`, plotData);
        if (isWasteBySources) {
          const wasteBySources = dashboardData[activeGroupFilter]?.Plots?.['Waste by Sources']?.data?.[0];
          console.log(`Waste by Sources data for ${activeGroupFilter}:`, wasteBySources);

          if (!wasteBySources || !wasteBySources.labels || !wasteBySources.values) {
            throw new Error(`No valid Waste by Sources data for ${activeGroupFilter}`);
          }

          parsedData = {
            data: [
              {
                type: 'pie',
                hole: wasteBySources.hole || 0.4,
                labels: wasteBySources.labels,
                values: wasteBySources.values,
                textinfo: wasteBySources.textinfo || 'label+percent',
                textposition: 'inside',
                textfont: {
                  size: 14,
                  color: themes === 'light' ? 'white' : '#000000',
                  family: 'Mulish, sans-serif',
                },
                hovertemplate:
                  wasteBySources.hovertemplate ||
                  '<b>%{label}</b><br>Weight: %{value:.2f} Kg<br>Percentage: %{percent:.1%}<extra></extra>',
                marker: {
                  colors: wasteBySources.marker?.colors || ['#1f77b4', '#ff7f0e', '#2ca02c'],
                },
              },
            ],
            layout: {
              title: {
                text: 'Waste by Sources',
                x: 0,
                y: 0.99,
                xanchor: 'left',
                yanchor: 'top',
                font: {
                  size: 8,
                  color: themes === 'light' ? '#C8C1C1' : '#534d4d',
                  family: 'Mulish, sans-serif',
                  weight: 'bold',
                },
              },
              showlegend: true,
              legend: {
                orientation: 'h',
                y: -0.15,
                x: 0.5,
                xanchor: 'center',
                font: {
                  size: 12,
                  color: themes === 'light' ? 'white' : '#000000',
                  family: 'Mulish, sans-serif',
                },
              },
              autosize: true,
              margin: {
                l: 20,
                r: 20,
                t: 60,
                b: 40,
              },
              paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
              plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
            },
          };
        } else if (plotKey.toLowerCase().includes('current vs forecast')) {
          parsedData = plotData?.plotly_json
            ? JSON.parse(plotData.plotly_json)
            : currentData?.Plots?.['Current vs Forecast'] || {};

          if (!parsedData || !parsedData.data || !parsedData.layout) {
            throw new Error('No valid Plotly data for Current vs Forecast');
          }

          parsedData.data = parsedData.data.map((trace) => ({
            ...trace,
            y: trace.y.map((val) => parseFloat(val) || 0),
          }));

          parsedData.layout = {
            ...parsedData.layout,
            xaxis: {
              ...parsedData.layout.xaxis,
              ...defaultAxisAdjustments.xaxis,
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              ...parsedData.layout.yaxis,
              ...defaultAxisAdjustments.yaxis,
              showgrid: false,
              zeroline: false,
            },
            yaxis2: {
              ...parsedData.layout.yaxis2,
              ...defaultAxisAdjustments.yaxis2,
              showgrid: false,
              zeroline: false,
              title: {
                text: parsedData.layout.yaxis2?.title?.text || 'Secondary Axis',
                font: {
                  color: themes === 'light' ? 'white' : '#000000',
                  family: 'Mulish, sans-serif',
                },
              },
            },
            showlegend: true,
            legend: {
              orientation: 'h',
              y: -0.2,
              x: 0.5,
              xanchor: 'center',
              font: { size: 12, color: themes === 'light' ? 'white' : '#000000', family: 'Mulish, sans-serif' },
            },
            paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
            plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
            hoverlabel: {
              bgcolor: '#000000',
              font: { color: '#FFFFFF', family: 'Mulish, sans-serif' },
            },
          };
        } else {
          parsedData = plotData.plotly_json ? JSON.parse(plotData.plotly_json) : plotData;
          if (!parsedData || !parsedData.data) {
            throw new Error('No valid Plotly data');
          }
        }

        if (!parsedData || !parsedData.data) {
          throw new Error(`No valid data for plot ${plotKey}`);
        }
      } catch (e) {
        console.error(`Error rendering plot for ${plotKey} in ${activeGroupFilter}:`, e);
        return (
          <Typography className="warning-message">
            No data available for {plotKey} in {activeGroupFilter}
          </Typography>
        );
      }

      const isPieChart = parsedData.data.some((trace) => trace.type === 'pie');

      return (
        <Plot
          key={`${plotKey}-${themes}`}
          data={parsedData.data}
          layout={mergeLayout(
            parsedData.layout || {},
            {
              ...commonLayoutAdjustments,
              title: {
                text: plotKey.replace(/([A-Z])/g, ' $1').trim(),
                font: {
                  size: 17,
                  color: themes === 'light' ? 'white' : '#000000',
                  family: 'Mulish, sans-serif',
                },
                y: 0.95,
                x: isPieChart ? 0.5 : 0.78,
                xanchor: 'center',
                yanchor: 'top',
                align: 'center',
              },
              xaxis: {
                showgrid: false,
                zeroline: false,
              },
              yaxis: {
                showgrid: false,
                zeroline: false,
              },
              yaxis2: {
                showgrid: false,
                zeroline: false,
              },
              ...(!isPieChart ? defaultAxisAdjustments : {}),
              paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
              plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FFFFFF',
              font: { color: themes === 'light' ? 'white' : '#000000', family: 'Mulish, sans-serif' },
              showlegend: true,
            },
            isPieChart,
          )}
          config={{ responsive: true, displayModeBar: false }}
          useResizeHandler
          style={{ width: '100%', height: isPieChart ? '100%' : '620px' }}
        />
      );
    },
    [themes, dashboardData, activeGroupFilter, commonLayoutAdjustments, defaultAxisAdjustments]
  );

  const carbonEmissionsSum = useMemo(() => {
    const emissions = currentData['Carbon Emissions'] || {};
    const extractNumber = (str) => {
      if (typeof str === 'string') {
        const num = parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
        return num;
      }
      return parseFloat(str) || 0;
    };
    const bioWaste = extractNumber(emissions['Bio Waste']);
    const dryWaste = extractNumber(emissions['Dry Waste']);
    const wetWaste = extractNumber(emissions['Wet Waste']);
    const total = bioWaste + dryWaste + wetWaste;
    return total.toFixed(2);
  }, [currentData]);

  const filterKeyMapping = {
    Day: {
      currentValueKey: 'current_value_so_far',
      percentageChangeKey: 'Change From Yesterday',
    },
    Week: {
      currentValueKey: 'current_value_so_far',
      percentageChangeKey: 'Change From Last Week',
    },
    Month: {
      currentValueKey: 'current_value_so_far',
      percentageChangeKey: 'Change From Last Month',
    },
    Weekend: {
      currentValueKey: 'current_value_so_far',
      percentageChangeKey: 'Change From Last Weekend',
    },
    'Work Week': {
      currentValueKey: 'current_value_so_far',
      percentageChangeKey: 'Change From Last Work Week',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading || !dashboardCode ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
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
            headerText={headerText || 'Waste Management'}
            showBackButton={showBackButton}
            onBackButtonClick={onBackButtonClick}
            fontSize={fontSize}
          />
          <div className="main-content-1">
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'row',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 1,
                padding: 1,
              }}
            >
              {currentData && [
                { key: 'Total Collection', value: currentData['Total Collection'] },
                { key: 'Total Disposal', value: currentData['Total Disposal'] },
                { key: 'Carbon Emissions', value: currentData['Carbon Emissions'] },
                { key: 'Intensity', value: currentData.Intensity },
              ].map(({ key, value }) => (
                <Item key={key}>
                  {key === 'Carbon Emissions' ? (
                    <div>
                      <Typography
                        className="diagnostic-tit"
                        component="p"
                        aria-label="Section: Carbon Emissions"
                      >
                        Carbon Emissions
                      </Typography>
                      <div className="diagnostic-valueimag">
                        <img src={co2} alt="Emissions" className="data-image-waste" />
                        <Typography className="diagnostic-subtit" component="p">
                          {carbonEmissionsSum} tCO2e
                        </Typography>
                      </div>
                      <div className="diagnostic-anomila-target">
                        {value &&
                          Object.entries(value).map(([metric, val]) => (
                            <div key={metric} className="target">
                              <div className="target_name">
                                <Typography className="ft-15">
                                  {metric.replace(/([A-Z])/g, ' $1').trim()}:
                                </Typography>
                              </div>
                              <div className="target_value">
                                <Typography className="ft-15" component="p">
                                  {val}
                                </Typography>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : key === 'Intensity' ? (
                    <div>
                      <Typography
                        className="diagnostic-tit"
                        component="p"
                        aria-label="Section: Intensity"
                      >
                        Intensity
                      </Typography>
                      <div className="diagnostic-anomila-target">
                        {value &&
                          Object.entries(value).map(([metric, val]) => (
                            <div key={metric} className="target">
                              <div className="target_name">
                                <Typography className="ft-15">
                                  {metric
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                    .trim()}
                                </Typography>
                              </div>
                              <div className="target_value">
                                <Typography className="ft-15" component="p">
                                  {val ?? 'N/A'}
                                </Typography>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : key === 'Total Collection' ? (
                    <div>
                      <Typography
                        className="diagnostic-tit"
                        component="p"
                        aria-label="Section: Total Collection"
                      >
                        Total Collection
                      </Typography>
                      <div className="diagnostic-valueimag">
                        <img src={collection_img} alt="Collection" className="data-image-waste" />
                        <Typography className="diagnostic-subtit" component="p">
                          {value?.[filterKeyMapping[activeGroupFilter]?.currentValueKey] ?? 'N/A'}
                        </Typography>
                      </div>
                      <div className="diagnostic-anomila-target">
                        {value &&
                          Object.entries(value)
                            .filter(([metric]) => metric !== filterKeyMapping[activeGroupFilter]?.currentValueKey)
                            .map(([metric, val]) => (
                              <div key={metric} className="target">
                                <div className="target_name">
                                  <Typography className="ft-15">
                                    {metric
                                      .replace(/_/g, ' ')
                                      .replace(/\b\w/g, (char) => char.toUpperCase())
                                      .trim()}
                                  </Typography>
                                </div>
                                <div className="target_value">
                                  <Typography className="ft-15" component="p">
                                    {metric === filterKeyMapping[activeGroupFilter]?.percentageChangeKey &&
                                    typeof val === 'string' ? (
                                      <span
                                        className={val.includes('▲') ? 'ft-15 green' : 'ft-15 red'}
                                      >
                                        {val}
                                      </span>
                                    ) : (
                                      val ?? 'N/A'
                                    )}
                                  </Typography>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  ) : key === 'Total Disposal' ? (
                    <div>
                      <Typography
                        className="diagnostic-tit"
                        component="p"
                        aria-label="Section: Total Disposal"
                      >
                        Total Disposal
                      </Typography>
                      <div className="diagnostic-valueimag">
                        <img src={disposal_img} alt="Disposal" className="data-image-waste" />
                        <Typography className="diagnostic-subtit" component="p">
                          {value?.[filterKeyMapping[activeGroupFilter]?.currentValueKey] ?? 'N/A'}
                        </Typography>
                      </div>
                      <div className="diagnostic-anomila-target">
                        {value &&
                          Object.entries(value)
                            .filter(([metric]) => metric !== filterKeyMapping[activeGroupFilter]?.currentValueKey)
                            .map(([metric, val]) => (
                              <div key={metric} className="target">
                                <div className="target_name">
                                  <Typography className="ft-15">
                                    {metric
                                      .replace(/_/g, ' ')
                                      .replace(/\b\w/g, (char) => char.toUpperCase())
                                      .trim()}
                                  </Typography>
                                </div>
                                <div className="target_value">
                                  <Typography className="ft-15" component="p">
                                    {metric === filterKeyMapping[activeGroupFilter]?.percentageChangeKey &&
                                    typeof val === 'string' ? (
                                      <span
                                        className={val.includes('▲') ? 'ft-15 green' : 'ft-15 red'}
                                      >
                                        {val}
                                      </span>
                                    ) : (
                                      val ?? 'N/A'
                                    )}
                                  </Typography>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Typography
                        className="diagnostic-tit"
                        component="p"
                        aria-label={`Section: ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <div className="diagnostic-anomila-target">
                        {value && typeof value === 'object' && !Array.isArray(value) && value !== null ? (
                          Object.entries(value).map(([metric, val]) => (
                            <div key={metric} className="target">
                              <div className="target_name">
                                <Typography className="ft-15">
                                  {metric
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                    .trim()}
                                </Typography>
                              </div>
                              <div className="target_value">
                                <Typography className="ft-15" component="p">
                                  {typeof val === 'object' && val !== null && !Array.isArray(val) ? (
                                    Object.entries(val).map(([subKey, subVal]) => (
                                      <div key={subKey}>
                                        {subKey
                                          .replace(/_/g, ' ')
                                          .replace(/\b\w/g, (char) => char.toUpperCase())
                                          .trim()}
                                        : {typeof subVal === 'string' || subVal === null || subVal === undefined
                                          ? subVal ?? 'N/A'
                                          : String(subVal)}
                                      </div>
                                    ))
                                  ) : metric === filterKeyMapping[activeGroupFilter]?.percentageChangeKey &&
                                    typeof val === 'string' ? (
                                    <span
                                      className={val.includes('▲') ? 'ft-15 green' : 'ft-15 red'}
                                    >
                                      {val}
                                    </span>
                                  ) : (
                                    typeof val === 'string' || val === null || val === undefined
                                      ? val ?? 'N/A'
                                      : String(val)
                                  )}
                                </Typography>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Typography className="ft-15">
                            {typeof value === 'string' || value === null || value === undefined
                              ? value ?? 'No data available'
                              : String(value)}
                          </Typography>
                        )}
                      </div>
                    </>
                  )}
                </Item>
              ))}
              <Item sx={{ gridColumn: '1 / 4' }} className="waste">
                <div ref={plotContainerRef}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography
                      className="diagnostic-tit"
                      component="p"
                      aria-label="Section: Current VS Forecast"
                    >
                      Current VS Forecast
                    </Typography>
                    <PlotTypeSelector
                      plotType={activeGroupFilter}
                      handlePlotTypeChange={handleFilter}
                      options={['Day', 'Week', 'Month', 'Weekend', 'Work Week']}
                      isDropdown={false}
                    />
                  </Box>
                  <div className="plot-box">
                    {currentData?.Plots?.['Current vs Forecast'] ? (
                      renderPlot('Current vs Forecast', currentData.Plots['Current vs Forecast'])
                    ) : (
                      <Typography className="warning-message">
                        No data available for Current vs Forecast in {activeGroupFilter}
                      </Typography>
                    )}
                  </div>
                </div>
              </Item>
              <Item
                sx={{
                  minHeight: 300,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  textAlign: 'center',
                }}
              >
                {currentData?.Plots ? (
                  renderPlot('Waste by Sources', {}, true)
                ) : (
                  <CircularProgress />
                )}
              </Item>
            </Box>
          </div>
        </Card>
      )}
    </ThemeProvider>
  );
};

export default Waste;