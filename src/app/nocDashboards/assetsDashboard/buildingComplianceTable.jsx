/* eslint-disable react/prop-types */
import React from 'react';
import { Table } from 'antd';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const BuildingComplianceTable = ({ dateRange, data }) => {
  const columns = [
    {
      title: <div className="font-weight-bold font-size-11">Building</div>,
      dataIndex: 'building',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Floor</div>,
      dataIndex: 'floor',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: (
        <div className="font-weight-bold font-size-11">Certificate Type</div>
      ),
      dataIndex: 'certificate_type',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: (
        <div className="font-weight-bold font-size-11">Certificate Status</div>
      ),
      dataIndex: 'certificate_status',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Action</div>,
      dataIndex: 'action',
      className: 'font-weight-normal table-column font-size-11',
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      rowKey="id"
      columns={columns}
      pagination={false}
      scroll={{ y: 150 }}
    />
  );
};

export default BuildingComplianceTable;
