/* eslint-disable react/jsx-filename-extension */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  Button,
  ButtonGroup, Tooltip, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import React from 'react';
import { Delete, RestoreFromTrash } from '@material-ui/icons';
import { editValue, infoValue } from '../adminSetup/utils/utils';
import {
  extractTextObject, getCompanyTimezoneDateForColumns,
} from '../util/appUtils';
import {
  InspectionStatusJson,
  UsersStatusJson,
} from './utils/util';

const getValue = (value) => {
  let fieldValue = value || '';
  if (Array.isArray(fieldValue)) {
    fieldValue = value[1];
  } else if (fieldValue && typeof fieldValue === 'object' && !Object.keys(fieldValue).length) {
    fieldValue = '';
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
    fieldValue = value.space_name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
    fieldValue = value.path_name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
    fieldValue = value.name;
  }
  return fieldValue;
};

const getValueCount = (value) => {
  const fieldValue = value || 0;
  return fieldValue;
};

const getRowValue = (value, field) => {
  let fieldValue = value || '';
  /* if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
    fieldValue = value.path_name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
    fieldValue = value.name;
  } */
  if (value && extractTextObject(value.asset_category_id) === 'Floor') {
    fieldValue = `${value.parent_id?.space_name}/${value.space_name}`;
  } else if (value && extractTextObject(value.asset_category_id) === 'Wing') {
    fieldValue = `${value.parent_id?.parent_id?.space_name}/${value.parent_id?.space_name}/${value.space_name}`;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
    fieldValue = value.space_name;
  } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
    fieldValue = value.name;
  }
  return fieldValue;
};

const getBuildingName = (row) => {
  let building = '';
  const firstParent = row && row.parent_id;
  const secondParent = firstParent && firstParent.parent_id;
  if (firstParent.asset_category_id && firstParent.asset_category_id.name === 'Building' && firstParent.id) {
    building = row.parent_id.space_name;
  }
  else if (firstParent && firstParent.parent_id && firstParent.parent_id.asset_category_id && firstParent.parent_id.asset_category_id.name === 'Building' && firstParent.parent_id.id) {
    building = firstParent.parent_id.space_name;
  }
  else if (secondParent && secondParent.parent_id && secondParent.parent_id.asset_category_id && secondParent.parent_id.asset_category_id.name === 'Building' && secondParent.parent_id.id) {
    building = secondParent.parent_id.space_name;
  }
  return building;
};

const getFloorName = (row) => {
  let floor = '';
  const firstParent = row && row.parent_id;
  if (firstParent.asset_category_id && firstParent.asset_category_id.name === 'Floor' && firstParent.id) {
    floor = row.parent_id.space_name;
  }
  else if (firstParent && firstParent.parent_id && firstParent.parent_id.asset_category_id && firstParent.parent_id.asset_category_id.name === 'Floor' && firstParent.parent_id.id) {
    floor = firstParent.parent_id.space_name;
  }
  return floor;
};

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

const CheckActiveStatus = (val) => (
  <>
    <strong>
      <Box
        sx={{
          backgroundColor: val.val ? '#F5FFE5' : '#ffeded',
          padding: '4px 8px 4px 8px',
          border: 'none',
          borderRadius: '4px',
          color: val.val ? '#309827' : '#DE1807',
          fontFamily: 'Suisse Intl',
        }}
      >
        {val.val ? 'Active' : 'Inactive'}
      </Box>
    </strong>
  </>
);

const CheckVal = (val) => (
  <>
    {val && val.val && val.val.formattedValue === true ? 'Yes' : 'No'}
  </>
);

const getBooleanValue = (value) => {
  let fieldValue = 'No';
  if (value) {
    fieldValue = 'Yes';
  }
  return fieldValue;
};

const getActiveValue = (value) => {
  let fieldValue = 'Inactive';
  if (value) {
    fieldValue = 'Active';
  }
  return fieldValue;
};

