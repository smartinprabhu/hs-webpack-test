import {
  getGridNumericOperators,
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import { Tooltip } from 'antd';
import React from 'react';
import {
  Button,
} from 'reactstrap';

import {
  faCopy,
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { numToFloat, getBoolean, getCompanyTimezoneDateForColumns } from '../../util/appUtils';
import customDataJson from '../../purchase/products/data/customData.json';

const getValue = (value) => {
  let fieldValue = value || '-';
  if (Array.isArray(fieldValue)) {
    fieldValue = value[1];
  }
  return fieldValue;
};

const getType = (type) => {
  const filteredType = customDataJson.productType.filter((data) => data.value === type);
  if (filteredType && filteredType.length) {
    return filteredType[0].label;
  }
  return '-';
};

const getStateStyle = (state) => {
  if (state === 'Registered') {
    return 'text-info';
  } if (state === 'Approved') {
    return 'text-success';
  }
  return 'text-danger';
};

export const ProductsFields = () => ([
  {
    headerName: 'Product Name',
    field: 'name',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Product Code',
    field: 'unique_code',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Product Category',
    field: 'categ_id',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Quantity on Hand',
    field: 'qty_available',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Reserved Quantity',
    field: 'reserved_quantity',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Unit of Measure',
    field: 'uom_id',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),

    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Reorder Level',
    field: 'reordering_min_qty',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Reorder Quantity',
    field: 'reordering_max_qty',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Alert Level',
    field: 'alert_level_qty',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Specification',
    field: 'specification',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Brand',
    field: 'brand',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,

  },
  {
    headerName: 'Preferred Vendor',
    field: 'preferred_vendor',
    minWidth: 150,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Cost',
    field: 'standard_price',
    minWidth: 150,
    valueGetter: (params) => getValue(numToFloat(params.value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
    ),
    func: getValue(numToFloat),
    sortable: false,
  },
  {
    headerName: 'Product Type',
    field: 'type',
    minWidth: 150,
    valueGetter: (params) => getType(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
    filterable: false,
  },
]
);

export const AttendanceFields = () => ([

  {
    headerName: 'Employee',
    field: 'employee_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    field: 'create_date',
    headerName: 'Created On',
    width: 250,
    editable: false,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    headerName: 'Type',
    field: 'type',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Valid Attendance',
    field: 'valid',
    minWidth: 200,
    valueGetter: (params) => getValue(getBoolean(params.value)),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue(getBoolean),
  },
  {
    headerName: 'Attendance Device',
    field: 'device_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Vendor',
    field: 'vendor_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Department Id',
    field: 'department_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
]);

export const TeamsFields = (onClickRemoveData, isDeleteable) => ([
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Team Members',
    field: 'member_ids',
    minWidth: 200,
    valueGetter: (params) => params.value && params.value.length && params.value.length,
    filterable: false,
    func: getValue,
  }, {
    headerName: 'Category',
    field: 'team_category_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Team Leader',
    field: 'employee_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Av.Maiantenance.Cost',
    field: 'maintenance_cost_analytic_account_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Type',
    field: 'team_type',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Hourly Labour Cost',
    field: 'labour_cost_unit',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Company',
    field: 'company_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  isDeleteable
    ? {
      field: 'action',
      headerName: 'Action',
      // actionType: 'both',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <>
          {isDeleteable && (
          <Tooltip title="Delete">
            <span className="font-weight-400 d-inline-block" />
            <FontAwesomeIcon
              className="mr-1 ml-1 cursor-pointer"
              size="sm"
              icon={faTrashAlt}
              onClick={() => { onClickRemoveData(params.id, params.row.name); }}
            />
          </Tooltip>
          )}
        </>
      ),
    } : '',
]);
