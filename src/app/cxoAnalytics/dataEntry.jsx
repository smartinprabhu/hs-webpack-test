/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Col,
  Row,
} from 'reactstrap';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/system';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Autocomplete,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  DataGridPro, useGridApiRef,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import CopyIcon from '@mui/icons-material/CopyAll';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import DialogHeader from '../commonComponents/dialogHeader';

import {
  getSequencedMenuItems, generateErrorMessage, getHeaderTabs, getTabs, getDynamicTabs, getActiveTab,
  isJsonString, getJsonString, getListOfModuleOperations,
  getColumnArrayById, getArrayFormatUpdate16, getArrayFormatCreate16,
} from '../util/appUtils';
import wasteSideNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';
import {
  DetailViewTabsIndicator,
} from '../themes/theme';

import {
  getCxoSections, getCxoSectionsOperationTypes, getCxoOperationTypes,
  updateMultiModelData, createMultiModelData, getAllowedCompaniesCxo, deleteBulkData,
} from '../helpdesk/ticketService';
import TabPanel from '../apexDashboards/assetsDashboard/tabPanel';
import { OccupancyDynamicColumns } from '../commonComponents/gridColumns';
import { resetMultiUpdate } from '../helpdesk/actions';
import actionCodes from './data/actionCodes.json';
import { getAllowedCompaniesInfo } from '../adminSetup/setupService';

