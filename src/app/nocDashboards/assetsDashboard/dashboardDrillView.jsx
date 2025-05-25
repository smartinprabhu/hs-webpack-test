/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import {
  Card, CardBody, Col, Row, Modal, ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import {
  Select, Button, Tooltip, DatePicker, Skeleton,
} from 'antd';
import {
  faExpandAlt,
  faTimesCircle,
  faCheck,
  faCalendarAlt,
  faClock,
  faClose,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';

import ErrorContent from '@shared/errorContent';
import ModalNoPadHead from '@shared/modalNoPadHead';

import ChartCards from './chartCards';
import './style.css';

import {
  getNinjaDashboardDrill,
  getNinjaDashboardTimerDrill,
  updateDashboardLayouts,
} from '../../analytics/analytics.service';
import { generateErrorMessage, getListOfModuleOperations } from '../../util/appUtils';
import customData from '../data/customData.json';
import StaticDataExportFull from './staticDataExportFull';
import {
  getDiifTime, getArrayNewUpdateFormat, getDataArryIn, getTargetDateGroup,
  getGroupDateArray,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const DashboardDrillView = React.memo((props) => {
  const {
    code,
    defaultDate,
    dashboardInterval,
    dashboardLayouts,
    dashboardColors,
    advanceFilter,
  } = props;
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [isDataFilter, showDateFilter] = useState(false);
  const [dateFiltersOnPlot, setDateFiltersOnPlot] = useState([]);
  const [selectedDateTag, setDateTag] = useState(defaultDate);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { ninjaDashboardDrill, updateLayoutInfo } = useSelector((state) => state.analytics);

  const timeZone = userInfo.data
  && userInfo.data.timezone ? userInfo.data.timezone : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Dashboards', 'code');

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

  const siteLevel = userInfo && userInfo.data && userInfo.data.main_company && userInfo.data.main_company.category
      && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name === 'Companys' ? 'Company' : 'Site';

  useEffect(() => {
    if (dashboardInterval) {
      // setLoadable(false);
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
        // clearInterval(interval);
    }
  }, [dashboardInterval]);

  useEffect(() => {
    if (isTimer && dashboardInterval && code) {
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };
      dispatch(getNinjaDashboardTimerDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, code, context));
    }
  }, [isTimer]);

  useEffect(() => {
    if (defaultDate) {
      setDateTag(defaultDate);
    }
  }, [defaultDate]);

  useEffect(() => {
    if (dateRange && dateRange.length) {
      if (dateRange && dateRange.length && dateRange[0] && dateRange[0] !== null) {
        const s1 = moment(dateRange[0]).format('YYYY-MM-DD');
        const s2 = moment(dateRange[1]).format('YYYY-MM-DD');
        const start = `${moment(`${s1} 00:00:00`).utc().format('YYYY-MM-DDTHH:mm:ss')}`;
        const end = `${moment(`${s2} 23:59:59`).utc().format('YYYY-MM-DDTHH:mm:ss')}`;
        setDateFiltersOnPlot([`${moment(dateRange[0]).utc().format('YYYY-MM-DD')}`, `${moment(dateRange[1]).utc().format('YYYY-MM-DD')}`]);
        const context = {
          ksDateFilterEndDate: `${end}.00Z`, ksDateFilterSelection: 'l_custom', ksDateFilterStartDate: `${start}.00Z`, tz: timeZone,
        };
        if (advanceFilter) {
          context.ksDomain = advanceFilter;
        }
        dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, code, context));
      }
    }
  }, [dateRange]);

  const loading = (ninjaDashboardDrill && ninjaDashboardDrill.loading);

  useMemo(() => {
    if (code) {
      setTimer(false);
      setFetchTime(false);
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: defaultDate || 'l_none', ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, code, context));
    }
  }, [code, advanceFilter]);

  const dashboardName = ninjaDashboardDrill && ninjaDashboardDrill.data && ninjaDashboardDrill.data.name ? ninjaDashboardDrill.data.name : 'Dashboard';

  const onChangeDateRange = (values) => {
    setDateRange(values);
    showDateFilter(false);
  };

  useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && code && isUpdateLoad) {
      setIsUpdateLoad(false);
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, code, context));
    }
  }, [updateLayoutInfo]);

  const onChangeDate = (value) => {
    setDateRange([]);
    setDateTag(value);
    if (value !== 'l_custom') {
      showDateFilter(false);
      setIsUpdateLoad(true);
      const data = ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_item_data : false;
      const dataList = ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_gridstack_config : false;
      const arrGrids = dataList ? JSON.parse(dataList) : [];
      const dataIds = Object.keys(arrGrids);
      const dataArray = getDataArryIn(data || [], dataIds);
      const dateItems = dataArray && dataArray.length ? dataArray.filter((item) => item.ks_chart_date_groupby) : [];
      if (dateItems && dateItems.length) {
        const dateGroup = getTargetDateGroup(value);
        const postData = {
          ks_dashboard_items_ids: getGroupDateArray(dateItems, dateGroup),
        };
        dispatch(updateDashboardLayouts(code, appModels.NINJABOARD, postData));
      } else {
        const context = {
          ksDateFilterEndDate: false, ksDateFilterSelection: value, ksDateFilterStartDate: false, tz: timeZone,
        };
        if (advanceFilter) {
          context.ksDomain = advanceFilter;
        }
        dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, code, context));
      }
    }
  };
  const onUpdate = () => {
    if (code) {
      const nData = ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data : false;
      const data = nData && nData.ks_item_data ? nData.ks_item_data : false;
      const dataList = nData && nData.ks_gridstack_config ? nData.ks_gridstack_config : false;
      const seqdata = getArrayNewUpdateFormat(data, dataList, customLayouts);
      const postData = {
        dashboard_json: customLayouts,
      };
      if (seqdata && seqdata.length) {
        postData.ks_dashboard_items_ids = seqdata;
      }
      dispatch(updateDashboardLayouts(code, appModels.NINJABOARD, postData));
    }
    setEditMode(false);
  };

  const onExpand = () => {
    const elem = document.documentElement; // document.getElementById('main-body-property');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'none';
      sidebarDiv.style.display = 'none';
    }
    setExpandMode(true);
  };

  const onExpandClose = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'initial';
      sidebarDiv.style.display = 'block';
    }
    setExpandMode(false);
  };

  const handleFilterChange = (value) => {
    setGroupFilter(false);
  };

  const handleFilterDeselectChange = (value) => {
    setGroupFilter(true);
  };

  const handleGroupFilterClear = () => {
    setGroupFilter(false);
  };

  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement('a');
    fakeLink.style = 'display:none;';
    const actionDiv = document.getElementById('action-buttons-drill');
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    if (actionDiv) {
      actionDiv.style.display = 'initial';
    }
    fakeLink.remove();
  };

  const exportAsImage = async (imageFileName) => {
    const actionDiv = document.getElementById('action-buttons-drill');
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById('dynamic-dashboard-drill');
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadImage(image, imageFileName);
    }
  };

  const cities = userInfo && userInfo.data && userInfo.data.allowed_companies ? userInfo.data.allowed_companies.map((cl) => ({
    value: cl.region && cl.region.id ? cl.region.id : '',
    label: cl.region && cl.region.name ? cl.region.name : '',
  })) : [];

  const currentGroupData = cities && cities.length ? [...new Map(cities.map((item) => [item.value, item])).values()] : [];
  return (
    <Row id="dynamic-dashboard-drill">
      <Col md="12" sm="12" lg="12" xs="12" className="">
        <Card className="p-2 mb-2 h-100 bg-med-blue-dashboard border-0">
          <CardBody className="p-1 m-0">
            <Row className="row-cols-sm-12">
              <Col md="7" sm="12" xs="12" lg="7">
                <h4 className="text-uppercase">
                  { /* <img
                          src={assetsGrey}
                          width="50"
                          height="50"
                          alt="Assets"
                          className="mr-2"
    /> */ }
                  {dashboardName}
                  {fetchTime && getDiifTime(fetchTime) && (
                  <Tooltip title={getDiifTime(fetchTime)} placement="top">
                    <span className="font-size-16px">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faClock} />
                    </span>
                  </Tooltip>
                  )}
                </h4>
              </Col>
              <Col md="5" sm="12" xs="12" lg="5" id="action-buttons-drill">
                <div className="d-flex mt-2 float-right content-center">
                  { /* <div className="d-flex flex-column mr-3">
                          <Select
                            options={userCompanies.map((vl) => ({
                              value: vl.id,
                              label: vl.name,
                            }))}
                            value={selectedFilter}
                            onSelect={(value) => setSelectedFilter(value)}
                            style={{ minWidth: 100 }}
                          />
                          </div> */ }
                  {!loading && (
                  <>
                    {siteLevel === 'Company' && (
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      maxTagCount={1}
                      options={currentGroupData}
                      open={isGroupFilter}
                            // value={currentGroupFilters}
                      showArrow
                      loading={userInfo && userInfo.loading}
                      placeholder="Select City"
                      className="width-210px mr-2"
                      optionFilterProp="label"
                      onDropdownVisibleChange={(open) => { setGroupFilter(open); }}
                      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      filterSort={(optionA, optionB) => optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())}
                      onSelect={(value) => handleFilterChange(value)}
                      onDeselect={(value) => handleFilterDeselectChange(value)}
                      onClear={() => handleGroupFilterClear()}
                    />
                    )}
                    <span className="datefilter-name">
                      {customData && customData.dateFiltersText && selectedDateTag && customData.dateFiltersText[selectedDateTag] ? customData.dateFiltersText[selectedDateTag] : ''}
                    </span>
                    <Tooltip title="Date Filters" placement="top">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => showDateFilter(true)} icon={faCalendarAlt} />
                    </Tooltip>
                    <StaticDataExportFull
                      data={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_item_data : false}
                      dataList={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_gridstack_config : false}
                      dashboardName={dashboardName}
                      onImageExport={() => exportAsImage(dashboardName)}
                      pdfId="dynamic-dashboard-drill"
                    />
                    {!expandMode && (
                    <>
                      {editMode ? (
                        <>
                          <Tooltip title="Update" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onUpdate()} icon={faCheck} />
                          </Tooltip>
                          <Tooltip title="Discard" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => { setEditMode(false); setCustomLayouts(dashboardLayouts); }} icon={faClose} />
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          {isEditable && (
                          <Tooltip title="Edit" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => setEditMode(true)} icon={faPencilAlt} />
                          </Tooltip>
                          )}
                        </>
                      )}
                    </>
                    )}
                    {!editMode && (
                    <Tooltip title={expandMode ? 'Close' : 'Full Screen'} placement="top">
                      {expandMode ? (
                        <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onExpandClose()} icon={faTimesCircle} />
                      ) : (
                        <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onExpand()} icon={faExpandAlt} />
                      )}
                    </Tooltip>
                    )}
                  </>
                  )}
                </div>
              </Col>
            </Row>
            { /* <Row sm="12">
                <Col className="">
                  <Card className="border-0 p-0 bg-med-blue-dashboard">
                    { /* <CardTitle className="mb-1">
                          <h6>
                            ASSETS
                          </h6>
                        </CardTitle>
                    <CardBody className="p-1">
                      {loading && (
                      <div className="text-center mt-2 mb-2">
                        <Skeleton />
                      </div>
                      )}
                      {ninjaDashboard && ninjaDashboard.data && !loading && !ninjaDashboard.err && (
                      <AssetQuipmentCards
                        data={ninjaDashboard.data.ks_item_data}
                        dataList={ninjaDashboard.data.ks_gridstack_config}
                      />
                      )}
                      {ninjaDashboard && ninjaDashboard.err && (
                      <ErrorContent errorTxt={generateErrorMessage(ninjaDashboard)} />
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row> */ }
            <>
              {loading && (
              <div className="text-center mt-2 mb-2">
                <Skeleton active size="large" />
              </div>
              )}
              <ChartCards
                data={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_item_data : false}
                dataList={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_gridstack_config : false}
                editMode={editMode}
                code={code}
                selectedDateTag={selectedDateTag}
                setCustomLayouts={setCustomLayouts}
                dashboardLayouts={dashboardLayouts}
                dashboardColors={dashboardColors}
                customLayouts={customLayouts}
                dateFilters={selectedDateTag === 'l_custom' ? dateFiltersOnPlot : (customData && selectedDateTag && customData.dateFiltersText ? customData.dateFiltersText[selectedDateTag] : '')}
              />

              {ninjaDashboardDrill && ninjaDashboardDrill.err && (
              <ErrorContent errorTxt={generateErrorMessage(ninjaDashboardDrill)} />
              )}
            </>
          </CardBody>
        </Card>
      </Col>
      <Modal size="md" className="modal-dialog-centered" isOpen={isDataFilter}>
        <h5 className="font-weight-800 mb-0">
          <ModalNoPadHead title="Date Filters" fontAwesomeIcon={faCalendarAlt} closeModalWindow={() => showDateFilter(false)} />
        </h5>
        <ModalBody className="p-3">
          <Row>
            <Col md="4" sm="12" xs="12" lg="4">
              {customData && customData.dateFiltersCurrent.map((dl) => (
                <p key={dl.label}>
                  <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                </p>
              ))}
            </Col>
            <Col md="4" sm="12" xs="12" lg="4">
              {customData && customData.dateFiltersPast.map((dl) => (
                <p key={dl.label}>
                  <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                </p>
              ))}
            </Col>
            <Col md="4" sm="12" xs="12" lg="4">
              {customData && customData.dateFiltersPastDays.map((dl) => (
                <p key={dl.label}>
                  <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                </p>
              ))}
            </Col>
            <Col md="12" sm="12" xs="12" lg="12">
              {selectedDateTag === 'l_custom' && (
              <RangePicker
                onChange={onChangeDateRange}
                value={dateRange}
                format="DD-MM-y"
                size="small"
                className="w-100 mb-2"
              />
              )}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Row>
  );
});

DashboardDrillView.propTypes = {
  code: PropTypes.string.isRequired,
  defaultDate: PropTypes.string.isRequired,
  dashboardInterval: PropTypes.number.isRequired,
  dashboardLayouts: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  dashboardColors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DashboardDrillView;
