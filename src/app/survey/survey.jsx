/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Badge,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SurveyIcon from '@images/sideNavImages/survey_black.svg';
import { Box } from '@mui/system';
import Drawer from '@mui/material/Drawer';
import { AddThemeBackgroundColor } from '../themes/theme';

import DrawerHeader from '../commonComponents/drawerHeader';
import AnswerDetails from './surveyDetail/answerDetails';
import AnswersReport from './surveyDetail/answersReport';

import { getDelete, resetDelete } from '../pantryManagement/pantryService';
import { setInitialValues } from '../purchase/purchaseService';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getDynamicTabs,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  isArrayValueExists,
  getNextPreview,
  queryGeneratorWithUtc,
  truncate,
  formatFilterData, debounce,
} from '../util/appUtils';
import AddSurvey from './addSurvey';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import SurveyDetail from './surveyDetail/surveyDetail';
import {
  getDeleteAnswers,
  getStatus,
  getStatusGroups,
  getSurveyCount,
  getSurveyDetail,
  getSurveyFilters,
  getSurveyList,
  getSurveyListExport,
  resetAddSurvey,
  resetDeleteAnswers,
  resetPageData,
  resetStorePages,
  resetStoreQuestions,
  resetUpdateSurvey,
  setPageData,
} from './surveyService';
import { getTypeLabel } from './utils/utils';

import surveyNav from './navbar/navlist.json';

