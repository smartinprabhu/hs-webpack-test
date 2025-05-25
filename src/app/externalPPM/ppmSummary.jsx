/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Col,
  Card,
  CardBody,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import moment from 'moment-timezone';
import DOMPurify from 'dompurify';
import renderHTML from 'react-render-html';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box } from '@mui/system';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import {
  faTools, faLocationPin,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DetailViewFormat from '@shared/detailViewFormat';

import DialogHeader from '../commonComponents/dialogHeader';
import CommonGrid from '../commonComponents/commonGridStaticData';
import { ppmStatusLogJson } from '../commonComponents/utils/util';
import {
  detectMob, extractNameObject, getAccountIdFromUrl, getDifferenceBetweenInDays, getDefaultNoValue, detectMimeType,
} from '../util/appUtils';
import {
  newpercalculate,
} from '../util/staticFunctions';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import PpmDetail from './ppmDetail';

const PpmSummary = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [ppmOverviewData, setPPMSummary] = useState({ loading: false, data: null, err: null });
  const limit = 20;
  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [pageData, setPageData] = useState([]);
  const [viewId, setViewId] = useState(false);
  const [viewData, setViewData] = useState(false);
  const [viewModel, setViewModal] = useState(false);
  const [policyModal, setPolicyModal] = useState(false);
  const [policyType, setPolicyType] = useState('term');

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const isMobileView = detectMob();

  const detailData = useMemo(() => (ppmOverviewData && ppmOverviewData.data && ppmOverviewData.data.length ? ppmOverviewData.data[0] : ''), [ppmOverviewData]);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const stickyFooter = document.getElementById('sticky_footer');

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  const handlePageChange = (page) => {
    // const offsetValue = page * limit;
    setPage(page);
    // setPageData(detailData.ppm_scheduler_ids ? detailData.ppm_scheduler_ids.slice(offsetValue, (offsetValue + limit)) : 0);
  };

  useEffect(() => {
    if (uuid) {
      setPPMSummary({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/52week/getSchedules?uuid=${uuid}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setPPMSummary({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setPPMSummary({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid]);

  /*  useEffect(() => {
    if (detailData && detailData.ppm_scheduler_ids && detailData.ppm_scheduler_ids.length) {
      setPageData(detailData.ppm_scheduler_ids.slice(0, 10));
    } else {
      setPageData([]);
    }
  }, [ppmOverviewData]); */

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        equipment_id: true,
        name: true,
        state: true,
      });
    }
  }, [visibleColumns]);

  const checkStatus = (val, isHoldRequested, pauseReason, isServiceReport) => (
    <Box>
      {ppmStatusLogJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              width: 'fit-content',
              backgroundColor: status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {isHoldRequested && val !== 'Pause' ? 'On-Hold Requested' : status.text}
          </Box>
        ),
      )}
    </Box>
  );

  const checkStatusMob = (val, isHoldRequested, text) => (
    <Box>
      {ppmStatusLogJson.map(
        (status) => val === status.status && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          >
            <Box
              sx={{
                width: 'fit-content',
                backgroundColor: status.backgroundColor,
                padding: '4px 8px 4px 8px',
                border: 'none',
                borderRadius: '4px',
                color: status.color,
                fontFamily: 'Suisse Intl',
              }}
            >
              {isHoldRequested && val !== 'Pause' ? 'On-Hold Requested' : status.text}
            </Box>
            {text && (
            <Box
              sx={{
                width: 'fit-content',
              }}
            >

              <span className="font-family-tab font-tiny ml-1">
                (
                {text}
                )
              </span>

            </Box>
            )}
          </Box>
        ),
      )}
    </Box>
  );

  const columns = useMemo(() => (
    [
      {
        field: 'equipment_id',
        headerName: 'Asset Name',
        width: 220,
        minWidth: 220,
        editable: false,
        valueGetter: (params) => (params.row.category_type === 'e'
          ? getDefaultNoValue(extractNameObject(params.row.equipment_id, 'name'))
          : getDefaultNoValue(extractNameObject(params.row.space_id, 'space_name'))),
        renderCell: (params) => {
          const equipmentName = getDefaultNoValue(extractNameObject(params.row.equipment_id, 'name'));
          const spaceName = getDefaultNoValue(extractNameObject(params.row.space_id, 'space_name'));
          const locationPathName = getDefaultNoValue(
            params.row.equipment_id && params.row.equipment_id.location_id && params.row.equipment_id.location_id.path_name
              ? extractNameObject(params.row.equipment_id.location_id, 'path_name')
              : '',
          );
          const spacePathName = getDefaultNoValue(
            params.row.space_id && params.row.space_id && params.row.space_id.path_name
              ? extractNameObject(params.row.space_id, 'path_name')
              : '',
          );

          return (
            <div style={{
              display: 'flex', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
            }}
            >
              <h6 className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'e' ? equipmentName : spaceName}</h6>
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'e' ? locationPathName : spacePathName}</p>
            </div>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'name',
        headerName: 'PPM Description',
        width: 390,
        minWidth: 390,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'state',
        headerName: 'PPM Status',
        width: 170,
        minWidth: 170,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.row.state),
        renderCell: (params) => {
          const days = getDifferenceBetweenInDays(params.row.state === 'Missed' ? params.row.ends_on : new Date(), params.row.state === 'Missed' ? false : params.row.ends_on);

          return (
            <div style={{
              display: 'flex', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
            }}
            >
              {checkStatus(params.row.state, params.row.is_on_hold_requested, params.row.pause_reason_id && params.row.pause_reason_id.name ? params.row.pause_reason_id.name : '', params.row.is_service_report_required)}
              {days && params.row.state !== 'Completed' && params.row.state !== 'Pause' && !params.row.is_on_hold_requested && (
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {new Date(params.row.ends_on) < new Date() ? `Elapsed Since ${days} days` : `Due in ${days} days`}
              </p>
              )}
              {params.row.state === 'In Progress' && params.row.is_on_hold_requested && params.row.on_hold_requested_on && (
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {`Requested on ${moment.utc(params.row.on_hold_requested_on).local().format('DD-MMM-YYYY')}`}
              </p>
              )}
              {params.row.state === 'Completed' && params.row.completed_on && (
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {`On ${moment.utc(params.row.completed_on).local().format('DD-MMM-YYYY')}`}
              </p>
              )}
              {params.row.state === 'Pause' && params.row.pause_reason_id && params.row.pause_reason_id.name && (
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.row.pause_reason_id.name}
              </p>
              )}
            </div>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ]), [ppmOverviewData]);

  function getCompleted(data) {
    let res = 0;
    if (data && data.length) {
      const cData = data.filter((item) => item.state === 'Completed');
      if (cData && cData.length) {
        res = cData.length;
      }
    }
    return res;
  }

  const onFilterChange = (data) => {
    if (data.items && data.items.length) {
      setPage(0);
    }
  };

  const onViewChange = (id) => {
    setViewId(id);
    const data = detailData && detailData.ppm_scheduler_ids ? detailData.ppm_scheduler_ids : [];
    const cData = data.filter((item) => item.id === id);
    if (cData && cData.length) {
      setViewData(cData[0]);
    }
  };

  const onViewChangeDynamic = (data) => {
    const tData = data && data.length ? data[0].ppm_scheduler_ids : [];
    const cData = tData.filter((item) => item.id === viewId);
    if (cData && cData.length) {
      setViewData(cData[0]);
    }
  };

  const onResetView = () => {
    if (uuid) {
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/52week/getSchedules?uuid=${uuid}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setPPMSummary({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          console.log(error);
        });
    }
    setViewId(false);
    setViewData(false);
  };

  const onResetView1 = () => {
    if (uuid) {
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/52week/getSchedules?uuid=${uuid}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => {
          setPPMSummary({
            loading: false, data: response.data.data, count: response.data.length, err: null,
          });
          onViewChangeDynamic(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function getStatusDescription(item) {
    let res = '';
    const days = getDifferenceBetweenInDays(item.state === 'Missed' ? item.ends_on : new Date(), item.state === 'Missed' ? false : item.ends_on);
    if (days && item.state !== 'Completed' && item.state !== 'Pause' && !item.is_on_hold_requested) {
      res = new Date(item.ends_on) < new Date() ? `Elapsed Since ${days} days` : `Due in ${days} days`;
    }
    if (item.state === 'In Progress' && item.is_on_hold_requested && item.on_hold_requested_on) {
      res = `On ${moment.utc(item.on_hold_requested_on).local().format('DD-MMM-YYYY')}`;
    }
    if (item.state === 'Completed' && item.completed_on) {
      res = `On ${moment.utc(item.completed_on).local().format('DD-MMM-YYYY')}`;
    }
    if (item.state === 'Pause' && item.pause_reason_id && item.pause_reason_id.name) {
      res = item.pause_reason_id.name;
    }
    return res;
  }

  return (
    <Row className={`${isMobileView ? '' : 'mt-2'} ml-1 mr-1 mb-2 p-3 font-family-tab`}>
      {ppmOverviewData && !ppmOverviewData.loading && detailData && ppmOverviewData.count > 0 && (
        <>
          <Col md={{ size: 8, offset: 2 }} sm="12" lg={{ size: 8, offset: 2 }} xs="12">
            <Card className="mb-2">
              <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-0'}>

                {isMobileView ? (
                  <Row className="text-center">
                    <Col md="12" sm="12" lg="12" xs="12">
                      <img
                        src={detailData.company_id && detailData.company_id.logo ? `data:${detectMimeType(detailData.company_id.logo)};base64,${detailData.company_id.logo}` : getExportLogo()}
                        width="60"
                        height="auto"
                        className="d-inline-block align-top pr-2 image-mobile-custom-responsive"
                        alt="Helixsense Portal"
                      />
                    </Col>
                    <Col md="12" sm="12" lg="12" xs="12">
                      <h5 className="font-family-tab">
                        {getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}
                      </h5>
                      <p className="mb-0 font-family-tab font-tiny">{getDefaultNoValue(extractNameObject(detailData.company_id, 'address'))}</p>
                      {viewId && (
                      <h6 aria-hidden className="text-info font-family-tab text-decoration-underline mb-2 cursor-pointer" onClick={() => onResetView()}>Click here to View All PPMs</h6>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <Row className="content-center">
                    <Col md="10" sm="12" lg="10" xs="12">
                      <h5 className="font-family-tab">
                        {getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}
                      </h5>
                      <p className="mb-0 font-family-tab font-tiny">
                        {getDefaultNoValue(extractNameObject(detailData.company_id, 'address'))}
                        {viewId && (
                        <span aria-hidden className="text-info float-right cursor-pointer font-family-tab text-decoration-underline" onClick={() => onResetView()}>Click here to View All PPMs</span>
                        )}
                      </p>
                    </Col>
                    <Col md="2" sm="12" lg="2" xs="12" className="float-right">
                      <img
                        src={detailData.company_id && detailData.company_id.logo ? `data:${detectMimeType(detailData.company_id.logo)};base64,${detailData.company_id.logo}` : getExportLogo()}
                        width="80"
                        height="auto"
                        className="d-inline-block align-top pr-2 image-new-custom-responsive float-right"
                        alt="Helixsense Portal"
                      />
                    </Col>
                  </Row>
                )}
                <hr className="m-0 border-nepal-1px" />
                <Row className="content-center">
                  <Col md="6" sm="12" lg="6" xs="12">
                    <p className="mb-0 mt-1 font-family-tab font-tiny font-weight-700">
                      Vendor PPM Portal:
                      {' '}
                      {getDefaultNoValue(extractNameObject(detailData.vendor, 'name'))}
                    </p>
                  </Col>
                  <Col md="6" sm="12" lg="6" xs="12" className="">
                    <p className={`mb-0 mt-1 font-family-tab font-tiny font-weight-700 ${isMobileView ? '' : 'float-right'}`}>
                      For the Week:
                      {' '}
                      {getDefaultNoValue(detailData.week)}
                      {' '}
                      (
                      {moment.utc(detailData.starts_on).local().format('DD-MMM-YYYY')}
                      {' '}
                      to
                      {' '}
                      {moment.utc(detailData.ends_on).local().format('DD-MMM-YYYY')}
                      )
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {!viewId && (
            <>
              <Row className={isMobileView ? 'content-center mb-1' : 'content-center mb-2'}>
                <Col md="6" sm="12" lg="6" xs="12" className={isMobileView ? 'mb-2' : 'pr-1'}>
                  <Card className="h-100">
                    <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-0'}>
                      <p className="font-family-tab">Issued To</p>
                      <p className="font-family-tab mb-1 font-weight-700">{getDefaultNoValue(extractNameObject(detailData.vendor, 'name'))}</p>
                      <p className="font-family-tab font-tiny font-weight-700">{getDefaultNoValue(extractNameObject(detailData.vendor, 'email'))}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="6" sm="12" lg="6" xs="12" className={isMobileView ? 'mb-2' : 'pl-1'}>
                  <Card className="h-100">
                    <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-0'}>
                      <Row className="m-0">
                        <Col md="6" sm="6" lg="6" xs="6" className="p-1">
                          <p className="font-family-tab">Overview</p>
                          <h5 className="font-family-tab font-weight-700">
                            {getCompleted(detailData.ppm_scheduler_ids)}
                            {' '}
                            /
                            {' '}
                            {detailData.ppm_scheduler_ids && detailData.ppm_scheduler_ids.length > 0 ? detailData.ppm_scheduler_ids.length : 0}
                          </h5>
                          <p className="mb-1 font-family-tab font-tiny">PPMs Completed</p>
                        </Col>
                        <Col md="6" sm="6" lg="6" xs="6" className={isMobileView ? 'p-0' : 'p-0 text-right'}>
                          <div style={{ height: '65px', width: '65px', marginLeft: 'auto' }}>
                            <CircularProgressbarWithChildren
                              value={newpercalculate(detailData.ppm_scheduler_ids && detailData.ppm_scheduler_ids.length > 0 ? detailData.ppm_scheduler_ids.length : 0, getCompleted(detailData.ppm_scheduler_ids))}
                              strokeWidth={11}
                              styles={buildStyles({
                                textColor: '#3a4354',
                                backgroundColor: '#c1c1c1',
                                pathColor: 'rgb(40, 167, 69)',
                              })}
                            >

                              <div className="font-11 text-grayish-blue">
                                <strong>{`${newpercalculate(detailData.ppm_scheduler_ids && detailData.ppm_scheduler_ids.length > 0 ? detailData.ppm_scheduler_ids.length : 0, getCompleted(detailData.ppm_scheduler_ids))}%`}</strong>
                              </div>
                            </CircularProgressbarWithChildren>
                          </div>
                          <p className="mb-1 mt-1 font-family-tab font-tiny float-right">Completion %</p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <CardBody className={`p-0 mb-2 ${detailData.setting && detailData.setting.length > 0 && detailData.setting[0].instructions ? 'instructions-scroll thin-scrollbar' : ''}`}>
                <Stack>
                  <Alert icon={false} severity="info">
                    <p className="font-family-tab font-tiny">Instructions</p>
                    {detailData.setting && detailData.setting.length > 0 && detailData.setting[0].instructions
                      ? DOMPurify.sanitize(renderHTML(detailData.setting[0].instructions), { USE_PROFILES: { html: true } })
                      : '-'}
                  </Alert>
                </Stack>
              </CardBody>
              {!isMobileView && (
              <CardBody className="p-1">
                <p className="font-family-tab">
                  PPMs
                  {' '}
                  - For the Week:
                  {' '}
                  {getDefaultNoValue(detailData.week)}
                  {' '}
                  (
                  {moment.utc(detailData.starts_on).local().format('DD-MMM-YYYY')}
                  {' '}
                  to
                  {' '}
                  {moment.utc(detailData.ends_on).local().format('DD-MMM-YYYY')}
                  )
                </p>
                <CommonGrid
                  className="reports-table1 font-family-tab"
                  componentClassName="commonGrid"
                  tableData={detailData.ppm_scheduler_ids}
                  page={page}
                  columns={columns}
                  rowCount={detailData.ppm_scheduler_ids.length}
                  limit={limit}
                  checkboxSelection
                  pagination
                  disableRowSelectionOnClick
                  setViewModal={setViewModal}
                  setViewId={onViewChange}
                  exportFileName="Assets Info"
                  listCount={detailData.ppm_scheduler_ids.length}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  onFilterChanges={onFilterChange}
                  loading={false}
                  err={!(detailData.ppm_scheduler_ids.length)}
                  noHeader
                  handlePageChange={handlePageChange}
                />
              </CardBody>
              )}
              {isMobileView && (
                <div className="mb-3">
                  <p className="font-family-tab mb-2 mt-3">
                    PPMs
                    {' '}
                    (
                    {moment.utc(detailData.starts_on).local().format('DD-MMM-YYYY')}
                    {' '}
                    to
                    {' '}
                    {moment.utc(detailData.ends_on).local().format('DD-MMM-YYYY')}
                    )
                  </p>
                  {detailData && detailData.ppm_scheduler_ids && detailData.ppm_scheduler_ids.map((item, index) => (
                    <Card onClick={() => onViewChange(item.id)} key={item.id} className="cursor-pointer mb-2">
                      <CardBody>
                        <table>
                          <tr>
                            <td>
                              <h6 className="font-family-tab mb-2 text-decoration-underline text-info">{getDefaultNoValue(item.name)}</h6>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p className="font-family-tab mb-0">
                                {checkStatusMob(item.state, item.is_on_hold_requested, getStatusDescription(item))}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p className="font-family-tab mb-0">
                                <FontAwesomeIcon className="mr-2" size="xs" icon={faTools} />
                                {getDefaultNoValue(item.category_type === 'e' ? extractNameObject(item.equipment_id, 'name') : extractNameObject(item.space_id, 'space_name'))}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p className="font-family-tab mb-0">
                                <FontAwesomeIcon className="mr-2" size="xs" icon={faLocationPin} />
                                {getDefaultNoValue(item.category_type === 'e' && item.equipment_id && item.equipment_id.location_id ? extractNameObject(item.equipment_id.location_id, 'path_name') : extractNameObject(item.space_id, 'path_name'))}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </CardBody>
                    </Card>
                  ))}

                </div>
              )}
            </>
            )}
            {viewId && viewData && (
            <PpmDetail accid={accid} settings={detailData.setting && detailData.setting.length ? detailData.setting[0] : false} companyData={detailData.company_id} viewId={viewId} ppmData={viewData} onResetView={onResetView} onResetView1={onResetView1} />
            )}

          </Col>
          <div className="fixed-bottom-center cursor-pointer">
            <span className="font-tiny" onClick={() => { setPolicyType('term'); setPolicyModal(true); }}>Terms and Conditions</span>
            {' '}
            |
            {' '}
            <span className="font-tiny" onClick={() => { setPolicyType('disclaimer'); setPolicyModal(true); }}>Disclaimer</span>
          </div>
          <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={policyModal}>
            <DialogHeader title={policyType === 'term' ? 'Terms and Conditions' : 'Disclaimer'} onClose={() => setPolicyModal(false)} response={false} imagePath={false} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F6F8FA',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10%',
                    fontFamily: 'Suisse Intl',
                  }}
                >
                  {policyType === 'term' ? (
                    <div>
                      {detailData.setting && detailData.setting.length > 0 && detailData.setting[0].terms_and_condition
                        ? DOMPurify.sanitize(renderHTML(detailData.setting[0].terms_and_condition), { USE_PROFILES: { html: true } })
                        : '-'}
                    </div>
                  ) : (
                    <div>
                      {detailData.setting && detailData.setting.length > 0 && detailData.setting[0].disclaimer
                        ? DOMPurify.sanitize(renderHTML(detailData.setting[0].disclaimer), { USE_PROFILES: { html: true } })
                        : '-'}
                    </div>
                  )}
                </Box>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
      )}
      {ppmOverviewData && !ppmOverviewData.loading && !ppmOverviewData.count && (
      <Col md={{ size: 8, offset: 2 }} sm="12" lg={{ size: 8, offset: 2 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <div className="text-center mt-3 p-3 vertical-horizontal-center font-family-tab">
          <Stack>
            <Alert severity="error">Oops! Your request is invalid</Alert>
          </Stack>
        </div>
      </Col>
      )}
      {ppmOverviewData && ppmOverviewData.loading && (
      <Col md={{ size: 8, offset: 2 }} sm="12" lg={{ size: 8, offset: 2 }} xs="12" className={isMobileView ? 'pl-0' : ''}>
        <div className="text-center mt-3 p-3 vertical-horizontal-center">
          <DetailViewFormat detailResponse={ppmOverviewData} />
        </div>
      </Col>
      )}
    </Row>
  );
};

PpmSummary.defaultProps = {
  match: false,
};

PpmSummary.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default PpmSummary;
