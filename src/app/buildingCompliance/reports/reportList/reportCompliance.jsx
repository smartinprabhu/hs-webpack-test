/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card, CardBody, Col, Row, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
} from 'antd';

import ExportList from '@shared/listViewFilters/export';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getCompanyTimezoneDate,
  getListOfModuleOperations, getDefaultNoValue, getArrayToCommaValues, extractNameObject,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId,
} from '../../../preventiveMaintenance/ppmService';
import { resetComplianceReport } from '../../complianceService';
import { getComplianceStateText } from '../../utils/utils';
import actionCodes from '../data/actionCodes.json';
import DataExport from '../dataExport/dataExport';

const reportCompliance = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    complianceReportInfo,
  } = useSelector((state) => state.compliance);
  const {
    typeId,
  } = useSelector((state) => state.ppm);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Compliance Report Export']);

  function getkey(array) {
    for (let i = 0; i < array.length; i += 1) {
      array[i].key = i;
      array[i].nextExpiryDate = getDefaultNoValue(getCompanyTimezoneDate(array[i].next_expiry_date, userInfo, 'datetime'));
      array[i].complianceAct = getDefaultNoValue(extractNameObject(array[i].compliance_act, 'name'));
      array[i].stateNew = getComplianceStateText(array[i].state);
      if (array[i].applies_to === 'Location') {
        array[i].locate = getDefaultNoValue(array[i].location_ids && getArrayToCommaValues(array[i].location_ids, 'path_name'));
      }
      if (array[i].applies_to === 'Site') {
        array[i].locate = getDefaultNoValue(array[i].company_ids && getArrayToCommaValues(array[i].company_ids, 'name'));
      }
      if (array[i].applies_to === 'Asset') {
        array[i].locate = getDefaultNoValue(array[i].asset_ids && getArrayToCommaValues(array[i].asset_ids, 'name'));
      }
    }
    return array;
  }

  const dataGroup = complianceReportInfo && complianceReportInfo.data && complianceReportInfo.data.length ? getkey(complianceReportInfo.data) : [];

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetComplianceReport());
    dispatch(getTypeId());
    if (afterReset) afterReset();
  };

  const loading = (userInfo && userInfo.loading) || (complianceReportInfo && complianceReportInfo.loading);

  let errorText = <div />;
  if ((!loading)
    && ((complianceReportInfo && complianceReportInfo.err) || (complianceReportInfo && complianceReportInfo.data && !complianceReportInfo.data.length))) {
    errorText = '';
  } else if (!loading && typeId && !typeId.statusValue && !typeId.expiryValue && typeId.complianceValue && typeId.complianceValue.length <= 0) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT STATUS OR COMPLIANCE ACT OR EXPIRY DATE" />
    );
  }
  const isError = !!(complianceReportInfo && complianceReportInfo.data && complianceReportInfo.data.length <= 0);
  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  function getNewData(array) {
    const asset = [];
    for (let i = 0; i < array.length; i += 1) {
      array[i].logDate = getCompanyTimezoneDate(array[i].log_date, userInfo, 'datetime');
      array[i].userId = getDefaultNoValue(extractNameObject(array[i].user_id, 'name'));
      asset.push(array[i]);
    }
    return asset;
  }

  const expandedRow = (row) => {
    const columnList = [
      {
        title: 'Date',
        dataIndex: 'logDate',
        key: 'logDate',
        sorter: (a, b) => new Date(a.validated_on) - new Date(b.validated_on),
      },
      {
        title: 'Description', dataIndex: 'description', key: 'description',
      },
      {
        title: 'Status', dataIndex: 'stage', key: 'stage',
      },
      {
        title: 'User', dataIndex: 'userId', key: 'userId',
      },
    ];

    const inTable = row && row.compliance_log_ids && row.compliance_log_ids.length ? getNewData(row.compliance_log_ids) : [];

    const tableList = (
      <Table
        columns={columnList}
        dataSource={inTable}
        bordered
        size="middle"
        scroll={{ x: 'calc(100px + 50%)', y: 240 }}
      />
    );

    return tableList;
  };

  const columns = [
    {
      title: 'Compliance Act', dataIndex: 'complianceAct', key: 'complianceAct',
    },
    {
      title: 'Status', dataIndex: 'stateNew', key: 'stateNew',
    },
    {
      title: 'Next Expiry Date', dataIndex: 'nextExpiryDate', key: 'nextExpiryDate',
    },
    {
      title: 'Applies to', dataIndex: 'applies_to', key: 'applies_to',
    },
    {
      title: 'Asset/Location/Site', dataIndex: 'locate', key: 'locate',
    },
  ];

  return (
    <>
      <Card className={collapse ? 'filter-margin-right p-1 bg-lightblue h-100 audit-reports' : 'audit-reports p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              <div className="content-inline">
                <span className="p-0 mr-2 font-medium">
                  <>
                    <span onClick={() => redirectToAllReports()} aria-hidden="true" className="cursor-pointer font-weight-800">
                      All Reports
                      {' '}
                      /
                      {' '}
                    </span>
                    <span className="font-weight-500">
                      {reportName}
                      {' '}
                    </span>
                  </>
                </span>
                <span className="float-right">
                  {isExportable && (
                    <>
                      <ExportList response={!loading && dataGroup && dataGroup.length && dataGroup.length > 0} />
                      <Popover className="export-popover" placement="bottom" isOpen={filterInitailValues.download} target="Export">
                        <PopoverHeader>
                          Export
                          <img
                            aria-hidden="true"
                            alt="close"
                            src={closeCircleIcon}
                            onClick={() => dispatch(setInitialValues(false, false, false, false))}
                            className="cursor-pointer mr-1 mt-1 float-right"
                          />
                        </PopoverHeader>
                        <PopoverBody>
                          <div className="p-2">
                            <DataExport
                              afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                              assetsList={dataGroup}
                              dateFilter={selectedReportDate}
                            />
                          </div>
                        </PopoverBody>
                      </Popover>
                    </>
                  )}
                </span>
              </div>
            </Col>
          </Row>
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              {!loading && dataGroup && dataGroup.length && dataGroup.length > 0 ? (
                <Table
                  className="components-table-demo-nested"
                  columns={columns}
                  tableLayout="fixed"
                  size="middle"
                  pagination={false}
                  expandedRowRender={expandedRow}
                  dataSource={dataGroup}
                  scroll={{ y: 'calc(100vh - 200px)' }}
                />
              ) : ''}
              {loading && (
                <div className="mb-3 mt-3 text-center">
                  <Loader />
                </div>
              )}
            </Col>
          </Row>
          {(complianceReportInfo && complianceReportInfo.err) && (
            <ErrorContent errorTxt={generateErrorMessage(complianceReportInfo)} />
          )}
          {(isError) && (
            <ErrorContent errorTxt="No Data Found" />
          )}
          {errorText}
        </CardBody>
      </Card>
    </>
  );
});

reportCompliance.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportCompliance.defaultProps = {
  collapse: false,
};

export default reportCompliance;
