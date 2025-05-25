import React from 'react';
import { Table } from 'antd';
import '../dashboard.scss';

const dateFormat = 'MM/DD/YYYY';

const InventoryTable = ({
  dateRange, data, filter, selectedFilter,
}) => {
  const columns = [
    {
      title: <div className="font-weight-bold font-size-11">Site</div>,
      dataIndex: 'site',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Warehouse</div>,
      dataIndex: 'warehouse',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Product</div>,
      dataIndex: 'product',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Status</div>,
      dataIndex: 'status',
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
      scroll={{ y: 160 }}
    />
  );
};

export default InventoryTable;