import CommonGrid from '../commonComponents/commonGrid';
import { SurveyColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Survey = () => {
  const limit = 10;
  const subMenu = 'Surveys';
  const classes = useStyles();
  const dispatch = useDispatch();
  const tableColumns = SurveyColumns();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(
    customData && customData.listfieldsSVShows
      ? customData.listfieldsSVShows
      : [],
  );
  const [customFilters, setCustomFilters] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addVisitRequestModal, showAddVisitRequestModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(false);
  const [removeIds, setRemoveIds] = useState([]);
  const { pinEnableData } = useSelector((state) => state.auth);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [addLink, setAddLink] = useState(false);
  const [pdfBody, setPdfBody] = useState([]);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [typeGroups, setTypeGroups] = useState([]);
  const [viewAnswers, setViewAnswers] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [answerModal, setAnswerModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);

  const [openSurveyStatus, setOpenSurveyStatus] = useState(false);
  const [openSurveyType, setOpenSurveyType] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const apiFields = customData && customData.listFields ? customData.listFields : [];
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const [filterText, setFilterText] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);
  const {
    surveyCount,
    surveyListInfo,
    surveyCountLoading,
    deleteAnsweresInfo,
    surveyExport,
    surveyFilters,
    surveyDetails,
    addSurveyInfo,
    statusGroupInfo,
    surveyUpdateInfo,
    surveyRows,
  } = useSelector((state) => state.survey);
  const { sortedValue } = useSelector((state) => state.equipment);

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Survey',
    'code',
  );

  const isCreatable = allowedOperations.includes(actionCodes['Add Survey']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Survey']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Survey']);

  const advanceSearchjson = {
    stage_id: setOpenSurveyStatus,
    category_type: setOpenSurveyType,
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        title: true,
        stage_id: true,
        user_input_ids: false,
        uuid: true,
        category_type: false,
        tot_sent_survey: false,
        tot_start_survey: false,
        tot_comp_survey: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (openSurveyStatus || openSurveyType) {
      setKeyword('');
    }
  }, [openSurveyStatus, openSurveyType]);

  useEffect(() => {
    if (userInfo && userInfo.data && openSurveyStatus) {
      dispatch(getStatusGroups(companies, appModels.SURVEY));
    }
  }, [userInfo, openSurveyStatus]);

  const toggleAlert = () => {
    setModalAlert(false);
  };

  const { deleteInfo } = useSelector((state) => state.pantry);

  const history = useHistory();

  useEffect(() => {
    if (surveyExport && surveyExport.data && surveyExport.data.length > 0) {
      surveyExport.data.map((data) => {
        data.category_type = data.category_type ? getTypeLabel(data.category_type) : '-';
        data.title = data.title ? data.title : '-';
        data.uuid = data.uuid ? `${WEBAPPAPIURL}${'survey'}/${data.uuid}` : '-';
        data.stage_id = data.stage_id && data.stage_id.length ? data.stage_id[1] : '-';
        data.user_input_ids = data.user_input_ids && data.user_input_ids.length > 0 ? data.user_input_ids.length : '0';
        data.tot_sent_survey = data.tot_sent_survey ? data.tot_sent_survey : '0';
        data.tot_start_survey = data.tot_start_survey ? data.tot_start_survey : '0';
        data.tot_comp_survey = data.tot_comp_survey ? data.tot_comp_survey : '0';
      });
    }
  }, [surveyExport]);

  useEffect(() => {
    if (surveyFilters && surveyFilters.customFilters) {
      setCustomFilters(surveyFilters.customFilters);
      const vid = isArrayValueExists(surveyFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          const data = surveyFilters.customFilters.filter(
            (item) => parseInt(item.value) !== parseInt(vid),
          );
          // setCustomFilters(data);
          // setValueArray(data);
          // dispatch(getSurveyFilters(data));
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [surveyFilters]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = surveyFilters.customFilters
        ? queryGeneratorWithUtc(
          surveyFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getSurveyCount(
          companies,
          appModels.SURVEY,
          customFiltersList,
          globalFilter,
        ),
      );
    }
  }, [userInfo, surveyFilters.customFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getSurveyFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (deleteInfo && deleteInfo.data) {
      const customFiltersList = surveyFilters.customFilters ? queryGeneratorWithUtc(surveyFilters.customFilters, false, userInfo.data) : '';
      dispatch(getSurveyList(companies, appModels.SURVEY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
      dispatch(getSurveyCount(companies, appModels.SURVEY, customFiltersList));
    }
  }, [deleteInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((surveyUpdateInfo && surveyUpdateInfo.data) || (updatePartsOrderInfo && updatePartsOrderInfo.data))) {
      const customFiltersList = surveyFilters.customFilters ? queryGeneratorWithUtc(surveyFilters.customFilters, false, userInfo.data) : '';
      dispatch(getSurveyList(companies, appModels.SURVEY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [surveyUpdateInfo, updatePartsOrderInfo]);

  useEffect(() => {
    if (
      !addVisitRequestModal
      && history.location
      && history.location.state
      && history.location.state.referrer
    ) {
      if (history.location.state.referrer === 'add-request') {
        showAddVisitRequestModal(true);
      } else if (history.location.state.referrer === 'view-request') {
        const { uuid } = history.location.state;
        const filters = [
          {
            key: 'uuid',
            value: uuid,
            label: 'UUID',
            type: 'text',
          },
        ];
        dispatch(getSurveyFilters(filters));
      }
    }
  }, [history]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getStatus(companies, appModels.SURVEYSTAGE));
    }
  }, [userInfo]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = surveyFilters.customFilters
        ? queryGeneratorWithUtc(
          surveyFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getSurveyList(
          companies,
          appModels.SURVEY,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [
    userInfo,
    offset,
    sortedValue.sortBy,
    sortedValue.sortField,
    surveyFilters.customFilters,
  ]);

  useEffect(() => {
    if (userInfo && userInfo.data && (surveyCount && surveyCount.length) && startExport) {
      const offsetValue = 0;
      // setPdfBody([]);
      const customFiltersList = surveyFilters.customFilters
        ? queryGeneratorWithUtc(surveyFilters.customFilters)
        : '';
      // const rows = surveyRows.rows ? surveyRows.rows : [];
      dispatch(
        getSurveyListExport(
          companies,
          appModels.SURVEY,
          surveyCount.length,
          offsetValue,
          apiFields,
          customFiltersList,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  /*  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getSurveyRows(payload));
  }, [checkedRows]); */

  useEffect(() => {
    if (viewId) {
      dispatch(getSurveyDetail(viewId, appModels.SURVEY));
    }
  }, [viewId]);

  /* useEffect(() => {
     if (
       (updatePartsOrderInfo && updatePartsOrderInfo.data)
     ) {
       dispatch(getSurveyDetail(viewId, appModels.SURVEY));
     }
   }, [updatePartsOrderInfo]); */

  useEffect(() => {
    if (
      deleteAnsweresInfo
      && deleteAnsweresInfo.data
      && removeIds
      && removeIds.length
      && removeId
    ) {
      dispatch(getDelete(removeId, appModels.SURVEY));
    }
  }, [deleteAnsweresInfo]);

  const totalDataCount = surveyCount && surveyCount.length ? surveyCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  useEffect(() => {
    if (
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

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
      setCheckRows(
        checkedRows.filter((item) => parseInt(item) !== parseInt(value)),
      );
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = surveyListInfo && surveyListInfo.data ? surveyListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = surveyListInfo && surveyListInfo.data ? surveyListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
      },
    ];
    if (checked) {
      const oldCustomFilters = surveyFilters && surveyFilters.customFilters
        ? surveyFilters.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ]);
      dispatch(getSurveyFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };
  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        Header: value,
        id: value,
      },
    ];

    const oldCustomFilters = surveyFilters && surveyFilters.customFilters
      ? surveyFilters.customFilters
      : [];
    const customFilters1 = [
      ...(oldCustomFilters.length > 0
        ? oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        )
        : ''),
      ...filters,
    ];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getSurveyFilters(customFilters1));

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
          Header: value,
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = surveyFilters && surveyFilters.customFilters
        ? surveyFilters.customFilters
        : [];
      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getSurveyFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = surveyFilters && surveyFilters.customFilters
        ? surveyFilters.customFilters
        : [];
      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getSurveyFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChangeold = (startDate, endDate) => {
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
        },
      ];
    }
    // const value = 'Custom';
    // const filters = [{
    //   key: value, value, label: value, type: 'customdate', start, end,
    // }];
    if (start && end) {
      const oldCustomFilters = surveyFilters && surveyFilters.customFilters
        ? surveyFilters.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getSurveyFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(surveyListInfo && surveyListInfo.data && surveyListInfo.data.length && surveyListInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(surveyListInfo && surveyListInfo.data && surveyListInfo.data.length && surveyListInfo.data[surveyListInfo.data.length - 1].id);
    }
  }, [surveyListInfo]);

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

  const handleCustomFilterClose = (value, cf) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter(
      (item) => item.value !== value,
    );
    dispatch(getSurveyFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const handleTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'category_type',
          title: 'Type',
          value,
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      removeData('data-category_type');
      dispatch(getSurveyFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter(
        (item) => item.value !== value,
      );
      dispatch(getSurveyFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'stage_id',
          title: 'Status',
          value: name,
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      removeData('data-stage_id');
      dispatch(getSurveyFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter(
        (item) => item.value !== value,
      );
      dispatch(getSurveyFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  useEffect(() => {
    if (statusGroupInfo && statusGroupInfo.data) {
      setStatusGroups(statusGroupInfo.data);
    }
  }, [statusGroupInfo]);

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getSurveyFilters([]));
    setOffset(0);
    setPage(0);
  };

  const addVisitRequestWindow = () => {
    showAddVisitRequestModal(true);
  };

  const closeDrawer = () => {
    dispatch(resetUpdateSurvey());
    dispatch(resetAddSurvey());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    showAddVisitRequestModal(false);
    setAddLink(false);
  };

  const onAnswerReset = () => {
    setAnswerModal(false);
  };
  const onSummaryReset = () => {
    setSummaryModal(false);
  };
  const onViewReset = () => {
    if (viewAnswers) {
      setViewAnswers(false);
    } else {
      setOffset(offset);
      setPage(currentPage);
      setViewId(0);
      setViewModal(false);
      dispatch(resetUpdateSurvey());
      dispatch(resetAddSurvey());
      dispatch(resetStorePages([]));
      dispatch(resetPageData([]));
      dispatch(resetDeleteAnswers());
      dispatch(resetStoreQuestions());
      setEdit(false);
      setEditId(false);
    }
  };

  const onEditOpen = () => {
    setEditId(
      surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
        ? surveyDetails.data[0].id
        : false,
    );
    setEdit(!isEdit);
  };

  const closeEditModalWindow = () => {
    dispatch(resetUpdateSurvey());
    dispatch(resetAddSurvey());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    setEdit(false);
    setEditId(false);
  };

  const onReset = () => {
    dispatch(resetAddSurvey());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    setAddLink(false);
  };

  const onRemoveData = (ids, id) => {
    if (ids && ids.length) {
      dispatch(getDeleteAnswers(removeIds, appModels.SURVEYUSERINPUTS));
    } else {
      dispatch(getDelete(id, appModels.SURVEY));
    }
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    dispatch(resetDeleteAnswers());
    showDeleteModal(false);
  };

  const stateValuesList = surveyFilters
      && surveyFilters.customFilters
      && surveyFilters.customFilters.length > 0
    ? surveyFilters.customFilters.filter((item) => item.type === 'inarray')
    : [];
  const surveyTypeValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = surveyFilters
      && surveyFilters.customFilters
      && surveyFilters.customFilters.length > 0
    ? surveyFilters.customFilters
    : [];
  const loading = (userInfo && userInfo.loading)
    || (surveyListInfo && surveyListInfo.loading)
    || surveyCountLoading;

  const onClickRemoveData = (id, name, state, ids) => {
    if (state && state.length > 0 && state[1] !== 'Draft') {
      setModalAlert(true);
    } else {
      setRemoveId(id);
      setRemoveIds(ids);
      setRemoveName(name);
      showDeleteModal(true);
    }
  };

  const isStatusEditable = surveyDetails
    && surveyDetails.data
    && surveyDetails.data.length
    && surveyDetails.data[0].stage_id
    && surveyDetails.data[0].stage_id.length > 0
    && surveyDetails.data[0].stage_id[1] === 'Draft';

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
          datefield: key.datefield,
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
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getSurveyFilters(customFiltersList));
      // dispatch(getSurveyFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getSurveyFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
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
    const fields = [
      'title',
      'stage_id',
      'uuid',
      'category_type',
    ];
    let query = '"|","|","|",';

    const oldCustomFilters = surveyFilters && surveyFilters.customFilters
      ? surveyFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0
      ? oldCustomFilters.filter(
        (item) => item.type === 'date' || item.type === 'customdate',
      )
      : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
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
        dispatch(getSurveyFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getSurveyFilters(customFilters));
    }
    const filtersData = data.items && data.items.length && data.items.length > 0 ? JSON.parse(JSON.stringify(data?.items)) : [];
    const typeField = filtersData && filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'category_type');
    if ((typeField || typeField !== -1 || typeField === 0)) {
      filtersData[typeField].value = filtersData[typeField].value === 'e' ? 'Equipment' : 'Space';
    }
    setFilterText(formatFilterData(filtersData, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [surveyFilters],
  );

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Survey');

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, surveyNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, surveyNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(surveyNav && surveyNav.data && surveyNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/survey/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Survey',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Survey',
        moduleName: 'Survey',
        menuName: '',
        link: '/survey',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      {/* <Header
        headerPath="Survey"
        nextPath=""
        pathLink="/survey"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          surveyListInfo && surveyListInfo.data ? surveyListInfo.data : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Survey List"
        exportFileName="Survey"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={surveyExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Add Survey']),
          text: 'Add',
          func: () => setAddLink(true),
        }}
        filters={filterText}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={surveyListInfo && surveyListInfo.loading}
        err={surveyListInfo && surveyListInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setAnswerModal={setAnswerModal}
        setSummaryModal={setSummaryModal}
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
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName="Add Survey"
          imagePath={SurveyIcon}
          onClose={() => {
            closeDrawer();
            dispatch(setPageData([]));
          }}
        />
        {/*    <CreateList name="Add Survey" showCreateModal={addVisitRequestWindow} setAddLink={setAddLink} /> */}
        <AddSurvey
          editId={false}
          onClose={closeDrawer}
          afterReset={() => {
            onReset();
          }}
          response={addSurveyInfo}
        />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '95%' },
        }}
        anchor="right"
        open={answerModal}
      >
        <DrawerHeader
          headerName={`View Answers - ${surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
            ? truncate(surveyDetails.data[0].title, 35)
            : ''}`}
          onClose={() => {
            onAnswerReset();
          }}
        />

        <AnswerDetails
          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
          closeDrawer={() => {
            setAnswerModal(false);
            setViewModal(true);
          }}
          viewId={viewId}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '95%' },
        }}
        anchor="right"
        open={summaryModal}
      >
        <DrawerHeader
          headerName={`Answers Summary - ${surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
            ? truncate(surveyDetails.data[0].title, 35)
            : 'Survey'}`}
          onClose={() => {
            onSummaryReset();
          }}
        />
        <AnswersReport viewId={viewId} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '95%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={
            surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
              ? truncate(surveyDetails.data[0].title, 35)
              : 'Survey'
          }
          imagePath={false}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', surveyListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', surveyListInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', surveyListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', surveyListInfo));
          }}
          onClose={() => {
            onViewReset();
          }}
        />

        {/*  <DrawerHeaderSurvey
               title={surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? truncate(surveyDetails.data[0].title, 35) : 'Survey'}
               imagePath={false}
               setViewModal={setViewModal}
               afterReset={() => { setViewAnswers(true); }}
               viewAnswers={viewAnswers}
               isEditable={!viewAnswers && isEditable && isStatusEditable && (surveyDetails && !surveyDetails.loading)}
               closeDrawer={() => { onViewReset(); }}
               onEdit={() => { onEditOpen(); }}
               onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', surveyListInfo)); }}
               onNext={() => { setViewId(getNextPreview(viewId, 'Next', surveyListInfo)); }}
              /> */}
        <SurveyDetail viewAnswers={viewAnswers} />
      </Drawer>
    </Box>
  );
};

export default Survey;