const DataEntry = () => {
  const dispatch = useDispatch();

  const subMenu = 'Summary';
  const module = 'CXO Analytics';
  const { userRoles, userInfo } = useSelector((state) => state.user);

  const {
    cxoSections, cxoSectionTypes, cxoOpsInfo,
    updateMultiInfo, createMultiInfo, cxoCompanies,
    deleteBulkInfo,
  } = useSelector((state) => state.ticket);

  const [sectionSelected, setSection] = useState('');

  const [companySelected, setCompany] = useState('');

  const [selectedMonth, setMonth] = useState(new Date());

  const [sectionOpen, setSectionOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [copyData, setCopyData] = useState(false);

  const [copyOpen, setCopyOpen] = useState(false);
  const [fieldType, setFieldType] = useState(false);

  const [value, setValue] = React.useState(0);
  const [isSearch, setSearch] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Add Bulk Entry']);
  const isEditable = allowedOperations.includes(actionCodes['Update Bulk Entry']);
  const isDeletable = allowedOperations.includes(actionCodes['Delete Bulk Entry']);

  const dataLoading = (createMultiInfo && createMultiInfo.loading) || (updateMultiInfo && updateMultiInfo.loading) || (deleteBulkInfo && deleteBulkInfo.loading);

  function getPreviousMonthStartDate() {
    const currentDate = new Date(selectedMonth);
    // Set the date to the first of the current month
    currentDate.setDate(1);
    // Subtract one month
    currentDate.setMonth(currentDate.getMonth() - 1);
    // Now, currentDate is the first day of the previous month
    return currentDate;
  }

  const [selectedCopyMonth, setCopyMonth] = useState(getPreviousMonthStartDate());

  const modelColumns = (model) => {
    let res = false;
    if (model) {
      const datas = cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length ? cxoSectionTypes.data : [];
      const fData = datas.filter((item) => item.code === model);
      if (fData && fData.length) {
        if (fData[0].options && isJsonString(fData[0].options) && getJsonString(fData[0].options).field_mappings) {
          res = OccupancyDynamicColumns(getJsonString(fData[0].options).field_mappings, isEditable);
        }
      }
    }
    return res;
  };

  const modelColumnsList = (model) => {
    let res = [];
    if (model) {
      const datas = cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length ? cxoSectionTypes.data : [];
      const fData = datas.filter((item) => item.code === model);
      if (fData && fData.length) {
        if (fData[0].options && isJsonString(fData[0].options) && getJsonString(fData[0].options).field_mappings) {
          res = getJsonString(fData[0].options).field_mappings;
        }
      }
    }
    return res;
  };

  const isCopyModel = (model) => {
    let res = false;
    if (model) {
      const datas = cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length ? cxoSectionTypes.data : [];
      const fData = datas.filter((item) => item.code === model);
      if (fData && fData.length) {
        if (fData[0].options && isJsonString(fData[0].options) && getJsonString(fData[0].options).isCopyAllowed && getJsonString(fData[0].options).isCopyAllowed === 'yes') {
          res = true;
        }
      }
    }
    return res;
  };

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userCompanyCode = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.code : '';
  // const userCompany = userInfo && userInfo.data && userInfo.data.company ? [userInfo.data.company] : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';
  const userCompaniesList = cxoCompanies && cxoCompanies.data && cxoCompanies.data.length > 0 ? cxoCompanies.data : [];// userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const isParent = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent;

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id && isParent) {
      dispatch(getAllowedCompaniesInfo(false, 'childs', userInfo.data.company.id));
    }
  }, [userInfo]);

  // const companies = getAllCompaniesCxo(userInfo);
  const companies = useMemo(() => (allowedCompanies && allowedCompanies.data ? allowedCompanies.data : []), [allowedCompanies]);

  // const userCompanies = userInfo && userInfo.data && userInfo.data.is_parent ? userCompaniesList.filter((item) => item.id !== userInfo.data.company.id) : userCompaniesList;

  const operationTypes = [{ name: 'Occupancy', code: 'hx.occupancy' }, { name: 'Helpdesk', code: 'hx.helpdesk' }];

  useEffect(() => {
    if (cxoCompanies && cxoCompanies.data && cxoCompanies.data.length > 0 && !isParent) {
      setCompany(cxoCompanies.data[0]);
    }
  }, [userInfo, cxoCompanies]);

  useEffect(() => {
    if (selectedMonth) {
      setCopyMonth(getPreviousMonthStartDate());
      setCopyData(false);
    }
  }, [selectedMonth]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReset = () => {
    if (isParent) {
      setCompany('');
    }
    setMonth(new Date());
    setSection('');
    setSearch('');
    setRows([]);
    setValue(0);
  };

  const getmenus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  let menuItem = '';
  if (getmenus && getmenus.length) {
    menuItem = getmenus.find((menu) => menu.name.toLowerCase() === subMenu.toLowerCase());
  }

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, module);

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/cxo/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'CXO Data',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module,
        moduleName: module,
        menuName: '',
        link: '/cxo-entry',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    if (menuItem && menuItem.uuid && ((allowedCompanies && allowedCompanies.data) || (allowedCompanies && allowedCompanies.err))) {
      // dispatch(getCxoConfig(menuItem.uuid));
      const isParen = userInfo.data.company.is_parent;
      const cids = getColumnArrayById(companies, 'id');
      const codes = getColumnArrayById(companies, 'code');
      const companyids = isParen && companies && companies.length ? JSON.stringify(cids) : `[${userCompanyId}]`;
      const companyCodes = isParen && companies && companies.length ? JSON.stringify(codes) : `["${userCompanyCode}"]`;
      dispatch(getAllowedCompaniesCxo(companyids, menuItem.uuid, companyCodes));
    } else if (!isParent) {
      const companyids = `[${userCompanyId}]`;
      const companyCodes = `["${userCompanyCode}"]`;
      dispatch(getAllowedCompaniesCxo(companyids, menuItem.uuid, companyCodes));
    }
  }, [userRoles, allowedCompanies]);

  useEffect(() => {
    if (companySelected && companySelected.id && menuItem && menuItem.uuid) {
      const domain = `["company_id","=",${companySelected.id}]`;
      dispatch(getCxoSections(domain, menuItem.uuid));
    }
  }, [companySelected]);

  useEffect(() => {
    if (sectionSelected && sectionSelected.operation_type_group_id && sectionSelected.operation_type_group_id && menuItem && menuItem.uuid) {
      dispatch(getCxoSectionsOperationTypes(sectionSelected.operation_type_group_id.operation_type_ids ? getColumnArrayById(sectionSelected.operation_type_group_id.operation_type_ids, 'id') : [], menuItem.uuid));
    }
  }, [sectionSelected]);

  function getSelectedSectionData(ind) {
    let res = false;
    const datas = cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length ? cxoSectionTypes.data : [];
    if (datas && datas.length && datas[ind]) {
      res = datas[ind].code;
    }
    return res;
  }

  useEffect(() => {
    if (cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected.operation_type_group_id && sectionSelected.operation_type_group_id && sectionSelected.operation_type_group_id.operation_type_ids && menuItem && menuItem.uuid) {
      const date = new Date(selectedMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
      fields = fields.concat(['id']);
      dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
    }
  }, [value, cxoSectionTypes, selectedMonth, companySelected, sectionSelected]);

  /* useEffect(() => {
    if (updateMultiInfo && updateMultiInfo.data && cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
      const date = new Date(selectedMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
      fields = fields.concat(['id']);
      dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
    }
  }, [updateMultiInfo]); */

  /* useEffect(() => {
    if (deleteBulkInfo && deleteBulkInfo.data && cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
      const date = new Date(selectedMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
      fields = fields.concat(['id']);
      dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
    }
  }, [deleteBulkInfo]); */

  /* useEffect(() => {
    if (createMultiInfo && createMultiInfo.data && cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
      const date = new Date(selectedMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
      fields = fields.concat(['id']);
      dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
    }
  }, [createMultiInfo]); */

  function getMonthFirstDay() {
    const currentDate = new Date(selectedMonth);
    // Set the date to the first of the current month
    currentDate.setDate(1);
    // Subtract one month
    currentDate.setMonth(currentDate.getMonth() - 1);
    // Now, currentDate is the first day of the previous month
    return currentDate;
  }

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);

  const apiRef = useGridApiRef();

  const unsavedChangesRef = React.useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  useEffect(() => {
    if (cxoOpsInfo && cxoOpsInfo.data) {
      if (!copyData) {
        setRows(cxoOpsInfo.data);
      } else {
        const fieldsList = modelColumnsList(getSelectedSectionData(value)) ? modelColumnsList(getSelectedSectionData(value)) : [];
        if (cxoOpsInfo.data.length > 0) {
          const result = cxoOpsInfo.data.map((item) => fieldsList.reduce((acc, key) => {
            if (!fieldType) {
              if (key.editable && key.editable === true && !key.isNoCopy) {
                if ((key.type === 'date' || key.type === 'datetime') && item[key.field]) {
                // Here, you can modify the value (e.g., set it to the current date)
                  acc[key.field] = new Date(selectedMonth); // or any date manipulation you need
                } else {
                  acc[key.field] = item[key.field];
                }
              }
            } else if (key.editable && key.editable === true) {
              if ((key.type === 'date' || key.type === 'datetime') && item[key.field]) {
                // Here, you can modify the value (e.g., set it to the current date)
                acc[key.field] = new Date(selectedMonth); // or any date manipulation you need
              } else {
                acc[key.field] = item[key.field];
              }
            }
            acc.id = item.id;
            acc._action = 'add';
            acc.site_id = companySelected && companySelected.id ? companySelected.id : false;
            unsavedChangesRef.current.unsavedRows[item.id] = acc;
            return acc;
          }, {}));
          setRows(result);
          setHasUnsavedRows(true);
          setCopyOpen(false);
        }
      }
    } else {
      setRows([]);
    }
  }, [cxoOpsInfo, copyData]);

  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    if (value) {
      setRows([]);
      setMonth(new Date());
      setCopyData(false);
      setIsSaving(false);
      setHasUnsavedRows(false);
      setFieldType(false);
      dispatch(resetMultiUpdate());
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    }
  }, [value]);

  useEffect(() => {
    if (copyOpen) {
      setFieldType(false);
    }
  }, [copyOpen]);

  useEffect(() => {
    console.log(updateMultiInfo);
    if (updateMultiInfo && updateMultiInfo.loading) {
      setIsSaving(true);
    } else if (updateMultiInfo && updateMultiInfo.data) {
      if (cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
        const date = new Date(selectedMonth);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
        fields = fields.concat(['id']);
        dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
      }
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      dispatch(resetMultiUpdate());
    } else if ((updateMultiInfo && updateMultiInfo.err)) {
      setIsSaving(false);
      dispatch(resetMultiUpdate());
      console.log('Update');
    }
  }, [updateMultiInfo]);

  useEffect(() => {
    console.log(deleteBulkInfo);
    if (deleteBulkInfo && deleteBulkInfo.loading) {
      setIsSaving(true);
    } else if (deleteBulkInfo && deleteBulkInfo.data) {
      if (cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
        const date = new Date(selectedMonth);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
        fields = fields.concat(['id']);
        dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
      }
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      dispatch(resetMultiUpdate());
    } else if ((deleteBulkInfo && !deleteBulkInfo.data) || (deleteBulkInfo && deleteBulkInfo.err)) {
      console.log('delete');
      setIsSaving(false);
      dispatch(resetMultiUpdate());
    }
  }, [deleteBulkInfo]);

  useMemo(() => {
    console.log(createMultiInfo);
    if (createMultiInfo && createMultiInfo.loading) {
      setIsSaving(true);
    } else if (createMultiInfo && createMultiInfo.data) {
      if (cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && menuItem && menuItem.uuid) {
        const date = new Date(selectedMonth);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
        fields = fields.concat(['id']);
        dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
      }
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      dispatch(resetMultiUpdate());
      setCopyData(false);
    } else if ((createMultiInfo && createMultiInfo.err)) {
      const dataMissed2 = rows.filter((item) => (item._action && item._action === 'add'));
      if ((unsavedChangesRef && unsavedChangesRef.current && unsavedChangesRef.current.unsavedRows) || (dataMissed2 && dataMissed2.length)) {
        const dataMissed1 = Object.values(
          unsavedChangesRef.current.unsavedRows,
        ).filter((row) => row._action === 'add');

        // const dataMissed3 = [...dataMissed1, ...dataMissed2];
        const dataMissed4 = [...new Map(dataMissed1.map((item) => [item.id, item])).values()];
        const newArr1 = rows.filter((item) => !(item._action && item._action === 'add'));
        const newArr = [...newArr1, ...dataMissed4];
        setRows(newArr);
      } else {
        setHasUnsavedRows(false);
      }
      setIsSaving(false);
      setCopyData(false);
      dispatch(resetMultiUpdate());
    }
  }, [createMultiInfo]);

  const onSectionChange = (data) => {
    setSection(data);
  };

  const onSectionClear = () => {
    setSection('');
    setMonth(new Date());
    setSearch('');
    setRows([]);
    setValue(0);
  };

  const onCopyData = () => {
    if (cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && selectedCopyMonth && companySelected && companySelected.id && sectionSelected.operation_type_group_id && sectionSelected.operation_type_group_id && sectionSelected.operation_type_group_id.operation_type_ids && menuItem && menuItem.uuid) {
      const date = new Date(selectedCopyMonth);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let fields = modelColumns(getSelectedSectionData(value)) ? getColumnArrayById(modelColumns(getSelectedSectionData(value)), 'field') : [];
      fields = fields.concat(['id']);
      dispatch(getCxoOperationTypes(menuItem.uuid, fields, getSelectedSectionData(value), moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'), companySelected.id));
      // setHasUnsavedRows(true);
      // setCopyOpen(false);
      setCopyData(true);
    }
  };

  const onCompanyChange = (data) => {
    setCompany(data);
  };

  const onCompanyClear = () => {
    setCompany('');
    setMonth(new Date());
    setSection('');
    setSearch('');
    setRows([]);
    setValue(0);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const columns = React.useMemo(() => [
    ...modelColumns(getSelectedSectionData(value)) ? modelColumns(getSelectedSectionData(value)) : [],
    {
      headerName: 'Actions',
      field: 'actions',
      type: 'actions',
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          icon={<RestoreIcon />}
          label="Discard changes"
          disabled={unsavedChangesRef.current.unsavedRows[id] === undefined}
          onClick={() => {
            apiRef.current.updateRows([
              unsavedChangesRef.current.rowsBeforeChange[id],
            ]);
            delete unsavedChangesRef.current.rowsBeforeChange[id];
            delete unsavedChangesRef.current.unsavedRows[id];
            setHasUnsavedRows(
              Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
            );
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          disabled={!isDeletable}
          onClick={() => {
            unsavedChangesRef.current.unsavedRows[id] = {
              ...row,
              _action: 'delete',
            };
            if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
              unsavedChangesRef.current.rowsBeforeChange[id] = row;
            }
            setHasUnsavedRows(true);
            apiRef.current.updateRows([row]); // to trigger row render
          }}
        />,
      ],
    },
  ], [value, cxoSectionTypes, cxoOpsInfo]);

  const [loading, setLoading] = React.useState(false);

  const processRowUpdate = (newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    // rows[index] = newRow;
    // setRows(rows);
    return newRow;
  };

  const discardChanges = () => {
    setHasUnsavedRows(false);
    apiRef.current.updateRows(
      Object.values(unsavedChangesRef.current.rowsBeforeChange),
    );
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
    const emptyAdd = rows.filter((item) => !(item._action && (item._action === 'add' || item._action === 'delete')));
    setRows(emptyAdd);
  };

  const saveChanges = async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);

      // setIsSaving(false);
      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');

      const rowsToAdd = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'add');

      const rowsToUpdate = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => !row._action);

      const copyDatasNew = rows.filter((item1) => item1._action === 'add');
      const copyDatas = copyDatasNew.filter((item1) => !rowsToDelete.some((item2) => item2.id === item1.id));

      if (rowsToUpdate && rowsToUpdate.length) {
        await dispatch(updateMultiModelData(getSelectedSectionData(value), getArrayFormatUpdate16(rowsToUpdate), menuItem && menuItem.uuid ? menuItem.uuid : false));
      }

      if (!copyData && rowsToAdd && rowsToAdd.length) {
        await dispatch(createMultiModelData(getSelectedSectionData(value), getArrayFormatCreate16(rowsToAdd), menuItem && menuItem.uuid ? menuItem.uuid : false));
      }

      if (copyData && copyDatas && copyDatas.length) {
        await dispatch(createMultiModelData(getSelectedSectionData(value), getArrayFormatCreate16(copyDatas), menuItem && menuItem.uuid ? menuItem.uuid : false));
      }

      if (rowsToDelete && rowsToDelete.length) {
        /* setIsSaving(false);
        setHasUnsavedRows(false);
        unsavedChangesRef.current = {
          unsavedRows: {},
          rowsBeforeChange: {},
        }; */
        const apiRowstoDelete = rowsToDelete.filter((item1) => !item1.site_id);
        if (apiRowstoDelete && apiRowstoDelete.length) {
          await dispatch(deleteBulkData(getSelectedSectionData(value), getColumnArrayById(apiRowstoDelete, 'id'), menuItem && menuItem.uuid ? menuItem.uuid : false));
        } else {
          setIsSaving(false);
          setHasUnsavedRows(false);
          unsavedChangesRef.current = {
            unsavedRows: {},
            rowsBeforeChange: {},
          };
        }
      }

      const filteredArray = rows.filter((item1) => !rowsToDelete.some((item2) => item2.id === item1.id));
      setRows(filteredArray);
    } catch (error) {
      setIsSaving(false);
    }
  };

  const handleTypeChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      setFieldType(true);
    } else {
      setFieldType(false);
    }
  };

  const handleClick = () => {
    const id = rows && rows.length ? `id${rows.length + 1}` : 1;
    /* unsavedChangesRef.current = {
      unsavedRows: [{
        id, date: '', cam_area: '', occupancy_in: '', _action: 'add',
      }],
      rowsBeforeChange: rows,
    }; */
    const fieldsList = modelColumns(getSelectedSectionData(value)) ? modelColumns(getSelectedSectionData(value)) : [];
    if (fieldsList && fieldsList.length) {
      const newObj = {};
      fieldsList.forEach((item) => {
        if (item.type === 'date' || item.type === 'datetime') {
          newObj[item.field] = new Date(selectedMonth);
        } else {
          newObj[item.field] = '';
        }
      });
      newObj.id = id;
      newObj.site_id = companySelected && companySelected.id ? companySelected.id : false;
      newObj._action = 'add';
      const dataAdded1 = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'add');
      unsavedChangesRef.current.unsavedRows[id] = newObj;
      // const dataAdded2 = rows.filter((item) => (item._action && item._action === 'add'));
      // const dataAdded3 = [...dataAdded2, ...dataAdded1];
      const dataAdded = [...new Map(dataAdded1.map((item) => [item.id, item])).values()];
      const emptyAdd = rows.filter((item) => !(item._action && item._action === 'add'));
      const newArr1 = [...dataAdded, ...emptyAdd];
      const newArr = [...newArr1, ...[newObj]];
      setRows(newArr);
      // setRows((prevRows) => [...prevRows, newObj]);
      setHasUnsavedRows(true);
    }
  };

  const isCopy = isCopyModel(getSelectedSectionData(value));

  return (
    <Box className="insights-box">
      <Row className="mt-4 p-3" style={{ alignItems: 'center' }}>

        <Col md="3" sm="12" lg="3" xs="12" className="text-center mb-3">
          <Autocomplete
            id="tags-outlined"
            size="small"
            name="template"
            open={companyOpen}
            onOpen={() => {
              setCompanyOpen(true);
            }}
            onClose={() => {
              setCompanyOpen(false);
            }}
            value={companySelected}
            disableClearable
            disabled={!isParent}
            onChange={(e, options) => onCompanyChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={userCompaniesList}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company"
                variant="standard"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {cxoCompanies && cxoCompanies.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {isParent && companySelected && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onCompanyClear}
                      >
                        <IoCloseOutline />
                      </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Col>
        {companySelected && companySelected.id && (
        <>
          <Col md="3" sm="12" lg="3" xs="12" className="text-center mb-3">
            <Autocomplete
              id="tags-outlined"
              size="small"
              name="template"
              open={sectionOpen}
              onOpen={() => {
                setSectionOpen(true);
              }}
              onClose={() => {
                setSectionOpen(false);
              }}
              value={sectionSelected}
              disableClearable
              onChange={(e, options) => onSectionChange(options)}
              getOptionDisabled={() => cxoSections.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={cxoSections && cxoSections.data ? cxoSections.data : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Section"
                  variant="standard"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cxoSections && cxoSections.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {sectionSelected && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSectionClear}
                          >
                            <IoCloseOutline />
                          </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          {sectionSelected && sectionSelected.id && (
          <Col md="3" sm="12" lg="3" xs="12" className="mb-4">
            <FormControl
              variant="outlined"
              className="w-100"
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  name="month"
                  label="Month"
                  variant="outlined"
                  views={['month', 'year']}
                  value={selectedMonth}
                  onChange={(newValue) => setMonth(newValue)}
                        // defaultValue={selectedMonth ? new Date(getDateTimeSeconds(selectedMonth)) : ''}
                  placeholder="Choose Month"
                  format="MMM-yy"
                  disablePastDate
                  disableFuture
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Col>
          )}
        </>
        )}
        {selectedMonth && companySelected && companySelected.id && sectionSelected && sectionSelected.id && (
        <Col md="3" sm="12" lg="3" xs="12" className="mb-0">
          <Button
            className="reset-btn"
            variant="contained"
            onClick={() => handleReset()}
          >

            Reset
          </Button>
          { /* <Button
            className="normal-btn"
            variant="contained"
            onClick={() => setSearch(Math.random())}
          >

            Search
        </Button> */ }
        </Col>
        )}
      </Row>
      {selectedMonth && cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && companySelected && companySelected.id && sectionSelected && sectionSelected.id && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textcolor="secondary"
              TabIndicatorProps={{
                sx: DetailViewTabsIndicator({
                  height: '5px',
                }),
              }}
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {cxoSectionTypes && cxoSectionTypes.data && cxoSectionTypes.data.length > 0 && cxoSectionTypes.data.map((op, index) => (
                <Tab
                  className="cxo-tab"
                  label={op.name}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
          <TabPanel dataValue={value} index={value}>
            <div style={{ marginBottom: 8 }}>
              {isCreatable && !copyData && (
              <Button
                disabled={isSaving || dataLoading}
                onClick={handleClick}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
              )}
              <Button
                disabled={dataLoading || isSaving || !hasUnsavedRows}
                onClick={saveChanges}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                disabled={dataLoading || isSaving || !hasUnsavedRows}
                onClick={discardChanges}
                startIcon={<RestoreIcon />}
              >
                Discard all changes
              </Button>
              {isCreatable && isCopy && (!(cxoOpsInfo && cxoOpsInfo.data && cxoOpsInfo.data.length > 0) || !(rows && rows.length > 0)) && (
              <Button
                disabled={isSaving}
                onClick={() => setCopyOpen(true)}
                startIcon={<CopyIcon />}
              >
                Copy Data
              </Button>
              )}
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <DataGridPro
                rows={rows}
                columns={columns}
                rowHeight={45}
                apiRef={apiRef}
                loading={loading || isSaving || (cxoOpsInfo && cxoOpsInfo.loading) || (createMultiInfo && createMultiInfo.loading) || (updateMultiInfo && updateMultiInfo.loading) || (deleteBulkInfo && deleteBulkInfo.loading)}
                unstable_cellSelection
                processRowUpdate={processRowUpdate}
                disableRowSelectionOnClick
                onClipboardPasteStart={() => setLoading(true)}
                onClipboardPasteEnd={() => setLoading(false)}
                experimentalFeatures={{ clipboardPaste: true }}
                unstable_ignoreValueFormatterDuringExport
                sx={{
                  '& .MuiDataGrid-row.row--removed': {
                    backgroundColor: (theme) => {
                      if (theme.palette.mode === 'light') {
                        return 'rgba(255, 170, 170, 0.3)';
                      }
                      return darken('rgba(255, 170, 170, 1)', 0.7);
                    },
                  },
                  '& .MuiDataGrid-row.row--edited': {
                    backgroundColor: (theme) => {
                      if (theme.palette.mode === 'light') {
                        return 'rgba(255, 254, 176, 0.3)';
                      }
                      return darken('rgba(255, 254, 176, 1)', 0.6);
                    },
                  },
                }}
                getRowClassName={({ id }) => {
                  const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
                  if (unsavedRow) {
                    if (unsavedRow._action === 'delete') {
                      return 'row--removed';
                    }
                    return 'row--edited';
                  }
                  return '';
                }}
              />
            </div>
          </TabPanel>
        </>
      )}
      {(cxoSectionTypes && cxoSectionTypes.loading) && (
      <div className="mt-4 text-center" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {(cxoSectionTypes && cxoSectionTypes.err) && (
        <div>
          <ErrorContent errorTxt={generateErrorMessage(cxoSectionTypes)} />
        </div>
      )}
      <Dialog maxWidth="md" open={copyOpen}>
        <DialogHeader title="Copy Data" onClose={() => setCopyOpen(false)} response={false} imagePath={false} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <Row>
                <Col md="12" sm="12" lg="12" xs="12" className="mb-4">
                  <FormControl
                    variant="outlined"
                    className="w-100"
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        name="month"
                        label="Month"
                        variant="outlined"
                        views={['month', 'year']}
                        value={selectedCopyMonth}
                        maxDate={getMonthFirstDay()}
                        onChange={(newValue) => setCopyMonth(newValue)}
                        // defaultValue={selectedMonth ? new Date(getDateTimeSeconds(selectedMonth)) : ''}
                        placeholder="Choose Month"
                        format="MMM-yy"
                        disablePastDate
                        disableFuture
                        shouldDisableDate={(date) => date.getDate() === getMonthFirstDay().getDate() && date.getMonth() === getMonthFirstDay().getMonth()}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Col>
                <Col md="12" sm="12" lg="12" xs="12" className="mb-2 mt-3">
                  <p className="font-tiny font-family-tab">Select the option below to copy with all the values from the selected month</p>
                  <FormControl>
                    <FormGroup className="pl-2" aria-label="position" row>
                      <FormControlLabel
                        className="font-tiny font-family-tab"
                        control={(
                          <Checkbox
                            checked={fieldType}
                            size="small"
                            className="p-0"
                            onChange={handleTypeChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
              )}
                        label="Copy all data"
                      />
                    </FormGroup>
                  </FormControl>
                </Col>
                {copyData && cxoOpsInfo && !cxoOpsInfo.loading && (!(cxoOpsInfo && cxoOpsInfo.data && cxoOpsInfo.data.length > 0) || (cxoOpsInfo && cxoOpsInfo.err)) && (
                <Col md="12" sm="12" lg="12" xs="12" className="mb-2">
                  <p className="font-family-tab text-danger">
                    Selected Month (
                    {moment(selectedCopyMonth).format('MMM-yy')}
                    ) does not contain any data. You may select another month to copy data.
                  </p>
                </Col>
                )}
              </Row>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={cxoOpsInfo && cxoOpsInfo.loading}
            onClick={() => onCopyData()}
          >
            {cxoOpsInfo && cxoOpsInfo.loading ? 'Copying' : 'Copy'}

          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default DataEntry;
