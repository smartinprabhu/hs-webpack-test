/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */

import {
  Typography, Autocomplete, TextField,
  Button,
  ButtonGroup,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import { Tooltip } from 'antd';
import React from 'react';
import { Delete } from '@material-ui/icons';
import Edit from '@mui/icons-material/Edit';

import {
  faCopy,
  faClose,
  faFileDownload,
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chartIcon from '@images/chart.svg';
import listIcon from '@images/list.svg';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AddThemeColor, ReturnThemeColor } from '../themes/theme';

import { getComplianceLocationNamesTable } from '../buildingCompliance/utils/utils';
import { getAge } from '../breakdownTracker/utils/utils';
import { getActionDueDays } from '../auditManagement/utils/utils';
import {
  InwardStatusJson, LocationStatusJson,
  MailStatusJson,
  OrdersStatusJson,
  PPMpriority,
  PantryStatusJson,
  ScrapStatusJson,
  StockAuditStatusJson,
  UsersStatusJson,
  assetStatusJson,
  auditActionStatusJson,
  auditStatusJson,
  breakDownStatusJson,
  channelJson,
  cjStatusJson,
  complianceStatusJson,
  gatePassStatusJson,
  ppmStatusLogJson,
  inspBulkStatusLogJson,
  hxAuditSystemStatusJson,
  hxInspCancelStatusJson,
  heldeskStatusJson,
  helpdeskPrioritiesJson,
  hxincidentStatusJson,
  hxAuditActionStatusJson,
  ppmFor,
  slaAuditStatusJson,
  slaJson,
  surveyStatusJson,
  typeJson,
  InsTypeJson,
  visitorStatusJson,
  certificateStatusJson,
  criticalitiesJson,
  workOrderPrioritiesJson,
  workPermitStatusJson,
  tankerStatusJson,
  workorderMaintenanceJson,
  helpdeskTypesJson,
  workorderStatusJson, workorderTypesJson, bmsStatusJson, levelTypesJson,
} from './utils/util';

import { getSLATimeClosedReport } from '../helpdesk/utils/utils';
import {
  copyToClipboard,
  extractNameObject,
  getCompanyTimezoneDateForColumns, getDefaultNoValue,
  getLocalDateDBTimeFormat,
  numToValidFloatView, generateErrorMessage,
  convertDecimalToTimeReadable,
  htmlSanitizeInput,
  stripHtmlTags,
  convertDecimalToTime,
} from '../util/appUtils';
import { getCustomStatusName } from '../workPermit/utils/utils';
import { getCustomGatePassStatusName } from '../gatePass/utils/utils';

const getValue = (value) => {
  let fieldValue = value || '-';
  if (Array.isArray(fieldValue)) {
    fieldValue = value[1];
  } else if (fieldValue && typeof fieldValue === 'object' && !Object.keys(fieldValue).length) {
    fieldValue = '-';
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
    fieldValue = value.name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
    fieldValue = value.path_name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
    fieldValue = value.space_name;
  }
  return fieldValue;
};

const getValueNo = (value) => {
  const fieldValue = value || '0';
  return fieldValue;
};

const getBooleanValue = (value) => {
  let fieldValue = 'No';
  if (value) {
    fieldValue = 'Yes';
  }
  return fieldValue;
};

const CheckAuditStatus = (val) => (
  <>
    {val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.status === 'Approved' && val.val.row.is_second_level_approval && !val.val.row.second_approved_by ? '#F9F397' : statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.status === 'Approved' && val.val.row.is_second_level_approval && !val.val.row.second_approved_by ? '#f7a20e' : statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {val.val.row.is_second_level_approval && statusData.status === 'Approved' && (
              <Tooltip title={val.val.row.second_approved_by ? 'Second Level Approved' : 'First Level Approved'}>
                {statusData.text}
              </Tooltip>
            )}
            {val.val.row.is_second_level_approval && statusData.status !== 'Approved' && (
              statusData.text
            )}
            {!val.val.row.is_second_level_approval && statusData.status === 'Approved' && (
              <Tooltip title="Approved (Second Level Approval Not Required)">
                {statusData.text}
              </Tooltip>
            )}
            {!val.val.row.is_second_level_approval && statusData.status !== 'Approved' && (
              statusData.text
            )}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckPriority = (val) => (
  <>
    {val.json && val.json.map((prorityData) => (
      <strong>
        {prorityData.priority === val.val.formattedValue && (
          <Typography
            sx={{
              color: prorityData.color,
              fontSize: '14px',
            }}
          >
            {prorityData.text}
          </Typography>
        )}
      </strong>
    ))}
  </>
);

const isRejecttable = (vpData) => {
  const isValidEdit = vpData && vpData.state !== 'Approved' && vpData.state !== 'Cancelled' && vpData.state !== 'Rejected';

  const isValidReject = vpData && vpData.entry_status !== 'Checkin' && vpData.entry_status !== 'Checkout' && vpData.entry_status !== 'time_elapsed';

  return isValidEdit && isValidReject;
};

const CheckPriorityWo = (val) => (
  <>
    {val.json && val.json.map((prorityData) => (
      <strong>
        {prorityData.priority === val.val.formattedValue || prorityData.priority === val.val.value && (
          <Typography
            sx={{
              color: prorityData.color,
              fontSize: '14px',
            }}
          >
            {prorityData.text}
          </Typography>
        )}
      </strong>
    ))}
  </>
);

const CheckStatus = (val) => (
  <>
    {val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckAssetStatus = (val) => (
  <>
    {val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
            {' '}
            {getActionDueDays(val.deadLine)}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckAuditActionStatus = (val) => (
  <>
    {val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val || statusData.text === val.val) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
            {' '}
            {val.val !== 'Closed' ? getActionDueDays(val.deadLine) : ''}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckStatusText = (val, json) => {
  let res = val;
  const data = json.filter((item) => item.status === val);
  if (data && data.length) {
    res = data[0].text;
  }
  return res;
};

const CheckBCStatus = (val) => (
  <>
    {val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {val.val.row && val.val.row.is_renewed ? 'Renewed' : statusData.text}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckCustomStatus = (val) => (
  <>
    {!val.customData && val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
          </Box>
        )}
      </strong>
    ))}
    {val.customData && val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {getCustomStatusName(statusData.text, val.customData)}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckCustomStatusGatePass = (val) => (
  <>
    {!val.customData && val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
          </Box>
        )}
      </strong>
    ))}
    {val.customData && val.json && val.json.map((statusData) => (
      <strong>
        {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {getCustomGatePassStatusName(statusData.text, val.customData)}
          </Box>
        )}
      </strong>
    ))}
  </>
);

const CheckChannel = (val) => {
  const channelValue = channelJson.find(
    (channelData) => channelData.channel === val.val.formattedValue || channelData.label === val.val.formattedValue,
  );
  return (
    <Typography>
      {getDefaultNoValue(channelValue && channelValue?.label ? channelValue.label : '-')}
    </Typography>
  );
};

const CheckType = (val) => {
  let data = '-';
    <>
      {val.json && val.json.map((tData) => (
        <strong>
          {tData.status === val.val.formattedValue || tData.status === val.val.value && (
            data = (
              <Typography sx={{ fontSize: '14px' }}>
                {tData.text}
              </Typography>
            )
          )}
        </strong>
      ))}
    </>;
    return data;
};

const CheckAge = (val) => (
  <>
    {getAge(val && val.val && val.val.row && val.val.row.incident_date, val.val.row.state_id[1] === 'Closed' ? val.val.row.closed_on : '')}
  </>
);
const CheckVal = (val) => (
  <>
    {val && val.val && val.val.formattedValue === true ? 'Yes' : 'No'}
  </>
);

const CheckValHyphen = (val) => (
  <>
    {val && val.val && val.val.formattedValue === true ? 'Yes' : '-'}
  </>
);

const CheckValStatus = (val) => (
  <>
    {val && val.val && val.val.formattedValue ? 'Active' : 'InActive'}
  </>
);

const CheckValCat = (val) => (
  <>
    {val && val.val && val.val.formattedValue && val.val.formattedValue.display_name}
  </>
);

const CheckValInv = (val) => (
  <>
    {val && val.val && val.val.formattedValue ? 'Manual' : ''}
  </>
);

const CheckValCompany = (val) => (
  <>
    {val && val.val && val.val.formattedValue && val.val.formattedValue.name}
  </>
);
const CheckValUnit = (val) => (
  <>
    {val && val.val && val.val.row && val.val.row.uom_id && val.val.row.uom_id.name}
  </>
);
const CheckValPantry = (val) => (
  <>
    {val && val.val && val.val.row && val.val.row.pantry_ids && val.val.row.pantry_ids && val.val.row.pantry_ids.length > 0 && val.val.row.pantry_ids[0].name}
  </>
);
const CheckValUnitPom = (val) => (
  <>
    {val && val.val && val.val.row && val.val.row.uom_po_id && val.val.row.uom_po_id.name}
  </>
);

const CheckSla = (val) => {
  const slaData = slaJson.find((slaData) => slaData.sla === val.val.formattedValue);
  const displayValue = slaData ? val.val.formattedValue : '-';

  return (
    <strong>
      <Typography
        sx={{
          color: slaData ? slaData.color : '',
        }}
      >
        {getDefaultNoValue(displayValue)}
      </Typography>
    </strong>
  );
};

function getValueTypes(value, type) {
  let res = getValue(value);
  if (type === 'date' || type === 'datetime') {
    res = getCompanyTimezoneDateForColumns(value, type);
  }
  return res;
}

function getValueTypesEdit(value, type) {
  let res = getValue(value);
  if (type === 'date' || type === 'datetime') {
    res = value ? new Date(value) : new Date();
  } else if (type === 'number') {
    if (Number(value) === value && value % 1 !== 0) {
      res = numToValidFloatView(value);
    } else {
      res = value;
    }
  }
  return res;
}

function getOldData(oldData) {
  return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
}

function getValueRender(value, field) {
  let res;
  if (field === 'state_id') {
    if (value.row.is_cancelled) {
      const newval = value;
      newval.formattedValue = 'Cancelled';
      res = <CheckStatus val={newval} json={heldeskStatusJson} />;
    } else if (value.row.is_on_hold_requested && val.formattedValue !== 'On Hold' && val.formattedValue !== 'Closed') {
      const newval = value;
      newval.formattedValue = 'On-Hold Requested';
      res = <CheckStatus val={newval} json={heldeskStatusJson} />;
    }
    res = <CheckStatus val={value} json={heldeskStatusJson} />;
  } else if (field === 'priority_id') {
    res = <CheckPriority val={value} json={helpdeskPrioritiesJson} />;
  } else if (field === 'description') {
    res = value.value ? (<div>{stripHtmlTags(htmlSanitizeInput(value.value))}</div>) : '-';
  } else if (field === 'channel') {
    res = <CheckChannel val={value} />;
  } else if (field === 'sla_status') {
    res = <CheckSla val={value} />;
  } else if (field === 'is_cancelled') {
    res = <CheckVal val={value} />;
  }
  return res;
}

export function TicketsDynamicColumns(data, isVendorShow, isTenant, isTicketType, isChannel, isTeam) {
  let newArrData = data.map((cl) => ({
    field: cl.field,
    headerName: cl.headerName,
    width: 180,
    editable: false,
    renderCell: (val) => getValueRender(val, cl.field),
    dateField: cl.type === 'date' || cl.type === 'datetime' ? cl.type : undefined,
    valueGetter: cl.field === 'asset_id' ? (params) => (params.row.asset_id ? getValue(params.row.asset_id) : getValue(params.row.equipment_location_id))
      : (params) => getValueTypes(params.value, cl.type),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => (cl.field === 'cost' ? operator.value === '>' || operator.value === '<' : operator.value === 'contains'),
    ),
  }));

  const fieldsToRemove = [];

  if (!isVendorShow) fieldsToRemove.push('vendor_id');
  if (!isTenant) fieldsToRemove.push('tenant_name');
  if (!isTicketType) fieldsToRemove.push('ticket_type');
  if (!isChannel) fieldsToRemove.push('channel');
  if (!isTeam) fieldsToRemove.push('maintenance_team_id');

  if (fieldsToRemove.length > 0) {
    newArrData = newArrData.filter((col) => !fieldsToRemove.includes(col.field));
  }

  return newArrData;
}

export const TicketsColumns = (isVendorShow, isTenant, isTicketType, isChannel, isTeam) => {
  let columns = [
    {
      field: 'ticket_number',
      headerName: 'Ticket No',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'log_note',
      headerName: 'Last Comment',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'last_commented_by',
      headerName: 'Last Commented By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'log_note_date',
      headerName: 'Last Commented on',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'state_id',
      headerName: 'Status',
      sortable: false,
      width: 160,
      editable: false,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: heldeskStatusJson,
      renderCell: (val) => {
        if (val.row.is_cancelled === true) {
          const newval = val;
          newval.formattedValue = 'Cancelled';
          return <CheckStatus val={newval} json={heldeskStatusJson} />;
        } if (val.row.is_on_hold_requested === true && val.formattedValue !== 'On Hold' && val.formattedValue !== 'Closed') {
          const newval = val;
          newval.formattedValue = 'On-Hold Requested';
          return <CheckStatus val={newval} json={heldeskStatusJson} />;
        }
        return <CheckStatus val={val} json={heldeskStatusJson} />;
      },
      valueGetter: (params) => getValue(params.value),
      func: false,
      specialStatus: true,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'asset_id',
      alternate: 'equipment_location_id',
      headerName: '	Location',
      width: 160,
      editable: false,
      valueGetter: (params) => (params.row.asset_id ? getValue(params.row.asset_id) : getValue(params.row.equipment_location_id)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'priority_id',
      headerName: 'Priority',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckPriority val={val} json={helpdeskPrioritiesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      editable: false,
      renderCell: (val) => (<>{val.value ? (<div>{stripHtmlTags(htmlSanitizeInput(val.value))}</div>) : '-'}</>),
      valueGetter: (params) => getValue(params.value),
      func: stripHtmlTags,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'create_uid',
      headerName: 'Created By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'requestee_id',
      headerName: 'Requestor',
      width: 160,
      editable: false,
      // alternate: 'person_name',
      // isAlternate: 'yes',
      valueGetter: (params) => (params.row.requestee_id ? getValue(params.row.requestee_id) : getValue(params.row.person_name)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'closed_by_id',
      headerName: 'Closed / Cancelled By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'close_time',
      headerName: 'Closed / Cancelled On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'channel',
      headerName: 'Channel',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckChannel val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sla_status',
      headerName: 'SLA Status',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckSla val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'current_escalation_level',
      headerName: 'Escalation Level',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sub_category_id',
      headerName: 'Sub Category',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'issue_type',
      headerName: 'Problem Type',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sla_end_date',
      headerName: 'SLA End Date',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'parent_id',
      headerName: 'Parent Ticket',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tenant_name',
      headerName: 'Tenant',
      width: 160,
      editable: false,
      filterable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'region_id',
      headerName: 'Region',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'city_name',
      headerName: 'City Name',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state_name',
      headerName: 'State Name',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'site_sub_categ_id',
      headerName: 'Site Subcategory',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'constraints',
      headerName: 'Constraints',
      width: 160,
      editable: false,
      filterable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
      ),
    },
    {
      field: 'ticket_type',
      headerName: 'Ticket Type',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'is_cancelled',
      headerName: 'Is Cancelled',
      width: 160,
      editable: false,
      filterable: true,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getBooleanValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'isEmpty' || operator.value === 'isNotEmpty',
      ),
    },
    {
      field: 'is_on_hold_requested',
      headerName: 'Is On Hold Requested',
      width: 160,
      editable: false,
      filterable: true,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getBooleanValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'isEmpty' || operator.value === 'isNotEmpty',
      ),
    },
  ];

  const fieldsToRemove = [];

  if (!isVendorShow) fieldsToRemove.push('vendor_id');
  if (!isTenant) fieldsToRemove.push('tenant_name');
  if (!isTicketType) fieldsToRemove.push('ticket_type');
  if (!isChannel) fieldsToRemove.push('channel');
  if (!isTeam) fieldsToRemove.push('maintenance_team_id');

  if (fieldsToRemove.length > 0) {
    columns = columns.filter((col) => !fieldsToRemove.includes(col.field));
  }

  return columns;
};

export const TicketsColumnsReports = (isVendorShow, isTenant, isTicketType, isChannel, isTeam) => {
  let columns = [
    {
      field: 'ticket_number',
      headerName: 'Ticket No',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'log_note',
      headerName: 'Last Comment',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'last_commented_by',
      headerName: 'Last Commented By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'log_note_date',
      headerName: 'Last Commented on',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'state_id',
      headerName: 'Status',
      sortable: false,
      width: 150,
      editable: false,
      renderCell: (val) => {
        if (val.row.is_cancelled === true) {
          const newval = val;
          newval.formattedValue = 'Cancelled';
          return <CheckStatus val={newval} json={heldeskStatusJson} />;
        } if (val.row.is_on_hold_requested === true && val.formattedValue !== 'On Hold' && val.formattedValue !== 'Closed') {
          const newval = val;
          newval.formattedValue = 'On-Hold Requested';
          return <CheckStatus val={newval} json={heldeskStatusJson} />;
        }
        return <CheckStatus val={val} json={heldeskStatusJson} />;
      },
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type_category',
      headerName: 'Type',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: workorderTypesJson,
      renderCell: (val) => <CheckType val={val} json={workorderTypesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'asset_id',
      alternate: 'equipment_location_id',
      headerName: '	Location',
      width: 160,
      editable: false,
      valueGetter: (params) => (params.row.asset_id ? getValue(params.row.asset_id) : getValue(params.row.equipment_location_id)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'priority_id',
      headerName: 'Priority',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckPriority val={val} json={helpdeskPrioritiesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      editable: false,
      renderCell: (val) => (<>{val.value ? (<div>{stripHtmlTags(htmlSanitizeInput(val.value))}</div>) : '-'}</>),
      valueGetter: (params) => getValue(params.value),
      func: stripHtmlTags,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'create_uid',
      headerName: 'Created By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'requestee_id',
      headerName: 'Requestor',
      width: 160,
      editable: false,
      // alternate: 'requestee_id',
      // isAlternate: 'yes',
      valueGetter: (params) => (params.row.requestee_id ? getValue(params.row.requestee_id) : getValue(params.row.person_name)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'closed_by_id',
      headerName: 'Closed / Cancelled By',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'close_time',
      headerName: 'Closed / Cancelled On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'close_comment',
      headerName: 'Close / Cancel Remarks',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'closed_by_name',
      headerName: 'Resolution Time',
      width: 160,
      editable: false,
      renderCell: (val) => getSLATimeClosedReport(val.row.close_time, val.row.create_date),
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'pause_reason_id',
      headerName: 'On-Hold Reason / Remarks',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'channel',
      headerName: 'Channel',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckChannel val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sla_status',
      headerName: 'SLA Status',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckSla val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'current_escalation_level',
      headerName: 'Escalation Level',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sub_category_id',
      headerName: 'Sub Category',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'issue_type',
      headerName: 'Problem Type',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sla_end_date',
      headerName: 'Due Date',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'parent_id',
      headerName: 'Parent Ticket',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tenant_name',
      headerName: 'Tenant',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'region_id',
      headerName: 'Region',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'city_name',
      headerName: 'City Name',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state_name',
      headerName: 'State Name',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'site_sub_categ_id',
      headerName: 'Site Subcategory',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'constraints',
      headerName: 'Constraints',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<',
      ),
    },
    {
      field: 'ticket_type',
      headerName: 'Ticket Type',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'support_comment',
      headerName: 'Resolution Provided',
      width: 160,
      editable: false,
      renderCell: (val) => <CheckValHyphen val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ];
  const fieldsToRemove = [];

  if (!isVendorShow) fieldsToRemove.push('vendor_id');
  if (!isTenant) fieldsToRemove.push('tenant_name');
  if (!isTicketType) fieldsToRemove.push('ticket_type');
  if (!isChannel) fieldsToRemove.push('channel');
  if (!isTeam) fieldsToRemove.push('maintenance_team_id');

  if (fieldsToRemove.length > 0) {
    columns = columns.filter((col) => !fieldsToRemove.includes(col.field));
  }

  return columns;
};

export const TeamMemberFields = () => ([
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
  // {
  //     headerName: "Teams",
  //     field: "maintenance_team_ids",
  //     minWidth: 200,
  //     valueGetter: (params) => params.value.length,
  //     filterable: false,
  //     func: getValue,
  // },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Associated To',
    field: 'associates_to',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Status',
    field: 'state',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
    renderCell: (val) => <CheckStatus val={val} json={UsersStatusJson} />,
  },
  {
    headerName: 'Associated Entity',
    field: 'vendor_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
  {
    headerName: 'Employee ID',
    field: 'employee_id_seq',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Department',
    field: 'hr_department',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Shift',
    field: 'resource_calendar_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  }, {
    headerName: 'Current Site',
    field: 'company_id',
    minWidth: 200,
    valueGetter: (params) => getValue(params.value),
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    func: getValue,
  },
]);

export const BreakdownTrackerColumns = (isCriticality) => {
  const columns = [{
    field: 'company_id',
    headerName: 'Site',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'state_id',
    headerName: 'Status',
    sortable: false,
    width: 180,
    editable: false,
    type: 'singleSelect',
    getOptionLabel: (value) => value?.text,
    getOptionValue: (value) => value?.status,
    valueOptions: breakDownStatusJson,
    renderCell: (val) => {
      if (val.row.is_on_hold_requested === true && val.formattedValue !== 'On Hold') {
        const newval = val;
        newval.formattedValue = 'On-Hold Requested';
        return <CheckStatus val={newval} json={breakDownStatusJson} />;
      }
      return <CheckStatus val={val} json={breakDownStatusJson} />;
    },
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridSingleSelectOperators().filter(
      (operator) => operator.value === 'is',
    ),
  },
  {
    field: 'incident_date',
    headerName: 'Incident Date',
    width: 160,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'service_category_id',
    headerName: 'Service Category',
    width: 150,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'equipment_id',
    headerName: 'Asset',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'incident_age',
    headerName: 'Incident Age',
    width: 160,
    editable: true,
    renderCell: (val) => <CheckAge val={val} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterable: false,
  },
  {
    field: 'is_service_impacted',
    headerName: 'Is Service Impacted?',
    width: 160,
    editable: true,
    renderCell: (val) => <CheckVal val={val} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterable: false,
  },
  {
    field: 'complaint_no',
    headerName: 'Complaint No',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'name',
    headerName: 'Reference',
    width: 180,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'action_taken',
    headerName: 'Action Taken',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'raised_by_id',
    headerName: 'Raised By',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'space_id',
    headerName: 'Space',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'attended_on',
    headerName: 'Attended On',
    width: 160,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    field: 'closed_on',
    headerName: 'Closed On',
    width: 160,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    field: 'expexted_closure_date',
    headerName: 'Expected Closure Date',
    width: 160,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    field: 'description_of_breakdown',
    headerName: 'Description',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'last_comments',
    headerName: 'Last Comment',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'remarks',
    headerName: 'Remarks',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'create_date',
    headerName: 'Created On',
    width: 160,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'is_results_in_statutory_non_compliance',
    headerName: 'Results in Statutory Non-Compliance?',
    width: 160,
    editable: true,
    renderCell: (val) => <CheckVal val={val} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterable: false,
  },
  {
    field: 'is_on_hold_requested',
    headerName: 'Is On Hold Requested',
    width: 160,
    editable: false,
    renderCell: (val) => <CheckVal val={val} />,
    valueGetter: (params) => getValue(params.value),
    func: getBooleanValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'amc_status',
    headerName: 'AMC Status',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'vendor_name',
    headerName: 'Vendor Name',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'vendor_sr_number',
    headerName: 'Vendor FSR Number (Field Service Number)',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  ];

  const dynamicObject = {
    field: 'ciriticality',
    headerName: 'Criticality',
    width: 160,
    editable: true,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  };

  if (isCriticality) {
    columns.splice(4, 0, dynamicObject); // Insert the new column at the specified index
  }
  return columns;
};
export const ComplianceColumns = (isDownloadAllowed, onClickDownload) => (
  [
    {
      field: 'location_ids',
      headerName: 'Applies To',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      renderCell: (val) => ((val.row.location_ids)
        ? (getComplianceLocationNamesTable(val.row.applies_to, val.row.asset_ids, val.row.company_ids, val.row.location_ids))
        : '  -'),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'compliance_id',
      headerName: 'Compliance',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'license_number',
      headerName: 'License Number',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckBCStatus val={val} json={complianceStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'compliance_act',
      headerName: 'Compliance Act',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'next_expiry_date',
      headerName: 'Next Expiry Date',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'submitted_to',
      headerName: 'Submitted To',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'last_renewed_by',
      headerName: '	Last Renewed by',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'last_renewed_on',
      headerName: 'Last Renewed on',
      width: 200,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'compliance_category_id',
      headerName: 'Compliance Category',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sla_status',
      headerName: 'SLA Status',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'applies_to',
      headerName: 'Applies To',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isDownloadAllowed
      ? {
        field: 'action',
        headerName: 'Download Latest Evidence',
        width: 200,
        editable: false,
        focus: false,
        renderCell: (params) => (
          <>
            {isDownloadAllowed && (
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faFileDownload}
                onClick={() => { onClickDownload(params.id); }}
              />
            )}
          </>
        ),
      } : '',
  ]);

export const ComplianceTemplateColumns = (isEditAllowed, onClickEdit) => (
  [
    {
      field: 'name',
      headerName: 'Complaince Name',
      width: 300,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'compliance_act',
      headerName: 'Compliance Act',
      width: 300,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'submitted_to',
      headerName: 'Submitted To',
      width: 300,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'compliance_category_id',
      headerName: 'Compliance Category',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isEditAllowed
      ? {
        field: 'action',
        headerName: 'Action',
        width: 200,
        editable: false,
        focus: false,
        renderCell: (params) => (
          <>
            {isEditAllowed && (
              <Tooltip title="Edit">
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faPencil}
                  onClick={() => { onClickEdit(params.id); }}
                />
              </Tooltip>
            )}
          </>
        ),
      } : '',
  ]);

export const WasteColumns = () => (
  [
    {
      field: 'logged_on',
      headerName: 'Logged On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'operation',
      headerName: 'Operation',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tenant',
      headerName: 'Tenant',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'weight',
      headerName: 'Weight(Kg)',
      width: 160,
      editable: true,
      valueGetter: (params) => numToValidFloatView((params.value)),
      func: numToValidFloatView,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'carried_by',
      headerName: 'Carried by',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'security_by',
      headerName: 'Security by',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'accompanied_by',
      headerName: 'Accompanied by',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const SlaAuditColumns = () => (
  [
    {
      field: 'audit_for',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Title',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'audit_template_id',
      headerName: 'Audit Template',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckAuditStatus val={val} json={slaAuditStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'region_id',
      headerName: 'Region',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state_name',
      headerName: 'State Name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'created_by_id',
      headerName: 'Created By',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'created_on',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'reviewed_by_id',
      headerName: 'Reviewed By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reviewed_on',
      headerName: 'Reviewed On',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'approved_by_id',
      headerName: 'Approved By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'approved_on',
      headerName: 'Approved On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'is_second_level_approval',
      headerName: 'Is Second Level Approval Required',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'second_approved_by',
      headerName: 'Second Approved By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'second_approved_on',
      headerName: 'Second Level Approved On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);

export const InboundMailReportColumns = () => (
  [
    {
      field: 'sender',
      headerName: 'Sender Name',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: true,
    },
    {
      field: 'employee_id',
      headerName: 'Receiver Name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={MailStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'courier_id',
      headerName: 'Courier',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tracking_no',
      headerName: 'Tracking Number',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parcel_dimensions',
      headerName: 'Parcel Dimensions',
      width: 160,
      editable: true,
      valueGetter: (params) => numToValidFloatView((params.value)),
      func: numToValidFloatView,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'received_on',
      headerName: 'Registered On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'received_by',
      headerName: 'Registered By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'collected_on',
      headerName: 'Delivered On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'collected_by',
      headerName: 'Delivered By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const OutboundMailReportColumns = () => (
  [
    {
      field: 'employee_id',
      headerName: 'Sender Name',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: true,
    },
    {
      field: 'sent_to',
      headerName: 'Receiver Name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={MailStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'courier_id',
      headerName: 'Courier',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tracking_no',
      headerName: 'Tracking Number',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parcel_dimensions',
      headerName: 'Parcel Dimensions',
      width: 160,
      editable: true,
      valueGetter: (params) => numToValidFloatView((params.value)),
      func: numToValidFloatView,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sent_on',
      headerName: 'Registered On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'sent_by',
      headerName: 'Registered By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'delivered_on',
      headerName: 'Delivered On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'delivered_by',
      headerName: 'Delivered By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const HxIncidentColumns = () => (
  [
    {
      field: 'reference',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Subject',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxincidentStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={hxincidentStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'severity_id',
      headerName: 'Severity',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'priority_id',
      headerName: 'Priority',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'probability_id',
      headerName: 'Probability',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'incident_type_id',
      headerName: 'Incident Type',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterable: false,
    },
    {
      field: 'incident_on',
      headerName: 'Incident On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'target_closure_date',
      headerName: 'Target Closure Date',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'assigned_id',
      headerName: 'Assigned To',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'corrective_action',
      headerName: 'Corrective Action',
      width: 160,
      editable: true,
      renderCell: (val) => ((val.row.corrective_action)
        ? (
          <Tooltip title={<div>{htmlSanitizeInput(val.row.corrective_action)}</div>}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ffffff !important', color: ReturnThemeColor() }}
              size="small"
            >
              <Typography sx={{ fontFamily: 'Suisse Intl', fontSize: '13px' }}>
                View
              </Typography>
            </Button>
          </Tooltip>
        )
        : '  -'),
    },
    {
      field: 'sub_category_id',
      headerName: 'Sub Category',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reported_by_id',
      headerName: 'Reported By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reported_on',
      headerName: 'Reported On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'acknowledged_by_id',
      headerName: 'Acknowledged By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'acknowledged_on',
      headerName: 'Acknowledged On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'resolved_by_id',
      headerName: 'Resolved By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'resolved_on',
      headerName: 'Resolved On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'validated_by_id',
      headerName: 'Validated By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'validated_on',
      headerName: 'Validated On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);
export const HxAuditActionsColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 600,
      editable: false,
      valueGetter: (params) => getDefaultNoValue(params.value),
      renderCell: (params) => {
        const actName = getDefaultNoValue(params.row.name);

        return (
          <div
            style={{
              display: 'flex', padding: '10px', maxHeight: '70px', overflowY: 'auto', overflowX: 'hidden', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
            }}
            title={actName}
          >
            <p className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{actName}</p>
          </div>
        );
      },
      func: getDefaultNoValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 200,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxAuditActionStatusJson,
      renderCell: (params) => <CheckAuditActionStatus val={params.value} json={hxAuditActionStatusJson} deadLine={params.row.deadline} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 150,
      editable: true,
      renderCell: (val) => {
        if (val.row.severity === 'High') {
          return <span className="text-danger font-family-tab font-weight-800">High</span>;
        } if (val.row.severity === 'Medium') {
          return <span className="text-info font-family-tab font-weight-800">Medium</span>;
        } if (val.row.severity === 'Low') {
          return <span className="text-warning font-family-tab font-weight-800">Low</span>;
        }
        return <span className="font-weight-800 font-family-tab">-</span>;
      },
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      width: 160,
      editable: true,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'sla_status',
      headerName: 'SLA Status',
      width: 150,
      editable: true,
      renderCell: (val) => {
        if (val.row.sla_status === 'Within SLA') {
          return <span className="text-success font-family-tab font-weight-800">Within SLA</span>;
        } if (val.row.sla_status === 'SLA Elapsed') {
          return <span className="text-danger font-family-tab font-weight-800">SLA Elapsed</span>;
        }
        return <span className="font-weight-800 font-family-tab">-</span>;
      },
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'audit_id',
      headerName: 'Audit',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'responsible_id',
      headerName: 'Responsible',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'resolution',
      headerName: 'Resolution',
      width: 160,
      editable: true,
      renderCell: (val) => ((val.row.resolution)
        ? (
          <Tooltip title={<div>{htmlSanitizeInput(val.row.resolution)}</div>}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ffffff !important', color: ReturnThemeColor() }}
              size="small"
            >
              <Typography sx={{ fontFamily: 'Suisse Intl', fontSize: '13px' }}>
                View
              </Typography>
            </Button>
          </Tooltip>
        )
        : '  -'),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      editable: true,
      renderCell: (val) => ((val.row.description)
        ? (
          <Tooltip title={<div>{htmlSanitizeInput(val.row.description)}</div>}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ffffff !important', color: ReturnThemeColor() }}
              size="small"
            >
              <Typography sx={{ fontFamily: 'Suisse Intl', fontSize: '13px' }}>
                View
              </Typography>
            </Button>
          </Tooltip>
        )
        : '  -'),
    },
  ]);
export const HxInspCancelColumns = () => (
  [
    {
      field: 'requested_on',
      headerName: 'Requested On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'requested_by_id',
      headerName: 'Requested By',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxInspCancelStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={hxInspCancelStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'expires_on',
      headerName: 'Expires On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'is_cancel_for_all_assets',
      headerName: 'Cancelled for All Assets (Holiday)',
      width: 200,
      editable: false,
      filterable: false,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getBooleanValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'from_date',
      headerName: 'Holiday Start Date',
      width: 180,
      editable: false,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'to_date',
      headerName: 'Holiday End Date',
      width: 180,
      editable: false,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'cancel_approval_authority',
      headerName: 'Approval Authority',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'approved_on',
      headerName: 'Approved On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'approved_by_id',
      headerName: 'Approved By',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const HxInspPPMColumns = () => (
  [
    {
      field: 'requested_on',
      headerName: 'Requested On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'requested_by_id',
      headerName: 'Requested By',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxInspCancelStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={hxInspCancelStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'expires_on',
      headerName: 'Expires On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'cancel_approval_authority',
      headerName: 'Approval Authority',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'approved_on',
      headerName: 'Approved On',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getDefaultNoValue,
      filterable: false,
    },
    {
      field: 'approved_by_id',
      headerName: 'Approved By',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const HxAuditSystemColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Title',
      width: 200,
      editable: false,
      valueGetter: (params) => getDefaultNoValue(params.value),
      func: getDefaultNoValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'short_code',
      headerName: 'Code',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxAuditSystemStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={hxAuditSystemStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'department_id',
      headerName: 'Department',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'scope',
      headerName: 'Scope',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'objective',
      headerName: 'Objective',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'overall_score',
      headerName: 'Overall Score %',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const HxAuditorsColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
      valueGetter: (params) => getDefaultNoValue(params.value),
      func: getDefaultNoValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.value,
      getOptionValue: (value) => value?.label,
      valueOptions: [{ value: 'Internal', label: 'Internal' }, { value: 'External', label: 'External' }],
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'certification_status',
      headerName: 'Certfication Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.status,
      getOptionValue: (value) => value?.text,
      valueOptions: certificateStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={certificateStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'certificate_expires_on',
      headerName: 'Certfication Expires On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'platform_access',
      headerName: 'Platform Access',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.value,
      getOptionValue: (value) => value?.label,
      valueOptions: [{ value: 'Allowed', label: 'Allowed' }, { value: 'Blocked', label: 'Blocked' }],
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const WorkPermitColumns = (customData) => {
  const columns = [
    {
      field: 'reference',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Description',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckCustomStatus val={val} json={workPermitStatusJson} custom customData={customData} />,
      valueGetter: (params) => getValue(params.value),
      func: getCustomStatusName,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'planned_start_time',
      headerName: 'Planned Start Date',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'planned_end_time',
      headerName: 'Planned End Date',
      width: 150,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Equipment',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'nature_work_id',
      headerName: 'Nature of Work',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    customData && customData.is_enable_department && (
      {
        field: 'department_id',
        headerName: 'Department',
        width: 160,
        editable: true,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      }),
    {
      field: 'requestor_id',
      headerName: 'Requestor',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 160,
      editable: true,
      valueGetter: (params) => convertDecimalToTimeReadable(params.value),
      func: convertDecimalToTimeReadable,
      filterable: false,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (val) => (
        <Tooltip title="Delete">
          <span className="font-weight-400 d-inline-block" />
          <FontAwesomeIcon
            className="mr-1 ml-1 cursor-pointer"
            size="sm"
            icon={faTrashAlt}
          />
        </Tooltip>
      ),
    },
  ];
  const dynamicObject = {
    field: 'valid_through',
    headerName: 'Valid Through',
    width: 150,
    editable: true,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterable: false,
  };

  if (customData && (customData.general_shift_allow_multiple_days || customData.night_shift_allow_multiple_days || customData.special_shift_allow_multiple_days)) {
    columns.splice(6, 0, dynamicObject); // Insert the new column at the specified index
  }
  return columns;
};
export const ProductCatColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: 'Parent Category',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'product_count',
      headerName: 'Product',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'property_valuation',
      headerName: 'Inventory Valuation',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckValInv val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]
);
export const ProductColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'categ_id',
      headerName: 'Product Category',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckValCat val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'pantry_ids',
      headerName: 'Pantry',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckValPantry val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'minimum_order_qty',
      headerName: 'Minimum Order Qty',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maximum_order_qty',
      headerName: 'Maximum Order Qty',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckValStatus val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'weight',
      headerName: 'Weight',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'volume',
      headerName: 'Volume',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'new_until',
      headerName: 'New Until',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckValCompany val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'uom_id',
      headerName: 'UOM',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckValUnit val={val} />,
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'uom_po_id',
      headerName: 'Purchase UOM',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckValUnitPom val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);
export const PantryColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'pantry_sequence',
      headerName: 'Pantry Sequence',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'resource_calendar_id',
      headerName: 'Working Time',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 160,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={PantryStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);
export const OrderColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Order ID',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'employee_id',
      headerName: 'Employee',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (val) => {
        if (val.row.employee_name !== false) {
          return val.row.employee_name;
        }
        return val.row.employee_id && val.row.employee_id.length && val.row.employee_id[1];
      },
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'pantry_id',
      headerName: 'Pantry',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={OrdersStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'ordered_on',
      headerName: 'Ordered On',
      width: 150,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
    },
    {
      field: 'confirmed_on',
      headerName: 'Confirmed On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
    },
    {
      field: 'cancelled_on',
      headerName: 'Cancelled On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'delivered_on',
      headerName: 'Delivered On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const AuditActionColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Title',
      width: 300,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'date_deadline',
      headerName: 'Deadline',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: auditActionStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={auditActionStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'user_id',
      headerName: 'Responsible Type',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'audit_id',
      headerName: 'Audit',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'helpdesk_id',
      headerName: 'Helpdesk',
      width: 350,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Create Date',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);
export const AuditColumns = () => (
  [
    {
      field: 'reference',
      headerName: 'Reference',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Title',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 200,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: auditStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={auditStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'audit_system_id',
      headerName: 'System',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'facility_manager_id',
      headerName: 'Audit Manager',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Create Date',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);
export const ChecklistColumns = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 150,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
              <Tooltip title="Edit">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faPencil}
                  onClick={() => { onClickEditData(params.id, params.row); }}
                />
              </Tooltip>
            )}
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
export const NatureWorkColumns = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Title',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'task_id',
      headerName: 'Maintenance Checklist',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'preparedness_checklist_id',
      headerName: 'Readiness Checklist',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'issue_permit_checklist_id',
      headerName: 'Issue Permit Checklist',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'approval_authority_id',
      headerName: 'Approval Authority',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'issue_permit_approval_id',
      headerName: 'Issue Permit Approval Authority',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'ehs_authority_id',
      headerName: 'EHS Authority',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'security_office_id',
      headerName: 'Security Office',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'ehs_instructions',
      headerName: 'EHS Instructions',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
              <Tooltip title="Edit">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faPencil}
                  onClick={() => { onClickEditData(params.id); }}
                />
              </Tooltip>
            )}
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

export const PPMColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'time_period',
      headerName: 'Schedule',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.priority,
      valueOptions: PPMpriority,
      renderCell: (val) => <CheckPriorityWo val={val} json={PPMpriority} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'scheduler_type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Category',
      width: 160,
      editable: true,
      func: ppmFor,
      type: 'singleSelect',
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
      renderCell: (val) => <CheckStatus val={val} json={typeJson} />,
      valueGetter: (params) => getValue(params.value),
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: typeJson,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'equipment_count',
      headerName: 'Equipments',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_count',
      headerName: 'Spaces',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'ppm_by',
      headerName: 'Performed by',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const PPMNewColumns = (onClickEditData, onClickRemoveData, isEditable, isDeletable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Type',
      width: 160,
      editable: false,
      func: ppmFor,
      type: 'singleSelect',
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
      renderCell: (val) => <CheckStatus val={val} json={typeJson} />,
      valueGetter: (params) => getValue(params.value),
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: typeJson,
    },
    {
      field: 'starts_on',
      headerName: 'Starts On',
      width: 160,
      editable: false,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'ends_on',
      headerName: 'Ends On',
      width: 160,
      editable: false,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'week',
      headerName: 'Week',
      width: 100,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: false,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: ppmStatusLogJson,
      renderCell: (val) => <CheckStatus val={val} json={ppmStatusLogJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Equipment',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'schedule_period_id',
      headerName: 'Schedule Period',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'task_id',
      headerName: 'Maintenance Operations',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'performed_by',
      headerName: 'Performed by',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'order_id',
      headerName: 'Maintenance Order',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      focus: false,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <>
              {isEditable && params.row.state === 'Upcoming' && (
              <Tooltip title="Edit">
                <Edit style={{ fontSize: '20px', marginRight: '10px' }} onClick={() => { onClickEditData(params.id); }} />
              </Tooltip>
              )}
              {isDeletable && params.row.state === 'Upcoming' && (
              <Tooltip title="Remove">
                <Delete style={{ fontSize: '20px' }} onClick={() => { onClickRemoveData(params.id, params.row.name); }} />
              </Tooltip>
              )}
            </>
          </ButtonGroup>
        </>
      ),
    },
  ]);

export const InspectionNewColumns = (onClickEditData, onClickRemoveData, isEditable, isDeletable) => (
  [
    {
      field: 'group_id',
      headerName: 'Group',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Type',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'asset_number',
      headerName: 'Asset Number',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Equipment',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'check_list_id',
      headerName: 'Maintenance Checklist',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'commences_on',
      headerName: 'Commences On',
      width: 160,
      editable: false,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'starts_at',
      headerName: 'Starts At',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (params) => {
        const durationString = convertDecimalToTime(params.value);
        return (
          <span className="ml-2">{durationString}</span>
        );
      },
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (params) => {
        const durationString = convertDecimalToTime(params.value);
        return (
          <span className="ml-2">{durationString}</span>
        );
      },
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'ends_on',
      headerName: 'Ends On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'task_id',
      headerName: 'Maintenance Operations',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      focus: false,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <>
              {isEditable && (!params.row.ends_on || (new Date() <= new Date(getLocalDateDBTimeFormat(params.row.ends_on, 'datetime')))) && (
                <>
                  <Tooltip title="Edit">
                    <Edit style={{ fontSize: '20px', marginRight: '10px' }} onClick={() => { onClickEditData(params.id); }} />
                  </Tooltip>

                  <Tooltip title="Remove">
                    <Delete style={{ fontSize: '20px' }} onClick={() => { onClickRemoveData(params.id, params.row.group_id && params.row.group_id.name); }} />
                  </Tooltip>
                </>
              )}
            </>
          </ButtonGroup>
        </>
      ),
    },
  ]);

export const VisitorColumns = (setViewId, isRejectable, rejectFunc, isDeleteable, onClickRemoveData) => (
  [
    {
      field: 'name',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'visitor_name',
      headerName: 'Visitor Name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'organization',
      headerName: 'Visitor Company',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'host_name',
      headerName: 'Host Name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tenant_id',
      headerName: 'Visiting Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'entry_status',
      headerName: 'Entry Status',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: visitorStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={visitorStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'state',
      headerName: 'Approval Status',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'visitor_badge',
      headerName: 'Visitor Badge',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'actual_in',
      headerName: 'Actual In',
      width: 160,
      editable: true,
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'actual_out',
      headerName: 'Actual Out',
      width: 160,
      editable: true,
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'phone',
      headerName: 'Visitor Phone',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'planned_in',
      headerName: 'Planned In',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'planned_out',
      headerName: 'Planned Out',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'email',
      headerName: 'Visitor Email',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type_of_visitor',
      headerName: 'Visitor Type',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'purpose',
      alternate: 'purpose_id',
      headerName: 'Purpose',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isRejectable || isDeleteable ? ({
      field: 'action',
      headerName: 'Action',
      width: 200,
      focus: false,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      renderCell: (params) => (
        <>
          {isRejectable && isRejecttable(params.row) && (
            <Tooltip title="Reject">
              <FontAwesomeIcon
                className="ml-2 cursor-pointer text-danger"
                onClick={() => { setViewId(params.id); rejectFunc(); }}
                size="lg"
                // color="#1582c8"
                icon={faClose}
              />
            </Tooltip>
          )}
          {isDeleteable && (
            <Tooltip title="Reject">
              <FontAwesomeIcon
                className="ml-3 cursor-pointer"
                size="sm"
                // color="#1582c8"
                icon={faTrashAlt}
                onClick={() => { onClickRemoveData(params.id, params.row.name); }}
              />
            </Tooltip>
          )}
        </>
      ),
    }) : '',
  ].filter(Boolean));

export const AssetColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_seq',
      headerName: 'Reference Number',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 200,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: assetStatusJson,
      renderCell: (val) => <CheckAssetStatus val={val} json={assetStatusJson} deadLine={val.row.end_of_life} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'block_id',
      headerName: 'Block',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'floor_id',
      headerName: 'Floor',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Space',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: 'Parent Asset',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_number',
      headerName: 'Description',
      width: 160,
      editable: true,
      renderCell: (val) => (<>{val.value ? (<div>{htmlSanitizeInput(val.value)}</div>) : '-'}</>),
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'model',
      headerName: 'Model Code',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'purchase_date',
      headerName: 'Purchase Date',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'serial',
      headerName: 'Serial Number',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'monitored_by_id',
      headerName: 'Monitored By',
      width: 160,
      editable: true,
      // renderCell: (val) => <CheckSla val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'managed_by_id',
      headerName: 'Managed By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintained_by_id',
      headerName: 'Maintained By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'manufacturer_id',
      headerName: 'Manufacturer',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<',
      ),
    },
    {
      field: 'warranty_start_date',
      headerName: 'Warranty Start Date',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'warranty_end_date',
      headerName: 'Warranty End Date',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'tag_status',
      headerName: 'Tag Status',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'validation_status',
      headerName: 'Validation Status',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'validated_by',
      headerName: 'Validated By',
      width: 160,
      editable: true,
      // renderCell: (val) => <CheckChannel val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'validated_on',
      headerName: 'Validated On',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'amc_start_date',
      headerName: 'AMC Start Date',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'amc_end_date',
      headerName: 'AMC End Date',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'amc_type',
      headerName: 'AMC Type',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'end_of_life',
      headerName: 'End of Life',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'criticality',
      headerName: 'Criticality',
      width: 150,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: criticalitiesJson,
      renderCell: (val) => <CheckType val={val} json={criticalitiesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const SpaceColumns = () => (
  [
    {
      field: 'space_name',
      headerName: 'Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'path_name',
      headerName: 'Path name',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'asset_category_id',
      headerName: 'Category',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const WorkOderColumns = () => ([
  {
    field: 'name',
    headerName: 'Reference',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'sequence',
    headerName: 'Asset Number',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  }, {
    field: 'maintenance_team_id',
    headerName: 'Maintenance Team',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  }, {
    field: 'state',
    headerName: 'Status',
    width: 180,
    type: 'singleSelect',
    getOptionLabel: (value) => value?.text,
    getOptionValue: (value) => value?.status,
    valueOptions: workorderStatusJson,
    renderCell: (val) => <CheckStatus val={val} json={workorderStatusJson} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridSingleSelectOperators().filter(
      (operator) => operator.value === 'is',
    ),
  }, {
    field: 'equipment_location_id',
    headerName: 'Location',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 180,
    type: 'singleSelect',
    getOptionLabel: (value) => value?.text,
    getOptionValue: (value) => value?.priority,
    valueOptions: workOrderPrioritiesJson,
    renderCell: (val) => <CheckPriorityWo val={val} json={workOrderPrioritiesJson} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridSingleSelectOperators().filter(
      (operator) => operator.value === 'is',
    ),
  }, {
    field: 'issue_type',
    headerName: 'Issue Type',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  }, {
    field: 'employee_id',
    headerName: 'Technician',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  }, {
    field: 'equip_asset_common',
    headerName: 'Equipment/Space',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  }, {
    field: 'maintenance_type',
    headerName: 'Maintenance Type',
    width: 180,
    type: 'singleSelect',
    getOptionLabel: (value) => value?.text,
    getOptionValue: (value) => value?.status,
    valueOptions: workorderMaintenanceJson,
    renderCell: (val) => <CheckType val={val} json={workorderMaintenanceJson} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridSingleSelectOperators().filter(
      (operator) => operator.value === 'is',
    ),
  }, {
    field: 'type_category',
    headerName: 'Type',
    width: 180,
    type: 'singleSelect',
    getOptionLabel: (value) => value?.text,
    getOptionValue: (value) => value?.status,
    valueOptions: workorderTypesJson,
    renderCell: (val) => <CheckType val={val} json={workorderTypesJson} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridSingleSelectOperators().filter(
      (operator) => operator.value === 'is',
    ),
  },
  {
    field: 'task_id',
    headerName: 'Maintenance Operations',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
  {
    field: 'date_planned',
    headerName: 'Requested Date',
    width: 180,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    filterable: false,
  },
  {
    field: 'date_execution',
    headerName: 'Close Date',
    width: 180,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    filterable: false,
  },
  {
    field: 'create_date',
    headerName: 'Created On',
    width: 180,
    dateField: 'datetime',
    valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
    filterable: false,
  },
  {
    field: 'pause_reason_id',
    headerName: 'On-Hold Reason',
    width: 180,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
]);
export const InspectionSchedulerColumns = () => (
  [
    {
      field: 'equipment_id',
      headerName: 'Equipment',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'asset_number',
      headerName: 'Asset Number',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'commences_on',
      headerName: 'Commences On',
      width: 160,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'starts_at',
      headerName: 'Starts At',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'group_id',
      headerName: 'Group',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'check_list_id',
      headerName: 'Checklist',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterable: false,
    },
    {
      field: 'task_id',
      headerName: 'Maintenance Operation',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (val) => <CheckPriority val={val} json={workOrderPrioritiesJson} />,
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'uuid',
      headerName: 'Identifier',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      filterable: false,
    },
    {
      field: 'parent_id',
      headerName: 'Parent Schedule',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },

  ]);

export const SurveyColumns = () => (
  [
    {
      field: 'title',
      headerName: 'Title',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'stage_id',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={surveyStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tot_comp_survey',
      headerName: 'Completed',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'uuid',
      headerName: 'Survey Link',
      width: 160,
      editable: true,
      valueGetter: (params) => (getValue(params.row && params.row.is_send_email ? '-' : params.value)),
      renderCell: (val) => (val.row.is_send_email ? '-' : !val.row.is_send_email && val.row.stage_id[1] == 'Published' ? (

        <Tooltip title="Copy URL">
          <FontAwesomeIcon
            className="ml-2 cursor-pointer"

            onClick={() => { copyToClipboard(val.row.uuid, 'survey'); }}
            size="sm"
            color="#1582c8"
            icon={faCopy}
          />
        </Tooltip>
      ) : '-'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'user_input_ids',
      headerName: 'Viewed',
      width: 180,
      editable: true,
      valueGetter: (params) => (params.value ? getValue(params.value) : '-'),
      func: getValue,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === '=',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Type',
      width: 160,
      editable: true,
      func: ppmFor,
      type: 'singleSelect',
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
      renderCell: (val) => <CheckStatus val={val} json={typeJson} />,
      valueGetter: (params) => getValue(params.value),
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: typeJson,
    },

    {
      field: 'tot_sent_survey',
      headerName: 'Invitations Sent',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tot_start_survey',
      headerName: 'Started',
      width: 160,
      editable: true,
      filterable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === '=',
      ),
    },
    {
      field: 'actions',
      headerName: 'Answers Summary',
      width: 180,
      renderCell: (val) => ((val.row.stage_id[1] == 'Published')
        ? (
          <Tooltip title="Answers Summary">
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ffffff !important', color: '#3a4354 !important' }}
              size="small"
            >
              <Typography sx={{ fontFamily: 'Suisse Intl', fontSize: '13px' }}>
                <img src={chartIcon} className="cursor-pointer mx-1" alt="Answers Summary" aria-hidden="true" height={13} width={13} />
                Answers Summary
              </Typography>
            </Button>
          </Tooltip>
        )
        : '  -'),
    },
    {
      field: 'id',
      headerName: 'View Answers',
      width: 180,
      renderCell: (val) => ((val.row.stage_id[1] == 'Published')
        ? (
          <>
            {' '}
            <Tooltip title="View Answers">
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ffffff !important', color: '#3a4354 !important' }}
                size="small"
              >
                <Typography sx={{ fontFamily: 'Suisse Intl', fontSize: '13px' }}>
                  <img src={listIcon} className="cursor-pointer mx-1" alt="View Answers" aria-hidden="true" height={13} width={13} />
                  View Answers
                </Typography>
              </Button>
            </Tooltip>

          </>
        )
        : '  -'),
    },

  ]);

export const TrackerColumns = () => (
  [
    {
      field: 'audit_for',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Title',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'temp_type_id',
      headerName: 'Type',
      width: 180,
      editable: true,

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={cjStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'start_date',
      headerName: 'Billing Start Date',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'end_date',
      headerName: 'Billing End Date',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'tracker_template_id',
      headerName: 'Tracker Template',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'created_by_id',
      headerName: 'Created By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

    {
      field: 'created_on',
      headerName: 'Created On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

    {
      field: 'reviewed_by_id',
      headerName: 'Reviewed By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

    {
      field: 'reviewed_on',
      headerName: 'Reviewed On',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },

    {
      field: 'approved_by_id',
      headerName: 'Approved By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

    {
      field: 'approved_on',
      headerName: 'Approved On',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
  ]);

export const GatePassColumns = (customData) => (
  [
    {
      field: 'gatepass_number',
      headerName: 'Gate Pass No',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'description',
      headerName: 'Purpose',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'gatepass_type',
      headerName: 'Asset / Item',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'requestor_id',
      headerName: 'Requestor',
      width: 180,
      editable: true,

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'requested_on',
      headerName: 'Requested on',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 200,
      editable: false,
      renderCell: (val) => <CheckCustomStatusGatePass val={val} json={gatePassStatusJson} custom customData={customData} />,
      valueGetter: (params) => getValue(params.value),
      func: getCustomGatePassStatusName,
      filterable: false,
    },
    {
      field: 'reference',
      headerName: 'Reference',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Bearer Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'email',
      headerName: 'Bearer Email',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'bearer_return_on',
      headerName: 'Returned on',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,

    },
    {
      field: 'approved_on',
      headerName: 'Approved on',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

    {
      field: 'approved_by',
      headerName: 'Approved By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const InboundMailColumns = () => (
  [
    /*  {
       field: 'id',
       headerName: 'ID',
       width: 160,
       editable: true,
       valueGetter: (params) => getValue(params.value),
       func: getValue,
       filterOperators: getGridStringOperators().filter(
         (operator) => operator.value === 'contains',
       ),
     }, */
    {
      field: 'sender',
      headerName: 'Sender Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'employee_id',
      headerName: 'Receiver Name',
      width: 180,
      editable: true,

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={MailStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'received_on',
      headerName: 'Registered On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'received_by',
      headerName: 'Registered By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parcel_dimensions',
      headerName: 'Parcel Dimensions',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tracking_no',
      headerName: 'Tracking Number',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'courier_id',
      headerName: 'Courier',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,

    },
    {
      field: 'recipient',
      headerName: 'Type',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },

    {
      field: 'department_id',
      headerName: 'Department',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'collected_on',
      headerName: 'Delivered On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'collected_by',
      headerName: 'Delivered By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      renderCell: (val) => (
        <Tooltip title="Delete">
          <span className="font-weight-400 d-inline-block" />
          <FontAwesomeIcon
            className="mr-1 ml-1 cursor-pointer"
            size="sm"
            icon={faTrashAlt}
          />
        </Tooltip>
      ),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const OutboundMailColumns = () => (
  [
    /* {
      field: 'id',
      headerName: 'ID',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
    {
      field: 'employee_id',
      headerName: 'Sender Name',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sent_to',
      headerName: 'Receiver Name',
      width: 180,
      editable: true,

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={MailStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sent_on',
      headerName: 'Registered On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'sent_by',
      headerName: 'Registered By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parcel_dimensions',
      headerName: 'Parcel Dimensions',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tracking_no',
      headerName: 'Tracking Number',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'courier_id',
      headerName: 'Courier',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,

    },
    {
      field: 'recipient',
      headerName: 'Type',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },

    {
      field: 'department_id',
      headerName: 'Department',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'delivered_on',
      headerName: 'Delivered On',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },
    {
      field: 'delivered_by',
      headerName: 'Delivered By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

  ]);

export const ReceiveTransferColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Reference',
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'partner_id',
      headerName: 'Vendor',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'requested_on',
      headerName: 'Requested on',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'note',
      headerName: 'Description',
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'request_state',
      headerName: 'Status',
      width: 180,
      editable: false,
      renderCell: (val) => <CheckStatus val={val} json={InwardStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'dc_no',
      headerName: 'DC#',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'po_no',
      headerName: 'PO#',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'expires_on',
      headerName: 'Expiry Date',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,

    },
    {
      field: 'location_id',
      headerName: 'Source Location',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,
    },

    {
      field: 'location_dest_id',
      headerName: 'Destination Location',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const MaterialRequestColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Reference',
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'use_in',
      headerName: 'Use In',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'request_state',
      headerName: 'Status',
      width: 180,
      editable: false,
      renderCell: (val) => <CheckStatus val={val} json={InwardStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'asset_id',
      headerName: 'Asset',
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Location',
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'employee_id',
      headerName: 'Employee',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'department_id',
      headerName: 'Department',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'requested_by_id',
      headerName: 'Requested by',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,

    },
    {
      field: 'requested_on',
      headerName: 'Requested on',
      width: 180,
      editable: false,
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

    {
      field: 'approved_by_id',
      headerName: 'Approved by',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'note',
      headerName: 'Description',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterable: false,

    },
    {
      field: 'expires_on',
      headerName: 'Expiry Date',
      width: 180,
      editable: false,
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

    {
      field: 'location_id',
      headerName: 'Source Location',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_dest_id',
      headerName: 'Destination Location',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const ScrapColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Description',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'product_id',
      headerName: 'Product',
      width: 180,
      editable: true,

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'date_expected',
      headerName: 'Expected Date',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'scrap_qty',
      headerName: 'Quantity',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Location',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'scrap_location_id',
      headerName: 'Scrap Location',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={ScrapStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Create Date',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);

export const StockAuditColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Audit Description',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'date',
      headerName: 'Audit Date',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'create_uid',
      headerName: 'Audited By',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Location',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 180,
      editable: true,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: StockAuditStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={StockAuditStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'reason_id',
      headerName: 'Reason',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const WarehouseColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Warehouse',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'lot_stock_id',
      headerName: 'Location Stock',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'partner_id',
      headerName: 'Address',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 200,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={LocationStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const LocationColumns = () => (
  [
    {
      field: 'display_name',
      headerName: 'Location',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'usage',
      headerName: 'Location Type',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 200,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={LocationStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'partner_id',
      headerName: 'Owner',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'posx',
      headerName: 'Corridor (X)',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'posy',
      headerName: 'Shelves (Y)',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'posz',
      headerName: 'Height (Z)',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

  ]);

export const OperationTypeColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Operation Type',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'warehouse_id',
      headerName: 'Warehouse',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_id',
      headerName: 'Reference Sequence',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 200,
      editable: true,
      renderCell: (val) => <CheckStatus val={val} json={LocationStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'code',
      headerName: 'Type of Operation',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'default_location_src_id',
      headerName: 'Default Source Location',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'default_location_dest_id',
      headerName: 'Default Destinaton Location',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 180,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },

  ]);

export const ReorderColumns = (isDeleteable, onClickRemoveData) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'product_id',
      headerName: 'Product',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Location',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'warehouse_id',
      headerName: 'Warehouse',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'product_max_qty',
      headerName: 'Maximum Quantity',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

    {
      field: 'product_min_qty',
      headerName: 'Minimum Quantity',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'product_uom',
      headerName: 'Unit of Measure',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
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

  ].filter(Boolean));

export const CommodityTranscationColumns = (report, isStatus, isDeleteable) => {
  let returnObj = [
    {
      field: 'commodity',
      headerName: 'Commodity',
      width: 180,
      editable: false,
      valueGetter: (params) => (report ? getValue(extractNameObject(params.value, 'name')) : getValue(params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 180,
      editable: false,
      valueGetter: (params) => getValueNo(params.value),
      func: getValueNo,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 180,
      editable: false,
      valueGetter: (params) => (report ? getValue(extractNameObject(params.value, 'name')) : getValue(params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'initial_reading',
      headerName: 'Initial Reading',
      width: 180,
      editable: false,
      valueGetter: (params) => getValueNo(params.value),
      func: getValueNo,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'final_reading',
      headerName: 'Final Reading',
      width: 180,
      editable: false,
      valueGetter: (params) => getValueNo(params.value),
      func: getValueNo,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'difference',
      headerName: 'Difference',
      width: 180,
      editable: false,
      valueGetter: (params) => getValueNo(params.value),
      func: getValueNo,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'tanker_id',
      headerName: 'Tanker',
      width: 180,
      editable: false,
      valueGetter: (params) => (report ? getValue(extractNameObject(params.value, 'name')) : getValue(params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence',
      headerName: 'Sequence',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),

    },
    {
      field: 'location_id',
      headerName: 'Space',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'in_datetime',
      headerName: 'In Date',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'out_datetime',
      headerName: 'Out Date',
      width: 180,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ];
  if (!report && isDeleteable) {
    returnObj = [...returnObj, ...[
      {
        field: 'action',
        headerName: 'Action',
        width: 120,
        editable: true,
        filterable: false,
        valueGetter: (params) => getValue(params.value),
        renderCell: (val) => (
          <Tooltip title="Delete">
            <span className="font-weight-400 d-inline-block" />
            <FontAwesomeIcon
              className="mr-1 ml-1 cursor-pointer"
              size="sm"
              icon={faTrashAlt}
            />
          </Tooltip>
        ),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ],
    ];
  } else {
    returnObj = [...returnObj, ...[
      {
        field: 'amount',
        headerName: 'Amount',
        width: 180,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'delivery_challan',
        headerName: 'DC',
        width: 180,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'driver',
        headerName: 'Driver',
        width: 180,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'driver_contact',
        headerName: 'Driver Contact',
        width: 180,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'remark',
        headerName: 'Remarks',
        width: 180,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ],
    ];
  }
  const dynamicObject = {
    field: 'state',
    headerName: 'Status',
    width: 160,
    editable: false,
    renderCell: (val) => <CheckStatus val={val} json={tankerStatusJson} />,
    valueGetter: (params) => getValue(params.value),
    func: getValue,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  };

  if (isStatus) {
    returnObj.splice(2, 0, dynamicObject); // Insert the new column at the specified index
  }
  return returnObj;
};

export const CommodityTankersColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Registration No',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'commodity',
      headerName: 'Commodity',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'vendor_id',
      headerName: 'Vendor',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      editable: true,
      filterable: false,
      valueGetter: (params) => getValue(params.value),
      renderCell: (val) => (
        <Tooltip title="Delete">
          <span className="font-weight-400 d-inline-block" />
          <FontAwesomeIcon
            className="mr-1 ml-1 cursor-pointer"
            size="sm"
            icon={faTrashAlt}
          />
        </Tooltip>
      ),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },

  ]);

export const OccupancyColumns = () => (
  [
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
      editable: true,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'cam_area',
      headerName: 'CAM Area (sq.ft)',
      width: 150,
      editable: true,
      type: 'number',
      availableAggregationFunctions: ['avg', 'sum'],
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
      ),
    },
    {
      field: 'occupied',
      headerName: 'Occupied (sq.ft)',
      width: 150,
      editable: true,
      type: 'number',
      availableAggregationFunctions: ['avg', 'sum'],
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
      ),
    },
    {
      field: 'occupancy_in',
      headerName: 'Occupancy in %',
      width: 150,
      editable: true,
      type: 'number',
      availableAggregationFunctions: ['avg', 'sum'],
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === '>' || operator.value === '<' || operator.value === '=',
      ),
    },
  ]);

const dataSelection = (paramsEdit, options) => (
  <Autocomplete
    sx={{
      width: '100%',
    }}
    name=""
    label="Select"
    size="small"
    value={paramsEdit.value}
    getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={options}
    onChange={(event, newValue) => {
      event.stopPropagation();
      paramsEdit.api.setEditCellValue({
        id: paramsEdit.id,
        field: paramsEdit.field,
        value: newValue.name,
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="standard"
        className="without-padding custom-icons w-100"
        placeholder="Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>

              <InputAdornment position="end" />
            </>
          ),
        }}
      />
    )}
  />
);

export function OccupancyDynamicColumns(data, isEditable) {
  const newArrData = data.map((cl) => {
    const columnConfig = {
      field: cl.field,
      headerName: cl.headerName,
      width: 180,
      editable: isEditable ? !!(cl.editable && cl.editable === true) : isEditable,
      type: cl.type === 'number' || cl.type === 'date' || cl.type === 'datetime' ? cl.type : 'text',
      dateField: cl.type === 'date' || cl.type === 'datetime' ? cl.type : undefined,
      valueGetter: (params) => getValueTypesEdit(params.value, cl.type),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => (cl.type === 'number' ? operator.value === '>' || operator.value === '<' || operator.value === '=' : operator.value === 'contains'),
      ),
    };

    if (isEditable && cl.options && cl.options.length > 0 && isEditable && (cl.editable && cl.editable === true)) {
      columnConfig.renderEditCell = (paramsEdit) => dataSelection(paramsEdit, cl.options);
    }

    return columnConfig;
  });
  return newArrData;
}

export const HazardsColumns = () => (
  [
    {
      field: 'reference',
      headerName: 'Hazard Number',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'name',
      headerName: 'Title',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'priority_id',
      headerName: 'Priority',
      width: 150,
      editable: true,
      sortable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reported_on',
      headerName: 'Reported On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      editable: true,
      sortable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'target_closure_date',
      headerName: 'Target Closure Date',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'assigned_id',
      headerName: 'Assigned To',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 160,
      editable: false,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: hxincidentStatusJson,
      renderCell: (val) => <CheckStatus val={val} json={hxincidentStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: CheckStatusText,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'type_category',
      headerName: 'Type',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: workorderTypesJson,
      renderCell: (val) => <CheckType val={val} json={workorderTypesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'asset_id',
      headerName: 'Space',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Equipment',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'incident_type_id',
      headerName: 'Type of Activity / Hazard',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'incident_on',
      headerName: 'Report On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'corrective_action',
      headerName: 'Corrective Action',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'reported_by_id',
      headerName: 'Reported By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'acknowledged_by_id',
      headerName: 'Acknowledged By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'acknowledged_on',
      headerName: 'Acknowledged On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'resolved_by_id',
      headerName: 'Resolved By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'resolved_on',
      headerName: 'Resolved On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    {
      field: 'validated_by_id',
      headerName: 'Validated By',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'validated_on',
      headerName: 'Validated On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
  ]);

export const ReadingLogsColumns = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'reading_id',
      headerName: 'Reading',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'date',
      headerName: 'Measure Date',
      width: 180,
      editable: false,
      filterable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'value',
      headerName: 'Measure Value',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Equipment/Space',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'planning_run_result',
      headerName: 'Planning Run Result',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'order_id',
      headerName: 'Maintenance Order',
      width: 180,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
              <Tooltip title="Edit">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faPencil}
                  onClick={() => { onClickEditData(params.row); }}
                />
              </Tooltip>
            )}
            {isDeleteable && (
              <Tooltip title="Delete">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faTrashAlt}
                  onClick={() => { onClickRemoveData(params.row); }}
                />
              </Tooltip>
            )}
          </>
        ),
      } : '',

  ].filter(Boolean));

export const bmsAlarmsColumns = (isDeleteAllowed, onClickDelete) => (
  [
    {
      field: 'company_id',
      headerName: 'Site',
      width: 180,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckBCStatus val={val} json={bmsStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'generated_on',
      headerName: 'Generated on',
      width: 200,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type_category',
      headerName: 'Type',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_id',
      headerName: 'Asset',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'space_id',
      headerName: 'Space',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sub_category_id',
      headerName: 'Sub Category',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'requested_by',
      headerName: 'Requested by',
      width: 150,
      editable: true,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'planned_sla_end_date',
      headerName: 'Planned SLA End Date',
      width: 200,
      editable: true,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'resolution',
      headerName: 'Resolution',
      width: 160,
      editable: true,
      valueGetter: (params) => getValue((params.value)),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    isDeleteAllowed
      ? {
        field: 'action',
        headerName: 'Action',
        width: 200,
        editable: false,
        focus: false,
        renderCell: (params) => (
          <>
            {isDeleteAllowed && (
              <Tooltip title="Delete">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faTrashAlt}
                  onClick={() => { onClickDelete(params.id, params.row.subject); }}
                />
              </Tooltip>
            )}
          </>
        ),
      } : '',
  ].filter(Boolean));

export const SiteColumns = () => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
      width: 150,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'country_id',
      headerName: 'Country',
      width: 150,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state_id',
      headerName: 'State',
      width: 150,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'street',
      headerName: 'Address',
      width: 250,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);
export const SpaceCategoryList = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: 'Parent Space Category',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 200,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
              <Tooltip title="Edit">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faPencil}
                  onClick={() => { onClickEditData(params.id); }}
                />
              </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const EquipmentCategory = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: 'Parent Space Category',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const TeamsListSite = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
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
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const ProblemCategoryList = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'team_category_id',
      headerName: 'Team Category',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const ProblemCategoryGroupList = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type_category',
      headerName: 'Type',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: helpdeskTypesJson,
      renderCell: (val) => <CheckType val={val} json={workorderTypesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'is_all_category',
      headerName: 'All Category',
      width: 160,
      editable: false,
      filterable: false,
      renderCell: (val) => <CheckVal val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getBooleanValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const EscalationLevelList = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'type_category',
      headerName: 'Type',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: helpdeskTypesJson,
      renderCell: (val) => <CheckType val={val} json={helpdeskTypesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'level',
      headerName: 'Level',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: helpdeskTypesJson,
      renderCell: (val) => <CheckType val={val} json={levelTypesJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);

export const OperationColumns = (onClickEditData, onClickRemoveData, isEditable, isDeleteable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      width: 230,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_type',
      headerName: 'Maintenance Type',
      width: 180,
      type: 'singleSelect',
      getOptionLabel: (value) => value?.text,
      getOptionValue: (value) => value?.status,
      valueOptions: workorderMaintenanceJson,
      renderCell: (val) => <CheckType val={val} json={workorderMaintenanceJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === 'is',
      ),
    },
    {
      field: 'order_duration',
      headerName: 'Duration',
      width: 160,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 150,
      editable: true,
      renderCell: (val) => <CheckValStatus val={val} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'create_date',
      headerName: 'Created On',
      width: 160,
      editable: false,
      dateField: 'datetime',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'datetime'),
      func: getValue,
      filterable: false,
    },
    isEditable || isDeleteable
      ? {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { onClickEditData(params.id); }}
              />
            </Tooltip>
            )}
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
  ].filter(Boolean)
);
