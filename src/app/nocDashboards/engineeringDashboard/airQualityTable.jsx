/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import { Table } from 'antd';


const AirQualityTable = ({
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
      title: <div className="font-weight-bold font-size-11">Space/Floor</div>,
      dataIndex: 'space_or_floor',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Device</div>,
      dataIndex: 'device',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: (
        <div className="font-weight-bold font-size-11">Temperature (C)</div>
      ),
      dataIndex: 'temperature',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">IAQ</div>,
      render: (_, record) => (record.temperature < 45 ? (
        <div className="text-success">
          <i className="fa fa-smile-o font-size-18" />
          <br />
          Good (45)
        </div>
      ) : (
        <div className="text-danger">
          <i className="fa fa-frown-o font-size-18" />
          <br />
          Bad (45)
        </div>
      )),
      className: 'font-weight-normal table-column text-center font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">PM 2.5 (PPM)</div>,
      render: (_, record) => (record.pm25 < 10 ? (
        <div className="text-success">
          <i className="fa fa-smile-o font-size-18" />
          {' '}
          <br />
          Good (10)
        </div>
      ) : (
        <div className="text-danger">
          <i className="fa fa-frown-o font-size-18" />
          <br />
          Bad (10)
        </div>
      )),
      className: 'font-weight-normal table-column text-center font-size-11',
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
      scroll={{ y: 60 }}
    />
  );
};

export default AirQualityTable;
