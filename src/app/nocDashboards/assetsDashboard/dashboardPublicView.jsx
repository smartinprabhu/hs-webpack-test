/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import {
  Tooltip, DatePicker, Skeleton,
} from 'antd';
import {
  faExpandAlt,
  faTimesCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';
import axios from 'axios';

import ErrorContent from '@shared/errorContent';

import ChartCards from './chartCardsIOT';
import './style.css';

import { generateErrorMessage } from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getDiifTime
  ,
} from '../utils/utils';

const appConfig = require('../../config/appConfig').default;

const { RangePicker } = DatePicker;

const DashboardPublicView = React.memo((props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const [dateRange, setDateRange] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [isDataFilter, showDateFilter] = useState(false);
  const [dateFiltersOnPlot, setDateFiltersOnPlot] = useState([]);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const [code, setCode] = useState(false);
  const [defaultDate, setDefaultDate] = useState(false);
  const [dashboardInterval, setDashboardInterval] = useState(false);
  const [dashboardLayouts, setDashboardLayouts] = useState([]);
  const [dashboardColors, setDashboardColors] = useState([]);

  const [ninjaDashboard, setNinjaDashboard] = useState({ loading: false, data: null, err: null });

  const [selectedDateTag, setDateTag] = useState(defaultDate);

   const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fields = '["name","ks_dashboard_menu_name","id","dashboard_json",["ks_dashboard_items_ids", ["id", "name", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';

  function getNinjaDashboard() {
    setNinjaDashboard({ loading: true, data: null, err: null });

    const configs = {
      method: 'get',
      url: `${WEBAPPAPIURL}public/api/v16/getDashboard?uuid=${uuid}&fields=${fields}&context={"tz":"${timeZone}"}`,
    };
    axios(configs)
      .then((response) => {
        if (response.data && response.data.data) {
          setNinjaDashboard({ loading: false, data: response.data.data, err: null });
        }
      })
      .catch((error) => {
        setNinjaDashboard({ loading: false, data: null, err: error });
      });
  }

  function getNinjaDashboardTimer() {
    // setNinjaDashboard({ loading: true, data: null, err: null });
    const configs = {
      method: 'get',
      url: `${WEBAPPAPIURL}public/api/v16/getDashboard?uuid=${uuid}&fields=${fields}&context={"tz":"${timeZone}"}`,
    };

    axios(configs)
      .then((response) => {
        if (response.data && response.data.data) {
          setNinjaDashboard({ loading: false, data: response.data.data, err: null });
        }
      })
      .catch((error) => {
        console.log(error);
        // setNinjaDashboard({ loading: false, data: null, err: error });
      });
  }

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
      getNinjaDashboardTimer();
    }
  }, [isTimer]);

  useEffect(() => {
    if (defaultDate) {
      setDateTag(defaultDate);
    }
  }, [defaultDate]);

  /* useEffect(() => {
    if (dateRange && dateRange.length) {
      if (dateRange && dateRange.length && dateRange[0] && dateRange[0] !== null) {
        const start = `${moment(dateRange[0]).utc().format('YYYY-MM-DD')}T00:00:00.00Z`;
        const end = `${moment(dateRange[1]).utc().format('YYYY-MM-DD')}T23:59:59.00Z`;
        setDateFiltersOnPlot([`${moment(dateRange[0]).utc().format('YYYY-MM-DD')}`, `${moment(dateRange[1]).utc().format('YYYY-MM-DD')}`]);
        const context = {
          ksDateFilterEndDate: end, ksDateFilterSelection: 'l_custom', ksDateFilterStartDate: start, tz: timeZone,
        };
        if (advanceFilter) {
          context.ksDomain = advanceFilter;
        }
        dispatch(getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
          'IOT',
          dashboardCode,
          dashboardUuid,
        ));
      }
    }
  }, [dateRange]); */

  const loading = (ninjaDashboard && ninjaDashboard.loading);

  useMemo(() => {
    setTimer(false);
    setFetchTime(false);
    getNinjaDashboard();
  }, []);

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

  useEffect(() => {
    if (ninjaDashboard && ninjaDashboard.data) {
      setCode(ninjaDashboard.data.id ? ninjaDashboard.data.id : false);
      setDefaultDate(ninjaDashboard.data.ks_date_filter_selection);
      setDashboardInterval(ninjaDashboard.data.ks_set_interval);
      setDashboardLayouts(
        ninjaDashboard.data.dashboard_json
            && isJsonString(ninjaDashboard.data.dashboard_json)
          ? JSON.parse(ninjaDashboard.data.dashboard_json)
          : [],
      );
      setDashboardColors(ninjaDashboard.data.ks_dashboard_items_ids);
    }
  }, [ninjaDashboard]);

  const dashboardName = ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.name ? ninjaDashboard.data.name : 'Dashboard';
  const showFilter = !(ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.disable_dashboard_date_filter);

  const onChangeDateRange = (values) => {
    setDateRange(values);
    showDateFilter(false);
  };

  /* useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && code && isUpdateLoad) {
      setIsUpdateLoad(false);
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboard(
        'ks_fetch_dashboard_data',
        appModels.NINJABOARD,
        code,
        context,
        'IOT',
        dashboardCode,
        dashboardUuid,
      ));
    }
  }, [updateLayoutInfo]); */

  /* const onChangeDate = (value) => {
    setDateRange([]);
    setDateTag(value);
    if (value !== 'l_custom') {
      showDateFilter(false);
      /* setIsUpdateLoad(true);
          const data = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_item_data : false;
          const dataList = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_gridstack_config : false;
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
          } else { */
  /* const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: value, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboard(
        'ks_fetch_dashboard_data',
        appModels.NINJABOARD,
        code,
        context,
        'IOT',
        dashboardCode,
        dashboardUuid,
      ));
      // }
    }
  }; */

  /* const onUpdate = () => {
    if (code) {
      const nData = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data : false;
      const data = nData && nData.ks_item_data ? nData.ks_item_data : false;
      const dataList = nData && nData.ks_gridstack_config ? nData.ks_gridstack_config : false;
      // const seqdata = getArrayNewUpdateFormat(data, dataList, customLayouts);
      const postData = {
        dashboard_json: JSON.stringify(customLayouts),
      };
        /* if (seqdata && seqdata.length) {
          postData.ks_dashboard_items_ids = seqdata;
        } */
  /* dispatch(updateDashboardLayouts(
        code,
        appModels.NINJABOARD,
        postData,
        'IOT',
        dashboardUuid,
      ));
    }
    setEditMode(false);
  }; */

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

    /* const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'none';
      sidebarDiv.style.display = 'none';
    } */
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

    /* const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'initial';
      sidebarDiv.style.display = 'block';
    } */
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
    const actionDiv = document.getElementById('action-buttons');
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
    const actionDiv = document.getElementById('action-buttons');
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById('dynamic-dashboard');
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadImage(image, imageFileName);
    }
  };

  /*  const cities = userInfo && userInfo.data && userInfo.data.allowed_companies ? userInfo.data.allowed_companies.map((cl) => ({
    value: cl.region && cl.region.id ? cl.region.id : '',
    label: cl.region && cl.region.name ? cl.region.name : '',
  })) : [];

  const currentGroupData = cities && cities.length ? [...new Map(cities.map((item) => [item.value, item])).values()] : []; */

  return (
    <Row id="dynamic-dashboard">
      <Col md="12" sm="12" lg="12" xs="12" className="">
        <Card className="p-2 mb-2 h-100 bg-med-blue-public-dashboard border-0">
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
              <Col md="5" sm="12" xs="12" lg="5" id="action-buttons">
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
                data={ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_item_data : false}
                dataList={ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_gridstack_config : false}
                editMode={editMode}
                code={code}
                selectedDateTag={selectedDateTag}
                setCustomLayouts={setCustomLayouts}
                dashboardLayouts={ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.dashboard_json
                  && isJsonString(ninjaDashboard.data.dashboard_json)
                  ? JSON.parse(ninjaDashboard.data.dashboard_json)
                  : []}
                dashboardColors={dashboardColors}
                customLayouts={customLayouts}
                dashboardUuid={uuid}
                dashboardCode={false}
                advanceFilter={false}
                isIot
                isPublic
                isIAQ={false}
                dateFilters={selectedDateTag === 'l_custom' ? dateFiltersOnPlot : (customData && selectedDateTag && customData.dateFiltersText ? customData.dateFiltersText[selectedDateTag] : '')}
              />

              {ninjaDashboard && ninjaDashboard.err && (
                <ErrorContent errorTxt={generateErrorMessage(ninjaDashboard)} />
              )}
            </>
          </CardBody>
        </Card>
      </Col>
      { /* <Modal size="md" className="modal-dialog-centered" isOpen={isDataFilter}>
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
              </Modal> */ }
    </Row>
  );
});

DashboardPublicView.defaultProps = {
  match: false,
};

DashboardPublicView.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default DashboardPublicView;
