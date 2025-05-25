/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  UncontrolledTooltip,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';

import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import ExportList from '@shared/listViewFilters/export';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import ReportSideFilter from './ReportList/sideFilter';
import { getMaterialsReceivedInfo } from '../inventoryService';
import {
  getCompanyTimezoneDate, getDefaultNoValue,
} from '../../util/appUtils';
import customData from './data/customData.json';
import { setInitialValues } from '../../purchase/purchaseService';
import DataExport from './dataExport/dataExport';
import DataHeaders from './dataExport/tablefields.json';

const MaterialsReceivedReport = () => {
  const {
    materialReceived,
  } = useSelector((state) => state.inventory);

  const [collapse, setCollapse] = useState(false);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [date, changeDate] = useState(false);
  const [dateHeaders, setDateHeaders] = useState(false);
  const [exportData, setExportData] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const loading = materialReceived && materialReceived.loading;

  const dispatch = useDispatch();
  useEffect(() => {
    if (date && date.length) {
      const days = moment(date[1]).diff(moment(date[0]), 'days');
      const dates = [];
      for (let i = 0; i <= days; i += 1) {
        dates.push(`${moment(date[0]).add(i, 'days').format('DD')}`);
      }
      setDateHeaders(dates);
    }
  }, [date]);
  useEffect(() => {
    if (date && date.length) {
      const timeZone = userInfo && userInfo.data && userInfo.data.timezone ? userInfo.data.timezone : 'Asia/Kolkata';
      let start; let
        end;
      if (date && date.length) {
        start = `${moment(date[0]).utc().tz(timeZone).format('YYYY-MM-DD')} 00:00:00`;
        end = `${moment(date[1]).utc().tz(timeZone).format('YYYY-MM-DD')} 23:59:59`;
      }
      dispatch(getMaterialsReceivedInfo(start, end));
    }
  }, [date]);

  function headers() {
    const headings = [];
    dateHeaders && dateHeaders.map((head) => {
      const obj = {
        heading: head,
        property: head,
      };
      headings.push(obj);
    });
    const array = DataHeaders.MaterialReceivedStartHeadings.concat(headings, DataHeaders.MaterialReceivedEndHeadings);
    return array;
  }

  useEffect(() => {
    if (materialReceived && materialReceived.data) {
      const array = [];
      materialReceived.data.map((data) => {
        let finalObj = {};
        data.date.map((dateObj) => {
          finalObj = { ...finalObj, ...dateObj, ...data };
        });
        array.push(finalObj);
      });
      setExportData(array);
    }
  }, [materialReceived]);

  return (
    <>
      <Row className="pt-0">
        <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
          {collapse && (
            <>
              <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
              <UncontrolledTooltip target="filters" placement="right">
                Filters
              </UncontrolledTooltip>
            </>
          )}
          <Card className={collapse ? 'd-none filter-margin-right side-filters-list' : 'p-1 bg-lightblue h-100 side-filters-list'} onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
            <CardTitle className="mt-2 ml-2 mb-1 mr-2">
              <Row lg="12" sm="12" md="12">
                <Col lg="10" sm="10" md="10" className="mr-0">
                  <h5>
                    Material Received Report
                  </h5>
                </Col>
                {filtersIcon && (
                <Col lg="2" sm="2" md="2" className="mt-1">
                  <img
                    src={collapseIcon}
                    height="25px"
                    aria-hidden="true"
                    width="25px"
                    alt="Collapse"
                    onClick={() => setCollapse(!collapse)}
                    className="cursor-pointer collapse-icon-margin-left"
                    id="collapse"
                  />
                  <UncontrolledTooltip target="collapse" placement="right">
                    Collapse
                  </UncontrolledTooltip>
                </Col>
                )}
              </Row>
              <hr className="m-0 ml-n2 mr-n2 border-color-grey" />
            </CardTitle>
            <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
              <ReportSideFilter date={date} changeDate={changeDate} />
            </CardBody>
          </Card>
        </Col>
        <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
          <Card className="p-2 mb-2 bg-lightblue h-100 material-received-table-card">
            <CardBody className="p-1 bg-color-white m-0">
              <Row className="p-2">
                <Col md="11" xs="12" sm="11" lg="11">
                  <div className="content-inline">
                    {date && date.length && (
                    <span className="p-0 mr-2 font-medium">
                      <span className="h4">
                        Material Received Report
                      </span>
                      <span className={date ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                        Report Date :
                        {' '}
                        {getCompanyTimezoneDate(date[0], userInfo, 'date')}
                        {' '}
                        -
                        {' '}
                        {getCompanyTimezoneDate(date[1], userInfo, 'date')}
                      </span>
                    </span>
                    )}
                  </div>
                </Col>
                <Col md="1" xs="12" sm="1" lg="1">
                  {!loading && materialReceived && materialReceived.data && date && date.length && (
                  <div className="float-right">
                    <ExportList response={!loading && materialReceived && materialReceived.data && date && date.length > 0} />

                    <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                      <PopoverHeader>
                        Export
                        <img
                          aria-hidden="true"
                          src={closeCircleIcon}
                          className="cursor-pointer mr-1 mt-1 float-right"
                          onClick={() => dispatch(setInitialValues(false, false, false, false))}
                          alt="close"
                        />
                      </PopoverHeader>
                      <PopoverBody>

                        <div className="p-2">
                          <DataExport
                            afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                            dateFilter={date}
                            headers={headers()}
                            exportData={exportData}
                          />
                        </div>
                      </PopoverBody>
                    </Popover>
                  </div>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
                <Col md="12" sm="12" lg="12" xs="12">
                  {date ? (
                    <>
                      {materialReceived && materialReceived.loading && (
                        <Loader />
                      )}
                      {materialReceived && materialReceived.data && (
                      <div className="p-3 mt-2">

                        <div className="thin-scrollbar">

                          <Table responsive bordered>
                            <thead className="bg-gray-light">
                              <tr>
                                {customData.MaterialReceivedStartHeadings && customData.MaterialReceivedStartHeadings.map((head) => (
                                  <th className="min-width-100" key={head.label}>
                                    {head.label}
                                  </th>
                                ))}
                                {dateHeaders && dateHeaders.length && dateHeaders.map((dateObj) => (
                                  <th key={dateObj.id}>
                                    {dateObj}
                                  </th>
                                ))}
                                {customData.MaterialReceivedEndHeadings && customData.MaterialReceivedEndHeadings.map((head) => (
                                  <th className={head.label === 'Total Stock Received' ? 'min-width-120' : 'min-width-100'} key={head.label}>
                                    {head.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {materialReceived && materialReceived.data && materialReceived.data.length && materialReceived.data.map((data) => (
                                <tr>
                                  <>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data['Sl No'])}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data['Material Name'])}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data.UOM)}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data['Vendor Name'])}</span></td>
                                    {data && data.date && data.date.length && data.date.map((dateObj) => (
                                      <>
                                        <td><span className="font-weight-400">{getDefaultNoValue(Object.values(dateObj)[0])}</span></td>
                                      </>
                                    ))}
                                    <td className="min-width-120"><span className="font-weight-400">{getDefaultNoValue(data['Total Stock Received'])}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data['Units/Qty'])}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">
                                      {getDefaultNoValue(data['Unit Rate'].toFixed(2))}</span></td>
                                    <td className="min-width-100"><span className="font-weight-400">{getDefaultNoValue(data['Total Cost'].toFixed(2))}</span></td>
                                  </>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      )}
                    </>
                  ) : (
                    <>
                      <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />
                    </>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default MaterialsReceivedReport;
