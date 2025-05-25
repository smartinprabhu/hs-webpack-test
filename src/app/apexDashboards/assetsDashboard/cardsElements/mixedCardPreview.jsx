/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowDownSharp, IoArrowUpSharp } from 'react-icons/io5';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';
import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import { SketchPicker } from 'react-color';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Loader from '@shared/loading';

import {
  getColorCode,
  convertPXToVW,
  getLabelData,
  getLabData,
} from '../../utils/utils';
import {
  isJsonString,
  getJsonString,
} from '../../../util/appUtils';
import {
  newpercalculatePrev,
} from '../../../util/staticFunctions';
import customData from '../../data/customData.json';
import {
  updateDashboardLayouts,
  getNinjaDashboard,
} from '../../../analytics/analytics.service';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const MixedCardPreview = React.memo(({
  chartData, isIot, dashboardCode, dashboardUuid, selectedDateTag, chartValues, height, width, divHeight,
}) => {
  const detailDataDefault = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info)) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description))));

  const detailDataDefault1 = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info)) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description))));

  const detailDataDefault2 = detailDataDefault1 ? JSON.stringify(detailDataDefault1) : false;

  const [detailData, setDetailData] = React.useState(detailDataDefault || {});

  const [expanded, setExpanded] = React.useState(false);

  const [colorModal1, setColorModal1] = React.useState(false);

  const [colorModal2, setColorModal2] = React.useState(false);

  const [colorModal3, setColorModal3] = React.useState(false);

  const [colorModal4, setColorModal4] = React.useState(false);
  const [colorModal5, setColorModal5] = React.useState(false);

  const [colorModal6, setColorModal6] = React.useState(false);
  const [colorModal7, setColorModal7] = React.useState(false);

  const [isUpdate, setIsUpdate] = React.useState(false);

  const dispatch = useDispatch();

  const { ninjaDashboardCode, updateLayoutInfo } = useSelector(
    (state) => state.analytics,
  );

  const { userInfo } = useSelector((state) => state.user);

  const userCompany = userInfo.data
  && userInfo.data.company ? userInfo.data.company : false;

  const onReset = () => {
    const newData = detailDataDefault2 ? JSON.parse(detailDataDefault2) : {};
    setDetailData(newData);
    const sparkType = {
      chart: {
        type: newData && newData.sparkline && newData && newData.sparkline.type ? newData.sparkline.type : 'area',
        sparkline: {
          enabled: true,
        },
      },
    };
    ApexCharts.exec('spark-chart', 'updateOptions', sparkType, false, true);
  };

  React.useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && isUpdate) {
      const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;
      const id = ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length
        ? ninjaDashboardCode.data[0].id
        : ' ';
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: selectedDateTag,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      if (isIot) {
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            id,
            context,
            'IOT',
            dashboardCode,
            dashboardUuid,
            userCompany,
          ),
        );
      } else {
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            id,
            context,
          ),
        );
      }
    }
  }, [isUpdate, updateLayoutInfo]);

  const handleAccChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function getDatasetData(label) {
    let res = [];
    if (label && chartValues && chartValues.datasets && chartValues.datasets.length > 1) {
      const arr = chartValues.datasets.filter((item) => item.label === label);
      if (arr && arr.length) {
        res = arr[0].data;
      }
    } else if (chartValues && chartValues.datasets && chartValues.datasets.length === 1) {
      const arr = chartValues.datasets;
      if (arr && arr.length) {
        res = arr[0].data;
      }
    }
    return res;
  }

  function getDatasetLabel() {
    let res = [];
    if (chartValues && chartValues.datasets && chartValues.datasets.length === 1) {
      const arr = chartValues.datasets;
      if (arr && arr.length) {
        res = arr[0].label;
      }
    }
    return res;
  }

  function parseExp(str) {
    try {
      const func = new Function('str', `'use strict'; return (${str})`);
      return func(str);
    } catch (e) {
      return false;
    }
  }

  function getTypeOfDataValue(label, type) {
    let res = 0;
    if (label && type) {
      const data = getDatasetData(label);
      if (data && data.length) {
        if (type === 'first') {
          res = data[0];
        } else if (type === 'last') {
          res = data[data.length - 1];
        } else if (type === 'min') {
          res = Math.min(...data);
        } else if (type === 'max') {
          res = Math.max(...data);
        } else if (type === 'avg') {
          const dataSum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          res = dataSum / data.length;
        } else if (type === 'sum') {
          res = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        } else if (type === 'expression') {
          const exp = detailData && detailData.primary_value && detailData.primary_value.expression ? detailData.primary_value.expression : '';
          const sv1 = detailData && detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : '';
          const sv2 = detailData && detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : '';
          if (exp) {
            const res1 = exp.replaceAll('pv.first', getTypeOfDataValue(label, 'first'));
            const res2 = res1.replaceAll('pv.last', getTypeOfDataValue(label, 'last'));
            const res3 = res2.replaceAll('pv.min', getTypeOfDataValue(label, 'min'));
            const res4 = res3.replaceAll('pv.max', getTypeOfDataValue(label, 'max'));
            const res5 = res4.replaceAll('pv.avg', getTypeOfDataValue(label, 'avg'));
            const res6 = res5.replaceAll('pv.sum', getTypeOfDataValue(label, 'sum'));

            const res11 = res6.replaceAll('sv1.first', getTypeOfDataValue(sv1, 'first'));
            const res22 = res11.replaceAll('sv1.last', getTypeOfDataValue(sv1, 'last'));
            const res33 = res22.replaceAll('sv1.min', getTypeOfDataValue(sv1, 'min'));
            const res44 = res33.replaceAll('sv1.max', getTypeOfDataValue(sv1, 'max'));
            const res55 = res44.replaceAll('sv1.avg', getTypeOfDataValue(sv1, 'avg'));
            const res66 = res55.replaceAll('sv1.sum', getTypeOfDataValue(sv1, 'sum'));

            const res111 = res66.replaceAll('sv2.first', getTypeOfDataValue(sv2, 'first'));
            const res222 = res111.replaceAll('sv2.last', getTypeOfDataValue(sv2, 'last'));
            const res333 = res222.replaceAll('sv2.min', getTypeOfDataValue(sv2, 'min'));
            const res444 = res333.replaceAll('sv2.max', getTypeOfDataValue(sv2, 'max'));
            const res555 = res444.replaceAll('sv2.avg', getTypeOfDataValue(sv2, 'avg'));
            const res666 = res555.replaceAll('sv2.sum', getTypeOfDataValue(sv2, 'sum'));

            const formula = parseExp(res666);

            res = !isNaN(formula) && isFinite(formula) ? formula : 0;
          } else {
            res = 0;
          }
        }
      }
    }
    return res;
  }

  const formatCurrency = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    const formattedNumber1 = number ? parseFloat(number).toFixed(2) : 0;

    const formattedNumber = formattedNumber1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  const formatDecimal = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    const formattedNumber = parseFloat(number).toFixed(2);

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  const formatNumeric = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    const formattedNumber = parseInt(number);

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  function getDataValue(label, type, format, prefix = '', suffix = '') {
    let res = 0;
    if (label && type) {
      const val = getTypeOfDataValue(label, type);
      console.log(val);
      if (format === 'decimal2f') {
        res = formatDecimal(val, prefix, suffix);
      } else if (format === 'numeric') {
        res = formatNumeric(val, prefix, suffix);
      } else if (format === 'monetary') {
        res = formatCurrency(val, prefix, suffix);
      }
    }
    return res;
  }

  function getPercentageKpi() {
    let res = '0 %';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      const result = newpercalculatePrev(pv, cv);
      res = `${result} %`;
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      const result = newpercalculatePrev(sv1, sv2);
      res = `${result} %`;
    }
    return res;
  }

  function getStatusColor(currentValue, prevValue, direction) {
    let res = '';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      if (direction && direction === 'high_is_good') {
        if (cv > pv) {
          res = 'text-success';
        } else {
          res = 'text-danger';
        }
      } else if (direction && direction === 'low_is_good') {
        if (cv > pv) {
          res = 'text-danger';
        } else {
          res = 'text-success';
        }
      } else if (cv > pv) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      if (direction && direction === 'high_is_good') {
        if (currentValue > prevValue) {
          res = 'text-success';
        } else {
          res = 'text-danger';
        }
      } else if (direction && direction === 'low_is_good') {
        if (currentValue > prevValue) {
          res = 'text-danger';
        } else {
          res = 'text-success';
        }
      } else if (currentValue > prevValue) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    }
    return res;
  }

  function getStatusKpi(currentValue, prevValue) {
    let res = 'up';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      if (cv > pv) {
        res = 'up';
      } else {
        res = 'down';
      }
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      if (currentValue > prevValue) {
        res = 'up';
      } else {
        res = 'down';
      }
    }
    return res;
  }

  const options = {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    theme: {
      palette: detailData && detailData.sparkline && detailData.sparkline.palette ? detailData.sparkline.palette : 'palette1',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => getLabelData(val),
        title: {
          formatter(seriesName) {
            return seriesName;
          },
        },
      },
    },
    xaxis: {
      categories: chartValues && chartValues.labels ? chartValues.labels : [],
      datetimeUTC: false,
    },
  };

  console.log(divHeight);

  const onUpdate = () => {
    const newOptions = { ...detailData };
    newOptions.mixed_chart_enabled = 'true';
    setIsUpdate(true);
    let postData = {
      ks_description: JSON.stringify(newOptions),
    };
    if (isIot) {
      postData = {
        ks_info: JSON.stringify(newOptions),
      };
    }
    if (!isIot) {
      dispatch(updateDashboardLayouts(chartData.id, appModels.NINJABOARDITEM, postData));
    } else {
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
    }
  };

  const onResetBar = () => {
    let postData = {
      ks_description: '',
    };
    setIsUpdate(true);
    if (isIot) {
      postData = {
        ks_info: '',
      };
    }
    if (!isIot) {
      dispatch(updateDashboardLayouts(chartData.id, appModels.NINJABOARDITEM, postData));
    } else {
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
    }
  };

  const reWidth = detailDataDefault && width < 350 ? width : 350;
  const reHeight = detailDataDefault && divHeight < 350 ? divHeight : 200;

  const sparkHeight = (reHeight * 50) / 100;// divHeight > 250 && Math.abs(divHeight - 250) > 35 ? Math.abs(divHeight - 250) : Math.abs(divHeight - 130);

  const types = customData.mixedChartOptions;

  const handleTypeChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.widget = event.target.value;
    setDetailData(optionAssign);
  };

  const handleDataTypeChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.primary_value && (detailData.primary_value.show_value || !detailData.primary_value.show_value)) {
      optionAssign.primary_value.show_value = event.target.value;
    } else if (detailData && !detailData.primary_value) {
      optionAssign.primary_value = {
        show_value: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleDataSourceChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.primary_value && detailData.primary_value.source_data) {
      optionAssign.primary_value.source_data = event.target.value;
    } else if (detailData && !detailData.primary_value) {
      optionAssign.primary_value = {
        source_data: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleDataFormatChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.value_format = event.target.value;
    setDetailData(optionAssign);
  };

  const handleDataCompare1Change = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.kpi_field1 = event.target.value;
    setDetailData(optionAssign);
  };

  const handleDataCompare2Change = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.kpi_field2 = event.target.value;
    setDetailData(optionAssign);
  };

  const handlePrimaryTextChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.pv_text = value;
    setDetailData(optionAssign);
  };

  const handlePrimaryExpChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.expression = value;
    setDetailData(optionAssign);
  };

  const handlePrimaryPrefixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.prefix = value;
    setDetailData(optionAssign);
  };

  const handlePrimaryPosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.text_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handlePrimaryValuePosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.value_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handleSec1PosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.text_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handleSec1ValuePosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.value_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handleSec2PosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.text_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handleSec2ValuePosChange = (event, newAlignment) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.value_position = newAlignment;
    setDetailData(optionAssign);
  };

  const handlePrimarySuffixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.suffix = value;
    setDetailData(optionAssign);
  };

  const handleSec1DataTypeChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.secondary_value1 && detailData.secondary_value1 && (detailData.secondary_value1.show_value || !detailData.secondary_value1.show_value)) {
      optionAssign.secondary_value1.show_value = event.target.value;
    } else if (detailData && !detailData.secondary_value1) {
      optionAssign.secondary_value1 = {
        show_value: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleSec1DataSourceChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.secondary_value1 && detailData.secondary_value1 && detailData.secondary_value1.source_data) {
      optionAssign.secondary_value1.source_data = event.target.value;
    } else if (detailData && !detailData.secondary_value1) {
      optionAssign.secondary_value1 = {
        source_data: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleSec1DataFormatChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.value_format = event.target.value;
    setDetailData(optionAssign);
  };

  const handleSec1TextChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.sv1_text = value;
    setDetailData(optionAssign);
  };

  const handleSec1PrefixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.prefix = value;
    setDetailData(optionAssign);
  };

  const handleSec1SuffixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.suffix = value;
    setDetailData(optionAssign);
  };

  const handleSec2DataTypeChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.secondary_value2 && detailData.secondary_value2 && (detailData.secondary_value2.show_value || !detailData.secondary_value2.show_value)) {
      optionAssign.secondary_value2.show_value = event.target.value;
    } else if (detailData && !detailData.secondary_value2) {
      optionAssign.secondary_value2 = {
        show_value: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleSec2DataSourceChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.secondary_value2 && detailData.secondary_value2 && detailData.secondary_value2.source_data) {
      optionAssign.secondary_value2.source_data = event.target.value;
    } else if (detailData && !detailData.secondary_value2) {
      optionAssign.secondary_value2 = {
        source_data: event.target.value,
      };
    }
    setDetailData(optionAssign);
  };

  const handleSec2DataFormatChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.value_format = event.target.value;
    setDetailData(optionAssign);
  };

  const handleSec2TextChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.sv2_text = value;
    setDetailData(optionAssign);
  };

  const handleSec2PrefixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.prefix = value;
    setDetailData(optionAssign);
  };

  const handleSec2SuffixChange = (value) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.suffix = value;
    setDetailData(optionAssign);
  };

  const handleKpiShowChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.kpi_show = event.target.checked ? 'true' : 'false';
    setDetailData(optionAssign);
  };

  const handleKpiDirectionChange = (event) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.kpi_direction = event.target.value;
    setDetailData(optionAssign);
  };

  const handleSparkTypeChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.sparkline && (detailData.sparkline.type || !detailData.sparkline.type)) {
      optionAssign.sparkline.type = event.target.value;
    } else if (detailData && !detailData.sparkline) {
      optionAssign.sparkline = {
        type: event.target.value,
      };
    }
    const sparkType = {
      chart: {
        type: event.target.value,
        sparkline: {
          enabled: true,
        },
      },
    };
    ApexCharts.exec('spark-chart', 'updateOptions', sparkType, false, true);
    setDetailData(optionAssign);
  };

  const handleSparkPallateChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.sparkline && (detailData.sparkline.palette || !detailData.sparkline.palette)) {
      optionAssign.sparkline.palette = event.target.value;
    } else if (detailData && !detailData.sparkline) {
      optionAssign.sparkline = {
        palette: event.target.value,
      };
    }
    const sparkType = {
      chart: {
        type: detailData && detailData.sparkline && detailData.sparkline.type ? detailData.sparkline.type : 'area',
        sparkline: {
          enabled: true,
        },
      },
      theme: {
        palette: event.target.value,
      },
      colors: undefined,
    };
    ApexCharts.exec('spark-chart', 'updateOptions', sparkType, false, true);
    setDetailData(optionAssign);
    console.log(sparkType);
  };

  console.log(detailData);

  const handleSparkSourceChange = (event) => {
    const optionAssign = { ...detailData };
    if (detailData && detailData.sparkline && detailData.sparkline.source_data) {
      optionAssign.sparkline.source_data = event.target.value;
    } else if (detailData && !detailData.sparkline) {
      optionAssign.sparkline = {
        source_data: event.target.value,
      };
    }
    const sparkType = {
      chart: {
        type: detailData && detailData.sparkline && detailData && detailData.sparkline.type ? detailData.sparkline.type : 'area',
        sparkline: {
          enabled: true,
        },
      },
    };
    ApexCharts.exec('spark-chart', 'updateOptions', sparkType, false, true);
    setDetailData(optionAssign);
  };

  const handleBgColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.background_color = e.hex;
    setDetailData(optionAssign);
  };

  const handlePrimaryColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.text_color = e.hex;
    setDetailData(optionAssign);
  };

  const handlePrimaryValueColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.primary_value.value_color = e.hex;
    setDetailData(optionAssign);
  };

  const handleSec1ColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.text_color = e.hex;
    setDetailData(optionAssign);
  };

  const handleSec1ValueColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value1.value_color = e.hex;
    setDetailData(optionAssign);
  };

  const handleSec2ColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.text_color = e.hex;
    setDetailData(optionAssign);
  };

  const handleSec2ValueColorChange = (e) => {
    const optionAssign = { ...detailData };
    optionAssign.secondary_value2.value_color = e.hex;
    setDetailData(optionAssign);
  };

  console.log(detailData);

  const dataTypes = customData.mixedChartValueTypeOptions.filter((item) => item.label !== 'Expression');

  let compareOptions1 = customData.compareOptions;
  let compareOptions2 = customData.compareOptions;

  if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2) {
    compareOptions1 = customData.compareOptions.filter((item) => item.value !== detailData.primary_value.kpi_field2);
  }

  if (detailData && detailData.primary_value && detailData.primary_value.kpi_field1) {
    compareOptions2 = customData.compareOptions.filter((item) => item.value !== detailData.primary_value.kpi_field1);
  }

  function getChartTooltip() {
    let label = 'Count';
    if (detailData && detailData.sparkline && detailData.sparkline.type) {
      label = getDatasetLabel();
    }
    return label;
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
        {updateLayoutInfo && !updateLayoutInfo.loading && (
          <>
            <div
              style={{ width: '40%' }}
            >
              <Box sx={{ p: 3 }}>
                <Typography className="font-family-tab" sx={{ fontSize: '14px', fontWeight: '400' }}>
                  <div>
                    <div className="mb-1">
                      <p className="mb-0 font-weight-700">Type</p>
                      <div className="margin-left-auto">
                        <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, width: '100%' }} size="small">
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={detailData && detailData.widget ? detailData.widget : ''}
                            onChange={handleTypeChange}
                            label=""
                          >
                            {types.map((pl) => (
                              <MenuItem value={pl.value}>
                                {pl.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="content-flex-center mb-3">
                      <span>Background Color</span>
                      <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                        <FiberManualRecordIcon
                          fontSize="large"
                          className="border-round-circle"
                          sx={{ color: detailData.background_color ? detailData.background_color : '#ffff' }}
                          onClick={() => { setColorModal1(true); }}
                        />
                      </div>
                    </div>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccChange('panel1')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1bh-header"
                      >
                        <Typography className="font-family-tab" sx={{ width: '40%', flexShrink: 0, fontWeight: '700' }}>
                          Primary
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {chartValues && chartValues.datasets && chartValues.datasets.length > 1 && (
                        <div className="content-flex-center">
                          <span>Select Data of Source</span>
                          <div className="margin-left-auto">
                            <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={detailData && detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : ''}
                                onChange={handleDataSourceChange}
                                label=""
                              >
                                {chartValues.datasets.map((pl) => (
                                  <MenuItem value={pl.label}>
                                    {pl.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        )}
                        {((detailData && detailData.primary_value && detailData.primary_value.source_data && chartValues && chartValues.datasets && chartValues.datasets.length > 1) || (chartValues && chartValues.datasets && chartValues.datasets.length === 1)) && (
                        <div className="content-flex-center">
                          <span>Value Type</span>
                          <div className="margin-left-auto">
                            <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={detailData && detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : ''}
                                onChange={handleDataTypeChange}
                                label=""
                              >
                                {customData.mixedChartValueTypeOptions.map((pl) => (
                                  <MenuItem value={pl.value}>
                                    {pl.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        )}
                        {detailData && detailData.primary_value && detailData.primary_value.show_value && (
                        <>
                          {detailData.primary_value.show_value === 'expression' && (
                          <div className="content-flex-center">
                            <span>Expression</span>
                            <div className="margin-left-auto">
                              <TextField
                                size="small"
                                onChange={(event) => handlePrimaryExpChange(event.target.value)}
                                value={detailData && detailData.primary_value && detailData.primary_value.expression ? detailData.primary_value.expression : ''}
                                id="standard-basic"
                                label=""
                                variant="standard"
                                helperText="Value Types: first, last, max, min, sum, avg (example: (pv.last + sv1.min + sv2.max))"
                              />
                            </div>
                          </div>
                          )}
                          <div className="content-flex-center">
                            <span>Value Format</span>
                            <div className="margin-left-auto">
                              <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={detailData && detailData.primary_value && detailData.primary_value.value_format ? detailData.primary_value.value_format : ''}
                                  onChange={handleDataFormatChange}
                                  label=""
                                >
                                  {customData.mixedChartValueFormatOptions.map((pl) => (
                                    <MenuItem value={pl.value}>
                                      {pl.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Text</span>
                            <div style={{ marginLeft: 'auto' }}>
                              <TextField
                                size="small"
                                onChange={(event) => handlePrimaryTextChange(event.target.value)}
                                value={detailData && detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                                id="standard-basic"
                                label=""
                                variant="standard"
                              />
                            </div>
                          </div>
                          <div className="content-flex-center mb-3 mt-2">
                            <span>Text Color</span>
                            <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                              <FiberManualRecordIcon
                                fontSize="large"
                                className="border-round-circle"
                                sx={{ color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black' }}
                                onClick={() => { setColorModal2(true); }}
                              />
                            </div>
                          </div>
                          <div className="content-flex-center mb-3">
                            <span>Text Alignment</span>
                            <div className="margin-left-auto">
                              <ToggleButtonGroup
                                formats={['left', 'center', 'right']}
                                color="primary"
                                size="small"
                                value={detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center'}
                                exclusive
                                onChange={handlePrimaryPosChange}
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
                          <div className="content-flex-center mb-3">
                            <span>Value Color</span>
                            <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                              <FiberManualRecordIcon
                                fontSize="large"
                                className="border-round-circle"
                                sx={{ color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black' }}
                                onClick={() => { setColorModal3(true); }}
                              />
                            </div>
                          </div>
                          <div className="content-flex-center mb-3">
                            <span>Value Alignment</span>
                            <div className="margin-left-auto">
                              <ToggleButtonGroup
                                formats={['left', 'center', 'right']}
                                color="primary"
                                size="small"
                                value={detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center'}
                                exclusive
                                onChange={handlePrimaryValuePosChange}
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
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Prefix</span>
                            <div style={{ marginLeft: 'auto' }}>
                              <TextField
                                size="small"
                                onChange={(event) => handlePrimaryPrefixChange(event.target.value)}
                                value={detailData && detailData.primary_value && detailData.primary_value.prefix ? detailData.primary_value.prefix : ''}
                                id="standard-basic"
                                label=""
                                variant="standard"
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Suffix</span>
                            <div style={{ marginLeft: 'auto' }}>
                              <TextField
                                size="small"
                                onChange={(event) => handlePrimarySuffixChange(event.target.value)}
                                value={detailData && detailData.primary_value && detailData.primary_value.suffix ? detailData.primary_value.suffix : ''}
                                id="standard-basic"
                                label=""
                                variant="standard"
                              />
                            </div>
                          </div>
                        </>
                        )}
                        {detailData && detailData.widget
              && (detailData.widget !== 'single_card_numeric' && detailData.widget !== 'single_card_numeric_with_one_secondary' && detailData.widget !== 'single_card_numeric_with_two_secondary') && (
                <>
                  <div className="content-flex-center">
                    <span>Show KPI</span>
                    <div className="margin-left-auto">
                      <Switch
                        checked={!!(detailData && detailData.primary_value && detailData.primary_value && detailData.primary_value.kpi_show && detailData.primary_value.kpi_show === 'true')}
                        onChange={handleKpiShowChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </div>
                  </div>
                  {detailData && detailData.primary_value && detailData.primary_value && detailData.primary_value.kpi_show && detailData.primary_value.kpi_show === 'true' && (
                    <>
                      <div className="content-flex-center">
                        <span>KPI Direction</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.primary_value && detailData.primary_value.kpi_direction ? detailData.primary_value.kpi_direction : ''}
                              onChange={handleKpiDirectionChange}
                              label=""
                            >
                              {customData.mixedChartKpiDirectionOptions.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="content-flex-center">
                        <span>Compare Value 1</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.primary_value && detailData.primary_value.kpi_field1 ? detailData.primary_value.kpi_field1 : ''}
                              onChange={handleDataCompare1Change}
                              label=""
                            >
                              {compareOptions1.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="content-flex-center">
                        <span>Compare Value 2</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.primary_value && detailData.primary_value.kpi_field2 ? detailData.primary_value.kpi_field2 : ''}
                              onChange={handleDataCompare2Change}
                              label=""
                            >
                              {compareOptions2.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </>
                  )}
                </>
                        )}
                      </AccordionDetails>
                    </Accordion>
                    {detailData && detailData.widget
              && (detailData.widget !== 'single_card_numeric' && detailData.widget !== 'single_card_numeric_indicator' && detailData.widget !== 'single_card_numeric_indicator_with_sparkline') && (
              <Accordion expanded={expanded === 'panel2'} onChange={handleAccChange('panel2')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2bh-header"
                >
                  <Typography className="font-family-tab" sx={{ width: '40%', flexShrink: 0, fontWeight: '700' }}>
                    Secondary Value 1
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {chartValues && chartValues.datasets && chartValues.datasets.length > 1 && (
                  <div className="content-flex-center">
                    <span>Select Data of Source</span>
                    <div className="margin-left-auto">
                      <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={detailData && detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : ''}
                          onChange={handleSec1DataSourceChange}
                          label=""
                        >
                          {chartValues.datasets.map((pl) => (
                            <MenuItem value={pl.label}>
                              {pl.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  )}
                  {((detailData && detailData.secondary_value1 && detailData.secondary_value1.source_data && chartValues && chartValues.datasets && chartValues.datasets.length > 1) || (chartValues && chartValues.datasets && chartValues.datasets.length === 1)) && (
                    <div className="content-flex-center">
                      <span>Value Type</span>
                      <div className="margin-left-auto">
                        <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={detailData && detailData.secondary_value1 && detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''}
                            onChange={handleSec1DataTypeChange}
                            label=""
                          >
                            {dataTypes.map((pl) => (
                              <MenuItem value={pl.value}>
                                {pl.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  )}
                  {detailData && detailData.secondary_value1 && detailData.secondary_value1 && detailData.secondary_value1.show_value && (
                    <>
                      <div className="content-flex-center">
                        <span>Value Format</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.secondary_value1 && detailData.secondary_value1.value_format ? detailData.secondary_value1.value_format : ''}
                              onChange={handleSec1DataFormatChange}
                              label=""
                            >
                              {customData.mixedChartValueFormatOptions.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Text</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec1TextChange(event.target.value)}
                            value={detailData && detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3 mt-2">
                        <span>Text Color</span>
                        <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black' }}
                            onClick={() => { setColorModal4(true); }}
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3">
                        <span>Text Alignment</span>
                        <div className="margin-left-auto">
                          <ToggleButtonGroup
                            formats={['left', 'center', 'right']}
                            color="primary"
                            size="small"
                            value={detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center'}
                            exclusive
                            onChange={handleSec1PosChange}
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
                      <div className="content-flex-center mb-3">
                        <span>Value Color</span>
                        <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black' }}
                            onClick={() => { setColorModal5(true); }}
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3">
                        <span>Value Alignment</span>
                        <div className="margin-left-auto">
                          <ToggleButtonGroup
                            formats={['left', 'center', 'right']}
                            color="primary"
                            size="small"
                            value={detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center'}
                            exclusive
                            onChange={handleSec1ValuePosChange}
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Prefix</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec1PrefixChange(event.target.value)}
                            value={detailData && detailData.secondary_value1 && detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Suffix</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec1SuffixChange(event.target.value)}
                            value={detailData && detailData.secondary_value1 && detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
                    )}
                    {detailData && detailData.widget
              && (detailData.widget === 'single_card_numeric_with_two_secondary' || detailData.widget === 'single_card_numeric_indicator_with_two_secondary' || detailData.widget === 'single_card_numeric_with_two_secondary_indicator_with_sparkline') && (
              <Accordion expanded={expanded === 'panel3'} onChange={handleAccChange('panel3')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3bh-header"
                >
                  <Typography className="font-family-tab" sx={{ width: '40%', flexShrink: 0, fontWeight: '700' }}>
                    Secondary Value 2
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {chartValues && chartValues.datasets && chartValues.datasets.length > 1 && (
                  <div className="content-flex-center">
                    <span>Select Data of Source</span>
                    <div className="margin-left-auto">
                      <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={detailData && detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : ''}
                          onChange={handleSec2DataSourceChange}
                          label=""
                        >
                          {chartValues.datasets.map((pl) => (
                            <MenuItem value={pl.label}>
                              {pl.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  )}
                  {((detailData && detailData.secondary_value2 && detailData.secondary_value2.source_data && chartValues && chartValues.datasets && chartValues.datasets.length > 1) || (chartValues && chartValues.datasets && chartValues.datasets.length === 1)) && (
                  <div className="content-flex-center">
                    <span>Value Type</span>
                    <div className="margin-left-auto">
                      <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={detailData && detailData.secondary_value2 && detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''}
                          onChange={handleSec2DataTypeChange}
                          label=""
                        >
                          {dataTypes.map((pl) => (
                            <MenuItem value={pl.value}>
                              {pl.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  )}
                  {detailData && detailData.secondary_value2 && detailData.secondary_value2 && detailData.secondary_value2.show_value && (
                    <>
                      <div className="content-flex-center">
                        <span>Value Format</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.secondary_value2 && detailData.secondary_value2.value_format ? detailData.secondary_value2.value_format : ''}
                              onChange={handleSec2DataFormatChange}
                              label=""
                            >
                              {customData.mixedChartValueFormatOptions.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Text</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec2TextChange(event.target.value)}
                            value={detailData && detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3 mt-2">
                        <span>Text Color</span>
                        <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black' }}
                            onClick={() => { setColorModal6(true); }}
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3">
                        <span>Text Alignment</span>
                        <div className="margin-left-auto">
                          <ToggleButtonGroup
                            formats={['left', 'center', 'right']}
                            color="primary"
                            size="small"
                            value={detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center'}
                            exclusive
                            onChange={handleSec2PosChange}
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
                      <div className="content-flex-center mb-3">
                        <span>Value Color</span>
                        <div className="margin-left-auto" style={{ cursor: 'pointer' }}>
                          <FiberManualRecordIcon
                            fontSize="large"
                            className="border-round-circle"
                            sx={{ color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black' }}
                            onClick={() => { setColorModal7(true); }}
                          />
                        </div>
                      </div>
                      <div className="content-flex-center mb-3">
                        <span>Value Alignment</span>
                        <div className="margin-left-auto">
                          <ToggleButtonGroup
                            formats={['left', 'center', 'right']}
                            color="primary"
                            size="small"
                            value={detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center'}
                            exclusive
                            onChange={handleSec2ValuePosChange}
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Prefix</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec2PrefixChange(event.target.value)}
                            value={detailData && detailData.secondary_value2 && detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Suffix</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <TextField
                            size="small"
                            onChange={(event) => handleSec2SuffixChange(event.target.value)}
                            value={detailData && detailData.secondary_value2 && detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : ''}
                            id="standard-basic"
                            label=""
                            variant="standard"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
                    )}
                    {detailData && detailData.widget
              && (detailData.widget === 'single_card_numeric_indicator_with_sparkline' || detailData.widget === 'single_card_numeric_with_one_secondary_indicator_with_sparkline' || detailData.widget === 'single_card_numeric_with_two_secondary_indicator_with_sparkline') && (
              <Accordion expanded={expanded === 'panel4'} onChange={handleAccChange('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4-content"
                  id="panel4bh-header"
                >
                  <Typography className="font-family-tab" sx={{ width: '40%', flexShrink: 0, fontWeight: '700' }}>
                    Sparkline
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {chartValues && chartValues.datasets && chartValues.datasets.length > 1 && (
                  <div className="content-flex-center">
                    <span>Select Data of Source</span>
                    <div className="margin-left-auto">
                      <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={detailData && detailData.sparkline && detailData.sparkline.source_data ? detailData.sparkline.source_data : ''}
                          onChange={handleSparkSourceChange}
                          label=""
                        >
                          {chartValues.datasets.map((pl) => (
                            <MenuItem value={pl.label}>
                              {pl.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  )}
                  {((detailData && detailData.sparkline && detailData.sparkline.source_data && chartValues && chartValues.datasets && chartValues.datasets.length > 1) || (chartValues && chartValues.datasets && chartValues.datasets.length === 1)) && (
                    <>
                      <div className="content-flex-center">
                        <span>Spark Type</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.sparkline && detailData.sparkline.type ? detailData.sparkline.type : ''}
                              onChange={handleSparkTypeChange}
                              label=""
                            >
                              {customData.mixedChartSparkTypesOptions.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="content-flex-center">
                        <span>Colour Palette</span>
                        <div className="margin-left-auto">
                          <FormControl className="font-family-tab" variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={detailData && detailData.sparkline && detailData.sparkline.palette ? detailData.sparkline.palette : ''}
                              onChange={handleSparkPallateChange}
                              label=""
                            >
                              {customData.palleteOptions.map((pl) => (
                                <MenuItem value={pl.value}>
                                  {pl.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
                    )}
                  </div>
                </Typography>
              </Box>
              <Dialog size="sm" open={colorModal1}>
                <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <SketchPicker color={detailData.background_color ? detailData.background_color : '#ffff'} onChangeComplete={(colour) => handleBgColorChange(colour)} />
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
              <Dialog size="sm" open={colorModal2}>
                <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <SketchPicker color={detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black'} onChangeComplete={(colour) => handlePrimaryColorChange(colour)} />
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
              <Dialog size="sm" open={colorModal3}>
                <DialogHeader title="Color Picker" imagePath={false} response={{ loading: true }} />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <SketchPicker color={detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black'} onChangeComplete={(colour) => handlePrimaryValueColorChange(colour)} />
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
                    <SketchPicker color={detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black'} onChangeComplete={(colour) => handleSec1ColorChange(colour)} />
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
                    <SketchPicker color={detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black'} onChangeComplete={(colour) => handleSec1ValueColorChange(colour)} />
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
                    <SketchPicker color={detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black'} onChangeComplete={(colour) => handleSec2ColorChange(colour)} />
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
              <Dialog size="sm" open={colorModal7}>
                <DialogHeader title="Color Picker" response={{ loading: true }} imagePath={false} />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <SketchPicker color={detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black'} onChangeComplete={(colour) => handleSec2ValueColorChange(colour)} />
                    <hr />
                    <div className="float-right">
                      <Button
                        onClick={() => { setColorModal7(false); }}
                        variant="contained"
                      >
                        Ok
                      </Button>
                    </div>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </div>
            <div
              className="react-grid-item circle-graph-box cssTransforms react-resizable-hide react-resizable vertical-center-top-card"
              style={{
                width: `${reWidth}px`, height: `${reHeight}px`,
              }}
            >
              <Card className="ticket-card-mixed" style={{ background: detailData.background_color ? `${detailData.background_color} 0% 0% no-repeat padding-box` : '#ffff 0% 0% no-repeat padding-box' }}>
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric' && (
                <div
                  className="vertical-center text-center cursor-pointer"
                >
                  <h3
                    style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                    className=""
                  >
                    {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                  </h3>
                  <h5
                    style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                    className=""
                  >
                    {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                  </h5>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_one_secondary' && (
                <div style={{ display: 'flex' }}>
                  <div
                    className="text-center vertical-left-center cursor-pointer"
                  >
                    <h3
                      style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                    </h3>
                    <h5
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                    </h5>
                  </div>
                  <div
                    className="text-center vertical-right-center cursor-pointer"
                  >
                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                      }}
                      className="mb-3"
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                    </p>
                  </div>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_two_secondary' && (
                <div style={{ display: 'flex' }}>
                  <div
                    className="text-center vertical-left-center cursor-pointer"
                  >
                    <h3
                      style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                    </h3>
                    <h5
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                    </h5>
                  </div>
                  <div
                    className="text-center vertical-right-center cursor-pointer"
                  >
                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                      }}
                      className="mb-3"
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                    </p>

                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
                      }}
                      className=""
                    >
                      {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
                    </p>
                  </div>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator' && (
                <div
                  className="vertical-center text-center cursor-pointer"
                >

                  {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                  <p
                    style={{
                      fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                    }}
                    className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                  >
                    {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                    <IoArrowDownSharp />
                    )}
                    {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                    <IoArrowUpSharp />
                    )}
                    <span className="ml-2">{getPercentageKpi()}</span>
                  </p>
                  )}
                  <h3
                    style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                    className=""
                  >
                    {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                  </h3>
                  <h5
                    style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                    className=""
                  >
                    {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                  </h5>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_one_secondary' && (
                <div style={{ display: 'flex' }}>
                  <div
                    className="text-center vertical-left-center cursor-pointer"
                  >
                    {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                      }}
                      className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                    >
                      {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                      <IoArrowDownSharp />
                      )}
                      {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                      <IoArrowUpSharp />
                      )}
                      <span className="ml-2">{getPercentageKpi()}</span>
                    </p>
                    )}
                    <h3
                      style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                    </h3>
                    <h5
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                    </h5>
                  </div>
                  <div
                    className="text-center vertical-right-center cursor-pointer"
                  >
                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                      }}
                      className="mb-3"
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                    </p>
                  </div>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_two_secondary' && (
                <div style={{ display: 'flex' }}>
                  <div
                    className="text-center vertical-left-center cursor-pointer"
                  >
                    {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                      }}
                      className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                    >
                      {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                      <IoArrowDownSharp />
                      )}
                      {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                      <IoArrowUpSharp />
                      )}
                      <span className="ml-2">{getPercentageKpi()}</span>
                    </p>
                    )}
                    <h3
                      style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                    </h3>
                    <h5
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                      className=""
                    >
                      {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                    </h5>
                  </div>
                  <div
                    className="text-center vertical-right-center cursor-pointer"
                  >
                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                      }}
                      className="mb-3"
                    >
                      {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                    </p>

                    <h6
                      style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
                      className=""
                    >
                      {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
                    </h6>
                    <p
                      style={{
                        fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
                      }}
                      className=""
                    >
                      {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
                    </p>
                  </div>
                </div>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_sparkline' && (
                <>
                  <div style={{ display: 'flex', height: '50%' }}>
                    <div
                      className="vertical-center-top text-center cursor-pointer"
                    >

                      {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                        }}
                        className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                      >
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                        <IoArrowDownSharp />
                        )}
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                        <IoArrowUpSharp />
                        )}
                        <span className="ml-2">{getPercentageKpi()}</span>
                      </p>
                      )}
                      <h3
                        style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                      </h3>
                      <h5
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                      </h5>
                    </div>
                  </div>
                  {detailData.sparkline && detailData.sparkline.type && (
                  <div className="pl-2 pr-2" style={{ display: 'flex', height: '50%' }}>
                    <Chart
                      type={detailData.sparkline.type}
                      id="spark-chart"
                      series={[{
                        name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
                        data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
                      }]}
                      height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
                      width={reWidth - 40}
                      options={options}
                    />
                  </div>
                  )}
                </>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_one_secondary_indicator_with_sparkline' && (
                <>
                  <div style={{ display: 'flex', height: '50%' }}>
                    <div
                      className="text-center vertical-left-center-top cursor-pointer"
                    >
                      {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                        }}
                        className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                      >
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                        <IoArrowDownSharp />
                        )}
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                        <IoArrowUpSharp />
                        )}
                        <span className="ml-2">{getPercentageKpi()}</span>
                      </p>
                      )}
                      <h3
                        style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                      </h3>
                      <h5
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                      </h5>
                    </div>
                    <div
                      className="text-center vertical-right-center-top cursor-pointer"
                    >
                      <h6
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                        className=""
                      >
                        {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                      </h6>
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                        }}
                        className="mb-3"
                      >
                        {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                      </p>
                    </div>
                  </div>
                  {detailData.sparkline && detailData.sparkline.type && (
                  <div className="pl-2 pr-2" style={{ display: 'flex', height: '50%' }}>
                    <Chart
                      type={detailData.sparkline.type}
                      id="spark-chart"
                      series={[{
                        name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
                        data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
                      }]}
                      height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
                      width={reWidth - 40}
                      options={options}
                    />
                  </div>
                  )}
                </>
                )}
                {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_two_secondary_indicator_with_sparkline' && (
                <>
                  <div style={{ display: 'flex', height: '50%' }}>
                    <div
                      className="text-center vertical-left-center-top cursor-pointer"
                    >
                      {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
                        }}
                        className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
                      >
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
                        <IoArrowDownSharp />
                        )}
                        {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
                        <IoArrowUpSharp />
                        )}
                        <span className="ml-2">{getPercentageKpi()}</span>
                      </p>
                      )}
                      <h3
                        style={{ fontSize: convertPXToVW(reWidth, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
                      </h3>
                      <h5
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
                        className=""
                      >
                        {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
                      </h5>
                    </div>
                    <div
                      className="text-center vertical-right-center-top cursor-pointer"
                    >
                      <h6
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
                        className=""
                      >
                        {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
                      </h6>
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
                        }}
                        className="mb-3"
                      >
                        {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
                      </p>

                      <h6
                        style={{ fontSize: convertPXToVW(reWidth, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
                        className=""
                      >
                        {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
                      </h6>
                      <p
                        style={{
                          fontSize: convertPXToVW(reWidth, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
                        }}
                        className=""
                      >
                        {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
                      </p>
                    </div>
                  </div>
                  {detailData.sparkline && detailData.sparkline.type && (
                  <div className="pl-2 pr-2" style={{ display: 'flex', height: '50%' }}>
                    <Chart
                      type={detailData.sparkline.type}
                      id="spark-chart"
                      series={[{
                        name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
                        data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
                      }]}
                      height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
                      width={reWidth - 40}
                      options={options}
                    />
                  </div>
                  )}
                </>
                )}
              </Card>
            </div>
          </>
        )}
        {updateLayoutInfo && updateLayoutInfo.loading && (
        <div className="margin-top-250px text-center" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Loader />
        </div>
        )}
      </Box>
      <div className="cancel-apply-box">
        {detailDataDefault && (
        <Fab disabled={updateLayoutInfo && updateLayoutInfo.loading} variant="extended" size="medium" onClick={() => onResetBar()} color="default" sx={{ mr: 2 }}>
          <ReplayIcon sx={{ mr: 1 }} />
          Reset to Bar Chart
        </Fab>
        )}
        <Fab disabled={updateLayoutInfo && updateLayoutInfo.loading} variant="extended" size="medium" onClick={() => onReset()} color="default" sx={{ mr: 2 }}>
          <ReplayIcon sx={{ mr: 1 }} />
          Reset
        </Fab>
        <Fab disabled={updateLayoutInfo && updateLayoutInfo.loading} variant="extended" size="medium" onClick={() => onUpdate()} color="primary">
          {updateLayoutInfo && updateLayoutInfo.loading ? <span /> : <CheckIcon sx={{ mr: 1 }} /> }
          {updateLayoutInfo && updateLayoutInfo.loading ? 'Updating...' : 'Update' }
        </Fab>
      </div>
    </>
  );
});

export default MixedCardPreview;
