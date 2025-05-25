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
  generateErrorMessage,
  getListOfModuleOperations, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import { resetWarrentyAgeReport } from '../../equipmentService';
import {
  getGroupByLabel, getGroupByExpiryDate, getExpiryAge, getExpiredSince, getGroupByExpiryTotal, getGroupByExpiredCount,
} from '../../utils/utils';
import DataExport from '../dataExport/dataExport';
import { groupByMultiple } from '../../../util/staticFunctions';

const reportChecklistNew = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    warrentyAgeInfo,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const groupField = 'vendor_id';
  const [assetsList, setAssets] = useState([]);
  const [vendorGroupList, setVendorGroup] = useState([]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isExportable = true;

  const redirectToAllReports = () => {
    setAssets([]);
    dispatch(getReportId());
    dispatch(resetWarrentyAgeReport());
    if (afterReset) afterReset();
  };

  function getNewDataCategory(array1) {
    const asset = [];
    for (let i = 0; i < array1.length; i += 1) {
      array1[i][0].key = i;
      asset.push(array1[i][0]);
    }
    return asset;
  }

  function getNewData(array) {
    const asset = [];
    for (let i = 0; i < array.length; i += 1) {
      array[i].warrantyEndDate = getCompanyTimezoneDate(array[i].warranty_end_date, userInfo, 'date');
      array[i].expiryAge = getExpiryAge(array[i].warranty_end_date);
      array[i].expiredSince = getExpiredSince(array[i].warranty_end_date);
      array[i].expiredIn = getExpiredSince(array[i].warranty_end_date);
      asset.push(array[i]);
    }
    return asset;
  }

  useEffect(() => {
    if (warrentyAgeInfo && warrentyAgeInfo.data && warrentyAgeInfo.data.length && warrentyAgeInfo.data.length > 0) {
      const arr = getNewData(warrentyAgeInfo.data);
      setAssets(arr);
      const rdata = groupByMultiple(warrentyAgeInfo.data, (obj) => obj.vendor_id);
      setVendorGroup(rdata && rdata.length ? getNewDataCategory(rdata) : []);
    }
  }, [warrentyAgeInfo]);

  const loading = (userInfo && userInfo.loading) || (warrentyAgeInfo && warrentyAgeInfo.loading);

  const expandedRow = (row) => {
    const columnAssetList = [
      {
        title: 'Equipment Name', dataIndex: 'name', key: 'name', width: 150,
      },
      {
        title: 'Location', dataIndex: ['location_id', '1'], key: 'location_id', width: 180,
      },
      {
        title: 'Team', dataIndex: ['maintenance_team_id', '1'], key: 'maintenance_team_id', width: 150,
      },
      {
        title: 'Expiry Date', dataIndex: 'warrantyEndDate', key: 'warrantyEndDate', width: 150,
      },
      {
        title: 'Age', dataIndex: 'expiryAge', key: 'expiryAge', width: 150,
      },
      {
        title: 'Expiration', dataIndex: 'expiredSince', key: 'expiredSince', width: 150,
      },
    ];
    const data = assetsList && assetsList.length ? assetsList : [];
    const inTable = data.filter((item) => item[groupField][0] === row[groupField][0]);
    const loadingData = (warrentyAgeInfo && warrentyAgeInfo.loading);

    let tableList = '';
    if (loadingData) {
      tableList = <Loader />;
    } else if (warrentyAgeInfo && warrentyAgeInfo.err) {
      tableList = <ErrorContent errorTxt={generateErrorMessage(warrentyAgeInfo)} />;
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

  const groupdata = warrentyAgeInfo && warrentyAgeInfo.data ? groupByMultiple(warrentyAgeInfo.data, (obj) => obj.vendor_id) : [];

  const columns = [
    {
      title: getGroupByLabel(groupField), dataIndex: [groupField, '1'], key: [groupField, '1'],
    },
    {
      title: 'Expired',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiredCount(text, groupdata, 'expire')}
          {' '}
        </div>
      ),
    },
    {
      title: '1 - 30',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiryDate(text, groupdata, '30')}
          {' '}
        </div>
      ),
    },
    {
      title: '31 - 60',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiryDate(text, groupdata, '60')}
          {' '}
        </div>
      ),
    },
    {
      title: '61 - 90',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiryDate(text, groupdata, '90')}
          {' '}
        </div>
      ),
    },
    {
      title: '91 - 120',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiryDate(text, groupdata, '120')}
          {' '}
        </div>
      ),
    },
    {
      title: '120<',
      dataIndex: [groupField, '0'],
      key: [groupField, '0'],
      render: (text) => (
        <div>
          {' '}
          {getGroupByExpiryDate(text, groupdata, '120<')}
          {' '}
        </div>
      ),
    },
  ];

  const warrantyAllData = warrentyAgeInfo && warrentyAgeInfo.data && warrentyAgeInfo.data.length ? warrentyAgeInfo.data : [];

  const columnsFooter = [
    {
      title: '',
      render: () => (
        <div>
          {' '}
          Total
          {' '}
        </div>
      ),
    },
    {
      title: '',
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, 'expire')}
          {' '}
        </div>
      ),
    },
    {
      title: '',
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, '30')}
          {' '}
        </div>
      ),
    },
    {
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, '60')}
          {' '}
        </div>
      ),
    },
    {
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, '90')}
          {' '}
        </div>
      ),
    },
    {
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, '120')}
          {' '}
        </div>
      ),
    },
    {
      render: () => (
        <div>
          {' '}
          {getGroupByExpiryTotal(warrantyAllData, '120<')}
          {' '}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className={'border-0 warenty-age-reports p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <DataExport
            afterReset={() => dispatch(setInitialValues(false, false, false, false))}
            assetsList={assetsList}
            isWarrantyAge
            groupBy='By Vendor'
            exportType={exportType}
            exportTrue={exportTrue}
          />
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              {!loading && warrentyAgeInfo && !warrentyAgeInfo.err && vendorGroupList && vendorGroupList.length && vendorGroupList.length > 0 ? (
                <Table
                  className="components-table-demo-nested reportAntdTable"
                  columns={columns}
                  tableLayout="fixed"
                  size="middle"
                  pagination={false}
                  expandedRowRender={expandedRow}
                  dataSource={vendorGroupList}
                  footer={() => (
                    <Table
                      className="footerWarranty"
                      dataSource={[1]}
                      tableLayout="fixed"
                      size="middle"
                      expandedRowRender={expandedRow}
                      pagination={false}
                      showHeader={false}
                      columns={columnsFooter}
                    />
                  )}
                />
              ) : ''}
              {loading && (
                <div className="mb-3 mt-3 text-center">
                  <Loader />
                </div>
              )}
            </Col>
          </Row>
          {(warrentyAgeInfo && warrentyAgeInfo.err) && (
            <ErrorContent errorTxt={generateErrorMessage(warrentyAgeInfo)} />
          )}
        </CardBody>
      </Card>
    </>
  );
});

reportChecklistNew.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportChecklistNew.defaultProps = {
  collapse: false,
};

export default reportChecklistNew;