export const SiteColumns = (
  editMode,
  countrySelection,
  stateSelection,
) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {editMode ? editValue() : ''}
          {infoValue('siteName')}
        </>
      ),
      focus: !editMode,
      width: 180,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
      renderHeader: () => (
        <>
          Code
          {infoValue('siteCode')}
        </>
      ),
      width: 150,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      renderHeader: () => (
        <>
          City
          {editMode ? editValue() : ''}
          {infoValue('siteCity')}
        </>
      ),
      width: 150,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'country_id',
      headerName: 'Country',
      renderHeader: () => (
        <>
          Country
          {editMode ? editValue() : ''}
          {infoValue('siteCountry')}
        </>
      ),
      width: editMode ? 250 : 150,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      renderEditCell: (paramsEdit) => (
        editMode
          ? countrySelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.name
            : paramsEdit.value
      ),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state_id',
      headerName: 'State',
      renderHeader: () => (
        <>
          State
          {editMode ? editValue() : ''}
          {infoValue('siteState')}
        </>
      ),
      width: editMode ? 250 : 150,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      renderEditCell: (paramsEdit) => (
        editMode
          ? stateSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.name
            : paramsEdit.value
      ),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'street',
      headerName: 'Address',
      renderHeader: () => (
        <>
          Address
          {editMode ? editValue() : ''}
          {infoValue('siteAddress')}
        </>
      ),
      width: 250,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const UserColumns = (editMode, onClickAssignData, onClickEditData, onClickRemoveData, isEditable, isDeletable) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {editMode ? editValue() : ''}
          {infoValue('userName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      renderHeader: () => (
        <>
          Email
          {editMode ? editValue() : ''}
          {infoValue('userEmail')}
        </>
      ),
      width: 250,
      editable: false,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'is_mobile_user',
      headerName: 'Mobile User',
      renderHeader: () => (
        <>
          Mobile User
          {infoValue('userMobile')}
        </>
      ),
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
      field: 'active',
      headerName: 'Active Status',
      renderHeader: () => (
        <>
          Active Status
          {infoValue('userActive')}
        </>
      ),
      width: 200,
      editable: false,
      filterable: false,
      renderCell: (params) => <CheckActiveStatus val={params.row.active} />,
      valueGetter: (params) => (!!params.value),
      func: getActiveValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      headerName: 'Associated To',
      field: 'associates_to',
      renderHeader: () => (
        <>
          Associated To
          {infoValue('userAssociate')}
        </>
      ),
      minWidth: 200,
      focus: !editMode,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      func: getValue,
    },
    {
      headerName: 'Status',
      field: 'state',
      editable: false,
      sortable: !editMode,
      renderHeader: () => (
        <>
          Status
          {infoValue('userStatus')}
        </>
      ),
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
      focus: !editMode,
      editable: editMode,
      renderHeader: () => (
        <>
          Associated Entity
          {infoValue('userEntity')}
        </>
      ),
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
      editable: false,
      sortable: !editMode,
      renderHeader: () => (
        <>
          Employee ID
          {infoValue('userEmpId')}
        </>
      ),
      minWidth: 200,
      valueGetter: (params) => getValue(params.value),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      func: getValue,
    }, {
      headerName: 'Department',
      field: 'hr_department',
      editable: false,
      sortable: !editMode,
      renderHeader: () => (
        <>
          Department
          {infoValue('userDept')}
        </>
      ),
      minWidth: 200,
      valueGetter: (params) => getValue(params.value),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      func: getValue,
    }, {
      headerName: 'Shift',
      editable: false,
      sortable: !editMode,
      field: 'resource_calendar_id',
      renderHeader: () => (
        <>
          Shift
          {infoValue('userShift')}
        </>
      ),
      minWidth: 200,
      valueGetter: (params) => getValue(params.value),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      func: getValue,
    }, {
      headerName: 'Current Site',
      field: 'company_id',
      editable: false,
      sortable: !editMode,
      renderHeader: () => (
        <>
          Current Site
          {infoValue('userSite')}
        </>
      ),
      minWidth: 200,
      valueGetter: (params) => getValue(params.value),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
      func: getValue,
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
              {params.row.active && (
              <>
                <Tooltip title="Assign Teams" onClick={() => { onClickAssignData(params.id); }}>
                  <Button>
                    <GroupAddIcon style={{ fontSize: '14px' }} />
                  </Button>
                </Tooltip>
                {isEditable && (
                <Tooltip title="Edit" onClick={() => { onClickEditData(params.id); }}>
                  <Button>
                    <Edit style={{ fontSize: '14px' }} />
                  </Button>
                </Tooltip>
                )}
              </>
              )}
              {isDeletable && (
              <Tooltip title={params.row.active ? 'Archive' : 'Unarchive'}>
                <Button onClick={() => { onClickRemoveData(params.id, params.row.name, params.row.active); }}>
                  {' '}
                  {params.row.active ? <Delete style={{ fontSize: '15px' }} /> : <RestoreFromTrash style={{ fontSize: '15px' }} /> }
                </Button>
              </Tooltip>
              )}
            </>
          </ButtonGroup>
        </>
      ),
    },
    /* {
      field: 'password',
      headerName: 'Password',
      renderHeader: () => (
        <>
          Password
          {infoValue('userPassword')}
        </>
      ),
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
    /* {
      field: 'user_role_id',
      headerName: 'Current User Role',
      renderHeader: () => (
        <>
          Current User Role
          {infoValue('userRole')}
        </>
      ),
      width: 200,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
  ]);

export const teamsUserColumns = (onClickDelete) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {infoValue('teamname')}
        </>
      ),
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'team_type',
      headerName: 'Type',
      renderHeader: () => (
        <>
          Type
          {infoValue('teamType')}
        </>
      ),
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'team_category_id',
      headerName: 'Category',
      renderHeader: () => (
        <>
          Category
          {infoValue('teamcategory')}
        </>
      ),
      width: 200,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'company_id',
      headerName: 'Company',
      renderHeader: () => (
        <>
          Company
          {infoValue('company')}
        </>
      ),
      width: 200,
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
          {/* <Button sx={{ fontSize: '10px !important' }} variant="outlined" size="small" onClick={() => { onClickTeamMember(params.id); }}>
              Team Member
            </Button> */}
          <Tooltip title="Delete Team">
            <Button onClick={() => { onClickDelete(params.id, params.row.name); }}>
              <Delete style={{ fontSize: '14px' }} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ]);

