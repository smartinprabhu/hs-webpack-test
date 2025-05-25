/* eslint-disable radix */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';

import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import LineAxisOutlinedIcon from '@mui/icons-material/LineAxisOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { SketchPicker } from 'react-color';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';

import Loader from '@shared/loading';

import {
  isJsonString,
  getJsonString,
} from '../../../util/appUtils';
import {
  getChartName,
  getLabData,
  getLabelData,
} from '../../utils/utils';
import TabPanel from './tabPanel';
import DialogHeader from '../../../commonComponents/dialogHeader';
import customData from '../../data/customData.json';
import {
  updateDashboardLayouts,
  getNinjaDashboard,
  getNinjaCode,
} from '../../../analytics/analytics.service';

const appModels = require('../../../util/appModels').default;

const Configuration = React.memo(({
  chartData, chartValues, savedOptions, isIot, dashboardUuid, dashboardCode, datasets, selectedDateTag, dashboardColors, code,
}) => {
  const detailData = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info)) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description))));

  const dispatch = useDispatch();

  const [value, setValue] = React.useState(0);

  const [expanded, setExpanded] = React.useState(false);

  const [colorModal, setColorModal] = React.useState(false);
  const [colorModal1, setColorModal1] = React.useState(false);
  const [colorModal2, setColorModal2] = React.useState(false);

  const [colorModal3, setColorModal3] = React.useState(false);
  const [colorModal4, setColorModal4] = React.useState(false);
  const [colorModal5, setColorModal5] = React.useState(false);
  const [colorModal6, setColorModal6] = React.useState(false);

  const [iotLoading, setIotLoading] = React.useState(false);

  function deepMerge(obj1, obj2) {
    // Check if both values are objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      // Iterate over obj2 properties
      for (const key in obj2) {
        // If the property is an object, recursively merge
        if (obj2.hasOwnProperty(key) && obj2[key] && typeof obj2[key] === 'object') {
          // If obj1 also has the property and it's an object, merge recursively
          if (obj1[key] && typeof obj1[key] === 'object') {
            obj1[key] = deepMerge(obj1[key], obj2[key]);
          } else {
            // Otherwise, assign the property from obj2 to obj1
            obj1[key] = obj2[key];
          }
        } else {
          // If the property is not an object, assign it to obj1
          obj1[key] = obj2[key];
        }
      }
    } else {
      // If either value is not an object, use obj2 value
      obj1 = obj2;
    }

    return obj1;
  }

  const { updateLayoutInfo } = useSelector(
    (state) => state.analytics,
  );

  const [isUpdate, setIsUpdate] = React.useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const userCompany = userInfo.data
  && userInfo.data.company ? userInfo.data.company : false;

  React.useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && isUpdate) {
      const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: selectedDateTag,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      /* dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
        ),
      ); */
      if (isIot) {
        setIotLoading(true);
        setTimeout(() => {
          dispatch(
            getNinjaDashboard(
              'ks_fetch_dashboard_data',
              appModels.NINJABOARD,
              code,
              context,
              'IOT',
              dashboardCode,
              dashboardUuid,
              userCompany,
            ),
          );
          setIotLoading(false);
        }, 1200);
      } else {
        dispatch(getNinjaCode(code, appModels.NINJABOARD, false, false, code));
      }
    }
  }, [updateLayoutInfo, isUpdate]);

  const labels = chartValues && chartValues.labels ? chartValues.labels : [];

  const axisOptions = {
    xaxis: {
      categories:
        chartData
        && chartData.hx_annotations_data_ids
        && chartData.hx_annotations_data_ids.length
          ? getLabData(labels)
          : labels,
      type:
        chartData
        && chartData.hx_annotations_data_ids
        && chartData.hx_annotations_data_ids.length
          ? 'datetime'
          : undefined,
      tickPlacement:
        chartData
        && chartData.hx_annotations_data_ids
        && chartData.hx_annotations_data_ids.length
          ? 'between'
          : undefined,
      datetimeUTC: false,
      position: 'bottom',
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        showDuplicates: false,
        rotate: -45,
        rotateAlways: true,
        trim: false,
        hideOverlappingLabels: false,
        style: {
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
      },
      axisTicks: {
        show: true,
      },
      title: {
        text:
          chartData && chartData.title_x_axis ? chartData.title_x_axis : '',
        style: {
          color: 'black',
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: 'Suisse Intl',
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      tickAmount: 6,
      show: true,
      opposite: false,
      reversed: false,
      floating: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        formatter(val, index) {
          return getLabelData(val);
        },
        style: {
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
      },
      title: {
        text:
          chartData && chartData.title_y_axis ? chartData.title_y_axis : '',
        style: {
          color: 'black',
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: 'Suisse Intl',
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
  };

  const isObjectEmpty = (objectName) => JSON.stringify(objectName) === '{}';

  function getChartOptions() {
    let res = false;
    if (!isIot && savedOptions) {
      const res1 = { ...savedOptions };
      res1.chart.id = 'bar-chartzz';
      res1.xaxis.categories = chartData
        && chartData.hx_annotations_data_ids
        && chartData.hx_annotations_data_ids.length
        ? getLabData(labels)
        : labels;
      res1.xaxis.type = chartData
          && chartData.hx_annotations_data_ids
          && chartData.hx_annotations_data_ids.length
        ? 'datetime'
        : undefined;
      res1.xaxis.tickPlacement = chartData
            && chartData.hx_annotations_data_ids
            && chartData.hx_annotations_data_ids.length
        ? 'between'
        : undefined;
      res = res1; // deepMerge(res1, axisOptions);
    } else if (isIot && savedOptions && (savedOptions.chart && savedOptions.chart.dropShadow)) {
      const res1 = { ...savedOptions };
      res1.chart.id = 'bar-chartzz';
      res1.xaxis.categories = chartData
        && chartData.hx_annotations_data_ids
        && chartData.hx_annotations_data_ids.length
        ? getLabData(labels)
        : labels;
      res1.xaxis.type = chartData
          && chartData.hx_annotations_data_ids
          && chartData.hx_annotations_data_ids.length
        ? 'datetime'
        : undefined;
      res1.xaxis.tickPlacement = chartData
            && chartData.hx_annotations_data_ids
            && chartData.hx_annotations_data_ids.length
        ? 'between'
        : undefined;
      res = res1; // deepMerge(res1, axisOptions);
    }
    return res;
  }

  const axisOptionsInitial1 = { ...axisOptions };
  const defaultOptionsInitial1 = { ...customData.barApexChartDefaultPreviewOptions };

  const [barOptions, setBarOptions] = React.useState(getChartOptions() ? getChartOptions() : { ...axisOptions, ...customData.barApexChartPreviewOptions });
  const [barOptions1, setBarOptions1] = React.useState(getChartOptions() ? JSON.stringify(getChartOptions()) : JSON.stringify({ ...axisOptionsInitial1, ...defaultOptionsInitial1 }));

  React.useEffect(() => {
    const bopts = getChartOptions() ? JSON.stringify(getChartOptions()) : JSON.stringify({ ...axisOptionsInitial1, ...defaultOptionsInitial1 });
    if (bopts && bopts !== null) {
      setBarOptions(JSON.parse(bopts));
      try {
        ApexCharts.exec('bar-chartzz', 'updateOptions', JSON.parse(bopts), false, true);
      } catch (error) {
        console.error('Error updating chart options:', error);
      }
    }
  }, [chartData]);

  React.useEffect(() => {
    if (barOptions && barOptions !== null) {
      try {
        ApexCharts.exec('bar-chartzz', 'updateOptions', barOptions, false, true);
      } catch (error) {
        console.error('Error updating chart options:', error);
      }
    }
  }, [barOptions]);

  const handleAccChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const modes = ['dark', 'light'];
  const paletteOptions = customData.palleteOptions;

  const onUpdate = () => {
    const newOptions = { ...barOptions };
    delete newOptions.xaxis.categories;
    delete newOptions.xaxis.type;
    delete newOptions.xaxis.tickPlacement;
    delete newOptions.xaxis.datetimeUTC;
    delete newOptions.xaxis.labels.style;
    // delete newOptions.xaxis.title;

    delete newOptions.yaxis.labels;
    // delete newOptions.yaxis.title;
    delete newOptions.chart.id;
    setIsUpdate(true);
    setIotLoading(false);
    const postData = {
      dashboard_item_json: JSON.stringify(newOptions),
    };
    if (isIot) {
      dispatch(
        updateDashboardLayouts(
          chartData.id,
          appModels.NINJABOARD,
          postData,
          'IOT',
          dashboardUuid,
          appModels.NINJABOARDITEM,
        ),
      );
    } else {
      dispatch(updateDashboardLayouts(chartData.id, appModels.NINJABOARDITEM, postData));
    }
  };

  const onResetBar = () => {
    setIsUpdate(true);
    setIotLoading(false);
    const postData = {
      dashboard_item_json: '',
    };
    if (isIot) {
      dispatch(
        updateDashboardLayouts(
          chartData.id,
          appModels.NINJABOARD,
          postData,
          'IOT',
          dashboardUuid,
          appModels.NINJABOARDITEM,
        ),
      );
    } else {
      dispatch(updateDashboardLayouts(chartData.id, appModels.NINJABOARDITEM, postData));
    }
  };

  const onReset = () => {
    setBarOptions(JSON.parse(barOptions1));
    ApexCharts.exec('bar-chartzz', 'updateOptions', JSON.parse(barOptions1), false, true);
  };

  const handleModeChange = (event, newAlignment) => {
    const options = { ...barOptions };
    options.theme.mode = newAlignment;
    if (newAlignment === 'dark') {
      options.chart.background = '#343E59';
      options.chart.foreColor = '#fff';
    } else {
      options.chart.background = '#fff';
      options.chart.foreColor = '#343E59';
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handlePaletteChange = (event) => {
    const options = { ...barOptions };
    options.theme.palette = event.target.value;
    options.colors = undefined;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDropShadowChange = (event) => {
    const options = { ...barOptions };
    options.chart.dropShadow.enabled = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleSliderChange = (newValue, field) => {
    const options = { ...barOptions };
    options.chart.dropShadow[field] = newValue;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleOpacityColorChange = (e) => {
    const options = { ...barOptions };
    options.chart.dropShadow.color = e.hex;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisTitleColorChange = (e) => {
    const options = { ...barOptions };
    options.xaxis.title.style.color = e.hex;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleShowXaxisLabelChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.labels.show = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisLabelRotateChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.labels.rotateAlways = event.target.checked;
    if (event.target.checked) {
      options.xaxis.labels.rotate = -45;
    } else {
      options.xaxis.labels.rotate = 0;
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisPosChange = (event, newAlignment) => {
    const options = { ...barOptions };
    options.xaxis.position = newAlignment;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisLabelTrimChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.labels.trim = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisLabelHideChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.labels.hideOverlappingLabels = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisBorderChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.axisBorder.show = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisTickChange = (event) => {
    const options = { ...barOptions };
    options.xaxis.axisTicks.show = event.target.checked;
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleShowYaxisLabelChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].show = event.target.checked;
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisOppositeChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].opposite = event.target.checked;
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisReverseChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].reversed = event.target.checked;
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisTitleAngleChange = (val, field) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].title[field] = val;
    }
    setBarOptions(options);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisTickChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].axisTicks.show = event.target.checked;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisFloatChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].floating = event.target.checked;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisBorderChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].axisBorder.show = event.target.checked;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYaxisTitleColorChange = (event) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].title.style.color = event.hex;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleYAxisTickSliderChange = (newValue) => {
    const options = { ...barOptions };
    if (options.yaxis && options.yaxis.length) {
      options.yaxis[0].tickAmount = newValue;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisLabelRotateAngleChange = (newValue) => {
    const options = { ...barOptions };
    options.xaxis.labels.rotate = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleXaxisTitleAngleChange = (newValue, field) => {
    const options = { ...barOptions };
    options.xaxis.title[field] = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleGridLineChange = (event, field) => {
    const options = { ...barOptions };
    options.grid[field].lines.show = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleGridpaddingChange = (newValue, field) => {
    const options = { ...barOptions };
    options.grid.padding[field] = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarStackChange = (event) => {
    const options = { ...barOptions };
    options.chart.stacked = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarChange = (event, field) => {
    const options = { ...barOptions };
    options.plotOptions.bar[field] = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarWidthChange = (newValue, field) => {
    const options = { ...barOptions };
    options.plotOptions.bar[field] = field === 'columnWidth' ? `${newValue}%` : newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelOffsetChange = (newValue, field) => {
    const options = { ...barOptions };
    options.dataLabels[field] = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelBgOffsetChange = (newValue, field) => {
    const options = { ...barOptions };
    options.dataLabels.background[field] = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelDsOffsetChange = (newValue, field) => {
    const options = { ...barOptions };
    options.dataLabels.dropShadow[field] = newValue;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarRadiusPosPosChange = (event, newAlignment) => {
    const options = { ...barOptions };
    options.plotOptions.bar.borderRadiusApplication = newAlignment;
    setBarOptions(options);
    
    console.log(newAlignment);
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarDataLabelChange = (event) => {
    const options = { ...barOptions };
    options.dataLabels.enabled = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarDatalabelPosChange = (newAlignment, field) => {
    const options = { ...barOptions };
    options.plotOptions.bar.dataLabels[field] = newAlignment;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleLegendChange = (event, field) => {
    const options = { ...barOptions };
    options.legend[field] = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleLegendPosChange = (newAlignment, field) => {
    const options = { ...barOptions };
    options.legend[field] = newAlignment;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleLegendSpaceChange = (newAlignment, field) => {
    const options = { ...barOptions };
    options.legend.itemMargin[field] = newAlignment;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelColorChange = (event) => {
    const options = { ...barOptions };
    if (options.dataLabels && options.dataLabels.style && options.dataLabels.style.colors.length) {
      options.dataLabels.style.colors[0] = event.hex;
    }
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelBgForeColorChange = (event) => {
    const options = { ...barOptions };
    options.dataLabels.background.foreColor = event.hex;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleDataLabelBgBorderColorChange = (event) => {
    const options = { ...barOptions };
    options.dataLabels.background.borderColor = event.hex;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarDataLabelBgChange = (event) => {
    const options = { ...barOptions };
    options.dataLabels.background.enabled = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  const handleBarDataLabelDsChange = (event) => {
    const options = { ...barOptions };
    options.dataLabels.dropShadow.enabled = event.target.checked;
    setBarOptions(options);
    
    ApexCharts.exec('bar-chartzz', 'updateOptions', options, false, true);
  };

  if (barOptions.yaxis && barOptions.yaxis.length > 0) {
    barOptions.yaxis[0].labels.formatter = function (value) {
    // Your custom formatting logic here
      return getLabelData(value);// Example: Format the label to two decimal places
    };
  } else if (barOptions.yaxis && barOptions.yaxis.labels) {
    barOptions.yaxis.labels.formatter = function (value) {
      // Your custom formatting logic here
      return getLabelData(value);// Example: Format the label to two decimal places
    };
  }

  if (barOptions && barOptions.dataLabels) {
    barOptions.dataLabels.formatter = function (value) {
      // Your custom formatting logic here
      return getLabelData(value);// Example: Format the label to two decimal places
    };
  }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          marginBottom: '15px',
          fontFamily: 'Suisse Intl',
        }}
      >
        {updateLayoutInfo && !updateLayoutInfo.loading && !iotLoading && (
          <>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider', width: '7%' }}
            >
              <Tab icon={<AutoFixHighOutlinedIcon fontSize="large" />} className="font-family-tab" label="Chart Theme" {...a11yProps(0)} />
              <Tab icon={<LineAxisOutlinedIcon fontSize="large" />} className="font-family-tab" label="Axis/Grid" {...a11yProps(1)} />
              <Tab icon={<BarChartOutlinedIcon fontSize="large" />} className="font-family-tab" label="Chart Options" {...a11yProps(2)} />
              { /* <Tab icon={<FormatColorFillOutlinedIcon fontSize="large" />} label="Chart Fill" {...a11yProps(3)} /> */ }
              <Tab icon={<FormatListBulletedOutlinedIcon fontSize="large" />} className="font-family-tab" label="Legend" {...a11yProps(4)} />
              { /* <Tab icon={<MessageOutlinedIcon fontSize="large" />} label="Datalabels and Markers" {...a11yProps(5)} /> */ }
            </Tabs>
            <TabPanel value={value} index={0}>
              <div>
                <Accordion expanded={expanded === 'panel1'} onChange={handleAccChange('panel1')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Chart Theme
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Mode</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <ToggleButtonGroup
                          formats={modes}
                          color="primary"
                          size="small"
                          value={barOptions && barOptions.theme ? barOptions.theme.mode : ''}
                          exclusive
                          onChange={handleModeChange}
                          aria-label="text formatting"
                        >
                          <ToggleButton value="dark" aria-label="dark">
                            <DarkModeOutlinedIcon />
                          </ToggleButton>
                          <ToggleButton value="light" aria-label="light">
                            <LightModeOutlinedIcon />
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Palette</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={barOptions && barOptions.theme ? barOptions.theme.palette : ''}
                            onChange={handlePaletteChange}
                            label=""
                          >
                            {paletteOptions.map((pl) => (
                              <MenuItem value={pl.value}>
                                {pl.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleAccChange('panel2')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>Drop Shadow</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Enable</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.chart.dropShadow.enabled}
                            onChange={handleDropShadowChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      {barOptions.chart.dropShadow.enabled && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Blur</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Blur"
                              value={barOptions.chart.dropShadow.blur}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleSliderChange(newValue, 'blur')}
                              step={1}
                              min={0}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Offset X</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Offset X"
                              value={barOptions.chart.dropShadow.left}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleSliderChange(newValue, 'left')}
                              step={1}
                              min={-30}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Offset Y</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Offset Y"
                              value={barOptions.chart.dropShadow.top}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleSliderChange(newValue, 'top')}
                              step={1}
                              min={-30}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Shadow Opacity</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Shadow Opacity"
                              value={barOptions.chart.dropShadow.opacity}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleSliderChange(newValue, 'opacity')}
                              step={0.1}
                              min={0}
                              max={1}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Shadow Color</span>
                          <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                            <FiberManualRecordIcon
                              fontSize="large"
                              className="border-round-circle"
                              sx={{ color: barOptions.chart.dropShadow.color }}
                              onClick={() => { setColorModal(true); }}
                            />
                          </div>
                        </div>
                      </>
                      )}
                    </div>
                    <Dialog size="sm" open={colorModal}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.chart.dropShadow.color} onChangeComplete={(colour) => handleOpacityColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                  </AccordionDetails>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div>
                <Accordion expanded={expanded === 'panel3'} onChange={handleAccChange('panel3')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      X Axis
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="alarms-school-scroll thin-scrollbar">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show Labels</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.xaxis.labels.show}
                          onChange={handleShowXaxisLabelChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    {barOptions.xaxis.labels.show && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Position</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ToggleButtonGroup
                            formats={['top', 'bottom']}
                            color="primary"
                            size="small"
                            value={barOptions && barOptions.xaxis ? barOptions.xaxis.position : ''}
                            exclusive
                            onChange={handleXaxisPosChange}
                            aria-label="text formatting"
                          >
                            <ToggleButton value="top" aria-label="Top">
                              Top
                            </ToggleButton>
                            <ToggleButton value="bottom" aria-label="Bottom">
                              Bottom
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Rotate</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.xaxis.labels.rotateAlways}
                            onChange={handleXaxisLabelRotateChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Rotate Angle</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Rotate Angle"
                            value={barOptions.xaxis.labels.rotate}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleXaxisLabelRotateAngleChange(newValue)}
                            step={1}
                            min={-360}
                            max={360}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Trim Long Labels</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.xaxis.labels.trim}
                            onChange={handleXaxisLabelTrimChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Hide Overlapping Labels</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.xaxis.labels.hideOverlappingLabels}
                            onChange={handleXaxisLabelHideChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                    </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Title</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <TextField
                          size="small"
                          onChange={(event) => handleXaxisTitleAngleChange(event.target.value, 'text')}
                          value={barOptions.xaxis.title.text}
                          id="standard-basic"
                          label=""
                          variant="standard"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Title Color</span>
                      <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                        <FiberManualRecordIcon className="border-round-circle" fontSize="large" sx={{ color: barOptions.xaxis.title.style.color }} onClick={() => { setColorModal1(true); }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Title Left Offset</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Title Left Offset"
                          value={barOptions.xaxis.title.offsetX}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleXaxisTitleAngleChange(newValue, 'offsetX')}
                          step={1}
                          min={-100}
                          max={100}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Title Top Offset</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Title Top Offset"
                          value={barOptions.xaxis.title.offsetY}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleXaxisTitleAngleChange(newValue, 'offsetY')}
                          step={1}
                          min={-100}
                          max={100}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Axis Border</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.xaxis.axisBorder.show}
                          onChange={handleXaxisBorderChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Axis Ticks</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.xaxis.axisTicks.show}
                          onChange={handleXaxisTickChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <Dialog size="sm" open={colorModal1}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.xaxis.title.style.color} onChangeComplete={(colour) => handleXaxisTitleColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal1(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleAccChange('panel4')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Y Axis
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="alarms-school-scroll thin-scrollbar">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].show : true}
                          onChange={handleShowYaxisLabelChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    {((barOptions.yaxis && barOptions.yaxis.length && barOptions.yaxis[0].show) || (barOptions.yaxis && barOptions.yaxis && barOptions.yaxis && barOptions.yaxis.show)) && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Opposite</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].opposite : false}
                            onChange={handleYaxisOppositeChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Reversed</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].reversed : false}
                            onChange={handleYaxisReverseChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Title</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleYaxisTitleAngleChange(event.target.value, 'text')}
                            value={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].title.text : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Title Color</span>
                        <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].title.style.color : 'black' }}
                            onClick={() => { setColorModal2(true); }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Title Left Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Title Left Offset"
                            value={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].title.offsetX : 0}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleYaxisTitleAngleChange(newValue, 'offsetX')}
                            step={1}
                            min={-100}
                            max={100}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Title Top Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Title Top Offset"
                            value={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].title.offsetY : 0}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleYaxisTitleAngleChange(newValue, 'offsetY')}
                            step={1}
                            min={-100}
                            max={100}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Axis Ticks</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].axisTicks.show : true}
                            onChange={handleYaxisTickChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Tick Amount</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Tick Amount"
                            value={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].tickAmount : 6}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleYAxisTickSliderChange(newValue)}
                            step={1}
                            min={2}
                            max={30}
                          />
                        </div>
                      </div>
                    </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Axis Border</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].axisBorder.show : false}
                          onChange={handleYaxisBorderChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <Dialog size="sm" open={colorModal2}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.yaxis && barOptions.yaxis.length ? barOptions.yaxis[0].title.style.color : 'black'} onChangeComplete={(colour) => handleYaxisTitleColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal2(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel5'} onChange={handleAccChange('panel5')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5-content"
                    id="panel5bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Axis Grid
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show X-axis Lines</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.grid.xaxis.lines.show}
                          onChange={(event) => handleGridLineChange(event, 'xaxis')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show Y-axis Lines</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.grid.yaxis.lines.show}
                          onChange={(event) => handleGridLineChange(event, 'yaxis')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Padding Top</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Padding Top"
                          value={barOptions.grid.padding.top}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleGridpaddingChange(newValue, 'top')}
                          step={1}
                          min={-50}
                          max={150}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Padding Right</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Padding Right"
                          value={barOptions.grid.padding.right}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleGridpaddingChange(newValue, 'right')}
                          step={1}
                          min={-50}
                          max={150}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Padding Bottom</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Padding Bottom"
                          value={barOptions.grid.padding.bottom}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleGridpaddingChange(newValue, 'bottom')}
                          step={1}
                          min={-50}
                          max={150}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Padding Left</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Padding left"
                          value={barOptions.grid.padding.left}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleGridpaddingChange(newValue, 'left')}
                          step={1}
                          min={-50}
                          max={150}
                        />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div>
                <Accordion expanded={expanded === 'panel6'} onChange={handleAccChange('panel6')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel6-content"
                    id="panel6bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Bar
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Stacked</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.chart.stacked}
                          onChange={(event) => handleBarStackChange(event)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Distributed</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.plotOptions.bar.distributed}
                          onChange={(event) => handleBarChange(event, 'distributed')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Hide Zero Value Bars</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.plotOptions.bar.hideZeroBarsWhenGrouped}
                          onChange={(event) => handleBarChange(event, 'hideZeroBarsWhenGrouped')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Border Radius</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Border Radius"
                          value={barOptions.plotOptions.bar ? barOptions.plotOptions.bar.borderRadius : 0}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleBarWidthChange(newValue, 'borderRadius')}
                          step={1}
                          min={0}
                          max={50}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Column Width</span>
                      <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                        <Slider
                          aria-label="Column Width"
                          value={parseInt(barOptions.plotOptions.bar.columnWidth ? barOptions.plotOptions.bar.columnWidth.replace('%', '') : 0)}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) => handleBarWidthChange(newValue, 'columnWidth')}
                          step={1}
                          min={0}
                          max={150}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Border Radius Application</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <ToggleButtonGroup
                          formats={['around', 'end']}
                          color="primary"
                          size="small"
                          value={barOptions.plotOptions.bar ? barOptions.plotOptions.bar.borderRadiusApplication : 'around'}
                          exclusive
                          onChange={handleBarRadiusPosPosChange}
                          aria-label="text formatting"
                        >
                          <ToggleButton value="around" aria-label="Around">
                            Around
                          </ToggleButton>
                          <ToggleButton value="end" aria-label="End">
                            End
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel7'} onChange={handleAccChange('panel7')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel7-content"
                    id="panel7bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Data Labels
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="alarms-school-scroll thin-scrollbar">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.dataLabels.enabled}
                          onChange={(event) => handleBarDataLabelChange(event)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    {barOptions.dataLabels.enabled && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }} className="mb-2">
                        <span>Position</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ToggleButtonGroup
                            formats={['top', 'center', 'bottom']}
                            color="primary"
                            size="small"
                            value={barOptions.plotOptions.bar.dataLabels && barOptions.plotOptions.bar.dataLabels.position ? barOptions.plotOptions.bar.dataLabels.position : 'top'}
                            exclusive
                            onChange={(event, newvalue) => handleBarDatalabelPosChange(newvalue, 'position')}
                            aria-label="text formatting"
                          >
                            <ToggleButton value="top" aria-label="Top">
                              Top
                            </ToggleButton>
                            <ToggleButton value="center" aria-label="Center">
                              Center
                            </ToggleButton>
                            <ToggleButton value="bottom" aria-label="Bottom">
                              Bottom
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Orientation</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ToggleButtonGroup
                            formats={['horizontal', 'vertical']}
                            color="primary"
                            size="small"
                            value={barOptions.plotOptions.bar && barOptions.plotOptions.bar.dataLabels && barOptions.plotOptions.bar.dataLabels.orientation ? barOptions.plotOptions.bar.dataLabels.orientation : 'horizontal'}
                            exclusive
                            onChange={(event, newvalue) => handleBarDatalabelPosChange(newvalue, 'orientation')}
                            aria-label="text formatting"
                          >
                            <ToggleButton value="horizontal" aria-label="Horizontal">
                              Horizontal
                            </ToggleButton>
                            <ToggleButton value="vertical" aria-label="Vertical">
                              Vertical
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Left Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Left Offset"
                            value={barOptions.dataLabels.offsetX}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleDataLabelOffsetChange(newValue, 'offsetX')}
                            step={1}
                            min={-20}
                            max={20}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Top Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Top Offset"
                            value={barOptions.dataLabels.offsetY}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleDataLabelOffsetChange(newValue, 'offsetY')}
                            step={1}
                            min={-20}
                            max={20}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Color</span>
                        <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: barOptions.dataLabels.style && barOptions.dataLabels.style.colors.length ? barOptions.dataLabels.style.colors[0] : '#fff' }}
                            onClick={() => { setColorModal3(true); }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Background</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.dataLabels.background.enabled}
                            onChange={(event) => handleBarDataLabelBgChange(event)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      {barOptions.dataLabels.background.enabled && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Fore Color</span>
                          <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                            <FiberManualRecordIcon
                              fontSize="large"
                              className="border-round-circle"
                              sx={{ color: barOptions.dataLabels.background.foreColor }}
                              onClick={() => { setColorModal4(true); }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Border Color</span>
                          <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                            <FiberManualRecordIcon
                              fontSize="large"
                              className="border-round-circle"
                              sx={{ color: barOptions.dataLabels.background.borderColor }}
                              onClick={() => { setColorModal5(true); }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Border Radius</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Border Radius"
                              value={barOptions.dataLabels.background.borderRadius}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelBgOffsetChange(newValue, 'borderRadius')}
                              step={1}
                              min={0}
                              max={20}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Border Width</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Border Width"
                              value={barOptions.dataLabels.background.borderWidth}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelBgOffsetChange(newValue, 'borderWidth')}
                              step={1}
                              min={0}
                              max={20}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Background Opacity</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Background Opacity"
                              value={barOptions.dataLabels.background.opacity}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelBgOffsetChange(newValue, 'opacity')}
                              step={0.1}
                              min={0}
                              max={1}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Background Padding</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Background Padding"
                              value={barOptions.dataLabels.background.padding}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelBgOffsetChange(newValue, 'padding')}
                              step={1}
                              min={0}
                              max={20}
                            />
                          </div>
                        </div>
                      </>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Drop Shadow</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.dataLabels.dropShadow.enabled}
                            onChange={(event) => handleBarDataLabelDsChange(event)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      {barOptions.dataLabels.dropShadow.enabled && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Blur</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Blur"
                              value={barOptions.dataLabels.dropShadow.blur}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelDsOffsetChange(newValue, 'blur')}
                              step={1}
                              min={0}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Offset X</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Offset X"
                              value={barOptions.dataLabels.dropShadow.left}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelDsOffsetChange(newValue, 'left')}
                              step={1}
                              min={-30}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Offset Y</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Offset Y"
                              value={barOptions.dataLabels.dropShadow.top}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelDsOffsetChange(newValue, 'top')}
                              step={1}
                              min={-30}
                              max={30}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Shadow Opacity</span>
                          <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                            <Slider
                              aria-label="Shadow Opacity"
                              value={barOptions.dataLabels.dropShadow.opacity}
                              valueLabelDisplay="auto"
                              onChange={(event, newValue) => handleDataLabelDsOffsetChange(newValue, 'opacity')}
                              step={0.05}
                              min={0}
                              max={1}
                            />
                          </div>
                        </div>
                      </>
                      )}
                    </>
                    )}
                    <Dialog size="sm" open={colorModal3}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker
                            color={barOptions.dataLabels.style && barOptions.dataLabels.style.colors.length ? barOptions.dataLabels.style.colors[0] : '#fff'}
                            onChangeComplete={(colour) => handleDataLabelColorChange(colour)}
                          />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal3(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                    <Dialog size="sm" open={colorModal4}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.dataLabels.background.foreColor} onChangeComplete={(colour) => handleDataLabelBgForeColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal4(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                    <Dialog size="sm" open={colorModal5}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.dataLabels.background.borderColor} onChangeComplete={(colour) => handleDataLabelBgBorderColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal5(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                    <Dialog size="sm" open={colorModal6}>
                      <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <SketchPicker color={barOptions.dataLabels.dropShadow.color} onChangeComplete={(colour) => handleYaxisTitleColorChange(colour)} />
                          <hr />
                          <div className="float-right">
                            <Button
                              onClick={() => { setColorModal6(false); }}
                              variant="contained"
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                  </AccordionDetails>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div>
                <Accordion expanded={expanded === 'panel8'} onChange={handleAccChange('panel8')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel8-content"
                    id="panel8bh-header"
                  >
                    <Typography className="font-family-tab" sx={{ width: '33%', flexShrink: 0, fontWeight: '700' }}>
                      Options
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Show</span>
                      <div style={{ marginLeft: 'auto' }}>
                        <Switch
                          checked={barOptions.legend.show}
                          onChange={(event) => handleLegendChange(event, 'show')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                    </div>
                    {barOptions.legend.show && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Floating</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <Switch
                            checked={barOptions.legend.floating}
                            onChange={(event) => handleLegendChange(event, 'floating')}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }} className="mb-2">
                        <span>Position</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ToggleButtonGroup
                            formats={['top', 'bottom', 'left', 'right']}
                            color="primary"
                            size="small"
                            value={barOptions.legend.position}
                            exclusive
                            onChange={(evt, newVal) => handleLegendPosChange(newVal, 'position')}
                            aria-label="text formatting"
                          >
                            <ToggleButton value="top" aria-label="Top">
                              Top
                            </ToggleButton>
                            <ToggleButton value="bottom" aria-label="Bottom">
                              Bottom
                            </ToggleButton>
                            <ToggleButton value="left" aria-label="Left">
                              Left
                            </ToggleButton>
                            <ToggleButton value="right" aria-label="Right">
                              Right
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      {(barOptions.legend.position === 'top' || barOptions.legend.position === 'bottom') && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Alignment</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ToggleButtonGroup
                            formats={['left', 'center', 'right']}
                            color="primary"
                            size="small"
                            value={barOptions.legend.horizontalAlign}
                            exclusive
                            onChange={(evt, newVal) => handleLegendPosChange(newVal, 'horizontalAlign')}
                            aria-label="text formatting"
                          >
                            <ToggleButton value="left" aria-label="Left">
                              Left
                            </ToggleButton>
                            <ToggleButton value="center" aria-label="Center">
                              Center
                            </ToggleButton>
                            <ToggleButton value="right" aria-label="Right">
                              Right
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Left Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Left Offset"
                            value={barOptions.legend.offsetX}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleLegendPosChange(newValue, 'offsetX')}
                            step={1}
                            min={-100}
                            max={100}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Right Offset</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Right Offset"
                            value={barOptions.legend.offsetY}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleLegendPosChange(newValue, 'offsetY')}
                            step={1}
                            min={-100}
                            max={100}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Horizontal Spacing</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Horizontal Spacing"
                            value={barOptions.legend.itemMargin.horizontal}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleLegendSpaceChange(newValue, 'horizontal')}
                            step={1}
                            min={0}
                            max={50}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Vertical Spacing</span>
                        <div style={{ marginLeft: 'auto', minWidth: '200px' }}>
                          <Slider
                            aria-label="Vertical Spacing"
                            value={barOptions.legend.itemMargin.vertical}
                            valueLabelDisplay="auto"
                            onChange={(event, newValue) => handleLegendSpaceChange(newValue, 'vertical')}
                            step={1}
                            min={0}
                            max={50}
                          />
                        </div>
                      </div>
                    </>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
              Item Six
            </TabPanel>
            <div
              style={{
                width: '62%',
                borderRadius: '10px',
                boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
              }}
              className="p-2"
            >
              <Chart
                type={getChartName(chartData.ks_dashboard_item_type)}
                id="bar-chartzz"
                height="85%"
                series={datasets}
                options={barOptions}
              />
            </div>
          </>
        )}
        {((updateLayoutInfo && updateLayoutInfo.loading) || iotLoading) && (
        <div className="margin-top-250px text-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Loader />
        </div>
        )}
      </Box>
      <div className="cancel-apply-box">
        {savedOptions && (
        <Fab disabled={(updateLayoutInfo && updateLayoutInfo.loading) || iotLoading} variant="extended" size="medium" onClick={() => onResetBar()} color="default" sx={{ mr: 2 }}>
          <ReplayIcon sx={{ mr: 1 }} />
          Reset to Default
        </Fab>
        )}
        <Fab disabled={(updateLayoutInfo && updateLayoutInfo.loading) || iotLoading} variant="extended" size="medium" onClick={() => onReset()} color="default" sx={{ mr: 2 }}>
          <ReplayIcon sx={{ mr: 1 }} />
          Reset
        </Fab>
        <Fab disabled={updateLayoutInfo && updateLayoutInfo.loading} variant="extended" size="medium" onClick={() => onUpdate()} color="primary">
          {(updateLayoutInfo && updateLayoutInfo.loading) || iotLoading ? <span /> : <CheckIcon sx={{ mr: 1 }} /> }
          {(updateLayoutInfo && updateLayoutInfo.loading) || iotLoading ? 'Updating...' : 'Update' }
        </Fab>
      </div>
    </>
  );
});

export default Configuration;
