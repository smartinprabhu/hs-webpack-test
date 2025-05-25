/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { /*  Drawer, */ Tooltip } from 'antd';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  Modal,
  ModalBody,
} from 'reactstrap';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import DrawerHeader from '@shared/drawerHeader'; */
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import TrackerCheck from '@images/sideNavImages/auditSystem_black.svg';
import DrawerHeader from '../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../themes/theme';

// import TrackerCheck from '@images/icons/complianceCheck.svg';
import CommonGrid from '../commonComponents/commonGrid';
import { SlaAuditColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';

import {
  setInitialValues,
} from '../purchase/purchaseService';

import {
  getActiveTab,
  getAllCompanies,
  getArrayFromValuesByItem, getColumnArrayById,
  getComputedValidAnswer,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations, getPagesCountV2,
  getTabs,
  queryGeneratorWithUtc, truncate,
  getNextPreview, formatFilterData, debounce,
} from '../util/appUtils';
import AddAudit from './addAudit';
import AuditDetail from './auditDetail/auditDetail';
import {
  getSLAConfig,
  getSlaAuditCount, getSlaAuditDetail,
  getSlaAuditExport,
  getSlaAuditFilters, getSlaAuditList, resetAddSlaAuditInfo,
  updateSlaAudit,
} from './auditService';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import auditNav from './navbar/navlist.json';
import { getSlaStatusText } from './utils/utils';
import { setSorting } from '../assets/equipmentService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Audits = () => {
  const limit = 10;
  const subMenu = 'SLA Audits';
  const tableColumns = SlaAuditColumns();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);

  const [statusGroups, setStatusGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const [savedRecords, setSavedRecords] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [questionGroups, setQuestionGroups] = useState([]);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const apiFields = customData && customData.complianceListFields;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    slaAuditCount, slaAuditInfo, slaAuditCountLoading,
    slaAuditFilters, slaAuditDetails, addSlaAuditInfo,
    updateSlaAuditInfo, slaAuditExportInfo, slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const listHead = 'SLA Audits List :';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'SLA-KPI Audit', 'code');

  const isCreatable = true;// allowedOperations.includes(actionCodes['Add Breakdown Tracker']);
  const isEditable = false;// allowedOperations.includes(actionCodes['Edit Breakdown Tracker']);
  // const isDeleteable = allowedOperations.includes(actionCodes['Delete Breakdown Tracker']);

  const searchColumns = ['name', 'audit_for', 'audit_template_id', 'state'];
  const advanceSearchColumns = ['state'];

  const hasTarget = !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].has_target);

  const isMultipleEvaluation = hasTarget && !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_multiple_evaluation);

  const hiddenColumns = ['id', 'created_by_id', 'created_on', 'reviewed_by_id', 'reviewed_on', 'approved_by_id', 'approved_on'];

  const onClickClear = () => {
    dispatch(getSlaAuditFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (slaAuditInfo && slaAuditInfo.data && slaAuditInfo.data.length > 0 ? slaAuditInfo.data : [{}]), [slaAuditInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'audit_date' }));
  }, []);

  useEffect(() => {
    if (slaAuditInfo && slaAuditInfo.loading) {
      setOpenStatus(false);
    }
  }, [slaAuditInfo]);

  useEffect(() => {
    if (slaAuditExportInfo && slaAuditExportInfo.data && slaAuditExportInfo.data.length > 0) {
      slaAuditExportInfo.data.map((data) => {
        data.state = getSlaStatusText(data.state, data.is_second_level_approval, data.second_approved_by);
        data.is_second_level_approval = data.is_second_level_approval ? 'Yes' : 'No';
      });
    }
  }, [slaAuditExportInfo]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
    }
  }, [openStatus]);

  useEffect(() => {
    if (slaAuditFilters && slaAuditFilters.customFilters) {
      setCustomFilters(slaAuditFilters.customFilters);
    }
  }, [slaAuditFilters]);

  useEffect(() => {
    if (addSlaAuditInfo && addSlaAuditInfo.data) {
      const customFiltersList = slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
      dispatch(getSlaAuditCount(companies, appModels.SLAAUDIT, customFiltersList, globalFilter));
      dispatch(getSlaAuditList(companies, appModels.SLAAUDIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField === 'create_date' ? 'audit_date' : sortedValue.sortField, globalFilter));
    }
  }, [addSlaAuditInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getSlaAuditFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
      dispatch(getSlaAuditCount(companies, appModels.SLAAUDIT, customFiltersList, globalFilter));
    }
  }, [userInfo, slaAuditFilters.customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getSlaAuditList(companies, appModels.SLAAUDIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField === 'create_date' ? 'audit_date' : sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, slaAuditFilters.customFilters]);

  useEffect(() => {
    if (viewId && userInfo && userInfo.data) {
      const datas = slaAuditInfo && slaAuditInfo.data ? slaAuditInfo.data : [];
      const datasFind = datas.filter((item) => item.id === viewId);
      dispatch(getSlaAuditDetail(viewId, appModels.SLAAUDIT, datasFind && datasFind.length && (datasFind[0].state === 'Submitted' || datasFind[0].state === 'Reviewed' || datasFind[0].state === 'Approved') ? 'no' : ''));
      // dispatch(getSLAConfig(userInfo.data.company.id, appModels.SLAAUDITCONFIG));
    }
  }, [viewId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getSLAConfig(userInfo.data.company.id, appModels.SLAAUDITCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (addSlaAuditInfo && addSlaAuditInfo.data && addSlaAuditInfo.data.length && !viewId) {
      dispatch(getSlaAuditDetail(addSlaAuditInfo.data[0], appModels.SLAAUDIT));
    }
  }, [addSlaAuditInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (slaAuditCount && slaAuditCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = slaAuditFilters && slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
      dispatch(getSlaAuditExport(companies, appModels.SLAAUDIT, slaAuditCount.length, offsetValue, apiFields, customFiltersQuery, checkedRows, sortedValue.sortBy, sortedValue.sortField === 'create_date' ? 'audit_date' : sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        audit_for: true,
        name: true,
        audit_template_id: true,
        company_id: true,
        state: true,
        created_by_id: true,
        created_on: false,
        reviewed_by_id: false,
        reviewed_on: false,
        approved_by_id: false,
        approved_on: false,
        region_id: true,
        state_name: false,
        second_approved_by: false,
        is_second_level_approval: false,
        second_approved_on: false,
      });
    }
  }, [visibleColumns]);

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  const totalDataCount = slaAuditCount && slaAuditCount.length && columnFields.length ? slaAuditCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const datas = slaAuditInfo && slaAuditInfo.data ? slaAuditInfo.data : [];
      const newArr = [...getColumnArrayById(datas, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const datas = slaAuditInfo && slaAuditInfo.data ? slaAuditInfo.data : [];
      const ids = getColumnArrayById(datas, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...slaAuditFilters.customFilters, ...filters];

      dispatch(getSlaAuditFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = slaAuditFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getSlaAuditFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  // const handleRadioboxChange = (event) => {
  //   const { checked, value } = event.target;
  //   const filters = [{
  //     key: value, value, label: value, type: 'date',
  //   }];
  //   if (checked) {
  //     const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters ? slaAuditFilters.customFilters : [];
  //     const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
  //     dispatch(getSlaAuditFilters(customFilters1));
  //   }
  //   setOffset(0);
  //   setPage(0);
  // };

  // const handleCustomDateChange = (startDate, endDate) => {
  //   const value = 'Custom';
  //   let start = '';
  //   let end = '';
  //   let filters = [];
  //   const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, startDate, endDate);

  //   if (startDate && endDate) {
  //     start = getDateRangeObj[0];
  //     end = getDateRangeObj[1];
  //   }
  //   if (startDate && endDate) {
  //     filters = [{
  //       key: value, value, label: value, type: 'customdate', start, end,
  //     }];
  //   }
  //   if (start && end) {
  //     const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters ? slaAuditFilters.customFilters : [];
  //     const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
  //     setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
  //     dispatch(getSlaAuditFilters(customFilters1));
  //   }
  //   setOffset(0);
  //   setPage(0);
  // };

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        header: 'Date Filter',
        id: value,
      },
    ];
    const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters
      ? slaAuditFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getSlaAuditFilters(customFilters1));
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
          header: 'Date Filter',
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters
        ? slaAuditFilters.customFilters
        : [];
      const filterValues = {
        states:
          slaAuditFilters && slaAuditFilters.states ? slaAuditFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getSlaAuditFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters
        ? slaAuditFilters.customFilters
        : [];
      const filterValues = {
        states:
          slaAuditFilters && slaAuditFilters.states ? slaAuditFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getSlaAuditFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    const customFiltersList = slaAuditFilters.customFilters.filter((item) => item.value !== cfValue);
    dispatch(getSlaAuditFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  function getPendingQtns() {
    let res = false;
    const datass = savedRecords.filter((item) => item.is_update === 'start');
    if (datass && datass.length) {
      res = true;
    }
    return res;
  }

  function getPendingFullQtns() {
    let res = false;
    if (savedRecords && savedRecords.length) {
      res = true;
    }
    return res;
  }

  const stages = useMemo(() => (isMultipleEvaluation && slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0) && slaAuditDetails.data[0].stage_ids && slaAuditDetails.data[0].stage_ids.length ? slaAuditDetails.data[0].stage_ids : []), [slaAuditDetails, slaAuditConfig]);

  const getCurrentStageData = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const seqData = [...stages].sort((a, b) => a.sequence - b.sequence); // avoid mutating original
    const pendingStage = seqData.find((item) => item.state === 'Pending');

    if (!pendingStage) {
      return false;
    }

    return pendingStage;
  };

  const extractFilledAnswers = (questionGroupss, currentStages) => {
    if (!questionGroupss || !questionGroupss.length || !currentStages?.evaluators_ids) return [];

    const allowedIds = currentStages.evaluators_ids.map((e) => e.id);

    return questionGroupss.flatMap((item) => item.evaluations_ids.map((ev) => ({
      id: item.id,
      achieved_score: item.achieved_score,
      answer: item.answer,
      evaluations_id: ev.id,
      evId: ev.evaluator_id.id,
      measured_value: ev.measured_value,
    }))).filter((item) => allowedIds.includes(item.evId));
  };

  function saveRecordbyTime() {
    let newData = [];
    if (isMultipleEvaluation) {
      const trackerLines = [];
      const detailData = slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0) ? slaAuditDetails.data[0] : '';

      const filledChecklist = questionGroups?.length ? questionGroups : [];
      const filledAnsChecklistNew = extractFilledAnswers(filledChecklist, getCurrentStageData());

      if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
        for (let i = 0; i < filledAnsChecklistNew.length; i += 1) {
          newData = [1, filledAnsChecklistNew[i].evaluations_id, { audit_line: { id: filledAnsChecklistNew[i].id, answer: filledAnsChecklistNew[i].answer ? filledAnsChecklistNew[i].answer.toString() : '', achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score) }, measured_value: filledAnsChecklistNew[i].measured_value ? parseFloat(filledAnsChecklistNew[i].measured_value) : 0.00 }];
          trackerLines.push(newData);
        }
        const payloadValues = {
          lines: trackerLines,
        };
        dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line_evaluations', payloadValues, 'checklist'));
      }
    } else {
      const trackerLines = [];
      const detailData = slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0) ? slaAuditDetails.data[0] : '';
      const filledChecklist = detailData && detailData.sla_audit_lines && detailData.sla_audit_lines.length > 0 ? detailData.sla_audit_lines : [];

      const filledAnsChecklist = filledChecklist.filter((item) => item.answer || item.measured_value);

      const filledAnsChecklistNew = filledAnsChecklist.map((cl) => ({
        id: cl.id,
        achieved_score: cl.achieved_score,
        answer: cl.answer ? cl.answer.toString() : '',
        target: cl.target ? parseFloat(cl.target) : 0.00,
        measuredValue: cl.measuredValue ? parseFloat(cl.measuredValue) : 0.00,
        evId: cl.evId ? cl.evId : false,
        ans_type: cl.ans_type,
      }));

      if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
        for (let i = 0; i < filledAnsChecklistNew.length; i += 1) {
          if (filledAnsChecklistNew[i].ans_type === 'evaluation') {
            newData = [1, filledAnsChecklistNew[i].evId, { audit_line: { id: filledAnsChecklistNew[i].id, answer: filledAnsChecklistNew[i].answer, achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score) }, measured_value: filledAnsChecklistNew[i].measuredValue ? parseFloat(filledAnsChecklistNew[i].measuredValue) : 0.00 }];
          } else {
            newData = [1, filledAnsChecklistNew[i].id, { answer: filledAnsChecklistNew[i].answer, achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score), target: filledAnsChecklistNew[i].target }];
          }
          trackerLines.push(newData);
        }
        const payloadValues = {
          lines: trackerLines,
        };
        dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line', payloadValues, 'checklist'));
      }
    }
  }

  const onViewReset = () => {
    if (getPendingFullQtns() && !isLoad) {
      setIsLoad(true);
      saveRecordbyTime();
      if (getPendingQtns()) {
        setIsLoad(true);
        alert('There are unsaved changes..If you leave before saving, your changes will be lost. Wait for the changes to be updated.');
      } else {
        setViewId(false);
        setIsLoad(false);
        setViewModal(false);
      }
    } else {
      setViewId(false);
      setIsLoad(false);
      setViewModal(false);
    }
    if (document.getElementById('slaAuditSystemform')) {
      document.getElementById('slaAuditSystemform').reset();
    }
    dispatch(resetAddSlaAuditInfo());
    showAddModal(false);
  };

  const addTrackerWindow = () => {
    if (document.getElementById('slaAuditSystemform')) {
      document.getElementById('slaAuditSystemform').reset();
    }
    dispatch(resetAddSlaAuditInfo());
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('slaAuditSystemform')) {
      document.getElementById('slaAuditSystemform').reset();
    }
    showEditModal(false);
  };

  const onAddReset = () => {
    if (document.getElementById('slaAuditSystemform')) {
      document.getElementById('slaAuditSystemform').reset();
    }
    dispatch(resetAddSlaAuditInfo());
    showAddModal(false);
  };

  const onRemoveData = (id) => {
    // dispatch(getDelete(id, appModels.BREAKDOWNTRACKER));
  };

  const onRemoveDataCancel = () => {
    // dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const stateValuesList = (slaAuditFilters && slaAuditFilters.customFilters && slaAuditFilters.customFilters.length > 0)
    ? slaAuditFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (slaAuditFilters && slaAuditFilters.customFilters && slaAuditFilters.customFilters.length > 0) ? slaAuditFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (slaAuditInfo && slaAuditInfo.loading) || (slaAuditCountLoading);
  const trackerData = slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0) ? slaAuditDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={trackerData.name} placement="right">
      {truncate(trackerData.name, '50')}
    </Tooltip>
  );

  /* const onChangeFilter = (columnValue, text) => {
    columnValue.value = columnValue.value === undefined ? '' : columnValue.value;
    let array = value;
    const filterArray = [];
    if (columnValue.value) {
      array.push(columnValue);
      array = uniqBy(array, 'Header');
      const arrays = (array || []);
      arrays.map((key) => {
        const filters = {
          key: key.id, title: key.Header, value: key.value, label: key.Header, type: text, arrayLabel: key.label,
        };
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(0);
      const customFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = [...new Map(customFiltersList.map((m) => [m.key, m])).values()];
      dispatch(getTrackerFilters(uniquecustomFilter));
      setValueArray(array);
      removeData(`data-${columnValue.id}`, columnValue);
    }
  }; */

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? key.key : key.id,
          title: key.title ? key.title : key.Header,
          value: encodeURIComponent(key.value),
          label: key.label ? key.label : key.Header,
          type: key.type ? key.type : text,
          arrayLabel: key.label,
        };
        if (key.start && key.end) {
          filters.start = key.start;
          filters.end = key.end;
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(0);
      const customFiltersList = [];
      const mergeFiltersList = [...slaAuditFilters.customFilters, ...filterArray];
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getSlaAuditFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    state: setOpenStatus,
  };

  function numToFloat(num) {
    let result = 0;
    if (num) {
      result = num;
    }
    return parseFloat(result).toFixed(2);
  }

  function getFailedQtns() {
    let res = false;
    const datas = savedRecords.filter((item) => item.is_update === 'failed');
    if (datas && datas.length) {
      res = true;
    }
    return res;
  }

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'SLA-KPI Audit',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, auditNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Audits',
    );
  }

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(slaAuditInfo && slaAuditInfo.data && slaAuditInfo.data.length && slaAuditInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(slaAuditInfo && slaAuditInfo.data && slaAuditInfo.data.length && slaAuditInfo.data[slaAuditInfo.data.length - 1].id);
    }
  }, [slaAuditInfo]);

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'audit_for',
      'name',
      'audit_template_id',
      'company_id',
      'state',
      'created_by_id',
      'reviewed_by_id',
      'approved_by_id',
      'region_id',
      'state_name',
      'second_approved_by',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = slaAuditFilters && slaAuditFilters.customFilters
      ? slaAuditFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.filter((field) => {
        query += `["${field}","ilike","${data.quickFilterValues[0]}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getSlaAuditFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getSlaAuditFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1 ? data.quickFilterValues[0] : false));
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [slaAuditFilters],
  );

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'SLA Audits',
        moduleName: 'SLA-KPI Audit',
        menuName: 'SLA Audits',
        link: '/sla-audit-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      {/* <Header
        headerPath="SLA Audits"
        nextPath="SLA Audits"
        pathLink="/sla-audit-overview"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          slaAuditInfo && slaAuditInfo.data && slaAuditInfo.data.length
            ? slaAuditInfo.data
            : []
        }
        columns={SlaAuditColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="SLA Audits List"
        exportFileName="SLA Audits"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={slaAuditExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        dateField="audit_date"
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        filters={filterText}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={slaAuditInfo && slaAuditInfo.loading}
        err={slaAuditInfo && slaAuditInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'id' && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '90%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0 && !slaAuditDetails.loading)
            ? drawertitleName : 'SLA Audit'}
          imagePath={TrackerCheck}
          isEditable={isEditable}
          onClose={() => onViewReset()}
          loadingText={updateSlaAuditInfo && updateSlaAuditInfo.loading ? 'Saving..' : ''}
          isButtonDisabled={(updateSlaAuditInfo && updateSlaAuditInfo.loading) || getFailedQtns()}
          onEdit={() => {
            setEditId(slaAuditDetails && (slaAuditDetails.data && slaAuditDetails.data.length > 0) ? slaAuditDetails.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', slaAuditInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', slaAuditInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', slaAuditInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', slaAuditInfo));
          }}
        />
        <AuditDetail
          offset={offset}
          isShow={viewModal}
          setQuestionGroupsGlobal={setQuestionGroups}
          questionGroupsGlobal={questionGroups}
          setSavedQuestions={setSavedRecords}
          savedRecords={savedRecords}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create SLA Audit"
          imagePath={TrackerCheck}
          onClose={onViewReset}
        />
        <AddAudit
          editId={false}
          closeModal={() => { onAddReset(); }}
          afterReset={() => { onAddReset(); }}
          isShow={addModal}
          addModal
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >

        <DrawerHeader
          headerName="Update Breakdown Tracker"
          imagePath={TrackerCheck}
          onClose={closeEditModalWindow}
        />
        { /* <AddTracker editId={editId} closeModal={closeEditModalWindow} /> */}
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Tracker"
          imagePath={false}
          closeModalWindow={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <ModalBody className="mt-0 pt-0">
          {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ? `}
            </p>
          )}
          {deleteInfo && deleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(deleteInfo && deleteInfo.err) && (
            <SuccessAndErrorFormat response={deleteInfo} />
          )}
          {(deleteInfo && deleteInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteInfo}
              successMessage="Tracker removed successfully.."
            />
          )}
          <div className="pull-right mt-3">
            {deleteInfo && !deleteInfo.data && (
              <Button
                size="sm"
                disabled={deleteInfo && deleteInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
            )}
            {deleteInfo && deleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export default Audits;