export const MemberColumns = (onClickDelete) => (
  [
    {
      field: 'employee_id',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {infoValue('teamMemberName')}
        </>
      ),
      width: 200,
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
          {/* <Button sx={{ fontSize: '10px !important' }} variant="outlined" size="small" onClick={() => { onClickTeamMember(params.id); }}>
            Team Member
          </Button> */}
          <Tooltip title="Delete Team Member">
            <Button onClick={() => { onClickDelete(params.id, params.row.employee_id); }}>
              <Delete style={{ fontSize: '14px' }} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ]);

export const TeamsColumns = (editMode, categorySelection, setErrorMessage, onClickTeamMember) => (
  [
    {
      field: 'name',
      headerName: editMode ? 'Name*' : 'Name',
      renderHeader: () => (
        <>
          Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('teamname')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Name is required' : '');
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => getValue(params.value),

      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'team_category_id',
      headerName: editMode ? 'Team Category*' : 'Team Category',
      renderHeader: () => (
        <>
          Team Category
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('teamcategory')}
        </>
      ),
      width: 220,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Team Category is required' : '');
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getValue(params.value),
      renderEditCell: (paramsEdit) => (
        editMode
          ? categorySelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.name
            : paramsEdit.value
      ),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    !editMode && (
      {
        field: 'action',
        headerName: 'Action',
        width: 200,
        focus: false,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        renderCell: (params) => (
          <>
            {/* <Button sx={{ fontSize: '10px !important' }} variant="outlined" size="small" onClick={() => { onClickTeamMember(params.id); }}>
              Team Member
            </Button> */}
            <Tooltip title="Team Members">
              <Button onClick={() => { onClickTeamMember(params.id); }}>
                <GroupAddIcon style={{ fontSize: '14px' }} />
              </Button>
            </Tooltip>
          </>
        ),
      }),
  ]);

export const BuildingColumns = (editMode, setErrorMessage) => (
  [
    {
      field: 'space_name',
      headerName: editMode ? 'Building Name*' : 'Building Name',
      renderHeader: () => (
        <>
          Building Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('buildingName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Building Name is required' : '');
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_asset_hierarchy',
      headerName: 'Reference Number',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('buildingRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      focus: !editMode,
      width: 220,
      editable: false,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      renderHeader: () => (
        <>
          Max Occupancy
          {editMode ? editValue() : ''}
          {infoValue('buildingoccupancy')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'area_sqft',
      headerName: 'Area Sqft',
      renderHeader: () => (
        <>
          Area Sqft
          {editMode ? editValue() : ''}
          {infoValue('buildingarea')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 180,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    /* {
      field: 'name',
      headerName: 'Short Code',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Short Code
            {infoValue('buildingCode')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      width: 250,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
  ]);

export const FloorColumns = (editMode, buildingSelection, setErrorMessage) => (
  [
    {
      field: 'space_name',
      headerName: editMode ? 'Floor Name*' : 'Floor Name',
      renderHeader: () => (
        <>
          Floor Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('floorName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Floor Name is required' : '');
        return { ...params.props, error: hasError };
      },

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_asset_hierarchy',
      headerName: 'Reference Number',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('floorRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      focus: !editMode,
      width: 220,
      editable: false,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      renderHeader: () => (
        <>
          Max Occupancy
          {editMode ? editValue() : ''}
          {infoValue('flooroccupancy')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 200,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'area_sqft',
      headerName: 'Area Sqft',
      renderHeader: () => (
        <>
          Area Sqft
          {editMode ? editValue() : ''}
          {infoValue('floorarea')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 160,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    /* {
      field: 'name',
      headerName: 'Short Code',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Short Code
            {infoValue('floorCode')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      width: 250,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
    {
      field: 'parent_id',
      headerName: editMode ? 'Building Name *' : 'Building Name',
      renderHeader: () => (
        <>
          Building Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('floorParentList')}
        </>
      ),
      width: 250,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Building is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? buildingSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.space_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getRowValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const WingColumns = (editMode, floorSelection, setErrorMessage) => (
  [
    {
      field: 'space_name',
      headerName: editMode ? 'Wing Name*' : 'Wing Name',
      renderHeader: () => (
        <>
          Wing Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('wingName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Wing Name is required' : '');
        return { ...params.props, error: hasError };
      },

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_asset_hierarchy',
      headerName: 'Reference Number',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('wingRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      focus: !editMode,
      sortable: !editMode,
      width: 220,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      renderHeader: () => (
        <>
          Max Occupancy
          {editMode ? editValue() : ''}
          {infoValue('wingoccupancy')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 200,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'area_sqft',
      headerName: 'Area Sqft',
      renderHeader: () => (
        <>
          Area Sqft
          {editMode ? editValue() : ''}
          {infoValue('wingarea')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 160,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    /* {
        field: 'name',
        headerName: 'Short Code',
        renderHeader: () => (
          <div>
            <Typography sx={{ fontSize: '14px' }}>
              Short Code
              {infoValue('wingCode')}
            </Typography>
            <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
          </div>
        ),
        width: 250,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      }, */
    {
      field: 'block_id',
      headerName: 'Building Name',
      renderHeader: () => (
        <>
          Building Name
          {infoValue('wingBuilding')}
        </>
      ),
      width: 190,
      editable: false,
      sortable: !editMode,
      //valueGetter: (params) => getValue(params.value),
      valueGetter: (params) => getBuildingName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'floor_id',
      headerName: 'Floor Name',
      renderHeader: () => (
        <>
          Floor Name
          {infoValue('wingFloor')}
        </>
      ),
      width: 180,
      editable: true,
      sortable: !editMode,
      // valueGetter: (params) => ((params.row && params.row.parent_id
      //     && params.row.parent_id.asset_category_id && params.row.parent_id.asset_category_id.name) === 'Floor' && params.row.parent_id.id ? params.row.parent_id.space_name : ''),
      valueGetter: (params) => getFloorName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: editMode ? 'Building/Floor*' : 'Building/Floor',
      renderHeader: () => (
        <>
          Building/Floor
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('wingParentList')}
        </>
      ),
      width: 250,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Building/Floor is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? floorSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.space_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getRowValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const RoomColumns = (editMode, floorSelection, setErrorMessage) => (
  [
    {
      field: 'space_name',
      headerName: editMode ? 'Room Name*' : 'Room Name',
      renderHeader: () => (
        <>
          Room Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('roomName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Room Name is required' : '');
        return { ...params.props, error: hasError };
      },

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_asset_hierarchy',
      headerName: 'Reference Number',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('roomRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      focus: !editMode,
      sortable: !editMode,
      width: 220,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      renderHeader: () => (
        <>
          Max Occupancy
          {editMode ? editValue() : ''}
          {infoValue('roomoccupancy')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 200,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'area_sqft',
      headerName: 'Area Sqft',
      renderHeader: () => (
        <>
          Area Sqft
          {editMode ? editValue() : ''}
          {infoValue('roomarea')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      sortable: !editMode,
      width: 160,
      editable: editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    /* {
      field: 'name',
      headerName: 'Short Code',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Short Code
            {infoValue('roomCode')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      width: 250,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
    {
      field: 'block_id',
      headerName: 'Building Name',
      renderHeader: () => (
        <>
          Building Name
          {infoValue('roomBuilding')}
        </>
      ),
      width: 190,
      editable: false,
      sortable: !editMode,
      //valueGetter: (params) => getValue(params.value),
      valueGetter: (params) => getBuildingName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'floor_id',
      headerName: 'Floor Name',
      renderHeader: () => (
        <>
          Floor Name
          {infoValue('roomFloor')}
        </>
      ),
      width: 180,
      editable: true,
      sortable: !editMode,
      // valueGetter: (params) => ((params.row && params.row.parent_id
      //   && params.row.parent_id.asset_category_id && params.row.parent_id.asset_category_id.name) === 'Floor' && params.row.parent_id.id ? params.row.parent_id.space_name : ''),
        valueGetter: (params) => getFloorName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: editMode ? 'Building/Floor/Wing*' : 'Building/Floor/Wing',
      renderHeader: () => (
        <>
          Building/Floor/Wing
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('roomParentList')}
        </>
      ),
      width: 250,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Building/Floor/Wing is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? floorSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.space_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getRowValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const SpaceColumns = (editMode, floorSelection, setErrorMessage) => (
  [
    {
      field: 'space_name',
      headerName: editMode ? 'Space Name*' : 'Space Name',
      renderHeader: () => (
        <>
          Space Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('spaceName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Space Name is required' : '');
        return { ...params.props, error: hasError };
      },
      valueGetter: (params) => getValue(params.value),
      func: getValue,

      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'sequence_asset_hierarchy',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('spaceRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      focus: !editMode,
      width: 220,
      editable: false,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'max_occupancy',
      headerName: 'Max Occupancy',
      renderHeader: () => (
        <>
          Max Occupancy
          {editMode ? editValue() : ''}
          {infoValue('spaceoccupancy')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'area_sqft',
      headerName: 'Area Sqft',
      renderHeader: () => (
        <>
          Area Sqft
          {editMode ? editValue() : ''}
          {infoValue('spacearea')}
        </>
      ),
      type: editMode ? 'number' : 'text',
      focus: !editMode,
      width: 160,
      editable: editMode,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    /* {
      field: 'name',
      headerName: 'Short Code',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Short Code
            {infoValue('spaceCode')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      width: 250,
      editable: false,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    }, */
    {
      field: 'block_id',
      headerName: 'Building Name',
      renderHeader: () => (
        <>
          Building Name
          {infoValue('spaceBuilding')}
        </>
      ),
      width: 190,
      editable: false,
      sortable: !editMode,
      //valueGetter: (params) => getValue(params.value),
      valueGetter: (params) => getBuildingName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'floor_id',
      headerName: 'Floor Name',
      renderHeader: () => (
        <>
          Floor Name
          {infoValue('spaceFloor')}
        </>
      ),
      width: 180,
      editable: true,
      sortable: !editMode,
      // valueGetter: (params) => ((params.row && params.row.parent_id
      //   && params.row.parent_id.asset_category_id && params.row.parent_id.asset_category_id.name) === 'Floor' && params.row.parent_id.id ? params.row.parent_id.space_name : ''),
      valueGetter: (params) => getFloorName(params.row),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'parent_id',
      headerName: editMode ? 'Building/Floor/Wing*' : 'Building/Floor/Wing',
      renderHeader: () => (
        <>
          Building/Floor/Wing
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('spaceParentList')}
        </>
      ),
      width: 250,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Building/Floor/Wing is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? floorSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.space_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getRowValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const AssetColumns = (editMode, categorySelection, teamSelection, spaceSelection, setErrorMessage) => (
  [
    {
      field: 'name',
      headerName: editMode ? 'Name*' : 'Name',
      renderHeader: () => (
        <>
          Name
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('assetName')}
        </>
      ),
      focus: !editMode,
      width: 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = (params.props.value).trim() === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Name is required' : '');
        return { ...params.props, error: hasError };
      },

      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'equipment_seq',
      headerName: 'Reference Number',
      renderHeader: () => (
        <div>
          <Typography sx={{ fontSize: '14px' }}>
            Reference Number
            {infoValue('assetRef')}
          </Typography>
          <Typography className="font-11" color="textSecondary">(Auto Generated)</Typography>
        </div>
      ),
      width: 220,
      editable: false,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_id',
      headerName: 'Category',
      renderHeader: () => (
        <>
          Category
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('category_id')}
        </>
      ),
      width: editMode ? 250 : 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Category is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? categorySelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.path_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'maintenance_team_id',
      headerName: 'Maintenance Team',
      renderHeader: () => (
        <>
          Maintenance Team
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('assetteam')}
        </>
      ),
      width: editMode ? 250 : 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Maintenance Team is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? teamSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Space',
      renderHeader: () => (
        <>
          Space
          {editMode
            ? <span className="text-danger">*</span>
            : ''}
          {editMode ? editValue() : ''}
          {infoValue('location_id')}
        </>
      ),
      width: editMode ? 250 : 200,
      editable: editMode,
      sortable: !editMode,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === '' || params.props.value === null;
        setErrorMessage(hasError ? 'Space is required' : '');
        return { ...params.props, error: hasError };
      },
      renderEditCell: (paramsEdit) => (
        editMode
          ? spaceSelection(paramsEdit)
          : paramsEdit.value.id ? paramsEdit.value.path_name
            : paramsEdit.value
      ),
      valueGetter: (params) => (params.value),
      valueFormatter: (params) => getRowValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'floor_id',
      headerName: 'Floor',
      renderHeader: () => (
        <>
          Floor
          {infoValue('floor_id')}
        </>
      ),
      width: 160,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'block_id',
      headerName: 'Building',
      renderHeader: () => (
        <>
          Building
          {infoValue('block_id')}
        </>
      ),
      width: 160,
      sortable: !editMode,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
  ]);

export const MaintenanceAssetColumns = (setMaintenanceType, handleRowAssetClick, showFormModal) => (
  [
    {
      field: 'name',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {infoValue('categoryEquipment')}
        </>
      ),
      width: 250,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'location_id',
      headerName: 'Path Name',
      renderHeader: () => (
        <>
          Path Name
          {infoValue('pathEquipment')}
        </>
      ),
      width: 250,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Inspection',
      renderHeader: () => (
        <>
          Inspection
          {infoValue('inspection')}
        </>
      ),
      actionType: 'both',
      width: 250,
      editable: false,
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <Button>0</Button>
            <Tooltip title="Edit Inspection">
              <Button>
                <Edit style={{ fontSize: '14px' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Add Inspection">
              <Button onClick={() => { setMaintenanceType({ id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily Preventive Maintenance activities' }); handleRowAssetClick(params); showFormModal(true); }}>
                {' '}
                <Add style={{ fontSize: '15px' }} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </>
      ),
    },
    {
      field: 'action1',
      headerName: 'PPM',
      renderHeader: () => (
        <>
          PPM
          {infoValue('preventive')}
        </>
      ),
      actionType: 'both',
      width: 250,
      editable: false,
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <Button>0</Button>
            <Tooltip title="Edit Inspection">
              <Button>
                <Edit style={{ fontSize: '14px' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Add Inspection">
              <Button onClick={() => { setMaintenanceType({ id: 'PPM', name: '52 Week PPM', subName: 'These are planned PPMs with a week long duration' }); handleRowAssetClick(params); showFormModal(true); }}>
                {' '}
                <Add style={{ fontSize: '15px' }} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </>
      ),
    },
  ]);

export const MaintenanceSpaceColumns = (setMaintenanceType, handleRowSpaceClick, showFormModal, isAddEdit) => (
  [
    {
      field: 'space_name',
      headerName: 'Name',
      renderHeader: () => (
        <>
          Name
          {infoValue('categorySpace')}
        </>
      ),
      width: 250,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'path_name',
      headerName: 'Path Name',
      renderHeader: () => (
        <>
          Path Name
          {infoValue('pathSpace')}
        </>
      ),
      width: 250,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'action',
      headerName: 'Inspection',
      renderHeader: () => (
        <>
          Inspection
          {infoValue('inspection')}
        </>
      ),
      actionType: 'both',
      width: 250,
      editable: false,
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <Button>0</Button>
            {isAddEdit && (
              <>
                <Tooltip title="Edit Inspection">
                  <Button>
                    <Edit style={{ fontSize: '14px' }} />
                  </Button>
                </Tooltip>
                <Tooltip title="Add Inspection">
                  <Button onClick={() => { setMaintenanceType({ id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily Preventive Maintenance activities' }); handleRowSpaceClick(params); showFormModal(true); }}>
                    {' '}
                    <Add style={{ fontSize: '15px' }} />
                  </Button>
                </Tooltip>
              </>
            )}
          </ButtonGroup>
        </>
      ),
    },
    {
      field: 'action1',
      headerName: 'PPM',
      renderHeader: () => (
        <>
          PPM
          {infoValue('preventive')}
        </>
      ),
      actionType: 'both',
      width: 250,
      editable: false,
      renderCell: (params) => (
        <>
          <ButtonGroup size="small" aria-label="outlined primary button group">
            <Button>0</Button>
            {isAddEdit && (
              <>
                <Tooltip title="Edit Inspection">
                  <Button>
                    <Edit style={{ fontSize: '14px' }} />
                  </Button>
                </Tooltip>
                <Tooltip title="Add Inspection">
                  <Button onClick={() => { setMaintenanceType({ id: 'PPM', name: '52 Week PPM', subName: 'These are planned PPMs with a week long duration' }); handleRowSpaceClick(params); showFormModal(true); }}>
                    {' '}
                    <Add style={{ fontSize: '15px' }} />
                  </Button>
                </Tooltip>
              </>
            )}
          </ButtonGroup>
        </>
      ),
    },
  ]);

export const BulkInspectionColumns = (onClickRemoveData, onClickEditData, onClickResumeData) => (
  [
    {
      field: 'group_id',
      headerName: 'Group',
      renderHeader: () => (
        <>
          Group
          {infoValue('group_id')}
        </>
      ),
      width: 400,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'category_type',
      headerName: 'Type',
      renderHeader: () => (
        <>
          Type
          {infoValue('asset_type')}
        </>
      ),
      width: 150,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'state',
      headerName: 'Status',
      renderHeader: () => (
        <>
          Status
          {infoValue('stateBulkInspection')}
        </>
      ),
      width: 150,
      renderCell: (val) => <CheckStatus val={val} json={InspectionStatusJson} />,
      valueGetter: (params) => getValue(params.value),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'commences_on',
      headerName: 'Commences On',
      renderHeader: () => (
        <>
          Commences On
          {infoValue('commences_on')}
        </>
      ),
      width: 210,
      dateField: 'date',
      valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
      func: getValue,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains',
      ),
    },
    {
      field: 'bulk_lines',
      headerName: 'No of selected Equipments/Spaces',
      renderHeader: () => (
        <>
          Equipments/Spaces
          {infoValue('bulk_lines')}
        </>
      ),
      width: 200,
      valueGetter: (params) => getValueCount(params.value.length),
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
              {params.row.state === 'Draft' && (
                <Tooltip title="Resume">
                  <Button>
                    <PlayCircleFilledIcon style={{ fontSize: '14px' }} onClick={() => { onClickResumeData(params.id, params.row); }} />
                  </Button>
                </Tooltip>
              )}
              {params.row.state === 'Done' && (
                <Tooltip title="Edit">
                  <Button>
                    <Edit style={{ fontSize: '14px' }} onClick={() => { onClickEditData(params.id, params.row); }} />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Delete">
                <Button onClick={() => { onClickRemoveData(params.id, params.row.group_id.name); }}>
                  {' '}
                  <Delete style={{ fontSize: '15px' }} />
                </Button>
              </Tooltip>
            </>
          </ButtonGroup>
        </>
      ),
    },
  ]);
