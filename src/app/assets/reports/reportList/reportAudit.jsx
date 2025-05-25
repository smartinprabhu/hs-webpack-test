/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
} from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getCompanyTimezoneDate,
  getListOfModuleOperations, getAllCompanies, getDateAndTimeForDifferentTimeZones
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import { resetAuditReport } from '../../equipmentService';
import { getExtraSelectionMultiple, resetExtraMultipleList } from '../../../helpdesk/ticketService';
import { getGroupByLabel, getGroupByCountName, getValidationTypesText } from '../../utils/utils';
import actionCodes from '../data/actionCodes.json';
import DataExport from '../dataExport/dataExport';

const appModels = require('../../../util/appModels').default;

const reportAudit = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    auditInfo,
  } = useSelector((state) => state.equipment);
  const {
    listDataMultipleInfo,
  } = useSelector((state) => state.ticket);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { auditReportFiltersInfo } = useSelector((state) => state.equipment);

  const getFindData = (field) => {
    const result = auditReportFiltersInfo.customFilters && auditReportFiltersInfo.customFilters.length && auditReportFiltersInfo.customFilters.find((cFilter) => cFilter.title === field)
    return result ? result : ''
  }

  const getFindDate = (field) => {
    const result = auditReportFiltersInfo.customFilters && auditReportFiltersInfo.customFilters.length && auditReportFiltersInfo.customFilters.find((cFilter) => cFilter.key === field)
    return result ? result.value : [null, null]
  }

  const fields = ['name', 'category_id', 'validated_on', 'validated_by', 'validation_status', 'next_audit_on', 'vendor_id', 'maintenance_team_id'];
  const groupField = getFindData('Group By') ? getFindData('Group By').value : '';
  const dateFilter = getFindDate('validated_on');
  const status = getFindData('By Validated Status') ? getFindData('By Validated Status').value : '';
  const [assetsList, setAssets] = useState([]);

  const companies = getAllCompanies(userInfo, userRoles);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Audit Report Export']);

  function getkey(array) {
    for (let i = 0; i < array.length; i += 1) {
      array[i].key = i;
    }
    return array;
  }

  const dataGroup = auditInfo && auditInfo.data && auditInfo.data.length
    ? getkey(auditInfo.data) : [];

  const redirectToAllReports = () => {
    setAssets([]);
    dispatch(getReportId());
    dispatch(resetAuditReport());
    dispatch(resetExtraMultipleList());
    if (afterReset) afterReset();
  };

  function getColumnArrayByField(array, col) {
    // eslint-disable-next-line prefer-const
    let column = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][col] && array[i][col].length > 0) {
        column.push(array[i][col][0]);
      }
    }
    return column;
  }

  useEffect(() => {
    if (dataGroup && dataGroup.length > 0) {
      const groupIds = getColumnArrayByField(dataGroup, groupField);

      let dateStart = '';
      let dateEnd = '';

      if (dateFilter && dateFilter.length && dateFilter[0]) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, dateFilter[0].$d, dateFilter[1].$d)
        dateStart = dateRangeObj[0];
        dateEnd = dateRangeObj[1];
      }

      let searchValueMultiple = `[["company_id","in",[${companies}]],["${groupField}", "in", [${groupIds}]], ["validation_status","=","${status}"]`;

      if (dateStart && dateEnd) {
        searchValueMultiple = `${searchValueMultiple},["validated_on",">=","${dateStart}"],["validated_on","<=","${dateEnd}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;

      dispatch(getExtraSelectionMultiple(companies, appModels.EQUIPMENT, 800, 0, fields, searchValueMultiple, true));
    }
  }, [dataGroup]);

  function getNewData(array) {
    const asset = [];
    for (let i = 0; i < array.length; i += 1) {
      array[i].validatedOn = getCompanyTimezoneDate(array[i].validated_on, userInfo, 'datetime');
      array[i].next_auditOn = getCompanyTimezoneDate(array[i].next_audit_on, userInfo, 'datetime');
      array[i].validationStatus = getValidationTypesText(array[i].validation_status);
      asset.push(array[i]);
    }
    return asset;
  }

  useEffect(() => {
    if (listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length > 0) {
      const arr = getNewData(listDataMultipleInfo.data);
      setAssets(arr);
    }
  }, [listDataMultipleInfo]);

  const loading = (userInfo && userInfo.loading) || (auditInfo && auditInfo.loading) || (listDataMultipleInfo && listDataMultipleInfo.loading);

  let errorText = <div />;
  if (!loading
    && ((auditInfo && auditInfo.err) || (auditInfo && auditInfo.data && !auditInfo.data.length))) {
    errorText = '';
  } else if (!loading && dateFilter && dateFilter.length && dateFilter[0] === null) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT VALIDATED ON" />
    );
  }
  else if (!loading && !groupField) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT GROUP BY" />
    );
  }
  const selectedReportDate = dateFilter && dateFilter.length && dateFilter[0] !== null
    ? `${getCompanyTimezoneDate(dateFilter[0].$d, userInfo, 'date')} - ${getCompanyTimezoneDate(dateFilter[1].$d, userInfo, 'date')}` : '';

  const expandedRow = (row) => {
    const columnAssetList = [
      {
        title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name), width: 150, fixed: 'left',
      },
      {
        title: 'Validated On',
        dataIndex: 'validatedOn',
        key: 'validated_on',
        width: 180,
        sorter: (a, b) => new Date(a.validated_on) - new Date(b.validated_on),
      },
      {
        title: 'Validate By', dataIndex: ['validated_by', '1'], key: 'validated_by', width: 150, sorter: (a, b) => a.validated_by - b.validated_by,
      },
      {
        title: 'Validation Status', dataIndex: 'validationStatus', key: 'validation_status', width: 180, sorter: (a, b) => a.validation_status - b.validation_status,
      },
      {
        title: 'Next Audit On', dataIndex: 'next_auditOn', key: 'next_audit_on', width: 180, sorter: (a, b) => new Date(a.next_audit_on) - new Date(b.next_audit_on),
      },
      {
        title: 'Category', dataIndex: ['category_id', '1'], key: 'category_id', width: 150, sorter: (a, b) => a.category_id - b.category_id,
      },
      {
        title: 'Vendor', dataIndex: ['vendor_id', '1'], key: 'vendor_id', width: 150, sorter: (a, b) => a.vendor_id - b.vendor_id,
      },
      {
        title: 'Maintenance Team', dataIndex: ['maintenance_team_id', '1'], key: 'maintenance_team_id', width: 180, sorter: (a, b) => a.maintenance_team_id - b.maintenance_team_id,
      },
    ];

    const data = assetsList && assetsList.length ? assetsList : [];

    const inTable = data.filter((item) => item[groupField][0] === row[groupField][0]);

    const loadingData = listDataMultipleInfo && listDataMultipleInfo.loading;

    let tableList = '';
    if (loadingData) {
      tableList = <Loader />;
    } else if (listDataMultipleInfo && listDataMultipleInfo.err) {
      tableList = <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />;
    } else {
      tableList = (
        <Table
          className="reportAntdTable"
          columns={columnAssetList}
          dataSource={inTable}
          bordered
          size="middle"
          scroll={{ x: 'calc(100px + 50%)', y: 240 }}
        />
      );
    }

    return tableList;
  };

  const columns = [
    {
      title: getGroupByLabel(groupField), dataIndex: [groupField, '1'], key: [groupField, '1'],
    },
    {
      title: 'Count', dataIndex: getGroupByCountName(groupField), key: getGroupByCountName(groupField),
    },
  ];

  return (
    <>
      <Card className={'border-0 audit-reports p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              <div className="content-inline">
                {selectedReportDate && (
                  <span className={'ml-3 pl-1 font-weight-800 font-size-13'}>
                    Validated On :
                    {' '}
                    {selectedReportDate}
                  </span>
                )}
                <DataExport
                  afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                  assetsList={assetsList}
                  isAuditReport
                  groupBy={getGroupByLabel(groupField)}
                  dateFilter={selectedReportDate}
                  exportType={exportType}
                  exportTrue={exportTrue}
                />
              </div>
            </Col>
          </Row>
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              {!loading && dataGroup && dataGroup.length && dataGroup.length > 0 ? (
                <Table
                  className="components-table-demo-nested reportAntdTable"
                  columns={columns}
                  tableLayout="fixed"
                  size="middle"
                  pagination={false}
                  expandedRowRender={expandedRow}
                  dataSource={dataGroup}
                />
              ) : ''}
              {loading && (
                <div className="mb-3 mt-3 text-center">
                  <Loader />
                </div>
              )}
            </Col>
          </Row>
          {(auditInfo && auditInfo.err) && (
            <ErrorContent errorTxt={generateErrorMessage(auditInfo)} />
          )}
          {errorText}
        </CardBody>
      </Card>
    </>
  );
});

reportAudit.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportAudit.defaultProps = {
  collapse: false,
};

export default reportAudit;
