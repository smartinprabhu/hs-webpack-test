/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import { Table } from 'antd';


const CriticalAlarmTable = ({
  loading,
  data,
}) => {
  const columns = [
    {
      title: <div className="font-weight-bold font-size-11">Site</div>,
      dataIndex: 'site',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Equipment</div>,
      dataIndex: 'equipment',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Time Elapsed</div>,
      dataIndex: 'time_elapsed',
      className: 'font-weight-normal table-column font-size-11 text-danger',
    },
    {
      title: <div className="font-weight-bold font-size-11">Condition</div>,
      dataIndex: 'condition',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Risk</div>,
      dataIndex: 'risk',
      className: 'font-weight-normal table-column font-size-11 text-danger',
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      loading={loading}
      rowKey="id"
      columns={columns}
      pagination={false}
      scroll={{ y: 720 }}
    />
  );
};

export default CriticalAlarmTable;
