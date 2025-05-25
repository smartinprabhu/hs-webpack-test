/* eslint-disable react/prop-types */
import React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

/* const columns = [
  {
    field: 'equipmentName',
    headerName: 'Equipment name',
    width: 160,
    editable: true,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'space',
    headerName: 'Space',
    width: 200,
    editable: true,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'amcStartDate',
    headerName: 'AMC Start date',
    width: 140,
    editable: true,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'amcEndDate',
    headerName: 'AMC End date',

    width: 140,
    editable: true,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'warrantyStart',
    headerName: 'Full name',
    editable: true,
    width: 140,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'warrantyEnd',
    headerName: 'Warranty End',
    editable: true,
    width: 140,
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'startDate',
    headerName: 'Start date',
    editable: true,
    width: 140,
    headerClassName: 'super-app-theme--header',
  },
];

const rows = [
  {
    id: 1,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
  {
    id: 2,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
  {
    id: 3,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
  {
    id: 4,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
  {
    id: 5,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
  {
    id: 6,
    equipmentName: '120KVC UPS',
    space: 'MCLD/DC/F6/UPS Room',
    amcStartDate: '2022-02-01',
    amcEndDate: '2022-02-01',
    warrantyStart: '2022-02-01',
    warrantyEnd: '2022-02-01',
    startDate: '2022-02-01',
  },
]; */

const GridTable = React.memo((props) => {
  const { columns, rows } = props;

  console.log(columns);
  console.log(rows);

  return (
    <DataGridPro
      sx={{
        '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel':
              {
                'margin-top': '1em',
                'margin-bottom': '1em',
              },
      }}
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      autoHeight
      getRowClassName={(params) => 'super-app-theme--Open'}
      pagination
    />
  );
});

export default GridTable;
