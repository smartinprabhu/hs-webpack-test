import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
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
} from '@mui/material';
import Plot from 'react-plotly.js';
import { getSequencedMenuItems } from '../../util/appUtils';
import CardHeader from './CardHeaderRes';
import Card from './CardRes';
import PlotTypeSelector from '../PlottypeSelector';
import './EnergyAnalytics.css';
import LEAF from './LEAF.svg';
import power from './power.svg';
import DOLLER from './DOLLAR.svg';

const Energy = ({
  defaultDate,
  headerText,
  showBackButton,
  onBackButtonClick,
  fontSize,
}) => {
  const [menu, setMenu] = useState('');
  const [dashboardCode, setDashboardCode] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState(defaultDate);
  const [plotData, setPlotData] = useState({});
  const [error, setError] = useState('');
  const [plotType, setPlotType] = useState('Day');
  const [isLoading, setIsLoading] = useState(false);
  const plotContainerRef = useRef(null);
  const isDropdown = useMediaQuery('(max-width: 576px)');
  const isDropdown932 = useMediaQuery(
    '(max-width: 932px) and (max-height: 430px)',
  );
  const isDropdown820 = useMediaQuery(
    '(max-width: 820px) and (max-height: 1180px)',
  );
  const [increaseValue, setIncreaseValue] = useState('0');
  const [selectedOption, setSelectedOption] = useState('Dynamic');
  const [staticResults, setStaticResults] = useState(null);
  const [dynamicResults, setDynamicResults] = useState(null);
  const [staticInputValue, setStaticInputValue] = useState('0');
  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7,
  });
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const userCompanyId = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id[1] : '';
  const userTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : '';
  let warehouseUrl = window.localStorage.getItem('iot_url');

  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('sid');
  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'ESG Tracker',
      'name',
    );
    let sld = '';
    if (getmenus && getmenus.length) {
      sld = getmenus.find((menu) => menu.name.toLowerCase() === 'environment');
    }
    setMenu(sld || '');
  }, [userRoles]);

  useEffect(() => {
    if (menu && menu.is_sld && userInfo && userInfo.data) {
      if (userInfo.data.main_company && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
        setDashboardCode(menu.company_dashboard_code);
      } else {
        setDashboardCode(menu.dashboard_code);
      }
    }
  }, [menu, userInfo, userRoles]);

  useEffect(() => {
    setActiveGroupFilter(defaultDate);
    fetchPlotData();
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [defaultDate]);

  const handleResize = useCallback(() => {
    setPlotDimensions({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  }, []);

  const handlePlotTypeChange = useCallback((event) => {
    setPlotType(event.target.value);
  }, []);

  const fetchPlotData = useCallback(async (option = selectedOption) => {
    if (!menu || !dashboardCode) return;

    setIsLoading(true);
    setPlotData({});
    try {
      const body = {
        option,
        uuid: menu.uuid,
        company_id: userCompanyId,
        code: dashboardCode,
        equipment_id: id,
        warehouse_url: warehouseUrl,
        company_timezone: userTimeZone,
        increase_value: option === 'Static' ? increaseValue : '0',
        increase_percent: option === 'Dynamic' ? increaseValue : '0',
        increase_rate: increaseValue,
      };
      const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
      const forecastResponse = await fetch(`${WEBAPPAPIURL}forecastData`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!forecastResponse.ok) {
        throw new Error(`Error fetching forecast data: ${forecastResponse.status}`);
      }

      const data = await forecastResponse.json();
      const structuredData = structureData(data);

      if (option === 'Dynamic') {
        setDynamicResults(structuredData);
      } else {
        setStaticResults(structuredData);
      }

      setPlotData(structuredData);
      setStaticInputValue(increaseValue);
      setError('');
    } catch (error) {
      setError(error.message || 'An error occurred while fetching the plot data.');
      setPlotData({});
    } finally {
      setIsLoading(false);
    }
  }, [menu, dashboardCode, selectedOption, increaseValue]);
  useEffect(() => {
    if (menu && dashboardCode) {
      fetchPlotData();
    }
  }, [menu, dashboardCode]);
  const structureData = useCallback((data) => {
    const structured = {};
    data.forEach((entry) => {
      const [key, value] = entry;
      structured[key] = value;
    });
    return structured;
  }, []);

  const theme = useMemo(
    () => createTheme({
      components: {
        MuiRadio: {
          styleOverrides: {
            root: {
              color: '#ffffff',
            },
          },
        },
      },
    }),
    [],
  );

  const currentData = useMemo(
    () => plotData[plotType] || {},
    [plotData, plotType],
  );

  const customLayout = useMemo(
    () => ({
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: {
        color: '#FFFFFF',
      },
      xaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
      },
      yaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
      },
      showlegend: true,
    }),
    [],
  );

  const handleOptionChange = useCallback(
    (option) => {
      setSelectedOption(option);
      fetchPlotData(option);
      if (option === 'Static') {
        setDynamicResults(null);
      } else {
        setStaticResults(null);
      }
      setIncreaseValue('0');
    },
    [fetchPlotData],
  );

  const handleLoadUpdate = useCallback(() => {
    setIncreaseValue('0');
    fetchPlotData(selectedOption);
  }, [selectedOption, fetchPlotData]);
  return (
    <ThemeProvider theme={theme}>
      {isLoading || !menu ? (
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
      ) : (
        <Card>
          {menu && dashboardCode && (
            <CardHeader
              headerText={headerText || 'Energy'}
              showToggle
              onInputValueChange={setIncreaseValue}
              onLoadUpdate={handleLoadUpdate}
              onOptionChange={handleOptionChange}
              initialSelectedOption={selectedOption}
              staticInputValue={staticInputValue}
              showBackButton={showBackButton}
              onBackButtonClick={onBackButtonClick}
              fontSize={fontSize}
            >
              <PlotTypeSelector
                plotType={plotType}
                handlePlotTypeChange={handlePlotTypeChange}
                isDropdown={isDropdown || isDropdown932 || isDropdown820}
              />
            </CardHeader>
          )}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={8}
              lg={8}
              className="padding-15px display"
            >
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="responsive-1">
                  {Object.entries(currentData).map(([key, value], index) => {
                    // Skip the 'week_plot' section
                    if (key === 'week_plot') {
                      return null;
                    }

                    // Render the fourth response fully with separate styling
                    if (index === 3) {
                      return (
                        <div
                          key={key}
                          className="energybox fourth-card"
                        >
                          <div className="par1">
                            <p
                              className="tit1"
                            >
                              {key.replace(/_/g, ' ')}
                            </p>
                            {/* Render the entire fourth response fully */}
                            {typeof value === 'object'
                            && !Array.isArray(value) ? (
                              <div className="parent-container">
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <div className="subKey" key={subKey}>
                                      <p className="p1 chart-title-responsive font">
                                        {subKey.replace(/_/g, ' ')}
                                      </p>
                                      <p className="p2 chart-title-responsive font">
                                        {typeof subValue === 'string'
                                          && (subValue.includes('▼')
                                            || subValue.includes('▲'))
                                          ? (() => {
                                            const isNegative = subValue.includes('▼');
                                            const colorClass = isNegative
                                              ? 'green-text'
                                              : 'red-text'; // Add class based on value
                                            return (
                                              <span className={colorClass}>
                                                {subValue}
                                              </span>
                                            );
                                          })()
                                          : typeof subValue === 'number'
                                            ? subValue.toFixed(2) // Ensure two decimal places for numbers
                                            : String(subValue)}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                              ) : null}
                          </div>
                        </div>
                      );
                    }

                    // Skip the second subkey-subvalue pairs for all other responses
                    if (key !== `${plotType.toLowerCase()}_plot`) {
                      return (
                        <div
                          key={key}
                          className="energybox"
                        >
                          <div className="par">
                            <p
                              className="tit"
                            >
                              {key.replace(/_/g, ' ')}
                              <p className="subtit">
                                {typeof value === 'object'
                                && !Array.isArray(value)
                                  ? (() => {
                                    const entries = Object.entries(value);
                                    const secondEntry = entries.find(
                                      ([key]) => key === 'So_far_Today'
                                          || key === 'Current_Weekend_so_far'
                                          || key === 'Current_Workweek_so_far'
                                          || key === 'Current_Year_so_far'
                                          || key === 'Current_Month_so_far'
                                          || key === 'Current_Week_so_far',
                                    );
                                    return secondEntry
                                      ? (() => {
                                        const match = secondEntry[1].match(
                                          /([\d.]+)\s*(.+)/,
                                        ); // Separate number and unit
                                        if (match) {
                                          const [_, numericValue, unit] = match; // Extract matched groups
                                          return (
                                            <>
                                              {numericValue}
                                              <span className="unit">
                                                {' '}
                                                {unit}
                                              </span>
                                            </>
                                          );
                                        }
                                        return secondEntry[1];
                                      })()
                                      : null;
                                  })()
                                  : null}
                              </p>
                              {/* Add image based on the key */}
                            </p>
                            <div
                              className="mgglight-mode"
                            >
                              {key.toLowerCase().includes('consumption') && (
                                <img
                                  src={power}
                                  alt="Consumption"
                                  className="data-image"
                                />
                              )}
                              {key.toLowerCase().includes('cost') && (
                                <img
                                  src={DOLLER}
                                  alt="Estimated Cost"
                                  className="data-image"
                                />
                              )}
                              {key.toLowerCase().includes('emissions') && (
                                <img
                                  src={LEAF}
                                  alt="Emissions"
                                  className="data-image im"
                                />
                              )}
                            </div>
                          </div>
                          {/* Render other subkeys and subvalues */}
                          {typeof value === 'object'
                          && !Array.isArray(value) ? (
                            <div className="parent-container">
                              {/* Skip the second subkey-subvalue pair */}
                              {Object.entries(value)
                                .filter((_, index) => index !== 1) // Skip the second subkey-subvalue pair
                                .map(([subKey, subValue]) => (
                                  <div className="subKey" key={subKey}>
                                    <p className="p1 chart-title-responsive font">
                                      {subKey.replace(/_/g, ' ')}
                                    </p>
                                    <p className="p2 chart-title-responsive font">
                                      {typeof subValue === 'string'
                                        && (subValue.includes('▼')
                                          || subValue.includes('▲'))
                                        ? (() => {
                                          const isNegative = subValue.includes('▼');
                                          const colorClass = isNegative
                                            ? 'green-text'
                                            : 'red-text'; // Add class based on value
                                          return (
                                            <span className={colorClass}>
                                              {subValue}
                                            </span>
                                          );
                                        })()
                                        : typeof subValue === 'number'
                                          ? subValue.toFixed(2) // Ensure two decimal places for numbers
                                          : String(subValue)}
                                    </p>
                                  </div>
                                ))}
                            </div>
                            ) : null}
                        </div>
                      );
                    }
                  })}
                </div>
              </Grid>
            </Grid>
          </Grid>
          {currentData[`${plotType.toLowerCase()}_plot`] && (
            <Box
              sx={{ overflowX: 'hidden', overflowY: 'hidden' }}
              className="plot1"
            >
              <Box
                ref={plotContainerRef}
                className="plot-container1"
              >
                <div className="plot-box">
                  <Plot
                    data={
                      Array.isArray(
                        currentData[`${plotType.toLowerCase()}_plot`]?.data,
                      )
                        ? currentData[`${plotType.toLowerCase()}_plot`]?.data
                        : []
                    }
                    layout={{
                      ...customLayout,
                      ...currentData[`${plotType.toLowerCase()}_plot`]?.layout,
                      title: {
                        text: 'Predicted Energy Consumption vs. Target',
                        font: {
                          family: 'Mulish',
                          size: 17,
                          color: 'white',
                        },
                        y: 0.95,
                        x: 0.02,
                        align: 'left',
                      },
                      font: {
                        color: 'black',
                      },
                    }}
                    style={{
                      width: plotDimensions.width,
                      height: 620,
                    }}
                    config={{
                      displaylogo: false, // Hide the 'Powered by Plotly' logo
                    }}
                    useResizeHandler
                  />
                </div>
              </Box>
            </Box>
          )}
        </Card>
      )}
    </ThemeProvider>
  );
};

export default Energy;