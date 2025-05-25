/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton, Drawer, Tooltip } from 'antd';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  faArrowUp, faArrowDown, faChartSimple,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalNoPadHead from '@shared/modalNoPadHead';
import DrawerHeader from '@shared/drawerHeader';

import '../dashboard.scss';
import {
  getColorCode, getDomainString,
  convertPXToVW,
} from '../utils/utils';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import {
  getNinjaCodeDrill,
  resetUpdateDashboardChartItem,
  updateDashboardItem,
  getChartItem,
} from '../../analytics/analytics.service';
import {
  newpercalculateGoal,
  newpercalculatePrev,
} from '../../util/staticFunctions';
import {
  getPagesCountV2, getColumnArrayById, intToString, numberWithCommas,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import DynamicTableView from './dynamicTableView';
import { getPercentage } from '../../assets/utils/utils';
import DashboardDrillView from './dashboardDrillView';

import BarChart from './barChart';
import PieChart from './pieChart';
import HorizontalBarChart from './horizontalBarChart';
import LineAreaChart from './lineAreaChart';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const DataCard = ({
  dataItem, editMode, height, width, selectedDateTag,
  dashboardColors, code, dateFilters,
  advanceFilter,
  isIAQ,
  isIot,
  isPublic,
  dashboardUuid,
  dashboardCode,
}) => {
  const [isViewList, setViewList] = useState(false);
  const [modelName, setModel] = useState(false);
  const [listName, setListName] = useState(false);
  const [domainData, setDomain] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isViewTitle, setViewTitle] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);

  const [isShow, setIsShow] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [dashboardModal, setShowDashboardModal] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();
  const limit = 20;

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const {
    ninjaDashboard, ninjaDrillCode, ninjaChartInfo,
    updateNinjaChartItemInfo,
  } = useSelector((state) => state.analytics);

  const onViewTitle = () => {
    setViewTitle(true);
    setTimeout(() => {
      setShowDashboardModal(false);
      setIsShow(false);
      setViewList(false);
    }, 100);
  };

  const isShowAsString = ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.is_long_number_as_string ? ninjaDashboard.data.is_long_number_as_string : false;

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultiple(false, modelName, limit, offset, fields, getDomainString(JSON.stringify(domainData), searchValue, modelName)));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultipleCount(false, modelName, fields, getDomainString(JSON.stringify(domainData), searchValue, modelName)));
    }
  }, [modelName, isSearch]);

  useEffect(() => {
    if (
      ninjaChartInfo
      && !ninjaChartInfo.loading
      && updateNinjaChartItemInfo
      && !updateNinjaChartItemInfo.loading
      && showModal
      && dataItem.action_ks_dashboard_ninja_item_id
      && updateNinjaChartItemInfo
      && updateNinjaChartItemInfo.data
    ) {
      dispatch(
        getChartItem(
          dataItem.action_ks_dashboard_ninja_item_id,
          appModels.NINJABOARDITEM,
        ),
      );
    }
  }, [updateNinjaChartItemInfo]);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const handleViewList = (model, domain, name) => {
    setViewList(true);
    setDomain(domain);
    setListName(name);
    setModel(model);
  };

  const chartItemData = ninjaChartInfo && ninjaChartInfo.data && ninjaChartInfo.data.length
    ? ninjaChartInfo.data[0]
    : false;

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  const arrGrids = dataItem.ks_kpi_data ? JSON.parse(dataItem.ks_kpi_data) : [];

  const totalTarget = arrGrids && arrGrids.length && arrGrids.length;

  const prevRec = arrGrids && arrGrids.length && arrGrids.length && arrGrids[0].previous_period ? arrGrids[0].previous_period : false;

  const customHeight = height - 20;

  function getResValue(input) {
    let res = 0;
    /* if (Number(input) === input && input % 1 !== 0) {
      res = intToString(parseFloat(input).toFixed(2));
    } else {
      res = intToString(parseInt(input));
    } */
    if (isShowAsString) {
      if (input < 999 && Number(input) === input && input % 1 !== 0) {
        res = parseFloat(input).toFixed(2);
      } else {
        res = intToString(parseInt(input));
      }
    }
    if (!isShowAsString) {
      if (Number(input) === input && input % 1 !== 0) {
        res = parseFloat(input).toFixed(2);
      } else {
        res = parseInt(input);
      }
    }
    return res;
  }

  function getStatusKpi(item) {
    let res = 'up';
    if (item.ks_record_count > item.ks_standard_goal_value) {
      res = 'up';
    } else {
      res = 'down';
    }
    return res;
  }

  function getStatusColor(item) {
    let res = '';
    if (item.ks_goal_enable) {
      if (item.ks_record_count > item.ks_standard_goal_value) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    }
    return res;
  }

  function getStatusKpi1(item) {
    let res = 'up';
    if (prevRec) {
      if (item.ks_record_count > prevRec) {
        res = 'up';
      } else {
        res = 'down';
      }
    }
    return res;
  }

  function getStatusColor1(item) {
    let res = '';
    if (totalTarget) {
      if (item.ks_record_count > prevRec) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    }
    return res;
  }

  const onClickDataCard = () => {
    if (!isViewTitle && !editMode && dataItem.ks_record_count && !isPublic) {
      if (
        dataItem.ks_action_type === 'dashboard'
        && dataItem.action_ks_dashboard_ninja_board_id
      ) {
        dispatch(
          getNinjaCodeDrill(
            dataItem.action_ks_dashboard_ninja_board_id,
            appModels.NINJABOARD,
          ),
        );
        setShowDashboardModal(true);
        setIsShow(true);
      } else if (
        dataItem.ks_action_type === 'chart'
        && dataItem.action_ks_dashboard_ninja_item_id
      ) {
        setShowModal(true);
        dispatch(resetUpdateDashboardChartItem());
        const postData = {
          ks_domain: dataItem.ks_domain,
          ks_date_filter_selection: selectedDateTag,
        };
        dispatch(
          updateDashboardItem(
            dataItem.action_ks_dashboard_ninja_item_id,
            appModels.NINJABOARDITEM,
            postData,
          ),
        );
      } else if (dataItem.ks_data_calculation_type !== 'query') {
        handleViewList(dataItem.ks_model_name, dataItem.ks_domain, dataItem.name);
      }
    }
  };

  const onCloseDashboard = () => {
    setShowDashboardModal(false);
    setIsShow(false);
  };
  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  function getJsonString(str) {
    return JSON.parse(str);
  }

  function getRangeLegend(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseInt(item.ks_from ? item.ks_from : 0) <= parseInt(value)
          && parseInt(item.ks_to) >= parseInt(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_legend;
      }
    }
    if (ranges && ranges.length) {
      if (parseInt(value) > parseInt(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_legend;
      }
    }

    return score;
  }

  function getRangeColor(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseInt(item.ks_from ? item.ks_from : 0) <= parseInt(value)
          && parseInt(item.ks_to) >= parseInt(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_colors;
      }
    }
    if (ranges && ranges.length) {
      if (parseInt(value) > parseInt(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_colors;
      }
    }

    return score;
  }

  function parse(str) {
    try {
      const func = new Function('str', `'use strict'; return (${str})`);
      return func(str);
    } catch (e) {
      return false;
    }
  }

  function getValuebyType() {
    let res = '';
    if (arrGrids && arrGrids.length && dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).value_expression) {
      // res = parseInt(arrGrids[1].record_data) - parseInt(arrGrids[0].record_data);
      const res1 = getJsonString(dataItem.ks_info).value_expression.replaceAll('data_one', arrGrids[0].record_data);
      const res2 = res1.replaceAll('data_two', arrGrids[1].record_data);
      const formula = parse(res2);
      res = !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0;
    } else if (arrGrids && arrGrids.length && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).value_expression) {
      // res = parseInt(arrGrids[1].record_data) - parseInt(arrGrids[0].record_data);
      const res1 = getJsonString(dataItem.ks_description).value_expression.replaceAll('data_one', arrGrids[0].record_data);
      const res2 = res1.replaceAll('data_two', arrGrids[1].record_data);
      const formula = parse(res2);
      res = !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0;
    } else {
      res = numberWithCommas(getResValue(dataItem.ks_record_count));
    }
    return res;
  }

  function getValuebyTypeTest() {
    let res = '';
    if (arrGrids && arrGrids.length && dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).value_expression) {
      // res = parseInt(arrGrids[1].record_data) - parseInt(arrGrids[0].record_data);
      const res1 = getJsonString(dataItem.ks_info).value_expression.replaceAll('data_one', arrGrids[0].record_data);
      const res2 = res1.replaceAll('data_two', arrGrids[1].record_data);
      const formula = parse(res2);
      res = !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0;
    } else if (arrGrids && arrGrids.length && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).value_expression) {
      // res = parseInt(arrGrids[1].record_data) - parseInt(arrGrids[0].record_data);
      const res1 = getJsonString(dataItem.ks_description).value_expression.replaceAll('data_one', arrGrids[0].record_data);
      const res2 = res1.replaceAll('data_two', arrGrids[1].record_data);
      const formula = parse(res2);
      res = !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0;
    }
    return res;
  }

  console.log(getValuebyTypeTest());

  function removeModalClass() {
    const element = document.getElementById('main-body-property');
    element.classList.remove('modal-open');
  }

  function isKpiLayout() {
    const isLayout = ((dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).layout) || (dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).layout));
    return isLayout;
  }

  return (
    <>
      <div
        width="100%"
        className="p-0"
        height={customHeight}
        id="rechartContainer"
        style={{ height: `${customHeight}px`, width: '100%', borderLeft: `3px solid ${dataItem.ks_layout === 'layout5' || isKpiLayout() ? getColorCode(dataItem.ks_background_color) : 'unset'}` }}
      >
        <div aria-hidden className={`${dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'vertical-center text-center' : 'text-right'} ${((dataItem.ks_data_calculation_type === 'query' && !(dataItem.ks_action_type === 'dashboard' || dataItem.ks_action_type === 'chart')) || editMode || !dataItem.ks_record_count || isPublic) ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => onClickDataCard()}>
          <h6 className="font-weight-800 mb-1" style={{ color: dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'white' : '', fontSize: convertPXToVW(width, customHeight) }}>
            {dataItem.name}
            {((dataItem.ks_description && !isJsonString(dataItem.ks_description)) || (dataItem.ks_info && !isJsonString(dataItem.ks_info))) && (
            <span aria-hidden className="text-info cursor-pointer ml-2" onMouseEnter={() => onViewTitle()}><FontAwesomeIcon className="ml-1" size="sm" icon={faInfoCircle} /></span>
            )}
          </h6>
          {!(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
            <>
              {dataItem.ks_record_count > 999 ? (
                <Tooltip title={numberWithCommas(dataItem.ks_record_count)} placement="right">
                  <h2 className="mb-0" style={{ color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'), fontSize: convertPXToVW(width, customHeight) }}>
                    {numberWithCommas(getResValue(dataItem.ks_record_count))}
                    {dataItem.ks_dashboard_item_type === 'ks_kpi' && dataItem.ks_data_comparison === 'None' && arrGrids && arrGrids.length > 1 && (
                    <>
                      /
                      <span style={{ color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'), fontSize: convertPXToVW(width, customHeight, 0.2) }}>
                        {arrGrids[1].record_data}
                      </span>
                    </>
                    )}
                  </h2>
                </Tooltip>
              ) : (
                <h2 className="mb-0" style={{ color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'), fontSize: convertPXToVW(width, customHeight) }}>
                  {numberWithCommas(getResValue(dataItem.ks_record_count))}
                  {dataItem.ks_dashboard_item_type === 'ks_kpi' && dataItem.ks_data_comparison === 'None' && arrGrids && arrGrids.length > 1 && (
                  <>
                    /
                    <span style={{ color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'), fontSize: convertPXToVW(width, customHeight, 0.2) }}>
                      {arrGrids[1].record_data}
                    </span>
                  </>
                  )}
                </h2>
              )}
            </>
          )}
          {(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
            <>
              {getJsonString(dataItem.ks_info).type === 'metric' && (
              <h2
                className="mb-0"
                style={{
                  color: getRangeColor(
                    parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      arrGrids[0].record_data,
                    )).toFixed(2),
                    dataItem.ks_hx_sla_audit_metric_line_ids,
                  ),
                  fontSize: convertPXToVW(width, customHeight),
                }}
              >
                {getRangeLegend(
                  getPercentage(
                    arrGrids[1].record_data,
                    arrGrids[0].record_data,
                  ),
                  dataItem.ks_hx_sla_audit_metric_line_ids,
                )}
                {getJsonString(dataItem.ks_info).value === 'true' ? (
                  <span style={{
                    color: getRangeColor(
                      parseFloat(getPercentage(
                        arrGrids[1].record_data,
                        arrGrids[0].record_data,
                      )).toFixed(2),
                      dataItem.ks_hx_sla_audit_metric_line_ids,
                    ),
                    fontSize: convertPXToVW(width, customHeight, 0.5),
                  }}
                  >
                    {'  '}
                    (
                    {getPercentage(arrGrids[1].record_data, arrGrids[0].record_data)}
                    %)
                  </span>
                ) : (
                  <span />
                )}
              </h2>
              )}
              {getJsonString(dataItem.ks_info).type === 'expression' && (
              <h2
                className="mb-0"
                style={{
                  color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'),
                  fontSize: convertPXToVW(width, customHeight),
                }}
              >
                {getJsonString(dataItem.ks_info).value === 'true' ? (
                  <>
                    {getValuebyType()}
                  </>
                ) : (
                  <>
                    {parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      getJsonString(dataItem.ks_info).value_expression ? getValuebyType() : arrGrids[0].record_data,
                    )).toFixed(2)}
                    {' '}
                    %
                  </>
                )}
                {getJsonString(dataItem.ks_info).value === 'true' ? (
                  <span style={{
                    color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'),
                    fontSize: convertPXToVW(width, customHeight, 0.5),
                  }}
                  >
                    {'  '}
                    (
                    {parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      getJsonString(dataItem.ks_info).value_expression ? getValuebyType() : arrGrids[0].record_data,
                    )).toFixed(2)}
                    %)
                  </span>
                ) : (
                  <span />
                )}

              </h2>
              )}
              {getJsonString(dataItem.ks_info).type === 'value' && (
              <h2
                className="mb-0"
                style={{
                  color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'),
                  fontSize: convertPXToVW(width, customHeight),
                }}
              >
                {getJsonString(dataItem.ks_info).value === 'true' ? (
                  <>
                    {getValuebyType()}
                  </>
                ) : (
                  <>
                    {parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      arrGrids[0].record_data,
                    )).toFixed(2)}
                    {' '}
                    %
                  </>
                )}
                {getJsonString(dataItem.ks_info).value === 'true' ? (
                  <span style={{
                    color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'),
                    fontSize: convertPXToVW(width, customHeight, 0.5),
                  }}
                  >
                    {'  '}
                    (
                    {parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      arrGrids[0].record_data,
                    )).toFixed(2)}
                    %)
                  </span>
                ) : (
                  <span />
                )}
              </h2>
              )}
            </>
          )}
          {dataItem.ks_dashboard_item_type === 'ks_kpi' && dataItem.ks_data_comparison === 'Percentage' && arrGrids && arrGrids.length > 1
           && !(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
           <span className="mb-0" style={{ color: getColorCode(dataItem.ks_background_color, dataItem.ks_layout === 'layout5' || isKpiLayout() ? 'yes' : 'no'), fontSize: convertPXToVW(width, customHeight, 0.2) }}>
             {getPercentage(arrGrids[1].record_data, arrGrids[0].record_data)}
             %
           </span>
          )}
          {dataItem.ks_dashboard_item_type === 'ks_kpi' && totalTarget && (
            <>
              { /* <span className="fon-tiny" style={{ fontSize: convertPXToVW(width, customHeight, 0.4) }}>{`${newpercalculate(total, dataItem.ks_record_count)}%`}</span> */}
              {dataItem.ks_goal_enable && (
                <p className="m-0 float-left" style={{ fontSize: convertPXToVW(width, customHeight, 0.6) }}>
                  vs Target
                  {' '}
                  <FontAwesomeIcon className={`mr-1 ${getStatusColor(dataItem)}`} size="sm" icon={getStatusKpi(dataItem) === 'up' ? faArrowUp : faArrowDown} />
                  <span className={`fon-tiny ${getStatusColor(dataItem)}`}>
                    {`${newpercalculateGoal(dataItem.ks_standard_goal_value, dataItem.ks_record_count)}%`}
                  </span>
                </p>
              )}
              {prevRec && (
                <p className="m-0 float-right" style={{ fontSize: convertPXToVW(width, customHeight, 0.6) }}>
                  vs Prev
                  {' '}
                  <FontAwesomeIcon className={`mr-1 ${getStatusColor1(dataItem)}`} size="sm" icon={getStatusKpi1(dataItem) === 'up' ? faArrowUp : faArrowDown} />
                  <span className={`fon-tiny ${getStatusColor1(dataItem)}`}>
                    {`${newpercalculatePrev(prevRec, dataItem.ks_record_count)}%`}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {showModal
        && !(
          (ninjaChartInfo && ninjaChartInfo.loading)
          || (updateNinjaChartItemInfo && updateNinjaChartItemInfo.loading)
        ) && (
        <div>
          {chartItemData && (
          <>
            {(chartItemData.ks_dashboard_item_type === 'ks_polarArea_chart' || chartItemData.ks_dashboard_item_type === 'ks_bar_multi_chart' || chartItemData.ks_dashboard_item_type === 'ks_bar_advance_chart' || chartItemData.ks_dashboard_item_type === 'ks_bar_chart') && (
            <BarChart
              code={code}
              dashboardColors={[{ id: chartItemData.id, ks_action_lines: chartItemData.ks_action_lines }]}
              chartData={chartItemData}
              dateFilters={dateFilters}
              isShowModal
              setChildShow={() => { setShowModal(false); removeModalClass(); }}
            />
            )}
            {(chartItemData.ks_dashboard_item_type === 'ks_pie_chart' || chartItemData.ks_dashboard_item_type === 'ks_doughnut_chart') && (
            <PieChart
              dashboardColors={[{ id: chartItemData.id, ks_action_lines: chartItemData.ks_action_lines }]}
              chartData={chartItemData}
              dateFilters={dateFilters}
              isShowModal
              setChildShow={() => { setShowModal(false); removeModalClass(); }}
            />
            )}
            {chartItemData.ks_dashboard_item_type === 'ks_horizontalBar_chart' && (
            <HorizontalBarChart
              dashboardColors={[{ id: chartItemData.id, ks_action_lines: chartItemData.ks_action_lines }]}
              chartData={chartItemData}
              dateFilters={dateFilters}
              isShowModal
              setChildShow={() => { setShowModal(false); removeModalClass(); }}
            />
            )}
            {(chartItemData.ks_dashboard_item_type === 'ks_line_chart' || chartItemData.ks_dashboard_item_type === 'ks_area_chart') && (
            <LineAreaChart
              code={code}
              selectedDateTag={selectedDateTag}
              dashboardColors={[{ id: chartItemData.id, ks_action_lines: chartItemData.ks_action_lines }]}
              chartData={chartItemData}
              dateFilters={dateFilters}
              isShowModal
              setChildShow={() => { setShowModal(false); removeModalClass(); }}
            />
            )}
          </>
          )}
        </div>
      )}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width="90%"
        visible={isViewList}
      >
        <DrawerHeader
          title={listName}
          imagePath={false}
          closeDrawer={() => { setViewList(false); setModel(false); setOffset(0); setPage(1); }}
        />
        { /* <h4>
          <DynamicDataExport
            listName={getTableDrillName()}
            modelName={modelName}
            domainData={domainData}
            onSearchChange={onSearchChange}
            onClear={onClear}
            onSearch={onSearch}
            searchValue={searchValue}
          />
        </h4> */ }
        <div className="">
          { /* listDataMultipleInfo && listDataMultipleInfo.loading && (
            <div className="p-3 text-center">
              <Skeleton active />
            </div>
          ) */}
          <DynamicTableView
            columns={customData && customData[modelName] ? customData[modelName] : []}
            data={listDataMultipleInfo && !listDataMultipleInfo.err && !listDataMultipleInfo.loading && listDataMultipleInfo.data ? listDataMultipleInfo.data : []}
            propertyAsKey="id"
            modelName={modelName}
          />
        </div>
        { /* loading || pages === 0 ? (<span />) : (
          <div className={`${classes.root} float-right`}>
            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
          </div>
        )}
        {(listDataMultipleInfo && listDataMultipleInfo.err) && (
          <SuccessAndErrorFormat response={listDataMultipleInfo} />
        ) */ }
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className=""
        width="98%"
        visible={dashboardModal}
      >
        <DrawerHeader
          title={
            ninjaDrillCode
            && ninjaDrillCode.data
            && ninjaDrillCode.data.length > 0
              ? ninjaDrillCode.data[0].name
              : ''
          }
          imagePath={false}
          closeDrawer={() => onCloseDashboard()}
        />
        {isShow
          && ninjaDrillCode
          && ninjaDrillCode.data
          && ninjaDrillCode.data.length > 0
          && !ninjaDrillCode.loading && (
            <DashboardDrillView
              code={ninjaDrillCode.data[0].id}
              defaultDate={selectedDateTag}
              dashboardInterval={ninjaDrillCode.data[0].ks_set_interval}
              dashboardLayouts={ninjaDrillCode.data[0].dashboard_json}
              dashboardColors={ninjaDrillCode.data[0].ks_dashboard_items_ids}
            />
        )}
        {(!isShow || (ninjaDrillCode && ninjaDrillCode.loading)) && (
          <div className="text-center mt-2 mb-2">
            <Skeleton active size="large" />
          </div>
        )}
      </Drawer>
      <Modal
        size="xl"
        className="modal-xxl"
        isOpen={showModal
          && ((ninjaChartInfo && ninjaChartInfo.loading)
            || (updateNinjaChartItemInfo && updateNinjaChartItemInfo.loading))}
        id="expand_modal"
      >
        <ModalNoPadHead title="" fontAwesomeIcon={faChartSimple} closeModalWindow={() => setShowModal(false)} />

        {((ninjaChartInfo && ninjaChartInfo.loading)
            || (updateNinjaChartItemInfo && updateNinjaChartItemInfo.loading)) && (
            <div className="mt-3 mb-2 pl-1 pt-3 pr-3 pb-1 text-center" style={{ height: '480px' }}>
              <Skeleton active size="large" />
            </div>
        )}

      </Modal>
      <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={isViewTitle}>
        <ModalNoPadHead title={dataItem.name} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setViewTitle(false)} />
        <ModalBody className="pl-3 pt-0 pr-3 pb-3">
          {dataItem.ks_description || dataItem.ks_info}
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataCard;